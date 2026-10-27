/**
 * diBISAlitas AI Motion Capture Avatar Renderer
 * ─────────────────────────────────────────────
 * Menggambar karakter avatar bergaya modern yang bergerak PERSIS
 * mengikuti koordinat sendi tubuh, tangan, dan wajah hasil deteksi
 * Google MediaPipe Holistic AI dari setiap frame video.
 *
 * Setiap titik sendi avatar (bahu, siku, pergelangan, jari, mata, mulut)
 * diposisikan langsung dari data landmark nyata — bukan preset statis.
 */

import {
  MocapFrameData,
  Point2D,
  HandLandmarks,
} from "./motionCaptureEngine";

// ── Palet Warna Avatar ──
const SKIN       = "#F0C4A0";
const SKIN_DARK  = "#D4A574";
const SHIRT      = "#00B894";
const SHIRT_DARK = "#009B7D";
const HAIR       = "#3D3D3D";
const EYE_COLOR  = "#2D3436";
const LIP_COLOR  = "#E17055";
const JOINT_DOT  = "#FDCB6E";
const BG_TOP     = "#E8F4F1";
const BG_BOT     = "#D0EBE3";

// ── Utilitas Privat ──

export interface AvatarBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/** Hitung bounding box semua landmark untuk auto-crop & centering */
export function computeBounds(data: MocapFrameData): AvatarBounds {
  const pts: Point2D[] = [];
  const p = data.pose;
  pts.push(p.nose, p.neck, p.leftShoulder, p.rightShoulder,
    p.leftElbow, p.rightElbow, p.leftWrist, p.rightWrist,
    p.sternum, p.stomach);

  const f = data.face;
  pts.push(f.noseTip, f.chin, f.leftEye, f.rightEye, f.mouthCenter);

  const addHand = (h?: HandLandmarks) => {
    if (!h) return;
    pts.push(h.wrist);
    [h.thumb, h.index, h.middle, h.ring, h.pinky].forEach(chain =>
      chain.forEach(j => pts.push(j))
    );
  };
  addHand(data.rightHand);
  addHand(data.leftHand);

  let minX = 1, maxX = 0, minY = 1, maxY = 0;
  for (const pt of pts) {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  // Padding proporsional di sekeliling agar tidak terpotong
  const padX = Math.max(0.04, (maxX - minX) * 0.18);
  const padY = Math.max(0.04, (maxY - minY) * 0.12);
  return {
    minX: Math.max(0, minX - padX),
    maxX: Math.min(1, maxX + padX),
    minY: Math.max(0, minY - padY * 1.6), // ekstra ruang atas untuk kepala/rambut
    maxY: Math.min(1, maxY + padY),
  };
}

// ────────────────────────────────────────────────────────────────
// FUNGSI UTAMA: Menggambar avatar bergerak sesuai pose terdeteksi
// ────────────────────────────────────────────────────────────────

export function drawStylizedAvatar(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  data: MocapFrameData,
  frameLabel?: string,
  customBounds?: AvatarBounds,
) {
  // 0. Background gradien neumorphic
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, BG_TOP);
  bg.addColorStop(1, BG_BOT);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Pola grid halus untuk kedalaman
  ctx.strokeStyle = "rgba(0,0,0,0.025)";
  ctx.lineWidth = 0.5;
  for (let gy = 0; gy < h; gy += 16) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
  }

  // 1. Auto-crop: gunakan customBounds (stabil antar-frame) atau hitung per-frame
  const bounds = customBounds || computeBounds(data);
  const bw = bounds.maxX - bounds.minX || 0.5;
  const bh = bounds.maxY - bounds.minY || 0.7;

  // Skalakan agar karakter mengisi ~90% kanvas sambil mempertahankan aspek rasio
  const scaleX = (w * 0.92) / bw;
  const scaleY = (h * 0.92) / bh;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = (w - bw * scale) / 2 - bounds.minX * scale;
  const offsetY = (h - bh * scale) / 2 - bounds.minY * scale;

  /** Konversi koordinat ternormalisasi (0..1) → piksel kanvas */
  const px = (p: Point2D): { x: number; y: number } => ({
    x: p.x * scale + offsetX,
    y: p.y * scale + offsetY,
  });

  // Ukuran referensi (jarak bahu) untuk menyesuaikan ketebalan garis
  const lSh = px(data.pose.leftShoulder);
  const rSh = px(data.pose.rightShoulder);
  const shoulderDist = Math.sqrt((rSh.x - lSh.x) ** 2 + (rSh.y - lSh.y) ** 2);
  const unit = Math.max(3, shoulderDist * 0.06); // satuan skala

  // ── Helper menggambar ──

  const drawLine = (a: { x: number; y: number }, b: { x: number; y: number }, color: string, lineW: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineW;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };

  const drawDot = (p: { x: number; y: number }, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawSmoothLimb = (
    a: { x: number; y: number },
    b: { x: number; y: number },
    color: string,
    thickness: number,
    shadowColor?: string,
  ) => {
    // Shadow / bayangan halus di belakang
    if (shadowColor) {
      ctx.strokeStyle = shadowColor;
      ctx.lineWidth = thickness + 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(a.x + 1, a.y + 1);
      ctx.lineTo(b.x + 1, b.y + 1);
      ctx.stroke();
    }
    drawLine(a, b, color, thickness);
  };

  // ── 2. TORSO (Baju) ──
  const neck  = px(data.pose.neck);
  const stern = px(data.pose.sternum);
  const stom  = px(data.pose.stomach);

  ctx.fillStyle = SHIRT;
  ctx.beginPath();
  ctx.moveTo(lSh.x, lSh.y);
  ctx.lineTo(rSh.x, rSh.y);
  // Torso melebar sedikit ke bawah
  const hipW = shoulderDist * 0.15;
  ctx.lineTo(rSh.x + hipW * 0.3, stom.y);
  ctx.lineTo(lSh.x - hipW * 0.3, stom.y);
  ctx.closePath();
  ctx.fill();
  // Garis kerah baju
  ctx.strokeStyle = SHIRT_DARK;
  ctx.lineWidth = unit * 0.4;
  ctx.beginPath();
  ctx.moveTo(lSh.x, lSh.y);
  ctx.lineTo(neck.x, neck.y + unit);
  ctx.lineTo(rSh.x, rSh.y);
  ctx.stroke();

  // ── 3. LENGAN ──
  const lEl = px(data.pose.leftElbow);
  const rEl = px(data.pose.rightElbow);
  const lWr = px(data.pose.leftWrist);
  const rWr = px(data.pose.rightWrist);
  const armThick = unit * 3.2;
  const foreThick = unit * 2.6;

  // Lengan atas
  drawSmoothLimb(lSh, lEl, SKIN, armThick, SKIN_DARK);
  drawSmoothLimb(rSh, rEl, SKIN, armThick, SKIN_DARK);
  // Lengan bawah
  drawSmoothLimb(lEl, lWr, SKIN, foreThick, SKIN_DARK);
  drawSmoothLimb(rEl, rWr, SKIN, foreThick, SKIN_DARK);

  // Titik sendi siku
  drawDot(lEl, unit * 1.1, JOINT_DOT);
  drawDot(rEl, unit * 1.1, JOINT_DOT);

  // ── 4. TANGAN & JARI ──
  const drawFingers = (hand: HandLandmarks | undefined, fallbackWrist: { x: number; y: number }) => {
    const wPx = hand ? px(hand.wrist) : fallbackWrist;

    // Telapak tangan (lingkaran halus)
    drawDot(wPx, unit * 1.8, SKIN);
    drawDot(wPx, unit * 1.8, SKIN_DARK + "44");

    if (!hand) {
      // Tangan rileks alami ketika detail jari istirahat/tersembunyi
      drawDot({ x: wPx.x, y: wPx.y + unit * 0.8 }, unit * 1.2, SKIN);
      return;
    }

    const fingers = [hand.thumb, hand.index, hand.middle, hand.ring, hand.pinky];
    const tipColors = [LIP_COLOR, JOINT_DOT, "#00B894", "#74B9FF", "#A29BFE"];

    fingers.forEach((joints, fi) => {
      let prev = wPx;
      for (let ji = 0; ji < joints.length; ji++) {
        const cur = px(joints[ji]);
        const isTip = ji === joints.length - 1;
        const thick = isTip ? unit * 0.9 : unit * 1.2;

        drawLine(prev, cur, SKIN, thick);

        if (isTip) {
          drawDot(cur, unit * 0.7, tipColors[fi]);
        } else {
          drawDot(cur, unit * 0.45, "#FFFFFF99");
        }
        prev = cur;
      }
    });
  };

  drawFingers(data.rightHand, rWr);
  drawFingers(data.leftHand, lWr);

  // ── 5. LEHER ──
  const chin = px(data.face.chin);
  drawSmoothLimb(chin, neck, SKIN, unit * 3, SKIN_DARK);

  // ── 6. KEPALA ──
  const noseP  = px(data.face.noseTip);
  const lEyeP  = px(data.face.leftEye);
  const rEyeP  = px(data.face.rightEye);
  const mouthP = px(data.face.mouthCenter);

  const eyeDist = Math.sqrt((rEyeP.x - lEyeP.x) ** 2 + (rEyeP.y - lEyeP.y) ** 2);
  const headR = Math.max(eyeDist * 1.35, unit * 5);
  const headCX = (lEyeP.x + rEyeP.x) / 2;
  const headCY = (lEyeP.y + noseP.y) / 2 - headR * 0.12;

  // Rambut / hijab (setengah lingkaran gelap di atas)
  ctx.fillStyle = HAIR;
  ctx.beginPath();
  ctx.ellipse(headCX, headCY - headR * 0.08, headR * 1.15, headR * 1.1, 0, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill();

  // Kepala kulit
  ctx.fillStyle = SKIN;
  ctx.beginPath();
  ctx.arc(headCX, headCY, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = SKIN_DARK + "66";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Mata
  const eyeR = Math.max(1.8, headR * 0.1);
  // Putih mata
  drawDot(lEyeP, eyeR * 1.3, "#FFFFFF");
  drawDot(rEyeP, eyeR * 1.3, "#FFFFFF");
  // Iris
  drawDot(lEyeP, eyeR, EYE_COLOR);
  drawDot(rEyeP, eyeR, EYE_COLOR);
  // Kilau
  drawDot({ x: lEyeP.x - eyeR * 0.3, y: lEyeP.y - eyeR * 0.3 }, eyeR * 0.35, "#FFFFFF");
  drawDot({ x: rEyeP.x - eyeR * 0.3, y: rEyeP.y - eyeR * 0.3 }, eyeR * 0.35, "#FFFFFF");

  // Hidung
  drawDot(noseP, Math.max(1.2, headR * 0.06), SKIN_DARK + "88");

  // Mulut — gunakan lip contour jika tersedia
  const ml = px(data.face.mouthLeft);
  const mr = px(data.face.mouthRight);
  const ul = px(data.face.upperLip);
  const ll = px(data.face.lowerLip);

  ctx.fillStyle = LIP_COLOR;
  ctx.beginPath();
  ctx.moveTo(ml.x, ml.y);
  ctx.quadraticCurveTo(ul.x, ul.y - headR * 0.04, mr.x, mr.y);
  ctx.quadraticCurveTo(ll.x, ll.y + headR * 0.04, ml.x, ml.y);
  ctx.closePath();
  ctx.fill();

  // ── 7. TITIK SENDI BAHU ──
  drawDot(lSh, unit * 1.3, SHIRT_DARK);
  drawDot(rSh, unit * 1.3, SHIRT_DARK);

  // Titik sendi pergelangan tangan
  drawDot(lWr, unit * 1, JOINT_DOT);
  drawDot(rWr, unit * 1, JOINT_DOT);

  // ── 8. WATERMARK ──
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.font = `bold ${Math.max(6, w * 0.028)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("diBISAlitas AI Mocap", w / 2, h - Math.max(4, h * 0.025));

  // Label frame (opsional)
  if (frameLabel) {
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.font = `${Math.max(5, w * 0.022)}px monospace`;
    ctx.textAlign = "left";
    ctx.fillText(frameLabel, 4, h - Math.max(4, h * 0.025));
  }
}
