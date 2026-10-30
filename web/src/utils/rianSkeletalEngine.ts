/**
 * RIAN POLMAN 3D SKELETAL MOTION ENGINE
 * 
 * Modul kinematika tulang Mixamo 65-sendi untuk Avatar 3D Rian POLMAN.
 * Mengatur mapping sendi, interpolasi quaternion slerp halus dengan peredaman
 * dinamis (damping rate 7.0 - 9.0 * delta), secondary motion (follow-through)
 * pada pergelangan tangan, pernapasan idle organik (breathing wave),
 * responsivitas parallax lerp lembut (0.05), serta pustaka gestur BISINDO
 * dan ejaan alfabet (fingerspelling).
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

// 3. Kamus Alias Tulang untuk Fuzzy Bone Resolver (Case-Insensitive & Alias-Aware)
export const BONE_ALIASES: Record<string, string[]> = {
  [RIAN_BONES.HIPS]: ["hips", "pelvis", "mixamorig_hips", "mixamorighips"],
  [RIAN_BONES.SPINE]: ["spine", "spine0", "mixamorig_spine", "mixamorigspine"],
  [RIAN_BONES.SPINE1]: ["spine1", "chest", "mixamorig_spine1", "mixamorigspine1"],
  [RIAN_BONES.SPINE2]: ["spine2", "upperchest", "mixamorig_spine2", "mixamorigspine2"],
  [RIAN_BONES.NECK]: ["neck", "mixamorig_neck", "mixamorigneck"],
  [RIAN_BONES.HEAD]: ["head", "mixamorig_head", "mixamorighead"],

  // Lengan Kanan
  [RIAN_BONES.RIGHT_SHOULDER]: [
    "rightshoulder",
    "shoulder_r",
    "clavicle_r",
    "r_shoulder",
    "mixamorigrightshoulder",
  ],
  [RIAN_BONES.RIGHT_ARM]: [
    "rightarm",
    "arm_r",
    "rightupperarm",
    "upperarm_r",
    "mixamorigrightarm",
    "r_arm",
    "r_upperarm",
  ],
  [RIAN_BONES.RIGHT_FOREARM]: [
    "rightforearm",
    "forearm_r",
    "elbow_r",
    "lowerarm_r",
    "mixamorigrightforearm",
    "r_forearm",
    "r_elbow",
  ],
  [RIAN_BONES.RIGHT_HAND]: [
    "righthand",
    "hand_r",
    "wrist_r",
    "mixamorigrighthand",
    "r_hand",
    "r_wrist",
  ],

  // Lengan Kiri
  [RIAN_BONES.LEFT_SHOULDER]: [
    "leftshoulder",
    "shoulder_l",
    "clavicle_l",
    "l_shoulder",
    "mixamorigleftshoulder",
  ],
  [RIAN_BONES.LEFT_ARM]: [
    "leftarm",
    "arm_l",
    "leftupperarm",
    "upperarm_l",
    "mixamorigleftarm",
    "l_arm",
    "l_upperarm",
  ],
  [RIAN_BONES.LEFT_FOREARM]: [
    "leftforearm",
    "forearm_l",
    "elbow_l",
    "lowerarm_l",
    "mixamorigleftforearm",
    "l_forearm",
    "l_elbow",
  ],
  [RIAN_BONES.LEFT_HAND]: [
    "lefthand",
    "hand_l",
    "wrist_l",
    "mixamoriglefthand",
    "l_hand",
    "l_wrist",
  ],
};

// Daftarkan alias sendi 5 ruas jari tangan kanan dan kiri (Thumb, Index, Middle, Ring, Pinky dari 1 s/d 3)
(["Right", "Left"] as const).forEach((side) => {
  const pfx = side === "Right" ? "RightHand" : "LeftHand";
  const sShort = side === "Right" ? "r" : "l";
  (["Thumb", "Index", "Middle", "Ring", "Pinky"] as const).forEach((finger) => {
    [1, 2, 3].forEach((ruas) => {
      const canonicalKey = `${pfx}${finger}${ruas}`;
      BONE_ALIASES[canonicalKey] = [
        canonicalKey.toLowerCase(),
        `${side.toLowerCase()}${finger.toLowerCase()}${ruas}`,
        `${finger.toLowerCase()}_${sShort}_${ruas}`,
        `${finger.toLowerCase()}${ruas}_${sShort}`,
        `${side.toLowerCase()}_${finger.toLowerCase()}_${ruas}`,
        `mixamorig${canonicalKey.toLowerCase()}`,
      ];
    });
  });
});

/**
 * Fungsi Penemu Tulang Fleksibel (Case-Insensitive & Alias-Aware)
 * Mencari tulang dari daftar objek THREE.Bone berdasarkan kunci kanonikal standar.
 */
export function resolveBoneByAlias(
  canonicalKey: string,
  availableBones: THREE.Bone[]
): THREE.Bone | null {
  const aliases = BONE_ALIASES[canonicalKey] || [canonicalKey.toLowerCase()];
  const cleanKey = canonicalKey.toLowerCase().replace(/[^a-z0-9]/g, "");

  // 1. Cek kecocokan nama persis
  for (const bone of availableBones) {
    if (bone.name === canonicalKey) return bone;
  }

  // 2. Cek kecocokan bersih case-insensitive
  for (const bone of availableBones) {
    const cleanName = bone.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanName === cleanKey) return bone;
  }

  // 3. Cek daftar alias
  for (const bone of availableBones) {
    const cleanName = bone.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const alias of aliases) {
      const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleanName === cleanAlias || cleanName.endsWith(cleanAlias)) {
        return bone;
      }
    }
  }

  return null;
}

// Tipe rotasi per tulang: [rotX, rotY, rotZ] dalam radian
export type BoneEulerAngles = Record<string, [number, number, number]>;

/**
 * Generator konfigurasi jari untuk tangan kanan atau kiri.
 * Dilengkapi parameter curl utama (sumbu X) dan spread pemekaran (sumbu Z).
 */
