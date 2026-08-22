import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../../../providers/detection_provider.dart';
import '../../../core/constants/sign_labels.dart';
import '../../../core/services/firestore_service.dart';
import '../widgets/camera_view.dart';
import 'quiz_config.dart';
import 'leaderboard_screen.dart';

enum QuizPhase { idle, playing, finished }

/// Mode Quiz "Tantangan Isyarat" (Camera Challenge) — Hijaiyah.
/// Menggunakan kembali DetectionProvider (kamera + TFLite) yang sudah ada,
/// lalu membalik alurnya: target huruf → tahan isyarat benar → skor + streak.
class HijaiyahQuizScreen extends StatefulWidget {
  const HijaiyahQuizScreen({super.key});

  @override
  State<HijaiyahQuizScreen> createState() => _HijaiyahQuizScreenState();
}

class _HijaiyahQuizScreenState extends State<HijaiyahQuizScreen> {
  static const Color _green = Color(0xFF00B894);

  late final DetectionProvider _detection;
  final FirestoreService _firestore = FirestoreService();

  QuizPhase _phase = QuizPhase.idle;
  List<SignLabel> _queue = [];
  int _index = 0;
  SignLabel? _target;
  double _timeLeft = QuizConfig.timePerQuestionSec.toDouble();
  double _holdProgress = 0;
  int _score = 0;
  int _streak = 0;
  int _bestStreak = 0;
  int _correct = 0;
  String? _lastOutcome; // 'correct' | 'timeout'

  bool _locked = false;
  int _deadlineMs = 0;
  int? _holdStartMs;
  Timer? _loop;
  Timer? _transition;

  String _saveState = 'idle'; // idle | saving | saved | guest | error
  bool _isNewBest = false;

  // Hasil per-huruf untuk statistik belajar: [{'labelId': int, 'correct': bool}]
  final List<Map<String, dynamic>> _answers = [];

  int get _nowMs => DateTime.now().millisecondsSinceEpoch;

  @override
  void initState() {
    super.initState();
    _detection = DetectionProvider(ModelType.hijaiyah)..initializeAll();
  }

  @override
  void dispose() {
    _loop?.cancel();
    _transition?.cancel();
    _detection.dispose();
    super.dispose();
  }

  // ── Game flow ──────────────────────────────────────────────
  void _start() {
    _queue = buildQuestionQueue(hijaiyahLabelsData, QuizConfig.questionsPerSession);
    _score = 0;
    _streak = 0;
    _bestStreak = 0;
    _correct = 0;
    _isNewBest = false;
    _saveState = 'idle';
    _answers.clear();
    setState(() => _phase = QuizPhase.playing);
    _loadQuestion(0);
    _loop?.cancel();
    _loop = Timer.periodic(
      const Duration(milliseconds: QuizConfig.tickMs),
      (_) => _tick(),
    );
  }

  void _loadQuestion(int i) {
    if (i >= _queue.length) {
      _finish();
      return;
    }
    _holdStartMs = null;
    _locked = false;
    _deadlineMs = _nowMs + QuizConfig.timePerQuestionSec * 1000;
    _timeLeft = QuizConfig.timePerQuestionSec.toDouble();
    if (!mounted) return;
    setState(() {
      _index = i;
      _target = _queue[i];
      _lastOutcome = null;
      _holdProgress = 0;
    });
  }

  void _tick() {
    if (_phase != QuizPhase.playing || !mounted) return;
    final now = _nowMs;
    final remainMs = _deadlineMs - now;
    final remainSec = (remainMs / 1000).clamp(0, double.infinity).toDouble();
    setState(() => _timeLeft = remainSec);

    if (_locked) return;

    final res = _detection.bestResult;
    final tgt = _target;
    final isMatch = res != null &&
        tgt != null &&
        res.classId == tgt.id &&
        res.score >= QuizConfig.matchScore;

    if (isMatch) {
      _holdStartMs ??= now;
      final held = now - _holdStartMs!;
      setState(() =>
          _holdProgress = (held / QuizConfig.holdMs).clamp(0.0, 1.0).toDouble());
      if (held >= QuizConfig.holdMs) {
        _onCorrect(remainSec);
        return;
      }
    } else {
      _holdStartMs = null;
      if (_holdProgress != 0) setState(() => _holdProgress = 0);
    }

    if (remainMs <= 0) _onTimeout();
  }

  void _onCorrect(double remainSec) {
    _locked = true;
    if (_target != null) _answers.add({'labelId': _target!.id, 'correct': true});
    _streak += 1;
    _bestStreak = max(_bestStreak, _streak);
    _correct += 1;
    _score += computeQuestionScore(remainSec, _streak);
    setState(() {
      _lastOutcome = 'correct';
      _holdProgress = 1;
    });
    _goNext();
  }

  void _onTimeout() {
    _locked = true;
    if (_target != null) _answers.add({'labelId': _target!.id, 'correct': false});
    _streak = 0;
    setState(() {
      _lastOutcome = 'timeout';
      _holdProgress = 0;
    });
    _goNext();
  }

