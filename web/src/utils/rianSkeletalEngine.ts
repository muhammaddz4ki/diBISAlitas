/**
 * RIAN POLMAN 3D SKELETAL MOTION ENGINE
 * 
 * Modul kinematika tulang Mixamo 65-sendi untuk Avatar 3D Rian POLMAN.
 * Mengatur mapping sendi, interpolasi quaternion slerp halus (~200ms - 300ms),
 * pernapasan idle alami (idle breathing), mouse tilt parallax, dan pustaka
 * pose gestur BISINDO serta ejaan alfabet (fingerspelling).
 * 
 * ATURAN BAKU: Bebas emotikon Unicode di seluruh kode, komentar, dan string.
 */

import * as THREE from "three";

// 1. Peta Nama Tulang Mixamo Humanoid Model rian_rigged.glb
export const RIAN_BONES = {
  // Batang Tubuh & Kepala
  HIPS: "Hips",
  SPINE: "Spine",
  SPINE1: "Spine1",
  SPINE2: "Spine2",
  NECK: "Neck",
  HEAD: "Head",
  HEAD_TOP: "HeadTop_End",

  // Lengan Kanan (Utama Peraga Isyarat)
  RIGHT_SHOULDER: "RightShoulder",
  RIGHT_ARM: "RightArm",
  RIGHT_FOREARM: "RightForeArm",
  RIGHT_HAND: "RightHand",

  // Jari Kanan
  RIGHT_THUMB_1: "RightHandThumb1",
  RIGHT_THUMB_2: "RightHandThumb2",
  RIGHT_THUMB_3: "RightHandThumb3",
  RIGHT_THUMB_4: "RightHandThumb4",

  RIGHT_INDEX_1: "RightHandIndex1",
  RIGHT_INDEX_2: "RightHandIndex2",
  RIGHT_INDEX_3: "RightHandIndex3",
  RIGHT_INDEX_4: "RightHandIndex4",

  RIGHT_MIDDLE_1: "RightHandMiddle1",
  RIGHT_MIDDLE_2: "RightHandMiddle2",
  RIGHT_MIDDLE_3: "RightHandMiddle3",
  RIGHT_MIDDLE_4: "RightHandMiddle4",

  RIGHT_RING_1: "RightHandRing1",
  RIGHT_RING_2: "RightHandRing2",
  RIGHT_RING_3: "RightHandRing3",
  RIGHT_RING_4: "RightHandRing4",

  RIGHT_PINKY_1: "RightHandPinky1",
  RIGHT_PINKY_2: "RightHandPinky2",
  RIGHT_PINKY_3: "RightHandPinky3",
  RIGHT_PINKY_4: "RightHandPinky4",

  // Lengan Kiri (Peraga Sekunder & Dua Tangan)
  LEFT_SHOULDER: "LeftShoulder",
  LEFT_ARM: "LeftArm",
  LEFT_FOREARM: "LeftForeArm",
  LEFT_HAND: "LeftHand",

  // Jari Kiri
  LEFT_THUMB_1: "LeftHandThumb1",
  LEFT_THUMB_2: "LeftHandThumb2",
  LEFT_THUMB_3: "LeftHandThumb3",
  LEFT_THUMB_4: "LeftHandThumb4",

  LEFT_INDEX_1: "LeftHandIndex1",
  LEFT_INDEX_2: "LeftHandIndex2",
  LEFT_INDEX_3: "LeftHandIndex3",
  LEFT_INDEX_4: "LeftHandIndex4",

  LEFT_MIDDLE_1: "LeftHandMiddle1",
  LEFT_MIDDLE_2: "LeftHandMiddle2",
  LEFT_MIDDLE_3: "LeftHandMiddle3",
  LEFT_MIDDLE_4: "LeftHandMiddle4",

  LEFT_RING_1: "LeftHandRing1",
  LEFT_RING_2: "LeftHandRing2",
  LEFT_RING_3: "LeftHandRing3",
  LEFT_RING_4: "LeftHandRing4",

  LEFT_PINKY_1: "LeftHandPinky1",
  LEFT_PINKY_2: "LeftHandPinky2",
  LEFT_PINKY_3: "LeftHandPinky3",
  LEFT_PINKY_4: "LeftHandPinky4",

  // Kaki
  LEFT_UP_LEG: "LeftUpLeg",
  LEFT_LEG: "LeftLeg",
  LEFT_FOOT: "LeftFoot",
  RIGHT_UP_LEG: "RightUpLeg",
  RIGHT_LEG: "RightLeg",
  RIGHT_FOOT: "RightFoot",
} as const;

