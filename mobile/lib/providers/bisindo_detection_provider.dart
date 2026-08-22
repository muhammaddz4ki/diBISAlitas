import 'package:flutter/foundation.dart';
import 'package:camera/camera.dart';
import '../services/bisindo_camera_service.dart';
import '../services/bisindo_tflite_service.dart';
import '../core/utils/bisindo_yolo_parser.dart';
import '../core/constants/bisindo_labels.dart';

/// Orkestrator State Management untuk mengintegrasikan BisindoCameraService dan BisindoTFLiteService
/// Tidak mengandung komputasi Image Processing atau Tensor Math murni.
class BisindoDetectionProvider extends ChangeNotifier {
  final BisindoCameraService _cameraService = BisindoCameraService();
  final BisindoTFLiteService _tfliteService = BisindoTFLiteService();

  bool _isInit = false;
  bool _disposed = false;
  BisindoParseResult? _bestResult;
  String? _error;

  CameraController? get cameraController => _cameraService.controller;
  bool get isInit => _isInit;
  BisindoParseResult? get bestResult => _bestResult;
  String? get error => _error;
  int get modelInputSize => _tfliteService.modelInputSize;

  /// Memulai layanan secara paralel: Kamera dan Model AI
  Future<void> initializeAll() async {
    try {
      debugPrint("DEBUG [BisindoDetectionProvider]: Memulai inisialisasi...");
      if (kIsWeb) {
        _error = "YOLOv8 TFLite tidak didukung di Web. Gunakan versi Next.js.";
        notifyListeners();
        return;
      }
      
      String modelPath = 'assets/Machine Learning/model_bisindo_detect.tflite';
          
      debugPrint("DEBUG [BisindoDetectionProvider]: Memuat model $modelPath...");
      await _tfliteService.loadModel(modelPath);
      debugPrint("DEBUG [BisindoDetectionProvider]: Model berhasil dimuat!");
      
      debugPrint("DEBUG [BisindoDetectionProvider]: Memulai inisialisasi kamera...");
      await _cameraService.initializeCamera(_onFrameAvailable).timeout(
        const Duration(seconds: 15),
        onTimeout: () {
          throw Exception("Kamera tidak merespon (Hardware HP menolak akses AI stream).");
        },
      );
      debugPrint("DEBUG [BisindoDetectionProvider]: Kamera berhasil diinisialisasi!");

      _isInit = true;
      if (!_disposed) notifyListeners();
    } catch (e) {
      debugPrint("DEBUG [BisindoDetectionProvider]: Error inisialisasi: $e");
      _error = "Gagal inisialisasi: $e";
      if (!_disposed) notifyListeners();
    }
  }

  /// Membalik kamera depan / belakang
  Future<void> toggleCamera() async {
    try {
      await _cameraService.switchCamera(_onFrameAvailable);
      notifyListeners();
    } catch (e) {
      debugPrint("Gagal ganti kamera: $e");
    }
  }

  /// Callback setiap kali kamera menghasilkan frame baru
  Future<void> _onFrameAvailable(CameraImage image) async {
    if (_disposed || !_tfliteService.isLoaded) return;

    try {
      // 1. Suruh Camera Service untuk membentuk tensor input 4D List via Isolate
      final inputTensor = await _cameraService.processImageInIsolate(
        image, 
        _tfliteService.modelInputSize,
        _tfliteService.isNchw,
      );

      if (inputTensor == null) return;

      final List<BisindoSignLabel> labels = bisindoLabelsData;

      // 2. Suruh TFLite Service untuk melakukan inferensi dan parsing 
      final result = await _tfliteService.runInference(inputTensor, labels);

      // 3. Update State UI
      _bestResult = result;
      
      if (_disposed) return;
      
      notifyListeners();
    } catch (e) {
      debugPrint("Error pipeline frame: $e");
    }
  }

  @override
  void dispose() {
    _disposed = true;
    _cameraService.dispose();
    _tfliteService.dispose();
    super.dispose();
  }
}
