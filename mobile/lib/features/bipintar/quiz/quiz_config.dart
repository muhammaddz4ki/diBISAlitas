import 'dart:math';
import '../../../core/constants/sign_labels.dart';

/// Konfigurasi & aturan skor untuk mode Quiz "Tantangan Isyarat" (Camera Challenge).
class QuizConfig {
  /// Jumlah soal per sesi.
  static const int questionsPerSession = 10;

  /// Waktu maksimal per soal (detik).
  static const int timePerQuestionSec = 30;

  /// Confidence minimum agar deteksi dihitung sebagai jawaban benar.
  static const double matchScore = 0.5;

  /// Lama (ms) isyarat benar harus ditahan stabil sebelum dihitung benar.
  static const int holdMs = 700;

  /// Interval loop game internal (ms).
  static const int tickMs = 100;

  static const int basePoints = 50;
  static const int timeBonusPerSec = 2;
  static const int streakBonus = 10;
}

/// Hitung poin satu soal benar.
int computeQuestionScore(double timeLeftSec, int streakAfter) {
  final timeBonus = max(0, timeLeftSec.floor()) * QuizConfig.timeBonusPerSec;
  final streakBonusVal = max(0, streakAfter - 1) * QuizConfig.streakBonus;
  return QuizConfig.basePoints + timeBonus + streakBonusVal;
}

/// Acak label lalu ambil sejumlah soal (Fisher–Yates via shuffle).
List<SignLabel> buildQuestionQueue(List<SignLabel> labels, int count) {
  final pool = List<SignLabel>.from(labels)..shuffle();
  if (count <= pool.length) return pool.sublist(0, count);
  final result = <SignLabel>[];
  while (result.length < count) {
    result.addAll(pool);
  }
  return result.sublist(0, count);
}
