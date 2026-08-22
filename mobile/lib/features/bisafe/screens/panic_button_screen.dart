import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:image_picker/image_picker.dart';
import 'package:vibration/vibration.dart';

import '../../../core/config/app_router.dart';
import '../../../core/config/constants.dart';
import '../providers/bisafe_provider.dart';
import '../services/shake_detector.dart';

class PanicButtonScreen extends ConsumerStatefulWidget {
  const PanicButtonScreen({super.key});

  @override
  ConsumerState<PanicButtonScreen> createState() => _PanicButtonScreenState();
}

class _PanicButtonScreenState extends ConsumerState<PanicButtonScreen>
    with TickerProviderStateMixin {
  late ShakeDetector _shakeDetector;
  Timer? _countdownTimer;
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();

    // Pulse animation for the panic button
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);

    // Setup shake detector
    _shakeDetector = ShakeDetector(
      shakeThreshold: AppConstants.shakeThreshold.toDouble(),
      shakeCountToTrigger: AppConstants.shakeCountToTrigger,
      onShakeTriggered: _onShakeDetected,
    );
    _shakeDetector.start();
  }

  @override
  void dispose() {
    _shakeDetector.dispose();
    _countdownTimer?.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  void _onShakeDetected() {
    HapticFeedback.heavyImpact();
    _startPanic('shake');
  }

  void _startPanic(String triggerType) {
    final state = ref.read(biSafeProvider);
    if (state.panicState != PanicState.idle) return;

    HapticFeedback.heavyImpact();
    ref.read(biSafeProvider.notifier).startCountdown();

    int remaining = AppConstants.panicCountdownSeconds;

    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      remaining--;
      ref.read(biSafeProvider.notifier).updateCountdown(remaining);

      // Vibrate each tick
      if (!kIsWeb) {
        Vibration.vibrate(duration: 200);
      }

      if (remaining <= 0) {
        timer.cancel();
        _handlePanicButton(triggerType);
      }
    });
  }

  void _cancelPanic() {
    _countdownTimer?.cancel();
    ref.read(biSafeProvider.notifier).cancelPanic();
    HapticFeedback.lightImpact();
  }

  Future<void> _handlePanicButton(String triggerType) async {
    // Try to take a photo automatically
    File? photo;
    if (!kIsWeb) {
      try {
        final picker = ImagePicker();
        final xFile = await picker.pickImage(
          source: ImageSource.camera,
          maxWidth: 1280,
          maxHeight: 720,
          imageQuality: 70,
        );
        if (xFile != null) {
          photo = File(xFile.path);
        }
      } catch (e) {
        debugPrint('Camera not available: $e');
      }
    } else {
      debugPrint('Running on Web, skipping camera hardware integration for Panic Button.');
    }

    try {
      await ref.read(biSafeProvider.notifier).sendEmergencyReport(
            triggerType: triggerType,
            photo: photo,
          );

      final state = ref.read(biSafeProvider);
      if (state.panicState == PanicState.active && mounted) {
        context.push(
          '${AppRoutes.emergencyActive}?reportId=${state.activeReportId}',
        );
      } else if (state.panicState == PanicState.error && mounted) {
        _showErrorSnackBar(state.errorMessage ?? 'Gagal mengirim laporan darurat');
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackBar('Gagal mengirim: ${e.toString()}');
        ref.read(biSafeProvider.notifier).reset();
      }
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: const TextStyle(
            color: Colors.white, 
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        backgroundColor: const Color(0xFF00B894),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        elevation: 0,
        margin: const EdgeInsets.only(bottom: 24, left: 16, right: 16),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(biSafeProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.black87, size: 22),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Command Center',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w600,
            fontSize: 18,
            letterSpacing: -0.5,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.history_rounded, color: Colors.black87),
            onPressed: () => context.push(AppRoutes.emergencyHistory),
          ),
        ],
      ),
      body: SafeArea(
        child: _buildBody(context, state),
      ),
    );
  }

  Widget _buildBody(BuildContext context, BiSafeState state) {
    switch (state.panicState) {
      case PanicState.idle:
      case PanicState.error: // Error falls back to idle in UI with snackbar
        return _buildIdleState(context);
      case PanicState.countdown:
        return _buildCountdownState(context, state);
      case PanicState.sending:
      case PanicState.active:
        return _buildSendingState(context);
    }
  }

  // ═══════════════════════════════════════════
  // IDLE STATE — Tombol Panic Besar
  // ═══════════════════════════════════════════
  Widget _buildIdleState(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const Spacer(flex: 1),

          // Shake instruction - Flat minimalist
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFFF5F5F7), // Light iOS gray
              borderRadius: BorderRadius.circular(24),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.vibration_rounded, color: Color(0xFF00B894), size: 18),
                SizedBox(width: 8),
                Text(
                  'Kocok perangkat 3x untuk memicu',
                  style: TextStyle(
                    color: Colors.black87,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn().slideY(begin: -0.1),

          const Spacer(flex: 1),

          // ── PANIC BUTTON ──
          Semantics(
            button: true,
            label: 'Tombol darurat. Tekan dan tahan untuk mengirim sinyal darurat.',
            child: GestureDetector(
              onTap: () => _startPanic('button'),
              child: AnimatedBuilder(
                animation: _pulseController,
                builder: (context, child) {
                  final scale = 1.0 + (_pulseController.value * 0.05);
                  return Transform.scale(
                    scale: scale,
                    child: Container(
                      width: 220,
                      height: 220,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0xFF00B894),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF00B894).withOpacity(0.3),
                            blurRadius: 40,
                            spreadRadius: 10,
                            offset: const Offset(0, 10),
                          ),
                          BoxShadow(
                            color: const Color(0xFF00B894).withOpacity(0.1),
                            blurRadius: 60,
                            spreadRadius: 20,
                          ),
                        ],
                      ),
                      child: const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.shield_rounded,
                            size: 56,
                            color: Colors.white,
                          ),
                          SizedBox(height: 12),
                          Text(
                            'DARURAT',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ).animate().scale(
                duration: 600.ms,
                curve: Curves.easeOutBack,
              ),

          const Spacer(flex: 1),

          // Info text
          Text(
            'Tekan tombol untuk meminta bantuan segera',
            style: TextStyle(
              color: Colors.black87.withOpacity(0.7),
              fontSize: 16,
              fontWeight: FontWeight.w500,
              letterSpacing: -0.2,
            ),
            textAlign: TextAlign.center,
          ).animate().fadeIn(delay: 400.ms),
          const SizedBox(height: 8),
          Text(
            'Lokasi presisi dan gambar akan dikirim ke pusat kendali',
            style: TextStyle(
              color: Colors.black54,
              fontSize: 14,
              fontWeight: FontWeight.w400,
            ),
            textAlign: TextAlign.center,
          ).animate().fadeIn(delay: 500.ms),

          const Spacer(flex: 1),

          // Emergency contacts button - Flat minimalist
          TextButton.icon(
            onPressed: () => context.push(AppRoutes.emergencyContacts),
            icon: const Icon(Icons.group_rounded, color: Color(0xFF00B894)),
            label: const Text(
              'Kelola Kontak Darurat',
              style: TextStyle(
                color: Color(0xFF00B894),
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              backgroundColor: const Color(0xFF00B894).withOpacity(0.08),
            ),
          ).animate().fadeIn(delay: 600.ms),

          const SizedBox(height: 16),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════
  // COUNTDOWN STATE
  // ═══════════════════════════════════════════
  Widget _buildCountdownState(BuildContext context, BiSafeState state) {
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.warning_rounded,
            size: 80,
            color: Color(0xFF00B894),
          )
              .animate(onPlay: (c) => c.repeat())
              .shake(duration: 500.ms),

          const SizedBox(height: 32),

          const Text(
            'MENGIRIM LAPORAN',
            style: TextStyle(
              color: Colors.black87,
              fontSize: 20,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.5,
            ),
          ),

          const SizedBox(height: 24),

          // Countdown number
          Text(
            '${state.countdownSeconds}',
            style: const TextStyle(
              color: Color(0xFF00B894),
              fontSize: 120,
              fontWeight: FontWeight.w800,
              height: 1.0,
            ),
          ).animate().scale(duration: 300.ms),

          const SizedBox(height: 48),

          const Text(
            'Tekan tombol di bawah untuk membatalkan pengiriman',
            style: TextStyle(
              color: Colors.black54,
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),

          const SizedBox(height: 24),

          // Cancel button - Flat minimalist
          SizedBox(
            width: double.infinity,
            height: 56,
            child: TextButton(
              onPressed: _cancelPanic,
              style: TextButton.styleFrom(
                foregroundColor: Colors.black87,
                backgroundColor: const Color(0xFFF5F5F7),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: const Text(
                'BATALKAN',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════
  // SENDING STATE
  // ═══════════════════════════════════════════
  Widget _buildSendingState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(
            color: Color(0xFF00B894),
            strokeWidth: 3,
          ),
          const SizedBox(height: 32),
          const Text(
            'Memproses Laporan',
            style: TextStyle(
              color: Colors.black87,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Mengunggah data ke Command Center...',
            style: TextStyle(
              color: Colors.black54,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
