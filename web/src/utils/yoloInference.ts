import {
  SignLabel,
  CONFIDENCE_THRESHOLD,
} from "../constants/signLabels";

export interface DetectionResult {
  box: [number, number, number, number]; // [xCenter, yCenter, width, height] dalam skala 640x640
  score: number;
  label: SignLabel;
}

/**
 * Menghitung IoU (Intersection over Union) antara dua bounding box
 * untuk menentukan seberapa besar area tumpang tindih.
 *
 * @param boxA Box pertama [xCenter, yCenter, width, height]
 * @param boxB Box kedua [xCenter, yCenter, width, height]
 * @returns Rasio IoU antara 0.0 (tidak overlap) hingga 1.0 (identik)
 */
function computeIoU(
  boxA: [number, number, number, number],
  boxB: [number, number, number, number]
): number {
  const [axc, ayc, aw, ah] = boxA;
  const [bxc, byc, bw, bh] = boxB;

  const ax1 = axc - aw / 2, ay1 = ayc - ah / 2;
  const ax2 = axc + aw / 2, ay2 = ayc + ah / 2;
  const bx1 = bxc - bw / 2, by1 = byc - bh / 2;
  const bx2 = bxc + bw / 2, by2 = byc + bh / 2;

  const ix1 = Math.max(ax1, bx1);
  const iy1 = Math.max(ay1, by1);
  const ix2 = Math.min(ax2, bx2);
  const iy2 = Math.min(ay2, by2);

  const interW = Math.max(0, ix2 - ix1);
  const interH = Math.max(0, iy2 - iy1);
  const interArea = interW * interH;

  const areaA = aw * ah;
  const areaB = bw * bh;
  const unionArea = areaA + areaB - interArea;

  return unionArea > 0 ? interArea / unionArea : 0;
}

/**
 * Menerapkan Non-Maximum Suppression (NMS) pada array hasil deteksi.
 * Menghilangkan bounding box duplikat yang sangat overlap (IoU > threshold).
 *
 * @param detections Array DetectionResult yang sudah lolos confidence threshold
 * @param iouThreshold Batas IoU untuk menganggap dua box sebagai duplikat (default: 0.5)
 * @returns Array DetectionResult yang sudah difilter
 */
function nonMaxSuppression(
  detections: DetectionResult[],
  iouThreshold: number = 0.5
): DetectionResult[] {
  // Urutkan dari skor tertinggi ke terendah
  const sorted = [...detections].sort((a, b) => b.score - a.score);
  const kept: DetectionResult[] = [];

  for (const det of sorted) {
    let shouldKeep = true;
    for (const existing of kept) {
      if (computeIoU(det.box, existing.box) > iouThreshold) {
        shouldKeep = false;
        break;
      }
    }
    if (shouldKeep) {
      kept.push(det);
    }
  }

  return kept;
}

/**
 * Membaca matriks flat output dari YOLOv8 secara dinamis (mendukung format
 * [1, 33, 8400] atau [1, 8400, 33]) dan mengekstrak semua Bounding Box
 * dengan probabilitas melebihi threshold, difilter melalui NMS.
 *
 * Dimensi tensor dideteksi otomatis melalui heuristic `isTransposed`:
 * - Jika dim[1] < dim[2] → format [1, 33, 8400] (transposed, atribut di dim 1)
 * - Jika dim[1] > dim[2] → format [1, 8400, 33] (normal, box di dim 1)
 *
 * @param data Array Float32 murni dari output tensor YOLOv8
 * @param outDims Dimensi output tensor, misalnya [1, 33, 8400]
 * @param confidenceThreshold Batas minimal probabilitas deteksi
 * @returns Array DetectionResult setelah NMS, atau array kosong jika tidak ada
 */
export function parseDynamicTensor(
  data: Float32Array,
  outDims: readonly number[],
  labels: SignLabel[],
  confidenceThreshold: number = CONFIDENCE_THRESHOLD
): DetectionResult[] {
  // Jika dim[1] lebih kecil dari dim[2], misal [1, 33, 8400] -> transposed
  const isTransposed = outDims[1] < outDims[2];

  const numAttrs = isTransposed ? outDims[1] : outDims[2];
  const numBoxes = isTransposed ? outDims[2] : outDims[1];
  const numClasses = labels.length;

  const candidates: DetectionResult[] = [];

  // Dynamic Tensor Parsing
  for (let c = 0; c < numBoxes; c++) {
    let maxClassScore = 0;
    let classId = -1;

    // Index 0-3 adalah bounding box [x, y, w, h]
    // Index 4 hingga (numAttrs-1) adalah probabilitas untuk setiap kelas
    for (let r = 4; r < numAttrs; r++) {
      const idx = isTransposed ? r * numBoxes + c : c * numAttrs + r;
      const score = data[idx];
      if (score > maxClassScore) {
        maxClassScore = score;
        classId = r - 4;
      }
    }

    if (maxClassScore > confidenceThreshold && classId >= 0 && classId < numClasses) {
      const xcIdx = isTransposed ? 0 * numBoxes + c : c * numAttrs + 0;
      const ycIdx = isTransposed ? 1 * numBoxes + c : c * numAttrs + 1;
      const wIdx  = isTransposed ? 2 * numBoxes + c : c * numAttrs + 2;
      const hIdx  = isTransposed ? 3 * numBoxes + c : c * numAttrs + 3;

      candidates.push({
        box: [data[xcIdx], data[ycIdx], data[wIdx], data[hIdx]],
        score: maxClassScore,
        label: labels[classId],
      });
    }
  }

  // Terapkan NMS untuk menghilangkan box duplikat yang overlap
  return nonMaxSuppression(candidates);
}
