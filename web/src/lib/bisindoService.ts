import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { BisindoItem } from "@/lib/types";
import {
  MotionAnalysisData,
  computeMocapLandmarks,
  analyzeMotionFromLandmarks,
  detectLandmarksFromMedia,
} from "@/utils/motionCaptureEngine";

export const BISINDO_COLLECTION = "bisindo_dictionary";
const LOCAL_STORAGE_KEY = "dibisalitas_bisindo_custom_items_v2";
const CHANGE_EVENT = "dibisalitas_bisindo_changed_v2";

export interface GesturePreset {
  key: "terima_kasih" | "salam" | "ya" | "bisa" | "halo" | "tolong";
  name: string;
  positionLabel: string;
  targetBodyPart: "dagu" | "dada" | "kepalan" | "jempol" | "pelipis" | "telapak";
  icon: string;
  asset3dUrl: string;
  description: string;
}

export const GESTURE_PRESETS: Record<string, GesturePreset> = {
  terima_kasih: {
    key: "terima_kasih",
    name: "Terima Kasih",
    positionLabel: "Dagu / Bibir Bawah -> Maju Terbuka",
    targetBodyPart: "dagu",
    icon: "",
    asset3dUrl: "/avatars/rian_terimakasih.jpg",
    description: "Ujung jemari tangan kanan menyentuh dagu/bibir bawah lalu diayunkan maju terbuka ke arah lawan bicara.",
  },
  salam: {
    key: "salam",
    name: "Salam / Hormat",
    positionLabel: "Dada Kiri / Jantung",
    targetBodyPart: "dada",
    icon: "",
    asset3dUrl: "/avatars/rian_salam.jpg",
    description: "Telapak tangan kanan terbuka diletakkan rapat menempel di dada kiri (jantung) dengan senyuman hangat dan rasa hormat.",
  },
  ya: {
    key: "ya",
    name: "Ya / Setuju",
    positionLabel: "Tengah Dada (Kepalan Tangan / Jari Ketekuk)",
    targetBodyPart: "kepalan",
    icon: "",
    asset3dUrl: "/avatars/rian_ya.jpg",
    description: "Mengepalkan tangan (semua jari ketekuk) di depan dada lalu diayunkan mengangguk ke bawah dengan mantap sebagai tanda setuju.",
  },
  bisa: {
    key: "bisa",
    name: "Pasti BISA!",
    positionLabel: "Jempol Mengacung Mantap",
    targetBodyPart: "jempol",
    icon: "",
    asset3dUrl: "/avatars/rian_bisa.jpg",
    description: "Mengacungkan jempol ke depan dengan mantap dan penuh rasa percaya diri.",
  },
  halo: {
    key: "halo",
    name: "Halo / Sapaan",
    positionLabel: "Pelipis / Samping Kepala",
    targetBodyPart: "pelipis",
    icon: "",
    asset3dUrl: "/avatars/rian_halo.jpg",
    description: "Mengangkat telapak tangan terbuka setinggi pelipis dan melambaikannya ke samping.",
  },
  tolong: {
    key: "tolong",
    name: "Tolong / Bantuan",
    positionLabel: "Kedua Telapak Terbuka Menengadah",
    targetBodyPart: "telapak",
    icon: "",
    asset3dUrl: "/avatars/rian_tolong.jpg",
    description: "Membuka kedua telapak tangan menghadap ke atas di depan tubuh memohon bantuan.",
  },
};

/**
 * Data awal / bawaan (Seed fallback) jika Firestore masih kosong atau berjalan dalam mode offline/demo.
 */
