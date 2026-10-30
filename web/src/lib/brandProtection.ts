/**
 * PROTEKSI MEREK RESMI: diBISAlitas
 * 
 * Modul ini memastikan entitas merek "diBISAlitas" (dengan kapitalisasi baku
 * "di" kecil, "BISA" kapital, "litas" kecil) TIDAK PERNAH diterjemahkan
 * ke bahasa apa pun oleh mesin terjemahan otomatis (Google Translate, LLM, dll).
 * 
 * ATURAN BAKU: Bebas emotikon Unicode di seluruh kode dan komentar.
 */

export const BRAND_NAME = "diBISAlitas";
export const BRAND_MASK_TOKEN = "__BRAND_DIBISALITAS__";

// Regex untuk mencocokkan berbagai variasi penulisan "diBISAlitas" yang belum baku
const BRAND_REGEX = /\bdi[- ]?bisa[- ]?litas\b/gi;

/**
 * Mengganti penyebutan nama merek menjadi token yang kebal dari mesin penerjemah.
 * Dijalankan SEBELUM teks dikirim ke Google Translate API.
 */
export function maskBrand(text: string): string {
  if (!text || typeof text !== "string") return text;
  return text.replace(BRAND_REGEX, BRAND_MASK_TOKEN);
}

/**
 * Mengembalikan token kembali menjadi "diBISAlitas" dengan kapitalisasi resmi.
 * Dijalankan SETELAH respons terjemahan diterima.
 * Juga bertindak sebagai regex pengaman terhadap kebocoran terjemahan harfiah.
 */
export function unmaskBrand(text: string): string {
  if (!text || typeof text !== "string") return text;

  // 1. Pulihkan token kembali ke nama resmi "diBISAlitas"
  let result = text.replace(/__\s*BRAND_DIBISALITAS\s*__/gi, BRAND_NAME);
  result = result.replace(/__BRAND_DIBISALITAS__/gi, BRAND_NAME);

  // 2. Post-processing regex pengaman terhadap terjemahan harfiah Google Translate
  result = result.replace(/\bcan[- ]abilities\b/gi, BRAND_NAME);
  result = result.replace(/\bcan[- ]ability\b/gi, BRAND_NAME);
  result = result.replace(/\bin[- ]abilities\b/gi, BRAND_NAME);
  result = result.replace(/\bin[- ]ability\b/gi, BRAND_NAME);
  result = result.replace(/\bat[- ]bisalitas\b/gi, BRAND_NAME);
  result = result.replace(/\bdi[- ]bisalitas\b/gi, BRAND_NAME);
  result = result.replace(/\bdibisalitas\b/gi, BRAND_NAME);
  result = result.replace(/\bdi[- ]bisa[- ]litas\b/gi, BRAND_NAME);

  return result;
}

/**
 * Daftar putih istilah yang dilindungi dari terjemahan otomatis
 */
export const DO_NOT_TRANSLATE_WHITELIST: readonly string[] = [
  "diBISAlitas",
  "POLMAN",
  "POLMAN Bandung",
  "BISINDO",
  "BiSAFE",
  "BiPANTAU",
  "BiSAPA",
  "BiBACA",
  "BiPINTAR",
  "BiJALAN",
  "BiKarier",
] as const;

/**
 * Kamus identitas merek dwibahasa
 */
export const BRAND_DICTIONARY = {
  id: {
    brandName: "diBISAlitas",
    tagline: "Ekosistem Aksesibilitas Cerdas Berbasis AI",
  },
  en: {
    brandName: "diBISAlitas",
    tagline: "AI-Powered Smart Accessibility Ecosystem",
  },
} as const;

