/// Model data untuk memetakan kelas output YOLOv8 BISINDO ke dalam bentuk 
/// label dan membedakan antara Alfabet dan Kata Kerja.
class BisindoSignLabel {
  final int id;
  final String label;
  final String indo;
  final bool isWord; // Menandakan apakah kelas ini adalah kata (true) atau alfabet (false)

  const BisindoSignLabel({
    required this.id,
    required this.label,
    required this.indo,
    required this.isWord,
  });
}

/// Batas minimal probabilitas deteksi (confidence score).
const double kBisindoConfidenceThreshold = 0.25;

/// Ukuran input model YOLOv8 Bisindo dalam piksel (width = height).
const int kBisindoModelInputSize = 640;

/// Tabel Konstanta 26 Kelas Alfabet BISINDO (A–Z).
const List<BisindoSignLabel> bisindoLabelsData = [
  BisindoSignLabel(id: 0, label: "A", indo: "A", isWord: false),
  BisindoSignLabel(id: 1, label: "B", indo: "B", isWord: false),
  BisindoSignLabel(id: 2, label: "C", indo: "C", isWord: false),
  BisindoSignLabel(id: 3, label: "D", indo: "D", isWord: false),
  BisindoSignLabel(id: 4, label: "E", indo: "E", isWord: false),
  BisindoSignLabel(id: 5, label: "F", indo: "F", isWord: false),
  BisindoSignLabel(id: 6, label: "G", indo: "G", isWord: false),
  BisindoSignLabel(id: 7, label: "H", indo: "H", isWord: false),
  BisindoSignLabel(id: 8, label: "I", indo: "I", isWord: false),
  BisindoSignLabel(id: 9, label: "J", indo: "J", isWord: false),
  BisindoSignLabel(id: 10, label: "K", indo: "K", isWord: false),
  BisindoSignLabel(id: 11, label: "L", indo: "L", isWord: false),
  BisindoSignLabel(id: 12, label: "M", indo: "M", isWord: false),
  BisindoSignLabel(id: 13, label: "N", indo: "N", isWord: false),
  BisindoSignLabel(id: 14, label: "O", indo: "O", isWord: false),
  BisindoSignLabel(id: 15, label: "P", indo: "P", isWord: false),
  BisindoSignLabel(id: 16, label: "Q", indo: "Q", isWord: false),
  BisindoSignLabel(id: 17, label: "R", indo: "R", isWord: false),
  BisindoSignLabel(id: 18, label: "S", indo: "S", isWord: false),
  BisindoSignLabel(id: 19, label: "T", indo: "T", isWord: false),
  BisindoSignLabel(id: 20, label: "U", indo: "U", isWord: false),
  BisindoSignLabel(id: 21, label: "V", indo: "V", isWord: false),
  BisindoSignLabel(id: 22, label: "W", indo: "W", isWord: false),
  BisindoSignLabel(id: 23, label: "X", indo: "X", isWord: false),
  BisindoSignLabel(id: 24, label: "Y", indo: "Y", isWord: false),
  BisindoSignLabel(id: 25, label: "Z", indo: "Z", isWord: false),
];
