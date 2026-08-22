import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';

import '../../../core/config/constants.dart';
import '../../../core/services/firestore_service.dart';
import '../../../core/theme/app_colors.dart';
import '../../auth/providers/auth_provider.dart';

class ObstacleHistoryScreen extends ConsumerWidget {
  const ObstacleHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authStateProvider).valueOrNull;
    
    return Scaffold(
      appBar: AppBar(title: const Text('Riwayat Laporan Rintangan')),
      body: user == null 
        ? const Center(child: CircularProgressIndicator())
        : StreamBuilder(
            stream: ref.read(firestoreServiceProvider).getUserObstacleReports(user.uid),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              if (snapshot.hasError) {
                return Center(child: Text('Error: ${snapshot.error}'));
              }
              
              final docs = snapshot.data?.docs ?? [];
              
              if (docs.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.history, size: 64, color: Colors.grey[400]),
                      const SizedBox(height: 16),
                      Text('Belum ada riwayat laporan rintangan',
                          style: Theme.of(context).textTheme.titleMedium),
                    ],
                  ),
                );
              }

              return ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: docs.length,
                itemBuilder: (context, index) {
                  final data = docs[index].data() as Map<String, dynamic>;
                  final reportId = docs[index].id;
                  
                  final isResolved = data['isResolved'] ?? false;
                  final createdAt = data['createdAt']?.toDate();
                  final obstacleType = data['obstacleType'] ?? 'lainnya';
                  final description = data['description'] ?? '-';
                  
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              _StatusBadge(isResolved: isResolved),
                              const Spacer(),
                              if (createdAt != null)
                                Text(
                                  DateFormat('dd MMM yyyy, HH:mm').format(createdAt),
                                  style: Theme.of(context).textTheme.bodySmall,
                                ),
                              const SizedBox(width: 8),
                              GestureDetector(
                                onTap: () async {
                                  final confirm = await showDialog<bool>(
                                    context: context,
                                    builder: (ctx) => AlertDialog(
                                      title: const Text('Hapus Laporan?'),
                                      content: const Text('Apakah Anda yakin ingin menghapus laporan rintangan ini?'),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                      actions: [
                                        TextButton(
                                          onPressed: () => Navigator.pop(ctx, false),
                                          child: const Text('Batal', style: TextStyle(color: Colors.grey)),
                                        ),
                                        TextButton(
                                          onPressed: () => Navigator.pop(ctx, true),
                                          child: const Text('Hapus', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                                        ),
                                      ],
                                    ),
                                  );
                                  if (confirm == true) {
                                    await ref.read(firestoreServiceProvider).deleteObstacleReport(reportId);
                                    if (context.mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('Laporan rintangan berhasil dihapus')),
                                      );
                                    }
                                  }
                                },
                                child: const Icon(Icons.delete_outline, size: 20, color: Colors.redAccent),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Icon(AppConstants.obstacleTypeIcons[obstacleType] ?? Icons.warning_amber_rounded, size: 16, color: AppColors.textSecondary),
                              const SizedBox(width: 8),
                              Text(
                                AppConstants.obstacleTypeLabels[obstacleType] ?? 'Lainnya',
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            description,
                            style: const TextStyle(fontSize: 13, height: 1.4),
                          ),
                        ],
                      ),
                    ),
                  ).animate().fadeIn(delay: Duration(milliseconds: index * 80));
                },
              );
            },
          ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final bool isResolved;
  const _StatusBadge({required this.isResolved});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isResolved ? AppColors.success.withOpacity(0.12) : AppColors.warning.withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        isResolved ? 'Sudah Diperbaiki' : 'Butuh Perbaikan',
        style: TextStyle(
          color: isResolved ? AppColors.success : AppColors.warning,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