function createFingerRotations(
  side: "Right" | "Left",
  config: {
    thumb?: [number, number, number];
    indexCurl?: number;
    middleCurl?: number;
    ringCurl?: number;
    pinkyCurl?: number;
    spread?: number;
  }
): BoneEulerAngles {
  const pfx = side === "Right" ? "RightHand" : "LeftHand";
  const result: BoneEulerAngles = {};

  const iCurl = config.indexCurl ?? 0;
  const mCurl = config.middleCurl ?? 0;
  const rCurl = config.ringCurl ?? 0;
  const pCurl = config.pinkyCurl ?? 0;
  const spread = config.spread ?? 0;
  const sign = side === "Right" ? 1 : -1;

  // Telunjuk (Index): curl pada sumbu X, pemekaran outward pada sumbu Z
  result[`${pfx}Index1`] = [iCurl * 0.45, 0, spread * 0.12 * sign];
  result[`${pfx}Index2`] = [iCurl * 0.35, 0, 0];
  result[`${pfx}Index3`] = [iCurl * 0.20, 0, 0];

  // Jari Tengah (Middle): poros tengah telapak
  result[`${pfx}Middle1`] = [mCurl * 0.45, 0, 0];
  result[`${pfx}Middle2`] = [mCurl * 0.35, 0, 0];
  result[`${pfx}Middle3`] = [mCurl * 0.20, 0, 0];

  // Jari Manis (Ring): curl dan pemekaran ke arah kelingking
  result[`${pfx}Ring1`] = [rCurl * 0.45, 0, -spread * 0.08 * sign];
  result[`${pfx}Ring2`] = [rCurl * 0.35, 0, 0];
  result[`${pfx}Ring3`] = [rCurl * 0.20, 0, 0];

  // Kelingking (Pinky): curl dan pemekaran outward terluar
  result[`${pfx}Pinky1`] = [pCurl * 0.45, 0, -spread * 0.16 * sign];
  result[`${pfx}Pinky2`] = [pCurl * 0.35, 0, 0];
  result[`${pfx}Pinky3`] = [pCurl * 0.20, 0, 0];

  // Jempol (Thumb)
  if (config.thumb) {
    result[`${pfx}Thumb1`] = [config.thumb[0], config.thumb[1], config.thumb[2]];
    result[`${pfx}Thumb2`] = [config.thumb[0] * 0.5, 0, 0];
  }

  return result;
}

// Konfigurasi Bentuk Tangan Anatomis Rileks & Kontras Tegas
const FIST_CURL = -1.68;
const OPEN_CURL = 0.08;

/**
 * Pustaka Preset Pose Kinematika Tubuh Bagian Atas BISINDO Rian POLMAN
 * Dirancang dalam Signing Space ergonomis (area dada tengah hingga dagu/wajah, y ~ 1.42 - 1.62).
 */
