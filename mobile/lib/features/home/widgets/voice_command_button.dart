import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:vibration/vibration.dart';
import 'package:shared_preferences/shared_preferences.dart';

const Color _tosca = Color(0xFF00B894);

const String _kGuideSpeech =
    'Ketuk mikrofon, tunggu nada, lalu ucapkan satu kata untuk membuka fitur. '
    'Baca untuk BiBACA. Ngobrol untuk BiSAPA. Jalan untuk BiJALAN. '
    'Belajar untuk BiPINTAR. Darurat untuk BiSAFE. '
    'Atau ucapkan peta, komunitas, profil, atau beranda.';

const List<List<String>> _kGuideItems = [
  ['baca', 'BiBACA — pindai & bacakan teks'],
  ['ngobrol', 'BiSAPA — terjemah suara & teks'],
  ['jalan', 'BiJALAN — navigasi rintangan'],
  ['belajar', 'BiPINTAR — materi & kuis'],
  ['darurat', 'BiSAFE — tombol darurat'],
  ['peta', 'Peta Komunitas'],
  ['komunitas', 'Komunitas & info'],
  ['beranda', 'Halaman utama'],
  ['profil', 'Akun & pengaturan'],
];

/// Perintah suara untuk Tunanetra — buka fitur tanpa melihat layar.
/// Contoh: "buka BiJALAN", "kirim darurat", "komunitas", "bantuan".
class VoiceCommandButton extends StatefulWidget {
  const VoiceCommandButton({super.key});

  @override
  State<VoiceCommandButton> createState() => _VoiceCommandButtonState();
}

class _VoiceCommandButtonState extends State<VoiceCommandButton> {
  final FlutterTts _tts = FlutterTts();
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _listening = false;
  bool _introSeen = false;

  // keyword → rute + label
  static const List<Map<String, dynamic>> _commands = [
    {'keys': ['beranda', 'dashboard', 'utama', 'depan'], 'path': '/', 'label': 'Beranda'},
    {'keys': ['komunitas', 'forum', 'pengumuman'], 'path': '/komunitas', 'label': 'Komunitas'},
    {'keys': ['peta', 'lokasi', 'rintangan'], 'path': '/peta', 'label': 'Peta Komunitas'},
    {'keys': ['profil', 'akun', 'pengaturan', 'setelan'], 'path': '/profil', 'label': 'Profil'},
    {'keys': ['darurat', 'tolong', 'panik', 'bahaya', 'bisafe'], 'path': '/bisafe', 'label': 'BiSAFE Darurat'},
    {'keys': ['sapa', 'bisapa', 'ngobrol', 'obrol', 'percakapan', 'komunikasi', 'terjemah'], 'path': '/bisapa', 'label': 'BiSAPA'},
    {'keys': ['baca', 'membaca', 'bibaca', 'pindai', 'dokumen', 'tulisan', 'teks'], 'path': '/bibaca', 'label': 'BiBACA'},
    {'keys': ['jalan', 'bijalan', 'navigasi', 'rute'], 'path': '/bijalan', 'label': 'BiJALAN'},
    {'keys': ['pintar', 'bipintar', 'belajar', 'kuis', 'materi', 'isyarat', 'latihan'], 'path': '/bipintar', 'label': 'BiPINTAR'},
  ];

  /// Pilih perintah dengan skor paling spesifik (kata utuh & lebih panjang menang).
  Map<String, dynamic>? _pick(String t) {
    final words = t.split(RegExp(r'\s+'));
    Map<String, dynamic>? best;
    int bestScore = 0;
    for (final c in _commands) {
      for (final k in (c['keys'] as List).cast<String>()) {
        if (t.contains(k)) {
          final score = k.length + (words.contains(k) ? 5 : 0);
          if (score > bestScore) {
            bestScore = score;
            best = c;
          }
        }
      }
    }
    return best;
  }

  @override
  void initState() {
    super.initState();
    _tts.setLanguage('id-ID');
    _tts.setSpeechRate(0.5);
    _loadIntro();
  }

