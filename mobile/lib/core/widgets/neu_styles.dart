import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class NeuText extends StatelessWidget {
  final String text;
  final TextStyle? style;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;

  const NeuText(
    this.text, {
    super.key,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    // Create text shadows for 3D effect
    final shadows = [
      BoxShadow(
        color: isDark ? Colors.black87 : const Color(0x4D0F172A),
        offset: const Offset(1, 1),
        blurRadius: 2,
      ),
      BoxShadow(
        color: isDark ? Colors.white.withOpacity(0.1) : Colors.white,
        offset: const Offset(-1, -1),
        blurRadius: 2,
      ),
    ];

    return Text(
      text,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
      style: (style ?? const TextStyle()).copyWith(
        shadows: shadows,
      ),
    );
  }
}

class NeuIcon extends StatelessWidget {
  final IconData icon;
  final double? size;
  final Color? color;

  const NeuIcon(
    this.icon, {
    super.key,
    this.size,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    final shadows = [
      BoxShadow(
        color: isDark ? Colors.black87 : const Color(0x4D0F172A),
        offset: const Offset(1.5, 1.5),
        blurRadius: 3,
      ),
      BoxShadow(
        color: isDark ? Colors.white.withOpacity(0.1) : Colors.white,
        offset: const Offset(-1.5, -1.5),
        blurRadius: 3,
      ),
    ];

    return Icon(
      icon,
      size: size,
      color: color,
      shadows: shadows,
    );
  }
}
