import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:camera/camera.dart';
import 'package:image/image.dart' as img;

/// Wrapper Data untuk melempar bit CameraImage murni ke dalam Isolate
class IsolateData {
  final List<Uint8List> planeBytes;
  final List<int> planeStrides;
  final List<int> planePixelStrides;
  final int width;
  final int height;
  final int modelInputSize;
  final bool isNchw;

  IsolateData({
    required this.planeBytes,
    required this.planeStrides,
    required this.planePixelStrides,
    required this.width,
    required this.height,
    required this.modelInputSize,
    required this.isNchw,
  });
}

/// Fungsi murni (Top-Level) untuk dijalankan di Background Isolate.
/// Mengekstrak YUV420 ke dalam Nested 4D List RGB yang diwajibkan oleh TFLite C++.
List<List<List<List<double>>>> _processImage(IsolateData data) {
  final int size = data.modelInputSize;
  final bool isNchw = data.isNchw;

  final width = data.width;
  final height = data.height;

  img.Image image = img.Image(width: width, height: height);

  final yPlane = data.planeBytes[0];
  final uPlane = data.planeBytes[1];
  final vPlane = data.planeBytes[2];

  final yStride = data.planeStrides[0];
  final uStride = data.planeStrides[1];
  final vStride = data.planeStrides[2];

  final uvPixelStride = data.planePixelStrides[1];

  for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
      final yIndex = y * yStride + x;
      final uvIndex = (y ~/ 2) * uStride + (x ~/ 2) * uvPixelStride;

      final yp = yPlane[yIndex];
      final up = uPlane[uvIndex];
      final vp = vPlane[uvIndex];

      int r = (yp + 1.402 * (vp - 128)).round();
      int g = (yp - 0.344136 * (up - 128) - 0.714136 * (vp - 128)).round();
      int b = (yp + 1.772 * (up - 128)).round();

      r = r.clamp(0, 255);
      g = g.clamp(0, 255);
      b = b.clamp(0, 255);

      image.setPixelRgb(x, y, r, g, b);
    }
  }

  // Kamera Android merekam dengan rotasi 90 derajat untuk kamera belakang
  if (Platform.isAndroid) {
    image = img.copyRotate(image, angle: 90);
  }

  img.Image resized = img.copyResize(image,
      width: size, height: size, interpolation: img.Interpolation.linear);

  List<List<List<List<double>>>> inputTensor;
  
  if (isNchw) {
    inputTensor = List.generate(
        1,
        (b) => List.generate(3,
            (c) => List.generate(size, (y) => List.filled(size, 0.0))));
  } else {
    inputTensor = List.generate(
        1,
        (b) => List.generate(size,
            (y) => List.generate(size, (x) => List.filled(3, 0.0))));
  }

  for (int y = 0; y < size; y++) {
    for (int x = 0; x < size; x++) {
      // Tanpa Horizontal Flip karena Kamera Belakang
      final pixel = resized.getPixel(x, y);
      
      if (isNchw) {
        inputTensor[0][0][y][x] = pixel.r / 255.0;
        inputTensor[0][1][y][x] = pixel.g / 255.0;
        inputTensor[0][2][y][x] = pixel.b / 255.0;
      } else {
        inputTensor[0][y][x][0] = pixel.r / 255.0;
        inputTensor[0][y][x][1] = pixel.g / 255.0;
        inputTensor[0][y][x][2] = pixel.b / 255.0;
      }
    }
  }

  return inputTensor;
}

class BijalanCameraService {
  CameraController? _controller;
  bool _isProcessing = false;

  CameraController? get controller => _controller;

  Future<void> initializeCamera(Function(CameraImage) onFrameAvailable) async {
    final cameras = await availableCameras();
    if (cameras.isEmpty) return;

    final backCamera = cameras.firstWhere(
      (camera) => camera.lensDirection == CameraLensDirection.back,
      orElse: () => cameras.first,
    );

    _controller = CameraController(
      backCamera,
      ResolutionPreset.max,
      enableAudio: false,
      imageFormatGroup: Platform.isAndroid
          ? ImageFormatGroup.yuv420
          : ImageFormatGroup.bgra8888,
    );

    await _controller!.initialize();
    
    _controller!.startImageStream((CameraImage image) {
      if (!_isProcessing) {
        _isProcessing = true;
        onFrameAvailable(image).then((_) {
          _isProcessing = false;
        });
      }
    });
  }

  Future<List<List<List<List<double>>>>?> processImageInIsolate(
    CameraImage image, 
    int inputSize,
    bool isNchw,
  ) async {
    if (image.format.group != ImageFormatGroup.yuv420) return null;

    final isolateData = IsolateData(
      planeBytes: image.planes.map((p) => p.bytes).toList(),
      planeStrides: image.planes.map((p) => p.bytesPerRow).toList(),
      planePixelStrides: image.planes.map((p) => p.bytesPerPixel ?? 1).toList(),
      width: image.width,
      height: image.height,
      modelInputSize: inputSize,
      isNchw: isNchw,
    );

    try {
      return await compute(_processImage, isolateData);
    } catch (e) {
      debugPrint("Error in compute: $e");
      return null;
    }
  }

  void dispose() {
    _controller?.stopImageStream();
    _controller?.dispose();
    _controller = null;
  }
}