export const SKELETAL_POSE_LIBRARY: Record<string, BoneEulerAngles> = {
  // 1. Pose Netral / Signing Rest Pose (Posisi Siap Standar Juru Bahasa Isyarat)
  // Siku menekuk nyaman (~0.4 - 0.6 rad), tangan berada di depan perut bawah, jemari melengkung rileks.
  neutral: {
    [RIAN_BONES.SPINE]: [0, 0, 0],
    [RIAN_BONES.SPINE1]: [0.02, 0, 0],
    [RIAN_BONES.SPINE2]: [0.03, 0, 0],
    [RIAN_BONES.NECK]: [0.01, 0, 0],
    [RIAN_BONES.HEAD]: [0.02, 0, 0],
    [RIAN_BONES.RIGHT_ARM]: [-0.42, -0.15, 0.22],
    [RIAN_BONES.RIGHT_FOREARM]: [-0.95, 0.12, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.18, 0.25, -0.15],
    [RIAN_BONES.LEFT_ARM]: [-0.42, 0.15, -0.22],
    [RIAN_BONES.LEFT_FOREARM]: [-0.95, -0.12, -0.28],
    [RIAN_BONES.LEFT_HAND]: [0.18, -0.25, 0.15],
    ...createFingerRotations("Right", {
      thumb: [-0.2, -0.15, 0],
      indexCurl: -0.35,
      middleCurl: -0.38,
      ringCurl: -0.42,
      pinkyCurl: -0.45,
    }),
    ...createFingerRotations("Left", {
      thumb: [-0.2, 0.15, 0],
      indexCurl: -0.35,
      middleCurl: -0.38,
      ringCurl: -0.42,
      pinkyCurl: -0.45,
    }),
  },

  // 2. Pose Salam diBISAlitas & Bantuan (Kedua tangan terangkat ke depan dada tengah, telapak menghadap ke atas/depan dengan jari terbuka anggun)
  salam: {
    [RIAN_BONES.SPINE1]: [0.04, 0, 0],
    [RIAN_BONES.NECK]: [0.04, 0, 0],
    [RIAN_BONES.HEAD]: [0.05, 0, 0], // sedikit menunduk hormat
    [RIAN_BONES.RIGHT_SHOULDER]: [-0.08, 0.04, -0.08],
    [RIAN_BONES.RIGHT_ARM]: [-0.96, -0.18, 0.38],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.68, 0.12, 0.32],
    [RIAN_BONES.RIGHT_HAND]: [0.36, 0.42, -0.22],
    [RIAN_BONES.LEFT_SHOULDER]: [0.08, -0.04, 0.08],
    [RIAN_BONES.LEFT_ARM]: [-0.96, 0.18, -0.38],
    [RIAN_BONES.LEFT_FOREARM]: [-1.68, -0.12, -0.32],
    [RIAN_BONES.LEFT_HAND]: [0.36, -0.42, 0.22],
    ...createFingerRotations("Right", {
      thumb: [0.3, -0.4, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
      spread: 0.45,
    }),
    ...createFingerRotations("Left", {
      thumb: [0.3, 0.4, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
      spread: 0.45,
    }),
  },

  // 3. Pose Kata "Halo" / "Sapa" (Tangan kanan terangkat tinggi setinggi pelipis/kepala, siap melambai)
  halo: {
    [RIAN_BONES.SPINE1]: [0.02, -0.03, 0],
    [RIAN_BONES.HEAD]: [-0.02, -0.06, 0],
    [RIAN_BONES.RIGHT_SHOULDER]: [-0.08, 0.06, -0.12],
    [RIAN_BONES.RIGHT_ARM]: [-0.96, 0.22, -0.88],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.86, -0.32, 0.22],
    [RIAN_BONES.RIGHT_HAND]: [0.36, 0.50, -0.22],
    [RIAN_BONES.LEFT_ARM]: [-0.48, 0.15, -0.20],
    [RIAN_BONES.LEFT_FOREARM]: [-1.05, -0.10, -0.20],
    [RIAN_BONES.LEFT_HAND]: [0.15, -0.20, 0.10],
    ...createFingerRotations("Right", {
      thumb: [0.35, -0.45, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
      spread: 0.55,
    }),
    ...createFingerRotations("Left", {
      thumb: [-0.18, 0.12, 0],
      indexCurl: -0.35,
      middleCurl: -0.4,
      ringCurl: -0.42,
      pinkyCurl: -0.45,
    }),
  },

  // 4. Pose Kata "Terima Kasih" (Tangan kanan menyentuh dagu/mulut lalu bergerak maju terbuka)
  terima_kasih: {
    [RIAN_BONES.SPINE1]: [0.04, 0, 0],
    [RIAN_BONES.HEAD]: [0.07, 0, 0], // anggukan terima kasih
    [RIAN_BONES.RIGHT_SHOULDER]: [-0.08, 0.04, -0.08],
    [RIAN_BONES.RIGHT_ARM]: [-1.08, -0.26, 0.38],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.68, -0.12, 0.25],
    [RIAN_BONES.RIGHT_HAND]: [0.52, 0.28, -0.32],
    [RIAN_BONES.LEFT_ARM]: [-0.48, 0.15, -0.20],
    [RIAN_BONES.LEFT_FOREARM]: [-1.05, -0.10, -0.20],
    [RIAN_BONES.LEFT_HAND]: [0.15, -0.20, 0.10],
    ...createFingerRotations("Right", {
      thumb: [0.25, -0.35, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
      spread: 0.05, // Jari rapat lurus di dagu
    }),
    ...createFingerRotations("Left", {
      thumb: [-0.18, 0.12, 0],
      indexCurl: -0.35,
      middleCurl: -0.4,
      ringCurl: -0.42,
      pinkyCurl: -0.45,
    }),
  },

  // 5. Pose Kata "Bisa" (Tangan kanan terangkat mantap di dada dengan kepalan rapat dan acungan jempol tegas)
  bisa: {
    [RIAN_BONES.SPINE1]: [0.03, -0.02, 0],
    [RIAN_BONES.HEAD]: [0.06, 0, 0],
    [RIAN_BONES.RIGHT_SHOULDER]: [-0.08, 0.04, -0.08],
    [RIAN_BONES.RIGHT_ARM]: [-0.94, -0.20, 0.35],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.68, 0.10, 0.32],
    [RIAN_BONES.RIGHT_HAND]: [0.32, 0.38, -0.22],
    [RIAN_BONES.LEFT_ARM]: [-0.48, 0.15, -0.20],
    [RIAN_BONES.LEFT_FOREARM]: [-1.05, -0.10, -0.20],
    [RIAN_BONES.LEFT_HAND]: [0.15, -0.20, 0.10],
    ...createFingerRotations("Right", {
      thumb: [0.65, -0.85, 0.30], // Jempol tegak lurus mengacung kuat ke atas
      indexCurl: FIST_CURL,
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
    ...createFingerRotations("Left", {
      thumb: [-0.18, 0.12, 0],
      indexCurl: -0.35,
      middleCurl: -0.4,
      ringCurl: -0.42,
      pinkyCurl: -0.45,
    }),
  },

  // 6. Pose Kata "Tolong" / "Bantuan" (Kedua tangan terangkat di depan dada tengah menengadah)
  tolong: {
    [RIAN_BONES.SPINE1]: [0.04, 0, 0],
    [RIAN_BONES.HEAD]: [0.04, 0, 0],
    [RIAN_BONES.RIGHT_SHOULDER]: [-0.08, 0.04, -0.08],
    [RIAN_BONES.RIGHT_ARM]: [-0.92, -0.20, 0.34],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.62, 0.14, 0.32],
    [RIAN_BONES.RIGHT_HAND]: [0.40, 0.48, -0.24],
    [RIAN_BONES.LEFT_SHOULDER]: [0.08, -0.04, 0.08],
    [RIAN_BONES.LEFT_ARM]: [-0.92, 0.20, -0.34],
    [RIAN_BONES.LEFT_FOREARM]: [-1.62, -0.14, -0.32],
    [RIAN_BONES.LEFT_HAND]: [0.40, -0.48, 0.24],
    ...createFingerRotations("Right", {
      thumb: [0.3, -0.4, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
      spread: 0.35,
    }),
    ...createFingerRotations("Left", {
      thumb: [0.3, 0.4, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
      spread: 0.35,
    }),
  },

  // 7. Pose Kata "Pemetaan" / "Komunitas" (Kedua tangan menyapu secara dinamis di depan dada tengah)
  pemetaan: {
    [RIAN_BONES.SPINE1]: [0.03, 0, 0],
    [RIAN_BONES.HEAD]: [0.03, 0, 0],
    [RIAN_BONES.RIGHT_ARM]: [-0.90, -0.24, 0.35],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.60, 0.12, 0.30],
    [RIAN_BONES.RIGHT_HAND]: [0.32, 0.45, -0.24],
    [RIAN_BONES.LEFT_ARM]: [-0.90, 0.24, -0.35],
    [RIAN_BONES.LEFT_FOREARM]: [-1.60, -0.12, -0.30],
    [RIAN_BONES.LEFT_HAND]: [0.32, -0.45, 0.24],
    ...createFingerRotations("Right", {
      thumb: [0.25, -0.35, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
      spread: 0.40,
    }),
    ...createFingerRotations("Left", {
      thumb: [0.25, 0.35, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
      spread: 0.40,
    }),
  },

  // 8. Pose Default Signing (Conversational Explaining: kedua tangan terangkat di depan dada tengah, siku menekuk ekspresif)
  default_signing: {
    [RIAN_BONES.SPINE1]: [0.04, 0, 0],
    [RIAN_BONES.HEAD]: [0.03, 0, 0],
    [RIAN_BONES.RIGHT_SHOULDER]: [-0.06, 0.03, -0.06],
    [RIAN_BONES.RIGHT_ARM]: [-0.90, -0.20, 0.36],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.62, 0.12, 0.30],
    [RIAN_BONES.RIGHT_HAND]: [0.32, 0.34, -0.20],
    [RIAN_BONES.LEFT_SHOULDER]: [0.06, -0.03, 0.06],
    [RIAN_BONES.LEFT_ARM]: [-0.82, 0.18, -0.32],
    [RIAN_BONES.LEFT_FOREARM]: [-1.50, -0.12, -0.28],
    [RIAN_BONES.LEFT_HAND]: [0.30, -0.34, 0.20],
    ...createFingerRotations("Right", {
      thumb: [0.3, -0.35, 0],
      indexCurl: -0.18,
      middleCurl: -0.22,
      ringCurl: -0.40,
      pinkyCurl: -0.40,
      spread: 0.25,
    }),
    ...createFingerRotations("Left", {
      thumb: [0.3, 0.35, 0],
      indexCurl: -0.22,
      middleCurl: -0.25,
      ringCurl: -0.40,
      pinkyCurl: -0.40,
      spread: 0.25,
    }),
  },

  // 9. Pose Kata "Satu" / "Paham" / "Isyarat" (Telunjuk tegak mengarah ke atas di depan dada tengah)
  satu: {
    [RIAN_BONES.SPINE1]: [0.03, 0, 0],
    [RIAN_BONES.HEAD]: [0.03, 0, 0],
    [RIAN_BONES.RIGHT_ARM]: [-0.92, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.65, 0.10, 0.30],
    [RIAN_BONES.RIGHT_HAND]: [0.28, 0.30, -0.18],
    [RIAN_BONES.LEFT_ARM]: [-0.48, 0.15, -0.20],
    [RIAN_BONES.LEFT_FOREARM]: [-1.05, -0.10, -0.20],
    [RIAN_BONES.LEFT_HAND]: [0.15, -0.20, 0.10],
    ...createFingerRotations("Right", {
      thumb: [0.45, -0.55, 0],
      indexCurl: OPEN_CURL,
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
    ...createFingerRotations("Left", {
      thumb: [-0.2, 0.15, 0],
      indexCurl: -0.35,
      middleCurl: -0.38,
      ringCurl: -0.42,
      pinkyCurl: -0.45,
    }),
  },

  // 7. Pose Kata "Ya" (Kepalan tangan di dada tengah mengangguk tegas ke bawah)
  ya: {
    [RIAN_BONES.SPINE1]: [0.05, 0, 0],
    [RIAN_BONES.HEAD]: [0.12, 0, 0], // anggukan tegas
    [RIAN_BONES.RIGHT_ARM]: [-0.92, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.65, 0.05, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.45, 0.20, -0.25],
    ...createFingerRotations("Right", {
      thumb: [0.3, -0.45, 0],
      indexCurl: FIST_CURL,
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
  },

  // 8. Pose Kata "Tidak" (Telunjuk kanan tegak di depan dada tengah menggeleng)
  tidak: {
    [RIAN_BONES.SPINE1]: [0.03, 0, 0],
    [RIAN_BONES.HEAD]: [0, -0.08, 0],
    [RIAN_BONES.RIGHT_ARM]: [-0.90, -0.16, 0.30],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.68, 0.10, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.18, 0.28, -0.14],
    ...createFingerRotations("Right", {
      thumb: [0.45, -0.55, 0],
      indexCurl: OPEN_CURL, // Telunjuk tegak
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
  },

  // ===== GESTUR ALFABET BISINDO (Fingerspelling di Dada Tengah) =====

  // Huruf A: Kepalan dengan jempol menempel di samping telunjuk
  A: {
    [RIAN_BONES.RIGHT_ARM]: [-0.88, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.62, 0.10, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.26, 0.28, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.2, -0.35, 0],
      indexCurl: FIST_CURL,
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
  },

  // Huruf B: 4 jari tegak rapat, jempol ditekuk di depan telapak
  B: {
    [RIAN_BONES.RIGHT_ARM]: [-0.88, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.62, 0.10, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.24, 0.28, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.55, -0.65, 0.2], // jempol melipat ke telapak
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: OPEN_CURL,
      pinkyCurl: OPEN_CURL,
      spread: 0.05,
    }),
  },

  // Huruf C: Jari-jari dan jempol melengkung membentuk busur "C"
  C: {
    [RIAN_BONES.RIGHT_ARM]: [-0.88, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.60, 0.12, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.20, 0.36, -0.22],
    ...createFingerRotations("Right", {
      thumb: [0.45, -0.45, 0],
      indexCurl: -0.75,
      middleCurl: -0.75,
      ringCurl: -0.75,
      pinkyCurl: -0.75,
    }),
  },

  // Huruf D: Telunjuk tegak, jari tengah dan jempol bertemu melingkar
  D: {
    [RIAN_BONES.RIGHT_ARM]: [-0.88, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.62, 0.10, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.24, 0.28, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.45, -0.50, 0],
      indexCurl: OPEN_CURL,
      middleCurl: -1.3,
      ringCurl: -1.3,
      pinkyCurl: -1.3,
    }),
  },

  // Huruf E: Ujung seluruh jari menekuk menyentuh jempol
  E: {
    [RIAN_BONES.RIGHT_ARM]: [-0.88, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.60, 0.12, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.24, 0.26, -0.16],
    ...createFingerRotations("Right", {
      thumb: [0.45, -0.40, 0],
      indexCurl: -1.25,
      middleCurl: -1.25,
      ringCurl: -1.25,
      pinkyCurl: -1.25,
    }),
  },

  // Huruf I: Kelingking tegak lurus, jari lain mengepal
  I: {
    [RIAN_BONES.RIGHT_ARM]: [-0.88, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.62, 0.10, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.24, 0.28, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.30, -0.40, 0],
      indexCurl: FIST_CURL,
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: OPEN_CURL, // Kelingking tegak
    }),
  },

  // Huruf L: Jempol dan telunjuk membentuk sudut 90 derajat siku "L"
  L: {
    [RIAN_BONES.RIGHT_ARM]: [-0.88, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.62, 0.10, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.24, 0.28, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.65, -0.85, 0.30], // Jempol keluar horizontal
      indexCurl: OPEN_CURL,       // Telunjuk ke atas
      middleCurl: FIST_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
    }),
  },

  // Huruf O: Ujung seluruh jari melengkung bertemu jempol membentuk lingkaran "O"
  O: {
    [RIAN_BONES.RIGHT_ARM]: [-0.88, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.60, 0.12, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.20, 0.34, -0.20],
    ...createFingerRotations("Right", {
      thumb: [0.55, -0.60, 0],
      indexCurl: -1.05,
      middleCurl: -1.05,
      ringCurl: -1.05,
      pinkyCurl: -1.05,
    }),
  },

  // Huruf U: Telunjuk dan jari tengah tegak rapat sejajar
  U: {
    [RIAN_BONES.RIGHT_ARM]: [-0.88, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.62, 0.10, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.24, 0.28, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.40, -0.50, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
      spread: 0.05,
    }),
  },

  // Huruf V: Telunjuk dan jari tengah terbuka membentuk huruf "V" (peace)
  V: {
    [RIAN_BONES.RIGHT_ARM]: [-0.88, -0.18, 0.32],
    [RIAN_BONES.RIGHT_FOREARM]: [-1.62, 0.10, 0.28],
    [RIAN_BONES.RIGHT_HAND]: [0.24, 0.28, -0.18],
    ...createFingerRotations("Right", {
      thumb: [0.40, -0.50, 0],
      indexCurl: OPEN_CURL,
      middleCurl: OPEN_CURL,
      ringCurl: FIST_CURL,
      pinkyCurl: FIST_CURL,
      spread: 0.45,
    }),
  },
};

