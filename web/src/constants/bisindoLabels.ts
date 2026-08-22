/**
 * Tipe Data generik untuk mendefinisikan kamus pelafalan dan teks murni huruf isyarat BISINDO.
 */
export interface BisindoSignLabel {
  id: number;
  label: string;
  isWord: boolean; // Menandakan apakah ini kata kerja (true) atau alfabet (false)
}

/**
 * Batas minimal probabilitas deteksi (confidence score).
 * Deteksi dengan skor di bawah ini akan difilter/diabaikan.
 */
export const BISINDO_CONFIDENCE_THRESHOLD = 0.25;

/**
 * Ukuran input model YOLOv8 dalam piksel (width = height).
 */
export const BISINDO_MODEL_INPUT_SIZE = 640;

/**
 * Tabel Lookup 48 Kelas Isyarat BISINDO (Alfabet & Kata).
 * Disusun berdasarkan urutan model YOLOv8 hasil training.
 */
export const BISINDO_LABELS: BisindoSignLabel[] = [
  { id: 0,  label: "A", isWord: false },
  { id: 1,  label: "B", isWord: false },
  { id: 2,  label: "C", isWord: false },
  { id: 3,  label: "D", isWord: false },
  { id: 4,  label: "E", isWord: false },
  { id: 5,  label: "F", isWord: false },
  { id: 6,  label: "G", isWord: false },
  { id: 7,  label: "H", isWord: false },
  { id: 8,  label: "I", isWord: false },
  { id: 9,  label: "J", isWord: false },
  { id: 10, label: "K", isWord: false },
  { id: 11, label: "L", isWord: false },
  { id: 12, label: "M", isWord: false },
  { id: 13, label: "N", isWord: false },
  { id: 14, label: "O", isWord: false },
  { id: 15, label: "P", isWord: false },
  { id: 16, label: "Q", isWord: false },
  { id: 17, label: "R", isWord: false },
  { id: 18, label: "S", isWord: false },
  { id: 19, label: "T", isWord: false },
  { id: 20, label: "U", isWord: false },
  { id: 21, label: "V", isWord: false },
  { id: 22, label: "W", isWord: false },
  { id: 23, label: "X", isWord: false },
  { id: 24, label: "Y", isWord: false },
  { id: 25, label: "Z", isWord: false },
];
