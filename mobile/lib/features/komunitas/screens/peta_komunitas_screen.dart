import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'dart:math' as math;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:geolocator/geolocator.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:intl/intl.dart';

const Color _tosca = Color(0xFF00B894);
const List<String> _obstacleTypes = [
  "Lubang / Trotoar Rusak",
  "Tangga",
  "Tiang / Halangan",
  "Kendaraan Parkir",
  "Genangan Air",
  "Lainnya",
];

/// Peta Aksesibilitas Komunitas (mobile) — rintangan crowdsourced + lokasi + lapor.
/// Sejajar dengan Peta Komunitas di web.
class PetaKomunitasScreen extends StatefulWidget {
  const PetaKomunitasScreen({super.key});

  @override
  State<PetaKomunitasScreen> createState() => _PetaKomunitasScreenState();
}

class _PetaKomunitasScreenState extends State<PetaKomunitasScreen> {
  final MapController _map = MapController();
  LatLng? _userPos;
  Map<String, dynamic>? _selected;
  String? _selectedId;

  @override
  void initState() {
    super.initState();
    _locate();
  }

  Future<void> _locate() async {
    try {
      LocationPermission perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.denied) {
        perm = await Geolocator.requestPermission();
      }
      if (perm == LocationPermission.denied ||
          perm == LocationPermission.deniedForever) return;
      final pos = await Geolocator.getCurrentPosition();
      if (!mounted) return;
      setState(() => _userPos = LatLng(pos.latitude, pos.longitude));
      _map.move(_userPos!, 16);
    } catch (_) {/* abaikan */}
  }

  /// Jarak dua koordinat dalam km (haversine) — sama dengan web.
  double _distanceKm(double lat1, double lon1, double lat2, double lon2) {
    const r = 6371.0;
    final dLat = (lat2 - lat1) * math.pi / 180;
    final dLon = (lon2 - lon1) * math.pi / 180;
    final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(lat1 * math.pi / 180) *
            math.cos(lat2 * math.pi / 180) *
            math.sin(dLon / 2) *
            math.sin(dLon / 2);
    return r * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
  }

  /// Warna marker berdasarkan kepadatan laporan sekitar (heatmap) — sama dengan web.
  Color _densityColor(int density) {
    if (density >= 3) return const Color(0xFFEF4444);
    if (density == 2) return const Color(0xFFFBBF24);
    return _tosca;
  }

  double _densitySize(int density) {
    if (density >= 3) return 46;
    if (density == 2) return 38;
    return 32;
  }

  String _fmtDate(dynamic ts) {
    if (ts is Timestamp) {
      return DateFormat('d MMM yyyy').format(ts.toDate());
    }
    return '-';
  }

  Future<void> _confirm(String id) async {
    try {
      await FirebaseFirestore.instance
          .collection('obstacle_reports')
          .doc(id)
          .update({'upvoteCount': FieldValue.increment(1)});
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Terima kasih! Konfirmasimu membantu komunitas.'),
          backgroundColor: _tosca,
          behavior: SnackBarBehavior.floating,
        ));
      }
    } catch (_) {}
  }

  Future<void> _openReport() async {
    String type = _obstacleTypes.first;
    final descCtrl = TextEditingController();
    bool submitting = false;

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheet) => Padding(
          padding: EdgeInsets.only(
              left: 24,
              right: 24,
              top: 20,
              bottom: MediaQuery.of(ctx).viewInsets.bottom + 24),
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
                        borderRadius: BorderRadius.circular(3))),
              ),
              const SizedBox(height: 16),
              const Text('Lapor Rintangan',
                  style:
                      TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
              const SizedBox(height: 4),
              const Text(
                  'Laporanmu tampil di peta untuk membantu pengguna lain.',
                  style: TextStyle(fontSize: 12, color: Colors.black45)),
              const SizedBox(height: 16),
              const Text('JENIS',
                  style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: Colors.black45)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _obstacleTypes.map((t) {
                  final sel = type == t;
                  return GestureDetector(
                    onTap: () => setSheet(() => type = t),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: sel ? _tosca : const Color(0xFFF5F5F7),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(t,
                          style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: sel ? Colors.white : Colors.black54)),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: descCtrl,
                maxLines: 3,
                decoration: InputDecoration(
                  hintText: 'Keterangan (opsional)...',
                  filled: true,
                  fillColor: const Color(0xFFF9FAFB),
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: submitting
                      ? null
                      : () async {
                          setSheet(() => submitting = true);
                          final ok = await _submitReport(type, descCtrl.text.trim());
                          if (ctx.mounted) Navigator.pop(ctx);
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text(ok
                                  ? 'Terima kasih! Laporanmu membantu komunitas.'
                                  : 'Gagal mengirim. Aktifkan izin lokasi.'),
                              backgroundColor: ok ? _tosca : Colors.redAccent,
                              behavior: SnackBarBehavior.floating,
                            ));
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _tosca,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16)),
                  ),
                  child: Text(
                      submitting ? 'Mengambil lokasi...' : 'Kirim ke Peta Komunitas',
                      style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                          fontSize: 15)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<bool> _submitReport(String type, String desc) async {
    try {
      LocationPermission perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.denied) {
        perm = await Geolocator.requestPermission();
      }
      if (perm == LocationPermission.denied ||
          perm == LocationPermission.deniedForever) return false;
      final pos = await Geolocator.getCurrentPosition();
      final user = FirebaseAuth.instance.currentUser;
      await FirebaseFirestore.instance.collection('obstacle_reports').add({
        'latitude': pos.latitude,
        'longitude': pos.longitude,
        'obstacleType': type,
        'description': desc,
        'reporterId': user?.uid,
        'reporterName':
            user?.displayName ?? user?.email?.split('@').first ?? 'Anonim',
        'createdAt': FieldValue.serverTimestamp(),
        'isResolved': false,
        'upvoteCount': 0,
      });
      return true;
    } catch (_) {
      return false;
    }
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
        title: const Text('Peta Komunitas',
            style: TextStyle(
                color: Colors.black87,
                fontWeight: FontWeight.w700,
                fontSize: 18)),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openReport,
        backgroundColor: _tosca,
        icon: const Icon(Icons.add_location_alt_rounded, color: Colors.white),
        label: const Text('Lapor',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800)),
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance
            .collection('obstacle_reports')
            .orderBy('createdAt', descending: true)
            .snapshots(),
        builder: (context, snapshot) {
          final docs = snapshot.data?.docs ?? [];
          final markers = <Marker>[];

          // Kumpulkan titik valid dulu untuk hitung kepadatan (heatmap) — sama dengan web.
          final points = <Map<String, dynamic>>[];
          for (final d in docs) {
            final data = d.data() as Map<String, dynamic>;
            final lat = (data['latitude'] as num?)?.toDouble();
            final lng = (data['longitude'] as num?)?.toDouble();
            if (lat == null || lng == null) continue;
            points.add({'id': d.id, 'lat': lat, 'lng': lng, 'data': data});
          }

          for (final p in points) {
            final lat = p['lat'] as double;
            final lng = p['lng'] as double;
            final data = p['data'] as Map<String, dynamic>;
            int density = 0;
            for (final o in points) {
              if (_distanceKm(lat, lng, o['lat'] as double, o['lng'] as double) <=
                  0.1) {
                density++;
              }
            }
            final color = _densityColor(density);
            final size = _densitySize(density);
            markers.add(Marker(
              point: LatLng(lat, lng),
              width: size,
              height: size,
              child: GestureDetector(
                onTap: () => setState(() {
                  _selected = data;
                  _selectedId = p['id'] as String;
                }),
                child: Container(
                  decoration: BoxDecoration(
                    color: color,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 3),
                    boxShadow: [
                      BoxShadow(
                          color: color.withOpacity(0.4), blurRadius: 8),
                    ],
                  ),
                  child: Icon(Icons.warning_rounded,
                      color: Colors.white, size: size * 0.45),
                ),
              ),
            ));
          }

          if (_userPos != null) {
            markers.add(Marker(
              point: _userPos!,
              width: 22,
              height: 22,
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF3B82F6),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 3),
                ),
              ),
            ));
          }

          return Stack(
            children: [
              FlutterMap(
                mapController: _map,
                options: MapOptions(
                  initialCenter: _userPos ?? const LatLng(-6.874, 107.619),
                  initialZoom: 14,
                  onTap: (_, __) => setState(() {
                    _selected = null;
                    _selectedId = null;
                  }),
                ),
                children: [
                  TileLayer(
                    urlTemplate:
                        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'com.dibisalitas.dibisalitas',
                  ),
                  MarkerLayer(markers: markers),
                ],
              ),

              // Badge dampak
              Positioned(
                top: 12,
                left: 12,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.95),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                          color: Colors.black.withOpacity(0.08), blurRadius: 8),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.place_rounded, color: _tosca, size: 16),
                      const SizedBox(width: 6),
                      Text('${docs.length} titik komunitas',
                          style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: Colors.black87)),
                    ],
                  ),
                ),
              ),

              // Kartu detail rintangan terpilih
              if (_selected != null)
                Positioned(
                  left: 16,
                  right: 16,
                  bottom: 90,
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black.withOpacity(0.12),
                            blurRadius: 20,
                            offset: const Offset(0, 8)),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                            (_selected!['obstacleType'] ?? 'Rintangan')
                                .toString(),
                            style: const TextStyle(
                                fontSize: 16, fontWeight: FontWeight.w900)),
                        const SizedBox(height: 4),
                        Text(
                            (_selected!['description'] ?? '').toString().isEmpty
                                ? 'Tidak ada deskripsi.'
                                : _selected!['description'].toString(),
                            style: const TextStyle(
                                fontSize: 13,
                                color: Colors.black54,
                                height: 1.4)),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            const Icon(Icons.person_rounded,
                                size: 15, color: Colors.black38),
                            const SizedBox(width: 6),
                            Text(
                                (_selected!['reporterName'] ?? 'Anonim')
                                    .toString(),
                                style: const TextStyle(
                                    fontSize: 12,
                                    color: Colors.black54,
                                    fontWeight: FontWeight.w600)),
                            const SizedBox(width: 14),
                            const Icon(Icons.calendar_today_rounded,
                                size: 13, color: Colors.black38),
                            const SizedBox(width: 6),
                            Text(_fmtDate(_selected!['createdAt']),
                                style: const TextStyle(
                                    fontSize: 12,
                                    color: Colors.black54,
                                    fontWeight: FontWeight.w600)),
                          ],
                        ),
                        if (((_selected!['upvoteCount'] as num?)?.toInt() ?? 0) >
                            0) ...[
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              const Icon(Icons.verified_rounded,
                                  size: 15, color: _tosca),
                              const SizedBox(width: 6),
                              Text(
                                  'Dikonfirmasi ${(_selected!['upvoteCount'] as num).toInt()}x oleh komunitas',
                                  style: const TextStyle(
                                      fontSize: 12,
                                      color: _tosca,
                                      fontWeight: FontWeight.w700)),
                            ],
                          ),
                        ],
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          height: 44,
                          child: ElevatedButton.icon(
                            onPressed: () {
                              final id = _selectedId;
                              if (id != null) _confirm(id);
                              setState(() {
                                _selected = null;
                                _selectedId = null;
                              });
                            },
                            icon: const Icon(Icons.thumb_up_rounded,
                                size: 18, color: _tosca),
                            label: const Text('Masih ada di sini',
                                style: TextStyle(
                                    color: _tosca,
                                    fontWeight: FontWeight.w800)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: _tosca.withOpacity(0.1),
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}
