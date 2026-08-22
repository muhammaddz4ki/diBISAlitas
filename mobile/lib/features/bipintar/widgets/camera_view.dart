import 'package:camera/camera.dart';
import 'package:flutter/material.dart';

/// Widget Presentasional murni untuk menampilkan aliran Kamera
class CameraView extends StatelessWidget {
  final CameraController controller;

  const CameraView({Key? key, required this.controller}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (!controller.value.isInitialized) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFF00B894)),
      );
    }
    
    return CameraPreview(controller);
  }
}
