import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

const List<String> _kQuickPhrases = [
  'Tolong',
  'Terima kasih',
  'Saya tunarungu',
  'Di mana toilet?',
  'Bisa bantu saya?',
  'Tunggu sebentar',
  'Maaf',
  'Ya',
  'Tidak',
  'Panggil bantuan',
];

class BiSapaScreen extends StatefulWidget {
  const BiSapaScreen({super.key});

  @override
  State<BiSapaScreen> createState() => _BiSapaScreenState();
}

class _BiSapaScreenState extends State<BiSapaScreen> {
  // TTS & STT instances
  final FlutterTts _flutterTts = FlutterTts();
  final stt.SpeechToText _speechToText = stt.SpeechToText();

  // TTS State
  final TextEditingController _topController = TextEditingController();
  final TextEditingController _bottomController = TextEditingController();
  final FocusNode _topFocus = FocusNode();
  final FocusNode _bottomFocus = FocusNode();
  bool _isTopSpeaking = false;
  bool _isBottomSpeaking = false;
  bool _isTopFocused = false;
  bool _isBottomFocused = false;

  // STT State
  bool _isTopListening = false;
  bool _isBottomListening = false;
  String _topRecognized = "Menunggu suara atau pesan...";
  String _bottomRecognized = "Menunggu suara atau pesan...";

  @override
  void initState() {
    super.initState();
    _topFocus.addListener(() {
      if (mounted) setState(() => _isTopFocused = _topFocus.hasFocus);
    });
    _bottomFocus.addListener(() {
      if (mounted) setState(() => _isBottomFocused = _bottomFocus.hasFocus);
    });
    _initTts();
    _initStt();
  }

  Future<void> _initTts() async {
    await _flutterTts.setLanguage("id-ID");
    await _flutterTts.setSpeechRate(0.5);
    await _flutterTts.setVolume(1.0);
    await _flutterTts.setPitch(1.0);
    
    _flutterTts.setCompletionHandler(() {
      if (mounted) {
        setState(() {
          _isTopSpeaking = false;
          _isBottomSpeaking = false;
        });
      }
    });

    _flutterTts.setErrorHandler((msg) {
      if (mounted) {
        setState(() {
          _isTopSpeaking = false;
          _isBottomSpeaking = false;
        });
      }
    });
  }

  Future<void> _initStt() async {
    await _speechToText.initialize(
      onError: (val) => debugPrint('onError: $val'),
      onStatus: (val) {
        debugPrint('onStatus: $val');
        if (val == 'done' || val == 'notListening') {
          if (mounted) {
            setState(() {
              _isTopListening = false;
              _isBottomListening = false;
            });
          }
        }
      },
    );
  }

  Future<void> _speak(bool isTop) async {
    final text = isTop ? _topController.text : _bottomController.text;
    if (text.isNotEmpty) {
      setState(() {
        if (isTop) {
          _isTopSpeaking = true;
          // Kirim pesan ketikan POV Atas ke layar POV Bawah
          _bottomRecognized = text; 
          _topController.clear();
        } else {
          _isBottomSpeaking = true;
          // Kirim pesan ketikan POV Bawah ke layar POV Atas
          _topRecognized = text; 
          _bottomController.clear();
        }
      });
      await _flutterTts.speak(text);
    }
  }

  Future<void> _stopSpeaking() async {
    await _flutterTts.stop();
  }

  Future<void> _listen(bool isTop) async {
    // Matikan mic jika tombol yang sama ditekan ulang
    if (isTop && _isTopListening) {
      _speechToText.stop();
      setState(() => _isTopListening = false);
      return;
    }
    if (!isTop && _isBottomListening) {
      _speechToText.stop();
      setState(() => _isBottomListening = false);
      return;
    }

    // Pastikan mic sebelumnya mati sebelum memulai yang baru
    if (_isTopListening || _isBottomListening) {
      _speechToText.stop();
    }

    bool available = await _speechToText.initialize();
    if (available) {
      setState(() {
        if (isTop) {
          _isTopListening = true;
          _isBottomListening = false;
          // Jika Atas mendengarkan, teks muncul di layar Bawah
          _bottomRecognized = "Mendengarkan...";
        } else {
          _isBottomListening = true;
          _isTopListening = false;
          // Jika Bawah mendengarkan, teks muncul di layar Atas
          _topRecognized = "Mendengarkan...";
        }
      });

      _speechToText.listen(
        onResult: (val) {
          setState(() {
            if (isTop) {
              _bottomRecognized = val.recognizedWords;
            } else {
              _topRecognized = val.recognizedWords;
            }
          });
        },
        localeId: 'id_ID',
      );
    }
  }

  @override
  void dispose() {
    _flutterTts.stop();
    _speechToText.stop();
    _topController.dispose();
    _bottomController.dispose();
    _topFocus.dispose();
    _bottomFocus.dispose();
    super.dispose();
  }