// 2. Bone Map Dictionary ke Standar MediaPipe Holistic Landmarks
export const MEDIAPIPE_TO_RIAN_BONE_MAP: Record<string, string> = {
  NOSE: RIAN_BONES.HEAD,
  LEFT_SHOULDER: RIAN_BONES.LEFT_ARM,
  RIGHT_SHOULDER: RIAN_BONES.RIGHT_ARM,
  LEFT_ELBOW: RIAN_BONES.LEFT_FOREARM,
  RIGHT_ELBOW: RIAN_BONES.RIGHT_FOREARM,
  LEFT_WRIST: RIAN_BONES.LEFT_HAND,
  RIGHT_WRIST: RIAN_BONES.RIGHT_HAND,
  LEFT_HIP: RIAN_BONES.LEFT_UP_LEG,
  RIGHT_HIP: RIAN_BONES.RIGHT_UP_LEG,
  LEFT_KNEE: RIAN_BONES.LEFT_LEG,
  RIGHT_KNEE: RIAN_BONES.RIGHT_LEG,
  LEFT_ANKLE: RIAN_BONES.LEFT_FOOT,
  RIGHT_ANKLE: RIAN_BONES.RIGHT_FOOT,
};

// Tipe rotasi per tulang: [rotX, rotY, rotZ] dalam radian
export type BoneEulerAngles = Record<string, [number, number, number]>;

/**
 * Generator konfigurasi jari untuk tangan kanan atau kiri.
 */
function createFingerRotations(
  side: "Right" | "Left",
  config: {
    thumb?: [number, number, number];
    indexCurl?: number;
    middleCurl?: number;
    ringCurl?: number;
    pinkyCurl?: number;
  }
): BoneEulerAngles {
  const pfx = side === "Right" ? "RightHand" : "LeftHand";
  const result: BoneEulerAngles = {};

  const iCurl = config.indexCurl ?? 0;
  const mCurl = config.middleCurl ?? 0;
  const rCurl = config.ringCurl ?? 0;
  const pCurl = config.pinkyCurl ?? 0;

  // Telunjuk (Index)
  result[`${pfx}Index1`] = [iCurl * 0.45, 0, 0];
  result[`${pfx}Index2`] = [iCurl * 0.35, 0, 0];
  result[`${pfx}Index3`] = [iCurl * 0.20, 0, 0];

  // Jari Tengah (Middle)
  result[`${pfx}Middle1`] = [mCurl * 0.45, 0, 0];
  result[`${pfx}Middle2`] = [mCurl * 0.35, 0, 0];
  result[`${pfx}Middle3`] = [mCurl * 0.20, 0, 0];

  // Jari Manis (Ring)
  result[`${pfx}Ring1`] = [rCurl * 0.45, 0, 0];
  result[`${pfx}Ring2`] = [rCurl * 0.35, 0, 0];
  result[`${pfx}Ring3`] = [rCurl * 0.20, 0, 0];

  // Kelingking (Pinky)
  result[`${pfx}Pinky1`] = [pCurl * 0.45, 0, 0];
  result[`${pfx}Pinky2`] = [pCurl * 0.35, 0, 0];
  result[`${pfx}Pinky3`] = [pCurl * 0.20, 0, 0];

  // Jempol (Thumb)
  if (config.thumb) {
    result[`${pfx}Thumb1`] = [config.thumb[0], config.thumb[1], config.thumb[2]];
    result[`${pfx}Thumb2`] = [config.thumb[0] * 0.5, 0, 0];
  }

  return result;
}

// Konfigurasi Bentuk Tangan Standar
const FIST_CURL = -1.5;
const NATURAL_CURL = -0.22;
const OPEN_CURL = 0.05;

/**
 * Pustaka Preset Pose Kinematika Tubuh Bagian Atas BISINDO Rian POLMAN
 */