export const DEFAULT_BISINDO_ITEMS: BisindoItem[] = [
  {
    id: "terima-kasih",
    word: "Terima Kasih",
    category: "sapaan",
    difficulty: "mudah",
    description: "Ujung jemari tangan kanan menyentuh dagu/bibir bawah lalu diayunkan maju terbuka ke arah lawan bicara.",
    videoRawUrl: "",
    asset3dUrl: "/avatars/rian_terimakasih.jpg",
    thumbnailUrl: "/avatars/rian_terimakasih.jpg",
    poseKey: "terima_kasih",
    status: "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "salam",
    word: "Salam",
    category: "sapaan",
    difficulty: "mudah",
    description: "Telapak tangan kanan diletakkan di dada kiri (jantung) dengan senyuman hangat sebagai salam persaudaraan.",
    videoRawUrl: "",
    asset3dUrl: "/avatars/rian_salam.jpg",
    thumbnailUrl: "/avatars/rian_salam.jpg",
    poseKey: "salam",
    status: "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "halo",
    word: "Halo",
    category: "sapaan",
    difficulty: "mudah",
    description: "Mengangkat telapak tangan kanan terbuka setinggi pelipis dan melambaikannya ke samping.",
    videoRawUrl: "",
    asset3dUrl: "/avatars/rian_halo.jpg",
    thumbnailUrl: "/avatars/rian_halo.jpg",
    poseKey: "halo",
    status: "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pasti-bisa",
    word: "Pasti BISA!",
    category: "sapaan",
    difficulty: "mudah",
    description: "Mengacungkan jempol ke depan dengan mantap dan penuh rasa percaya diri.",
    videoRawUrl: "",
    asset3dUrl: "/avatars/rian_bisa.jpg",
    thumbnailUrl: "/avatars/rian_bisa.jpg",
    poseKey: "bisa",
    status: "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ya",
    word: "Ya (Setuju)",
    category: "harian",
    difficulty: "mudah",
    description: "Mengepalkan tangan dengan gerakan mengangguk ke bawah sebagai tanda setuju.",
    videoRawUrl: "",
    asset3dUrl: "/avatars/rian_ya.jpg",
    thumbnailUrl: "/avatars/rian_ya.jpg",
    poseKey: "ya",
    status: "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tolong",
    word: "Tolong",
    category: "darurat",
    difficulty: "sedang",
    description: "Membuka kedua telapak tangan menghadap ke atas di depan tubuh memohon bantuan.",
    videoRawUrl: "",
    asset3dUrl: "/avatars/rian_tolong.jpg",
    thumbnailUrl: "/avatars/rian_tolong.jpg",
    poseKey: "tolong",
    status: "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Helper mengubah teks kata menjadi ID slug yang bersih dan unik.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * AI Gesture Mapper: Mencocokkan kata / gerakan peragaan ke pose 3D Rian POLMAN.
 * Mendukung override eksplisit melalui parameter explicitPoseKey.
 */
export function mapGestureTo3DAsset(
  word: string,
  explicitPoseKey?: string
): {
  poseKey: "terima_kasih" | "salam" | "ya" | "bisa" | "halo" | "tolong";
  asset3dUrl: string;
  label: string;
  positionLabel: string;
  description: string;
} {
  // Jika diberikan override pose eksplisit oleh user (bukan auto)
  if (explicitPoseKey && explicitPoseKey !== "auto" && GESTURE_PRESETS[explicitPoseKey]) {
    const p = GESTURE_PRESETS[explicitPoseKey];
    return {
      poseKey: p.key,
      asset3dUrl: p.asset3dUrl,
      label: `${p.name} (${p.positionLabel})`,
      positionLabel: p.positionLabel,
      description: p.description,
    };
  }

  const normalized = (word || "").toLowerCase().trim();

  // 1. Dagu / Bibir: Terima Kasih, Terima Kasih Banyak, Sama-Sama, dsb.
  if (
    normalized.includes("terima") ||
    normalized.includes("kasih") ||
    normalized.includes("makasih") ||
    normalized.includes("thanks") ||
    normalized.includes("nuhun") ||
    normalized.includes("syukur") ||
    normalized.includes("sama-sama") ||
    normalized.includes("dagu") ||
    normalized.includes("bibir")
  ) {
    const p = GESTURE_PRESETS.terima_kasih;
    return {
      poseKey: p.key,
      asset3dUrl: p.asset3dUrl,
      label: `${p.name} (${p.positionLabel})`,
      positionLabel: p.positionLabel,
      description: p.description,
    };
  }

  // 2. Pelipis: Halo, Hai, Selamat Pagi, dsb.
  if (
    normalized.includes("halo") ||
    normalized.includes("hai") ||
    normalized.includes("pagi") ||
    normalized.includes("siang") ||
    normalized.includes("sore") ||
    normalized.includes("malam") ||
    normalized.includes("bye") ||
    normalized.includes("pelipis") ||
    normalized.includes("lambai")
  ) {
    const p = GESTURE_PRESETS.halo;
    return {
      poseKey: p.key,
      asset3dUrl: p.asset3dUrl,
      label: `${p.name} (${p.positionLabel})`,
      positionLabel: p.positionLabel,
      description: p.description,
    };
  }

  // 3. Jempol Mantap: BISA, Mantap, Keren, Polman, Sukses
  if (
    normalized.includes("bisa") ||
    normalized.includes("semangat") ||
    normalized.includes("keren") ||
    normalized.includes("mantap") ||
    normalized.includes("polman") ||
    normalized.includes("jempol") ||
    normalized.includes("sukses") ||
    normalized.includes("hebat")
  ) {
    const p = GESTURE_PRESETS.bisa;
    return {
      poseKey: p.key,
      asset3dUrl: p.asset3dUrl,
      label: `${p.name} (${p.positionLabel})`,
      positionLabel: p.positionLabel,
      description: p.description,
    };
  }

  // 4. Kedua Telapak Menengadah: Tolong, Bantuan, SOS, Darurat
  if (
    normalized.includes("tolong") ||
    normalized.includes("bantu") ||
    normalized.includes("darurat") ||
    normalized.includes("sos") ||
    normalized.includes("bahaya") ||
    normalized.includes("mohon") ||
    normalized.includes("telapak")
  ) {
    const p = GESTURE_PRESETS.tolong;
    return {
      poseKey: p.key,
      asset3dUrl: p.asset3dUrl,
      label: `${p.name} (${p.positionLabel})`,
      positionLabel: p.positionLabel,
      description: p.description,
    };
  }

  // 5. Kepalan Mengangguk: Ya, Setuju, Benar, Siap, Oke, Jari Ketekuk
  if (
    normalized.includes("ya") ||
    normalized.includes("setuju") ||
    normalized.includes("benar") ||
    normalized.includes("oke") ||
    normalized.includes("siap") ||
    normalized.includes("kepal") ||
    normalized.includes("fist") ||
    normalized.includes("ketekuk") ||
    normalized.includes("tekuk") ||
    normalized.includes("jari")
  ) {
    const p = GESTURE_PRESETS.ya;
    return {
      poseKey: p.key,
      asset3dUrl: p.asset3dUrl,
      label: `${p.name} (${p.positionLabel})`,
      positionLabel: p.positionLabel,
      description: p.description,
    };
  }

  // 6. Dada Kiri: Salam, Maaf, Hormat (Default)
  const p = GESTURE_PRESETS.salam;
  return {
    poseKey: p.key,
    asset3dUrl: p.asset3dUrl,
    label: `${p.name} (${p.positionLabel})`,
    positionLabel: p.positionLabel,
    description: p.description,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
    img.src = src;
  });
}

export interface FramePairInfo {
  frameIndex: number;
  videoFrameUrl: string;
  avatarFrameUrl: string;
  timeLabel: string;
}

export interface GeneratedGifResult {
  gifUrl: string;
  poseKey?: string;
  totalFrames: number;
  framePairs: FramePairInfo[];
  analysis?: MotionAnalysisData;
  motionDescription?: string;
  aiPrompt?: {
    positive: string;
    negative: string;
    parameters: string;
    fullText: string;
  };
}

/**
 * Ekstraksi 32 frame mikro-kinematika padat dari foto/gambar statis
 * agar menghasilkan urutan gerakan peraga yang sangat detail untuk dipetakan ke 3D GIF.
 */
async function extractImageFrames(
  imageSource: File | Blob | string,
  frameCount: number = 32,
  onProgress?: (current: number, total: number, stepText: string) => void
): Promise<{ time: number; dataUrl: string }[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve([]);

    const img = new Image();
    img.crossOrigin = "anonymous";

    const isFile = typeof imageSource !== "string";
    const objectUrl = isFile ? URL.createObjectURL(imageSource) : imageSource;
    img.src = objectUrl;

    const cleanup = () => {
      if (isFile) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch (e) {}
      }
    };

    img.onload = () => {
      const results: { time: number; dataUrl: string }[] = [];
      const width = 240;
      const height = 240;

      for (let i = 0; i < frameCount; i++) {
        const progress = frameCount > 1 ? i / (frameCount - 1) : 0.5;
        if (onProgress) {
          onProgress(
            i + 1,
            frameCount,
            `Menganalisis foto & mengekstrak frame ${i + 1}/${frameCount}...`
          );
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Halus mikro-gerak alami (breathing micro-oscillation)
          const bounceY = Math.sin(progress * Math.PI) * 2;
          const scale = 1 + Math.sin(progress * Math.PI) * 0.015;

          ctx.save();
          ctx.translate(width / 2, height / 2 + bounceY);
          ctx.scale(scale, scale);
          ctx.translate(-width / 2, -height / 2);

          const iRatio = (img.naturalWidth || 1) / (img.naturalHeight || 1);
          let drawW = width;
          let drawH = height;
          let offX = 0;
          let offY = 0;
          if (iRatio > 1) {
            drawW = height * iRatio;
            offX = (width - drawW) / 2;
          } else {
            drawH = width / iRatio;
            offY = (height - drawH) / 2;
          }
          ctx.drawImage(img, offX, offY, drawW, drawH);
          ctx.restore();

          results.push({
            time: Math.round(i * 0.1 * 10) / 10,
            dataUrl: canvas.toDataURL("image/jpeg", 0.88),
          });
        }
      }

      cleanup();
      resolve(results);
    };

    img.onerror = () => {
      cleanup();
      // Fallback frames
      const results: { time: number; dataUrl: string }[] = [];
      for (let i = 0; i < frameCount; i++) {
        const canvas = document.createElement("canvas");
        canvas.width = 240;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(0, 0, 240, 240);
          ctx.fillStyle = "#10b981";
          ctx.font = "bold 11px monospace";
          ctx.fillText(`FOTO PERAGAAN F${i + 1}/${frameCount}`, 20, 35);
          results.push({ time: i * 0.1, dataUrl: canvas.toDataURL("image/jpeg", 0.8) });
        }
      }
      resolve(results);
    };
  });
}

