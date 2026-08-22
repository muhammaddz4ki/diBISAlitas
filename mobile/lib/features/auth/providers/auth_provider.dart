import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/services/auth_service.dart';

// ═══════════════════════════════════════════
// AUTH STATE PROVIDER — Tracks Firebase Auth state
// ═══════════════════════════════════════════
final authStateProvider = StreamProvider<User?>((ref) {
  final authService = ref.read(authServiceProvider);
  return authService.authStateChanges;
});

// ═══════════════════════════════════════════
// USER PROFILE PROVIDER — Firestore profile data
// ═══════════════════════════════════════════
final userProfileProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  final authState = ref.watch(authStateProvider);
  final user = authState.valueOrNull;
  if (user == null) return null;

  final authService = ref.read(authServiceProvider);
  return await authService.getUserProfile(user.uid);
});

// ═══════════════════════════════════════════
// AUTH LOADING STATE
// ═══════════════════════════════════════════
final authLoadingProvider = StateProvider<bool>((ref) => false);

// ═══════════════════════════════════════════
// AUTH ERROR STATE
// ═══════════════════════════════════════════
final authErrorProvider = StateProvider<String?>((ref) => null);
