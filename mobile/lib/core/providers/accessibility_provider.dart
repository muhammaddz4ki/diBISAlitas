import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Faktor perbesaran teks per level
const List<double> kFontScales = [1.0, 1.15, 1.3];
const List<String> kFontLabels = ['Normal', 'Besar', 'Sangat Besar'];

class AccessibilitySettings {
  final int fontLevel;
  final bool highContrast;
  final bool reduceMotion;
  final bool talkback;

  const AccessibilitySettings({
    this.fontLevel = 0,
    this.highContrast = false,
    this.reduceMotion = false,
    this.talkback = false,
  });

  double get fontScale =>
      kFontScales[fontLevel.clamp(0, kFontScales.length - 1)];

  AccessibilitySettings copyWith({
    int? fontLevel,
    bool? highContrast,
    bool? reduceMotion,
    bool? talkback,
  }) {
    return AccessibilitySettings(
      fontLevel: fontLevel ?? this.fontLevel,
      highContrast: highContrast ?? this.highContrast,
      reduceMotion: reduceMotion ?? this.reduceMotion,
      talkback: talkback ?? this.talkback,
    );
  }
}

class AccessibilityNotifier extends StateNotifier<AccessibilitySettings> {
  AccessibilityNotifier() : super(const AccessibilitySettings()) {
    _load();
  }

  static const String _kFont = 'a11y_font';
  static const String _kHc = 'a11y_hc';
  static const String _kRm = 'a11y_rm';
  static const String _kTb = 'a11y_tb';

  Future<void> _load() async {
    final p = await SharedPreferences.getInstance();
    state = AccessibilitySettings(
      fontLevel: p.getInt(_kFont) ?? 0,
      highContrast: p.getBool(_kHc) ?? false,
      reduceMotion: p.getBool(_kRm) ?? false,
      talkback: p.getBool(_kTb) ?? false,
    );
  }

  Future<void> setFontLevel(int n) async {
    state = state.copyWith(fontLevel: n.clamp(0, kFontScales.length - 1));
    (await SharedPreferences.getInstance()).setInt(_kFont, state.fontLevel);
  }

  Future<void> toggleHighContrast() async {
    state = state.copyWith(highContrast: !state.highContrast);
    (await SharedPreferences.getInstance()).setBool(_kHc, state.highContrast);
  }

  Future<void> toggleReduceMotion() async {
    state = state.copyWith(reduceMotion: !state.reduceMotion);
    (await SharedPreferences.getInstance()).setBool(_kRm, state.reduceMotion);
  }

  Future<void> toggleTalkback() async {
    state = state.copyWith(talkback: !state.talkback);
    (await SharedPreferences.getInstance()).setBool(_kTb, state.talkback);
  }
}

final accessibilityProvider =
    StateNotifierProvider<AccessibilityNotifier, AccessibilitySettings>(
  (ref) => AccessibilityNotifier(),
);