export const SKELETAL_POSE_LIBRARY: Record<string, BoneEulerAngles> = {
  // 1. Pose Netral / Istirahat
  neutral: {
    [RIAN_BONES.SPINE]: [0, 0, 0],
    [RIAN_BONES.SPINE1]: [0.02, 0, 0],
    [RIAN_BONES.SPINE2]: [0.03, 0, 0],
    [RIAN_BONES.NECK]: [0.01, 0, 0],
    [RIAN_BONES.HEAD]: [0, 0, 0],
    [RIAN_BONES.RIGHT_ARM]: [0.05, 0, -0.06],
    [RIAN_BONES.RIGHT_FOREARM]: [-0.15, 0, 0.05],
    [RIAN_BONES.RIGHT_HAND]: [0.05, 0.08, -0.05],
    [RIAN_BONES.LEFT_ARM]: [0.05, 0, 0.06],
    [RIAN_BONES.LEFT_FOREARM]: [-0.15, 0, -0.05],
    [RIAN_BONES.LEFT_HAND]: [0.05, -0.08, 0.05],
    ...createFingerRotations("Right", {
      thumb: [-0.15, -0.1, 0],
      indexCurl: NATURAL_CURL,
      middleCurl: NATURAL_CURL,
      ringCurl: NATURAL_CURL,
      pinkyCurl: NATURAL_CURL,
    }),
    ...createFingerRotations("Left", {
      thumb: [-0.15, 0.1, 0],
      indexCurl: NATURAL_CURL,
      middleCurl: NATURAL_CURL,
      ringCurl: NATURAL_CURL,
      pinkyCurl: NATURAL_CURL,
    }),
  },

  // 2. Pose Salam diBISAlitas (Tangan Kanan di Dada Kiri / Jantung)
  salam: {
    [RIAN_BONES.SPINE1]: [0.04, 0.02, 0],
    [RIAN_BONES.NECK]: [0.05, 0, 0],
    [RIAN_BONES.HEAD]: [0.06, 0, 0], // sedikit menunduk hormat
    [RIAN_BONES.RIGHT_ARM]: [-0.75, -0.22, 0.58],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.45, -0.38, 0.48],
    [RIAN_BONES.RIGHT_HAND]: [0.28, 0.22, -0.18],
    [RIAN_BONES.LEFT_ARM]: [0.06, 0, 0.08],
    [RIAN_BONES.LEFT_FOREARM]: [-0.18, 0, -0.05],
    [RIAN_BONES.LEFT_HAND]: [0.05, -0.08, 0.05],
    ...createFingerRotations("Right", {
      thumb: [0.1, -0.2, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
    }),
    ...createFingerRotations("Left", {
      thumb: [-0.15, 0.1, 0],
      indexCurl: NATURAL_CURL,
      middleCurl: NATURAL_CURL,
      ringCurl: NATURAL_CURL,
      pinkyCurl: NATURAL_CURL,
    }),
  },

  // 3. Pose Kata "Halo" (Tangan kanan di samping pelipis, siap melambai)
  halo: {
    [RIAN_BONES.SPINE1]: [0.02, -0.04, 0],
    [RIAN_BONES.HEAD]: [-0.04, -0.08, 0],
    [RIAN_BONES.RIGHT_SHOULDER]: [-0.05, 0.05, -0.1],
    [RIAN_BONES.RIGHT_ARM]: [-0.35, 0.15, -1.05],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.82, -0.38, 0.12],
    [RIAN_BONES.RIGHT_HAND]: [0.28, 0.45, -0.2],
    [RIAN_BONES.LEFT_ARM]: [0.05, 0, 0.06],
    [RIAN_BONES.LEFT_FOREARM]: [-0.15, 0, -0.05],
    ...createFingerRotations("Right", {
      thumb: [0.2, -0.3, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
    }),
  },

  // 4. Pose Kata "Terima Kasih" (Ujung jari dari dagu lalu bergerak maju terbuka)
  terima_kasih: {
    [RIAN_BONES.SPINE1]: [0.04, 0, 0],
    [RIAN_BONES.HEAD]: [0.08, 0, 0], // anggukan terima kasih
    [RIAN_BONES.RIGHT_ARM]: [-0.85, -0.25, 0.28],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.35, -0.12, 0.18],
    [RIAN_BONES.RIGHT_HAND]: [0.35, 0.12, -0.35],
    [RIAN_BONES.LEFT_ARM]: [0.05, 0, 0.06],
    [RIAN_BONES.LEFT_FOREARM]: [-0.15, 0, -0.05],
    ...createFingerRotations("Right", {
      thumb: [0.15, -0.25, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
    }),
  },

  // 5. Pose Kata "Bisa" (Kepalan mantap dengan jempol teracung ke atas)
  bisa: {
    [RIAN_BONES.SPINE1]: [0.03, -0.02, 0],
    [RIAN_BONES.HEAD]: [0.05, 0, 0],
    [RIAN_BONES.RIGHT_ARM]: [-0.62, -0.18, 0.22],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.55, 0.08, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.25, 0.35, -0.18],
    [RIAN_BONES.LEFT_ARM]: [0.05, 0, 0.06],
    [RIAN_BONES.LEFT_FOREARM]: [-0.15, 0, -0.05],
    ...createFingerRotations("Right", {
      thumb: [0.45, -0.65, 0.2], // Jempol tegak lurus ke atas
      indexCurl: FIST_CURL,
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
  },

  // 6. Pose Kata "Tolong" / "Sama Sama" (Kedua tangan terbuka ke depan)
  tolong: {
    [RIAN_BONES.SPINE1]: [0.04, 0, 0],
    [RIAN_BONES.HEAD]: [0.04, 0, 0],
    [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.22, 0.25],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.32, 0.12, 0.32],
    [RIAN_BONES.RIGHT_HAND]: [0.32, 0.45, -0.25],
    [RIAN_BONES.LEFT_ARM]: [-0.55, 0.22, -0.25],
    [RIAN_BONES.LEFT_FOREARM]: [-1.32, -0.12, -0.32],
    [RIAN_BONES.LEFT_HAND]: [0.32, -0.45, 0.25],
    ...createFingerRotations("Right", {
      thumb: [0.25, -0.35, 0],
      indexCurl: -0.15,
      middleCurl: -0.15,
      ringCurl: -0.15,
      pinkyCurl: -0.15,
    }),
    ...createFingerRotations("Left", {
      thumb: [0.25, 0.35, 0],
      indexCurl: -0.15,
      middleCurl: -0.15,
      ringCurl: -0.15,
      pinkyCurl: -0.15,
    }),
  },

  // 7. Pose Kata "Ya" (Kepalan tangan di dada mengangguk ke bawah)
  ya: {
    [RIAN_BONES.SPINE1]: [0.05, 0, 0],
    [RIAN_BONES.HEAD]: [0.12, 0, 0], // anggukan tegas
    [RIAN_BONES.RIGHT_ARM]: [-0.68, -0.15, 0.24],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.48, 0, 0.22],
    [RIAN_BONES.RIGHT_HAND]: [0.42, 0.18, -0.25],
    ...createFingerRotations("Right", {
      thumb: [0.2, -0.35, 0],
      indexCurl: FIST_CURL,
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
  },

  // 8. Pose Kata "Tidak" (Telunjuk kanan tegak di depan dada)
  tidak: {
    [RIAN_BONES.SPINE1]: [0.03, 0, 0],
    [RIAN_BONES.HEAD]: [0, -0.08, 0],
    [RIAN_BONES.RIGHT_ARM]: [-0.65, -0.15, 0.22],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.58, 0.08, 0.25],
    [RIAN_BONES.RIGHT_HAND]: [0.15, 0.25, -0.12],
    ...createFingerRotations("Right", {
      thumb: [0.35, -0.45, 0],
      indexCurl: OPEN_CURL, // Telunjuk tegak
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
  },

  // ===== GESTUR ALFABET BISINDO (Fingerspelling) =====

  // Huruf A: Kepalan dengan jempol menempel di samping telunjuk
  A: {
    [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.12, 0.18],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.45, 0.12, 0.25],
    [RIAN_BONES.RIGHT_HAND]: [0.25, 0.22, -0.15],
    ...createFingerRotations("Right", {
      thumb: [0.1, -0.3, 0],
      indexCurl: FIST_CURL,
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
  },

  // Huruf B: 4 jari tegak rapat, jempol ditekuk di depan telapak
  B: {
    [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.12, 0.18],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.55, 0.08, 0.22],
    [RIAN_BONES.RIGHT_HAND]: [0.22, 0.25, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.45, -0.55, 0.2], // jempol melipat ke telapak
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
    }),
  },

  // Huruf C: Jari-jari dan jempol melengkung membentuk busur "C"
  C: {
    [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.12, 0.18],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.48, 0.15, 0.24],
    [RIAN_BONES.RIGHT_HAND]: [0.18, 0.35, -0.22],
    ...createFingerRotations("Right", {
      thumb: [0.35, -0.4, 0],
      indexCurl: -0.65,
      middleCurl: -0.65,
      ringCurl: -0.65,
      pinkyCurl: -0.65,
    }),
  },

  // Huruf D: Telunjuk tegak, jari tengah dan jempol bertemu melingkar
  D: {
    [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.12, 0.18],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.52, 0.1, 0.22],
    [RIAN_BONES.RIGHT_HAND]: [0.2, 0.25, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.4, -0.45, 0],
      indexCurl: OPEN_CURL,
      middleCurl: -1.2,
      ringCurl: -1.2,
      pinkyCurl: -1.2,
    }),
  },

  // Huruf E: Ujung seluruh jari menekuk menyentuh jempol
  E: {
    [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.12, 0.18],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.48, 0.12, 0.22],
    [RIAN_BONES.RIGHT_HAND]: [0.22, 0.22, -0.15],
    ...createFingerRotations("Right", {
      thumb: [0.4, -0.35, 0],
      indexCurl: -1.15,
      middleCurl: -1.15,
      ringCurl: -1.15,
      pinkyCurl: -1.15,
    }),
  },

  // Huruf I: Kelingking tegak lurus, jari lain mengepal
  I: {
    [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.12, 0.18],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.55, 0.1, 0.22],
    [RIAN_BONES.RIGHT_HAND]: [0.2, 0.25, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.25, -0.35, 0],
      indexCurl: FIST_CURL,
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: OPEN_CURL, // Kelingking tegak
    }),
  },

  // Huruf L: Jempol dan telunjuk membentuk sudut 90 derajat siku "L"
  L: {
    [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.12, 0.18],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.52, 0.1, 0.22],
    [RIAN_BONES.RIGHT_HAND]: [0.2, 0.25, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.55, -0.75, 0.25], // Jempol keluar horizontal
      indexCurl: OPEN_CURL,       // Telunjuk ke atas
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
  },

  // Huruf O: Ujung seluruh jari melengkung bertemu jempol membentuk lingkaran "O"
  O: {
    [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.12, 0.18],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.48, 0.15, 0.22],
    [RIAN_BONES.RIGHT_HAND]: [0.18, 0.32, -0.2],
    ...createFingerRotations("Right", {
      thumb: [0.48, -0.52, 0],
      indexCurl: -0.95,
      middleCurl: -0.95,
      ringCurl: -0.95,
      pinkyCurl: -0.95,
    }),
  },

  // Huruf U: Telunjuk dan jari tengah tegak rapat sejajar
  U: {
    [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.12, 0.18],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.55, 0.1, 0.22],
    [RIAN_BONES.RIGHT_HAND]: [0.2, 0.25, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.35, -0.45, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
  },

  // Huruf V: Telunjuk dan jari tengah terbuka membentuk huruf "V" (peace)
  V: {
    [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.12, 0.18],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.55, 0.1, 0.22],
    [RIAN_BONES.RIGHT_HAND]: [0.2, 0.25, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.35, -0.45, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
  },
};

