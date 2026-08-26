"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Lock, Mail, User as UserIcon, UserPlus, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        fullName: name,
        email: email,
        phone: "",
        disabilityType: "Belum Diatur",
        role: "user",
        isAdmin: false,
        isVerified: false,
        avatarUrl: null,
        fcmToken: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      router.push("/app/dashboard");
      
    } catch (err: any) {
      console.error(err);
      let errorMsg = "Gagal mendaftarkan akun. Silakan coba lagi.";
      if (err.code === "auth/email-already-in-use") {
        errorMsg = "Email ini sudah terdaftar.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "Kata sandi terlalu lemah (minimal 6 karakter).";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Format email tidak valid.";
      }
      setError(errorMsg);
    } finally {
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
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00B894]/5 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00B894]/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="flex flex-col my-auto max-w-md mx-auto w-full px-8 py-8 sm:py-12 relative z-10">
        
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="w-full flex flex-col"
        >
          {/* Header Area (Logo) */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <img src="/logo/logo.png" alt="diBISAlitas" className="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-white rounded-xl neo-flat" />
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 mb-2">
              Daftar Akun
            </h1>
            <p className="text-slate-500 font-bold mb-8 leading-relaxed text-sm">
              Bergabunglah dengan ekosistem inklusif kami.
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex items-start gap-3 p-4 neo-pressed border-none text-rose-500 rounded-2xl text-sm font-bold overflow-hidden"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form variants={itemVariants} onSubmit={handleRegister} className="space-y-5">
            
            {/* Full Name */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full !pl-[3.5rem] pr-4 py-4 neo-pressed-input text-sm font-bold text-slate-700 placeholder:text-slate-400 rounded-2xl outline-none focus:ring-2 focus:ring-[#00B894]/30 transition-all"
                  placeholder="Nama Lengkap"
                />
              </div>
            </div>

            {/* Email */}
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
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full !pl-[3.5rem] pr-14 py-4 neo-pressed-input text-sm font-bold text-slate-700 placeholder:text-slate-400 rounded-2xl outline-none focus:ring-2 focus:ring-[#00B894]/30 transition-all"
                  placeholder="Kata Sandi"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-[#00B894] transition-colors outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full !pl-[3.5rem] pr-14 py-4 neo-pressed-input text-sm font-bold text-slate-700 placeholder:text-slate-400 rounded-2xl outline-none focus:ring-2 focus:ring-[#00B894]/30 transition-all"
                  placeholder="Konfirmasi Sandi"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-[#00B894] transition-colors outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
                  <UserPlus className="w-5 h-5" />
                  Daftar Akun
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
          <p className="text-slate-500 text-sm font-medium">
            Sudah punya akun?{" "}
            <Link href="/app/login" className="text-[#00B894] font-extrabold cursor-pointer hover:underline">
              Login di sini
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
