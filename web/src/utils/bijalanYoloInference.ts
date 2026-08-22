import { isIndoorClass, INDOOR_CLASSES_SUBSET } from "../lib/bijalanIndoorClasses";

export const BIJALAN_CONFIDENCE_THRESHOLD = 0.4;

export interface BijalanDetectionResult {
  box: [number, number, number, number]; // [xCenter, yCenter, width, height]
  score: number;
  classId: number;
  label: string;
  area: number;
}

export interface BijalanGuidance {
  hasObstacle: boolean;
  label: string;
  direction: "kiri" | "depan" | "kanan";
  level: number; // 0=terpantau, 1=dekat, 2=sangat dekat
}

/**
 * Ringkasan panduan navigasi: rintangan paling GENTING (kedekatan × berada di jalur),
 * arah, dan level jarak. Dipakai untuk HUD & konsisten dengan panduan suara.
 */
export function computeBijalanGuidance(
  detections: BijalanDetectionResult[],
  frame = 640
): BijalanGuidance {
  if (detections.length === 0) {
    return { hasObstacle: false, label: "", direction: "depan", level: 0 };
  }
  let target: BijalanDetectionResult | null = null;
  let bestUrgency = 0;
  for (const d of detections) {
    const areaRatio = d.area / (frame * frame);
    const cx = d.box[0] / frame;
    const centerBonus = Math.max(0, 1 - Math.abs(cx - 0.5) * 2);
    const urgency = areaRatio * (0.6 + 0.4 * centerBonus);
    if (urgency > bestUrgency) {
      bestUrgency = urgency;
      target = d;
    }
  }
  const t = target as BijalanDetectionResult;
  const areaRatio = t.area / (frame * frame);
  const level = areaRatio > 0.35 ? 2 : areaRatio > 0.15 ? 1 : 0;
  const cx = t.box[0] / frame;
  const direction = cx < 0.38 ? "kiri" : cx > 0.62 ? "kanan" : "depan";
  return { hasObstacle: true, label: t.label, direction, level };
}

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

function nonMaxSuppression(
  detections: BijalanDetectionResult[],
  iouThreshold: number = 0.5
): BijalanDetectionResult[] {
  const sorted = [...detections].sort((a, b) => b.score - a.score);
  const kept: BijalanDetectionResult[] = [];

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

export function parseBijalanDynamicTensor(
  data: Float32Array,
  outDims: readonly number[],
  confidenceThreshold: number = BIJALAN_CONFIDENCE_THRESHOLD
): BijalanDetectionResult[] {
  const isTransposed = outDims[1] < outDims[2];

  const numAttrs = isTransposed ? outDims[1] : outDims[2];
  const numBoxes = isTransposed ? outDims[2] : outDims[1];
  const numClasses = numAttrs - 4; // Should be 80 for COCO

  const candidates: BijalanDetectionResult[] = [];

  for (let c = 0; c < numBoxes; c++) {
    let maxScore = -1;
    let maxClassId = -1;

    for (let i = 0; i < numClasses; i++) {
      const idx = isTransposed ? (4 + i) * numBoxes + c : c * numAttrs + (4 + i);
      const score = data[idx];
      if (score > maxScore) {
        maxScore = score;
        maxClassId = i;
      }
    }

    if (maxScore > confidenceThreshold && isIndoorClass(maxClassId)) {
      const xIdx = isTransposed ? 0 * numBoxes + c : c * numAttrs + 0;
      const yIdx = isTransposed ? 1 * numBoxes + c : c * numAttrs + 1;
      const wIdx = isTransposed ? 2 * numBoxes + c : c * numAttrs + 2;
      const hIdx = isTransposed ? 3 * numBoxes + c : c * numAttrs + 3;

      const xc = data[xIdx];
      const yc = data[yIdx];
      const w = data[wIdx];
      const h = data[hIdx];

      candidates.push({
        box: [xc, yc, w, h],
        score: maxScore,
        classId: maxClassId,
        label: INDOOR_CLASSES_SUBSET[maxClassId],
        area: w * h,
      });
    }
  }

  const nmsResults = nonMaxSuppression(candidates);

  // Urutkan dari bounding box terbesar ke terkecil
  return nmsResults.sort((a, b) => b.area - a.area);
}
