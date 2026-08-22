import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:flutter/foundation.dart';

class BijalanCameraView extends StatelessWidget {
  final CameraController controller;

  const BijalanCameraView({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: Text(
            'Fitur Kamera Navigasi BiJALAN memerlukan perangkat Native Android/iOS.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
        ),
      );
    }
    
    if (!controller.value.isInitialized) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFF00B894)),
      );
    }

    final size = MediaQuery.of(context).size;
    var scale = size.aspectRatio * controller.value.aspectRatio;
    if (scale < 1) scale = 1 / scale;

    return Transform.scale(
      scale: scale,
      child: Center(
        child: CameraPreview(controller),
      ),
    );
  }
}
