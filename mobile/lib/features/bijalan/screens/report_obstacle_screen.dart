import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../core/config/constants.dart';
import '../../../core/config/app_router.dart';
import '../../../core/services/auth_service.dart';
import '../../../core/services/cloudinary_service.dart';
import '../../../core/services/firestore_service.dart';
import '../../../core/services/location_service.dart';
import '../../../core/theme/app_colors.dart';
import '../../auth/providers/auth_provider.dart';

class ReportObstacleScreen extends ConsumerStatefulWidget {
  const ReportObstacleScreen({super.key});

  @override
  ConsumerState<ReportObstacleScreen> createState() =>
      _ReportObstacleScreenState();
}

class _ReportObstacleScreenState extends ConsumerState<ReportObstacleScreen> {
  final _descriptionController = TextEditingController();
  String _selectedType = 'lubang';
  String _selectedSeverity = 'medium';
  File? _photo;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _pickPhoto() async {
    final picker = ImagePicker();
    final xFile = await picker.pickImage(
      source: ImageSource.camera,
      maxWidth: 1280,
      imageQuality: 75,
    );
    if (xFile != null) {
      setState(() => _photo = File(xFile.path));
    }
  }

  Future<void> _submit() async {
    setState(() => _isSubmitting = true);

    try {
      // Get location
      final position =
          await ref.read(locationServiceProvider).getCurrentPosition();
      if (position == null) {
        _showError('Tidak bisa mendapatkan lokasi GPS');
        return;
      }

      // Upload photo
      String? photoUrl;
      if (_photo != null) {
        photoUrl =
            await ref.read(cloudinaryServiceProvider).uploadObstaclePhoto(_photo!);
      }

      // Get user
      final user = ref.read(authStateProvider).valueOrNull;
      final profile = user != null
          ? await ref.read(authServiceProvider).getUserProfile(user.uid)
          : null;

      // Save to Firestore
      await ref.read(firestoreServiceProvider).createObstacleReport({
        'reporterId': user?.uid ?? '',
        'reporterName': profile?['fullName'] ?? user?.displayName ?? '',
        'latitude': position.latitude,
        'longitude': position.longitude,
        'obstacleType': _selectedType,
        'description': _descriptionController.text.trim(),
        'photoUrl': photoUrl,
        'severity': _selectedSeverity,
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Rintangan berhasil dilaporkan! Terima kasih.'),
            backgroundColor: AppColors.success,
          ),
        );
        context.pop();
      }
    } catch (e) {
      _showError('Gagal melaporkan: $e');
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _showError(String msg) {
    if (!mounted) return;
    setState(() => _isSubmitting = false);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: AppColors.error),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lapor Rintangan'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            tooltip: 'Riwayat Laporan Saya',
            onPressed: () => context.push(AppRoutes.obstacleHistory),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Jenis Rintangan',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _selectedType,
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.warning_amber_rounded),
              ),
              items: AppConstants.obstacleTypeLabels.entries.map((e) {
                return DropdownMenuItem(
                  value: e.key,
                  child: Row(
                    children: [
                      Icon(AppConstants.obstacleTypeIcons[e.key], size: 20, color: Colors.black54),
                      const SizedBox(width: 12),
                      Text(e.value),
                    ],
                  ),
                );
              }).toList(),
              onChanged: (v) => setState(() => _selectedType = v ?? 'lubang'),
            ),
            const SizedBox(height: 20),

            Text('Tingkat Bahaya',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(value: 'low', label: Text('Rendah')),
                ButtonSegment(value: 'medium', label: Text('Sedang')),
                ButtonSegment(value: 'high', label: Text('Tinggi')),
              ],
              selected: {_selectedSeverity},
              onSelectionChanged: (v) =>
                  setState(() => _selectedSeverity = v.first),
            ),
            const SizedBox(height: 20),

            Text('Deskripsi (opsional)',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            TextField(
              controller: _descriptionController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'Jelaskan kondisi rintangan...',
              ),
            ),
            const SizedBox(height: 20),

            Text('Foto (opsional)',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: _pickPhoto,
              child: Container(
                height: 150,
                decoration: BoxDecoration(
                  color: AppColors.surfaceVariant,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.border),
                  image: _photo != null
                      ? DecorationImage(
                          image: FileImage(_photo!),
                          fit: BoxFit.cover,
                        )
                      : null,
                ),
                child: _photo == null
                    ? const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.camera_alt_outlined, size: 40, color: AppColors.textHint),
                          SizedBox(height: 8),
                          Text('Ketuk untuk ambil foto',
                              style: TextStyle(color: AppColors.textHint)),
                        ],
                      )
                    : null,
              ),
            ),
            const SizedBox(height: 32),

            SizedBox(
              height: 56,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.warning,
                ),
                child: _isSubmitting
                    ? const CircularProgressIndicator(
                        strokeWidth: 2.5, color: Colors.white)
                    : const Text('Kirim Laporan'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
