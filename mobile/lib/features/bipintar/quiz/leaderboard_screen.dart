import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/services/firestore_service.dart';
import 'hijaiyah_quiz_screen.dart';

/// Halaman khusus Papan Peringkat "Tantangan Isyarat" (Hijaiyah).
/// Tema putih + hijau tosca, dengan logo diBISAlitas dan podium 3 besar.
class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  static const Color _tosca = Color(0xFF00B894);
  static const String _logo = 'assets/logo/LOGO DIBISALITAS LINGKARAN.png';

  @override
  Widget build(BuildContext context) {
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
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: firestore.getLeaderboardStream(max: 50),
        builder: (context, snapshot) {
          return Column(
            children: [
              // Header dengan logo
              Column(
                children: [
                  Image.asset(_logo, width: 76, height: 76, fit: BoxFit.contain),
                  const SizedBox(height: 8),
                  const Text('Papan Peringkat',
                      style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF1F2937))),
                  const SizedBox(height: 2),
                  const Text('TANTANGAN ISYARAT HIJAIYAH',
                      style: TextStyle(
                          fontSize: 11,
                          letterSpacing: 2,
                          fontWeight: FontWeight.w800,
                          color: _tosca)),
                  const SizedBox(height: 16),
                ],
              ),
              Expanded(child: _buildBody(context, snapshot)),
            ],
          );
        },
      ),
    );
  }

  Widget _buildBody(BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
    if (snapshot.hasError) {
      return const Center(
        child: Text('Gagal memuat papan peringkat.',
            style: TextStyle(color: Colors.grey)),
      );
    }
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const Center(child: CircularProgressIndicator(color: _tosca));
    }

    final docs = snapshot.data?.docs ?? [];
    if (docs.isEmpty) {
      return _buildEmpty(context);
    }

    final entries = docs
        .map((d) => d.data() as Map<String, dynamic>)
        .toList(growable: false);
    final top3 = entries.take(3).toList();
    final rest = entries.length > 3 ? entries.sublist(3) : <Map<String, dynamic>>[];

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
      children: [
        _buildPodium(top3),
        const SizedBox(height: 20),
        ...List.generate(rest.length, (i) => _rankRow(i + 4, rest[i])),
      ],
    );
  }

  Widget _buildEmpty(BuildContext context) {
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
                color: _tosca.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.emoji_events_rounded,
                  color: _tosca, size: 38),
            ),
            const SizedBox(height: 16),
            const Text('Belum ada skor',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
            const SizedBox(height: 6),
            const Text(
              'Mainkan Tantangan Isyarat dan jadilah yang pertama!',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.black45, fontSize: 13),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => const HijaiyahQuizScreen()),
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

  Widget _buildPodium(List<Map<String, dynamic>> top3) {
    // Urutan tampil: [rank2, rank1, rank3]
    final order = [
      top3.length > 1 ? top3[1] : null,
      top3.isNotEmpty ? top3[0] : null,
      top3.length > 2 ? top3[2] : null,
    ];
    final ranks = [2, 1, 3];
    final heights = [90.0, 120.0, 72.0];

    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: List.generate(3, (i) {
        final data = order[i];
        if (data == null) return const Expanded(child: SizedBox());
        final name = (data['userName'] ?? 'Anonim').toString();
        final score = ((data['score'] as num?)?.toInt() ?? 0);
        final isFirst = ranks[i] == 1;
        return Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (isFirst)
                  const Icon(Icons.workspace_premium_rounded,
                      color: Colors.amber, size: 24),
                Container(
                  width: isFirst ? 56 : 48,
                  height: isFirst ? 56 : 48,
                  decoration: BoxDecoration(
                    color: _tosca.withOpacity(0.1),
                    shape: BoxShape.circle,
                    border: Border.all(
                        color: isFirst
                            ? Colors.amber
                            : _tosca.withOpacity(0.4),
                        width: 3),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    name.isNotEmpty ? name[0].toUpperCase() : '?',
                    style: TextStyle(
                        color: _tosca,
                        fontWeight: FontWeight.w900,
                        fontSize: isFirst ? 22 : 18),
                  ),
                ),
                const SizedBox(height: 4),
                Text(name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                        fontWeight: FontWeight.w700, fontSize: 12)),
                Text('$score',
                    style: const TextStyle(
                        color: _tosca,
                        fontWeight: FontWeight.w900,
                        fontSize: 13)),
                const SizedBox(height: 6),
                Container(
                  height: heights[i],
                  decoration: BoxDecoration(
                    color: isFirst ? const Color(0xFFF59E0B) : _tosca,
                    borderRadius:
                        const BorderRadius.vertical(top: Radius.circular(14)),
                  ),
                  alignment: Alignment.topCenter,
                  padding: const EdgeInsets.only(top: 6),
                  child: Text('${ranks[i]}',
                      style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                          fontSize: 18)),
                ),
              ],
            ),
          ),
        );
      }),
    );
  }

  Widget _rankRow(int rank, Map<String, dynamic> data) {
    final name = (data['userName'] ?? 'Anonim').toString();
    final score = ((data['score'] as num?)?.toInt() ?? 0);
    final bestStreak = ((data['bestStreak'] as num?)?.toInt() ?? 0);
    final correct = ((data['correctCount'] as num?)?.toInt() ?? 0);

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFEFEFEF)),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 24,
            child: Text('$rank',
                textAlign: TextAlign.center,
                style: const TextStyle(
                    fontWeight: FontWeight.bold, color: Colors.grey)),
          ),
          const SizedBox(width: 10),
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
                color: _tosca.withOpacity(0.1), shape: BoxShape.circle),
            alignment: Alignment.center,
            child: Text(name.isNotEmpty ? name[0].toUpperCase() : '?',
                style: const TextStyle(
                    color: _tosca, fontWeight: FontWeight.w900)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                        fontWeight: FontWeight.w700, color: Colors.black87)),
                Text('streak $bestStreak · $correct benar',
                    style:
                        const TextStyle(fontSize: 11, color: Colors.black45)),
              ],
            ),
          ),
          Text('$score',
              style: const TextStyle(
                  fontWeight: FontWeight.w900, color: _tosca, fontSize: 15)),
        ],
      ),
    );
  }
}
