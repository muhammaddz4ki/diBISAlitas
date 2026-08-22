import 'package:flutter/foundation.dart';
import 'package:tflite_flutter/tflite_flutter.dart';
import '../core/utils/bijalan_yolo_parser.dart';

class BijalanTFLiteService {
  Interpreter? _interpreter;
  int _modelInputSize = 640;
  bool _isNchw = false;
  
  bool get isLoaded => _interpreter != null;
  int get modelInputSize => _modelInputSize;
  bool get isNchw => _isNchw;

  Future<void> loadModel(String modelPath) async {
    try {
      _interpreter = await Interpreter.fromAsset(modelPath);
      
      final inputTensor = _interpreter!.getInputTensor(0);
      final inputShape = inputTensor.shape;
      
      if (inputShape[1] == 3) {
        _isNchw = true;
        _modelInputSize = inputShape[2]; // 640
      } else {
        _isNchw = false;
        _modelInputSize = inputShape[1]; // 640
      }
      
      debugPrint("DEBUG [BijalanTFLiteService]: Model Loaded! Input Shape: $inputShape, Type: ${inputTensor.type}, isNchw: $_isNchw, size: $_modelInputSize");
    } catch (e) {
      debugPrint("Gagal memuat model TFLite: $e");
      rethrow;
    }
  }

  Future<List<BijalanParseResult>?> runInference(
      List<List<List<List<double>>>> inputTensor) async {
    if (_interpreter == null) return null;

    try {
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

      _interpreter!.run(inputTensor, output);

      final parseData = BijalanParseData(output as List<List<List<double>>>, shape);
      final result = await compute(parseBijalanYoloOutput, parseData);

      return result;
    } catch (e) {
      debugPrint("Gagal menjalankan inferensi: $e");
      return null;
    }
  }

  void dispose() {
    _interpreter?.close();
    _interpreter = null;
  }
}
