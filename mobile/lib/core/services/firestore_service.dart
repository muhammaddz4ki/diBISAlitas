import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// ═══════════════════════════════════════════
// FIRESTORE SERVICE — Central database operations
// ═══════════════════════════════════════════
class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // ── EMERGENCY REPORTS (BiSAFE) ──

  /// Create a new emergency report
  Future<String> createEmergencyReport(Map<String, dynamic> data) async {
    data['createdAt'] = FieldValue.serverTimestamp();
    data['status'] = 'pending';
    final doc = await _db.collection('emergency_reports').add(data);
    return doc.id;
  }

  /// Get all emergency reports (admin)
  Stream<QuerySnapshot> getEmergencyReportsStream() {
    return _db
        .collection('emergency_reports')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Get user's own emergency reports
  Stream<QuerySnapshot> getUserEmergencyReports(String userId) {
    return _db
        .collection('emergency_reports')
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Update emergency report (e.g., add AI description, change status)
  Future<void> updateEmergencyReport(
    String reportId,
    Map<String, dynamic> data,
  ) async {
    await _db.collection('emergency_reports').doc(reportId).update(data);
  }

  /// Delete emergency report (user only)
  Future<void> deleteEmergencyReport(String reportId) async {
    await _db.collection('emergency_reports').doc(reportId).delete();
  }

  // ── EMERGENCY CONTACTS ──

  /// Create emergency contact
  Future<String> createEmergencyContact(Map<String, dynamic> data) async {
    data['createdAt'] = FieldValue.serverTimestamp();
    final doc = await _db.collection('emergency_contacts').add(data);
    return doc.id;
  }

  /// Get user's emergency contacts
  Stream<QuerySnapshot> getUserEmergencyContacts(String userId) {
    return _db
        .collection('emergency_contacts')
        .where('userId', isEqualTo: userId)
        .snapshots();
  }

  /// Delete emergency contact
  Future<void> deleteEmergencyContact(String contactId) async {
    await _db.collection('emergency_contacts').doc(contactId).delete();
  }

  /// Update emergency contact
  Future<void> updateEmergencyContact(
    String contactId,
    Map<String, dynamic> data,
  ) async {
    await _db.collection('emergency_contacts').doc(contactId).update(data);
  }

  // ── OBSTACLE REPORTS (BiJALAN) ──

  /// Create obstacle report
  Future<String> createObstacleReport(Map<String, dynamic> data) async {
    data['createdAt'] = FieldValue.serverTimestamp();
    data['isResolved'] = false;
    data['upvoteCount'] = 0;
    final doc = await _db.collection('obstacle_reports').add(data);
    return doc.id;
  }

  /// Get all active obstacle reports (for map display)
  Stream<QuerySnapshot> getActiveObstaclesStream() {
    return _db
        .collection('obstacle_reports')
        .where('isResolved', isEqualTo: false)
        .snapshots();
  }

  /// Get user's own obstacle reports (for history)
  Stream<QuerySnapshot> getUserObstacleReports(String userId) {
    return _db
        .collection('obstacle_reports')
        .where('reporterId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  /// Delete obstacle report (user only)
  Future<void> deleteObstacleReport(String reportId) async {
    await _db.collection('obstacle_reports').doc(reportId).delete();
  }

  /// Get obstacles near a location (within bounds)
  Future<List<QueryDocumentSnapshot>> getObstaclesNearby({
    required double lat,
    required double lng,
    double radiusDegrees = 0.01, // ~1.1km
  }) async {
    // Simple bounding box query (Firestore doesn't support geo queries natively)
    final snapshot = await _db
        .collection('obstacle_reports')
        .where('isResolved', isEqualTo: false)
        .where('latitude', isGreaterThan: lat - radiusDegrees)
        .where('latitude', isLessThan: lat + radiusDegrees)
        .get();

    // Filter by longitude in-memory
    return snapshot.docs.where((doc) {
      final data = doc.data();
      final docLng = data['longitude'] as double;
      return docLng >= lng - radiusDegrees && docLng <= lng + radiusDegrees;
    }).toList();
  }

  /// Upvote obstacle (confirm it exists)
  Future<void> upvoteObstacle(String obstacleId) async {
    await _db.collection('obstacle_reports').doc(obstacleId).update({
      'upvoteCount': FieldValue.increment(1),
    });
  }

  /// Mark obstacle as resolved
  Future<void> resolveObstacle(String obstacleId) async {
    await _db.collection('obstacle_reports').doc(obstacleId).update({
      'isResolved': true,
    });
  }

  // ── ACCESSIBLE ROUTES ──

  /// Get accessible routes
  Stream<QuerySnapshot> getAccessibleRoutes() {
    return _db.collection('accessible_routes').snapshots();
  }

  // ── USER PROFILES ──

  /// Get user profile
  Future<DocumentSnapshot> getUserProfile(String userId) {
    return _db.collection('users').doc(userId).get();
  }

  /// Stream user profile
  Stream<DocumentSnapshot> getUserProfileStream(String userId) {
    return _db.collection('users').doc(userId).snapshots();
  }

  // ── QUIZ SCORES (BiPINTAR — Tantangan Isyarat / leaderboard) ──

  static const String quizIdHijaiyah = 'hijaiyah';

  /// Simpan skor sebagai "personal best" (1 dokumen per user per kuis).
  /// Hanya menimpa bila skor baru lebih tinggi. Mengembalikan true bila rekor baru.
  Future<bool> saveQuizScore({
    required String uid,
    required String userName,
    required int score,
    required int correctCount,
    required int totalQuestions,
    required int bestStreak,
    String quizId = quizIdHijaiyah,
  }) async {
    final docId = '${uid}_$quizId';
    final ref = _db.collection('quiz_scores').doc(docId);
    final snap = await ref.get();
    final prevBest =
        snap.exists ? ((snap.data()?['score'] as num?)?.toInt() ?? -1) : -1;

    if (score > prevBest) {
      await ref.set({
        'userId': uid,
        'userName': userName,
        'quizId': quizId,
        'score': score,
        'correctCount': correctCount,
        'totalQuestions': totalQuestions,
        'bestStreak': bestStreak,
        'updatedAt': FieldValue.serverTimestamp(),
      });
      return true;
    }
    return false;
  }

  /// Stream papan peringkat (skor tertinggi lebih dulu).
  Stream<QuerySnapshot> getLeaderboardStream({int max = 20}) {
    return _db
        .collection('quiz_scores')
        .orderBy('score', descending: true)
        .limit(max)
        .snapshots();
  }

  // ── LEARNING STATS (BiPINTAR — statistik belajar per user) ──

  /// Simpan hasil satu sesi quiz ke statistik belajar (increment akumulatif).
  /// `answers`: daftar {'labelId': int, 'correct': bool}.
  Future<void> saveLearningSession({
    required String uid,
    required List<Map<String, dynamic>> answers,
  }) async {
    if (answers.isEmpty) return;

    final seen = <int, int>{};
    final correct = <int, int>{};
    int totalCorrect = 0;
    for (final a in answers) {
      final id = a['labelId'] as int;
      seen[id] = (seen[id] ?? 0) + 1;
      if (a['correct'] == true) {
        correct[id] = (correct[id] ?? 0) + 1;
        totalCorrect++;
      }
    }

    final letters = <String, dynamic>{};
    seen.forEach((id, s) {
      letters['$id'] = {
        'seen': FieldValue.increment(s),
        'correct': FieldValue.increment(correct[id] ?? 0),
      };
    });

    await _db.collection('learning_stats').doc(uid).set({
      'userId': uid,
      'gamesPlayed': FieldValue.increment(1),
      'totalAnswered': FieldValue.increment(answers.length),
      'totalCorrect': FieldValue.increment(totalCorrect),
      'letters': letters,
      'updatedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  /// Stream statistik belajar milik user.
  Stream<DocumentSnapshot> getLearningStatsStream(String uid) {
    return _db.collection('learning_stats').doc(uid).snapshots();
  }
}

// ═══════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════
final firestoreServiceProvider = Provider<FirestoreService>(
  (ref) => FirestoreService(),
);
