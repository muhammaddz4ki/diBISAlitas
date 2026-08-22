import 'package:flutter/foundation.dart';
import 'package:camera/camera.dart';
import '../services/bijalan_camera_service.dart';
import '../services/bijalan_tflite_service.dart';
import '../services/bijalan_tts_service.dart';
import '../core/utils/bijalan_yolo_parser.dart';

class BijalanDetectionProvider extends ChangeNotifier {
  final BijalanCameraService _cameraService = BijalanCameraService();
  final BijalanTFLiteService _tfliteService = BijalanTFLiteService();
  final BijalanTTSService _ttsService = BijalanTTSService();

  bool _isInit = false;
  bool _disposed = false;
  List<BijalanParseResult> _results = [];
  String? _error;

  CameraController? get cameraController => _cameraService.controller;
  bool get isInit => _isInit;
  List<BijalanParseResult> get results => _results;
  String? get error => _error;
  int get modelInputSize => _tfliteService.modelInputSize;
  double get ttsSpeed => _ttsService.baseSpeed;

  Future<void> setTtsSpeed(double speed) async {
    await _ttsService.setBaseSpeed(speed);
    notifyListeners();
  }

  Future<void> initializeAll() async {
    try {
      debugPrint("DEBUG [BijalanDetectionProvider]: Memulai inisialisasi...");
      if (kIsWeb) {
        _error = "YOLOv8 TFLite tidak didukung di Web. Gunakan versi Next.js.";
        notifyListeners();
        return;
      }
      
      String modelPath = 'assets/Machine Learning/model_indoor_obstacle_detect.tflite';
          
      debugPrint("DEBUG [BijalanDetectionProvider]: Memuat model $modelPath...");
      await _tfliteService.loadModel(modelPath);
      
      debugPrint("DEBUG [BijalanDetectionProvider]: Memulai inisialisasi kamera...");
      await _cameraService.initializeCamera(_onFrameAvailable).timeout(
        const Duration(seconds: 15),
        onTimeout: () {
          throw Exception("Kamera tidak merespon.");
        },
      );

      _isInit = true;
      if (!_disposed) notifyListeners();
    } catch (e) {
      debugPrint("DEBUG [BijalanDetectionProvider]: Error inisialisasi: $e");
      _error = "Gagal inisialisasi: $e";
      if (!_disposed) notifyListeners();
    }
  }

  Future<void> _onFrameAvailable(CameraImage image) async {
    if (_disposed || !_tfliteService.isLoaded) return;

    try {
      final inputTensor = await _cameraService.processImageInIsolate(
        image, 
        _tfliteService.modelInputSize,
        _tfliteService.isNchw,
      );

      if (inputTensor == null) return;

      final result = await _tfliteService.runInference(inputTensor);

      _results = result ?? [];

      if (_disposed) return;

      if (_results.isNotEmpty) {
        // Trigger TTS & Haptic
        _ttsService.speakDetections(_results);
      }
      
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
    _ttsService.cancel();
    super.dispose();
  }
}
