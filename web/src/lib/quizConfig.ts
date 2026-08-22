import { SignLabel } from "@/constants/signLabels";

/**
 * Konfigurasi & aturan skor untuk mode Quiz "Tantangan Isyarat" (Camera Challenge).
 * Dipakai bersama oleh hook game (useSignQuiz) dan halaman quiz.
 */
export const QUIZ_CONFIG = {
  /** Jumlah soal per sesi permainan */
  questionsPerSession: 10,
  /** Waktu maksimal per soal (detik) */
  timePerQuestionSec: 30,
  /**
   * Confidence minimum agar sebuah deteksi dihitung sebagai jawaban.
   * Lebih tinggi dari CONFIDENCE_THRESHOLD deteksi biasa (0.25) agar tidak asal lolos.
   */
  matchScore: 0.5,
  /**
   * Berapa lama (ms) isyarat yang benar harus DITAHAN stabil sebelum dihitung benar.
   * Mencegah false-positive akibat kedipan deteksi satu-dua frame.
   */
  holdMs: 700,
  /** Interval loop game internal (ms) */
  tickMs: 100,
} as const;

/** Poin dasar untuk setiap jawaban benar */
export const BASE_POINTS = 50;
/** Poin bonus per detik sisa waktu */
export const TIME_BONUS_PER_SEC = 2;
/** Poin bonus per level streak (beruntun) */
export const STREAK_BONUS = 10;

/**
 * Hitung poin satu soal yang dijawab benar.
 * @param timeLeftSec sisa waktu (detik) saat benar
 * @param streakAfter nilai streak SETELAH jawaban benar ini (>=1)
 */
export function computeQuestionScore(timeLeftSec: number, streakAfter: number): number {
  const timeBonus = Math.max(0, Math.floor(timeLeftSec)) * TIME_BONUS_PER_SEC;
  const streakBonus = Math.max(0, streakAfter - 1) * STREAK_BONUS;
  return BASE_POINTS + timeBonus + streakBonus;
}

/**
 * Acak urutan label lalu ambil sejumlah soal (tanpa pengulangan bila cukup).
 * Fisher–Yates shuffle.
 */
export function buildQuestionQueue(labels: SignLabel[], count: number): SignLabel[] {
  const pool = [...labels];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  if (count <= pool.length) return pool.slice(0, count);
  // Bila diminta lebih banyak dari jumlah label, ulangi pool teracak.
  const result: SignLabel[] = [];
  while (result.length < count) {
    result.push(...pool);
  }
  return result.slice(0, count);
}