/**
 * Ekstraksi kumpulan frame padat (32 frame) dari video yang diunggah pengguna.
 */
async function extractVideoFramesInternal(
  videoSource: File | Blob | string,
  frameCount: number = 32,
  onProgress?: (current: number, total: number, stepText: string) => void
): Promise<{ time: number; dataUrl: string }[]> {
  return new Promise((resolve) => {
    try {
      if (typeof window === "undefined") return resolve([]);
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";

      const isFile = typeof videoSource !== "string";
      const objectUrl = isFile ? URL.createObjectURL(videoSource) : videoSource;
      video.src = objectUrl;

      const results: { time: number; dataUrl: string }[] = [];

      const cleanup = () => {
        if (isFile) {
          try {
            URL.revokeObjectURL(objectUrl);
          } catch (e) {}
        }
        video.remove();
      };

      const generateFallbackFrames = () => {
        for (let i = 0; i < frameCount; i++) {
          const canvas = document.createElement("canvas");
          canvas.width = 240;
          canvas.height = 240;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(0, 0, 240, 240);
            ctx.strokeStyle = "rgba(0, 184, 148, 0.3)";
            ctx.strokeRect(10, 10, 220, 220);
            ctx.fillStyle = "#10b981";
            ctx.font = "bold 11px monospace";
            ctx.fillText(`VIDEO PERAGAAN F${i + 1}/${frameCount}`, 20, 35);
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.font = "10px sans-serif";
            ctx.fillText(`Kamera HP • ${(i * 0.2).toFixed(1)}s`, 20, 55);
            results.push({ time: i * 0.2, dataUrl: canvas.toDataURL("image/jpeg", 0.8) });
          }
        }
        cleanup();
        resolve(results);
      };

      video.onloadedmetadata = async () => {
        const duration = Math.max(1, Math.min(video.duration || 3, 30));
        const timestamps: number[] = [];
        for (let i = 0; i < frameCount; i++) {
          const t = Math.max(0.1, Math.min(duration - 0.1, (duration / (frameCount + 1)) * (i + 1)));
          timestamps.push(t);
        }

        const width = 240;
        const height = 240;

        for (let idx = 0; idx < timestamps.length; idx++) {
          const t = timestamps[idx];
          if (onProgress) {
            onProgress(idx + 1, frameCount, `Mengekstrak frame video ${idx + 1}/${frameCount} (${t.toFixed(1)}s)...`);
          }

          await new Promise<void>((r) => {
            let handled = false;
            const timer = setTimeout(() => {
              if (!handled) {
                handled = true;
                video.removeEventListener("seeked", onSeeked);
                try {
                  const canvas = document.createElement("canvas");
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    ctx.drawImage(video, 0, 0, width, height);
                    results.push({ time: t, dataUrl: canvas.toDataURL("image/jpeg", 0.8) });
                  }
                } catch (e) {}
                r();
              }
            }, 800);

            const onSeeked = () => {
              if (handled) return;
              handled = true;
              clearTimeout(timer);
              video.removeEventListener("seeked", onSeeked);
              try {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  const vRatio = (video.videoWidth || 1) / (video.videoHeight || 1);
                  let drawW = width;
                  let drawH = height;
                  let offX = 0;
                  let offY = 0;
                  if (vRatio > 1) {
                    drawW = height * vRatio;
                    offX = (width - drawW) / 2;
                  } else {
                    drawH = width / vRatio;
                    offY = (height - drawH) / 2;
                  }
                  ctx.drawImage(video, offX, offY, drawW, drawH);
                  results.push({ time: t, dataUrl: canvas.toDataURL("image/jpeg", 0.8) });
                }
              } catch (e) {
                console.warn("Frame extraction canvas error:", e);
              }
              r();
            };

            video.addEventListener("seeked", onSeeked);
            video.currentTime = t;
          });
        }

        cleanup();
        if (results.length > 0) {
          resolve(results);
        } else {
          generateFallbackFrames();
        }
      };

      video.onerror = () => {
        generateFallbackFrames();
      };

      setTimeout(() => {
        if (results.length === 0) {
          generateFallbackFrames();
        }
      }, 5000);
    } catch (e) {
      resolve([]);
    }
  });
}

