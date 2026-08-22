import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:flutter_animate/flutter_animate.dart';

class BiBacaScreen extends StatefulWidget {
  const BiBacaScreen({super.key});

  @override
  State<BiBacaScreen> createState() => _BiBacaScreenState();
}

class _BiBacaScreenState extends State<BiBacaScreen> {
  final ImagePicker _imagePicker = ImagePicker();
  final TextRecognizer _textRecognizer = TextRecognizer(script: TextRecognitionScript.latin);
  final FlutterTts _flutterTts = FlutterTts();

  File? _selectedImage;
  String _extractedText = '';
  bool _isProcessing = false;
  bool _isPlayingTTS = false;

  @override
  void initState() {
    super.initState();
    _initTts();
  }

  Future<void> _initTts() async {
    await _flutterTts.setLanguage("id-ID");
    await _flutterTts.setSpeechRate(0.5);
    await _flutterTts.setVolume(1.0);
    await _flutterTts.setPitch(1.0);

    _flutterTts.setCompletionHandler(() {
      if (mounted) {
        setState(() => _isPlayingTTS = false);
      }
    });

    _flutterTts.setErrorHandler((msg) {
      if (mounted) {
        setState(() => _isPlayingTTS = false);
      }
      debugPrint("TTS Error: $msg");
    });
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? pickedFile = await _imagePicker.pickImage(
        source: source,
        imageQuality: 90,
      );

      if (pickedFile != null) {
        setState(() {
          _selectedImage = File(pickedFile.path);
          _extractedText = '';
          _isProcessing = true;
          _isPlayingTTS = false;
        });
        
        await _flutterTts.stop();
        await _processImage();
      }
    } catch (e) {
      debugPrint("Error picking image: $e");
      setState(() => _isProcessing = false);
    }
  }

  Future<void> _processImage() async {
    if (_selectedImage == null) return;

    if (kIsWeb) {
      setState(() {
        _extractedText = 'Fitur BiBACA (ML Kit) belum didukung di platform Web. Silakan gunakan aplikasi Android/iOS.';
        _isProcessing = false;
      });
      return;
    }

    try {
      final inputImage = InputImage.fromFile(_selectedImage!);
      final RecognizedText recognizedText = await _textRecognizer.processImage(inputImage);

      setState(() {
        _extractedText = recognizedText.text.trim();
        _isProcessing = false;
      });

      if (_extractedText.isEmpty) {
        setState(() {
          _extractedText = 'Tidak ada teks yang terdeteksi dalam gambar ini.';
        });
      } else {
        // Otomatis suarakan teks setelah terdeteksi jika diinginkan, 
        // tapi untuk UX lebih baik menunggu user menekan tombol agar tidak kaget.
      }
    } catch (e) {
      debugPrint("Error processing image: $e");
      setState(() {
        _extractedText = 'Terjadi kesalahan saat memproses gambar.';
        _isProcessing = false;
      });
    }
  }

  Future<void> _toggleTts() async {
    if (_extractedText.isEmpty) return;

    if (_isPlayingTTS) {
      await _flutterTts.stop();
      setState(() => _isPlayingTTS = false);
    } else {
      setState(() => _isPlayingTTS = true);
      await _flutterTts.speak(_extractedText);
    }
  }

  @override
  void dispose() {
    _textRecognizer.close();
    _flutterTts.stop();
    super.dispose();
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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.black87),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'BiBACA Scanner',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w700,
            fontSize: 18,
            letterSpacing: -0.5,
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // ── Area Image Preview ──
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: AspectRatio(
                aspectRatio: 4 / 3,
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F7),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.grey.withOpacity(0.2), width: 1),
                    image: _selectedImage != null
                        ? DecorationImage(
                            image: FileImage(_selectedImage!),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: _selectedImage == null
                      ? Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.document_scanner_rounded, size: 64, color: Colors.grey.shade400),
                            const SizedBox(height: 16),
                            Text(
                              'Pilih atau foto dokumen\nuntuk mengekstrak teks',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey.shade600,
                                height: 1.4,
                              ),
                            ),
                          ],
                        )
                      : null,
                ),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1),
            ),

            // ── Tombol Kamera & Galeri ──
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Row(
                children: [
                  Expanded(
                    child: _buildActionButton(
                      icon: Icons.camera_alt_rounded,
                      label: 'Buka Kamera',
                      onTap: () => _pickImage(ImageSource.camera),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildActionButton(
                      icon: Icons.photo_library_rounded,
                      label: 'Buka Galeri',
                      onTap: () => _pickImage(ImageSource.gallery),
                    ),
                  ),
                ],
              ).animate().fadeIn(delay: 200.ms),
            ),

            const SizedBox(height: 32),

            // ── Area Hasil Teks ──
            Expanded(
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(32),
                    topRight: Radius.circular(32),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 20,
                      offset: const Offset(0, -5),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Hasil Ekstraksi Teks',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Expanded(
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF9F9FB),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: _isProcessing
                            ? const Center(
                                child: CircularProgressIndicator(color: Color(0xFF00B894)),
                              )
                            : SingleChildScrollView(
                                physics: const BouncingScrollPhysics(),
                                child: Text(
                                  _extractedText.isEmpty ? 'Belum ada hasil...' : _extractedText,
                                  style: TextStyle(
                                    fontSize: 15,
                                    height: 1.6,
                                    color: _extractedText.isEmpty ? Colors.black38 : Colors.black87,
                                  ),
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Tombol Suarakan Teks
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: (_extractedText.isEmpty || _isProcessing) ? null : _toggleTts,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF00B894),
                          disabledBackgroundColor: Colors.grey.shade200,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              _isPlayingTTS ? Icons.stop_rounded : Icons.volume_up_rounded,
                              color: (_extractedText.isEmpty || _isProcessing) ? Colors.grey.shade400 : Colors.white,
                            ),
                            const SizedBox(width: 12),
                            Text(
                              _isPlayingTTS ? 'Hentikan Suara' : 'Suarakan Teks',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: (_extractedText.isEmpty || _isProcessing) ? Colors.grey.shade400 : Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({required IconData icon, required String label, required VoidCallback onTap}) {
    return Semantics(
      button: true,
      label: label,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: const Color(0xFF00B894).withOpacity(0.08),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              Icon(icon, color: const Color(0xFF00B894), size: 28),
              const SizedBox(height: 8),
              Text(
                label,
                style: const TextStyle(
                  color: Color(0xFF00B894),
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
