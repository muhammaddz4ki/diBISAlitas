import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_tts/flutter_tts.dart';

import '../../../core/services/auth_service.dart';
import '../../../core/providers/accessibility_provider.dart';

const Color _tosca = Color(0xFF00B894);

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  final _formKey = GlobalKey<FormState>();

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _oldPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();

  final FlutterTts _tts = FlutterTts();

  bool _isLoading = false;
  bool _showOldPassword = false;
  bool _showNewPassword = false;

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _tts.setLanguage('id-ID');
    _tts.setSpeechRate(0.5);
  }

  void _loadUserData() {
    final user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      _nameController.text = user.displayName ?? '';
      _emailController.text = user.email ?? '';
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _oldPasswordController.dispose();
    _newPasswordController.dispose();
    _tts.stop();
    super.dispose();
  }

  Future<void> _speak(String text) async {
    await _tts.stop();
    await _tts.speak(text);
  }

  Future<void> _speakIfTalkback(String text) async {
    if (ref.read(accessibilityProvider).talkback) {
      await _speak(text);
    }
  }

  void _showSnackBar(String message, {bool isError = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message,
            style: const TextStyle(fontWeight: FontWeight.w600)),
        backgroundColor: isError ? Colors.redAccent : _tosca,
        behavior: SnackBarBehavior.floating,
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
    );
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;

    setState(() => _isLoading = true);

    try {
      final String newName = _nameController.text.trim();
      final String newEmail = _emailController.text.trim();
      final String oldPassword = _oldPasswordController.text;
      final String newPassword = _newPasswordController.text;

      bool requiresReauth = false;
      bool profileUpdated = false;

      // 1. Update Name & Firestore
      if (newName != user.displayName) {
        await user.updateDisplayName(newName);
        await FirebaseFirestore.instance
            .collection('users')
            .doc(user.uid)
            .set({
          'fullName': newName,
          'name': newName,
          'updatedAt': FieldValue.serverTimestamp(),
        }, SetOptions(merge: true));
        profileUpdated = true;
      }

      // 2. Cek apakah perlu ganti Email atau Password
      if ((newEmail != user.email && newEmail.isNotEmpty) ||
          newPassword.isNotEmpty) {
        requiresReauth = true;
        if (oldPassword.isEmpty) {
          throw Exception(
              'Password Lama wajib diisi untuk mengubah Email atau Password Baru.');
        }
      }

      // 3. Re-authentication
      if (requiresReauth) {
        final credential = EmailAuthProvider.credential(
          email: user.email!,
          password: oldPassword,
        );
        await user.reauthenticateWithCredential(credential);

        if (newEmail != user.email && newEmail.isNotEmpty) {
          await user.verifyBeforeUpdateEmail(newEmail);
          await FirebaseFirestore.instance
              .collection('users')
              .doc(user.uid)
              .set({
            'email': newEmail,
            'updatedAt': FieldValue.serverTimestamp(),
          }, SetOptions(merge: true));
          profileUpdated = true;
        }

        if (newPassword.isNotEmpty) {
          await user.updatePassword(newPassword);
          _oldPasswordController.clear();
          _newPasswordController.clear();
          profileUpdated = true;
        }
      }

      _showSnackBar(profileUpdated
          ? 'Profil berhasil diperbarui'
          : 'Tidak ada perubahan yang disimpan');
    } on FirebaseAuthException catch (e) {
      String errorMsg = 'Terjadi kesalahan. Silakan coba lagi.';
      if (e.code == 'wrong-password' || e.code == 'invalid-credential') {
        errorMsg = 'Password Lama tidak sesuai.';
      } else if (e.code == 'weak-password') {
        errorMsg = 'Password Baru terlalu lemah.';
      } else if (e.code == 'email-already-in-use') {
        errorMsg = 'Email sudah digunakan oleh akun lain.';
      } else if (e.message != null) {
        errorMsg = e.message!;
      }
      _showSnackBar(errorMsg, isError: true);
    } catch (e) {
      _showSnackBar(e.toString().replaceAll('Exception: ', ''), isError: true);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    final displayName = user?.displayName ?? 'Pengguna';
    final initial = displayName.isNotEmpty ? displayName[0].toUpperCase() : 'P';
    final a11y = ref.watch(accessibilityProvider);
    final notifier = ref.read(accessibilityProvider.notifier);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // ── Header — Minimal White ──
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(24, 56, 24, 24),
              decoration: const BoxDecoration(
                color: Colors.white,
                border:
                    Border(bottom: BorderSide(color: Color(0xFFF1F5F9))),
              ),
              child: Column(
                children: [
                  Stack(
                    children: [
                      Container(
                        width: 92,
                        height: 92,
                        decoration: BoxDecoration(
                          color: _tosca.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        alignment: Alignment.center,
                        child: Text(initial,
                            style: const TextStyle(
                                fontSize: 38,
                                fontWeight: FontWeight.w800,
                                color: _tosca)),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: _tosca,
                            shape: BoxShape.circle,
                            border:
                                Border.all(color: Colors.white, width: 2.5),
                          ),
                          child: const Icon(Icons.verified_rounded,
                              color: Colors.white, size: 16),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(displayName,
                      style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A))),
                  const SizedBox(height: 2),
                  Text(user?.email ?? '',
                      style: const TextStyle(
                          fontSize: 13, color: Colors.black45)),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Kartu Informasi Akun ──
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: _cardDecoration(),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Informasi Akun',
                              style: TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.black87)),
                          const SizedBox(height: 4),
                          const Text('Perbarui profil dan keamanan Anda',
                              style: TextStyle(
                                  fontSize: 12, color: Colors.black45)),
                          const SizedBox(height: 20),
                          _buildTextField(
                            label: 'Nama Lengkap',
                            controller: _nameController,
                            hintText: 'Masukkan nama lengkap',
                          ),
                          const SizedBox(height: 16),
                          _buildTextField(
                            label: 'Alamat Email',
                            controller: _emailController,
                            hintText: 'Masukkan email aktif',
                          ),
                          const Divider(height: 32, color: Color(0xFFF1F5F9)),
                          _buildTextField(
                            label: 'Password Lama',
                            controller: _oldPasswordController,
                            hintText: '••••••••',
                            isPassword: true,
                            showPassword: _showOldPassword,
                            onTogglePassword: () => setState(
                                () => _showOldPassword = !_showOldPassword),
                            helperText:
                                'Wajib diisi jika ingin mengganti Email atau Password Baru',
                          ),
                          const SizedBox(height: 16),
                          _buildTextField(
                            label: 'Password Baru (Opsional)',
                            controller: _newPasswordController,
                            hintText: 'Biarkan kosong jika tidak diganti',
                            isPassword: true,
                            showPassword: _showNewPassword,
                            onTogglePassword: () => setState(
                                () => _showNewPassword = !_showNewPassword),
                          ),
                          const SizedBox(height: 20),
                          SizedBox(
                            width: double.infinity,
                            height: 54,
                            child: ElevatedButton.icon(
                              onPressed: _isLoading ? null : _handleSave,
                              icon: _isLoading
                                  ? const SizedBox.shrink()
                                  : const Icon(Icons.save_rounded, size: 20),
                              label: _isLoading
                                  ? const SizedBox(
                                      width: 22,
                                      height: 22,
                                      child: CircularProgressIndicator(
                                          strokeWidth: 3,
                                          valueColor:
                                              AlwaysStoppedAnimation<Color>(
                                                  Colors.white)),
                                    )
                                  : const Text('Simpan Perubahan',
                                      style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w700)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _tosca,
                                foregroundColor: Colors.white,
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16)),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),
                  const Padding(
                    padding: EdgeInsets.only(left: 4, bottom: 12),
                    child: Text('AKSESIBILITAS',
                        style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.2,
                            color: Colors.black38)),
                  ),

                  // ── Ukuran Teks ──
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: _cardDecoration(),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            _iconBox(Icons.text_fields_rounded, true),
                            const SizedBox(width: 14),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Ukuran Teks',
                                      style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w800,
                                          color: Colors.black87)),
                                  Text('Perbesar tampilan seluruh aplikasi',
                                      style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.black45)),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children:
                              List.generate(kFontLabels.length, (i) {
                            final selected = a11y.fontLevel == i;
                            return Expanded(
                              child: Padding(
                                padding: EdgeInsets.only(
                                    right: i < kFontLabels.length - 1 ? 8 : 0),
                                child: GestureDetector(
                                  onTap: () {
                                    notifier.setFontLevel(i);
                                    _speakIfTalkback(
                                        'Ukuran teks ${kFontLabels[i]}');
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 12),
                                    alignment: Alignment.center,
                                    decoration: BoxDecoration(
                                      color: selected
                                          ? _tosca
                                          : const Color(0xFFF5F5F7),
                                      borderRadius:
                                          BorderRadius.circular(14),
                                    ),
                                    child: Text(
                                      kFontLabels[i],
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w700,
                                          color: selected
                                              ? Colors.white
                                              : Colors.black54),
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),

                  // ── Kontras Tinggi ──
                  _toggleTile(
                    icon: Icons.tonality,
                    title: 'Kontras Tinggi',
                    subtitle: a11y.highContrast
                        ? 'Aktif — warna & teks dipertegas'
                        : 'Pertegas warna & teks',
                    value: a11y.highContrast,
                    onChanged: (_) async {
                      await notifier.toggleHighContrast();
                      _speakIfTalkback(
                          ref.read(accessibilityProvider).highContrast
                              ? 'Kontras tinggi aktif'
                              : 'Kontras tinggi nonaktif');
                    },
                  ),
                  const SizedBox(height: 12),

                  // ── Kurangi Animasi ──
                  _toggleTile(
                    icon: Icons.auto_awesome_rounded,
                    title: 'Kurangi Animasi',
                    subtitle: a11y.reduceMotion
                        ? 'Aktif — animasi diminimalkan'
                        : 'Minimalkan gerak & transisi',
                    value: a11y.reduceMotion,
                    onChanged: (_) async {
                      await notifier.toggleReduceMotion();
                      _speakIfTalkback(
                          ref.read(accessibilityProvider).reduceMotion
                              ? 'Animasi dikurangi'
                              : 'Animasi normal');
                    },
                  ),
                  const SizedBox(height: 12),

                  // ── Baca Layar (TalkBack) ──
                  _toggleTile(
                    icon: Icons.record_voice_over_rounded,
                    title: 'Baca Layar (TalkBack)',
                    subtitle: a11y.talkback
                        ? 'Aktif — membacakan tindakan penting'
                        : 'Bacakan tindakan lewat suara',
                    value: a11y.talkback,
                    onChanged: (_) async {
                      await notifier.toggleTalkback();
                      final on = ref.read(accessibilityProvider).talkback;
                      _speak(on
                          ? 'Baca layar diaktifkan. Untuk pembacaan layar penuh, aktifkan TalkBack bawaan perangkat.'
                          : 'Baca layar dinonaktifkan.');
                    },
                  ),

                  const SizedBox(height: 28),

                  // ── Logout ──
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton.icon(
                      onPressed: _isLoading
                          ? null
                          : () async {
                              await ref
                                  .read(authServiceProvider)
                                  .logout();
                            },
                      icon: const Icon(Icons.logout_rounded,
                          color: Colors.redAccent),
                      label: const Text('Keluar Akun',
                          style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: Colors.redAccent)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.redAccent.withOpacity(0.06),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  BoxDecoration _cardDecoration() => BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFEFEFEF)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      );

  Widget _iconBox(IconData icon, bool active) => Container(
        width: 52,
        height: 52,
        decoration: BoxDecoration(
          color: active ? _tosca.withOpacity(0.12) : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Icon(icon,
            color: active ? _tosca : Colors.black38, size: 24),
      );

  Widget _toggleTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: _cardDecoration(),
      child: Row(
        children: [
          _iconBox(icon, value),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Colors.black87)),
                const SizedBox(height: 2),
                Text(subtitle,
                    style: const TextStyle(
                        fontSize: 12, color: Colors.black45)),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            onChanged: onChanged,
            activeColor: _tosca,
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    required String hintText,
    bool isPassword = false,
    bool showPassword = false,
    VoidCallback? onTogglePassword,
    String? helperText,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4.0, bottom: 6.0),
          child: Text(
            label.toUpperCase(),
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: Colors.black54,
              letterSpacing: 0.5,
            ),
          ),
        ),
        if (helperText != null)
          Padding(
            padding: const EdgeInsets.only(left: 4.0, bottom: 8.0),
            child: Text(
              helperText,
              style: const TextStyle(fontSize: 11, color: Colors.black45),
            ),
          ),
        TextFormField(
          controller: controller,
          obscureText: isPassword && !showPassword,
          style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w500,
              color: Colors.black87),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: const TextStyle(color: Colors.black38),
            filled: true,
            fillColor: const Color(0xFFF9FAFB),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: Colors.grey.shade200),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: Colors.grey.shade200),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: _tosca),
            ),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 18, vertical: 15),
            suffixIcon: isPassword
                ? IconButton(
                    icon: Icon(
                      showPassword
                          ? Icons.visibility_off_rounded
                          : Icons.visibility_rounded,
                      color: Colors.black38,
                      size: 20,
                    ),
                    onPressed: onTogglePassword,
                  )
                : null,
          ),
        ),
      ],
    );
  }
}
