import 'dart:async';
import 'package:sensors_plus/sensors_plus.dart';
import 'dart:math';
import 'package:flutter/foundation.dart';

/// Detects phone shake gestures for triggering panic button.
/// When the user shakes the phone [shakeCountToTrigger] times within
/// [resetDuration], [onShakeTriggered] is called.
class ShakeDetector {
  final double shakeThreshold;
  final int shakeCountToTrigger;
  final Duration resetDuration;
  final VoidCallback onShakeTriggered;

  StreamSubscription<AccelerometerEvent>? _subscription;
  int _shakeCount = 0;
  DateTime _lastShakeTime = DateTime.now();
  bool _isActive = false;

  ShakeDetector({
    this.shakeThreshold = 15.0,
    this.shakeCountToTrigger = 3,
    this.resetDuration = const Duration(milliseconds: 2000),
    required this.onShakeTriggered,
  });

  /// Start listening for shake events
  void start() {
    if (_isActive) return;
    _isActive = true;
    _shakeCount = 0;

    // Web does not reliably support accelerometer sensors
    if (kIsWeb) {
      debugPrint('ShakeDetector: Running on Web, sensor disabled.');
      return;
    }

    _subscription = accelerometerEventStream().listen((event) {
      final acceleration = sqrt(
        event.x * event.x + event.y * event.y + event.z * event.z,
      );

      if (acceleration > shakeThreshold) {
        final now = DateTime.now();

        // Reset count if too much time passed since last shake
        if (now.difference(_lastShakeTime) > resetDuration) {
          _shakeCount = 0;
        }

        _shakeCount++;
        _lastShakeTime = now;

        if (_shakeCount >= shakeCountToTrigger) {
          _shakeCount = 0;
          onShakeTriggered();
        }
      }
    });
  }

  /// Stop listening
  void stop() {
    _isActive = false;
    _subscription?.cancel();
    _subscription = null;
    _shakeCount = 0;
  }

  /// Check if currently active
  bool get isActive => _isActive;

  /// Dispose
  void dispose() {
    stop();
  }
}

// Typedef for convenience
typedef VoidCallback = void Function();