// Aliaskan variasi nama isyarat ke preset kunci utama
SKELETAL_POSE_LIBRARY.terimakasih = SKELETAL_POSE_LIBRARY.terima_kasih;
SKELETAL_POSE_LIBRARY.dagu = SKELETAL_POSE_LIBRARY.terima_kasih;
SKELETAL_POSE_LIBRARY.bibir = SKELETAL_POSE_LIBRARY.terima_kasih;
SKELETAL_POSE_LIBRARY.jempol = SKELETAL_POSE_LIBRARY.bisa;
SKELETAL_POSE_LIBRARY.fist = SKELETAL_POSE_LIBRARY.ya;
SKELETAL_POSE_LIBRARY.kepalan = SKELETAL_POSE_LIBRARY.ya;
SKELETAL_POSE_LIBRARY.sama_sama = SKELETAL_POSE_LIBRARY.tolong;
SKELETAL_POSE_LIBRARY.dada = SKELETAL_POSE_LIBRARY.salam;
SKELETAL_POSE_LIBRARY.hormat = SKELETAL_POSE_LIBRARY.salam;
SKELETAL_POSE_LIBRARY.jantung = SKELETAL_POSE_LIBRARY.salam;
SKELETAL_POSE_LIBRARY.idle = SKELETAL_POSE_LIBRARY.neutral;

