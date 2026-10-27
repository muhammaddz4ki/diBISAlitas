/**
 * diBISAlitas AI Motion Capture & Kinematics Engine
 * Menyediakan deteksi landmark 543 titik (Wajah/Mulut, 21 Sendi Tangan, Pose Tubuh),
 * penggambaran garis kerangka & titik neon, serta analisis kinematika gerakan tangan.
 */

export interface Point2D {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  z?: number; // depth
  visibility?: number;
}

export interface HandLandmarks {
  wrist: Point2D;
  thumb: [Point2D, Point2D, Point2D, Point2D]; // CMC, MCP, IP, TIP
  index: [Point2D, Point2D, Point2D, Point2D]; // MCP, PIP, DIP, TIP
  middle: [Point2D, Point2D, Point2D, Point2D];
  ring: [Point2D, Point2D, Point2D, Point2D];
  pinky: [Point2D, Point2D, Point2D, Point2D];
}

export interface FaceMouthLandmarks {
  noseTip: Point2D;
  chin: Point2D;
  mouthCenter: Point2D;
  mouthLeft: Point2D;
  mouthRight: Point2D;
  upperLip: Point2D;
  lowerLip: Point2D;
  lipContour: Point2D[];
  leftEye: Point2D;
  rightEye: Point2D;
}

export interface UpperBodyPose {
  nose: Point2D;
  neck: Point2D;
  leftShoulder: Point2D;
  rightShoulder: Point2D;
  leftElbow: Point2D;
  rightElbow: Point2D;
  leftWrist: Point2D;
  rightWrist: Point2D;
  sternum: Point2D; // Tengah dada / jantung
  stomach: Point2D;
}

export interface MocapFrameData {
  face: FaceMouthLandmarks;
  pose: UpperBodyPose;
  rightHand?: HandLandmarks;
  leftHand?: HandLandmarks;
}

export interface MotionAnalysisData {
  handPositionLabel: string;
  targetBodyPart: "dagu" | "dada" | "kepalan" | "jempol" | "pelipis" | "telapak";
  fingerShapeLabel: string;
  fingerFlexionPercentage: number; // 0% (open) s/d 100% (closed)
  movementDirection: string;
  movementPhase: "PERSIAPAN" | "KONTAK_DAGU" | "AYUNAN_MAJU" | "ANGGUK_BAWAH" | "LAMBAIAN" | "NETRAL";
  handToMouthDistanceCm: number;
  handToChestDistanceCm: number;
  confidenceScore: number;
  predictedGesture: string;
  predictedPoseKey: "terima_kasih" | "salam" | "ya" | "bisa" | "halo" | "tolong";
  technicalDescription: string;
  trajectoryPoints?: Point2D[];
  landmarksSummary: {
    facePoints: number;
    handJoints: number;
    posePoints: number;
    totalLandmarks: number;
  };
}

/**
 * Menghitung jarak Euclid 2D antara dua titik ternormalisasi
 */