// Aliaskan variasi nama isyarat ke preset kunci utama
SKELETAL_POSE_LIBRARY.bantuan = SKELETAL_POSE_LIBRARY.tolong;
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
SKELETAL_POSE_LIBRARY.komunitas = SKELETAL_POSE_LIBRARY.pemetaan;
SKELETAL_POSE_LIBRARY.peta = SKELETAL_POSE_LIBRARY.pemetaan;
SKELETAL_POSE_LIBRARY.paham = SKELETAL_POSE_LIBRARY.satu;
SKELETAL_POSE_LIBRARY.isyarat = SKELETAL_POSE_LIBRARY.satu;
SKELETAL_POSE_LIBRARY.poin = SKELETAL_POSE_LIBRARY.satu;
SKELETAL_POSE_LIBRARY.telunjuk = SKELETAL_POSE_LIBRARY.satu;
SKELETAL_POSE_LIBRARY.idle = SKELETAL_POSE_LIBRARY.neutral;

/**
 * Mengambil pose target berdasarkan kata, frase, atau huruf.
 * Seluruh kata aktif DIWAJIBKAN mengangkat lengan ke signing space (dada ke wajah).
 * Hanya kata netral/idle/pause/istirahat yang mengembalikan pose netral rileks.
 * Jika kata tidak ada di pustaka khusus, default_signing yang digunakan (BUKAN netral).
 */
