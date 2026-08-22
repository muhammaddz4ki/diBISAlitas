import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';

import '../../../core/services/auth_service.dart';
import '../../../core/services/cloudinary_service.dart';
import '../../../core/services/firestore_service.dart';
import '../../../core/services/location_service.dart';
import '../../auth/providers/auth_provider.dart';
import '../models/emergency_report.dart';

// ═══════════════════════════════════════════
// BiSAFE STATE
// ═══════════════════════════════════════════
enum PanicState {
  idle, // Tombol siap
  countdown, // Countdown berjalan (bisa batal)
  sending, // Sedang kirim laporan
  active, // Darurat aktif, menunggu respon
  error, // Gagal
}

class BiSafeState {
  final PanicState panicState;
  final int countdownSeconds;
  final String? errorMessage;
  final String? activeReportId;
  final Position? currentPosition;

  const BiSafeState({
    this.panicState = PanicState.idle,
    this.countdownSeconds = 5,
    this.errorMessage,
    this.activeReportId,
    this.currentPosition,
  });

  BiSafeState copyWith({
    PanicState? panicState,
    int? countdownSeconds,
    String? errorMessage,
    String? activeReportId,
    Position? currentPosition,
  }) {
    return BiSafeState(
      panicState: panicState ?? this.panicState,
      countdownSeconds: countdownSeconds ?? this.countdownSeconds,
      errorMessage: errorMessage,
      activeReportId: activeReportId ?? this.activeReportId,
      currentPosition: currentPosition ?? this.currentPosition,
    );
  }
}

// ═══════════════════════════════════════════
// BiSAFE PROVIDER (Notifier)
// ═══════════════════════════════════════════
class BiSafeNotifier extends StateNotifier<BiSafeState> {
  final FirestoreService _firestoreService;
  final CloudinaryService _cloudinaryService;
  final LocationService _locationService;
  final AuthService _authService;

  BiSafeNotifier({
    required FirestoreService firestoreService,
    required CloudinaryService cloudinaryService,
    required LocationService locationService,
    required AuthService authService,
  })  : _firestoreService = firestoreService,
        _cloudinaryService = cloudinaryService,
        _locationService = locationService,
        _authService = authService,
        super(const BiSafeState());

  /// Start the panic countdown
  void startCountdown() {
    state = state.copyWith(
      panicState: PanicState.countdown,
      countdownSeconds: 5,
    );
  }

  /// Update countdown tick
  void updateCountdown(int seconds) {
    state = state.copyWith(countdownSeconds: seconds);
  }

  /// Cancel the panic
  void cancelPanic() {
    state = const BiSafeState();
  }

  /// Send the emergency report
  Future<void> sendEmergencyReport({
    required String triggerType,
    File? photo,
  }) async {
    state = state.copyWith(panicState: PanicState.sending);

    try {
      // 1. Get current location
      final position = await _locationService.getCurrentPosition();
      if (position == null) {
        state = state.copyWith(
          panicState: PanicState.error,
          errorMessage: 'Tidak bisa mendapatkan lokasi GPS',
        );
        return;
      }

      state = state.copyWith(currentPosition: position);

      // 2. Upload photo to Cloudinary (if available)
      String? photoUrl;
      if (photo != null) {
        photoUrl = await _cloudinaryService.uploadEmergencyPhoto(photo);
      }

      // 3. Get user data
      final user = _authService.currentUser;
      if (user == null) {
        state = state.copyWith(
          panicState: PanicState.error,
          errorMessage: 'Anda harus login terlebih dahulu',
        );
        return;
      }

      final profile = await _authService.getUserProfile(user.uid);

      // 4. Create emergency report in Firestore
      final report = EmergencyReport(
        userId: user.uid,
        userName: profile?['fullName'] ?? user.displayName ?? 'Unknown',
        userPhone: profile?['phone'] ?? '',
        latitude: position.latitude,
        longitude: position.longitude,
        photoUrl: photoUrl,
        triggerType: triggerType,
        status: 'pending',
      );

      final reportId = await _firestoreService.createEmergencyReport(
        report.toFirestore(),
      );

      state = state.copyWith(
        panicState: PanicState.active,
        activeReportId: reportId,
      );
    } catch (e) {
      state = state.copyWith(
        panicState: PanicState.error,
        errorMessage: 'Gagal mengirim laporan: $e',
      );
    }
  }

  /// Cancel active emergency
  Future<void> cancelEmergency() async {
    if (state.activeReportId != null) {
      await _firestoreService.updateEmergencyReport(
        state.activeReportId!,
        {'status': 'cancelled'},
      );
    }
    state = const BiSafeState();
  }

  /// Reset state
  void reset() {
    state = const BiSafeState();
  }
}

// ═══════════════════════════════════════════
// PROVIDERS
// ═══════════════════════════════════════════
final biSafeProvider = StateNotifierProvider<BiSafeNotifier, BiSafeState>((ref) {
  return BiSafeNotifier(
    firestoreService: ref.read(firestoreServiceProvider),
    cloudinaryService: ref.read(cloudinaryServiceProvider),
    locationService: ref.read(locationServiceProvider),
    authService: ref.read(authServiceProvider),
  );
});

// ── User's emergency reports stream ──
final userEmergencyReportsProvider = StreamProvider<QuerySnapshot>((ref) {
  final authState = ref.watch(authStateProvider);
  final user = authState.valueOrNull;
  if (user == null) return const Stream.empty();

  return ref.read(firestoreServiceProvider).getUserEmergencyReports(user.uid);
});

// ── Emergency contacts stream ──
final emergencyContactsProvider = StreamProvider<QuerySnapshot>((ref) {
  final authState = ref.watch(authStateProvider);
  final user = authState.valueOrNull;
  if (user == null) return const Stream.empty();

  return ref.read(firestoreServiceProvider).getUserEmergencyContacts(user.uid);
});
