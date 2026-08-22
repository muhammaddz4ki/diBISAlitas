import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// A wrapper widget that restricts the maximum width of the application
/// on web/desktop platforms to simulate a mobile app layout.
class ResponsiveAppLayout extends StatelessWidget {
  final Widget child;

  const ResponsiveAppLayout({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    // Only apply layout constraints on the Web
    if (!kIsWeb) {
      return child;
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        // If the screen is wider than a typical smartphone (e.g., 600px), apply wrapper
        if (constraints.maxWidth > 600) {
          return Container(
            color: const Color(0xFFF9FAFB), // Very light iOS gray background
            child: Center(
              child: Container(
                width: 450, // Standard smartphone max width
                height: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 30,
                      spreadRadius: 5,
                      offset: const Offset(0, 0),
                    ),
                  ],
                ),
                // Wrap child in MediaQuery to ensure inner widgets think they are 450px wide
                child: MediaQuery(
                  data: MediaQuery.of(context).copyWith(
                    size: Size(450, constraints.maxHeight),
                  ),
                  child: child,
                ),
              ),
            ),
          );
        }

        // On smaller web windows, just return the child full screen
        return child;
      },
    );
  }
}
