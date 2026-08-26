"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Lock, Mail, ChevronRight, AlertCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/app/dashboard");
      } else {
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
    } catch {
      setError("Email atau kata sandi tidak valid.");
      setIsLoading(false);
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="flex flex-col flex-1 neo-page relative overflow-x-hidden">
      
      {/* Decorative Blur Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00B894]/5 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00B894]/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="flex flex-col my-auto max-w-md mx-auto w-full px-8 py-8 sm:py-12 relative z-10">
        
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="w-full flex flex-col"
        >
          {/* Header Area (Logo) */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <img src="/logo/logo.png" alt="diBISAlitas" className="w-24 h-24 sm:w-28 sm:h-28 object-contain bg-white rounded-xl neo-flat" />
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 mb-3">
              Selamat Datang
            </h1>
            <p className="text-slate-500 font-bold mb-10 leading-relaxed text-sm">
              Masuk untuk mengakses layanan inklusif kami.
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                id="login-error" 
                role="alert" 
                className="mb-6 flex items-start gap-3 p-4 neo-pressed border-none text-rose-500 rounded-2xl text-sm font-bold overflow-hidden"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form variants={itemVariants} onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full !pl-[3.5rem] pr-4 py-4 neo-pressed-input text-sm font-bold text-slate-700 placeholder:text-slate-400 rounded-2xl outline-none focus:ring-2 focus:ring-[#00B894]/30 transition-all"
                  placeholder="Email"
                  aria-describedby={error ? "login-error" : undefined}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full !pl-[3.5rem] pr-4 py-4 neo-pressed-input text-sm font-bold text-slate-700 placeholder:text-slate-400 rounded-2xl outline-none focus:ring-2 focus:ring-[#00B894]/30 transition-all"
                  placeholder="Kata Sandi"
                  aria-describedby={error ? "login-error" : undefined}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`neo-flat-primary border-none w-full py-4 mt-8 text-white rounded-2xl font-extrabold text-lg transition-all flex items-center justify-center gap-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:shadow-[#00B894]/30"
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Masuk
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-10 text-center pb-6 flex flex-col gap-3"
        >
          <button
            onClick={() => router.push("/app/panduan")}
            className="neo-flat text-slate-500 hover:text-[#00B894] text-sm font-bold transition-all flex items-center justify-center gap-2 px-6 py-4 rounded-2xl w-full"
          >
            Lihat Panduan & Tata Cara
          </button>

          <p className="text-slate-500 text-sm font-medium">
            Belum punya akun?{" "}
            <Link href="/app/register" className="text-[#00B894] font-extrabold cursor-pointer hover:underline">
              Daftar di sini
            </Link>
          </p>
          <Link href="/" className="text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors">
            &larr; Kembali ke Halaman Utama
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
