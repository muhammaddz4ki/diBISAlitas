import 'package:flutter/material.dart';
import '../../../core/utils/yolo_parser.dart';

/// Widget Presentasional murni untuk merender bingkai kotak deteksi (Bounding Box) 
/// di atas preview kamera, beserta pergeseran koordinat (Un-Mirroring).
class BoundingBoxOverlay extends StatelessWidget {
  final ParseResult result;
  final int modelInputSize;

  const BoundingBoxOverlay({
    Key? key,
    required this.result,
    required this.modelInputSize,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: CustomPaint(
        painter: BoundingBoxPainter(
          result: result,
          imageSize: Size(modelInputSize.toDouble(), modelInputSize.toDouble()),
        ),
      ),
    );
  }
}

/// CustomPainter untuk merender bentuk geometris pada layer kanvas Flutter
class BoundingBoxPainter extends CustomPainter {
  final ParseResult result;
  final Size imageSize;

  BoundingBoxPainter({required this.result, required this.imageSize});

  @override
  void paint(Canvas canvas, Size size) {
    // Rasio skala untuk menyesuaikan ukuran matriks TFLite (misal 640x640) ke ukuran layar fisik
    final scaleX = size.width / imageSize.width;
    final scaleY = size.height / imageSize.height;

    final paintBox = Paint()
      ..color = const Color(0xFF00B894)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0;

    final paintTextBg = Paint()
      ..color = const Color(0xFF00B894)
      ..style = PaintingStyle.fill;

    // Normalisasi koordinat Box
    final xCenter = result.box[0] * scaleX;
    final yCenter = result.box[1] * scaleY;
    final w = result.box[2] * scaleX;
    final h = result.box[3] * scaleY;

    // Un-Mirror koordinat secara matematika untuk kamera depan
    final xCenterOriginal = size.width - xCenter;
    final xMin = (xCenterOriginal - (w / 2)).clamp(0.0, size.width);
    final yMin = (yCenter - (h / 2)).clamp(0.0, size.height);

    final rect = Rect.fromLTWH(xMin, yMin, w, h);
    canvas.drawRect(rect, paintBox);

    // Label Rendering
    final label = result.label.indo;
    final scoreStr = "${(result.score * 100).toStringAsFixed(1)}%";
    final textSpan = TextSpan(
      text: "$label $scoreStr",
      style: const TextStyle(
        color: Colors.white,
        fontSize: 14,
        fontWeight: FontWeight.bold,
      ),
    );

    final textPainter = TextPainter(
      text: textSpan,
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();

    // Background Label Text
    canvas.drawRect(
      Rect.fromLTWH(rect.left, rect.top - 24, textPainter.width + 12, 24),
      paintTextBg,
    );

    textPainter.paint(canvas, Offset(rect.left + 6, rect.top - 20));
  }

  @override
  bool shouldRepaint(covariant BoundingBoxPainter oldDelegate) {
    return true;
  }
}
