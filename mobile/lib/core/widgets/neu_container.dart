import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

enum NeuStyle { flat, concave, convex, pressed }

class NeuContainer extends StatelessWidget {
  final Widget? child;
  final double borderRadius;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry margin;
  final NeuStyle style;
  final double depth;
  final Color? color;
  final BoxShape shape;
  final double? width;
  final double? height;

  const NeuContainer({
    super.key,
    this.child,
    this.borderRadius = 24.0,
    this.padding = const EdgeInsets.all(16.0),
    this.margin = EdgeInsets.zero,
    this.style = NeuStyle.flat,
    this.depth = 8.0,
    this.color,
    this.shape = BoxShape.rectangle,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final baseColor = color ?? (isDark ? AppColors.darkSurface : AppColors.background);
    
    // Default Neumorphic Shadows (Flat/Convex)
    List<BoxShadow> shadows = [
      BoxShadow(
        color: isDark ? Colors.black54 : const Color(0x380F172A),
        offset: Offset(depth, depth),
        blurRadius: depth * 2,
        spreadRadius: isDark ? 0 : 0,
      ),
      BoxShadow(
        color: isDark ? Colors.white.withOpacity(0.05) : Colors.white,
        offset: Offset(-depth, -depth),
        blurRadius: depth * 2,
        spreadRadius: isDark ? 0 : 0,
      ),
    ];

    if (style == NeuStyle.pressed) {
      shadows = [
        BoxShadow(
          color: isDark ? Colors.black54 : const Color(0x1F0F172A),
          offset: const Offset(2, 2),
          blurRadius: 4,
        ),
        BoxShadow(
          color: isDark ? Colors.white10 : Colors.white,
          offset: const Offset(-2, -2),
          blurRadius: 4,
        ),
      ];
    }

    return Container(
      width: width,
      height: height,
      margin: margin,
      padding: padding,
      decoration: BoxDecoration(
        color: baseColor,
        shape: shape,
        borderRadius: shape == BoxShape.circle ? null : BorderRadius.circular(borderRadius),
        boxShadow: shadows,
      ),
      child: child,
    );
  }
}
