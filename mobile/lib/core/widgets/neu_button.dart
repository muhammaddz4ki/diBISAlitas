import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'neu_container.dart';

class NeuButton extends StatefulWidget {
  final Widget child;
  final VoidCallback onTap;
  final double borderRadius;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry margin;
  final Color? color;
  final BoxShape shape;

  const NeuButton({
    super.key,
    required this.child,
    required this.onTap,
    this.borderRadius = 20.0,
    this.padding = const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
    this.margin = EdgeInsets.zero,
    this.color,
    this.shape = BoxShape.rectangle,
  });

  @override
  State<NeuButton> createState() => _NeuButtonState();
}

class _NeuButtonState extends State<NeuButton> with SingleTickerProviderStateMixin {
  bool _isPressed = false;
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleTapDown(TapDownDetails details) {
    setState(() => _isPressed = true);
    _controller.forward();
  }

  void _handleTapUp(TapUpDetails details) {
    setState(() => _isPressed = false);
    _controller.reverse();
    HapticFeedback.lightImpact();
    widget.onTap();
  }

  void _handleTapCancel() {
    setState(() => _isPressed = false);
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _handleTapDown,
      onTapUp: _handleTapUp,
      onTapCancel: _handleTapCancel,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) => Transform.scale(
          scale: _scaleAnimation.value,
          child: child,
        ),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          curve: Curves.easeOutCubic,
          child: NeuContainer(
            padding: widget.padding,
            margin: widget.margin,
            borderRadius: widget.borderRadius,
            color: widget.color,
            shape: widget.shape,
            style: _isPressed ? NeuStyle.pressed : NeuStyle.flat,
            depth: _isPressed ? 4.0 : 8.0,
            child: widget.child,
          ),
        ),
      ),
    );
  }
}
