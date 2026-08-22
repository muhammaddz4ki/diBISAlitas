import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';

import '../../bipintar/quiz/leaderboard_screen.dart';

const Color _tosca = Color(0xFF00B894);

/// Komunitas & Info — daftar pengumuman + pintasan papan peringkat.
/// Sejajar dengan halaman Komunitas di web.
class KomunitasScreen extends StatelessWidget {
  const KomunitasScreen({super.key});

  Color _catColor(String? c) {
    switch (c) {
      case 'penting':
        return const Color(0xFFF59E0B);
      case 'darurat':
        return const Color(0xFFF43F5E);
      default:
        return const Color(0xFF38BDF8);
    }
  }

  String _catLabel(String? c) {
    switch (c) {
      case 'penting':
        return 'PENTING';
      case 'darurat':
        return 'DARURAT';
      default:
        return 'INFO';
    }
  }

  String _fmt(dynamic ts) {
    if (ts is Timestamp) {
      return DateFormat('d MMM yyyy, HH:mm')
          .format(ts.toDate());
    }
    return '';
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
        automaticallyImplyLeading: false,
        title: const Text('Komunitas & Info',
            style: TextStyle(
                color: Colors.black87,
                fontWeight: FontWeight.w700,
                fontSize: 18)),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
        children: [
          // Pintasan Papan Peringkat
          GestureDetector(
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (_) => const LeaderboardScreen())),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFEFEFEF)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                        color: const Color(0xFFFFF7E6),
                        borderRadius: BorderRadius.circular(14)),
                    child: const Icon(Icons.emoji_events_rounded,
                        color: Color(0xFFF59E0B)),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Papan Peringkat',
                            style: TextStyle(
                                fontWeight: FontWeight.w800, fontSize: 15)),
                        Text('Tantangan Isyarat Hijaiyah',
                            style: TextStyle(
                                fontSize: 12, color: Colors.black45)),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right_rounded,
                      color: Colors.black26),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          const Padding(
            padding: EdgeInsets.only(left: 4, bottom: 10),
            child: Text('PENGUMUMAN',
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.2,
                    color: Colors.black38)),
          ),
          StreamBuilder<QuerySnapshot>(
            stream: FirebaseFirestore.instance
                .collection('announcements')
                .orderBy('createdAt', descending: true)
                .snapshots(),
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: 24),
                  child: Center(
                      child: Text('Gagal memuat pengumuman.',
                          style: TextStyle(color: Colors.grey))),
                );
              }
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: 32),
                  child: Center(
                      child: CircularProgressIndicator(color: _tosca)),
                );
              }
              final docs = snapshot.data?.docs ?? [];
              if (docs.isEmpty) {
                return Container(
                  padding: const EdgeInsets.symmetric(vertical: 40),
                  alignment: Alignment.center,
                  child: Column(
                    children: [
                      Icon(Icons.campaign_rounded,
                          size: 44, color: Colors.grey.shade300),
                      const SizedBox(height: 10),
                      const Text('Belum ada pengumuman',
                          style: TextStyle(
                              fontWeight: FontWeight.w700,
                              color: Colors.black54)),
                    ],
                  ),
                );
              }
              return Column(
                children: docs.map((d) {
                  final data = d.data() as Map<String, dynamic>;
                  final cat = data['category'] as String?;
                  final color = _catColor(cat);
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFEFEFEF)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: color.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(_catLabel(cat),
                                  style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w800,
                                      color: color)),
                            ),
                            const Spacer(),
                            Text(_fmt(data['createdAt']),
                                style: const TextStyle(
                                    fontSize: 11, color: Colors.black38)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text((data['title'] ?? 'Pengumuman').toString(),
                            style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: Colors.black87)),
                        const SizedBox(height: 4),
                        Text((data['content'] ?? '').toString(),
                            style: const TextStyle(
                                fontSize: 13,
                                color: Colors.black54,
                                height: 1.4)),
                      ],
                    ),
                  );
                }).toList(),
              );
            },
          ),
        ],
      ),
    );
  }
}
