import 'dart:math';
import '../constants/bijalan_indoor_classes.dart';

class BijalanParseData {
  final List<List<List<double>>> output;
  final List<int> shape;

  BijalanParseData(this.output, this.shape);
}

class BijalanParseResult {
  final double score;
  final int classId;
  final List<double> box; // [xc, yc, w, h]
  final String label;
  final double area;

  BijalanParseResult(this.score, this.classId, this.box, this.label, this.area);
}

double computeIoU(List<double> boxA, List<double> boxB) {
  double axc = boxA[0], ayc = boxA[1], aw = boxA[2], ah = boxA[3];
  double bxc = boxB[0], byc = boxB[1], bw = boxB[2], bh = boxB[3];

  double ax1 = axc - aw / 2, ay1 = ayc - ah / 2;
  double ax2 = axc + aw / 2, ay2 = ayc + ah / 2;
  double bx1 = bxc - bw / 2, by1 = byc - bh / 2;
  double bx2 = bxc + bw / 2, by2 = byc + bh / 2;

  double ix1 = max(ax1, bx1);
  double iy1 = max(ay1, by1);
  double ix2 = min(ax2, bx2);
  double iy2 = min(ay2, by2);

  double interW = max(0.0, ix2 - ix1);
  double interH = max(0.0, iy2 - iy1);
  double interArea = interW * interH;

  double areaA = aw * ah;
  double areaB = bw * bh;
  double unionArea = areaA + areaB - interArea;

  return unionArea > 0 ? interArea / unionArea : 0.0;
}

List<BijalanParseResult> nonMaxSuppression(List<BijalanParseResult> detections, {double iouThreshold = 0.5}) {
  // Sort by score descending
  detections.sort((a, b) => b.score.compareTo(a.score));
  List<BijalanParseResult> kept = [];

  for (var det in detections) {
    bool shouldKeep = true;
    for (var existing in kept) {
      if (computeIoU(det.box, existing.box) > iouThreshold) {
        shouldKeep = false;
        break;
      }
    }
    if (shouldKeep) {
      kept.add(det);
    }
  }

  return kept;
}

/// Fungsi murni (Top-Level) untuk dijalankan di Background Isolate.
List<BijalanParseResult> parseBijalanYoloOutput(BijalanParseData data) {
  final output = data.output;
  final shape = data.shape;
  const double confidenceThreshold = 0.4;

  final bool isTransposed = shape[1] < shape[2];

  final int numAttrs = isTransposed ? shape[1] : shape[2];
  final int numBoxes = isTransposed ? shape[2] : shape[1];
  final int numClasses = numAttrs - 4; // 80 for COCO

  List<BijalanParseResult> candidates = [];

  for (int c = 0; c < numBoxes; c++) {
    double maxClassScore = 0.0;
    int classId = -1;

    for (int r = 4; r < numAttrs; r++) {
      double score = isTransposed ? output[0][r][c] : output[0][c][r];
      if (score > maxClassScore) {
        maxClassScore = score;
        classId = r - 4;
      }
    }

    if (maxClassScore > confidenceThreshold && BijalanIndoorClasses.isIndoorClass(classId)) {
      double xc = isTransposed ? output[0][0][c] : output[0][c][0];
      double yc = isTransposed ? output[0][1][c] : output[0][c][1];
      double w = isTransposed ? output[0][2][c] : output[0][c][2];
      double h = isTransposed ? output[0][3][c] : output[0][c][3];

      double area = w * h;
      String label = BijalanIndoorClasses.getLabel(classId) ?? "Unknown";

      candidates.add(BijalanParseResult(maxClassScore, classId, [xc, yc, w, h], label, area));
    }
  }

  // NMS filtering
  List<BijalanParseResult> nmsResults = nonMaxSuppression(candidates);

  // Sort by area descending (largest first)
  nmsResults.sort((a, b) => b.area.compareTo(a.area));

  return nmsResults;
}

/// Ringkasan panduan navigasi untuk HUD & suara: rintangan paling genting,
/// arah (kiri/depan/kanan), dan level jarak (0=terpantau, 1=dekat, 2=sangat dekat).
class BijalanGuidance {
  final bool hasObstacle;
  final String label;
  final String direction; // 'kiri' | 'depan' | 'kanan'
  final int level; // 0,1,2

  const BijalanGuidance({
    required this.hasObstacle,
    required this.label,
    required this.direction,
    required this.level,
  });
}

/// Hitung rintangan paling genting = kombinasi kedekatan (rasio area) dan
/// berada di jalur (dekat pusat frame).
BijalanGuidance computeBijalanGuidance(
  List<BijalanParseResult> detections, {
  double frame = 640.0,
}) {
  if (detections.isEmpty) {
    return const BijalanGuidance(
        hasObstacle: false, label: '', direction: 'depan', level: 0);
  }

  BijalanParseResult? target;
  double bestUrgency = 0;
  for (final d in detections) {
    final areaRatio = d.area / (frame * frame);
    final cx = d.box[0] / frame;
    final centerBonus = (1 - (cx - 0.5).abs() * 2).clamp(0.0, 1.0);
    final urgency = areaRatio * (0.6 + 0.4 * centerBonus);
    if (urgency > bestUrgency) {
      bestUrgency = urgency;
      target = d;
    }
  }

  final t = target!;
  final areaRatio = t.area / (frame * frame);
  final level = areaRatio > 0.35 ? 2 : (areaRatio > 0.15 ? 1 : 0);
  final cx = t.box[0] / frame;
  final dir = cx < 0.38 ? 'kiri' : (cx > 0.62 ? 'kanan' : 'depan');

  return BijalanGuidance(
      hasObstacle: true, label: t.label, direction: dir, level: level);
}