  Widget _buildPovSection(bool isTop) {
    final recognizedText = isTop ? _topRecognized : _bottomRecognized;
    final isListening = isTop ? _isTopListening : _isBottomListening;
    final isSpeaking = isTop ? _isTopSpeaking : _isBottomSpeaking;
    final controller = isTop ? _topController : _bottomController;
    final focusNode = isTop ? _topFocus : _bottomFocus;
    final isFocused = isTop ? _isTopFocused : _isBottomFocused;
    
    // Logika Pintar: Jika POV Atas sedang mengetik, putar layarnya jadi normal (0 derajat)
    // sehingga ia bisa menarik HP ke arahnya dan mengetik dengan keyboard yang tidak terbalik!
    int turns = 0;
    if (isTop) {
      turns = isFocused ? 0 : 2;
    }

    // Jika salah satu sisi sedang fokus, sembunyikan sisi yang lain
    if ((isTop && _isBottomFocused) || (!isTop && _isTopFocused)) {
      return const SizedBox.shrink();
    }

    return RotatedBox(
      quarterTurns: turns,
      child: Container(
        color: isTop ? const Color(0xFFF9FAFB) : Colors.white,
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Label
            Text(
              isTop ? 'Layar Lawan Bicara' : 'Layar Anda',
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Pesan Masuk:',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF00B894),
                  ),
                ),
                if (!recognizedText.startsWith('Menunggu') && !recognizedText.startsWith('Mendengarkan') && recognizedText.isNotEmpty)
                  GestureDetector(
                    onTap: () async {
                      await _flutterTts.speak(recognizedText);
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF00B894).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.volume_up_rounded, size: 14, color: Color(0xFF00B894)),
                          SizedBox(width: 4),
                          Text(
                            'Suarakan',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF00B894),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            
            // Output Area (Teks Diterima / Live Caption)
            Expanded(
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isTop ? Colors.white : const Color(0xFFF9FAFB),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: SingleChildScrollView(
                  child: Text(
                    recognizedText,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w500,
                      color: recognizedText.startsWith('Menunggu') || recognizedText.startsWith('Mendengarkan')
                          ? Colors.grey.shade400 
                          : Colors.black87,
                      height: 1.4,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Input TextField (Ketik Pesan)
            TextField(
              controller: controller,
              focusNode: focusNode,
              minLines: 1,
              maxLines: 3,
              style: const TextStyle(
                fontSize: 16,
                color: Colors.black87,
                fontWeight: FontWeight.w500,
              ),
              decoration: InputDecoration(
                hintText: 'Ketik pesan untuk dibacakan...',
                hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                filled: true,
                fillColor: isTop ? Colors.white : const Color(0xFFF9FAFB),
                suffixIcon: isFocused
                    ? IconButton(
                        icon: const Icon(Icons.check_circle_rounded, color: Color(0xFF00B894)),
                        onPressed: () => focusNode.unfocus(),
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade200),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade200),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF00B894), width: 1.5),
                ),
              ),
            ),
            const SizedBox(height: 10),

            // Frasa cepat — ketuk untuk langsung dibacakan
            SizedBox(
              height: 38,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _kQuickPhrases.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  final p = _kQuickPhrases[i];
                  return GestureDetector(
                    onTap: () {
                      controller.text = p;
                      _speak(isTop);
                    },
                    child: Container(
                      alignment: Alignment.center,
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: const Color(0xFF00B894).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        p,
                        style: const TextStyle(
                          color: Color(0xFF00B894),
                          fontWeight: FontWeight.w600,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 12),

            // Actions Row
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _listen(isTop),
                    icon: Icon(
                      isListening ? Icons.mic_off_rounded : Icons.mic_rounded,
                      color: isListening ? Colors.redAccent : const Color(0xFF00B894),
                      size: 20,
                    ),
                    label: Text(
                      isListening ? 'Berhenti' : 'Bicara ke Teks',
                      style: TextStyle(
                        color: isListening ? Colors.redAccent : const Color(0xFF00B894),
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isListening 
                          ? Colors.redAccent.withOpacity(0.1) 
                          : const Color(0xFF00B894).withOpacity(0.1),
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: isSpeaking ? _stopSpeaking : () => _speak(isTop),
                    icon: Icon(
                      isSpeaking ? Icons.stop_rounded : Icons.volume_up_rounded,
                      color: Colors.white,
                      size: 20,
                    ),
                    label: Text(
                      isSpeaking ? 'Berhenti' : 'Bacakan Ketikan',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isSpeaking ? Colors.redAccent : const Color(0xFF00B894),
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.black87),
        title: const Text(
          'BiSAPA Face-to-Face',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w600,
            fontSize: 18,
            letterSpacing: -0.5,
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            if (!_isBottomFocused)
              Expanded(child: _buildPovSection(true)),
            if (!_isTopFocused && !_isBottomFocused)
              Container(height: 2, color: Colors.grey.shade200),
            if (!_isTopFocused)
              Expanded(child: _buildPovSection(false)),
          ],
        ),
      ),
    );
  }
}