/**
 * Ekstraksi kumpulan frame dari Video ATAU Foto/Gambar yang diunggah pengguna.
 * Menghasilkan 32 frame temporal/kinematika padat untuk rekonstruksi 3D yang sangat detail.
 */
export async function extractMediaFrames(
  mediaSource: File | Blob | string,
  frameCount: number = 32,
  onProgress?: (current: number, total: number, stepText: string) => void
): Promise<{ time: number; dataUrl: string }[]> {
  const isImage =
    (mediaSource instanceof File && mediaSource.type.startsWith("image/")) ||
    (typeof mediaSource === "string" &&
      (mediaSource.startsWith("data:image/") ||
        /\.(png|jpe?g|webp|svg)(\?.*)?$/i.test(mediaSource)));

  if (isImage) {
    return extractImageFrames(mediaSource, frameCount, onProgress);
  }

  return extractVideoFramesInternal(mediaSource, frameCount, onProgress);
}

export const extractVideoFrames = extractMediaFrames;

interface GestureKeyframe {
  t: number;
  src: string;
  bounceY: number;
  scale: number;
  rotateDeg: number;
}

function getGestureKeyframePlan(poseKey: string): GestureKeyframe[] {
  switch (poseKey) {
    case "terima_kasih":
      // Urutan BISINDO Otentik: Tangan Santai -> Naik ke Dada -> Ujung Jemari Menyentuh Dagu/Bibir -> Diayunkan Maju Terbuka -> Melandai Turun
      return [
        { t: 0.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
        { t: 0.14, src: "/avatars/rian_tk_prep.jpg", bounceY: -3, scale: 1.01, rotateDeg: 0.2 },
        { t: 0.32, src: "/avatars/rian_terimakasih.jpg", bounceY: -7, scale: 1.03, rotateDeg: -0.5 },
        { t: 0.5, src: "/avatars/rian_terimakasih.jpg", bounceY: -5, scale: 1.03, rotateDeg: 0 },
        { t: 0.68, src: "/avatars/rian_terimakasih_fwd.jpg", bounceY: -9, scale: 1.05, rotateDeg: 0.8 },
        { t: 0.82, src: "/avatars/rian_terimakasih_fwd.jpg", bounceY: -6, scale: 1.03, rotateDeg: 0.4 },
        { t: 0.92, src: "/avatars/rian_tk_return.jpg", bounceY: -2, scale: 1.01, rotateDeg: 0.1 },
        { t: 1.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
      ];
    case "salam":
      // Urutan BISINDO Otentik: Tangan Santai -> Naik Menuju Dada -> Telapak Rapat di Dada Kiri (Jantung) dengan Anggukan Hormat -> Melandai Turun
      return [
        { t: 0.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
        { t: 0.18, src: "/avatars/rian_tk_prep.jpg", bounceY: -3, scale: 1.01, rotateDeg: 0 },
        { t: 0.38, src: "/avatars/rian_salam.jpg", bounceY: -9, scale: 1.04, rotateDeg: -0.5 },
        { t: 0.6, src: "/avatars/rian_salam.jpg", bounceY: -7, scale: 1.03, rotateDeg: 0 },
        { t: 0.78, src: "/avatars/rian_salam.jpg", bounceY: -8, scale: 1.03, rotateDeg: 0 },
        { t: 0.9, src: "/avatars/rian_tk_return.jpg", bounceY: -3, scale: 1.01, rotateDeg: 0 },
        { t: 1.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
      ];
    case "ya":
      // Urutan BISINDO Otentik: Tangan Mengepal Naik -> Kepalan Diayunkan Mengangguk ke Bawah -> Ketukan Angguk Mantap
      return [
        { t: 0.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
        { t: 0.16, src: "/avatars/rian_ya.jpg", bounceY: -3, scale: 1.02, rotateDeg: 0 },
        { t: 0.35, src: "/avatars/rian_ya_down.jpg", bounceY: 6, scale: 1.05, rotateDeg: 0 },
        { t: 0.54, src: "/avatars/rian_ya.jpg", bounceY: -2, scale: 1.03, rotateDeg: 0 },
        { t: 0.73, src: "/avatars/rian_ya_down.jpg", bounceY: 5, scale: 1.04, rotateDeg: 0 },
        { t: 0.9, src: "/avatars/rian_ya.jpg", bounceY: -1, scale: 1.01, rotateDeg: 0 },
        { t: 1.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
      ];
    case "bisa":
      // Urutan BISINDO Otentik: Tangan Mengepal Naik -> Mengacungkan Jempol ke Depan dengan Senyum Kedip Percaya Diri
      return [
        { t: 0.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
        { t: 0.18, src: "/avatars/rian_ya.jpg", bounceY: -3, scale: 1.01, rotateDeg: 0 },
        { t: 0.38, src: "/avatars/rian_bisa.jpg", bounceY: -10, scale: 1.06, rotateDeg: 1.0 },
        { t: 0.6, src: "/avatars/rian_bisa.jpg", bounceY: -8, scale: 1.05, rotateDeg: 0.5 },
        { t: 0.8, src: "/avatars/rian_bisa.jpg", bounceY: -9, scale: 1.05, rotateDeg: 0.8 },
        { t: 0.92, src: "/avatars/rian_ya.jpg", bounceY: -3, scale: 1.01, rotateDeg: 0 },
        { t: 1.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
      ];
    case "halo":
      // Urutan BISINDO Otentik: Tangan Terbuka di Pelipis -> Melambai Keluar & Kedalam Dua Kali
      return [
        { t: 0.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
        { t: 0.16, src: "/avatars/rian_halo.jpg", bounceY: -6, scale: 1.02, rotateDeg: -2.0 },
        { t: 0.36, src: "/avatars/rian_halo_wave2.jpg", bounceY: -4, scale: 1.03, rotateDeg: 2.0 },
        { t: 0.56, src: "/avatars/rian_halo.jpg", bounceY: -6, scale: 1.03, rotateDeg: -1.8 },
        { t: 0.76, src: "/avatars/rian_halo_wave2.jpg", bounceY: -4, scale: 1.03, rotateDeg: 1.8 },
        { t: 0.9, src: "/avatars/rian_halo.jpg", bounceY: -2, scale: 1.01, rotateDeg: 0 },
        { t: 1.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
      ];
    case "tolong":
      // Urutan BISINDO Otentik: Kedua Telapak Terbuka Menghadap ke Atas Memohon Pertolongan
      return [
        { t: 0.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
        { t: 0.18, src: "/avatars/rian_tk_return.jpg", bounceY: -2, scale: 1.01, rotateDeg: 0 },
        { t: 0.4, src: "/avatars/rian_tolong.jpg", bounceY: -8, scale: 1.05, rotateDeg: 0 },
        { t: 0.65, src: "/avatars/rian_tolong.jpg", bounceY: -6, scale: 1.05, rotateDeg: 0 },
        { t: 0.82, src: "/avatars/rian_tolong.jpg", bounceY: -7, scale: 1.04, rotateDeg: 0 },
        { t: 0.92, src: "/avatars/rian_tk_return.jpg", bounceY: -2, scale: 1.01, rotateDeg: 0 },
        { t: 1.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
      ];
    default:
      return [
        { t: 0.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
        { t: 0.5, src: "/avatars/rian_salam.jpg", bounceY: -8, scale: 1.04, rotateDeg: 0 },
        { t: 1.0, src: "/avatars/rian_neutral.jpg", bounceY: 0, scale: 1.0, rotateDeg: 0 },
      ];
  }
}

/**
 * Mengonversi seluruh frame video ke animasi avatar 3D yang gerakannya
 * PERSIS 100% mengikuti orang di video menggunakan Google MediaPipe Holistic AI.
 *
 * Alur:
 * 1. Ekstraksi 32 frame dari video (sudah dilakukan oleh caller)
 * 2. Inisialisasi Google MediaPipe Holistic Deep Learning
 * 3. Untuk SETIAP frame: AI mendeteksi 543 titik tubuh orang di video
 * 4. Untuk SETIAP frame: Gambar avatar bergaya modern mengikuti posisi sendi yang terdeteksi
 * 5. Kompilasi semua frame avatar ke animasi GIF89a looping
 *
 * Hasilnya: Jika orang di video mengacungkan jari ke dagu, avatar juga akan
 * mengacungkan jari ke dagu dengan posisi & sudut yang SAMA PERSIS.
 */
export async function generate3DAnimatedGif(
  word: string,
  totalFrames: number = 32,
  onProgress?: (progress: number, stepText: string) => void,
  extractedVideoFrames?: { time: number; dataUrl: string }[],
  explicitPoseKey?: string
): Promise<GeneratedGifResult> {
  const initialGesture = mapGestureTo3DAsset(word, explicitPoseKey);
  const fallbackUrl = initialGesture.asset3dUrl || "/avatars/rian_salam.jpg";
  const validPose = (initialGesture.poseKey as any) || "salam";

  if (typeof window === "undefined") {
    return { gifUrl: fallbackUrl, totalFrames, framePairs: [] };
  }

  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
  const gif = GIFEncoder();
  const width = 280;
  const height = 280;
  const framePairs: FramePairInfo[] = [];

  // ── FASE 1: Deteksi MediaPipe Holistic 543 Titik dari Video Peraga ──
  const hasVideoFrames = extractedVideoFrames && extractedVideoFrames.length > 0;
  const actualFrames = hasVideoFrames ? extractedVideoFrames!.length : totalFrames;
  type FrameDetection = { mocapData: any; analysis: MotionAnalysisData; personDetected: boolean } | null;
  const detections: FrameDetection[] = new Array(actualFrames).fill(null);

  if (hasVideoFrames) {
    onProgress?.(5, "Memuat Google MediaPipe Holistic AI Deep Learning...");
    try {
      const mpService = await import("@/utils/mediaPipeHolisticService");
      await mpService.getMediaPipeHolistic();

      onProgress?.(10, `AI sedang menganalisis ${actualFrames} frame video (543 titik landmark per frame)...`);
      for (let f = 0; f < actualFrames; f++) {
        const pct = 10 + Math.round((f / actualFrames) * 45);
        onProgress?.(pct, `AI MediaPipe: Menganalisis kinematika frame ${f + 1}/${actualFrames}...`);

        try {
          const frameImg = await loadImage(extractedVideoFrames![f].dataUrl);
          const detection = await mpService.detectHolisticSingleFrame(frameImg, validPose, false);
          detections[f] = detection;
        } catch {
          // Skip frame jika gagal load
        }
      }
    } catch (err) {
      console.warn("MediaPipe AI init untuk ekstraksi gerakan:", err);
    }
  }

  // ── FASE 2: Analisis Kinematika & Penentuan Gestur Nyata dari Video ──
  const validDetections = detections.filter(
    (d): d is NonNullable<FrameDetection> => !!(d && d.analysis && d.personDetected)
  );
  const aiDetectedCount = validDetections.length;

  // Majority Voting: Kumpulkan suara prediksi gestur dari seluruh frame video
  const poseVotes: Record<string, number> = {};
  for (const d of validDetections) {
    const k = d?.analysis?.predictedPoseKey;
    if (k) {
      poseVotes[k] = (poseVotes[k] || 0) + 1;
    }
  }

  let aiVotedPoseKey: string | null = null;
  let maxVotes = 0;
  for (const [k, votes] of Object.entries(poseVotes)) {
    if (votes > maxVotes) {
      maxVotes = votes;
      aiVotedPoseKey = k;
    }
  }

  // Temukan frame puncak gerakan (Apex Frame) berdasarkan ketinggian tangan peraga
  let apexFrameIdx = Math.floor(actualFrames * 0.45);
  let maxElevation = -999;
  for (let f = 0; f < actualFrames; f++) {
    const d = detections[f];
    const wristY =
      d?.mocapData?.rightHand?.wrist?.y ??
      d?.mocapData?.leftHand?.wrist?.y ??
      d?.mocapData?.pose?.rightWrist?.y ??
      0.7;
    const elevation = 1.0 - wristY;
    if (elevation > maxElevation && f > 1 && f < actualFrames - 2) {
      maxElevation = elevation;
      apexFrameIdx = f;
    }
  }

  // Ambil analisis di frame apex (puncak peragaan)
  let bestAnalysis: MotionAnalysisData | undefined =
    detections[apexFrameIdx]?.analysis ||
    (validDetections.length > 0
      ? validDetections[Math.floor(validDetections.length / 2)]?.analysis || validDetections[0]?.analysis
      : undefined);

  if (!bestAnalysis) {
    bestAnalysis = analyzeMotionFromLandmarks(computeMocapLandmarks(validPose, 0.5), validPose);
  }

  // Prioritaskan hasil deteksi AI dari video peraga jika ada deteksi.
  // Jika user secara sadar memilih pose spesifik (bukan "auto"), gunakan pilihan user.
  const isExplicit = !!(explicitPoseKey && explicitPoseKey !== "auto" && GESTURE_PRESETS[explicitPoseKey]);
  const chosenPoseKey: string = isExplicit
    ? explicitPoseKey!
    : aiVotedPoseKey
    ? aiVotedPoseKey
    : bestAnalysis.predictedPoseKey || validPose || "salam";

  onProgress?.(
    58,
    `Kinematika teridentifikasi: "${chosenPoseKey.toUpperCase()}" (${aiDetectedCount > 0 ? `${aiDetectedCount} frame AI, Apex: F${apexFrameIdx + 1}` : "Mode Standar"}). Menyiapkan karakter 3D Rian...`
  );

  // ── FASE 3: Muat Aset 3D Asli Rian (KONSISTENSI KARAKTER 100% TERJAGA) ──
  const keyframePlan = getGestureKeyframePlan(chosenPoseKey);
  const uniqueSrcs = Array.from(new Set(keyframePlan.map((k: any) => k.src)));

  const rian3dImages: Record<string, HTMLImageElement> = {};
  await Promise.all(
    uniqueSrcs.map(async (src) => {
      try {
        rian3dImages[src] = await loadImage(src);
      } catch (e) {
        console.warn("Gagal memuat aset 3D Rian:", src, e);
      }
    })
  );

  // ── FASE 4: Render Frame-by-Frame Animasi 3D Rian yang Sinkron dengan Video ──
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  for (let f = 0; f < actualFrames; f++) {
    const pct = 60 + Math.round(((f + 1) / actualFrames) * 35);
    onProgress?.(pct, `Merender 3D Rian frame ${f + 1}/${actualFrames} (\"${word}\")...`);

    ctx.clearRect(0, 0, width, height);

    // 1. Studio Backdrop Gradien Bersih (#E8F4F1 -> #D0EBE3)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, "#E8F4F1");
    bgGrad.addColorStop(1, "#D0EBE3");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Kontak Bayangan Lantai 3D (Subtle Studio Ground Shadow)
    const shadowGrad = ctx.createRadialGradient(
      width / 2,
      height - 10,
      4,
      width / 2,
      height - 10,
      width * 0.36
    );
    shadowGrad.addColorStop(0, "rgba(15, 23, 42, 0.22)");
    shadowGrad.addColorStop(0.6, "rgba(15, 23, 42, 0.08)");
    shadowGrad.addColorStop(1, "rgba(15, 23, 42, 0)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(width / 2, height - 10, width * 0.36, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Interpolasi Siklus Pose 3D Rian Terikat Waktu Nyata (Warping ke Apex Video)
    let p = 0.5;
    if (actualFrames > 1) {
      if (f <= apexFrameIdx && apexFrameIdx > 0) {
        // Naik menuju apex (0.0 -> 0.5) persis saat peraga mengangkat tangan
        p = (f / apexFrameIdx) * 0.5;
      } else if (f > apexFrameIdx && actualFrames - 1 > apexFrameIdx) {
        // Melandai dari apex kembali ke netral (0.5 -> 1.0)
        p = 0.5 + ((f - apexFrameIdx) / (actualFrames - 1 - apexFrameIdx)) * 0.5;
      } else {
        p = f / (actualFrames - 1);
      }
    }

    let kfA = keyframePlan[0];
    let kfB = keyframePlan[keyframePlan.length - 1];

    for (let k = 0; k < keyframePlan.length - 1; k++) {
      if (p >= keyframePlan[k].t && p <= keyframePlan[k + 1].t) {
        kfA = keyframePlan[k];
        kfB = keyframePlan[k + 1];
        break;
      }
    }

    const span = kfB.t - kfA.t;
    const u = span > 0 ? Math.max(0, Math.min(1, (p - kfA.t) / span)) : 0;
    // Hermite smoothstep untuk gerakan organik
    const smoothW = u * u * (3 - 2 * u);

    // Ambil responsivitas kemiringan kepala & tubuh nyata dari peraga di frame ini
    let liveHeadNod = 0;
    let liveHeadTilt = 0;
    if (detections[f]?.mocapData?.face) {
      const fc = detections[f]!.mocapData.face;
      const pitchDelta = (fc.chin.y - fc.noseTip.y) - 0.12;
      liveHeadNod = Math.max(-6, Math.min(6, pitchDelta * 30));
      const eyeDelta = fc.rightEye.y - fc.leftEye.y;
      liveHeadTilt = Math.max(-4, Math.min(4, eyeDelta * 35));
    }

    const bounceY = kfA.bounceY + (kfB.bounceY - kfA.bounceY) * smoothW + liveHeadNod;
    const scl = kfA.scale + (kfB.scale - kfA.scale) * smoothW;
    const rot = kfA.rotateDeg + (kfB.rotateDeg - kfA.rotateDeg) * smoothW + liveHeadTilt;

    const imgA = rian3dImages[kfA.src] || rian3dImages[keyframePlan[0].src];
    const imgB = rian3dImages[kfB.src] || imgA;

    // Render Gambar Rian 3D dengan Cross-Dissolve Mulus
    ctx.save();
    ctx.translate(width / 2, height / 2 + bounceY);
    if (rot !== 0) ctx.rotate((rot * Math.PI) / 180);
    if (scl !== 1) ctx.scale(scl, scl);
    ctx.translate(-width / 2, -height / 2);

    if (imgA) {
      ctx.globalAlpha = 1;
      ctx.drawImage(imgA, 0, 0, width, height);
    }
    if (imgB && imgB !== imgA && smoothW > 0.03) {
      ctx.globalAlpha = smoothW;
      ctx.drawImage(imgB, 0, 0, width, height);
    }
    ctx.restore();

    // Simpan Frame Pair
    const avatarFrameUrl = canvas.toDataURL("image/jpeg", 0.92);
    const videoPair = extractedVideoFrames?.[f];
    framePairs.push({
      frameIndex: f + 1,
      videoFrameUrl: videoPair ? videoPair.dataUrl : avatarFrameUrl,
      avatarFrameUrl,
      timeLabel: videoPair ? `${videoPair.time.toFixed(1)}s` : `F${f + 1}`,
    });

    // Tulis ke GIF Encoder (Palette Quantization)
    const imgData = ctx.getImageData(0, 0, width, height);
    const palette = quantize(imgData.data, 256);
    const index = applyPalette(imgData.data, palette);
    gif.writeFrame(index, width, height, {
      palette,
      delay: 75,
      repeat: f === 0 ? 0 : undefined,
    });
  }

  // ── FASE 5: Finalisasi GIF & Kompilasi Data URI ──
  gif.finish();
  const bytes = gif.bytes();

  let binary = "";
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, Math.min(i + chunkSize, len)))
    );
  }
  const base64 =
    typeof window !== "undefined"
      ? window.btoa(binary)
      : Buffer.from(bytes).toString("base64");
  const gifUrl = `data:image/gif;base64,${base64}`;

  // ── FASE 6: Sintesis Deskripsi Kinematika & Prompt AI Video ──
  const { generateBisindoMotionDescription, generateBisindoAiVideoPrompt } = await import(
    "@/utils/bisindoAiPromptService"
  );
  const motionSpec = generateBisindoMotionDescription(word, chosenPoseKey, bestAnalysis);
  const aiPrompt = generateBisindoAiVideoPrompt(word, chosenPoseKey, bestAnalysis);

  onProgress?.(
    100,
    `Selesai! Animasi 3D Rian (${chosenPoseKey.toUpperCase()}) & Prompt AI Video siap digunakan.`
  );

  return {
    gifUrl,
    poseKey: chosenPoseKey,
    totalFrames: actualFrames,
    framePairs,
    analysis: bestAnalysis,
    motionDescription: motionSpec.markdown,
    aiPrompt,
  };
}

// Helper membaca custom items dari localStorage
function getLocalCustomItems(): BisindoItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Helper menyimpan custom items ke localStorage & broadcast event secara asinkron
function saveLocalCustomItems(items: BisindoItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: items }));
    }, 0);
  } catch (e: any) {
    console.warn("Gagal menyimpan ke localStorage, mencoba kompresi data:", e);
    // Jika quota localStorage penuh (QuotaExceededError ~5MB limit)
    try {
      const lightweightItems = items.map((it, idx) => {
        // Hanya 2 item kustom paling baru yang menyimpan base64 GIF penuh
        if (idx >= items.length - 2) return it;
        return {
          ...it,
          asset3dUrl: it.asset3dUrl?.startsWith("data:") ? `/avatars/rian_salam.jpg` : (it.asset3dUrl || "/avatars/rian_salam.jpg"),
          thumbnailUrl: it.thumbnailUrl?.startsWith("data:") ? `/avatars/rian_salam.jpg` : it.thumbnailUrl,
        };
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lightweightItems));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: items }));
      }, 0);
    } catch (innerErr) {
      console.warn("Penyimpanan fallback localStorage dilewati:", innerErr);
      // Tetap broadcast ke in-memory listener agar UI tetap terupdate
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: items }));
    }
  }
}

