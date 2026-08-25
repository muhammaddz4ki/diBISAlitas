"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { UserCog, Mail, Lock, Save, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);
      setEmail(u.email || "");
      setName(u.displayName || "");
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        const d = snap.data();
        if (d) setName(d.name || d.fullName || u.displayName || "");
      } catch {
        // abaikan — pakai displayName
      }
    });
    return () => unsub();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      toast.error("Nama tidak boleh kosong.");
      return;
    }
    setLoadingProfile(true);
    try {
      await updateProfile(user, { displayName: name.trim() });
      await setDoc(
        doc(db, "users", user.uid),
        { name: name.trim(), fullName: name.trim(), updatedAt: serverTimestamp() },
        { merge: true }
      );
      toast.success("Profil berhasil diperbarui.");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui profil. Coba lagi.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;
    if (newPassword.length < 6) {
      toast.error("Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setLoadingPassword(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      toast.success("Kata sandi berhasil diubah.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengubah kata sandi. Pastikan kata sandi lama benar.");
    } finally {
      setLoadingPassword(false);
    }
  };

  const initial = (name?.[0] || email?.[0] || "A").toUpperCase();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="flex gap-4 sm:gap-5">
          <div className="p-3.5 sm:p-4 neo-icon-btn rounded-2xl text-[#00B894] h-fit shrink-0 border-none">
            <UserCog className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <div className="pt-1 sm:pt-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Pengaturan Profil
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm sm:text-base font-medium leading-relaxed">
              Kelola informasi akun dan keamanan admin Anda
            </p>
          </div>
        </div>
      </header>

      {/* Kartu identitas */}
      <div className="neo-flat p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 sm:gap-6 border-none">
        <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-3xl sm:rounded-2xl flex items-center justify-center text-[#00B894] text-3xl sm:text-2xl font-extrabold neo-pressed shrink-0">
          {initial}
        </div>
        <div className="min-w-0 pt-1 sm:pt-2 flex flex-col items-center sm:items-start">
          <h2 className="text-2xl sm:text-xl font-extrabold text-slate-900 truncate w-full">{name || "Administrator"}</h2>
          <p className="text-slate-500 text-sm font-medium truncate mt-1 w-full">{email || "—"}</p>
          <span className="inline-flex items-center gap-1.5 mt-4 sm:mt-3 px-4 py-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-extrabold neo-pressed text-[#00B894] border-none">
            <ShieldCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> Administrator
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Ubah kata sandi (KIRI) */}
        <form
          onSubmit={handleChangePassword}
          className="neo-flat p-6 sm:p-8 border-none h-fit"
        >
          <h3 className="font-extrabold text-xl text-slate-800 mb-1">Ubah Kata Sandi</h3>
          <p className="text-slate-500 text-sm font-medium mb-6">Masukkan kata sandi lama untuk verifikasi.</p>

          {[
            { label: "Kata Sandi Lama", value: currentPassword, set: setCurrentPassword, placeholder: "••••••••" },
            { label: "Kata Sandi Baru", value: newPassword, set: setNewPassword, placeholder: "Minimal 6 karakter" },
            { label: "Konfirmasi Sandi Baru", value: confirmPassword, set: setConfirmPassword, placeholder: "Ulangi kata sandi baru" },
          ].map((f, i) => (
            <div key={i} className="mb-5">
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">{f.label}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPw && i === 0 ? "text" : "password"}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl neo-pressed border-none text-slate-900 font-extrabold focus:outline-none transition-all"
                  placeholder={f.placeholder}
                />
                {i === 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-[#00B894] transition-colors"
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loadingPassword}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-8 py-4 neo-flat disabled:opacity-60 text-slate-700 font-extrabold rounded-2xl transition-all border-none hover:-translate-y-[2px]"
          >
            {loadingPassword ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : <Lock className="w-5 h-5 text-slate-400" />}
            Perbarui Kata Sandi
          </button>
        </form>

        {/* Informasi profil (KANAN) */}
        <form
          onSubmit={handleSaveProfile}
          className="neo-flat p-6 sm:p-8 border-none h-fit"
        >
          <h3 className="font-extrabold text-xl text-slate-800 mb-6">Informasi Profil</h3>

          <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-6 neo-pressed border-none rounded-2xl px-5 py-4 text-slate-900 font-extrabold focus:outline-none transition-all"
            placeholder="Nama admin"
          />

        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Email</label>
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="email"
            value={email}
            disabled
            className="w-full pl-12 pr-5 py-4 rounded-2xl neo-pressed border-none text-slate-400 font-extrabold cursor-not-allowed opacity-70"
          />
        </div>

        <button
          type="submit"
          disabled={loadingProfile}
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 neo-flat-primary disabled:opacity-60 text-white rounded-2xl font-extrabold transition-all border-none hover:-translate-y-[2px]"
        >
          {loadingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Simpan Perubahan
        </button>
        </form>
      </div>
    </div>
  );
}
