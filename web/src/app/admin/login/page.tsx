"use client";

import { useState, useEffect } from "react";
import { Activity, AlertCircle, Info, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDemo = new URLSearchParams(window.location.search).get("demo") === "true";
      if (isDemo) {
        window.sessionStorage.setItem("dibisalitas_admin_demo_mode", "true");
        router.replace("/admin/dashboard?demo=true");
        return;
      }
    }

    const reason = new URLSearchParams(window.location.search).get("error");
    if (reason === "forbidden") {
      setNotice("Halaman khusus admin.");
      window.history.replaceState({}, "", "/admin/login");
    }
  }, [router]);

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
    } catch (err) {
      console.error("Auth Error:", err);
      setError("Email atau kata sandi salah.");
      setIsLoading(false);
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 1 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 1, x: isMobile ? 0 : 100, y: isMobile ? 100 : 0 },
    visible: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen bg-[#E8F4F1] flex items-center justify-center">
        <Activity className="w-8 h-8 text-[#00B894] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative bg-white font-sans flex flex-col lg:flex-row justify-end overflow-x-hidden">
      
      {/* KIRI/ATAS: GAMBAR FULL BLEED */}
      <div 
        className="absolute top-0 left-0 w-full h-[60vh] lg:h-full lg:w-[55%] z-0 overflow-hidden bg-[#E8F4F1]"
      >
        <img 
          src="/images/latar-belakang-login.png"
          alt="Latar Belakang Login"
          className="w-full h-full object-cover object-top lg:object-center"
          onError={(e) => {
            e.currentTarget.src = "/images/login.jpeg";
          }}
        />
        {/* Overlay tipis agar transisi ke form lebih soft */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      {/* KANAN/BAWAH: KOTAK FORM LOGIN */}
      <motion.div 
        initial={{ opacity: 1, x: isMobile ? 0 : 30, y: isMobile ? 30 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[50%] min-h-[70vh] lg:min-h-screen mt-[30vh] lg:mt-0 bg-[#E8F4F1] rounded-t-[3rem] lg:rounded-none lg:rounded-l-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] lg:shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center p-6 sm:p-14 relative z-10"
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md py-8"
        >
          
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <img src="/logo/logo.png" alt="diBISAlitas" className="w-24 h-24 sm:w-28 sm:h-28 object-contain bg-white rounded-xl neo-flat" />
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-3">Selamat Datang!</h2>
            <p className="text-slate-500 font-bold mt-2">Masuk ke Portal Admin</p>
          </motion.div>

          <AnimatePresence>
            {notice && !error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex items-start gap-3 p-4 neo-pressed border-none text-slate-600 rounded-2xl text-sm font-bold overflow-hidden"
              >
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#00B894]" />
                <p>{notice}</p>
              </motion.div>
            )}
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex items-start gap-3 p-4 neo-pressed border-none text-rose-500 rounded-2xl text-sm font-bold overflow-hidden"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-7">
            
            <div>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 neo-pressed-input text-sm font-bold text-slate-700 placeholder:text-slate-400 bg-[#E8F4F1] rounded-[2rem] outline-none focus:ring-2 focus:ring-[#00B894]/30"
                  placeholder="Alamat Email"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-6 pr-12 py-4 neo-pressed-input text-sm font-bold text-slate-700 placeholder:text-slate-400 bg-[#E8F4F1] rounded-[2rem] outline-none focus:ring-2 focus:ring-[#00B894]/30"
                  placeholder="Kata Sandi"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-3 text-right">
                <a href="#" className="text-xs font-bold text-slate-500 hover:text-[#00B894] mr-4 transition-colors">
                  Lupa Kata Sandi?
                </a>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`neo-flat w-full py-4 mt-8 rounded-[2rem] font-extrabold text-[#00B894] text-lg transition-all flex items-center justify-center gap-2 border-none ${
                isLoading ? "opacity-60 cursor-not-allowed" : "hover:text-[#00a383]"
              }`}
            >
              {isLoading && <Activity className="w-4 h-4 animate-spin" />}
              Log In
            </motion.button>

            {/* Quick Demo Access Button */}
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.sessionStorage.setItem("dibisalitas_admin_demo_mode", "true");
                  }
                  router.push("/admin/dashboard?demo=true");
                }}
                className="text-xs font-extrabold text-[#00B894] hover:text-[#00a383] underline transition-colors"
              >
                Masuk sebagai Admin Demo (Mode Tamu)
              </button>
            </div>
          </motion.form>
          
        </motion.div>
      </motion.div>

    </div>
  );
}
