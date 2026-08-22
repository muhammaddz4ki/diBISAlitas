import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_tts/flutter_tts.dart';

import '../../../core/constants/sign_labels.dart';
import '../../../core/services/firestore_service.dart';
import 'hijaiyah_quiz_screen.dart';

const Color _tosca = Color(0xFF00B894);

/// none / weak / ok / master
int _mastery(Map<String, dynamic> letters, int id) {
  final e = letters['$id'];
  if (e is! Map) return 0;
  final seen = (e['seen'] as num?)?.toInt() ?? 0;
  if (seen == 0) return 0;
  final correct = (e['correct'] as num?)?.toInt() ?? 0;
  final acc = correct / seen;
  if (acc >= 0.8) return 3;
  if (acc >= 0.4) return 2;
  return 1;
}

Color _masteryColor(int m) {
  switch (m) {
    case 3:
      return _tosca;
    case 2:
      return const Color(0xFFF59E0B);
    case 1:
      return const Color(0xFFF43F5E);
    default:
      return const Color(0xFFE2E8F0);
  }
}

String _masteryLabel(int m) {
  switch (m) {
    case 3:
      return 'Mahir';
    case 2:
      return 'Cukup';
    case 1:
      return 'Perlu latihan';
    default:
      return 'Belum dicoba';
  }
}

class KamusScreen extends StatefulWidget {
  const KamusScreen({super.key});

  @override
  State<KamusScreen> createState() => _KamusScreenState();
}

class _KamusScreenState extends State<KamusScreen> {
  final FirestoreService _firestore = FirestoreService();
  final FlutterTts _tts = FlutterTts();

  @override
  void initState() {
    super.initState();
    _tts.setLanguage('id-ID');
    _tts.setSpeechRate(0.5);
  }

  @override
  void dispose() {
    _tts.stop();
    super.dispose();
  }

  Future<void> _speak(String text) async {
    await _tts.stop();
    await _tts.speak(text);
  }

  void _openDetail(SignLabel l, Map<String, dynamic> letters) {
    final m = _mastery(letters, l.id);
    final e = letters['${l.id}'];
    final seen = (e is Map ? (e['seen'] as num?)?.toInt() : 0) ?? 0;
    final correct = (e is Map ? (e['correct'] as num?)?.toInt() : 0) ?? 0;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.fromLTRB(24, 12, 24, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 44,
              height: 5,
              decoration: BoxDecoration(
                  color: const Color(0xFFE2E8F0),
                  borderRadius: BorderRadius.circular(3)),
            ),
            const SizedBox(height: 20),
            Text(l.arabic ?? '',
                style: const TextStyle(fontSize: 96, height: 1, color: _tosca)),
            Text(l.indo,
                style: const TextStyle(
                    fontSize: 24, fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                        color: _masteryColor(m), shape: BoxShape.circle)),
                const SizedBox(width: 6),
                Text(
                  seen > 0
                      ? '${_masteryLabel(m)} · ${(correct / seen * 100).round()}% ($correct/$seen)'
                      : _masteryLabel(m),
                  style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: _masteryColor(m)),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _speak(l.indo),
                    icon: const Icon(Icons.volume_up_rounded, color: _tosca),
                    label: const Text('Dengar',
                        style: TextStyle(
                            color: _tosca, fontWeight: FontWeight.w700)),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: BorderSide(color: _tosca.withOpacity(0.4)),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(ctx);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const HijaiyahQuizScreen()),
                      );
                    },
                    icon: const Icon(Icons.check_circle_rounded,
                        color: Colors.white),
                    label: const Text('Latih',
                        style: TextStyle(
                            color: Colors.white, fontWeight: FontWeight.w700)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _tosca,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16)),
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
    final uid = FirebaseAuth.instance.currentUser?.uid;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: _tosca, size: 20),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text('Kamus Isyarat',
            style: TextStyle(
                color: Colors.black87,
                fontWeight: FontWeight.w700,
                fontSize: 18)),
      ),
      body: StreamBuilder<DocumentSnapshot>(
        stream: uid == null ? null : _firestore.getLearningStatsStream(uid),
        builder: (context, snapshot) {
          final data = snapshot.data?.data() as Map<String, dynamic>?;
          final letters = (data?['letters'] as Map<String, dynamic>?) ?? {};

          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 0.9,
            ),
            itemCount: hijaiyahLabelsData.length,
            itemBuilder: (context, i) {
              final l = hijaiyahLabelsData[i];
              final m = _mastery(letters, l.id);
              return GestureDetector(
                onTap: () => _openDetail(l, letters),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFEFEFEF)),
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        top: 10,
                        right: 10,
                        child: Container(
                            width: 9,
                            height: 9,
                            decoration: BoxDecoration(
                                color: _masteryColor(m),
                                shape: BoxShape.circle)),
                      ),
                      Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(l.arabic ?? '',
                                style: const TextStyle(
                                    fontSize: 42,
                                    height: 1,
                                    color: Color(0xFF0B0B0F))),
                            const SizedBox(height: 4),
                            Text(l.indo,
                                style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.black54)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
