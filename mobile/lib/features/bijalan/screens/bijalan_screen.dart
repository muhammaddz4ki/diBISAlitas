import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/bijalan_detection_provider.dart';
import '../../../core/utils/bijalan_yolo_parser.dart';
import '../widgets/bijalan_camera_view.dart';

class BiJalanScreen extends StatelessWidget {
  const BiJalanScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<BijalanDetectionProvider>(
      create: (_) => BijalanDetectionProvider()..initializeAll(),
      child: const _BiJalanScreenContent(),
    );
  }
}

class _BiJalanScreenContent extends StatelessWidget {
  const _BiJalanScreenContent();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Consumer<BijalanDetectionProvider>(
        builder: (context, provider, child) {
          final g = computeBijalanGuidance(provider.results);
          final Color accent = !g.hasObstacle
              ? const Color(0xFF00B894)
              : g.level == 2
                  ? const Color(0xFFF43F5E)
                  : g.level == 1
                      ? const Color(0xFFF59E0B)
                      : const Color(0xFF00B894);
          final String title = g.hasObstacle
              ? (g.label.isNotEmpty
                  ? g.label[0].toUpperCase() + g.label.substring(1)
                  : 'Rintangan')
              : 'Rute Aman';
          final String jarak = g.level == 2
              ? 'Sangat dekat'
              : (g.level == 1 ? 'Dekat' : 'Terpantau');
          final String subtitle = g.hasObstacle
              ? '$jarak · di ${g.direction}'
              : 'Kamera aktif memindai lingkungan.';
          final IconData arrowIcon = g.direction == 'kiri'
              ? Icons.arrow_back_rounded
              : (g.direction == 'kanan'
                  ? Icons.arrow_forward_rounded
                  : Icons.arrow_upward_rounded);
          final double barValue = !g.hasObstacle ? 0.12 : (g.level + 1) / 3.0;

          return Stack(
            fit: StackFit.expand,
            children: [
              // 1. Camera Preview
              if (provider.cameraController != null)
                BijalanCameraView(controller: provider.cameraController!)
              else if (provider.error != null)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(32.0),
                    child: Text(
                      provider.error!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.white, fontSize: 16),
                    ),
                  ),
                )
              else
                const Center(child: CircularProgressIndicator(color: Color(0xFF00B894))),

              // Bounding Boxes (Optional, usually for BiJALAN we only rely on TTS and Panel, but we can draw them)
              if (provider.results.isNotEmpty)
                ...provider.results.map((result) {
                  // Coordinate mapping:
                  // For camera back, preview is usually full screen (cover).
                  // The box is [xc, yc, w, h] in 640x640 scale.
                  // We'll simplify the rendering or just omit the boxes if TTS is the main output.
                  // The previous Google ML Kit version did not draw boxes either, only the panel!
                  return const SizedBox.shrink();
                }),

              // 2. Back Button (Glassmorphism Style)
              Positioned(
                top: MediaQuery.of(context).padding.top + 16,
                left: 20,
                child: GestureDetector(
                  onTap: () => Navigator.of(context).pop(),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.85),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.arrow_back_ios_new_rounded,
                      color: Colors.black87,
                      size: 22,
                    ),
                  ),
                ),
              ),

              // 3. Settings Button (Voice Speed)
              Positioned(
                top: MediaQuery.of(context).padding.top + 16,
                right: 20,
                child: GestureDetector(
                  onTap: () {
                    showModalBottomSheet(
                      context: context,
                      backgroundColor: Colors.transparent,
                      builder: (ctx) {
                        double currentSpeed = provider.ttsSpeed;
                        return Container(
                          padding: const EdgeInsets.all(24),
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 40,
                                height: 4,
                                margin: const EdgeInsets.only(bottom: 24),
                                decoration: BoxDecoration(
                                  color: Colors.grey[300],
                                  borderRadius: BorderRadius.circular(2),
                                ),
                              ),
                              const Text(
                                "Pengaturan Suara BiJALAN",
                                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                "Geser untuk mengatur kecepatan suara asisten panduan.",
                                textAlign: TextAlign.center,
                                style: TextStyle(fontSize: 13, color: Colors.black54),
                              ),
                              const SizedBox(height: 24),
                              StatefulBuilder(
                                builder: (context, setState) {
                                  return Row(
                                    children: [
                                      const Text("0.1x", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black54)),
                                      Expanded(
                                        child: Slider(
                                          value: currentSpeed,
                                          min: 0.1,
                                          max: 1.5,
                                          divisions: 14,
                                          activeColor: const Color(0xFF00B894),
                                          label: currentSpeed.toStringAsFixed(1),
                                          onChanged: (val) {
                                            setState(() => currentSpeed = val);
                                            provider.setTtsSpeed(val);
                                          },
                                        ),
                                      ),
                                      const Text("1.5x", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black54)),
                                    ],
                                  );
                                }
                              ),
                              const SizedBox(height: 16),
                            ],
                          ),
                        );
                      }
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.85),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.settings_voice_rounded,
                      color: Colors.black87,
                      size: 22,
                    ),
                  ),
                ),
              ),

              // 4. HUD Panduan (rintangan prioritas + arah + level jarak)
              Positioned(
                bottom: 40,
                left: 24,
                right: 24,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: accent.withOpacity(0.18),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: accent.withOpacity(0.12),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              g.hasObstacle
                                  ? Icons.warning_rounded
                                  : Icons.explore_rounded,
                              color: accent,
                              size: 28,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  title,
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: g.hasObstacle
                                        ? accent
                                        : Colors.black87,
                                    letterSpacing: -0.3,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  subtitle,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: Colors.black54,
                                    height: 1.3,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (g.hasObstacle) ...[
                            const SizedBox(width: 12),
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: accent.withOpacity(0.12),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(arrowIcon, color: accent, size: 26),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 14),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: LinearProgressIndicator(
                          value: barValue,
                          minHeight: 8,
                          backgroundColor: const Color(0xFFF1F5F9),
                          color: accent,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
