import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/voice_command_button.dart';

const Color _tosca = Color(0xFF00B894);

/// Bottom navigation sejajar dengan web:
/// Beranda · Komunitas · BiSAFE (FAB tengah) · Peta · Profil.
class MainWrapperScreen extends StatelessWidget {
  final Widget child;

  const MainWrapperScreen({super.key, required this.child});

  int _selectedIndex(BuildContext context) {
    final loc = GoRouterState.of(context).matchedLocation;
    if (loc.startsWith('/komunitas')) return 1;
    if (loc.startsWith('/bisafe')) return 2;
    if (loc.startsWith('/peta')) return 3;
    if (loc.startsWith('/profil')) return 4;
    return 0;
  }

  void _onTap(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go('/');
        break;
      case 1:
        context.go('/komunitas');
        break;
      case 2:
        context.go('/bisafe');
        break;
      case 3:
        context.go('/peta');
        break;
      case 4:
        context.go('/profil');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final current = _selectedIndex(context);

    return Scaffold(
      body: Stack(
        children: [
          child,
          // Perintah suara global (Tunanetra) — kiri-bawah agar tak menabrak FAB Peta
          Positioned(
            left: 16,
            bottom: 16,
            child: SafeArea(child: const VoiceCommandButton()),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Colors.grey.shade100)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          top: false,
          child: SizedBox(
            height: 66,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                _NavItem(
                  icon: Icons.home_rounded,
                  label: 'Beranda',
                  active: current == 0,
                  onTap: () => _onTap(0, context),
                ),
                _NavItem(
                  icon: Icons.campaign_rounded,
                  label: 'Komunitas',
                  active: current == 1,
                  onTap: () => _onTap(1, context),
                ),
                // BiSAFE — FAB tengah menonjol (darurat)
                Expanded(
                  child: GestureDetector(
                    onTap: () => _onTap(2, context),
                    behavior: HitTestBehavior.opaque,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Transform.translate(
                          offset: const Offset(0, -10),
                          child: Container(
                            width: 52,
                            height: 52,
                            decoration: BoxDecoration(
                              color: current == 2
                                  ? const Color(0xFFE11D48)
                                  : const Color(0xFFF43F5E),
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFFF43F5E)
                                      .withOpacity(0.4),
                                  blurRadius: 14,
                                  offset: const Offset(0, 6),
                                ),
                              ],
                            ),
                            child: const Icon(Icons.shield_rounded,
                                color: Colors.white, size: 26),
                          ),
                        ),
                        Transform.translate(
                          offset: const Offset(0, -8),
                          child: const Text('BiSAFE',
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFFF43F5E))),
                        ),
                      ],
                    ),
                  ),
                ),
                _NavItem(
                  icon: Icons.place_rounded,
                  label: 'Peta',
                  active: current == 3,
                  onTap: () => _onTap(3, context),
                ),
                _NavItem(
                  icon: Icons.person_rounded,
                  label: 'Profil',
                  active: current == 4,
                  onTap: () => _onTap(4, context),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool active;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = active ? _tosca : Colors.black38;
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 3),
            Text(label,
                style: TextStyle(
                    fontSize: 11,
                    fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                    color: color)),
          ],
        ),
      ),
    );
  }
}
