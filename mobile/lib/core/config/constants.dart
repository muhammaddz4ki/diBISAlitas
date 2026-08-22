// App-wide constants and configuration
import 'package:flutter/material.dart';

class AppConstants {
  AppConstants._();

  // ═══════════════════════════════════════════
  // APP INFO
  // ═══════════════════════════════════════════
  static const String appName = 'diBISAlitas';
  static const String appTagline = 'Pendamping Inklusif Berbasis AI';
  static const String appVersion = '1.0.0';

  // ═══════════════════════════════════════════
  // CLOUDINARY (Upload Preset - Unsigned)
  // TODO: Ganti dengan credentials Cloudinary Anda
  // ═══════════════════════════════════════════
  static const String cloudinaryCloudName = 'YOUR_CLOUD_NAME';
  static const String cloudinaryUploadPreset = 'dibisalitas_unsigned';
  static const String cloudinaryUploadUrl =
      'https://api.cloudinary.com/v1_1/$cloudinaryCloudName/image/upload';

  // ═══════════════════════════════════════════
  // VERCEL API (Gemini AI Proxy)
  // TODO: Ganti setelah deploy web ke Vercel
  // ═══════════════════════════════════════════
  static const String apiBaseUrl = 'https://dibisalitas.vercel.app/api';

  // ═══════════════════════════════════════════
  // BiSAFE CONFIG
  // ═══════════════════════════════════════════
  static const int panicCountdownSeconds = 5;
  static const int shakeThreshold = 15; // m/s² untuk trigger panic
  static const int shakeCountToTrigger = 3; // berapa kali shake untuk trigger
  static const int shakeResetMs = 2000; // reset counter setelah 2 detik

  // ═══════════════════════════════════════════
  // BiJALAN CONFIG
  // ═══════════════════════════════════════════
  static const double obstacleWarningDistanceMeters = 5.0;
  static const double mapDefaultZoom = 15.0;
  static const double bandungLat = -6.9175;
  static const double bandungLng = 107.6191;

  // ═══════════════════════════════════════════
  // DISABILITY TYPES
  // ═══════════════════════════════════════════
  static const List<String> disabilityTypes = [
    'tunanetra',
    'tunarungu',
    'tunawicara',
    'tunadaksa',
    'lainnya',
  ];

  static const Map<String, String> disabilityLabels = {
    'tunanetra': 'Tunanetra',
    'tunarungu': 'Tunarungu',
    'tunawicara': 'Tunawicara',
    'tunadaksa': 'Tunadaksa',
    'lainnya': 'Lainnya',
  };

  // ═══════════════════════════════════════════
  // EMERGENCY STATUS
  // ═══════════════════════════════════════════
  static const Map<String, String> emergencyStatusLabels = {
    'pending': 'Menunggu Respon',
    'responding': 'Sedang Ditangani',
    'resolved': 'Selesai',
    'cancelled': 'Dibatalkan',
  };

  // ═══════════════════════════════════════════
  // OBSTACLE TYPES
  // ═══════════════════════════════════════════
  static const Map<String, String> obstacleTypeLabels = {
    'lubang': 'Lubang',
    'tiang': 'Tiang Listrik',
    'tangga': 'Tangga',
    'trotoar_rusak': 'Trotoar Rusak',
    'kendaraan_parkir': 'Kendaraan Parkir',
    'pohon': 'Pohon/Ranting',
    'lainnya': 'Lainnya',
  };

  static const Map<String, IconData> obstacleTypeIcons = {
    'lubang': Icons.circle_outlined,
    'tiang': Icons.vertical_align_bottom_rounded,
    'tangga': Icons.stairs_rounded,
    'trotoar_rusak': Icons.warning_rounded,
    'kendaraan_parkir': Icons.directions_car_rounded,
    'pohon': Icons.park_rounded,
    'lainnya': Icons.help_outline_rounded,
  };
}