export function resolveSkeletalPose(signKey: string): BoneEulerAngles {
  if (!signKey || typeof signKey !== "string") {
    return SKELETAL_POSE_LIBRARY.neutral;
  }

  const raw = signKey.trim();
  const lower = raw.toLowerCase().replace(/[-_ ]/g, "_");

  // Jika kata secara eksplisit adalah netral / idle / pause / istirahat / string kosong
  if (
    lower === "neutral" ||
    lower === "idle" ||
    lower === "pause" ||
    lower === "istirahat" ||
    lower === "siap" ||
    lower === ""
  ) {
    return SKELETAL_POSE_LIBRARY.neutral;
  }

  // 1. Cek kunci persis di SKELETAL_POSE_LIBRARY
  if (SKELETAL_POSE_LIBRARY[lower]) {
    return SKELETAL_POSE_LIBRARY[lower];
  }

  // 2. Cek fingerspelling huruf alfabet tunggal (A-Z)
  if (raw.length === 1 && /[a-zA-Z]/.test(raw)) {
    const char = raw.toUpperCase();
    if (SKELETAL_POSE_LIBRARY[char]) {
      return SKELETAL_POSE_LIBRARY[char];
    }
    // Fallback alfabet umum: tangan terangkat di dada tengah memperagakan bentuk huruf
    return {
      ...SKELETAL_POSE_LIBRARY.default_signing,
      [RIAN_BONES.RIGHT_ARM]: [-0.88, -0.18, 0.32],
      [RIAN_BONES.RIGHT_FOREARM]: [-1.62, 0.10, 0.28],
      [RIAN_BONES.RIGHT_HAND]: [0.26, 0.28, -0.18],
      ...createFingerRotations("Right", {
        thumb: [0.35, -0.4, 0],
        indexCurl: OPEN_CURL,
        middleCurl: -0.6,
        ringCurl: -1.0,
        pinkyCurl: -1.0,
      }),
    };
  }

  // 3. Pencocokan Semantik Berdasarkan Kata Kunci (Keyword Semantic Matching)
  // Salam & Penghormatan
  if (
    lower.includes("salam") ||
    lower.includes("hormat") ||
    lower.includes("jantung") ||
    lower.includes("dada") ||
    lower.includes("sama_sama")
  ) {
    return SKELETAL_POSE_LIBRARY.salam;
  }

  // Bantuan & Tolong
  if (
    lower.includes("tolong") ||
    lower.includes("bantu") ||
    lower.includes("bantuan")
  ) {
    return SKELETAL_POSE_LIBRARY.tolong;
  }

  // Sapaan / Halo
  if (
    lower.includes("halo") ||
    lower.includes("hai") ||
    lower.includes("sapa") ||
    lower.includes("pagi") ||
    lower.includes("siang") ||
    lower.includes("sore") ||
    lower.includes("malam") ||
    lower.includes("datang") ||
    lower.includes("kabar")
  ) {
    return SKELETAL_POSE_LIBRARY.halo;
  }

  // Terima Kasih
  if (
    lower.includes("terima") ||
    lower.includes("kasih") ||
    lower.includes("makasih") ||
    lower.includes("dagu") ||
    lower.includes("bibir")
  ) {
    return SKELETAL_POSE_LIBRARY.terima_kasih;
  }

  // Bisa / Optimisme / Kemandirian
  if (
    lower.includes("bisa") ||
    lower.includes("mampu") ||
    lower.includes("sukses") ||
    lower.includes("jempol") ||
    lower.includes("cerdas") ||
    lower.includes("unggul") ||
    lower.includes("pasti")
  ) {
    return SKELETAL_POSE_LIBRARY.bisa;
  }

  // Penunjuk Satu / Paham / Isyarat
  if (
    lower.includes("satu") ||
    lower.includes("paham") ||
    lower.includes("isyarat") ||
    lower.includes("poin") ||
    lower.includes("telunjuk")
  ) {
    return SKELETAL_POSE_LIBRARY.satu;
  }

  // Pemetaan / Komunitas / Navigasi / Fitur
  if (
    lower.includes("peta") ||
    lower.includes("pemetaan") ||
    lower.includes("komunitas") ||
    lower.includes("wilayah") ||
    lower.includes("ekosistem") ||
    lower.includes("lingkungan")
  ) {
    return SKELETAL_POSE_LIBRARY.pemetaan;
  }

  // Persetujuan / Ya
  if (
    lower.includes("ya") ||
    lower.includes("setuju") ||
    lower.includes("oke") ||
    lower.includes("benar") ||
    lower.includes("fist")
  ) {
    return SKELETAL_POSE_LIBRARY.ya;
  }

  // Penolakan / Tidak
  if (
    lower.includes("tidak") ||
    lower.includes("bukan") ||
    lower.includes("jangan") ||
    lower.includes("tolak")
  ) {
    return SKELETAL_POSE_LIBRARY.tidak;
  }

  // 4. Default Fallback untuk seluruh kata aktif lainnya:
  // JANGAN PERNAH biarkan tangan menggantung di samping! Wajib selalu terangkat di signing space!
  return SKELETAL_POSE_LIBRARY.default_signing;
}

/**
 * Kelas Interpolator Kinematika untuk Karakter Rian 3D
 * Dilengkapi Fuzzy Bone Resolver, peredaman dinamis (9.0 * delta),
 * secondary motion follow-through, respirasi idle organik, dan parallax peredaman lerp lembut (0.05).
 */
export class RianSkeletalController {
  private bonesMap: Map<string, THREE.Bone> = new Map();
  private restQuaternions: Map<string, THREE.Quaternion> = new Map();
  private currentQuaternions: Map<string, THREE.Quaternion> = new Map();
  private targetQuaternions: Map<string, THREE.Quaternion> = new Map();
  private activeSignKey: string = "neutral";
  public readonly mappedJointsCount: number = 0;

  // Koordinat parallax kursor internal dengan peredaman lerp lembut
  private currentParallax: { x: number; y: number } = { x: 0, y: 0 };

  // Buffer secondary motion (follow-through lag) untuk pergelangan tangan
  private rightHandLagQ: THREE.Quaternion = new THREE.Quaternion();
  private leftHandLagQ: THREE.Quaternion = new THREE.Quaternion();

  // Pewaktu impuls transisi dinamis (ayunan melengkung di signing space antar-kata)
  private transitionTimer: number = 0;