/**
 * Mengambil pose target berdasarkan kata atau huruf.
 * Jika huruf tunggal belum ada preset khusus, otomatis membuat pose fingerspelling rapi.
 */
export function resolveSkeletalPose(signKey: string): BoneEulerAngles {
  const normalized = (signKey || "").trim();
  const lower = normalized.toLowerCase().replace(/[-_ ]/g, "_");

  if (SKELETAL_POSE_LIBRARY[lower]) {
    return SKELETAL_POSE_LIBRARY[lower];
  }

  // Cek huruf besar alfabet tunggal (A-Z)
  if (normalized.length === 1 && /[a-zA-Z]/.test(normalized)) {
    const char = normalized.toUpperCase();
    if (SKELETAL_POSE_LIBRARY[char]) {
      return SKELETAL_POSE_LIBRARY[char];
    }
    // Fallback alfabet bersih (tangan terangkat di dada memperagakan huruf)
    return {
      ...SKELETAL_POSE_LIBRARY.neutral,
      [RIAN_BONES.RIGHT_ARM]: [-0.55, -0.12, 0.18],
      [RIAN_BONES.RIGHT_FOREARM]: [-1.52, 0.1, 0.22],
      [RIAN_BONES.RIGHT_HAND]: [0.2, 0.25, -0.18],
      ...createFingerRotations("Right", {
        thumb: [0.3, -0.4, 0],
        indexCurl: OPEN_CURL,
        middleCurl: -0.8,
        ringCurl: -1.2,
        pinkyCurl: -1.2,
      }),
    };
  }

  return SKELETAL_POSE_LIBRARY.neutral;
}

