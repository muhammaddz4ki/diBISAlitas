// App Color Palette for diBISAlitas
// Warna brand yang inklusif, kontras tinggi untuk aksesibilitas (target WCAG AA).
// Setiap token semantik memiliki warna yang BERBEDA agar status mudah dibedakan.

import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // ═══════════════════════════════════════════
  // PRIMARY — Tosca Green (warna brand)
  // ═══════════════════════════════════════════
  static const Color primary = Color(0xFF00B894);
  static const Color primaryLight = Color(0xFF55EFC4);
  static const Color primaryDark = Color(0xFF00896B);

  // ═══════════════════════════════════════════
  // SECONDARY — Biru aksen
  // ═══════════════════════════════════════════
  static const Color secondary = Color(0xFF0984E3);
  static const Color secondaryLight = Color(0xFF74B9FF);
  static const Color secondaryDark = Color(0xFF0652DD);

  // ═══════════════════════════════════════════
  // EMERGENCY — Merah (BiSAFE)
  // ═══════════════════════════════════════════
  static const Color emergency = Color(0xFFE74C3C);
  static const Color emergencyLight = Color(0xFFFF7675);
  static const Color emergencyDark = Color(0xFFC0392B);

  // ═══════════════════════════════════════════
  // NAVIGATION — Biru (BiJALAN)
  // ═══════════════════════════════════════════
  static const Color navigation = Color(0xFF0984E3);
  static const Color navigationLight = Color(0xFF74B9FF);
  static const Color navigationDark = Color(0xFF0652DD);

  // ═══════════════════════════════════════════
  // STATUS — masing-masing warna berbeda
  // ═══════════════════════════════════════════
  static const Color success = Color(0xFF00B894); // hijau
  static const Color warning = Color(0xFFF39C12); // kuning/amber
  static const Color info = Color(0xFF0984E3);    // biru
  static const Color error = Color(0xFFE74C3C);   // merah

  // ═══════════════════════════════════════════
  // NEUTRAL — Light mode
  // ═══════════════════════════════════════════
  static const Color white = Color(0xFFFFFFFF);
  static const Color background = Color(0xFFF4F6FC);
  static const Color surface = Color(0xFFF4F6FC);
  static const Color surfaceVariant = Color(0xFFE8EBF2);
  static const Color border = Color(0xFFE2E8F0);
  static const Color textPrimary = Color(0xFF1A202C);   // near-black, kontras tinggi
  static const Color textSecondary = Color(0xFF5A6572); // slate
  static const Color textHint = Color(0xFF94A3B8);

  // ═══════════════════════════════════════════
  // DARK MODE — benar-benar gelap & terbaca
  // ═══════════════════════════════════════════
  static const Color darkBackground = Color(0xFF0F172A);     // slate-900
  static const Color darkSurface = Color(0xFF1E293B);        // slate-800
  static const Color darkSurfaceVariant = Color(0xFF334155); // slate-700
  static const Color darkBorder = Color(0xFF334155);
  static const Color darkTextPrimary = Color(0xFFF1F5F9);    // near-white
  static const Color darkTextSecondary = Color(0xFF94A3B8);  // slate-400

  // ═══════════════════════════════════════════
  // DISABILITY TYPE COLORS (untuk charts/badges) — warna berbeda tiap jenis
  // ═══════════════════════════════════════════
  static const Color tunanetra = Color(0xFF6C5CE7);  // ungu
  static const Color tunarungu = Color(0xFF0984E3);  // biru
  static const Color tunawicara = Color(0xFF00B894); // hijau
  static const Color tunadaksa = Color(0xFFE17055);  // oranye
  static const Color lainnya = Color(0xFF636E72);    // abu-abu
}
