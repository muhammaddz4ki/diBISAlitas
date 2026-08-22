import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

import 'core/config/app_router.dart';
import 'core/theme/app_theme.dart';
import 'core/config/constants.dart';
import 'core/widgets/responsive_app_layout.dart';
import 'core/providers/accessibility_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);

  // Status bar style
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));

  runApp(const ProviderScope(child: DiBISAlitasApp()));
}

class DiBISAlitasApp extends ConsumerWidget {
  const DiBISAlitasApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final a11y = ref.watch(accessibilityProvider);

    return MaterialApp.router(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,

      // Theme — dipaksa selalu TERANG (putih/tosca), abaikan mode gelap sistem
      theme: AppTheme.light,
      darkTheme: AppTheme.light,
      themeMode: ThemeMode.light,

      // Router
      routerConfig: router,

      // Accessibility & Responsive Wrapper
      builder: (context, child) {
        Widget content = ResponsiveAppLayout(child: child!);

        // Kontras tinggi: pertegas seluruh warna app via matriks kontras
        if (a11y.highContrast) {
          const double c = 1.18;
          const double t = 128 * (1 - c);
          content = ColorFiltered(
            colorFilter: const ColorFilter.matrix(<double>[
              c, 0, 0, 0, t,
              0, c, 0, 0, t,
              0, 0, c, 0, t,
              0, 0, 0, 1, 0,
            ]),
            child: content,
          );
        }

        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            // Ukuran teks aksesibilitas (Normal/Besar/Sangat Besar)
            textScaler: TextScaler.linear(a11y.fontScale),
            // Kurangi animasi
            disableAnimations: a11y.reduceMotion,
          ),
          child: content,
        );
      },
    );
  }
}