/**
 * Kelas Interpolator Kinematika untuk Karakter Rian 3D
 */
export class RianSkeletalController {
  private bonesMap: Map<string, THREE.Bone> = new Map();
  private restQuaternions: Map<string, THREE.Quaternion> = new Map();
  private currentQuaternions: Map<string, THREE.Quaternion> = new Map();
  private targetQuaternions: Map<string, THREE.Quaternion> = new Map();
  private activeSignKey: string = "neutral";

  public constructor(bones: THREE.Bone[]) {
    bones.forEach((bone) => {
      this.bonesMap.set(bone.name, bone);
      this.restQuaternions.set(bone.name, bone.quaternion.clone());
      this.currentQuaternions.set(bone.name, bone.quaternion.clone());
      this.targetQuaternions.set(bone.name, bone.quaternion.clone());
    });

    this.setTargetSign("neutral");
  }

  /**
   * Menetapkan pose isyarat target baru
   */
  public setTargetSign(signKey: string): void {
    this.activeSignKey = signKey;
    const pose = resolveSkeletalPose(signKey);

    // Reset seluruh target ke rest pose terlebih dahulu
    this.restQuaternions.forEach((restQ, boneName) => {
      this.targetQuaternions.set(boneName, restQ.clone());
    });

    // Terapkan rotasi target dari preset
    const tempEuler = new THREE.Euler(0, 0, 0, "XYZ");
    const deltaQ = new THREE.Quaternion();

    Object.entries(pose).forEach(([boneName, angles]) => {
      const restQ = this.restQuaternions.get(boneName);
      if (!restQ) return;

      tempEuler.set(angles[0], angles[1], angles[2], "XYZ");
      deltaQ.setFromEuler(tempEuler);

      // Gabungkan rotasi dasar dengan rotasi pose
      const finalQ = restQ.clone().multiply(deltaQ);
      this.targetQuaternions.set(boneName, finalQ);
    });
  }