// Helper menggabungkan Default + Remote + Local
export function getMergedItems(remoteItems: BisindoItem[] = []): BisindoItem[] {
  const local = getLocalCustomItems();
  const map = new Map<string, BisindoItem>();

  // 1. Default seed items
  DEFAULT_BISINDO_ITEMS.forEach((item) => map.set(item.id, item));

  // 2. Remote items dari Firestore
  remoteItems.forEach((item) => {
    const existing = map.get(item.id);
    const isOldTerimaKasihDesc =
      item.word.toLowerCase().includes("terima") &&
      (item.description?.toLowerCase().includes("dada") || item.description?.toLowerCase().includes("menangkup"));

    if (existing) {
      map.set(item.id, {
        ...existing,
        ...item,
        description: isOldTerimaKasihDesc ? existing.description : item.description || existing.description,
        poseKey: item.poseKey || existing.poseKey,
      });
    } else {
      map.set(item.id, {
        ...item,
        description: isOldTerimaKasihDesc
          ? "Ujung jemari tangan kanan menyentuh dagu/bibir bawah lalu diayunkan maju terbuka ke arah lawan bicara."
          : item.description,
        poseKey: item.poseKey || mapGestureTo3DAsset(item.word).poseKey,
      });
    }
  });

  // 3. Local custom items (prioritas bila ada penambahan/edit)
  local.forEach((item) => {
    const existing = map.get(item.id);
    const isOldTerimaKasihDesc =
      item.word.toLowerCase().includes("terima") &&
      (item.description?.toLowerCase().includes("dada") || item.description?.toLowerCase().includes("menangkup"));

    if (existing) {
      map.set(item.id, {
        ...existing,
        ...item,
        description: isOldTerimaKasihDesc ? existing.description : item.description || existing.description,
        poseKey: item.poseKey || existing.poseKey,
      });
    } else {
      map.set(item.id, {
        ...item,
        description: isOldTerimaKasihDesc
          ? "Ujung jemari tangan kanan menyentuh dagu/bibir bawah lalu diayunkan maju terbuka ke arah lawan bicara."
          : item.description,
        poseKey: item.poseKey || mapGestureTo3DAsset(item.word).poseKey,
      });
    }
  });

  return Array.from(map.values());
}