  Future<void> _loadIntro() async {
    final p = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() => _introSeen = p.getBool('voice_intro_seen') ?? false);
    }
  }

  Future<void> _markIntroSeen() async {
    final p = await SharedPreferences.getInstance();
    await p.setBool('voice_intro_seen', true);
  }

  Future<void> _speakGuide() => _speak(_kGuideSpeech);

  void _openGuide() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.fromLTRB(24, 18, 24, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(
                  color: const Color(0xFFE2E8F0),
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Panduan Perintah Suara',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
            const SizedBox(height: 4),
            const Text('Ketuk mikrofon, tunggu nada, lalu ucapkan satu kata:',
                style: TextStyle(fontSize: 13, color: Colors.black45)),
            const SizedBox(height: 16),
            ..._kGuideItems.map((it) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    children: [
                      Container(
                        width: 96,
                        alignment: Alignment.center,
                        padding: const EdgeInsets.symmetric(vertical: 7),
                        decoration: BoxDecoration(
                          color: _tosca.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text('"${it[0]}"',
                            style: const TextStyle(
                                color: _tosca,
                                fontWeight: FontWeight.w800,
                                fontSize: 13)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(it[1],
                            style: const TextStyle(
                                fontSize: 13, color: Colors.black54)),
                      ),
                    ],
                  ),
                )),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                onPressed: _speakGuide,
                icon: const Icon(Icons.volume_up_rounded, color: Colors.white),
                label: const Text('Dengarkan Panduan',
                    style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 14)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _tosca,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Tips: ucapkan satu kata inti saja, mis. "baca". '
              'Ucapkan "bantuan" kapan saja untuk mendengar daftar ini.',
              style: TextStyle(fontSize: 12, color: Colors.black38),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _speak(String text) async {
    await _tts.stop();
    await _tts.speak(text);
  }

  Future<void> _buzz(int ms) async {
    if (await Vibration.hasVibrator() ?? false) {
      Vibration.vibrate(duration: ms);
    }
  }

  void _handle(String raw) {
    final t = raw.toLowerCase().trim();
    if (t.isEmpty) return;

    if (t.contains('bantuan') || t.contains('perintah') || t.contains('daftar')) {
      _speak('Ucapkan salah satu kata ini: baca, ngobrol, jalan, belajar, '
          'peta, komunitas, profil, beranda, atau darurat.');
      return;
    }

    final c = _pick(t);
    if (c != null) {
      _speak('Membuka ${c['label']}');
      _buzz(40);
      if (mounted) context.go(c['path'] as String);
      return;
    }
    _speak('Perintah tidak dikenali. Ucapkan bantuan untuk mendengar daftar perintah.');
    _buzz(60);
  }

  Future<void> _toggle() async {
    if (_listening) {
      await _speech.stop();
      if (mounted) setState(() => _listening = false);
      return;
    }

    // Pertama kali: tampilkan + bacakan panduan dulu, belum mendengarkan.
    if (!_introSeen) {
      _introSeen = true;
      _markIntroSeen();
      _buzz(30);
      _speak('Selamat datang di perintah suara. $_kGuideSpeech');
      _openGuide();
      return;
    }

    final available = await _speech.initialize(
      onStatus: (s) {
        if ((s == 'done' || s == 'notListening') && mounted) {
          setState(() => _listening = false);
        }
      },
      onError: (_) {
        if (mounted) setState(() => _listening = false);
      },
    );

    if (!available) {
      _speak('Perintah suara tidak tersedia di perangkat ini.');
      return;
    }

    setState(() => _listening = true);
    _speak('Silakan bicara');
    _buzz(30);

    _speech.listen(
      localeId: 'id_ID',
      onResult: (val) {
        if (val.finalResult) _handle(val.recognizedWords);
      },
    );
  }

  @override
  void dispose() {
    _speech.stop();
    _tts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: _listening ? 'Berhenti mendengarkan perintah suara' : 'Aktifkan perintah suara',
      child: GestureDetector(
        onTap: _toggle,
        onLongPress: _openGuide,
        child: Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: _listening ? const Color(0xFFF43F5E) : _tosca,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: (_listening ? const Color(0xFFF43F5E) : _tosca).withOpacity(0.4),
                blurRadius: 14,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Icon(
            _listening ? Icons.mic_off_rounded : Icons.mic_rounded,
            color: Colors.white,
            size: 26,
          ),
        ),
      ),
    );
  }
}
