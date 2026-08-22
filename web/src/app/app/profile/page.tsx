"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { LogOut, Eye, EyeOff, Save, CheckCircle2, AlertCircle, Volume2, VolumeX, ShieldCheck, Type, Contrast, Sparkles } from "lucide-react";
import { useTalkbackContext } from "@/lib/TalkbackContext";
import { useAccessibility, FONT_LABELS } from "@/lib/AccessibilityContext";
import { motion, AnimatePresence, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const talkback = useTalkbackContext();
  const a11y = useAccessibility();

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // UI states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/app/login");
      } else {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      let requiresReauth = false;
      let profileUpdated = false;

      // 1. Update Display Name & Firestore
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
        await setDoc(doc(db, "users", user.uid), {
          name: displayName,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        profileUpdated = true;
      }

      // 2. Check if we need to update Email or Password
      if ((email !== user.email && email !== "") || newPassword !== "") {
        requiresReauth = true;
        if (!oldPassword) {
          throw new Error("Password Lama wajib diisi untuk mengubah Email atau Password Baru.");
        }
      }

      // 3. Handle Re-authentication
      if (requiresReauth) {
        const credential = EmailAuthProvider.credential(user.email!, oldPassword);
        await reauthenticateWithCredential(user, credential);

        // Update Email
        if (email !== user.email && email !== "") {
          await updateEmail(user, email);
          await setDoc(doc(db, "users", user.uid), {
            email: email,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          profileUpdated = true;
        }

        // Update Password
        if (newPassword !== "") {
          await updatePassword(user, newPassword);
          setNewPassword(""); // Reset password field after success
          setOldPassword("");
          profileUpdated = true;
        }
      }

      if (profileUpdated) {
        showToast("Profil berhasil diperbarui", "success");
      } else {
        showToast("Tidak ada perubahan yang disimpan", "success");
      }

    } catch (error: any) {
      console.error(error);
      let errorMsg = "Gagal memperbarui profil.";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = "Password Lama tidak sesuai.";
      } else if (error.message) {
        errorMsg = error.message;
      }
      showToast(errorMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-[#1B9981]/30 border-t-[#1B9981] rounded-full animate-spin"></div>
      </div>
    );
  }

  const initial = (user?.displayName || "Pengguna").charAt(0).toUpperCase() || "P";

  return (
    <div className="min-h-full bg-white selection:bg-[#1B9981]/20 flex flex-col pb-12 relative overflow-hidden">

      {/* Minimalist iOS-like Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[360px]"
          >
            <div className={`px-4 py-3.5 rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border flex items-center gap-3 backdrop-blur-xl ${toast.type === 'success'
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                : 'bg-rose-50/90 border-rose-200 text-rose-800'
              }`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              <span className="text-[13px] font-bold tracking-tight">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header — Minimal White */}
      <div className="px-6 pt-14 pb-6 bg-white border-b border-slate-100 shrink-0">
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full bg-[#00B894]/10 flex items-center justify-center">
              <span className="text-4xl font-black text-[#00B894]">{initial}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#00B894] rounded-full border-[3px] border-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-[22px] font-black text-slate-900 tracking-tight">{user?.displayName || "Pengguna"}</h1>
          <p className="text-slate-400 text-[13px] font-medium mt-0.5">{user?.email}</p>
        </div>
      </div>

      <div className="px-5 pt-6 relative z-20 flex-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Form Management Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] border border-slate-100">
            <div className="mb-5 px-1">
              <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">Informasi Akun</h2>
              <p className="text-slate-500 text-[12px] mt-0.5">Perbarui profil dan keamanan Anda</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[16px] px-4 py-3.5 text-slate-800 font-semibold text-[14px] focus:outline-none focus:border-[#1B9981]/50 focus:ring-2 focus:ring-[#1B9981]/20 transition-all placeholder:text-slate-400 placeholder:font-medium"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Alamat Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[16px] px-4 py-3.5 text-slate-800 font-semibold text-[14px] focus:outline-none focus:border-[#1B9981]/50 focus:ring-2 focus:ring-[#1B9981]/20 transition-all placeholder:text-slate-400 placeholder:font-medium"
                  placeholder="Masukkan email aktif"
                />
              </div>

              <div className="w-full h-px bg-slate-100 my-5"></div>

              {/* Old Password */}
              <div className="space-y-1.5">
                <div className="flex items-end justify-between ml-1 mb-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password Lama</label>
                </div>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[16px] pl-4 pr-12 py-3.5 text-slate-800 font-semibold text-[14px] focus:outline-none focus:border-[#1B9981]/50 focus:ring-2 focus:ring-[#1B9981]/20 transition-all placeholder:text-slate-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 -webkit-tap-highlight-color-transparent"
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[10px] font-medium text-amber-500 ml-1 mt-1 leading-snug">
                  *Wajib diisi jika ingin mengganti Email atau Password Baru
                </p>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password Baru (Opsional)</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[16px] pl-4 pr-12 py-3.5 text-slate-800 font-semibold text-[14px] focus:outline-none focus:border-[#1B9981]/50 focus:ring-2 focus:ring-[#1B9981]/20 transition-all placeholder:text-slate-400 placeholder:font-medium"
                    placeholder="Kosongkan jika tidak diganti"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 -webkit-tap-highlight-color-transparent"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#1B9981] hover:bg-[#15826C] active:scale-[0.98] disabled:bg-slate-300 disabled:active:scale-100 text-white font-bold py-4 px-6 rounded-[16px] flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_20px_-5px_rgba(27,153,129,0.4)] disabled:shadow-none -webkit-tap-highlight-color-transparent"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" strokeWidth={2.5} />
                      <span className="text-[15px]">Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* ===== AKSESIBILITAS SECTION ===== */}
          <motion.div variants={itemVariants} className="mb-2">
            <div className="flex items-center justify-between mb-3 px-2">
              <h2 className="text-[12px] font-extrabold text-slate-500 uppercase tracking-widest">Aksesibilitas</h2>
            </div>

            {/* Ukuran Teks */}
            <div className="bg-white border border-slate-100 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 mb-3">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-[18px] bg-[#1B9981]/15 flex items-center justify-center shrink-0">
                  <Type className="w-6 h-6 text-[#1B9981]" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-[16px] tracking-tight mb-0.5">Ukuran Teks</p>
                  <p className="text-[12px] text-slate-500 leading-snug">Perbesar tampilan seluruh aplikasi</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {FONT_LABELS.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => a11y.setFontLevel(i)}
                    aria-label={`Ukuran teks ${label}`}
                    className={`py-2.5 rounded-[14px] text-[13px] font-bold border transition-all active:scale-95 ${
                      a11y.fontLevel === i
                        ? "bg-[#1B9981] text-white border-[#1B9981] shadow-[0_4px_16px_-6px_rgba(27,153,129,0.5)]"
                        : "bg-slate-50 text-slate-600 border-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kontras Tinggi */}
            <div className="bg-white border border-slate-100 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] mb-3">
              <button
                type="button"
                onClick={a11y.toggleHighContrast}
                aria-label={a11y.highContrast ? "Nonaktifkan kontras tinggi" : "Aktifkan kontras tinggi"}
                className="w-full flex items-center gap-4 p-4 active:bg-slate-50 transition-colors outline-none"
              >
                <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 ${a11y.highContrast ? "bg-[#1B9981]/15" : "bg-slate-100"}`}>
                  <Contrast className={`w-6 h-6 ${a11y.highContrast ? "text-[#1B9981]" : "text-slate-400"}`} strokeWidth={2.5} />
                </div>
                <div className="flex-1 text-left py-0.5">
                  <p className="font-bold text-slate-800 text-[16px] tracking-tight mb-0.5">Kontras Tinggi</p>
                  <p className="text-[12px] text-slate-500 leading-snug">{a11y.highContrast ? "Aktif — warna & teks dipertegas" : "Nonaktif — ketuk untuk mengaktifkan"}</p>
                </div>
                <div className={`relative w-[52px] h-[30px] rounded-full transition-all duration-300 shrink-0 shadow-inner ${a11y.highContrast ? "bg-[#1B9981]" : "bg-slate-200"}`} aria-hidden="true">
                  <div className={`absolute top-1 w-[22px] h-[22px] bg-white rounded-full shadow-sm transition-transform duration-300 ${a11y.highContrast ? "translate-x-6" : "translate-x-1"}`} />
                </div>
              </button>
            </div>

            {/* Kurangi Animasi */}
            <div className="bg-white border border-slate-100 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] mb-3">
              <button
                type="button"
                onClick={a11y.toggleReduceMotion}
                aria-label={a11y.reduceMotion ? "Aktifkan kembali animasi" : "Kurangi animasi"}
                className="w-full flex items-center gap-4 p-4 active:bg-slate-50 transition-colors outline-none"
              >
                <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 ${a11y.reduceMotion ? "bg-[#1B9981]/15" : "bg-slate-100"}`}>
                  <Sparkles className={`w-6 h-6 ${a11y.reduceMotion ? "text-[#1B9981]" : "text-slate-400"}`} strokeWidth={2.5} />
                </div>
                <div className="flex-1 text-left py-0.5">
                  <p className="font-bold text-slate-800 text-[16px] tracking-tight mb-0.5">Kurangi Animasi</p>
                  <p className="text-[12px] text-slate-500 leading-snug">{a11y.reduceMotion ? "Aktif — animasi diminimalkan" : "Nonaktif — ketuk untuk mengurangi gerak"}</p>
                </div>
                <div className={`relative w-[52px] h-[30px] rounded-full transition-all duration-300 shrink-0 shadow-inner ${a11y.reduceMotion ? "bg-[#1B9981]" : "bg-slate-200"}`} aria-hidden="true">
                  <div className={`absolute top-1 w-[22px] h-[22px] bg-white rounded-full shadow-sm transition-transform duration-300 ${a11y.reduceMotion ? "translate-x-6" : "translate-x-1"}`} />
                </div>
              </button>
            </div>

            {/* TalkBack Toggle Card */}
            <div className="bg-white border border-slate-100 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  talkback.toggle();
                  if (talkback.isEnabled) {
                    talkback.speak("TalkBack dinonaktifkan");
                  } else {
                    setTimeout(() => talkback.speak("TalkBack diaktifkan. Saya akan membacakan konten layar untuk Anda."), 100);
                  }
                }}
                aria-label={talkback.isEnabled ? "Nonaktifkan TalkBack" : "Aktifkan TalkBack"}
                className="w-full flex items-center gap-4 p-4 active:bg-slate-50 transition-colors -webkit-tap-highlight-color-transparent outline-none"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center transition-colors shrink-0 ${talkback.isEnabled ? "bg-[#1B9981]/15" : "bg-slate-100"
                  }`}>
                  {talkback.isEnabled
                    ? <Volume2 className="w-6 h-6 text-[#1B9981]" strokeWidth={2.5} />
                    : <VolumeX className="w-6 h-6 text-slate-400" strokeWidth={2.5} />
                  }
                </div>

                {/* Text */}
                <div className="flex-1 text-left py-0.5">
                  <p className="font-bold text-slate-800 text-[16px] tracking-tight mb-0.5">TalkBack</p>
                  <p className="text-[12px] text-slate-500 leading-snug pr-2">
                    {talkback.isEnabled
                      ? "Aktif — Membacakan konten layar"
                      : "Nonaktif — Ketuk untuk mengaktifkan"
                    }
                  </p>
                </div>

                {/* iOS-Style Toggle Switch */}
                <div
                  className={`relative w-[52px] h-[30px] rounded-full transition-all duration-300 shrink-0 shadow-inner ${talkback.isEnabled ? "bg-[#1B9981]" : "bg-slate-200"
                    }`}
                  aria-hidden="true"
                >
                  <div
                    className={`absolute top-1 w-[22px] h-[22px] bg-white rounded-full shadow-sm transition-transform duration-300 ${talkback.isEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </div>
              </button>

              {/* Status indicator */}
              <AnimatePresence>
                {talkback.isEnabled && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#1B9981]/5 border-t border-[#1B9981]/10"
                  >
                    <div className="px-4 py-3 flex items-center gap-2.5">
                      <span className="w-2 h-2 bg-[#1B9981] rounded-full animate-pulse shadow-[0_0_8px_rgba(27,153,129,0.6)] shrink-0"></span>
                      <p className="text-[11px] font-bold tracking-wide text-[#1B9981]">
                        Arahkan kursor/sentuh elemen layar untuk mendengarkan.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Keluar Akun Button */}
          <motion.div variants={itemVariants} className="pt-2">
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Keluar dari akun"
              className="w-full bg-white active:bg-rose-50 border border-rose-100 text-rose-500 font-bold py-4 px-6 rounded-[20px] flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] active:scale-[0.98] -webkit-tap-highlight-color-transparent"
            >
              <LogOut className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-[15px]">Keluar dari Akun</span>
            </button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}