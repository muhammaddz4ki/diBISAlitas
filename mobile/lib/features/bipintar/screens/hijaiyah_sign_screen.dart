import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/detection_provider.dart';
import '../widgets/camera_view.dart';
import '../widgets/bounding_box_overlay.dart';
import '../widgets/result_panel.dart';

/// Halaman Utama Aplikasi Mobile untuk Deteksi Hijaiyah YOLOv8.
/// Kelas ini sekarang murni sebagai Layout Presentasional. Semua logika berat 
/// telah dipisahkan ke Provider dan Services.
class HijaiyahSignScreen extends StatelessWidget {
  const HijaiyahSignScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<DetectionProvider>(
      create: (_) => DetectionProvider(ModelType.hijaiyah)..initializeAll(),
      child: const _HijaiyahSignScreenContent(),
    );
  }
}

class _HijaiyahSignScreenContent extends StatefulWidget {
  const _HijaiyahSignScreenContent();

  @override
  State<_HijaiyahSignScreenContent> createState() => _HijaiyahSignScreenContentState();
}

class _HijaiyahSignScreenContentState extends State<_HijaiyahSignScreenContent> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFBFBFD),
      body: Consumer<DetectionProvider>(
        builder: (context, provider, child) {
          return Stack(
            fit: StackFit.expand,
            children: [
              // 1. Layer Dasar: Aliran Kamera 
              if (provider.cameraController != null)
                CameraView(controller: provider.cameraController!),

              // 2. Layer Menengah: Bounding Box Overlay
              if (provider.bestResult != null)
                BoundingBoxOverlay(
                  result: provider.bestResult!,
                  modelInputSize: provider.modelInputSize,
                ),

              // 3. Layer Atas: Tombol Back iOS Style
              Positioned(
                top: 50,
                left: 20,
                child: SafeArea(
                  child: GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.9),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.12),
                            blurRadius: 24,
                            offset: const Offset(0, 4),
                          )
                        ],
                      ),
                      child: const Icon(Icons.arrow_back, color: Colors.black87),
                    ),
                  ),
                ),
              ),

              // 4. Layer Atas: Tombol Ganti Kamera
              Positioned(
                top: 50,
                right: 20,
                child: SafeArea(
                  child: GestureDetector(
                    onTap: () => provider.toggleCamera(),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.9),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.12),
                            blurRadius: 24,
                            offset: const Offset(0, 4),
                          )
                        ],
                      ),
                      child: const Icon(Icons.flip_camera_ios_rounded, color: Colors.black87),
                    ),
                  ),
                ),
              ),

              // 4. Layer Atas: Result Panel (Panel Hasil Deteksi Premium)
              ResultPanel(
                isInit: provider.isInit,
                result: provider.bestResult,
                error: provider.error,
              ),
            ],
          );
        },
      ),
    );
  }
}