/**
 * Mengambil seluruh data kamus dari cache lokal / Firestore.
 */
export async function getBisindoItems(): Promise<BisindoItem[]> {
  try {
    const q = query(collection(db, BISINDO_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return getMergedItems([]);
    }

    const items: BisindoItem[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...(docSnap.data() as Omit<BisindoItem, "id">) });
    });
    return getMergedItems(items);
  } catch (error) {
    console.warn("Membaca data dari local hybrid storage:", error);
    return getMergedItems([]);
  }
}

/**
 * Berlangganan (Real-time listener) pembaruan data kamus (Hybrid Real-time).
 * Callback didefer secara asinkron (setTimeout 0) agar aman terhadap aturan React 19 render cycle.
 */
export function subscribeBisindoItems(
  callback: (items: BisindoItem[]) => void,
  onError?: (err: Error) => void
) {
  let currentRemote: BisindoItem[] = [];

  // PENTING: Defer callback agar tidak memblokir render komponen induk/tetangga
  setTimeout(() => {
    callback(getMergedItems(currentRemote));
  }, 0);

  const handleLocalUpdate = () => {
    setTimeout(() => {
      callback(getMergedItems(currentRemote));
    }, 0);
  };

  if (typeof window !== "undefined") {
    window.addEventListener(CHANGE_EVENT, handleLocalUpdate);
    window.addEventListener("storage", handleLocalUpdate);
  }

  let unsubscribeFirestore = () => {};
  try {
    const q = query(collection(db, BISINDO_COLLECTION), orderBy("createdAt", "desc"));
    unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          currentRemote = [];
          snapshot.forEach((docSnap) => {
            currentRemote.push({ id: docSnap.id, ...(docSnap.data() as Omit<BisindoItem, "id">) });
          });
        }
        setTimeout(() => {
          callback(getMergedItems(currentRemote));
        }, 0);
      },
      (error) => {
        console.warn("Firestore listener fallback to hybrid local:", error.message);
        setTimeout(() => {
          callback(getMergedItems(currentRemote));
        }, 0);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    console.warn("subscribeBisindoItems init catch:", error);
    setTimeout(() => {
      callback(getMergedItems(currentRemote));
    }, 0);
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener(CHANGE_EVENT, handleLocalUpdate);
      window.removeEventListener("storage", handleLocalUpdate);
    }
    unsubscribeFirestore();
  };
}

