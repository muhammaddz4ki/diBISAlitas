/// Model data generik untuk memetakan kelas output YOLOv8 ke dalam bentuk 
/// label dan teks pelafalan Bahasa Indonesia.
class SignLabel {
  final int id;
  final String label;
  final String indo;
  final String? arabic;

  const SignLabel({
    required this.id,
    required this.label,
    required this.indo,
    this.arabic,
  });
}

/// Batas minimal probabilitas deteksi (confidence score).
/// Deteksi dengan skor di bawah ini akan difilter/diabaikan.
const double kConfidenceThreshold = 0.25;

/// Ukuran input model YOLOv8 dalam piksel (width = height).
const int kModelInputSize = 640;

/// Tabel Konstanta 29 Kelas Huruf Hijaiyah.
const List<SignLabel> hijaiyahLabelsData = [
  SignLabel(id: 0,  label: "Ain",        arabic: "ع",  indo: "'Ain"),
  SignLabel(id: 1,  label: "Alif",       arabic: "ا",  indo: "Alif"),
  SignLabel(id: 2,  label: "Ba",         arabic: "ب",  indo: "Ba"),
  SignLabel(id: 3,  label: "Dal",        arabic: "د",  indo: "Dal"),
  SignLabel(id: 4,  label: "Dhad",       arabic: "ض",  indo: "Dhad"),
  SignLabel(id: 5,  label: "Dzal",       arabic: "ذ",  indo: "Dzal"),
  SignLabel(id: 6,  label: "Fa",         arabic: "ف",  indo: "Fa"),
  SignLabel(id: 7,  label: "Gain",       arabic: "غ",  indo: "Gain"),
  SignLabel(id: 8,  label: "Ha",         arabic: "ح",  indo: "Ha"),
  SignLabel(id: 9,  label: "Hha",        arabic: "ه",  indo: "Hha"),
  SignLabel(id: 10, label: "Jim",        arabic: "ج",  indo: "Jim"),
  SignLabel(id: 11, label: "Kaf",        arabic: "ك",  indo: "Kaf"),
  SignLabel(id: 12, label: "Kha",        arabic: "خ",  indo: "Kha"),
  SignLabel(id: 13, label: "Lam",        arabic: "ل",  indo: "Lam"),
  SignLabel(id: 14, label: "Mim",        arabic: "م",  indo: "Mim"),
  SignLabel(id: 15, label: "Nun",        arabic: "ن",  indo: "Nun"),
  SignLabel(id: 16, label: "Qaf",        arabic: "ق",  indo: "Qaf"),
  SignLabel(id: 17, label: "Ra",         arabic: "ر",  indo: "Ra"),
  SignLabel(id: 18, label: "Shad",       arabic: "ص",  indo: "Shad"),
  SignLabel(id: 19, label: "Sin",        arabic: "س",  indo: "Sin"),
  SignLabel(id: 20, label: "Syin",       arabic: "ش",  indo: "Syin"),
  SignLabel(id: 21, label: "Ta",         arabic: "ت",  indo: "Ta"),
  SignLabel(id: 22, label: "TaMarbutah", arabic: "ة",  indo: "Ta Marbutah"),
  SignLabel(id: 23, label: "Tha",        arabic: "ط",  indo: "Tha"),
  SignLabel(id: 24, label: "Tsa",        arabic: "ث",  indo: "Tsa"),
  SignLabel(id: 25, label: "Waw",        arabic: "و",  indo: "Waw"),
  SignLabel(id: 26, label: "Ya",         arabic: "ي",  indo: "Ya"),
  SignLabel(id: 27, label: "Zaa",        arabic: "ظ",  indo: "Zaa"),
  SignLabel(id: 28, label: "Zay",        arabic: "ز",  indo: "Zay"),
];

/// Tabel Konstanta 48 Kelas Bahasa Isyarat Umum.
const List<SignLabel> umumLabelsData = [
  SignLabel(id: 0, label: "A", indo: "A"),
  SignLabel(id: 1, label: "B", indo: "B"),
  SignLabel(id: 2, label: "C", indo: "C"),
  SignLabel(id: 3, label: "D", indo: "D"),
  SignLabel(id: 4, label: "E", indo: "E"),
  SignLabel(id: 5, label: "F", indo: "F"),
  SignLabel(id: 6, label: "G", indo: "G"),
  SignLabel(id: 7, label: "H", indo: "H"),
  SignLabel(id: 8, label: "I", indo: "I"),
  SignLabel(id: 9, label: "J", indo: "J"),
  SignLabel(id: 10, label: "K", indo: "K"),
  SignLabel(id: 11, label: "L", indo: "L"),
  SignLabel(id: 12, label: "M", indo: "M"),
  SignLabel(id: 13, label: "N", indo: "N"),
  SignLabel(id: 14, label: "O", indo: "O"),
  SignLabel(id: 15, label: "P", indo: "P"),
  SignLabel(id: 16, label: "Q", indo: "Q"),
  SignLabel(id: 17, label: "R", indo: "R"),
  SignLabel(id: 18, label: "S", indo: "S"),
  SignLabel(id: 19, label: "T", indo: "T"),
  SignLabel(id: 20, label: "U", indo: "U"),
  SignLabel(id: 21, label: "V", indo: "V"),
  SignLabel(id: 22, label: "W", indo: "W"),
  SignLabel(id: 23, label: "X", indo: "X"),
  SignLabel(id: 24, label: "Y", indo: "Y"),
  SignLabel(id: 25, label: "z", indo: "Z"),
  SignLabel(id: 26, label: "Berdoa", indo: "Berdoa"),
  SignLabel(id: 27, label: "Berjalan", indo: "Berjalan"),
  SignLabel(id: 28, label: "Bermain", indo: "Bermain"),
  SignLabel(id: 29, label: "Berpikir", indo: "Berpikir"),
  SignLabel(id: 30, label: "Bicara", indo: "Bicara"),
  SignLabel(id: 31, label: "Duduk", indo: "Duduk"),
  SignLabel(id: 32, label: "Makan", indo: "Makan"),
  SignLabel(id: 33, label: "Mandi", indo: "Mandi"),
  SignLabel(id: 34, label: "Melihat", indo: "Melihat"),
  SignLabel(id: 35, label: "Membaca", indo: "Membaca"),
  SignLabel(id: 36, label: "Membuat", indo: "Membuat"),
  SignLabel(id: 37, label: "Memeluk", indo: "Memeluk"),
  SignLabel(id: 38, label: "Memukul", indo: "Memukul"),
  SignLabel(id: 39, label: "Menangis", indo: "Menangis"),
  SignLabel(id: 40, label: "Mendorong", indo: "Mendorong"),
  SignLabel(id: 41, label: "Menggambar", indo: "Menggambar"),
  SignLabel(id: 42, label: "Menuangkan", indo: "Menuangkan"),
  SignLabel(id: 43, label: "Minum", indo: "Minum"),
  SignLabel(id: 44, label: "Saya", indo: "Saya"),
  SignLabel(id: 45, label: "Tidur", indo: "Tidur"),
  SignLabel(id: 46, label: "berhenti", indo: "Berhenti"),
  SignLabel(id: 47, label: "Z", indo: "Z"),
];
