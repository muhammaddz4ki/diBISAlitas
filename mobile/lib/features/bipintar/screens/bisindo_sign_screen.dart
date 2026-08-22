import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/bisindo_detection_provider.dart';
import '../widgets/bisindo_camera_view.dart';
import '../widgets/bisindo_bounding_box_overlay.dart';
import '../widgets/bisindo_result_panel.dart';

/// Halaman Utama Aplikasi Mobile untuk Deteksi Bahasa Isyarat BISINDO YOLOv8.
/// Kelas ini sekarang murni sebagai Layout Presentasional. Semua logika berat 
/// telah dipisahkan ke Provider dan Services khusus Bisindo.
class BisindoSignScreen extends StatelessWidget {
  const BisindoSignScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<BisindoDetectionProvider>(
      create: (_) => BisindoDetectionProvider()..initializeAll(),
      child: const _BisindoSignScreenContent(),
    );
  }
}

class _BisindoSignScreenContent extends StatefulWidget {
  const _BisindoSignScreenContent();

  @override
  State<_BisindoSignScreenContent> createState() => _BisindoSignScreenContentState();
}

class _BisindoSignScreenContentState extends State<_BisindoSignScreenContent> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFBFBFD),
      body: Consumer<BisindoDetectionProvider>(
        builder: (context, provider, child) {
          return Stack(
            fit: StackFit.expand,
            children: [
              // 1. Layer Dasar: Aliran Kamera 
              if (provider.cameraController != null)
                BisindoCameraView(controller: provider.cameraController!),

              // 2. Layer Menengah: Bounding Box Overlay
              if (provider.bestResult != null)
                BisindoBoundingBoxOverlay(
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
              BisindoResultPanel(
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