  public constructor(bones: THREE.Bone[]) {
    // 1. Simpan semua tulang asli berdasarkan namanya
    bones.forEach((bone) => {
      this.bonesMap.set(bone.name, bone);
      this.restQuaternions.set(bone.name, bone.quaternion.clone());
      this.currentQuaternions.set(bone.name, bone.quaternion.clone());
      this.targetQuaternions.set(bone.name, bone.quaternion.clone());
    });

    // 2. Petakan setiap kunci kanonikal dari BONE_ALIASES menggunakan Fuzzy Bone Resolver
    let mappedCount = 0;
    Object.keys(BONE_ALIASES).forEach((canonicalKey) => {
      let resolvedBone: THREE.Bone | null | undefined = this.bonesMap.get(canonicalKey);
      if (!resolvedBone) {
        resolvedBone = resolveBoneByAlias(canonicalKey, bones);
      }

      if (resolvedBone) {
        mappedCount++;
        this.bonesMap.set(canonicalKey, resolvedBone);
        if (!this.restQuaternions.has(canonicalKey)) {
          this.restQuaternions.set(canonicalKey, resolvedBone.quaternion.clone());
          this.currentQuaternions.set(canonicalKey, resolvedBone.quaternion.clone());
          this.targetQuaternions.set(canonicalKey, resolvedBone.quaternion.clone());
        }
      }
    });

    this.mappedJointsCount = mappedCount;

    // Log ringkas satu baris saat model dimuat (sesuai instruksi pengerjaan)
    console.log(`[Rian3D] Bones mapped: ${mappedCount} joints`);

    const initRightHand = this.restQuaternions.get(RIAN_BONES.RIGHT_HAND);
    if (initRightHand) this.rightHandLagQ.copy(initRightHand);

    const initLeftHand = this.restQuaternions.get(RIAN_BONES.LEFT_HAND);
    if (initLeftHand) this.leftHandLagQ.copy(initLeftHand);

    this.setTargetSign("neutral");
  }

  /**
   * Menetapkan pose isyarat target baru
   */
  public setTargetSign(signKey: string): void {
    if (signKey !== this.activeSignKey) {
      this.transitionTimer = 0.45; // Picu dorongan ayunan transisi dinamis 450ms
    }
    this.activeSignKey = signKey;
    const pose = resolveSkeletalPose(signKey);

    // Reset seluruh target ke rest pose terlebih dahulu
    this.restQuaternions.forEach((restQ, boneKey) => {
      this.targetQuaternions.set(boneKey, restQ.clone());
    });

    // Terapkan rotasi target dari preset
    const tempEuler = new THREE.Euler(0, 0, 0, "XYZ");
    const deltaQ = new THREE.Quaternion();

    Object.entries(pose).forEach(([boneKey, angles]) => {
      const restQ = this.restQuaternions.get(boneKey);
      if (!restQ) return;

      tempEuler.set(angles[0], angles[1], angles[2], "XYZ");
      deltaQ.setFromEuler(tempEuler);

      // Gabungkan rotasi dasar dengan rotasi pose
      const finalQ = restQ.clone().multiply(deltaQ);
      this.targetQuaternions.set(boneKey, finalQ);
    });
  }

