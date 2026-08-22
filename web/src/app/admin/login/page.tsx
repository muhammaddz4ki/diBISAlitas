"use client";

import { useState, useEffect } from "react";
import { Lock, User, Activity, AlertCircle, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Info lembut bila diarahkan ke sini oleh guard admin, lalu bersihkan URL-nya.
  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("error");
    if (reason === "forbidden") {
      setNotice("Halaman ini khusus untuk pengelola sistem. Silakan masuk dengan akun admin Anda.");
      window.history.replaceState({}, "", "/admin/login");
    }
  }, []);

  // Cek jika sudah login, langsung lempar ke dashboard (layout admin akan verifikasi role)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin/dashboard");
      } else {
        setIsCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError("");
    setNotice("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Routing & verifikasi role ditangani oleh onAuthStateChanged + layout admin
    } catch (err) {
      // Pesan generik agar tidak membocorkan detail (mencegah user enumeration).
      console.error("Auth Error:", err);
      setError("Email atau kata sandi salah.");
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center">
        <Activity className="w-8 h-8 text-[#00B894] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center p-6 selection:bg-[#00B894]/20 selection:text-[#00B894]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#00B894]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#00B894]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Login Admin</h1>
          <p className="text-slate-500 font-medium text-sm mt-2">Otentikasi khusus pengelola sistem</p>
        </div>

        {notice && !error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 text-slate-600 rounded-2xl text-sm font-medium">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#00B894]" />
            <p>{notice}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B894]/20 focus:border-[#00B894] transition-all bg-slate-50 focus:bg-white text-sm"
                placeholder="Email Administrator"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B894]/20 focus:border-[#00B894] transition-all bg-slate-50 focus:bg-white text-sm"
                placeholder="Kata Sandi"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 mt-4 text-white rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
              isLoading ? "bg-[#00B894]/60 cursor-not-allowed" : "bg-[#00B894] hover:bg-[#00a383] hover:shadow-md"
            }`}
          >
            {isLoading && <Activity className="w-4 h-4 animate-spin" />}
            Masuk Sistem
          </button>
        </form>
      </div>
    </div>
  );
}
