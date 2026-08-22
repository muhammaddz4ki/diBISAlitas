/**
 * Tipe Data generik untuk mendefinisikan kamus pelafalan dan teks murni huruf isyarat.
 */
export interface SignLabel {
  id: number;
  label: string;
  indo: string;
  arabic?: string;
  type?: "hijaiyah" | "bisindo";
}

/**
 * Batas minimal probabilitas deteksi (confidence score).
 * Deteksi dengan skor di bawah ini akan difilter/diabaikan.
 */
export const CONFIDENCE_THRESHOLD = 0.25;

/**
 * Ukuran input model YOLOv8 dalam piksel (width = height).
 */
export const MODEL_INPUT_SIZE = 640;

/**
 * Tabel Lookup 29 Kelas Huruf Hijaiyah.
 */
export const HIJAIYAH_LABELS: SignLabel[] = [
  { id: 0,  label: "Ain",        arabic: "ع",  indo: "'Ain" },
  { id: 1,  label: "Alif",       arabic: "ا",  indo: "Alif" },
  { id: 2,  label: "Ba",         arabic: "ب",  indo: "Ba" },
  { id: 3,  label: "Dal",        arabic: "د",  indo: "Dal" },
  { id: 4,  label: "Dhad",       arabic: "ض",  indo: "Dhad" },
  { id: 5,  label: "Dzal",       arabic: "ذ",  indo: "Dzal" },
  { id: 6,  label: "Fa",         arabic: "ف",  indo: "Fa" },
  { id: 7,  label: "Gain",       arabic: "غ",  indo: "Gain" },
  { id: 8,  label: "Ha",         arabic: "ح",  indo: "Ha" },
  { id: 9,  label: "Hha",        arabic: "ه",  indo: "Hha" },
  { id: 10, label: "Jim",        arabic: "ج",  indo: "Jim" },
  { id: 11, label: "Kaf",        arabic: "ك",  indo: "Kaf" },
  { id: 12, label: "Kha",        arabic: "خ",  indo: "Kha" },
  { id: 13, label: "Lam",        arabic: "ل",  indo: "Lam" },
  { id: 14, label: "Mim",        arabic: "م",  indo: "Mim" },
  { id: 15, label: "Nun",        arabic: "ن",  indo: "Nun" },
  { id: 16, label: "Qaf",        arabic: "ق",  indo: "Qaf" },
  { id: 17, label: "Ra",         arabic: "ر",  indo: "Ra" },
  { id: 18, label: "Shad",       arabic: "ص",  indo: "Shad" },
  { id: 19, label: "Sin",        arabic: "س",  indo: "Sin" },
  { id: 20, label: "Syin",       arabic: "ش",  indo: "Syin" },
  { id: 21, label: "Ta",         arabic: "ت",  indo: "Ta" },
  { id: 22, label: "TaMarbutah", arabic: "ة",  indo: "Ta Marbutah" },
  { id: 23, label: "Tha",        arabic: "ط",  indo: "Tha" },
  { id: 24, label: "Tsa",        arabic: "ث",  indo: "Tsa" },
  { id: 25, label: "Waw",        arabic: "و",  indo: "Waw" },
  { id: 26, label: "Ya",         arabic: "ي",  indo: "Ya" },
  { id: 27, label: "Zaa",        arabic: "ظ",  indo: "Zaa" },
  { id: 28, label: "Zay",        arabic: "ز",  indo: "Zay" },
];

/**
 * Tabel Lookup 48 Kelas Bahasa Isyarat Umum.
 */
export const UMUM_LABELS: SignLabel[] = [
  { id: 0, label: "A", indo: "A" },
  { id: 1, label: "B", indo: "B" },
  { id: 2, label: "C", indo: "C" },
  { id: 3, label: "D", indo: "D" },
  { id: 4, label: "E", indo: "E" },
  { id: 5, label: "F", indo: "F" },
  { id: 6, label: "G", indo: "G" },
  { id: 7, label: "H", indo: "H" },
  { id: 8, label: "I", indo: "I" },
  { id: 9, label: "J", indo: "J" },
  { id: 10, label: "K", indo: "K" },
  { id: 11, label: "L", indo: "L" },
  { id: 12, label: "M", indo: "M" },
  { id: 13, label: "N", indo: "N" },
  { id: 14, label: "O", indo: "O" },
  { id: 15, label: "P", indo: "P" },
  { id: 16, label: "Q", indo: "Q" },
  { id: 17, label: "R", indo: "R" },
  { id: 18, label: "S", indo: "S" },
  { id: 19, label: "T", indo: "T" },
  { id: 20, label: "U", indo: "U" },
  { id: 21, label: "V", indo: "V" },
  { id: 22, label: "W", indo: "W" },
  { id: 23, label: "X", indo: "X" },
  { id: 24, label: "Y", indo: "Y" },
  { id: 25, label: "z", indo: "Z" },
  { id: 26, label: "Berdoa", indo: "Berdoa" },
  { id: 27, label: "Berjalan", indo: "Berjalan" },
  { id: 28, label: "Bermain", indo: "Bermain" },
  { id: 29, label: "Berpikir", indo: "Berpikir" },
  { id: 30, label: "Bicara", indo: "Bicara" },
  { id: 31, label: "Duduk", indo: "Duduk" },
  { id: 32, label: "Makan", indo: "Makan" },
  { id: 33, label: "Mandi", indo: "Mandi" },
  { id: 34, label: "Melihat", indo: "Melihat" },
  { id: 35, label: "Membaca", indo: "Membaca" },
  { id: 36, label: "Membuat", indo: "Membuat" },
  { id: 37, label: "Memeluk", indo: "Memeluk" },
  { id: 38, label: "Memukul", indo: "Memukul" },
  { id: 39, label: "Menangis", indo: "Menangis" },
  { id: 40, label: "Mendorong", indo: "Mendorong" },
  { id: 41, label: "Menggambar", indo: "Menggambar" },
  { id: 42, label: "Menuangkan", indo: "Menuangkan" },
  { id: 43, label: "Minum", indo: "Minum" },
  { id: 44, label: "Saya", indo: "Saya" },
  { id: 45, label: "Tidur", indo: "Tidur" },
  { id: 46, label: "berhenti", indo: "Berhenti" },
  { id: 47, label: "Z", indo: "Z" },
];