  /**
   * Pembaruan per-frame menggunakan Quaternion Slerp halus dengan peredaman (damping rate 9.0 * delta)
   * Dilengkapi secondary motion follow-through pada pergelangan tangan,
   * pernapasan idle organik menggunakan gelombang sinus Math.sin(time * 1.8),
   * parallax lerp peredaman lembut (0.05), ayunan transisi melengkung antar-kata,
   * serta animasi dinamis kontinu saat isyarat aktif.
   */
  public update(options: {
    deltaTime: number;
    speed: number;
    mouseParallax?: { x: number; y: number };
    enableBreathing?: boolean;
    clockTime?: number;
    isAnimating?: boolean;
  }): void {
    const {
      deltaTime,
      speed = 1.0,
      mouseParallax = { x: 0, y: 0 },
      enableBreathing = true,
      clockTime = 0,
      isAnimating = true,
    } = options;

    const clampedDelta = Math.min(deltaTime, 0.1);

    // 1. Damping rate halus untuk sendi tubuh (9.0 * delta)
    const dampingBody = 1 - Math.exp(-9.0 * speed * clampedDelta);

    // Secondary motion: follow-through lag pergelangan tangan (laju slerp sedikit lebih santai ~7.2 * delta)
    const dampingHand = 1 - Math.exp(-7.2 * speed * clampedDelta);

    // Slerp semua tulang ke target rotasi
    // Gunakan Set untuk mencegah pemrosesan ganda jika sebuah bone dipetakan ke lebih dari satu alias
    const processedBones = new Set<THREE.Bone>();

    this.bonesMap.forEach((bone, key) => {
      if (processedBones.has(bone)) return;
      processedBones.add(bone);

      const currentQ = this.currentQuaternions.get(key);
      const targetQ = this.targetQuaternions.get(key);

      if (!currentQ || !targetQ) return;

      if (key === RIAN_BONES.RIGHT_HAND) {
        // Terapkan follow-through lag pada pergelangan tangan kanan
        this.rightHandLagQ.slerp(targetQ, dampingHand);
        currentQ.slerp(this.rightHandLagQ, dampingBody);
      } else if (key === RIAN_BONES.LEFT_HAND) {
        // Terapkan follow-through lag pada pergelangan tangan kiri
        this.leftHandLagQ.slerp(targetQ, dampingHand);
        currentQ.slerp(this.leftHandLagQ, dampingBody);
      } else {
        currentQ.slerp(targetQ, dampingBody);
      }

      bone.quaternion.copy(currentQ);
    });

    // 2. Responsivitas Mouse / Touch Parallax Halus (Peredaman Lerp Faktor 0.05 per frame)
    const lerpFactor = Math.min(1.0, 0.05 * 60 * clampedDelta);
    this.currentParallax.x += (mouseParallax.x - this.currentParallax.x) * lerpFactor;
    this.currentParallax.y += (mouseParallax.y - this.currentParallax.y) * lerpFactor;

    const headBone = this.bonesMap.get(RIAN_BONES.HEAD);
    const neckBone = this.bonesMap.get(RIAN_BONES.NECK);
    const spine2Bone = this.bonesMap.get(RIAN_BONES.SPINE2);

    if (headBone) {
      const targetYaw = this.currentParallax.x * 0.26;
      const targetPitch = -this.currentParallax.y * 0.18;
      const parallaxEuler = new THREE.Euler(targetPitch, targetYaw, 0, "YXZ");
      headBone.quaternion.multiply(new THREE.Quaternion().setFromEuler(parallaxEuler));
    }

    if (neckBone) {
      const neckEuler = new THREE.Euler(
        -this.currentParallax.y * 0.08,
        this.currentParallax.x * 0.12,
        0,
        "YXZ"
      );
      neckBone.quaternion.multiply(new THREE.Quaternion().setFromEuler(neckEuler));
    }

    if (spine2Bone) {
      const spineEuler = new THREE.Euler(0, this.currentParallax.x * 0.05, 0, "XYZ");
      spine2Bone.quaternion.multiply(new THREE.Quaternion().setFromEuler(spineEuler));
    }

    // 3. Sistem Idle Organik (Pernapasan & Posisi Rileks)
    // Siklus napas alami menggunakan Math.sin(clockTime * 1.8)
    if (enableBreathing) {
      const spine1Bone = this.bonesMap.get(RIAN_BONES.SPINE1);
      const spine2Bone = this.bonesMap.get(RIAN_BONES.SPINE2);
      const rightShoulder = this.bonesMap.get(RIAN_BONES.RIGHT_SHOULDER);
      const leftShoulder = this.bonesMap.get(RIAN_BONES.LEFT_SHOULDER);
      const hipsBone = this.bonesMap.get(RIAN_BONES.HIPS);

      const breathWave = Math.sin(clockTime * 1.8);

      // Dada naik-turun dan membusung mikro
      const chestPitch = breathWave * 0.02;
      const chestEuler = new THREE.Euler(chestPitch, 0, 0, "XYZ");
      const chestQ = new THREE.Quaternion().setFromEuler(chestEuler);

      if (spine1Bone) {
        spine1Bone.quaternion.multiply(chestQ);
      }
      if (spine2Bone) {
        const subtlePitch = new THREE.Euler(breathWave * 0.012, 0, 0, "XYZ");
        spine2Bone.quaternion.multiply(new THREE.Quaternion().setFromEuler(subtlePitch));
      }

      // Bahu terangkat halus mengikuti tarikan napas
      const shoulderLift = Math.max(0, breathWave) * 0.008;
      if (rightShoulder) {
        const rShoulderEuler = new THREE.Euler(0, 0, shoulderLift, "XYZ");
        rightShoulder.quaternion.multiply(new THREE.Quaternion().setFromEuler(rShoulderEuler));
      }
      if (leftShoulder) {
        const lShoulderEuler = new THREE.Euler(0, 0, -shoulderLift, "XYZ");
        leftShoulder.quaternion.multiply(new THREE.Quaternion().setFromEuler(lShoulderEuler));
      }

      // Mikro pergeseran vertikal pinggul
      if (hipsBone) {
        hipsBone.position.y = 0.95 + breathWave * 0.002;
      }
    }

    // 4. Ayunan Dinamis Transisi Antar-Kata (Anticipation & Arced Stroke di Signing Space)
    if (this.transitionTimer > 0) {
      this.transitionTimer = Math.max(0, this.transitionTimer - clampedDelta * speed);
    }
    const transitionWave =
      this.transitionTimer > 0
        ? Math.sin((this.transitionTimer / 0.45) * Math.PI)
        : 0;

    if (transitionWave > 0) {
      const rForeArm = this.bonesMap.get(RIAN_BONES.RIGHT_FOREARM);
      const rHand = this.bonesMap.get(RIAN_BONES.RIGHT_HAND);
      const lForeArm = this.bonesMap.get(RIAN_BONES.LEFT_FOREARM);
      const lHand = this.bonesMap.get(RIAN_BONES.LEFT_HAND);

      const arcPitch = transitionWave * 0.16;
      const arcRoll = transitionWave * 0.12;

      if (rForeArm) {
        rForeArm.quaternion.multiply(
          new THREE.Quaternion().setFromEuler(new THREE.Euler(arcPitch, 0, arcRoll, "XYZ"))
        );
      }
      if (rHand) {
        rHand.quaternion.multiply(
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(arcPitch * 0.7, arcRoll, -arcRoll * 0.6, "XYZ")
          )
        );
      }
      if (lForeArm) {
        lForeArm.quaternion.multiply(
          new THREE.Quaternion().setFromEuler(new THREE.Euler(arcPitch * 0.7, 0, -arcRoll * 0.7, "XYZ"))
        );
      }
      if (lHand) {
        lHand.quaternion.multiply(
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(arcPitch * 0.5, -arcRoll * 0.8, arcRoll * 0.5, "XYZ")
          )
        );
      }
    }

    // 5. Dinamika Gestur Berkelanjutan (Lambaian Tangan, Dorongan Terima Kasih, Hentakan Jempol, Pulsa Isyarat di Signing Space)
    if (isAnimating) {
      const lowerSign = (this.activeSignKey || "").toLowerCase().replace(/[-_ ]/g, "_");

      if (
        lowerSign === "halo" ||
        lowerSign.includes("halo") ||
        lowerSign.includes("sapa") ||
        lowerSign.includes("pagi") ||
        lowerSign.includes("siang") ||
        lowerSign.includes("sore") ||
        lowerSign.includes("malam")
      ) {
        // Melambai nyata bolak-balik di samping pelipis/kepala (sinusoidal Math.sin(clockTime * 8) * 0.32)
        const rightHandBone = this.bonesMap.get(RIAN_BONES.RIGHT_HAND);
        const rightForeArmBone = this.bonesMap.get(RIAN_BONES.RIGHT_FOREARM);

        if (rightHandBone) {
          const waveAngle = Math.sin(clockTime * 8.0 * speed) * 0.32;
          const pitchAngle = Math.cos(clockTime * 8.0 * speed) * 0.10;
          const waveEuler = new THREE.Euler(pitchAngle, 0, waveAngle, "XYZ");
          rightHandBone.quaternion.multiply(new THREE.Quaternion().setFromEuler(waveEuler));
        }
        if (rightForeArmBone) {
          const swayAngle = Math.sin(clockTime * 8.0 * speed) * 0.08;
          const swayEuler = new THREE.Euler(0, swayAngle, 0, "XYZ");
          rightForeArmBone.quaternion.multiply(new THREE.Quaternion().setFromEuler(swayEuler));
        }
      } else if (
        lowerSign === "terima_kasih" ||
        lowerSign.includes("terima") ||
        lowerSign.includes("kasih") ||
        lowerSign.includes("makasih")
      ) {
        // Transisi dorongan tangan kanan dari dagu/mulut ke depan-bawah menuju lawan bicara
        const rightForeArmBone = this.bonesMap.get(RIAN_BONES.RIGHT_FOREARM);
        const rightHandBone = this.bonesMap.get(RIAN_BONES.RIGHT_HAND);
        const headBone = this.bonesMap.get(RIAN_BONES.HEAD);
        const pushWave = Math.sin(clockTime * 4.2 * speed);

        if (rightForeArmBone) {
          const pushAngle = pushWave * 0.18;
          rightForeArmBone.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(pushAngle, 0, pushAngle * 0.06, "XYZ"))
          );
        }
        if (rightHandBone) {
          const handPitch = pushWave * 0.14;
          rightHandBone.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(handPitch, 0, 0, "XYZ"))
          );
        }
        if (headBone) {
          const bowAngle = Math.max(0, pushWave) * 0.09;
          headBone.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(bowAngle, 0, 0, "XYZ"))
          );
        }
      } else if (
        lowerSign === "bisa" ||
        lowerSign.includes("bisa") ||
        lowerSign.includes("pasti") ||
        lowerSign.includes("jempol")
      ) {
        // Hentakan mantap ke bawah dengan acungan jempol tegak dan anggukan kepala tegas
        const headBone = this.bonesMap.get(RIAN_BONES.HEAD);
        const rightForeArmBone = this.bonesMap.get(RIAN_BONES.RIGHT_FOREARM);
        const rightHandBone = this.bonesMap.get(RIAN_BONES.RIGHT_HAND);

        const pumpSine = Math.sin(clockTime * 4.5 * speed);
        if (headBone) {
          const nodAngle = Math.max(0, pumpSine) * 0.10;
          headBone.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(nodAngle, 0, 0, "XYZ"))
          );
        }
        if (rightForeArmBone) {
          const pumpAngle = pumpSine * 0.18;
          rightForeArmBone.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(pumpAngle, 0, 0, "XYZ"))
          );
        }
        if (rightHandBone) {
          const pumpRoll = pumpSine * 0.08;
          rightHandBone.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, pumpRoll, 0, "XYZ"))
          );
        }
      } else if (
        lowerSign === "salam" ||
        lowerSign === "tolong" ||
        lowerSign === "bantuan" ||
        lowerSign.includes("salam") ||
        lowerSign.includes("tolong") ||
        lowerSign.includes("bantu")
      ) {
        // Kedua tangan terangkat di depan dada berdenyut lembut menengadah
        const rForeArm = this.bonesMap.get(RIAN_BONES.RIGHT_FOREARM);
        const lForeArm = this.bonesMap.get(RIAN_BONES.LEFT_FOREARM);
        const offeringPulse = Math.sin(clockTime * 3.5 * speed) * 0.08;
        const offerSway = Math.cos(clockTime * 3.5 * speed) * 0.05;

        if (rForeArm) {
          rForeArm.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(offeringPulse, 0, offerSway, "XYZ"))
          );
        }
        if (lForeArm) {
          lForeArm.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(offeringPulse, 0, -offerSway, "XYZ"))
          );
        }
      } else if (
        lowerSign === "satu" ||
        lowerSign === "paham" ||
        lowerSign === "isyarat" ||
        lowerSign.includes("satu") ||
        lowerSign.includes("paham") ||
        lowerSign.includes("isyarat") ||
        lowerSign.includes("poin") ||
        lowerSign.includes("telunjuk")
      ) {
        // Telunjuk tegak mengarah ke atas di depan dada dengan penegasan ritmik
        const rHand = this.bonesMap.get(RIAN_BONES.RIGHT_HAND);
        const rForeArm = this.bonesMap.get(RIAN_BONES.RIGHT_FOREARM);
        const pointPulse = Math.sin(clockTime * 4.2 * speed) * 0.09;

        if (rHand) {
          rHand.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, pointPulse, 0, "XYZ"))
          );
        }
        if (rForeArm) {
          rForeArm.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(pointPulse * 0.7, 0, 0, "XYZ"))
          );
        }
      } else if (
        lowerSign === "pemetaan" ||
        lowerSign === "komunitas" ||
        lowerSign.includes("peta") ||
        lowerSign.includes("wilayah") ||
        lowerSign.includes("komunitas")
      ) {
        // Kedua tangan menyapu ke samping dan saling membuka di depan dada
        const rHand = this.bonesMap.get(RIAN_BONES.RIGHT_HAND);
        const lHand = this.bonesMap.get(RIAN_BONES.LEFT_HAND);
        const rForeArm = this.bonesMap.get(RIAN_BONES.RIGHT_FOREARM);
        const lForeArm = this.bonesMap.get(RIAN_BONES.LEFT_FOREARM);
        const mapSweep = Math.sin(clockTime * 3.5 * speed) * 0.14;

        if (rHand) {
          rHand.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, mapSweep, -mapSweep * 0.4, "XYZ"))
          );
        }
        if (lHand) {
          lHand.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -mapSweep, mapSweep * 0.4, "XYZ"))
          );
        }
        if (rForeArm) {
          rForeArm.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, mapSweep * 0.5, 0, "XYZ"))
          );
        }
        if (lForeArm) {
          lForeArm.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -mapSweep * 0.5, 0, "XYZ"))
          );
        }
      } else if (lowerSign === "tidak" || lowerSign.includes("tidak") || lowerSign.includes("bukan")) {
        const headBone = this.bonesMap.get(RIAN_BONES.HEAD);
        const rightHandBone = this.bonesMap.get(RIAN_BONES.RIGHT_HAND);
        if (headBone) {
          const shakeAngle = Math.sin(clockTime * 5.2 * speed) * 0.11;
          headBone.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, shakeAngle, 0, "XYZ"))
          );
        }
        if (rightHandBone) {
          const wagAngle = Math.sin(clockTime * 5.8 * speed) * 0.16;
          rightHandBone.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, wagAngle, "XYZ"))
          );
        }
      } else if (
        lowerSign !== "neutral" &&
        lowerSign !== "idle" &&
        lowerSign !== "pause" &&
        lowerSign !== "istirahat"
      ) {
        // Conversational Explaining Sign: kedua tangan bergerak membuka-menutup luwes mengikuti irama pengucapan kata
        const rForeArm = this.bonesMap.get(RIAN_BONES.RIGHT_FOREARM);
        const rHand = this.bonesMap.get(RIAN_BONES.RIGHT_HAND);
        const lForeArm = this.bonesMap.get(RIAN_BONES.LEFT_FOREARM);
        const lHand = this.bonesMap.get(RIAN_BONES.LEFT_HAND);
        const rIndex = this.bonesMap.get(RIAN_BONES.RIGHT_INDEX_1);
        const rMiddle = this.bonesMap.get(RIAN_BONES.RIGHT_MIDDLE_1);

        const rhythm = Math.sin(clockTime * 3.8 * speed);
        const rhythmCos = Math.cos(clockTime * 3.8 * speed);

        if (rForeArm) {
          rForeArm.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(rhythm * 0.10, rhythm * 0.06, rhythmCos * 0.08, "XYZ"))
          );
        }
        if (rHand) {
          rHand.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(rhythmCos * 0.12, rhythm * 0.08, 0, "XYZ"))
          );
        }
        if (lForeArm) {
          lForeArm.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(-rhythm * 0.08, -rhythm * 0.05, -rhythmCos * 0.06, "XYZ"))
          );
        }
        if (lHand) {
          lHand.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(-rhythmCos * 0.10, -rhythm * 0.06, 0, "XYZ"))
          );
        }
        if (rIndex) {
          rIndex.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(rhythm * 0.10, 0, 0, "XYZ"))
          );
        }
        if (rMiddle) {
          rMiddle.quaternion.multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler(rhythm * 0.08, 0, 0, "XYZ"))
          );
        }
      }
    }
  }

  public getActiveSign(): string {
    return this.activeSignKey;
  }
}
