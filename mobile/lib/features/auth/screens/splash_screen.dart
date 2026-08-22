import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:go_router/go_router.dart';

import '../../../core/config/app_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  bool _isDelayDone = false;

  @override
  void initState() {
    super.initState();
    _startDelay();
  }

  Future<void> _startDelay() async {
    // Penundaan buatan 2.5 detik
    await Future.delayed(const Duration(milliseconds: 2500));
    if (mounted) {
      setState(() {
        _isDelayDone = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // 1. Tampilkan Splash UI selama masa penundaan
    if (!_isDelayDone) {
      return const _SplashUI();
    }

    // 2. Auth Gate: Cek status login setelah penundaan selesai
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        // Tahan UI agar tidak berkedip (flicker) selama memuat status
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const _SplashUI();
        }

        // Jalankan navigasi mulus (tanpa context exception) setelah frame selesai
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (snapshot.hasData && snapshot.data != null) {
            context.go(AppRoutes.home);
          } else {
            context.go(AppRoutes.login);
          }
        });

        return const _SplashUI();
      },
    );
  }
}

// Komponen UI Splash Screen Murni
class _SplashUI extends StatelessWidget {
  const _SplashUI();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/logo/LOGO DIBISALITAS LINGKARAN.png',
              width: 180,
              height: 180,
              fit: BoxFit.contain,
            ),
            const SizedBox(height: 8),
            Text(
              'Kemandirian Tanpa Batas',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Colors.black.withOpacity(0.4),
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 64),
            const SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(
                color: Color(0xFF00B894),
                strokeWidth: 2.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
