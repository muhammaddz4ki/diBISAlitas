import 'dart:io';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_riverpod/flutter_riverpod.dart';

// ═══════════════════════════════════════════
// CLOUDINARY SERVICE — Upload images
// ═══════════════════════════════════════════
class CloudinaryService {
  // Cloud name adalah identifier PUBLIK (muncul di URL pengiriman), bukan rahasia.
  final String cloudName = 'dstawey1z';
  // Unsigned upload preset — konfigurasikan sebagai "Unsigned" di dashboard Cloudinary.
  // Tidak ada apiKey/apiSecret di klien agar kredensial tidak bocor saat APK dibongkar.
  final String uploadPreset = 'dibisalitas_unsigned';

  // ── Upload image file to Cloudinary ──
  // Returns the secure URL of the uploaded image
  Future<String?> uploadImage({
    required File imageFile,
    String folder = 'dibisalitas',
  }) async {
    int maxRetries = 3;
    for (int attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        final uri = Uri.parse('https://api.cloudinary.com/v1_1/$cloudName/image/upload');

        // Unsigned upload — cukup upload_preset (tanpa api_key/timestamp/signature).
        final request = http.MultipartRequest('POST', uri)
          ..fields['upload_preset'] = uploadPreset
          ..fields['folder'] = folder
          ..files.add(
            await http.MultipartFile.fromPath('file', imageFile.path),
          );

        final response = await request.send().timeout(const Duration(seconds: 45));

        if (response.statusCode == 200) {
          final responseBody = await response.stream.bytesToString();
          final data = jsonDecode(responseBody);
          return data['secure_url'] as String;
        } else {
          final responseBody = await response.stream.bytesToString();
          if (attempt == maxRetries) {
            throw Exception('Gagal upload gambar (Status ${response.statusCode}): $responseBody');
          }
        }
      } catch (e) {
        debugPrint('Cloudinary upload error attempt $attempt: $e');
        if (attempt == maxRetries) {
          throw Exception('Koneksi terputus saat upload gambar. Pastikan sinyal internet Anda stabil: $e');
        }
        // Tunggu sejenak sebelum retry
        await Future.delayed(Duration(seconds: attempt * 2));
      }
    }
    return null;
  }

  // ── Upload for emergency reports (BiSAFE) ──
  Future<String?> uploadEmergencyPhoto(File imageFile) async {
    return uploadImage(
      imageFile: imageFile,
      folder: 'dibisalitas/emergency',
    );
  }

  // ── Upload for obstacle reports (BiJALAN) ──
  Future<String?> uploadObstaclePhoto(File imageFile) async {
    return uploadImage(
      imageFile: imageFile,
      folder: 'dibisalitas/obstacles',
    );
  }
}

// ═══════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════
final cloudinaryServiceProvider = Provider<CloudinaryService>(
  (ref) => CloudinaryService(),
);
