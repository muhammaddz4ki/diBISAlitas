import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../core/config/app_router.dart';
import '../../../core/config/constants.dart';
import '../../../core/services/auth_service.dart';
import '../../auth/providers/auth_provider.dart';
import '../widgets/notification_bell.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final userName = authState.valueOrNull?.displayName ?? 'Pengguna';

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Header ──
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Halo, $userName',
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w700,
                            color: Colors.black87,
                            letterSpacing: -0.5,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          AppConstants.appTagline,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.black54,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Notifikasi
                  const NotificationBell(),
                  const SizedBox(width: 10),
                  // Profile / Logout
                  PopupMenuButton<String>(
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF00B894).withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.person_rounded,
                        color: Color(0xFF00B894),
                      ),
                    ),
                    color: Colors.white,
                    elevation: 4,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    onSelected: (value) async {
                      if (value == 'logout') {
                        await ref.read(authServiceProvider).logout();
                      }
                    },
                    itemBuilder: (context) => [
                      PopupMenuItem(
                        value: 'profile',
                        child: Row(
                          children: [
                            const Icon(Icons.person_outline_rounded, size: 20, color: Colors.black87),
                            const SizedBox(width: 12),
                            Text(
                              authState.valueOrNull?.email ?? '',
                              style: const TextStyle(color: Colors.black87, fontSize: 14),
                            ),
                          ],
                        ),
                      ),
                      const PopupMenuDivider(),
                      const PopupMenuItem(
                        value: 'logout',
                        child: Row(
                          children: [
                            Icon(Icons.logout_rounded, size: 20, color: Colors.redAccent),
                            SizedBox(width: 12),
                            Text(
                              'Keluar',
                              style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ).animate().fadeIn(duration: 400.ms),

              const SizedBox(height: 32),

              // ── Feature Cards ──
              const Text(
                'Layanan Utama',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Colors.black87,
                ),
              ).animate().fadeIn(delay: 200.ms),
              const SizedBox(height: 16),

              // BiSAFE Card
              _FeatureCard(
                title: 'BiSAFE',
                subtitle: 'Panic Button Cerdas',
                description: 'Kirim lokasi dan foto darurat secara otomatis ke pusat kendali.',
                icon: Icons.shield_rounded,
                onTap: () => context.push(AppRoutes.panicButton),
                delay: 300,
              ),
              const SizedBox(height: 16),
              
              // BiSAPA Card
              _FeatureCard(
                title: 'BiSAPA',
                subtitle: 'Komunikasi Universal',
                description: 'Jembatan komunikasi text-to-speech dan speech-to-text.',
                icon: Icons.forum_rounded,
                onTap: () => context.push(AppRoutes.bisapa),
                delay: 400,
              ),
              const SizedBox(height: 16),

              // BiBACA Card
              _FeatureCard(
                title: 'BiBACA',
                subtitle: 'Pembaca Layar & Dokumen',
                description: 'Ekstrak teks dari dunia fisik dan dengarkan secara langsung.',
                icon: Icons.document_scanner_rounded,
                onTap: () => context.push(AppRoutes.bibaca),
                delay: 450,
              ),
              const SizedBox(height: 16),

              // BiJALAN Card
              _FeatureCard(
                title: 'BiJALAN',
                subtitle: 'Navigasi Inklusif',
                description: 'Kamera pendeteksi rintangan dan navigasi rute jalan.',
                icon: Icons.explore_rounded,
                onTap: () => context.push(AppRoutes.navigation),
                delay: 500,
              ),
              const SizedBox(height: 16),

              // BiPINTAR Card
              _FeatureCard(
                title: 'BiPINTAR',
                subtitle: 'E-Learning Inklusif',
                description: 'Modul belajar interaktif khusus untuk penyandang disabilitas.',
                icon: Icons.school_rounded,
                onTap: () => context.push(AppRoutes.bipintar),
                delay: 600,
              ),

              const SizedBox(height: 32),

              // ── Quick Actions ──
              const Text(
                'Aksi Cepat',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Colors.black87,
                ),
              ).animate().fadeIn(delay: 600.ms),
              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: _QuickAction(
                      icon: Icons.group_rounded,
                      label: 'Kontak',
                      onTap: () => context.push(AppRoutes.emergencyContacts),
                    ).animate().fadeIn(delay: 700.ms).slideY(begin: 0.2),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _QuickAction(
                      icon: Icons.history_rounded,
                      label: 'Riwayat',
                      onTap: () => context.push(AppRoutes.emergencyHistory),
                    ).animate().fadeIn(delay: 800.ms).slideY(begin: 0.2),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _QuickAction(
                      icon: Icons.report_problem_rounded,
                      label: 'Lapor',
                      onTap: () => context.push(AppRoutes.reportObstacle),
                    ).animate().fadeIn(delay: 900.ms).slideY(begin: 0.2),
                  ),
                ],
              ),

              const SizedBox(height: 32),

              // ── Info Banner ──
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F5F7), // Light gray iOS style
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.info_outline_rounded,
                        color: Color(0xFF00B894),
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Tips Keamanan',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Colors.black87,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Pastikan Anda menambahkan minimal 1 kontak darurat untuk keamanan ekstra.',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.black54,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(delay: 1000.ms),
            ],
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════
// FEATURE CARD WIDGET
// ═══════════════════════════════════════════
class _FeatureCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String description;
  final IconData icon;
  final VoidCallback onTap;
  final int delay;

  const _FeatureCard({
    required this.title,
    required this.subtitle,
    required this.description,
    required this.icon,
    required this.onTap,
    required this.delay,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: '$title. $subtitle. $description',
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF00B894).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, color: const Color(0xFF00B894), size: 32),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        color: Colors.black87,
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: Color(0xFF00B894),
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      description,
                      style: const TextStyle(
                        color: Colors.black54,
                        fontSize: 12,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.arrow_forward_ios_rounded,
                color: Colors.grey.shade300,
                size: 16,
              ),
            ],
          ),
        ),
      ),
    ).animate().fadeIn(delay: Duration(milliseconds: delay)).slideY(begin: 0.1);
  }
}

// ═══════════════════════════════════════════
// QUICK ACTION WIDGET
// ═══════════════════════════════════════════
class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: label,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 15,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          child: Column(
            children: [
              Icon(icon, color: const Color(0xFF00B894), size: 24),
              const SizedBox(height: 10),
              Text(
                label,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