  /**
   * Pembaruan per-frame menggunakan Quaternion Slerp halus (~200ms - 300ms)
   * Dilengkapi mouse parallax tilt dan efek pernapasan alami (idle breathing).
   */
  public update(options: {
    deltaTime: number;
    speed: number;
    mouseParallax?: { x: number; y: number };
    enableBreathing?: boolean;
    clockTime?: number;
  }): void {
    const {
      deltaTime,
      speed = 1.0,
      mouseParallax = { x: 0, y: 0 },
      enableBreathing = true,
      clockTime = 0,
    } = options;

    // Faktor konvergensi eksponensial independen frame rate (~200-300ms transitif)
    const blendRate = 1 - Math.exp(-9.5 * speed * Math.min(deltaTime, 0.1));

    // 1. Slerp semua tulang ke target rotasi
    this.bonesMap.forEach((bone, name) => {
      const currentQ = this.currentQuaternions.get(name);
      const targetQ = this.targetQuaternions.get(name);

      if (currentQ && targetQ) {
        currentQ.slerp(targetQ, blendRate);
        bone.quaternion.copy(currentQ);
      }
    });

    // 2. Parallax Kursor Mouse / Sentuhan Halus pada Leher dan Kepala
    const headBone = this.bonesMap.get(RIAN_BONES.HEAD);
    const neckBone = this.bonesMap.get(RIAN_BONES.NECK);
    const spine2Bone = this.bonesMap.get(RIAN_BONES.SPINE2);

    if (headBone) {
      // Rotasi Y (menoleh kiri-kanan) dan X (mengangguk atas-bawah)
      const targetYaw = mouseParallax.x * 0.28;
      const targetPitch = -mouseParallax.y * 0.20;

      const parallaxEuler = new THREE.Euler(targetPitch, targetYaw, 0, "YXZ");
      const parallaxQ = new THREE.Quaternion().setFromEuler(parallaxEuler);
      headBone.quaternion.multiply(parallaxQ);
    }

    if (neckBone) {
      const neckParallax = new THREE.Euler(
        -mouseParallax.y * 0.08,
        mouseParallax.x * 0.12,
        0,
        "YXZ"
      );
      neckBone.quaternion.multiply(new THREE.Quaternion().setFromEuler(neckParallax));
    }

    if (spine2Bone) {
      const spineParallax = new THREE.Euler(0, mouseParallax.x * 0.05, 0, "XYZ");
      spine2Bone.quaternion.multiply(new THREE.Quaternion().setFromEuler(spineParallax));
    }

    // 3. Efek Pernapasan Halus Alami (Idle Breathing)
    if (enableBreathing) {
      const spine1Bone = this.bonesMap.get(RIAN_BONES.SPINE1);
      const hipsBone = this.bonesMap.get(RIAN_BONES.HIPS);

      const breathCycle = Math.sin(clockTime * 2.2);
      const breathPitch = breathCycle * 0.016; // dada mengembang naik turun

      if (spine1Bone) {
        const breathEuler = new THREE.Euler(breathPitch, 0, 0, "XYZ");
        spine1Bone.quaternion.multiply(new THREE.Quaternion().setFromEuler(breathEuler));
      }

      if (hipsBone) {
        hipsBone.position.y = 0.95 + breathCycle * 0.003;
      }
    }

    // 4. Dinamika Gestur Spesifik (Lambaian Tangan pada "Halo", Anggukan pada "Bisa")
    const lowerSign = this.activeSignKey.toLowerCase().replace(/[-_ ]/g, "_");

    if (lowerSign === "halo") {
      const rightHandBone = this.bonesMap.get(RIAN_BONES.RIGHT_HAND);
      if (rightHandBone) {
        const waveAngle = Math.sin(clockTime * 6.5 * speed) * 0.22;
        const waveEuler = new THREE.Euler(0, 0, waveAngle, "XYZ");
        rightHandBone.quaternion.multiply(new THREE.Quaternion().setFromEuler(waveEuler));
      }
    } else if (lowerSign === "bisa") {
      const headBone = this.bonesMap.get(RIAN_BONES.HEAD);
      if (headBone) {
        const nodAngle = Math.max(0, Math.sin(clockTime * 4.2 * speed)) * 0.08;
        const nodEuler = new THREE.Euler(nodAngle, 0, 0, "XYZ");
        headBone.quaternion.multiply(new THREE.Quaternion().setFromEuler(nodEuler));
      }
    } else if (lowerSign === "tidak") {
      const headBone = this.bonesMap.get(RIAN_BONES.HEAD);
      const rightHandBone = this.bonesMap.get(RIAN_BONES.RIGHT_HAND);
      if (headBone) {
        const shakeAngle = Math.sin(clockTime * 5.5 * speed) * 0.12;
        headBone.quaternion.multiply(
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, shakeAngle, 0, "XYZ"))
        );
      }
      if (rightHandBone) {
        const wagAngle = Math.sin(clockTime * 6.0 * speed) * 0.18;
        rightHandBone.quaternion.multiply(
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, wagAngle, "XYZ"))
        );
      }
    }
  }

  public getActiveSign(): string {
    return this.activeSignKey;
  }
}

