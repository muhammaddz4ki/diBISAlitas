import 'package:flutter/foundation.dart';
import '../constants/bisindo_labels.dart';

/// Data Wrapper untuk melempar output YOLOv8 Bisindo ke fungsi Isolate
class BisindoParseData {
  final List<List<List<double>>> output;
  final List<int> shape;
  final List<BisindoSignLabel> labels;

  BisindoParseData(this.output, this.shape, this.labels);
}

/// Model hasil deteksi
class BisindoParseResult {
  final double score;
  final int classId;
  final List<double> box;
  final BisindoSignLabel label;

  BisindoParseResult(this.score, this.classId, this.box, this.label);
}

/// Fungsi murni (Top-Level) untuk dijalankan di Background Isolate.
/// Mendecode Flat Matrix Tensor output TFLite YOLOv8 ke dalam satu Bounding Box terbaik.
///
/// Mendukung format tensor dinamis:
/// - [1, 52, 8400] (transposed — atribut di dim 1, box di dim 2)
/// - [1, 8400, 52] (normal — box di dim 1, atribut di dim 2)
///
/// Heuristic: jika shape[1] < shape[2], berarti transposed.
BisindoParseResult? parseBisindoYoloOutput(BisindoParseData data) {
  final output = data.output;
  final shape = data.shape;
  final labels = data.labels;

  // Deteksi orientasi tensor secara dinamis:
  // Jika dim[1] lebih kecil dari dim[2], atribut (52) ada di dim[1] → transposed
  final bool isTransposed = shape[1] < shape[2];

  // Hitung jumlah atribut dan box secara dinamis dari tensor shape
  final int numAttrs = isTransposed ? shape[1] : shape[2];
  final int numBoxes = isTransposed ? shape[2] : shape[1];
  final int numClasses = numAttrs - 4; // Tergantung model (48)

  double bestScore = 0.0;
  int bestClass = -1;
  List<double> bestBox = [];
  int countPassThreshold = 0;
  
  double absoluteHighestScore = 0.0; // Untuk debug skor mentah

  for (int c = 0; c < numBoxes; c++) {
    double maxClassScore = 0.0;
    int classId = -1;

    // Index 4 hingga (numAttrs-1) adalah skor kelas
    for (int r = 4; r < numAttrs; r++) {
      double score = isTransposed ? output[0][r][c] : output[0][c][r];
      if (score > maxClassScore) {
        maxClassScore = score;
        classId = r - 4;
      }
    }
    
    if (maxClassScore > absoluteHighestScore) {
      absoluteHighestScore = maxClassScore;
    }

    // Filter berdasarkan confidence threshold dari constants
    if (maxClassScore > kBisindoConfidenceThreshold &&
        classId >= 0 &&
        classId < numClasses) {
      
      countPassThreshold++;

      if (maxClassScore > bestScore) {
        bestScore = maxClassScore;
        bestClass = classId;

        // Index 0 hingga 3 adalah struktur Bounding Box: [x_center, y_center, width, height]
        double xc = isTransposed ? output[0][0][c] : output[0][c][0];
        double yc = isTransposed ? output[0][1][c] : output[0][c][1];
        double w = isTransposed ? output[0][2][c] : output[0][c][2];
        double h = isTransposed ? output[0][3][c] : output[0][c][3];

        bestBox = [xc, yc, w, h];
      }
    }
  }

  if (kDebugMode) {
    debugPrint("DEBUG [BisindoYoloParser]: Shape: $shape (isTransposed=$isTransposed). Total grid: $numBoxes. Lolos threshold ($kBisindoConfidenceThreshold): $countPassThreshold");
    debugPrint("DEBUG [BisindoYoloParser]: ABSOLUTE HIGHEST SCORE MENTAH: $absoluteHighestScore");
  }

  // Jika ada kotak valid yang ditemukan dan melampaui Threshold
  if (bestScore > 0.0 &&
      bestBox.length == 4 &&
      bestClass >= 0 &&
      bestClass < labels.length) {
    return BisindoParseResult(
      bestScore,
      bestClass,
      bestBox,
      labels[bestClass],
    );
  }
  
  if (kDebugMode && bestScore == 0.0) {
    debugPrint("DEBUG [BisindoYoloParser]: Tidak ada box yang valid menjadi the best result.");
  }
  return null;
}
