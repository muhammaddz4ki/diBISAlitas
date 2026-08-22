import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';

const Color _tosca = Color(0xFF00B894);

/// Lonceng notifikasi in-app: menampilkan pengumuman terbaru (koleksi `announcements`)
/// dengan badge "belum dibaca" berbasis waktu terakhir dibuka (SharedPreferences).
class NotificationBell extends StatefulWidget {
  const NotificationBell({super.key});

  @override
  State<NotificationBell> createState() => _NotificationBellState();
}

class _NotificationBellState extends State<NotificationBell> {
  static const String _prefsKey = 'dibisalitas_notif_last_seen';
  int _lastSeen = 0;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final p = await SharedPreferences.getInstance();
    if (mounted) setState(() => _lastSeen = p.getInt(_prefsKey) ?? 0);
  }

  int _toMillis(dynamic ts) =>
      ts is Timestamp ? ts.millisecondsSinceEpoch : 0;

  Color _categoryColor(String? c) {
    switch (c) {
      case 'penting':
        return const Color(0xFFF59E0B);
      case 'darurat':
        return const Color(0xFFF43F5E);
      default:
        return const Color(0xFF38BDF8);
    }
  }

  String _formatTime(dynamic ts) {
    final ms = _toMillis(ts);
    if (ms == 0) return '';
    return DateFormat('d MMM, HH:mm')
        .format(DateTime.fromMillisecondsSinceEpoch(ms));
  }

  Future<void> _open(List<QueryDocumentSnapshot> docs) async {
    // Tandai sudah dibaca
    final now = DateTime.now().millisecondsSinceEpoch;
    final p = await SharedPreferences.getInstance();
    await p.setInt(_prefsKey, now);
    if (mounted) setState(() => _lastSeen = now);
    if (!mounted) return;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.6,
        maxChildSize: 0.9,
        minChildSize: 0.3,
        builder: (ctx, controller) => Column(
          children: [
            const SizedBox(height: 12),
            Container(
              width: 44,
              height: 5,
              decoration: BoxDecoration(
                  color: const Color(0xFFE2E8F0),
                  borderRadius: BorderRadius.circular(3)),
            ),
            const Padding(
              padding: EdgeInsets.fromLTRB(24, 16, 24, 8),
              child: Row(
                children: [
                  Icon(Icons.notifications_rounded, color: _tosca, size: 22),
                  SizedBox(width: 8),
                  Text('Notifikasi',
                      style: TextStyle(
                          fontSize: 18, fontWeight: FontWeight.w800)),
                ],
              ),
            ),
            Expanded(
              child: docs.isEmpty
                  ? const Center(
                      child: Text('Belum ada notifikasi',
                          style: TextStyle(
                              color: Colors.black45,
                              fontWeight: FontWeight.w600)),
                    )
                  : ListView.separated(
                      controller: controller,
                      padding: const EdgeInsets.fromLTRB(20, 4, 20, 28),
                      itemCount: docs.length,
                      separatorBuilder: (_, __) =>
                          const Divider(height: 1, color: Color(0xFFF1F5F9)),
                      itemBuilder: (ctx, i) {
                        final d = docs[i].data() as Map<String, dynamic>;
                        final cat = d['category'] as String?;
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                margin: const EdgeInsets.only(top: 6),
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                    color: _categoryColor(cat),
                                    shape: BoxShape.circle),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      (d['title'] ?? 'Pengumuman').toString(),
                                      style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w800,
                                          color: Colors.black87),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      (d['content'] ?? '').toString(),
                                      style: const TextStyle(
                                          fontSize: 13,
                                          color: Colors.black54,
                                          height: 1.4),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      _formatTime(d['createdAt']),
                                      style: const TextStyle(
                                          fontSize: 11,
                                          color: Colors.black38,
                                          fontWeight: FontWeight.w600),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance
          .collection('announcements')
          .orderBy('createdAt', descending: true)
          .limit(10)
          .snapshots(),
      builder: (context, snapshot) {
        final docs = snapshot.data?.docs ?? [];
        final unread = docs
            .where((d) => _toMillis(
                    (d.data() as Map<String, dynamic>)['createdAt']) >
                _lastSeen)
            .length;

        return GestureDetector(
          onTap: () => _open(docs),
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: _tosca.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.notifications_none_rounded,
                    color: _tosca),
              ),
              if (unread > 0)
                Positioned(
                  top: -2,
                  right: -2,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 5),
                    constraints:
                        const BoxConstraints(minWidth: 18, minHeight: 18),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF43F5E),
                      borderRadius: BorderRadius.circular(9),
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      unread > 9 ? '9+' : '$unread',
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w800),
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}
