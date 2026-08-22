import 'package:cloud_firestore/cloud_firestore.dart';

class EmergencyReport {
  final String? id;
  final String userId;
  final String userName;
  final String userPhone;
  final double latitude;
  final double longitude;
  final String? address;
  final String? photoUrl;
  final String? aiDescription;
  final String triggerType; // 'button' | 'shake' | 'gesture' | 'text'
  final String status; // 'pending' | 'responding' | 'resolved' | 'cancelled'
  final String? responderNote;
  final DateTime? createdAt;
  final DateTime? resolvedAt;

  EmergencyReport({
    this.id,
    required this.userId,
    required this.userName,
    required this.userPhone,
    required this.latitude,
    required this.longitude,
    this.address,
    this.photoUrl,
    this.aiDescription,
    this.triggerType = 'button',
    this.status = 'pending',
    this.responderNote,
    this.createdAt,
    this.resolvedAt,
  });

  // ── From Firestore document ──
  factory EmergencyReport.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return EmergencyReport(
      id: doc.id,
      userId: data['userId'] ?? '',
      userName: data['userName'] ?? '',
      userPhone: data['userPhone'] ?? '',
      latitude: (data['latitude'] ?? 0).toDouble(),
      longitude: (data['longitude'] ?? 0).toDouble(),
      address: data['address'],
      photoUrl: data['photoUrl'],
      aiDescription: data['aiDescription'],
      triggerType: data['triggerType'] ?? 'button',
      status: data['status'] ?? 'pending',
      responderNote: data['responderNote'],
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
      resolvedAt: (data['resolvedAt'] as Timestamp?)?.toDate(),
    );
  }

  // ── To Firestore map ──
  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'userName': userName,
      'userPhone': userPhone,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'photoUrl': photoUrl,
      'aiDescription': aiDescription,
      'triggerType': triggerType,
      'status': status,
      'responderNote': responderNote,
      // createdAt is set server-side via FieldValue.serverTimestamp()
    };
  }

  // ── Copy with ──
  EmergencyReport copyWith({
    String? id,
    String? status,
    String? aiDescription,
    String? photoUrl,
    String? responderNote,
  }) {
    return EmergencyReport(
      id: id ?? this.id,
      userId: userId,
      userName: userName,
      userPhone: userPhone,
      latitude: latitude,
      longitude: longitude,
      address: address,
      photoUrl: photoUrl ?? this.photoUrl,
      aiDescription: aiDescription ?? this.aiDescription,
      triggerType: triggerType,
      status: status ?? this.status,
      responderNote: responderNote ?? this.responderNote,
      createdAt: createdAt,
      resolvedAt: resolvedAt,
    );
  }
}
