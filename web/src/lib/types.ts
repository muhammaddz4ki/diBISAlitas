import { Timestamp } from "firebase/firestore";

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
