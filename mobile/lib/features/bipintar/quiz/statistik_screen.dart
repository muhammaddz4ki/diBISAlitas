import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../../../core/constants/sign_labels.dart';
import '../../../core/services/firestore_service.dart';
import 'hijaiyah_quiz_screen.dart';

const Color _tosca = Color(0xFF00B894);

/// akurasi huruf: -1 = belum dicoba
double _acc(Map<String, dynamic> letters, int id) {
  final e = letters['$id'];
  if (e is! Map) return -1;
  final seen = (e['seen'] as num?)?.toInt() ?? 0;
  if (seen == 0) return -1;
  final correct = (e['correct'] as num?)?.toInt() ?? 0;
  return correct / seen;
}

class StatistikScreen extends StatelessWidget {
  const StatistikScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final uid = FirebaseAuth.instance.currentUser?.uid;
    final firestore = FirestoreService();

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
        title: const Text('Statistik Belajar',
            style: TextStyle(
                color: Colors.black87,
                fontWeight: FontWeight.w700,
                fontSize: 18)),
      ),
      body: uid == null
          ? _empty(context, 'Login untuk melacak kemajuan belajarmu.')
          : StreamBuilder<DocumentSnapshot>(
              stream: firestore.getLearningStatsStream(uid),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(
                      child: CircularProgressIndicator(color: _tosca));
                }
                final data = snapshot.data?.data() as Map<String, dynamic>?;
                final totalAnswered =
                    (data?['totalAnswered'] as num?)?.toInt() ?? 0;
                if (data == null || totalAnswered == 0) {
                  return _empty(context,
                      'Belum ada data. Mainkan Tantangan Isyarat untuk mulai melacak kemajuanmu.');
                }

                final gamesPlayed =
                    (data['gamesPlayed'] as num?)?.toInt() ?? 0;
                final totalCorrect =
                    (data['totalCorrect'] as num?)?.toInt() ?? 0;
                final letters =
                    (data['letters'] as Map<String, dynamic>?) ?? {};
                final overallAcc =
                    totalAnswered > 0 ? totalCorrect / totalAnswered : 0.0;
                final mastered = hijaiyahLabelsData
                    .where((l) => _acc(letters, l.id) >= 0.8)
                    .length;

                final weak = hijaiyahLabelsData
                    .map((l) => MapEntry(l, _acc(letters, l.id)))
                    .where((e) => e.value >= 0 && e.value < 0.5)
                    .toList()
                  ..sort((a, b) => a.value.compareTo(b.value));
                final weakTop = weak.take(6).toList();

                return ListView(
                  padding: const EdgeInsets.all(20),
                  children: [
                    Row(
                      children: [
                        _statCard(Icons.videogame_asset_rounded,
                            '$gamesPlayed', 'Sesi'),
                        const SizedBox(width: 12),
                        _statCard(Icons.my_location_rounded,
                            '${(overallAcc * 100).round()}%', 'Akurasi'),
                        const SizedBox(width: 12),
                        _statCard(Icons.emoji_events_rounded,
                            '$mastered/29', 'Dikuasai'),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Row(
                      children: const [
                        Icon(Icons.fitness_center_rounded,
                            color: Color(0xFFF43F5E), size: 20),
                        SizedBox(width: 8),
                        Text('Perlu dilatih',
                            style: TextStyle(
                                fontWeight: FontWeight.w800, fontSize: 15)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    if (weakTop.isEmpty)
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: _tosca.withOpacity(0.06),
                          borderRadius: BorderRadius.circular(16),
                          border:
                              Border.all(color: _tosca.withOpacity(0.15)),
                        ),
                        child: const Text(
                          'Mantap! Tidak ada huruf lemah saat ini.',
                          style: TextStyle(
                              color: _tosca, fontWeight: FontWeight.w600),
                        ),
                      )
                    else
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: weakTop.map((e) {
                          return GestureDetector(
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => const HijaiyahQuizScreen()),
                            ),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 8),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFF1F2),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                    color: const Color(0xFFFECDD3)),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(e.key.arabic ?? '',
                                      style: const TextStyle(
                                          fontSize: 22,
                                          height: 1,
                                          color: Color(0xFFF43F5E))),
                                  const SizedBox(width: 6),
                                  Text(
                                      '${e.key.indo} · ${(e.value * 100).round()}%',
                                      style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: Color(0xFFE11D48))),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    const SizedBox(height: 24),
                    const Text('Penguasaan per huruf',
                        style: TextStyle(
                            fontWeight: FontWeight.w800, fontSize: 15)),
                    const SizedBox(height: 12),
                    ...hijaiyahLabelsData.map((l) {
                      final acc = _acc(letters, l.id);
                      final pct = acc < 0 ? 0.0 : acc;
                      final barColor = acc < 0
                          ? const Color(0xFFE2E8F0)
                          : acc >= 0.8
                              ? _tosca
                              : acc >= 0.4
                                  ? const Color(0xFFF59E0B)
                                  : const Color(0xFFF43F5E);
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          children: [
                            SizedBox(
                                width: 30,
                                child: Text(l.arabic ?? '',
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(
                                        fontSize: 22,
                                        height: 1,
                                        color: Colors.black87))),
                            const SizedBox(width: 8),
                            SizedBox(
                                width: 64,
                                child: Text(l.indo,
                                    style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w700,
                                        color: Colors.black54))),
                            Expanded(
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: pct,
                                  minHeight: 7,
                                  backgroundColor: const Color(0xFFF1F5F9),
                                  color: barColor,
                                ),
                              ),
                            ),
                            SizedBox(
                              width: 40,
                              child: Text(
                                acc < 0 ? '—' : '${(acc * 100).round()}%',
                                textAlign: TextAlign.right,
                                style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.black38),
                              ),
                            ),
                          ],
                        ),
                      );
                    }),
                  ],
                );
              },
            ),
    );
  }

  Widget _statCard(IconData icon, String value, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFEFEFEF)),
        ),
        child: Column(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                  color: _tosca.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: _tosca, size: 20),
            ),
            const SizedBox(height: 6),
            Text(value,
                style: const TextStyle(
                    fontSize: 18, fontWeight: FontWeight.w900)),
            Text(label,
                style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: Colors.black45)),
          ],
        ),
      ),
    );
  }

  Widget _empty(BuildContext context, String text) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                  color: _tosca.withOpacity(0.1), shape: BoxShape.circle),
              child: const Icon(Icons.bar_chart_rounded,
                  color: _tosca, size: 38),
            ),
            const SizedBox(height: 16),
            Text(text,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.black45, fontSize: 13)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (_) => const HijaiyahQuizScreen()),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: _tosca,
                elevation: 0,
                padding:
                    const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text('Main Sekarang',
                  style: TextStyle(
                      color: Colors.white, fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }
}
