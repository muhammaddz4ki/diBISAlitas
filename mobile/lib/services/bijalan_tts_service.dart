import 'package:flutter_tts/flutter_tts.dart';
import 'package:vibration/vibration.dart';
import '../core/utils/bijalan_yolo_parser.dart';

/// Panduan suara BiJALAN yang lebih cerdas untuk tunanetra:
/// - Memilih rintangan paling GENTING (kedekatan + berada di jalur/tengah).
/// - Menyebut ARAH (kiri/depan/kanan) & JARAK berjenjang (agak jauh/dekat/sangat dekat).
/// - Getar berjenjang + nada/kecepatan bicara naik saat sangat dekat.
/// - Throttle adaptif per-label (makin dekat makin sering).
class BijalanTTSService {
  final FlutterTts _flutterTts = FlutterTts();
  final Map<String, int> _lastSpokenTime = {};
  bool _isSpeaking = false;
  double _baseSpeed = 0.5;

  /// Ukuran ruang koordinat model (piksel).
  static const double _frame = 640.0;

  BijalanTTSService() {
    _initTts();
  }

  double get baseSpeed => _baseSpeed;

  Future<void> setBaseSpeed(double speed) async {
    _baseSpeed = speed;
    await _flutterTts.setSpeechRate(speed);
  }

  Future<void> _initTts() async {
    await _flutterTts.setLanguage("id-ID");
    await _flutterTts.setSpeechRate(_baseSpeed);
    await _flutterTts.setVolume(1.0);
    await _flutterTts.setPitch(1.0);
    _flutterTts.setCompletionHandler(() {
      _isSpeaking = false;
    });
  }

  Future<void> speakDetections(List<BijalanParseResult> detections) async {
    if (detections.isEmpty || _isSpeaking) return;

    final now = DateTime.now().millisecondsSinceEpoch;

    // Pilih rintangan paling genting: urgensi = rasio area × bobot pusat (di jalur).
    BijalanParseResult? target;
    double bestUrgency = 0;
    for (final d in detections) {
      final areaRatio = d.area / (_frame * _frame);
      final cx = d.box[0] / _frame;
      final centerBonus = (1 - (cx - 0.5).abs() * 2).clamp(0.0, 1.0);
      final urgency = areaRatio * (0.6 + 0.4 * centerBonus);
      if (urgency > bestUrgency) {
        bestUrgency = urgency;
        target = d;
      }
    }
    if (target == null) return;

    final areaRatio = target.area / (_frame * _frame);
    final int level = areaRatio > 0.35 ? 2 : (areaRatio > 0.15 ? 1 : 0);

    final int throttle = level == 2 ? 1200 : (level == 1 ? 2200 : 3500);
    final int last = _lastSpokenTime[target.label] ?? 0;
    if (now - last < throttle) return;
    _lastSpokenTime[target.label] = now;

    final double cx = target.box[0] / _frame;
    final String arah = cx < 0.38 ? "di kiri" : (cx > 0.62 ? "di kanan" : "di depan");
    final String jarak =
        level == 2 ? "sangat dekat" : (level == 1 ? "dekat" : "agak jauh");
    final String label = _capitalize(target.label);
    final String text =
        level == 2 ? "Awas! $label $arah, $jarak." : "$label $arah, $jarak.";

    // Getar berjenjang
    if (await Vibration.hasVibrator() ?? false) {
      if (level == 2) {
        Vibration.vibrate(duration: 320, amplitude: 255);
      } else if (level == 1) {
        Vibration.vibrate(duration: 140, amplitude: 170);
      }
    }

    _isSpeaking = true;
    await _flutterTts.setPitch(level == 2 ? 1.25 : 1.0);
    await _flutterTts.setSpeechRate(level == 2 ? (_baseSpeed + 0.05).clamp(0.0, 1.0) : _baseSpeed);
    await _flutterTts.speak(text);
  }

  String _capitalize(String s) =>
      s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

  void cancel() {
    _flutterTts.stop();
    _isSpeaking = false;
  }
}
