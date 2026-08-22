import 'package:flutter/material.dart';
import '../../../core/utils/bisindo_yolo_parser.dart';

/// Widget Panel Hasil Premium ala iOS untuk menampilkan prediksi isyarat yang berhasil dideteksi
class BisindoResultPanel extends StatelessWidget {
  final BisindoParseResult? result;
  final bool isInit;
  final String? error;

  const BisindoResultPanel({
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
    final isWord = result!.label.isWord;
    final primaryColor = isWord ? const Color(0xFF0984E3) : const Color(0xFF00B894);

    return [
      Text(
        isWord ? "KATA KERJA TERDETEKSI" : "HURUF TERDETEKSI",
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.grey,
          letterSpacing: 2.0,
        ),
      ),
      const SizedBox(height: 4),
      Text(
        result!.label.label,
        style: TextStyle(
          fontSize: isWord ? 40 : 60,
          height: 1.1,
          fontWeight: FontWeight.w900,
          color: primaryColor,
        ),
      ),
      const SizedBox(height: 4),
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
          border: Border.all(color: Colors.grey[200]!),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              "Akurasi",
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.grey,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              "${(result!.score * 100).toStringAsFixed(1)}%",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
            ),
          ],
        ),
      ),
    ];
  }
}
