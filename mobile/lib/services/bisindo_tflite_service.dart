import 'package:flutter/foundation.dart';
import 'package:tflite_flutter/tflite_flutter.dart';
import '../core/utils/bisindo_yolo_parser.dart';
import '../core/constants/bisindo_labels.dart';

/// Layanan (Service) yang diisolasi murni untuk mengatur instansiasi Model TFLite YOLOv8 Bisindo.
/// Tidak ada kaitannya dengan UI atau Kamera.
class BisindoTFLiteService {
  Interpreter? _interpreter;
  int _modelInputSize = 640;
  bool _isNchw = false;
  
  bool get isLoaded => _interpreter != null;
  int get modelInputSize => _modelInputSize;
  bool get isNchw => _isNchw;

  /// Memuat model TFLite dari folder assets dan merampas (grab) shape ukuran aslinya.
  Future<void> loadModel(String modelPath) async {
    try {
      _interpreter = await Interpreter.fromAsset(modelPath);
      
      // Deteksi dinamis shape input model, contoh: [1, 640, 640, 3] -> 640
      final inputTensor = _interpreter!.getInputTensor(0);
      final inputShape = inputTensor.shape;
      
      // Deteksi dinamis NCHW vs NHWC
      // Jika dimensi channel (3) ada di index 1, berarti NCHW [1, 3, 640, 640]
      if (inputShape[1] == 3) {
        _isNchw = true;
        _modelInputSize = inputShape[2]; // 640
      } else {
        _isNchw = false;
        _modelInputSize = inputShape[1]; // 640
      }
      
      debugPrint("DEBUG [BisindoTFLiteService]: Model Loaded! Input Shape: $inputShape, Type: ${inputTensor.type}, isNchw: $_isNchw, size: $_modelInputSize");
    } catch (e) {
      debugPrint("Gagal memuat model TFLite: $e");
      rethrow;
    }
  }

  /// Menjalankan inferensi dan mendecode array output menggunakan Background Isolate.
  Future<BisindoParseResult?> runInference(
      List<List<List<List<double>>>> inputTensor, List<BisindoSignLabel> labels) async {
    if (_interpreter == null) return null;

    try {
      // 1. Inisialisasi tensor output dengan dinamis berdasarkan dimensi model asli
      final shape = _interpreter!.getOutputTensor(0).shape;
      dynamic output;
      
      if (shape.length == 3) {
        output = List.generate(
          shape[0],
          (_) => List.generate(
            shape[1],
            (_) => List.filled(shape[2], 0.0)
          )
        );
      }

      // 2. Eksekusi Jantung C++ TFLite di Main Thread (Sangat Cepat)
      debugPrint("DEBUG [BisindoTFLiteService]: Memulai run() TFLite...");
      _interpreter!.run(inputTensor, output);
      debugPrint("DEBUG [BisindoTFLiteService]: Selesai run(). Output shape awal (array): $shape");

      // 3. Decoding List hasil TFLite kembali di Background Isolate 
      //    untuk mencegah frame UI patah-patah (Jank).
      final parseData = BisindoParseData(output as List<List<List<double>>>, shape, labels);
      final result = await compute(parseBisindoYoloOutput, parseData);

      return result;
    } catch (e) {
      debugPrint("Gagal menjalankan inferensi: $e");
      return null;
    }
  }

  /// Membebaskan memori C++ Pointer ketika layanan dimatikan
  void dispose() {
    _interpreter?.close();
    _interpreter = null;
  }
}