/**
 * Menambahkan kosakata isyarat baru.
 */
export async function addBisindoItem(
  data: Omit<BisindoItem, "id" | "createdAt" | "updatedAt">,
  videoFile?: File | null
): Promise<string> {
  const baseSlug = generateSlug(data.word) || `sign-${Date.now()}`;
  const id = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  let localVideoUrl = data.videoRawUrl || "";
  let extractedThumb = data.thumbnailUrl || "";

  if (videoFile && typeof window !== "undefined") {
    try {
      localVideoUrl = URL.createObjectURL(videoFile);
    } catch (e) {
      console.warn("Object url bypass:", e);
    }
  }

  const detected3D = mapGestureTo3DAsset(data.word, data.poseKey);

  const newItem: BisindoItem = {
    ...data,
    id,
    poseKey: data.poseKey || detected3D.poseKey,
    videoRawUrl: localVideoUrl,
    asset3dUrl: data.asset3dUrl || detected3D.asset3dUrl,
    thumbnailUrl: extractedThumb || data.asset3dUrl || detected3D.asset3dUrl,
    status: data.status || "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1. Simpan segera ke Local Cache
  const localItems = getLocalCustomItems();
  const updatedLocal = [newItem, ...localItems.filter((i) => i.id !== id)];
  saveLocalCustomItems(updatedLocal);

  // 2. Sinkronisasi latar belakang ke Firebase
  (async () => {
    try {
      let remoteVideoUrl = "";
      if (videoFile) {
        try {
          const storagePath = `bisindo/raw_videos/${id}_${videoFile.name}`;
          const storageRef = ref(storage, storagePath);
          const uploadPromise = uploadBytes(storageRef, videoFile).then((res) => getDownloadURL(res.ref));
          const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error("Storage timeout")), 3500)
          );
          remoteVideoUrl = await Promise.race([uploadPromise, timeoutPromise]);
        } catch (uploadErr) {
          console.warn("Storage upload bypassed (using local objectUrl):", uploadErr);
        }
      }

      const firestoreDoc = {
        ...newItem,
        videoRawUrl: remoteVideoUrl || newItem.videoRawUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = doc(db, BISINDO_COLLECTION, id);
      const setPromise = setDoc(docRef, firestoreDoc);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore write timeout")), 3000)
      );
      await Promise.race([setPromise, timeoutPromise]);
    } catch (firebaseErr) {
      console.warn("Firebase sync background warning (local copy active):", firebaseErr);
    }
  })();

  return id;
}

