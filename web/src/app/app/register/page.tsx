"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Lock, Mail, User as UserIcon, UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

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
      // 1. Create User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Profile Display Name
      await updateProfile(user, { displayName: name });

      // 3. Create Document in Firestore (skema terpadu — konsisten dengan mobile)
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

      // 4. Redirect to Dashboard
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

  return (
    <div className="flex flex-col min-h-full bg-white px-8 py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col justify-center"
      >
        <motion.img
          variants={fadeUp}
          custom={0}
          src="/logo/logo.png"
          alt="diBISAlitas"
          className="w-20 h-20 object-contain mb-6"
        />
        <motion.h1
          variants={fadeUp}
          custom={1}
          className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2"
        >
          Daftar Akun Baru
        </motion.h1>
        <motion.p variants={fadeUp} custom={2} className="text-slate-500 font-medium mb-8">
          Bergabunglah dengan ekosistem inklusif kami untuk kemandirian aksesibilitas.
        </motion.p>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="register-error"
              role="alert"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form variants={fadeUp} custom={3} onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <motion.div variants={fadeUp} custom={4}>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 transition-all font-medium"
                placeholder="Masukkan nama lengkap"
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div variants={fadeUp} custom={5}>
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
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 transition-all font-medium"
                placeholder="nama@email.com"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div variants={fadeUp} custom={6}>
            <label className="block text-sm font-bold text-slate-700 mb-2">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 transition-all font-medium"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={fadeUp} custom={7}>
            <label className="block text-sm font-bold text-slate-700 mb-2">Konfirmasi Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border-transparent rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 transition-all font-medium"
                placeholder="Ketik ulang kata sandi"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>

          <motion.button
            variants={fadeUp}
            custom={8}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-6 bg-[#00B894] hover:bg-[#00a383] disabled:opacity-70 text-white rounded-2xl font-bold text-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-8 text-center pb-6"
      >
        <p className="text-slate-500 text-sm font-medium">
          Sudah punya akun?{" "}
          <Link href="/app/login" className="text-[#00B894] font-bold cursor-pointer hover:underline">
            Login di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
