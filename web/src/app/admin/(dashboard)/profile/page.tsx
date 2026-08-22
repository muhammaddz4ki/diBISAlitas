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
    <div className="max-w-3xl">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <span className="p-2.5 bg-[#00B894]/10 rounded-xl text-[#00B894]">
            <UserCog className="w-6 h-6" />
          </span>
          Pengaturan Profil
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">
          Kelola informasi akun dan keamanan admin Anda.
        </p>
      </header>

      {/* Kartu identitas */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] p-8 mb-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-[#00B894] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#00B894]/20 shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900 truncate">{name || "Administrator"}</h2>
          <p className="text-slate-500 text-sm truncate">{email || "—"}</p>
          <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#00B894]/10 text-[#00B894]">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrator
          </span>
        </div>
      </div>

      {/* Informasi profil */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] p-8 mb-6"
      >
        <h3 className="font-bold text-lg text-slate-800 mb-6">Informasi Profil</h3>

        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-5 px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B894]/20 focus:border-[#00B894] transition-all text-sm font-medium"
          placeholder="Nama admin"
        />

        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-300" />
          </div>
          <input
            type="email"
            value={email}
            disabled
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loadingProfile}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00B894] hover:bg-[#00a383] disabled:opacity-60 text-white rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all"
        >
          {loadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </button>
      </form>

      {/* Ubah kata sandi */}
      <form
        onSubmit={handleChangePassword}
        className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] p-8"
      >
        <h3 className="font-bold text-lg text-slate-800 mb-1">Ubah Kata Sandi</h3>
        <p className="text-slate-400 text-sm mb-6">Masukkan kata sandi lama untuk verifikasi.</p>

        {[
          { label: "Kata Sandi Lama", value: currentPassword, set: setCurrentPassword, placeholder: "••••••••" },
          { label: "Kata Sandi Baru", value: newPassword, set: setNewPassword, placeholder: "Minimal 6 karakter" },
          { label: "Konfirmasi Sandi Baru", value: confirmPassword, set: setConfirmPassword, placeholder: "Ulangi kata sandi baru" },
        ].map((f, i) => (
          <div key={i} className="mb-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">{f.label}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-300" />
              </div>
              <input
                type={showPw ? "text" : "password"}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B894]/20 focus:border-[#00B894] transition-all text-sm font-medium"
                placeholder={f.placeholder}
              />
              {i === 0 && (
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
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
          className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all"
        >
          {loadingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          Perbarui Kata Sandi
        </button>
      </form>
    </div>
  );
}
