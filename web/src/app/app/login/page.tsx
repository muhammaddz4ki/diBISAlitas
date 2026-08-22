"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Lock, Mail, ChevronRight, AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Jika sudah login, arahkan ke dashboard. Jika belum, cek apakah pengguna baru.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/app/dashboard");
      } else {
        // Cek jika pengguna belum pernah melihat panduan/splashscreen
        const hasSeen = localStorage.getItem("hasSeenPanduan");
        if (!hasSeen) {
          router.replace("/app/panduan");
        }
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigasi ditangani oleh onAuthStateChanged di atas (setelah sesi benar-benar siap).
    } catch {
      setError("Email atau kata sandi tidak valid.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white px-8 pt-16 pb-8 relative">
      <Link href="/" className="absolute top-6 left-6 text-slate-400 hover:text-[#1B9981] transition-colors p-2 rounded-full hover:bg-slate-50">
        <ArrowLeft className="w-6 h-6" />
      </Link>
      
      <div className="flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/logo.png"
          alt="diBISAlitas"
          className="w-20 h-20 object-contain mb-6"
        />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          Selamat Datang Kembali
        </h1>
        <p className="text-slate-500 font-medium mb-10">
          Masuk untuk mengakses layanan darurat dan fitur inklusif Anda.
        </p>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 transition-all font-medium"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-4 bg-[#00B894] hover:bg-[#00a383] disabled:opacity-70 text-white rounded-2xl font-bold text-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? "Memproses..." : "Masuk"}
            {!isLoading && <ChevronRight className="w-5 h-5" />}
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <button
          onClick={() => router.push("/app/panduan")}
          className="text-slate-500 hover:text-[#1B9981] text-sm font-semibold transition-colors flex items-center justify-center gap-2 px-4 py-2 rounded-full hover:bg-slate-50"
        >
          Lihat Panduan & Tata Cara Penggunaan
        </button>

        <p className="text-slate-500 text-sm font-medium">
          Belum punya akun?{" "}
          <Link href="/app/register" className="text-[#1B9981] font-bold cursor-pointer hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
