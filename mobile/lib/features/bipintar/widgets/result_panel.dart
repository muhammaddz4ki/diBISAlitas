import 'package:flutter/material.dart';
import '../../../core/utils/yolo_parser.dart';

/// Widget Panel Hasil Premium ala iOS untuk menampilkan prediksi isyarat yang berhasil dideteksi
class ResultPanel extends StatelessWidget {
  final ParseResult? result;
  final bool isInit;
  final String? error;

  const ResultPanel({
    Key? key,
    this.result,
    required this.isInit,
    this.error,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 40,
      left: 20,
      right: 20,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(32),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.12),
              blurRadius: 40,
              offset: const Offset(0, 20),
            )
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: _buildContent(),
        ),
      ),
    );
  }

  List<Widget> _buildContent() {
    if (error != null) {
      return [
        const Text(
          "TERJADI KESALAHAN",
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: Colors.redAccent,
            letterSpacing: 2.0,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          error!,
          style: const TextStyle(fontSize: 16, color: Colors.black87),
          textAlign: TextAlign.center,
        ),
      ];
    }

    if (!isInit) {
      return const [
        Text(
          "STATUS",
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: Colors.grey,
            letterSpacing: 2.0,
          ),
        ),
        SizedBox(height: 12),
        Text(
          "Menyiapkan AI...",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
        ),
      ];
    }

    if (result == null) {
      return const [
        Text(
          "STATUS",
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: Colors.grey,
            letterSpacing: 2.0,
          ),
        ),
        SizedBox(height: 12),
        Text(
          "Mencari Isyarat...",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87),
        ),
      ];
    }

    // Jika berhasil mendeteksi objek
    return [
      const Text(
        "TERDETEKSI",
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
          letterSpacing: 2.0,
        ),
      ),
      const SizedBox(height: 4),
      if (result!.label.arabic != null)
        Text(
          result!.label.arabic!,
          style: const TextStyle(
            fontSize: 72,
            height: 1.1,
            color: Color(0xFF00B894),
          ),
        )
      else
        Text(
          result!.label.label,
          style: const TextStyle(
            fontSize: 48,
            height: 1.1,
            color: Color(0xFF0984E3),
          ),
        ),
      Text(
        result!.label.indo,
        style: const TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w900,
          color: Colors.black87,
        ),
      ),
      const SizedBox(height: 12),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.grey[50],
          borderRadius: BorderRadius.circular(30),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              "Akurasi",
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
            ),
            const SizedBox(width: 8),
            Text(
              "${(result!.score * 100).toStringAsFixed(1)}%",
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w900,
                color: Color(0xFF00B894),
              ),
            ),
          ],
        ),
      )
    ];
  }
}