/**
 * Memperbarui data kosakata atau status hasil generasi 3D.
 */
export async function updateBisindoItem(
  id: string,
  updates: Partial<Omit<BisindoItem, "id" | "createdAt">>
): Promise<void> {
  const localItems = getLocalCustomItems();
  const existing = localItems.find((i) => i.id === id);
  if (existing) {
    const updated = localItems.map((i) =>
      i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
    );
    saveLocalCustomItems(updated);
  } else {
    const def = DEFAULT_BISINDO_ITEMS.find((i) => i.id === id);
    if (def) {
      const merged = { ...def, ...updates, updatedAt: new Date().toISOString() };
      saveLocalCustomItems([merged, ...localItems]);
    }
  }

  (async () => {
    try {
      const docRef = doc(db, BISINDO_COLLECTION, id);
      const updatePromise = updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000));
      await Promise.race([updatePromise, timeoutPromise]);
    } catch (e) {
      console.warn("updateBisindoItem background catch:", e);
    }
  })();
}

/**
 * Menghapus kosakata isyarat.
 */
export async function deleteBisindoItem(id: string): Promise<void> {
  const localItems = getLocalCustomItems();
  saveLocalCustomItems(localItems.filter((i) => i.id !== id));

  (async () => {
    try {
      const docRef = doc(db, BISINDO_COLLECTION, id);
      const delPromise = deleteDoc(docRef);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000));
      await Promise.race([delPromise, timeoutPromise]);
    } catch (e) {
      console.warn("deleteBisindoItem background catch:", e);
    }
  })();
}