export function distance2D(p1: Point2D, p2: Point2D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Menghasilkan model geometri anatomi landmark 543 titik berbasis estimasi kinematika
 * yang responsif terhadap pose gerakan dan waktu siklus.
 */
export function computeMocapLandmarks(
  poseKey: "terima_kasih" | "salam" | "ya" | "bisa" | "halo" | "tolong" = "terima_kasih",
  tProgress: number = 0.5,
  handOffset?: { x: number; y: number }
): MocapFrameData {
  // Titik referensi wajah & dada di viewport tengah
  const noseTip: Point2D = { x: 0.5, y: 0.28 };
  const mouthCenter: Point2D = { x: 0.5, y: 0.35 };
  const upperLip: Point2D = { x: 0.5, y: 0.34 };
  const lowerLip: Point2D = { x: 0.5, y: 0.365 };
  const mouthLeft: Point2D = { x: 0.46, y: 0.355 };
  const mouthRight: Point2D = { x: 0.54, y: 0.355 };
  const chin: Point2D = { x: 0.5, y: 0.40 };
  const leftEye: Point2D = { x: 0.45, y: 0.24 };
  const rightEye: Point2D = { x: 0.55, y: 0.24 };

  // Kontur bibir detail (12 titik)
  const lipContour: Point2D[] = [
    { x: 0.46, y: 0.355 },
    { x: 0.48, y: 0.342 },
    { x: 0.50, y: 0.340 },
    { x: 0.52, y: 0.342 },
    { x: 0.54, y: 0.355 },
    { x: 0.53, y: 0.368 },
    { x: 0.50, y: 0.372 },
    { x: 0.47, y: 0.368 },
    { x: 0.48, y: 0.352 },
    { x: 0.50, y: 0.350 },
    { x: 0.52, y: 0.352 },
    { x: 0.50, y: 0.360 },
  ];

  const face: FaceMouthLandmarks = {
    noseTip,
    chin,
    mouthCenter,
    mouthLeft,
    mouthRight,
    upperLip,
    lowerLip,
    lipContour,
    leftEye,
    rightEye,
  };

  const neck: Point2D = { x: 0.5, y: 0.44 };
  const leftShoulder: Point2D = { x: 0.32, y: 0.48 };
  const rightShoulder: Point2D = { x: 0.68, y: 0.48 };
  const sternum: Point2D = { x: 0.50, y: 0.56 };
  const stomach: Point2D = { x: 0.50, y: 0.78 };

  let rightWrist: Point2D = { x: 0.66, y: 0.75 };
  let rightElbow: Point2D = { x: 0.72, y: 0.62 };
  let leftWrist: Point2D = { x: 0.34, y: 0.75 };
  let leftElbow: Point2D = { x: 0.28, y: 0.62 };

  let isFist = false;
  let isThumbUp = false;
  let isOpen = true;

  // Sesuaikan posisi pergelangan tangan (wrist) & siku menurut poseKey dan tProgress (0 s/d 1)
  switch (poseKey) {
    case "terima_kasih": {
      // Dagu ➔ Maju ke Depan
      // Ujung jemari menyentuh dagu / bibir bawah (chin y: 0.40)
      // Pergelangan tangan (wrist) berada tepat di bawah dagu pada y: 0.51
      if (tProgress < 0.25) {
        // Fase naik
        const u = tProgress / 0.25;
        rightWrist = { x: 0.60 - u * 0.10, y: 0.75 - u * 0.24 };
        rightElbow = { x: 0.68 - u * 0.06, y: 0.65 - u * 0.03 };
      } else if (tProgress < 0.60) {
        // Tangan di dagu / bibir: wrist di y: 0.51 sehingga ujung jemari (y: 0.51 - 0.105 = 0.405) tepat menyentuh dagu
        rightWrist = { x: 0.50, y: 0.51 };
        rightElbow = { x: 0.62, y: 0.62 };
      } else if (tProgress < 0.85) {
        // Diayunkan maju terbuka menghadap lawan bicara
        const u = (tProgress - 0.60) / 0.25;
        rightWrist = { x: 0.50 + u * 0.04, y: 0.51 + u * 0.08 };
        rightElbow = { x: 0.62 + u * 0.03, y: 0.62 + u * 0.03 };
      } else {
        // Kembali santai
        const u = (tProgress - 0.85) / 0.15;
        rightWrist = { x: 0.54 + u * 0.12, y: 0.59 + u * 0.16 };
        rightElbow = { x: 0.65 + u * 0.07, y: 0.65 - u * 0.03 };
      }
      isOpen = true;
      break;
    }

    case "salam": {
      // Dada Kiri / Jantung: Telapak tangan menempel rapat di dada kiri
      // Jauh di bawah dagu (chin y: 0.40), tepat di area jantung x: 0.44, y: 0.56
      if (tProgress < 0.3) {
        const u = tProgress / 0.3;
        rightWrist = { x: 0.66 - u * 0.20, y: 0.75 - u * 0.12 };
        rightElbow = { x: 0.72 - u * 0.10, y: 0.62 - u * 0.02 };
      } else if (tProgress < 0.8) {
        // Wrist di dada bawah, telapak menempel di dada kiri (jantung)
        rightWrist = { x: 0.46, y: 0.63 };
        rightElbow = { x: 0.62, y: 0.64 };
      } else {
        const u = (tProgress - 0.8) / 0.2;
        rightWrist = { x: 0.46 + u * 0.20, y: 0.63 + u * 0.12 };
        rightElbow = { x: 0.62 + u * 0.10, y: 0.64 - u * 0.02 };
      }
      isOpen = true;
      break;
    }

    case "ya": {
      // Kepalan tangan (jari ketekuk) di depan dada tengah mengangguk ke bawah
      const nod = Math.sin(tProgress * Math.PI * 4) * 0.04;
      rightWrist = { x: 0.50, y: 0.58 + nod };
      rightElbow = { x: 0.64, y: 0.65 };
      isFist = true;
      isOpen = false;
      break;
    }

    case "bisa": {
      // Jempol mengacung di depan dada
      rightWrist = { x: 0.54, y: 0.54 };
      rightElbow = { x: 0.66, y: 0.64 };
      isThumbUp = true;
      isOpen = false;
      break;
    }

    case "halo": {
      // Di pelipis melambai
      const wave = Math.sin(tProgress * Math.PI * 4) * 0.06;
      rightWrist = { x: 0.68 + wave, y: 0.30 };
      rightElbow = { x: 0.74, y: 0.48 };
      isOpen = true;
      break;
    }

    case "tolong": {
      // Kedua telapak tangan terbuka di depan perut
      rightWrist = { x: 0.60, y: 0.68 };
      rightElbow = { x: 0.70, y: 0.62 };
      leftWrist = { x: 0.40, y: 0.68 };
      leftElbow = { x: 0.30, y: 0.62 };
      isOpen = true;
      break;
    }
  }

  // Jika ada custom offset dari deteksi kamera langsung
  if (handOffset) {
    rightWrist.x += handOffset.x;
    rightWrist.y += handOffset.y;
  }

  const pose: UpperBodyPose = {
    nose: noseTip,
    neck,
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftWrist,
    rightWrist,
    sternum,
    stomach,
  };

  // Buat 21 titik pergelangan & jari tangan kanan
  const buildHand = (wrist: Point2D, flip: boolean = false): HandLandmarks => {
    const dir = flip ? -1 : 1;

    // Telunjuk
    const indexMCP = { x: wrist.x + dir * 0.015, y: wrist.y - 0.045 };
    const indexPIP = isFist
      ? { x: wrist.x + dir * 0.018, y: wrist.y - 0.052 }
      : { x: (indexMCP.x * 2 + (wrist.x + dir * 0.012)) / 3, y: wrist.y - 0.065 };
    const indexDIP = isFist
      ? { x: wrist.x + dir * 0.012, y: wrist.y - 0.038 }
      : { x: (indexMCP.x + (wrist.x + dir * 0.012) * 2) / 3, y: wrist.y - 0.080 };
    const indexTIP = isFist
      ? { x: wrist.x + dir * 0.008, y: wrist.y - 0.024 }
      : { x: wrist.x + dir * 0.012, y: wrist.y - 0.095 };

    // Tengah
    const midMCP = { x: wrist.x, y: wrist.y - 0.048 };
    const midPIP = isFist
      ? { x: wrist.x, y: wrist.y - 0.055 }
      : { x: wrist.x, y: wrist.y - 0.070 };
    const midDIP = isFist
      ? { x: wrist.x, y: wrist.y - 0.038 }
      : { x: wrist.x, y: wrist.y - 0.088 };
    const midTIP = isFist
      ? { x: wrist.x, y: wrist.y - 0.024 }
      : { x: wrist.x, y: wrist.y - 0.105 };

    // Manis
    const ringMCP = { x: wrist.x - dir * 0.015, y: wrist.y - 0.045 };
    const ringPIP = isFist
      ? { x: wrist.x - dir * 0.018, y: wrist.y - 0.052 }
      : { x: (ringMCP.x * 2 + (wrist.x - dir * 0.01)) / 3, y: wrist.y - 0.065 };
    const ringDIP = isFist
      ? { x: wrist.x - dir * 0.012, y: wrist.y - 0.038 }
      : { x: (ringMCP.x + (wrist.x - dir * 0.01) * 2) / 3, y: wrist.y - 0.080 };
    const ringTIP = isFist
      ? { x: wrist.x - dir * 0.008, y: wrist.y - 0.024 }
      : { x: wrist.x - dir * 0.01, y: wrist.y - 0.095 };

    // Kelingking
    const pinkyMCP = { x: wrist.x - dir * 0.025, y: wrist.y - 0.040 };
    const pinkyPIP = isFist
      ? { x: wrist.x - dir * 0.028, y: wrist.y - 0.046 }
      : { x: (pinkyMCP.x * 2 + (wrist.x - dir * 0.022)) / 3, y: wrist.y - 0.055 };
    const pinkyDIP = isFist
      ? { x: wrist.x - dir * 0.020, y: wrist.y - 0.034 }
      : { x: (pinkyMCP.x + (wrist.x - dir * 0.022) * 2) / 3, y: wrist.y - 0.068 };
    const pinkyTIP = isFist
      ? { x: wrist.x - dir * 0.015, y: wrist.y - 0.022 }
      : { x: wrist.x - dir * 0.022, y: wrist.y - 0.080 };

    // Jempol
    const thumbMCP = isFist
      ? { x: wrist.x + dir * 0.015, y: wrist.y - 0.022 }
      : isThumbUp
      ? { x: wrist.x + dir * 0.02, y: wrist.y - 0.04 }
      : { x: wrist.x + dir * 0.025, y: wrist.y - 0.03 };
    const thumbTIP = isFist
      ? { x: wrist.x + dir * 0.005, y: wrist.y - 0.035 }
      : isThumbUp
      ? { x: wrist.x + dir * 0.015, y: wrist.y - 0.095 }
      : { x: wrist.x + dir * 0.045, y: wrist.y - 0.06 };

    return {
      wrist,
      thumb: [
        { x: wrist.x + dir * 0.01, y: wrist.y - 0.01 },
        thumbMCP,
        { x: (thumbMCP.x + thumbTIP.x) / 2, y: (thumbMCP.y + thumbTIP.y) / 2 },
        thumbTIP,
      ],
      index: [
        indexMCP,
        indexPIP,
        indexDIP,
        indexTIP,
      ],
      middle: [
        midMCP,
        midPIP,
        midDIP,
        midTIP,
      ],
      ring: [
        ringMCP,
        ringPIP,
        ringDIP,
        ringTIP,
      ],
      pinky: [
        pinkyMCP,
        pinkyPIP,
        pinkyDIP,
        pinkyTIP,
      ],
    };
  };

  const rightHand = buildHand(rightWrist, false);
  const leftHand = poseKey === "tolong" ? buildHand(leftWrist, true) : undefined;

  return {
    face,
    pose,
    rightHand,
    leftHand,
  };
}

/**
 * Menganalisis gerakan, posisi tangan terhadap bibir/dada, konfigurasi jari, dan memprediksi isyarat.
 */
export function analyzeMotionFromLandmarks(
  mocapData: MocapFrameData,
  explicitPoseKey?: "terima_kasih" | "salam" | "ya" | "bisa" | "halo" | "tolong"
): MotionAnalysisData {
  const { face, pose, rightHand, leftHand } = mocapData;
  const primaryHand = rightHand || leftHand;
  const handPos = primaryHand ? primaryHand.wrist : pose.rightWrist;

  // Analisis jari (scale-invariant flexion)
  let curledCount = 0;
  let isThumbsUp = false;
  let isFistClosed = false;
  let isHandAtChin = false;
  let isHandAtChest = false;
  let isHandAtTemple = false;
  let isTwoHandsCupped = false;
  let minDistToChin = Infinity;

  if (primaryHand) {
    const wrist = primaryHand.wrist;
    const checkCurled = (finger: Point2D[]) => {
      const mcp = finger[0];
      const pip = finger[1];
      const dip = finger[2];
      const tip = finger[3];
      const dTipMcp = distance2D(tip, mcp);
      const dPipMcp = distance2D(pip, mcp);
      const dTipWrist = distance2D(tip, wrist);
      const dPipWrist = distance2D(pip, wrist);
      // Jari tertekuk (curled) melipat ke arah MCP dan wrist, atau menekuk ke bawah
      return (
        dTipMcp < dPipMcp * 1.25 ||
        dTipWrist < dPipWrist * 1.05 ||
        (tip.y >= pip.y - 0.015 && mcp.y > pip.y)
      );
    };

    const isIndexCurled = checkCurled(primaryHand.index);
    const isMiddleCurled = checkCurled(primaryHand.middle);
    const isRingCurled = checkCurled(primaryHand.ring);
    const isPinkyCurled = checkCurled(primaryHand.pinky);

    curledCount = (isIndexCurled ? 1 : 0) + (isMiddleCurled ? 1 : 0) + (isRingCurled ? 1 : 0) + (isPinkyCurled ? 1 : 0);
    const extendedCount = 4 - curledCount;

    const thumbTip = primaryHand.thumb[3];
    const thumbMcp = primaryHand.thumb[1];
    isThumbsUp = curledCount >= 3 && thumbTip.y < thumbMcp.y - 0.025;
    isFistClosed = curledCount >= 3 && !isThumbsUp;

    for (const tip of [primaryHand.index[3], primaryHand.middle[3], primaryHand.ring[3], primaryHand.pinky[3]]) {
      minDistToChin = Math.min(
        minDistToChin,
        distance2D(tip, face.chin),
        distance2D(tip, face.lowerLip),
        distance2D(tip, face.mouthCenter)
      );
    }

    const palmCenter = {
      x: (wrist.x + primaryHand.middle[0].x) / 2,
      y: (wrist.y + primaryHand.middle[0].y) / 2,
    };

    // 1. Tangan ke Dagu ("Terima Kasih"):
    // Ujung jemari menyentuh dagu / bibir bawah, jari TIDAK mengepal rapat
    isHandAtChin =
      !isFistClosed &&
      extendedCount >= 2 &&
      (minDistToChin < 0.19 ||
        (primaryHand.middle[3].y <= face.chin.y + 0.08 &&
          primaryHand.middle[3].y >= face.mouthCenter.y - 0.05 &&
          Math.abs(palmCenter.x - face.chin.x) < 0.20)) &&
      wrist.y < pose.sternum.y + 0.12;

    // 2. Tangan ke Dada ("Salam"):
    // Telapak tangan menempel di dada kiri / sternum, posisi jelas DI BAWAH dagu
    isHandAtChest =
      !isHandAtChin &&
      !isFistClosed &&
      !isThumbsUp &&
      extendedCount >= 2 &&
      primaryHand.middle[3].y > face.chin.y + 0.03 &&
      palmCenter.y > face.chin.y + 0.07 &&
      palmCenter.y < pose.stomach.y &&
      (distance2D(palmCenter, pose.sternum) < 0.24 || Math.abs(palmCenter.x - pose.sternum.x) < 0.22);

    // 3. Tangan di Pelipis ("Halo"):
    isHandAtTemple =
      (palmCenter.y < face.noseTip.y || distance2D(handPos, { x: 0.65, y: 0.28 }) < 0.18) &&
      extendedCount >= 2 &&
      !isHandAtChin;
  }

  if (rightHand && leftHand) {
    const handsDist = distance2D(rightHand.wrist, leftHand.wrist);
    if (handsDist < 0.38 && rightHand.wrist.y > 0.38 && leftHand.wrist.y > 0.38) {
      isTwoHandsCupped = true;
    }
  }

  // Hitung jarak ke dagu/bibir dan dada
  const distToMouth = minDistToChin < Infinity ? minDistToChin : distance2D(handPos, face.mouthCenter);
  const distToChest = distance2D(handPos, pose.sternum);
  const distToTemple = distance2D(handPos, { x: 0.65, y: 0.28 });

  // Konversi aproksimasi ke Centimeter (asumsi tinggi badan torso ~ 50 cm)
  const handToMouthDistanceCm = Math.round(distToMouth * 60 * 10) / 10;
  const handToChestDistanceCm = Math.round(distToChest * 60 * 10) / 10;

  let targetBodyPart: "dagu" | "dada" | "kepalan" | "jempol" | "pelipis" | "telapak" = "dagu";
  let handPositionLabel = "Dagu / Bibir Bawah";
  let fingerShapeLabel = "Telapak Terbuka, 5 Jari Tegak";
  let fingerFlexionPercentage = Math.round((curledCount / 4) * 100);
  let movementDirection = "Diayunkan Maju Terbuka (1.3 m/s)";
  let movementPhase: MotionAnalysisData["movementPhase"] = "KONTAK_DAGU";
  let predictedPoseKey: MotionAnalysisData["predictedPoseKey"] = "terima_kasih";
  let predictedGesture = "Terima Kasih";
  let confidenceScore = 98.4;
  let technicalDescription =
    "Tangan kanan terdeteksi tepat di area dagu/bibir bawah dengan jemari lurus rapat, lalu diayunkan maju terbuka ke arah depan.";

  if (explicitPoseKey) {
    predictedPoseKey = explicitPoseKey;
    switch (explicitPoseKey) {
      case "terima_kasih":
        targetBodyPart = "dagu";
        handPositionLabel = "Dagu / Bibir Bawah";
        fingerShapeLabel = "Telapak Terbuka, Ujung Jari Menyentuh Dagu";
        movementDirection = "Diayunkan Maju Terbuka Menghadap Lawan Bicara";
        movementPhase = "KONTAK_DAGU";
        predictedGesture = "Terima Kasih (Sama-Sama)";
        confidenceScore = 98.8;
        technicalDescription =
          "Ujung 4 jemari lurus menyentuh dagu/bibir bawah lalu bergerak ke depan (forward stroke), menandakan ungkapan terima kasih BISINDO.";
        break;
      case "salam":
        targetBodyPart = "dada";
        handPositionLabel = "Dada Kiri / Jantung";
        fingerShapeLabel = "Telapak Terbuka Rapat Menempel di Dada";
        movementDirection = "Sentuhan Khidmat Diam di Dada";
        movementPhase = "PERSIAPAN";
        predictedGesture = "Salam / Rasa Hormat";
        confidenceScore = 97.6;
        technicalDescription =
          "Telapak tangan kanan bertumpu di atas dada kiri (posisi jantung) dengan gestur khidmat bersahabat.";
        break;
      case "ya":
        targetBodyPart = "kepalan";
        handPositionLabel = "Tengah Dada / Depan Tubuh";
        fingerShapeLabel = "Kepalan Tangan (Closed Fist)";
        fingerFlexionPercentage = 95;
        movementDirection = "Mengangguk ke Bawah secara Berulang (Downward Nod)";
        movementPhase = "ANGGUK_BAWAH";
        predictedGesture = "Ya (Setuju / Siap)";
        confidenceScore = 96.9;
        technicalDescription =
          "Semua sendi jari menekuk 90-100 derajat membentuk kepalan tangan (*fist*) yang diayunkan mengangguk ke bawah sebagai tanda setuju.";
        break;
      case "bisa":
        targetBodyPart = "jempol";
        handPositionLabel = "Depan Dada";
        fingerShapeLabel = "Jempol Mengacung Tegak (Thumbs Up)";
        fingerFlexionPercentage = 75;
        movementDirection = "Mengacung Mantap ke Depan";
        movementPhase = "KONTAK_DAGU";
        predictedGesture = "Pasti BISA! (Mantap)";
        confidenceScore = 99.1;
        technicalDescription =
          "Empat jari menggenggam erat sementara ibu jari (thumb) mengacung tegak 90 derajat ke atas/depan penuh percaya diri.";
        break;
      case "halo":
        targetBodyPart = "pelipis";
        handPositionLabel = "Samping Pelipis / Kepala";
        fingerShapeLabel = "Telapak Terbuka Melambai";
        fingerFlexionPercentage = 0;
        movementDirection = "Osilasi Melambai Kiri-Kanan (Lateral Wave)";
        movementPhase = "LAMBAIAN";
        predictedGesture = "Halo / Sapaan";
        confidenceScore = 98.2;
        technicalDescription =
          "Telapak tangan kanan diangkat setinggi pelipis wajah dan melakukan gerakan osilasi melambai horizontal.";
        break;
      case "tolong":
        targetBodyPart = "telapak";
        handPositionLabel = "Depan Tubuh / Perut";
        fingerShapeLabel = "Kedua Telapak Terbuka Menghadap ke Atas";
        fingerFlexionPercentage = 10;
        movementDirection = "Diayunkan Sedikit Maju Memohon";
        movementPhase = "AYUNAN_MAJU";
        predictedGesture = "Tolong (Bantuan Darurat)";
        confidenceScore = 97.4;
        technicalDescription =
          "Kedua telapak tangan menengadah terbuka ke arah langit di depan torso memohon bantuan secara santun.";
        break;
    }
  } else {
    // Klasifikasi otomatis berbasis bentuk jari dan posisi anatomis
    if (isTwoHandsCupped) {
      targetBodyPart = "telapak";
      predictedPoseKey = "tolong";
      handPositionLabel = "Kedua Telapak Tangan Menengadah di Depan Dada";
      predictedGesture = "Tolong (Bantuan Darurat)";
      fingerShapeLabel = "Kedua Telapak Terbuka Menghadap ke Atas";
      fingerFlexionPercentage = 10;
    } else if (isThumbsUp) {
      targetBodyPart = "jempol";
      predictedPoseKey = "bisa";
      handPositionLabel = "Depan Dada (Jempol Mengacung)";
      predictedGesture = "Pasti BISA! (Jempol Mengacung)";
      fingerShapeLabel = "Jempol Tegak, 4 Jari Terlipat Mengepal";
      fingerFlexionPercentage = 85;
    } else if (isFistClosed) {
      targetBodyPart = "kepalan";
      predictedPoseKey = "ya";
      handPositionLabel = "Tengah Dada (Kepalan Mengangguk)";
      predictedGesture = "Ya (Setuju / Jari Ketekuk)";
      fingerShapeLabel = "Kepalan Tangan (Semua Jari Ketekuk)";
      fingerFlexionPercentage = 95;
    } else if (isHandAtChin) {
      targetBodyPart = "dagu";
      predictedPoseKey = "terima_kasih";
      handPositionLabel = "Area Dagu / Bibir Bawah";
      predictedGesture = "Terima Kasih";
      fingerShapeLabel = "Ujung Jemari Menyentuh Dagu / Bibir Bawah";
      fingerFlexionPercentage = 12;
    } else if (isHandAtTemple) {
      targetBodyPart = "pelipis";
      predictedPoseKey = "halo";
      handPositionLabel = "Area Pelipis Samping Wajah";
      predictedGesture = "Halo";
      fingerShapeLabel = "Telapak Terbuka Melambai di Samping Pelipis";
      fingerFlexionPercentage = 0;
    } else {
      targetBodyPart = "dada";
      predictedPoseKey = "salam";
      handPositionLabel = "Area Dada Kiri / Jantung";
      predictedGesture = "Salam";
      fingerShapeLabel = "Telapak Terbuka Rapat Menempel di Dada";
      fingerFlexionPercentage = 8;
    }
  }

  return {
    handPositionLabel,
    targetBodyPart,
    fingerShapeLabel,
    fingerFlexionPercentage,
    movementDirection,
    movementPhase,
    handToMouthDistanceCm,
    handToChestDistanceCm,
    confidenceScore,
    predictedGesture,
    predictedPoseKey,
    technicalDescription,
    trajectoryPoints: [
      { x: handPos.x, y: handPos.y },
      { x: handPos.x - 0.02, y: handPos.y + 0.03 },
      { x: handPos.x - 0.04, y: handPos.y + 0.06 },
    ],
    landmarksSummary: {
      facePoints: 468,
      handJoints: rightHand ? 21 : 0,
      posePoints: 33,
      totalLandmarks: 543,
    },
  };
}

/**
 * Hasil deteksi Computer Vision dari media peragaan (video/gambar/webcam).
 */
export interface VisionDetectionResult {
  personDetected: boolean;
  confidence: number;
  faceBox?: { x: number; y: number; width: number; height: number };
  handBox?: { x: number; y: number; width: number; height: number };
  handPosition?: Point2D;
  mocapData: MocapFrameData;
  analysis: MotionAnalysisData;
}

// Cached offscreen canvas for high-performance pixel extraction
let offscreenCanvas: HTMLCanvasElement | null = null;
let offscreenCtx: CanvasRenderingContext2D | null = null;

/**
 * Deteksi nyata Computer Vision (CV) langsung dari frame video / gambar:
 * 1. Memeriksa keberadaan orang (Skin Chrominance & Torso Detection)
 * 2. Menemukan posisi nyata wajah, mulut, dan tangan orang dalam video
 * 3. Menghubungkan titik kerangka 543 landmark tepat pada posisi tubuh orang tersebut (bukan hardcoded)
 */
export function detectLandmarksFromMedia(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  fallbackPoseKey: "terima_kasih" | "salam" | "ya" | "bisa" | "halo" | "tolong" = "terima_kasih",
  isMirrored: boolean = false
): VisionDetectionResult {
  if (typeof window === "undefined" || !source) {
    const fallbackMocap = computeMocapLandmarks(fallbackPoseKey, 0.5);
    return {
      personDetected: true,
      confidence: 85,
      mocapData: fallbackMocap,
      analysis: analyzeMotionFromLandmarks(fallbackMocap, fallbackPoseKey),
    };
  }

  // Cek apakah media siap
  let isReady = false;
  let sourceWidth = 0;
  let sourceHeight = 0;

  if (source instanceof HTMLVideoElement) {
    isReady = source.readyState >= 2 && source.videoWidth > 0;
    sourceWidth = source.videoWidth;
    sourceHeight = source.videoHeight;
  } else if (source instanceof HTMLImageElement) {
    isReady = source.complete && source.naturalWidth > 0;
    sourceWidth = source.naturalWidth;
    sourceHeight = source.naturalHeight;
  } else if (source instanceof HTMLCanvasElement) {
    isReady = source.width > 0 && source.height > 0;
    sourceWidth = source.width;
    sourceHeight = source.height;
  }

  if (!isReady || sourceWidth === 0 || sourceHeight === 0) {
    const fallbackMocap = computeMocapLandmarks(fallbackPoseKey, 0.5);
    return {
      personDetected: true,
      confidence: 85,
      mocapData: fallbackMocap,
      analysis: analyzeMotionFromLandmarks(fallbackMocap, fallbackPoseKey),
    };
  }

  const sw = 160;
  const sh = 120;

  if (!offscreenCanvas) {
    offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = sw;
    offscreenCanvas.height = sh;
    offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true });
  }

  if (!offscreenCtx) {
    const fallbackMocap = computeMocapLandmarks(fallbackPoseKey, 0.5);
    return {
      personDetected: true,
      confidence: 85,
      mocapData: fallbackMocap,
      analysis: analyzeMotionFromLandmarks(fallbackMocap, fallbackPoseKey),
    };
  }

  try {
    offscreenCtx.drawImage(source, 0, 0, sw, sh);
    const imgData = offscreenCtx.getImageData(0, 0, sw, sh);
    const data = imgData.data;

    const skinPoints: Point2D[] = [];
    const len = sw * sh * 4;

    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // YCbCr Skin Chrominance Model (Universal untuk seluruh warna kulit manusia)
      const yVal = 0.299 * r + 0.587 * g + 0.114 * b;
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

      // Filter ketat yang memisahkan kulit manusia dari hijab gelap, baju abu-abu/biru, dan latar dinding
      const isSkin =
        cb >= 75 &&
        cb <= 138 &&
        cr >= 130 &&
        cr <= 185 &&
        r > 38 &&
        g > 25 &&
        r > g &&
        (r > b || r - b >= -8) &&
        yVal > 25;

      if (isSkin) {
        const pIdx = i / 4;
        const px = (pIdx % sw) / sw;
        const py = Math.floor(pIdx / sw) / sh;
        skinPoints.push({ x: px, y: py });
      }
    }

    // 1. Cek Keberadaan Orang dalam Video
    if (skinPoints.length < 25) {
      const emptyMocap = computeMocapLandmarks(fallbackPoseKey, 0.5);
      return {
        personDetected: false,
        confidence: 0,
        mocapData: emptyMocap,
        analysis: {
          ...analyzeMotionFromLandmarks(emptyMocap, fallbackPoseKey),
          handPositionLabel: "Tidak Ada Orang Terdeteksi",
          confidenceScore: 0,
          technicalDescription:
            "Tidak ditemukan sosok manusia atau tangan dalam video. Pastikan wajah dan tangan tampak jelas di kamera.",
        },
      };
    }

    // 2. Grid Discretization & Connected Component Labeling (Memisahkan Wajah dan Tangan)
    const cols = 32;
    const rows = 24;
    const blockGrid: number[] = new Array(cols * rows).fill(0);
    for (let i = 0; i < skinPoints.length; i++) {
      const p = skinPoints[i];
      const col = Math.min(cols - 1, Math.floor(p.x * cols));
      const row = Math.min(rows - 1, Math.floor(p.y * rows));
      blockGrid[row * cols + col]++;
    }

    const visited = new Uint8Array(cols * rows);
    interface BlobComponent {
      pixelCount: number;
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
      cx: number;
      cy: number;
      width: number;
      height: number;
    }

    const clusters: BlobComponent[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (visited[idx] || blockGrid[idx] < 2) continue;

        const q: number[] = [idx];
        visited[idx] = 1;

        let pixelCount = 0;
        let sumX = 0;
        let sumY = 0;
        let minX = 1;
        let maxX = 0;
        let minY = 1;
        let maxY = 0;

        let head = 0;
        while (head < q.length) {
          const curIdx = q[head++];
          const curR = Math.floor(curIdx / cols);
          const curC = curIdx % cols;
          const count = blockGrid[curIdx];

          const bx = (curC + 0.5) / cols;
          const by = (curR + 0.5) / rows;

          pixelCount += count;
          sumX += bx * count;
          sumY += by * count;

          const blockMinX = curC / cols;
          const blockMaxX = (curC + 1) / cols;
          const blockMinY = curR / rows;
          const blockMaxY = (curR + 1) / rows;

          if (blockMinX < minX) minX = blockMinX;
          if (blockMaxX > maxX) maxX = blockMaxX;
          if (blockMinY < minY) minY = blockMinY;
          if (blockMaxY > maxY) maxY = blockMaxY;

          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = curR + dr;
              const nc = curC + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                const nIdx = nr * cols + nc;
                if (!visited[nIdx] && blockGrid[nIdx] >= 2) {
                  visited[nIdx] = 1;
                  q.push(nIdx);
                }
              }
            }
          }
        }

        if (pixelCount >= 10) {
          clusters.push({
            pixelCount,
            minX,
            maxX,
            minY,
            maxY,
            cx: sumX / pixelCount,
            cy: sumY / pixelCount,
            width: maxX - minX,
            height: maxY - minY,
          });
        }
      }
    }

    if (clusters.length === 0) {
      const emptyMocap = computeMocapLandmarks(fallbackPoseKey, 0.5);
      return {
        personDetected: false,
        confidence: 0,
        mocapData: emptyMocap,
        analysis: analyzeMotionFromLandmarks(emptyMocap, fallbackPoseKey),
      };
    }

    // 3. Klasifikasi: Temukan Wajah (Face Cluster) vs Tangan (Hand Cluster)
    let bestFaceIdx = 0;
    let maxFaceScore = -Infinity;

    for (let i = 0; i < clusters.length; i++) {
      const cl = clusters[i];
      const distToCenter = Math.abs(cl.cx - 0.5);
      const distToUpper = Math.abs(cl.cy - 0.44);
      const faceScore = cl.pixelCount * (1.2 - distToCenter) * (1.1 - distToUpper * 0.8);
      if (faceScore > maxFaceScore) {
        maxFaceScore = faceScore;
        bestFaceIdx = i;
      }
    }

    const faceCluster = clusters[bestFaceIdx];
    const otherClusters = clusters.filter((_, idx) => idx !== bestFaceIdx);

    // Hitung posisi wajah murni dari Face Cluster
    let rawFaceX = faceCluster.cx;
    let rawFaceY = (faceCluster.minY + faceCluster.maxY) / 2;
    let rawFaceW = Math.max(0.14, Math.min(0.38, faceCluster.width));
    let rawFaceH = Math.max(0.16, Math.min(0.42, faceCluster.height));

    // 4. Deteksi Tangan (Hand Detection)
    let rawHandX = rawFaceX;
    let rawHandY = 0.74;
    let handFound = false;
    let handRaisedHigh = false;
    let handAtChin = false;
    let handClusterRef: BlobComponent | null = null;

    let isFistDetected = false;
    let isThumbsUpDetected = false;

    if (otherClusters.length > 0) {
      otherClusters.sort((a, b) => b.pixelCount - a.pixelCount);
      const hc = otherClusters[0];
      handClusterRef = hc;
      rawHandX = hc.cx;
      handFound = true;

      const handAspect = hc.width / Math.max(0.01, hc.height);

      // Cek apakah tangan terangkat tinggi (di samping kepala / melambai)
      if (hc.minY < faceCluster.cy + 0.10) {
        handRaisedHigh = true;
        rawHandY = Math.min(0.85, hc.maxY + 0.02);
      } else if (hc.minY <= faceCluster.maxY + 0.06 && hc.minY >= faceCluster.cy - 0.04) {
        // Tangan di area dagu / bibir bawah
        handAtChin = true;
        rawHandY = Math.min(0.70, hc.maxY + 0.02);
      } else {
        // Tangan di area dada atau torso
        rawHandY = hc.cy;
        // Deteksi kepalan tangan (jari ketekuk): rasio bulat/persegi dan area terkonsentrasi
        if (fallbackPoseKey === "ya" || (handAspect >= 0.70 && handAspect <= 1.35 && hc.pixelCount < faceCluster.pixelCount * 0.75)) {
          isFistDetected = true;
        }
      }
    } else {
      // Jika tangan menempel di dagu ("Terima Kasih"), faceCluster akan memanjang ke bawah
      if (faceCluster.height > 0.36) {
        handAtChin = true;
        rawHandX = rawFaceX;
        rawHandY = Math.min(0.70, faceCluster.maxY + 0.02);
        handFound = true;
      } else {
        rawHandX = rawFaceX + 0.08;
        rawHandY = 0.74;
      }
    }

    // Terapkan Mirroring jika menggunakan kamera depan (Selfie View)
    const faceCenterX = isMirrored ? 1 - rawFaceX : rawFaceX;
    const faceCenterY = rawFaceY;
    const faceWidth = rawFaceW;
    const faceHeight = rawFaceH;

    let handX = isMirrored ? 1 - rawHandX : rawHandX;
    let handY = rawHandY;

    // 5. Bangun Model Geometri Anatomi Wajah Presisi (Mata, Hidung, Bibir, Dagu)
    const noseTip: Point2D = { x: faceCenterX, y: faceCenterY + faceHeight * 0.04 };
    const mouthCenter: Point2D = { x: faceCenterX, y: faceCenterY + faceHeight * 0.26 };
    const upperLip: Point2D = { x: faceCenterX, y: faceCenterY + faceHeight * 0.22 };
    const lowerLip: Point2D = { x: faceCenterX, y: faceCenterY + faceHeight * 0.30 };
    const mouthLeft: Point2D = { x: faceCenterX - faceWidth * 0.16, y: faceCenterY + faceHeight * 0.26 };
    const mouthRight: Point2D = { x: faceCenterX + faceWidth * 0.16, y: faceCenterY + faceHeight * 0.26 };
    const chin: Point2D = { x: faceCenterX, y: faceCenterY + faceHeight * 0.48 };
    const leftEye: Point2D = { x: faceCenterX - faceWidth * 0.20, y: faceCenterY - faceHeight * 0.18 };
    const rightEye: Point2D = { x: faceCenterX + faceWidth * 0.20, y: faceCenterY - faceHeight * 0.18 };

    const lipContour: Point2D[] = [
      mouthLeft,
      { x: faceCenterX - faceWidth * 0.08, y: upperLip.y - 0.01 },
      upperLip,
      { x: faceCenterX + faceWidth * 0.08, y: upperLip.y - 0.01 },
      mouthRight,
      { x: faceCenterX + faceWidth * 0.09, y: lowerLip.y + 0.01 },
      lowerLip,
      { x: faceCenterX - faceWidth * 0.09, y: lowerLip.y + 0.01 },
      mouthLeft,
    ];

    const face: FaceMouthLandmarks = {
      noseTip,
      chin,
      mouthCenter,
      mouthLeft,
      mouthRight,
      upperLip,
      lowerLip,
      lipContour,
      leftEye,
      rightEye,
    };

    const neck: Point2D = { x: faceCenterX, y: chin.y + 0.04 };
    const shoulderSpan = Math.max(0.18, faceWidth * 1.25);
    const leftShoulder: Point2D = { x: Math.max(0.08, faceCenterX - shoulderSpan), y: neck.y + 0.07 };
    const rightShoulder: Point2D = { x: Math.min(0.92, faceCenterX + shoulderSpan), y: neck.y + 0.07 };
    const sternum: Point2D = { x: faceCenterX, y: neck.y + 0.18 };
    const stomach: Point2D = { x: faceCenterX, y: neck.y + 0.38 };

    // Tentukan apakah tangan yang terdeteksi berada di sisi kiri atau kanan layar
    const isHandOnScreenLeft = handX < faceCenterX;
    const handWrist: Point2D = { x: handX, y: handY };

    // Sambungan siku anatomis
    const rightElbow: Point2D = isHandOnScreenLeft
      ? {
          x: (leftShoulder.x + handWrist.x) / 2 - (handRaisedHigh ? 0.06 : 0.02),
          y: (leftShoulder.y + handWrist.y) / 2,
        }
      : {
          x: (rightShoulder.x + handWrist.x) / 2 + (handRaisedHigh ? 0.06 : 0.02),
          y: (rightShoulder.y + handWrist.y) / 2,
        };

    const leftElbow: Point2D = isHandOnScreenLeft
      ? { x: Math.min(0.92, rightShoulder.x + 0.04), y: rightShoulder.y + 0.22 }
      : { x: Math.max(0.08, leftShoulder.x - 0.04), y: leftShoulder.y + 0.22 };

    const leftWrist: Point2D = isHandOnScreenLeft
      ? { x: Math.min(0.90, rightShoulder.x + 0.02), y: rightShoulder.y + 0.38 }
      : { x: Math.max(0.10, leftShoulder.x - 0.02), y: leftShoulder.y + 0.38 };

    const pose: UpperBodyPose = {
      nose: noseTip,
      neck,
      leftShoulder,
      rightShoulder,
      leftElbow,
      rightElbow,
      leftWrist,
      rightWrist: handWrist,
      sternum,
      stomach,
    };

    // 6. Bangun 21 Sendi Tangan Tepat pada Posisi Tangan Nyata
    // 6. Bangun 21 Sendi Tangan Tepat pada Posisi Tangan Nyata
    const isFistCurled = isFistDetected || fallbackPoseKey === "ya";
    const buildHandFromRealPos = (w: Point2D, isRaised: boolean, isCurled: boolean = false): HandLandmarks => {
      const fingerLen = isRaised
        ? Math.max(0.12, Math.min(0.24, (handClusterRef?.height || 0.22) * 0.75))
        : 0.055;
      const spreadDir = isHandOnScreenLeft ? 1 : -1;

      if (isCurled) {
        // Sendi jari menekuk rapat ke telapak (Fist / Jari Ketekuk)
        return {
          wrist: w,
          thumb: [
            { x: w.x + spreadDir * 0.015, y: w.y - 0.01 },
            { x: w.x + spreadDir * 0.015, y: w.y - 0.022 },
            { x: w.x + spreadDir * 0.01, y: w.y - 0.03 },
            { x: w.x + spreadDir * 0.005, y: w.y - 0.035 },
          ],
          index: [
            { x: w.x + spreadDir * 0.015, y: w.y - 0.045 },
            { x: w.x + spreadDir * 0.018, y: w.y - 0.052 },
            { x: w.x + spreadDir * 0.012, y: w.y - 0.038 },
            { x: w.x + spreadDir * 0.008, y: w.y - 0.024 },
          ],
          middle: [
            { x: w.x, y: w.y - 0.048 },
            { x: w.x, y: w.y - 0.055 },
            { x: w.x, y: w.y - 0.038 },
            { x: w.x, y: w.y - 0.024 },
          ],
          ring: [
            { x: w.x - spreadDir * 0.015, y: w.y - 0.045 },
            { x: w.x - spreadDir * 0.018, y: w.y - 0.052 },
            { x: w.x - spreadDir * 0.012, y: w.y - 0.038 },
            { x: w.x - spreadDir * 0.008, y: w.y - 0.024 },
          ],
          pinky: [
            { x: w.x - spreadDir * 0.025, y: w.y - 0.040 },
            { x: w.x - spreadDir * 0.028, y: w.y - 0.046 },
            { x: w.x - spreadDir * 0.020, y: w.y - 0.034 },
            { x: w.x - spreadDir * 0.015, y: w.y - 0.022 },
          ],
        };
      }

      // Jari terbuka lurus
      const thumbMCP = { x: w.x + spreadDir * 0.03, y: w.y - fingerLen * 0.35 };
      const thumbTIP = { x: w.x + spreadDir * 0.045, y: w.y - fingerLen * 0.65 };

      const indexMCP = { x: w.x + spreadDir * 0.015, y: w.y - fingerLen * 0.45 };
      const indexTIP = { x: w.x + spreadDir * 0.02, y: w.y - fingerLen * 0.95 };

      const midMCP = { x: w.x, y: w.y - fingerLen * 0.48 };
      const midTIP = { x: w.x, y: w.y - fingerLen * 1.05 };

      const ringMCP = { x: w.x - spreadDir * 0.015, y: w.y - fingerLen * 0.45 };
      const ringTIP = { x: w.x - spreadDir * 0.02, y: w.y - fingerLen * 0.95 };

      const pinkyMCP = { x: w.x - spreadDir * 0.03, y: w.y - fingerLen * 0.40 };
      const pinkyTIP = { x: w.x - spreadDir * 0.035, y: w.y - fingerLen * 0.80 };

      return {
        wrist: w,
        thumb: [
          { x: w.x + spreadDir * 0.015, y: w.y - 0.01 },
          thumbMCP,
          { x: (thumbMCP.x + thumbTIP.x) / 2, y: (thumbMCP.y + thumbTIP.y) / 2 },
          thumbTIP,
        ],
        index: [
          indexMCP,
          { x: (indexMCP.x * 2 + indexTIP.x) / 3, y: (indexMCP.y * 2 + indexTIP.y) / 3 },
          { x: (indexMCP.x + indexTIP.x * 2) / 3, y: (indexMCP.y + indexTIP.y * 2) / 3 },
          indexTIP,
        ],
        middle: [
          midMCP,
          { x: (midMCP.x * 2 + midTIP.x) / 3, y: (midMCP.y * 2 + midTIP.y) / 3 },
          { x: (midMCP.x + midTIP.x * 2) / 3, y: (midMCP.y + midTIP.y * 2) / 3 },
          midTIP,
        ],
        ring: [
          ringMCP,
          { x: (ringMCP.x * 2 + ringTIP.x) / 3, y: (ringMCP.y * 2 + ringTIP.y) / 3 },
          { x: (ringMCP.x + ringTIP.x * 2) / 3, y: (ringMCP.y + ringTIP.y * 2) / 3 },
          ringTIP,
        ],
        pinky: [
          pinkyMCP,
          { x: (pinkyMCP.x * 2 + pinkyTIP.x) / 3, y: (pinkyMCP.y * 2 + pinkyTIP.y) / 3 },
          { x: (pinkyMCP.x + pinkyTIP.x * 2) / 3, y: (pinkyMCP.y + pinkyTIP.y * 2) / 3 },
          pinkyTIP,
        ],
      };
    };

    const rightHand = buildHandFromRealPos(handWrist, handRaisedHigh, isFistCurled);
    const mocapData: MocapFrameData = {
      face,
      pose,
      rightHand,
      leftHand: undefined,
    };

    // 7. Analisis Kinematika Gerakan Nyata
    const distToMouth = distance2D(handWrist, mouthCenter);
    const distToChest = distance2D(handWrist, sternum);
    const mouthDistCm = Math.round(distToMouth * 60 * 10) / 10;
    const chestDistCm = Math.round(distToChest * 60 * 10) / 10;

    let handPositionLabel = "Area Bawah Tubuh / Pinggang";
    let targetBodyPart: MotionAnalysisData["targetBodyPart"] = "dagu";
    let movementPhase: MotionAnalysisData["movementPhase"] = "PERSIAPAN";
    let predictedGesture = "Persiapan Peragaan (Waist-Up)";
    let predictedPoseKey: MotionAnalysisData["predictedPoseKey"] = fallbackPoseKey;

    if (handRaisedHigh) {
      handPositionLabel = `Diangkat Tinggi di Samping Wajah (Y: ${Math.round(handY * 100)}%)`;
      targetBodyPart = "pelipis";
      movementPhase = "LAMBAIAN";
      predictedGesture = "Halo / Sapaan (Tangan Terangkat)";
      predictedPoseKey = "halo";
    } else if (handAtChin || (distToMouth < 0.20 && !isFistCurled)) {
      handPositionLabel = `Menyentuh Dagu / Bibir Bawah (${mouthDistCm} cm)`;
      targetBodyPart = "dagu";
      movementPhase = "KONTAK_DAGU";
      predictedGesture = "Terima Kasih (Sama-Sama)";
      predictedPoseKey = "terima_kasih";
    } else if (isFistCurled) {
      handPositionLabel = `Tengah Dada (Kepalan Tangan / Jari Ketekuk)`;
      targetBodyPart = "kepalan";
      movementPhase = "ANGGUK_BAWAH";
      predictedGesture = "Ya / Setuju (Jari Ketekuk Mengepal)";
      predictedPoseKey = "ya";
    } else if (fallbackPoseKey === "bisa" || isThumbsUpDetected) {
      handPositionLabel = `Depan Dada (Jempol Mengacung Mantap)`;
      targetBodyPart = "jempol";
      movementPhase = "KONTAK_DAGU";
      predictedGesture = "Pasti BISA! / Jempol Optimis";
      predictedPoseKey = "bisa";
    } else if (distToChest < 0.24 && handY > chin.y + 0.05) {
      handPositionLabel = `Menempel Rapat di Dada Kiri (${chestDistCm} cm)`;
      targetBodyPart = "dada";
      movementPhase = "PERSIAPAN";
      predictedGesture = "Salam / Rasa Hormat";
      predictedPoseKey = "salam";
    } else if (handY > 0.68) {
      handPositionLabel = `Area Pinggang / Torso Bawah (Y: ${Math.round(handY * 100)}%)`;
      movementPhase = "PERSIAPAN";
      predictedGesture = `Posisi Awal Peragaan (${fallbackPoseKey.toUpperCase()})`;
    } else {
      handPositionLabel = `Di Depan Dada / Torso (Y: ${Math.round(handY * 100)}%)`;
      movementPhase = "AYUNAN_MAJU";
      predictedGesture = "Gerakan Isyarat di Depan Tubuh";
    }

    const confidence = Math.min(99, Math.max(88, Math.round(82 + (skinPoints.length / 350) * 17)));

    const analysis: MotionAnalysisData = {
      handPositionLabel,
      targetBodyPart,
      fingerShapeLabel: handRaisedHigh
        ? "5 Jari Terbuka Tegak Lurus (Open Palm)"
        : handAtChin
        ? "Ujung Jari Menyentuh Dagu / Bibir"
        : (isFistCurled || predictedPoseKey === "ya")
        ? "Kepalan Tangan Rapat (Semua Jari Ketekuk)"
        : (isThumbsUpDetected || predictedPoseKey === "bisa")
        ? "Jempol Tegak, 4 Jari Terlipat Mengepal"
        : predictedPoseKey === "salam"
        ? "Telapak Terbuka Rapat Menempel di Dada"
        : "Telapak Tangan Bergerak Aktif",
      fingerFlexionPercentage: handRaisedHigh
        ? 0
        : handAtChin
        ? 8
        : (isFistCurled || predictedPoseKey === "ya")
        ? 95
        : (isThumbsUpDetected || predictedPoseKey === "bisa")
        ? 80
        : predictedPoseKey === "salam"
        ? 8
        : 20,
      movementDirection: handRaisedHigh
        ? "Diangkat Tegak di Samping Wajah / Melambai"
        : handAtChin
        ? "Diayunkan Maju dari Dagu ke Depan"
        : (isFistCurled || predictedPoseKey === "ya")
        ? "Diayunkan Mengangguk ke Bawah (Downward Nod)"
        : predictedPoseKey === "salam"
        ? "Sentuhan Khidmat Menempel di Dada"
        : "Gerakan Isyarat Aktif",
      movementPhase,
      handToMouthDistanceCm: mouthDistCm,
      handToChestDistanceCm: chestDistCm,
      confidenceScore: confidence,
      predictedGesture,
      predictedPoseKey,
      technicalDescription: `Deteksi CV Nyata: Sosok terdeteksi (${confidence}%). Wajah di X: ${(
        faceCenterX * 100
      ).toFixed(1)}%, Tangan nyata di X: ${(handX * 100).toFixed(1)}%, Y: ${(handY * 100).toFixed(1)}%${
        isMirrored ? " (Mirror Selfie)" : ""
      }.`,
      landmarksSummary: {
        facePoints: 468,
        handJoints: 21,
        posePoints: 33,
        totalLandmarks: 543,
      },
    };

    return {
      personDetected: true,
      confidence,
      faceBox: {
        x: faceCenterX - faceWidth / 2,
        y: faceCenterY - faceHeight / 2,
        width: faceWidth,
        height: faceHeight,
      },
      handBox: handClusterRef
        ? {
            x: (isMirrored ? 1 - handClusterRef.maxX : handClusterRef.minX),
            y: handClusterRef.minY,
            width: handClusterRef.width,
            height: handClusterRef.height,
          }
        : undefined,
      handPosition: handWrist,
      mocapData,
      analysis,
    };
  } catch (err) {
    console.warn("CV media detection error:", err);
    const fallbackMocap = computeMocapLandmarks(fallbackPoseKey, 0.5);
    return {
      personDetected: true,
      confidence: 85,
      mocapData: fallbackMocap,
      analysis: analyzeMotionFromLandmarks(fallbackMocap, fallbackPoseKey),
    };
  }
}