  void _goNext() {
    _transition?.cancel();
    _transition = Timer(
      const Duration(milliseconds: 900),
      () => _loadQuestion(_index + 1),
    );
  }

  Future<void> _finish() async {
    _loop?.cancel();
    if (mounted) {
      setState(() {
        _phase = QuizPhase.finished;
        _target = null;
        _holdProgress = 0;
      });
    }
    await _saveScore();
  }

  Future<void> _saveScore() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      if (mounted) setState(() => _saveState = 'guest');
      return;
    }
    if (mounted) setState(() => _saveState = 'saving');

    String name =
        user.displayName ?? (user.email?.split('@').first ?? 'Pengguna');
    try {
      final profile = await _firestore.getUserProfile(user.uid);
      final data = profile.data() as Map<String, dynamic>?;
      if (data != null) {
        name = (data['fullName'] ?? data['name'] ?? name) as String;
      }
    } catch (_) {/* pakai nama fallback */}

    // Simpan statistik belajar per-huruf (best-effort, tak memblokir UI skor)
    try {
      await _firestore.saveLearningSession(
        uid: user.uid,
        answers: List<Map<String, dynamic>>.from(_answers),
      );
    } catch (_) {/* abaikan */}

    try {
      final isNew = await _firestore.saveQuizScore(
        uid: user.uid,
        userName: name,
        score: _score,
        correctCount: _correct,
        totalQuestions: _queue.length,
        bestStreak: _bestStreak,
      );
      if (mounted) {
        setState(() {
          _isNewBest = isNew;
          _saveState = 'saved';
        });
      }
    } catch (_) {
      if (mounted) setState(() => _saveState = 'error');
    }
  }

  // ── UI ─────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Kamera (rebuild saat provider init/deteksi)
          AnimatedBuilder(
            animation: _detection,
            builder: (context, _) {
              if (_detection.error != null) {
                return _buildCameraMessage(_detection.error!, isError: true);
              }
              if (_detection.cameraController == null) {
                return _buildCameraMessage('Menyiapkan AI & kamera...');
              }
              return CameraView(controller: _detection.cameraController!);
            },
          ),

          // Tombol kembali
          Positioned(
            top: 50,
            left: 20,
            child: SafeArea(
              child: GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.9),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.arrow_back, color: Colors.black87),
                ),
              ),
            ),
          ),

          if (_phase == QuizPhase.idle) _buildIdle(),
          if (_phase == QuizPhase.playing) _buildPlaying(),
          if (_phase == QuizPhase.finished) _buildFinished(),
        ],
      ),
    );
  }

  Widget _buildCameraMessage(String msg, {bool isError = false}) {
    return Container(
      color: Colors.white,
      alignment: Alignment.center,
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (!isError)
            const CircularProgressIndicator(color: _green)
          else
            const Icon(Icons.error_outline, color: Colors.redAccent, size: 40),
          const SizedBox(height: 16),
          Text(
            msg,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.black54, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildIdle() {
    return Container(
      color: Colors.white,
      alignment: Alignment.center,
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Image.asset(
            'assets/logo/LOGO DIBISALITAS LINGKARAN.png',
            width: 120,
            height: 120,
            fit: BoxFit.contain,
          ),
          const SizedBox(height: 12),
          const Text(
            'Tantangan Isyarat',
            style: TextStyle(
              color: Color(0xFF1F2937),
              fontSize: 26,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Peragakan huruf Hijaiyah yang muncul, tahan isyaratmu sampai terkunci. '
            '${QuizConfig.questionsPerSession} soal, ${QuizConfig.timePerQuestionSec} detik per soal.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.black54, fontSize: 14, height: 1.5),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: 280,
            height: 56,
            child: ElevatedButton.icon(
              onPressed: _start,
              icon: const Icon(Icons.play_arrow_rounded, color: Colors.white),
              label: const Text(
                'Mulai Tantangan',
                style: TextStyle(
                    color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: _green,
                elevation: 0,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ),
          const SizedBox(height: 12),
          TextButton.icon(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const LeaderboardScreen()),
            ),
            icon: const Icon(Icons.emoji_events_rounded, color: Colors.amber),
            label: const Text('Papan Peringkat',
                style: TextStyle(color: _green, fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaying() {
    final timePct =
        (_timeLeft / QuizConfig.timePerQuestionSec).clamp(0.0, 1.0).toDouble();
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          children: [
            const SizedBox(height: 8),
            // Top bar
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _chip('Soal ${_index + 1}/${_queue.length}'),
                Row(
                  children: [
                    _chip('🔥 $_streak'),
                    const SizedBox(width: 8),
                    _chip('🏆 $_score'),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Timer bar
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: timePct,
                minHeight: 6,
                backgroundColor: Colors.white24,
                color: timePct < 0.25 ? Colors.redAccent : _green,
              ),
            ),
            const SizedBox(height: 4),
            Text('${_timeLeft.ceil()}s',
                style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 11,
                    fontWeight: FontWeight.bold)),

            const Spacer(),
            // Target
            const Text('PERAGAKAN HURUF INI',
                style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                    letterSpacing: 2,
                    fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 40, vertical: 24),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.95),
                borderRadius: BorderRadius.circular(32),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    _target?.arabic ?? '',
                    style: const TextStyle(
                        fontSize: 96, height: 1, color: Color(0xFF0B0B0F)),
                  ),
                  Text(
                    _target?.indo ?? '',
                    style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: Colors.black87),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: 160,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: _holdProgress,
                  minHeight: 6,
                  backgroundColor: Colors.black26,
                  color: _green,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _holdProgress > 0
                  ? 'Tahan... hampir terkunci!'
                  : 'Arahkan tangan ke kamera',
              style: const TextStyle(color: Colors.white60, fontSize: 11),
            ),
            const Spacer(),
            if (_lastOutcome != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 24),
                child: _buildOutcomeBadge(),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildOutcomeBadge() {
    final correct = _lastOutcome == 'correct';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      decoration: BoxDecoration(
        color: (correct ? _green : Colors.redAccent).withOpacity(0.9),
        borderRadius: BorderRadius.circular(30),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(correct ? Icons.check_circle : Icons.cancel, color: Colors.white),
          const SizedBox(width: 8),
          Text(correct ? 'Benar!' : 'Waktu Habis',
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }

  Widget _buildFinished() {
    return Container(
      color: const Color(0xFFEFFBF7),
      alignment: Alignment.center,
      padding: const EdgeInsets.symmetric(horizontal: 28),
      child: Container(
        padding: const EdgeInsets.all(28),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: const Color(0xFF00B894).withOpacity(0.15)),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF00B894).withOpacity(0.12),
              blurRadius: 30,
              offset: const Offset(0, 12),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: const BoxDecoration(
                  color: Color(0xFFFFF3CD), shape: BoxShape.circle),
              child: const Icon(Icons.emoji_events_rounded,
                  color: Colors.amber, size: 34),
            ),
            const SizedBox(height: 12),
            if (_isNewBest && _saveState == 'saved')
              Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF3CD),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text('REKOR BARU!',
                    style: TextStyle(
                        color: Color(0xFFB8860B),
                        fontWeight: FontWeight.w900,
                        fontSize: 11)),
              ),
            const Text('Sesi Selesai',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
            const SizedBox(height: 12),
            Text('$_score',
                style: const TextStyle(
                    fontSize: 56,
                    height: 1,
                    fontWeight: FontWeight.w900,
                    color: _green)),
            const Text('total poin',
                style: TextStyle(color: Colors.black45, fontSize: 13)),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(child: _statBox('$_correct/${_queue.length}', 'Benar')),
                const SizedBox(width: 12),
                Expanded(child: _statBox('🔥 $_bestStreak', 'Streak Terbaik')),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 18,
              child: Text(_saveMessage(),
                  style: TextStyle(fontSize: 12, color: _saveColor())),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: _start,
                icon: const Icon(Icons.refresh_rounded, color: Colors.white),
                label: const Text('Main Lagi',
                    style: TextStyle(
                        color: Colors.white, fontWeight: FontWeight.w700)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _green,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton.icon(
                onPressed: () => Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => const LeaderboardScreen()),
                ),
                icon: const Icon(Icons.emoji_events_rounded, color: Colors.amber),
                label: const Text('Lihat Papan Peringkat',
                    style: TextStyle(
                        color: Colors.black87, fontWeight: FontWeight.w700)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFFE0E0E0)),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
            const SizedBox(height: 6),
            TextButton(
              onPressed: () => setState(() => _phase = QuizPhase.idle),
              child: const Text('Kembali ke menu',
                  style: TextStyle(color: Colors.black45)),
            ),
          ],
        ),
      ),
    );
  }

  String _saveMessage() {
    switch (_saveState) {
      case 'saving':
        return 'Menyimpan skor...';
      case 'saved':
        return 'Skor tersimpan ke papan peringkat.';
      case 'guest':
        return 'Login untuk masuk papan peringkat.';
      case 'error':
        return 'Gagal menyimpan skor.';
      default:
        return '';
    }
  }

  Color _saveColor() {
    switch (_saveState) {
      case 'saved':
        return _green;
      case 'error':
        return Colors.redAccent;
      default:
        return Colors.black45;
    }
  }

  Widget _statBox(String value, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F5F7),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Text(value,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
          const SizedBox(height: 2),
          Text(label,
              style: const TextStyle(
                  fontSize: 11,
                  color: Colors.black45,
                  fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _chip(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.92),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 6),
        ],
      ),
      child: Text(text,
          style: const TextStyle(
              color: Color(0xFF1F2937),
              fontSize: 12,
              fontWeight: FontWeight.bold)),
    );
  }
}
