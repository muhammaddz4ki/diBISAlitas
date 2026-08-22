import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../../../core/theme/app_colors.dart';
import '../providers/bisafe_provider.dart';

class EmergencyActiveScreen extends ConsumerWidget {
  final String reportId;

  const EmergencyActiveScreen({super.key, required this.reportId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        color: AppColors.emergency,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.check_circle_outline_rounded,
                  size: 80,
                  color: Colors.white,
                )
                    .animate(onPlay: (c) => c.repeat(reverse: true))
                    .scale(begin: const Offset(0.9, 0.9), end: const Offset(1.1, 1.1), duration: 1000.ms),
                const SizedBox(height: 24),
                const Text(
                  'SINYAL DARURAT TERKIRIM',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1,
                  ),
                  textAlign: TextAlign.center,
                ).animate().fadeIn(),
                const SizedBox(height: 16),
                Text(
                  'Laporan Anda telah dikirim ke pusat kendali.\nTetap tenang, bantuan akan segera datang.',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.85),
                    fontSize: 14,
                    height: 1.5,
                  ),
                  textAlign: TextAlign.center,
                ).animate().fadeIn(delay: 200.ms),
                const SizedBox(height: 32),

                // Status indicator
                StreamBuilder<DocumentSnapshot>(
                  stream: FirebaseFirestore.instance
                      .collection('emergency_reports')
                      .doc(reportId)
                      .snapshots(),
                  builder: (context, snapshot) {
                    String status = 'pending';
                    if (snapshot.hasData && snapshot.data!.exists) {
                      final data = snapshot.data!.data() as Map<String, dynamic>?;
                      if (data != null && data.containsKey('status')) {
                        status = data['status'];
                      }
                    }

                    String statusText = 'Status: Menunggu Respon';
                    Color statusBgColor = Colors.white.withOpacity(0.15);
                    Color statusTextColor = Colors.white;
                    bool showPulse = true;

                    if (status == 'resolved') {
                      statusText = 'Status: Bantuan Dikonfirmasi Admin!';
                      statusBgColor = Colors.white;
                      statusTextColor = const Color(0xFF00B894); // Hijau Tosca
                      showPulse = false;
                    } else if (status == 'cancelled') {
                      statusText = 'Status: Laporan Dibatalkan';
                      statusBgColor = Colors.white.withOpacity(0.15);
                      statusTextColor = Colors.white54;
                      showPulse = false;
                    } else if (status == 'responding') {
                      statusText = 'Status: Tim Menuju Lokasi';
                      statusBgColor = Colors.white;
                      statusTextColor = const Color(0xFF00B894);
                      showPulse = true;
                    }

                    return Container(
                      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                      decoration: BoxDecoration(
                        color: statusBgColor,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              if (showPulse)
                                Container(
                                  width: 12,
                                  height: 12,
                                  margin: const EdgeInsets.only(right: 10),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: statusTextColor,
                                  ),
                                ).animate(onPlay: (c) => c.repeat(reverse: true)).fadeIn(duration: 800.ms),
                              Text(
                                statusText,
                                style: TextStyle(
                                  color: statusTextColor,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'ID Laporan: ${reportId.length > 8 ? reportId.substring(0, 8) : reportId}...',
                            style: TextStyle(
                              color: statusBgColor == Colors.white 
                                ? Colors.black54 
                                : Colors.white.withOpacity(0.7),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.2);
                  },
                ),

                const Spacer(),

                // Cancel button
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: OutlinedButton(
                    onPressed: () async {
                      await ref.read(biSafeProvider.notifier).cancelEmergency();
                      if (context.mounted) {
                        Navigator.of(context).popUntil((route) => route.isFirst);
                      }
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white70, width: 1.5),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: const Text('Batalkan & Kembali'),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {
                      ref.read(biSafeProvider.notifier).reset();
                      Navigator.of(context).popUntil((route) => route.isFirst);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: AppColors.emergency,
                    ),
                    child: const Text('Kembali ke Beranda'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
