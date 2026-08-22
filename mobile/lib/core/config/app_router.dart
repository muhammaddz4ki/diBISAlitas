import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/auth/screens/splash_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/home/screens/main_wrapper_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../../features/bisafe/screens/panic_button_screen.dart';
import '../../features/bisafe/screens/emergency_active_screen.dart';
import '../../features/bisafe/screens/contacts_screen.dart';
import '../../features/bisafe/screens/history_screen.dart';
import '../../features/bijalan/screens/bijalan_screen.dart';

import '../../features/bijalan/screens/report_obstacle_screen.dart';
import '../../features/bijalan/screens/obstacle_history_screen.dart';
import '../../features/bisapa/screens/bisapa_screen.dart';
import '../../features/bipintar/screens/bipintar_screen.dart';
import '../../features/bibaca/screens/bibaca_screen.dart';
import '../../features/komunitas/screens/komunitas_screen.dart';
import '../../features/komunitas/screens/peta_komunitas_screen.dart';
import '../../features/auth/providers/auth_provider.dart';

// ═══════════════════════════════════════════
// ROUTE PATHS
// ═══════════════════════════════════════════
class AppRoutes {
  static const String splash = '/splash';
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/';
  static const String komunitas = '/komunitas';
  static const String peta = '/peta';
  static const String profil = '/profil';
  static const String panicButton = '/bisafe';
  static const String emergencyActive = '/bisafe/active';
  static const String emergencyContacts = '/bisafe/contacts';
  static const String emergencyHistory = '/bisafe/history';
  static const String navigation = '/bijalan';
  static const String reportObstacle = '/bijalan/report';
  static const String obstacleHistory = '/bijalan/history';
  static const String bisapa = '/bisapa';
  static const String bibaca = '/bibaca';
  static const String bipintar = '/bipintar';
}

final GlobalKey<NavigatorState> _rootNavigatorKey =
    GlobalKey<NavigatorState>(debugLabel: 'root');
final GlobalKey<NavigatorState> _shellNavigatorKey =
    GlobalKey<NavigatorState>(debugLabel: 'shell');

// ═══════════════════════════════════════════
// ROUTER PROVIDER
// ═══════════════════════════════════════════
final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: AppRoutes.splash,
    debugLogDiagnostics: true,
    redirect: (context, state) {
      final isLoggedIn = authState.valueOrNull != null;
      final isAuthRoute = state.matchedLocation == AppRoutes.login ||
          state.matchedLocation == AppRoutes.register;
      final isSplashRoute = state.matchedLocation == AppRoutes.splash;

      // Izinkan SplashScreen menangani masa tunggu dan stream builder-nya sendiri
      if (isSplashRoute) {
        return null; 
      }

      // Belum login → redirect ke login
      if (!isLoggedIn && !isAuthRoute) {
        return AppRoutes.login;
      }

      // Sudah login tapi masih di auth route → redirect ke home
      if (isLoggedIn && isAuthRoute) {
        return AppRoutes.home;
      }

      return null; // Tidak perlu redirect
    },
    routes: [
      // ── Auth Routes ──
      GoRoute(
        path: AppRoutes.splash,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.login,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.register,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const RegisterScreen(),
      ),

      // ── Shell Route for Bottom Navigation Bar ──
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => MainWrapperScreen(child: child),
        routes: [
          // ── Home ──
          GoRoute(
            path: AppRoutes.home,
            parentNavigatorKey: _shellNavigatorKey,
            builder: (context, state) => const HomeScreen(),
          ),
          // ── Komunitas ──
          GoRoute(
            path: AppRoutes.komunitas,
            parentNavigatorKey: _shellNavigatorKey,
            builder: (context, state) => const KomunitasScreen(),
          ),
          // ── BiSAFE Main Route ──
          GoRoute(
            path: AppRoutes.panicButton,
            parentNavigatorKey: _shellNavigatorKey,
            builder: (context, state) => const PanicButtonScreen(),
          ),
          // ── Peta Komunitas ──
          GoRoute(
            path: AppRoutes.peta,
            parentNavigatorKey: _shellNavigatorKey,
            builder: (context, state) => const PetaKomunitasScreen(),
          ),
          // ── Profile ──
          GoRoute(
            path: AppRoutes.profil,
            parentNavigatorKey: _shellNavigatorKey,
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),

      // ── BiJALAN Main Route (fullscreen, tanpa bottom nav — seperti web) ──
      GoRoute(
        path: AppRoutes.navigation,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const BiJalanScreen(),
      ),

      // ── BiSAFE Sub Routes ──
      GoRoute(
        path: AppRoutes.emergencyActive,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => EmergencyActiveScreen(
          reportId: state.uri.queryParameters['reportId'] ?? '',
        ),
      ),
      GoRoute(
        path: AppRoutes.emergencyContacts,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const ContactsScreen(),
      ),
      GoRoute(
        path: AppRoutes.emergencyHistory,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const HistoryScreen(),
      ),

      // ── BiJALAN Sub Routes ──
      GoRoute(
        path: AppRoutes.reportObstacle,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const ReportObstacleScreen(),
      ),
      GoRoute(
        path: AppRoutes.obstacleHistory,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const ObstacleHistoryScreen(),
      ),
      
      // ── Other Features Routes (No Bottom Nav, Fullscreen) ──
      GoRoute(
        path: AppRoutes.bisapa,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const BiSapaScreen(),
      ),
      GoRoute(
        path: AppRoutes.bibaca,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const BiBacaScreen(),
      ),
      GoRoute(
        path: AppRoutes.bipintar,
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const BiPintarScreen(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text(
              'Halaman tidak ditemukan',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              state.matchedLocation,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go(AppRoutes.home),
              child: const Text('Kembali ke Beranda'),
            ),
          ],
        ),
      ),
    ),
  );
});
