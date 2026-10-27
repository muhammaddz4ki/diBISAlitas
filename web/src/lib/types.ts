import { Timestamp, FieldValue } from "firebase/firestore";

/**
 * Skema terpadu untuk dokumen koleksi `emergency_reports`.
 * Sumber kebenaran tunggal yang dipakai bersama oleh penulis (BiSAFE) dan
 * pembaca (dashboard admin, history, listener notifikasi) di web, serta
 * kompatibel dengan skema yang ditulis aplikasi mobile.
 *
 * PENTING: dokumen WAJIB memiliki `createdAt` — semua query admin memakai
 * orderBy("createdAt"), dan Firestore mengecualikan dokumen tanpa field itu.
 */
export interface EmergencyReport {
  id: string;
  userId?: string | null;
  /** Nama pelapor. Web menulis `userName` dan `reporterName` (nilai sama). */
  userName?: string;
  reporterName?: string;
  email?: string;
  reporterEmail?: string;
  userPhone?: string;
  disabilityType?: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  message?: string;
  status: string; // 'pending' | 'active' | 'responding' | 'resolved' | 'cancelled'
  triggerType?: string; // 'button' | 'shake' | 'gesture' | 'text'
  source?: string; // 'web_portal' | 'mobile'
  createdAt?: Timestamp | null;
}

/**
 * Skema terpadu untuk koleksi `bisindo_dictionary`.
 * Digunakan untuk manajemen materi isyarat 3D di Super Admin / Developer Studio
 * dan konsumsi dinamis di biPINTAR, biSAPA, serta Floating 3D Widget.
 */
export type BisindoCategory = 'sapaan' | 'akademik' | 'darurat' | 'harian' | 'angka' | 'alfabet';
export type BisindoDifficulty = 'mudah' | 'sedang' | 'sulit';
export type BisindoGenerationStatus = 'raw_uploaded' | 'generating_3d' | 'ready' | 'failed';

export interface BisindoItem {
  id: string;               // slug: misal 'selamat-pagi'
  word: string;             // 'Selamat Pagi'
  category: BisindoCategory;
  difficulty: BisindoDifficulty;
  description?: string;     // Tips / petunjuk peragaan
  videoRawUrl: string;      // Video asli rekaman kamera HP
  asset3dUrl?: string;      // Aset animasi 3D hasil generate (Rian POLMAN)
  thumbnailUrl?: string;    // Gambar cuplikan pose utama
  poseKey?: string;         // 'terima_kasih' | 'salam' | 'ya' | 'bisa' | 'halo' | 'tolong'
  status: BisindoGenerationStatus;
  authorEmail?: string;
  createdAt?: Timestamp | FieldValue | string | null;
  updatedAt?: Timestamp | FieldValue | string | null;
}

