import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';

// ═══════════════════════════════════════════
// AUTH SERVICE — Wrapper around Firebase Auth
// ═══════════════════════════════════════════
class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Current user
  User? get currentUser => _auth.currentUser;

  // Auth state stream
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  // ── Register ──
  Future<User?> register({
    required String email,
    required String password,
    required String fullName,
    required String phone,
  }) async {
    try {
      final credential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (credential.user != null) {
        // Create user profile in Firestore
        await _firestore.collection('users').doc(credential.user!.uid).set({
          'fullName': fullName,
          'name': fullName,
          'email': email,
          'phone': phone,
          'disabilityType': 'Belum Diatur',
          'avatarUrl': null,
          'role': 'user',
          'isAdmin': false,
          'isVerified': false,
          'fcmToken': null,
          'createdAt': FieldValue.serverTimestamp(),
          'updatedAt': FieldValue.serverTimestamp(),
        });

        await credential.user!.updateDisplayName(fullName);
      }

      return credential.user;
    } on FirebaseAuthException catch (e) {
      throw _mapAuthException(e);
    }
  }

  // ── Login ──
  Future<User?> login({
    required String email,
    required String password,
  }) async {
    try {
      final credential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return credential.user;
    } on FirebaseAuthException catch (e) {
      throw _mapAuthException(e);
    }
  }

  // ── Logout ──
  Future<void> logout() async {
    await _auth.signOut();
    await GoogleSignIn().signOut(); // Also sign out from Google
  }

  // ── Google Sign In ──
  Future<User?> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) {
        return null; // Batal login
      }

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

      final OAuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final UserCredential userCredential = await _auth.signInWithCredential(credential);
      final User? user = userCredential.user;

      if (user != null) {
        // Check if user exists
        final doc = await _firestore.collection('users').doc(user.uid).get();
        if (!doc.exists) {
          // Register new user automatically
          await _firestore.collection('users').doc(user.uid).set({
            'fullName': user.displayName ?? 'Pengguna',
            'email': user.email ?? '',
            'phone': user.phoneNumber ?? '',
            'disabilityType': 'Lainnya', // Default
            'avatarUrl': user.photoURL,
            'isAdmin': false,
            'isVerified': true,
            'fcmToken': null,
            'createdAt': FieldValue.serverTimestamp(),
            'updatedAt': FieldValue.serverTimestamp(),
          });
        }
      }

      return user;
    } on FirebaseAuthException catch (e) {
      throw _mapAuthException(e);
    } catch (e) {
      throw 'Terjadi kesalahan saat login Google: $e';
    }
  }
  // ── Get user profile from Firestore ──
  Future<Map<String, dynamic>?> getUserProfile(String uid) async {
    final doc = await _firestore.collection('users').doc(uid).get();
    return doc.data();
  }

  // ── Update user profile ──
  Future<void> updateProfile({
    required String uid,
    Map<String, dynamic>? data,
  }) async {
    if (data != null) {
      data['updatedAt'] = FieldValue.serverTimestamp();
      await _firestore.collection('users').doc(uid).update(data);
    }
  }

  // ── Update FCM Token ──
  Future<void> updateFcmToken(String uid, String token) async {
    await _firestore.collection('users').doc(uid).update({
      'fcmToken': token,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // ── Map Firebase Auth errors to Indonesian messages ──
  String _mapAuthException(FirebaseAuthException e) {
    switch (e.code) {
      case 'email-already-in-use':
        return 'Email sudah terdaftar. Silakan login.';
      case 'weak-password':
        return 'Password terlalu lemah. Minimal 6 karakter.';
      case 'invalid-email':
        return 'Format email tidak valid.';
      case 'user-not-found':
        return 'Akun tidak ditemukan. Silakan daftar.';
      case 'wrong-password':
        return 'Password salah. Coba lagi.';
      case 'too-many-requests':
        return 'Terlalu banyak percobaan. Coba lagi nanti.';
      case 'user-disabled':
        return 'Akun Anda dinonaktifkan. Hubungi admin.';
      default:
        return 'Terjadi kesalahan: ${e.message}';
    }
  }
}

// ═══════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════
final authServiceProvider = Provider<AuthService>((ref) => AuthService());