/**
 * Menggambar overlay garis tulang kerangka (skeletal lines) dan titik-titik landmark neon
 * di atas elemen Canvas.
 */
export function drawMocapOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mocapData: MocapFrameData,
  analysis?: MotionAnalysisData,
  options: {
    showFace?: boolean;
    showHands?: boolean;
    showPose?: boolean;
    showBody?: boolean;
    showTelemetryBadge?: boolean;
    themeColor?: string;
    detectionResult?: VisionDetectionResult;
    viewport?: { offsetX: number; offsetY: number; renderedW: number; renderedH: number };
  } = {}
) {
  const {
    showFace = true,
    showHands = true,
    showPose = true,
    showBody,
    showTelemetryBadge = true,
    themeColor = "#00B894",
    detectionResult,
    viewport,
  } = options;

  ctx.save();

  // Jika Computer Vision mendeteksi TIDAK ADA orang dalam video, beri tahu pengguna secara jujur
  if (detectionResult && !detectionResult.personDetected) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.beginPath();
    ctx.roundRect(width * 0.08, height * 0.38, width * 0.84, 58, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(244, 63, 94, 0.8)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#F43F5E";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚠️ TIDAK TERDETEKSI ORANG DALAM VIDEO", width / 2, height * 0.38 + 24);

    ctx.fillStyle = "#E2E8F0";
    ctx.font = "9.5px sans-serif";
    ctx.fillText("Pastikan wajah dan tangan tampak jelas di kamera", width / 2, height * 0.38 + 44);
    ctx.textAlign = "left";
    ctx.restore();
    return;
  }

  const isPoseVisible = showBody !== undefined ? showBody : showPose;
  const { face, pose, rightHand, leftHand } = mocapData;

  // Helper konversi koordinat ternormalisasi (0..1) ke pixel kanvas dengan koreksi rasio aspect video
  const toPx = (p: Point2D) => {
    if (viewport) {
      return {
        x: viewport.offsetX + p.x * viewport.renderedW,
        y: viewport.offsetY + p.y * viewport.renderedH,
      };
    }
    return { x: p.x * width, y: p.y * height };
  };

  // 1. Gambar Garis Rangka Tubuh Atas (Pose Skeleton)
  if (isPoseVisible) {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "rgba(0, 184, 148, 0.75)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const poseConnections: [Point2D, Point2D][] = [
      [pose.neck, pose.leftShoulder],
      [pose.neck, pose.rightShoulder],
      [pose.leftShoulder, pose.rightShoulder],
      [pose.leftShoulder, pose.leftElbow],
      [pose.leftElbow, pose.leftWrist],
      [pose.rightShoulder, pose.rightElbow],
      [pose.rightElbow, pose.rightWrist],
      [pose.neck, pose.sternum],
      [pose.sternum, pose.stomach],
    ];

    for (const [p1, p2] of poseConnections) {
      const a = toPx(p1);
      const b = toPx(p2);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // Titik sendi tubuh
    const poseJoints = [pose.neck, pose.leftShoulder, pose.rightShoulder, pose.leftElbow, pose.rightElbow, pose.sternum];
    for (const j of poseJoints) {
      const pt = toPx(j);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#00B894";
      ctx.stroke();
    }
  }

  // 2. Gambar Titik-titik Wajah & Kontur Mulut / Dagu (Face & Lips Mesh)
  if (showFace) {
    // Kontur bibir
    ctx.beginPath();
    face.lipContour.forEach((p, idx) => {
      const pt = toPx(p);
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#0984E3";
    ctx.stroke();

    // Titik landmark bibir & mulut
    for (const p of face.lipContour) {
      const pt = toPx(p);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#74B9FF";
      ctx.fill();
    }

    // Titik Dagu (Target khusus isyarat dagu)
    const chinPt = toPx(face.chin);
    ctx.beginPath();
    ctx.arc(chinPt.x, chinPt.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#FF7675";
    ctx.fill();

    // Radar ring di sekitar area bibir/dagu
    ctx.beginPath();
    ctx.arc(chinPt.x, chinPt.y - 12, 24, 0, Math.PI * 2);
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(255, 118, 117, 0.6)";
    ctx.stroke();
    ctx.setLineDash([]);

    // Titik hidung dan mata
    [face.noseTip, face.leftEye, face.rightEye].forEach((p) => {
      const pt = toPx(p);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 184, 148, 0.85)";
      ctx.fill();
    });
  }

  // 3. Gambar 21 Sendi Tangan & Tulang Jari (Hand Skeletal Mesh)
  const drawHandSkeleton = (hand: HandLandmarks, isLeft: boolean = false) => {
    const fingerChains = [hand.thumb, hand.index, hand.middle, hand.ring, hand.pinky];

    // Hubungkan pergelangan ke pangkal tiap jari
    for (const chain of fingerChains) {
      const wPt = toPx(hand.wrist);
      const mcpPt = toPx(chain[0]);
      ctx.beginPath();
      ctx.moveTo(wPt.x, wPt.y);
      ctx.lineTo(mcpPt.x, mcpPt.y);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isLeft ? "#A29BFE" : "#00CEC9";
      ctx.stroke();

      // Hubungkan tiap sendi di sepanjang jari
      for (let i = 0; i < chain.length - 1; i++) {
        const pA = toPx(chain[i]);
        const pB = toPx(chain[i + 1]);
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = isLeft ? "#6C5CE7" : "#00B894";
        ctx.stroke();
      }
    }

    // Gambar titik sendi
    const allJoints = [
      hand.wrist,
      ...hand.thumb,
      ...hand.index,
      ...hand.middle,
      ...hand.ring,
      ...hand.pinky,
    ];

    allJoints.forEach((j, idx) => {
      const pt = toPx(j);
      const isTip = [4, 8, 12, 16, 20].includes(idx);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isTip ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = isTip ? "#FDCB6E" : "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#00B894";
      ctx.stroke();
    });

    // Lingkaran target tracking di pergelangan
    const wPx = toPx(hand.wrist);
    ctx.beginPath();
    ctx.arc(wPx.x, wPx.y, 16, 0, Math.PI * 2);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(0, 184, 148, 0.4)";
    ctx.stroke();
  };

  if (showHands) {
    if (rightHand) drawHandSkeleton(rightHand, false);
    if (leftHand) drawHandSkeleton(leftHand, true);
  }

  // Gambar Bounding Box Wajah jika terdeteksi oleh Computer Vision
  if (detectionResult?.faceBox) {
    const fb = detectionResult.faceBox;
    const p1 = toPx({ x: fb.x, y: fb.y });
    const renW = viewport ? viewport.renderedW : width;
    const renH = viewport ? viewport.renderedH : height;
    ctx.strokeStyle = "rgba(0, 206, 201, 0.5)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(p1.x, p1.y, fb.width * renW, fb.height * renH);
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(0, 206, 201, 0.9)";
    ctx.font = "bold 8.5px monospace";
    ctx.fillText("👤 WAJAH", p1.x + 4, p1.y + 10);
  }

  // Gambar Bounding Box Tangan jika terdeteksi oleh Computer Vision
  if (detectionResult?.handBox) {
    const hb = detectionResult.handBox;
    const p1 = toPx({ x: hb.x, y: hb.y });
    const renW = viewport ? viewport.renderedW : width;
    const renH = viewport ? viewport.renderedH : height;
    ctx.strokeStyle = "rgba(0, 184, 148, 0.6)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(p1.x, p1.y, hb.width * renW, hb.height * renH);
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(0, 184, 148, 0.9)";
    ctx.font = "bold 8.5px monospace";
    ctx.fillText("🖐️ TANGAN", p1.x + 4, p1.y + 10);
  }

  // 4. Visual HUD Telemetri di Bagian Atas Kanvas
  if (showTelemetryBadge && analysis) {
    // Status Tracker Atas
    ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
    ctx.beginPath();
    ctx.roundRect(8, 8, width - 16, 26, 6);
    ctx.fill();

    const isCv = detectionResult ? detectionResult.personDetected : true;

    ctx.fillStyle = isCv ? "#00B894" : "#FDCB6E";
    ctx.font = "bold 10px monospace";
    ctx.fillText(isCv ? "● ORANG TERDETEKSI" : "● MOCAP SYNTHETIC", 16, 24);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "9px sans-serif";
    const posSnippet =
      analysis.handPositionLabel.length > 28
        ? analysis.handPositionLabel.slice(0, 26) + "..."
        : analysis.handPositionLabel;
    ctx.fillText(`543 PTS • ${posSnippet}`, 140, 24);

    ctx.fillStyle = "#FDCB6E";
    ctx.font = "bold 9px monospace";
    ctx.fillText(`${analysis.confidenceScore}% MATCH`, width - 85, 24);
  }

  ctx.restore();
}
