import 'package:cloud_firestore/cloud_firestore.dart';

class ObstacleReport {
  final String? id;
  final String reporterId;
  final String reporterName;
  final double latitude;
  final double longitude;
  final String obstacleType;
  final String? description;
  final String? photoUrl;
  final String severity; // 'low' | 'medium' | 'high'
  final bool isResolved;
  final int upvoteCount;
  final DateTime? createdAt;

  ObstacleReport({
    this.id,
    required this.reporterId,
    required this.reporterName,
    required this.latitude,
    required this.longitude,
    required this.obstacleType,
    this.description,
    this.photoUrl,
    this.severity = 'medium',
    this.isResolved = false,
    this.upvoteCount = 0,
    this.createdAt,
  });

  factory ObstacleReport.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return ObstacleReport(
      id: doc.id,
      reporterId: data['reporterId'] ?? '',
      reporterName: data['reporterName'] ?? '',
      latitude: (data['latitude'] ?? 0).toDouble(),
      longitude: (data['longitude'] ?? 0).toDouble(),
      obstacleType: data['obstacleType'] ?? 'lainnya',
      description: data['description'],
      photoUrl: data['photoUrl'],
      severity: data['severity'] ?? 'medium',
      isResolved: data['isResolved'] ?? false,
      upvoteCount: data['upvoteCount'] ?? 0,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'reporterId': reporterId,
      'reporterName': reporterName,
      'latitude': latitude,
      'longitude': longitude,
      'obstacleType': obstacleType,
      'description': description,
      'photoUrl': photoUrl,
      'severity': severity,
      'isResolved': isResolved,
      'upvoteCount': upvoteCount,
    };
  }
}
