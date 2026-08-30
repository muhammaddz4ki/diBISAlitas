"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";
import {
  Smartphone,
  LayoutDashboard,
  ArrowRight,
  Zap,
  CheckCircle2,
  Unlock,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";

export default function DemoHubPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-[#FDFEFE] dark:bg-black text-slate-800 dark:text-slate-100 selection:bg-[#1B9981]/20 transition-colors duration-300 overflow-hidden">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-10 px-4 sm:px-6 relative overflow-visible">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#1B9981]/15 via-[#00D4AA]/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B9981]/10 dark:bg-[#1B9981]/20 border border-[#1B9981]/20 text-[#1B9981] dark:text-[#00D4AA] text-xs font-bold uppercase tracking-wider"
          >
            <Unlock className="w-3.5 h-3.5" /> Akses Demo Instan Tanpa Hambatan
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          >
            Pusat Demo Ekosistem <br />
            <span className="text-[#1B9981] dark:text-[#00D4AA]">diBISAlitas Platform</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Pilih pengalaman demo yang ingin Anda coba di bawah ini. Anda dapat mencoba aplikasi pengguna langsung tanpa perlu mendaftar atau masuk ke dashboard monitoring BiPANTAU.
          </motion.p>
        </div>
      </section>

      {/* Section 1: App Demo (Typography Left, Mobile Right) */}
      <section id="app-demo" className="relative py-16 md:py-24 overflow-visible bg-transparent text-slate-900 dark:text-white transition-colors duration-300 z-20">
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center min-h-[60vh]">
          
          {/* Left: Typography */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col space-y-6 lg:pr-8 justify-center order-2 lg:order-1"
          >
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-[#1B9981]/10 dark:bg-[#1B9981]/20 text-[#1B9981] dark:text-[#00D4AA] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> Mode Pengguna (Tamu Demo)
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                Tanpa Perlu Login
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight">
              Demo Aplikasi <br/>
              <em className="font-black italic text-[#1B9981] dark:text-[#00D4AA]">
                diBISAlitas
              </em>
            </h2>
            
            <p className="text-slate-500 dark:text-white/70 text-sm md:text-base leading-relaxed max-w-md font-light">
              Akses langsung ke seluruh fitur aplikasi (biSAPA penerjemah isyarat kamera, biBACA pembaca teks OCR, biJALAN navigasi spasial, biSAFE tombol darurat, dan biPINTAR modul belajar) dengan status akun tamu terverifikasi otomatis.
            </p>

            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Pintasan Modul Aplikasi:
              </div>
              <div className="grid grid-cols-2 gap-3 max-w-lg">
                {[
                  { name: "Dashboard Utama", href: "/app/dashboard?demo=true", color: "text-[#1B9981] dark:text-[#00D4AA]" },
                  { name: "BiSAPA AI Camera", href: "/app/bisapa", color: "text-emerald-600 dark:text-emerald-400" },
                  { name: "BiBACA OCR", href: "/app/bibaca", color: "text-emerald-600 dark:text-emerald-400" },
                  { name: "BiSAFE Panic", href: "/app/bisafe", color: "text-emerald-600 dark:text-emerald-400" },
                ].map((m, idx) => (
                  <Link
                    key={idx}
                    href={m.href}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 hover:border-[#1B9981]/50 dark:hover:border-[#1B9981]/50 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                  >
                    <span className={`text-xs font-bold ${m.color}`}>{m.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1B9981] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/app/dashboard?demo=true"
                className="inline-flex py-4 px-8 rounded-full bg-[#1B9981] text-white font-extrabold text-sm hover:bg-[#168C74] transition-all shadow-[0_0_20px_rgba(27,153,129,0.3)] hover:shadow-[0_0_30px_rgba(27,153,129,0.5)] items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buka Aplikasi Utama (Tanpa Login)</span>
              </Link>
            </div>
          </motion.div>

          {/* Right: 3D Mobile Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center lg:justify-end order-1 lg:order-2"
            style={{ perspective: "1200px" }}
          >
            <div className="absolute w-[40%] h-[60%] bg-[#1B9981]/10 dark:bg-[#00D4AA]/15 blur-[80px] rounded-full top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2" />
            
            <div 
              className="relative w-[270px] sm:w-[310px] lg:w-[340px] aspect-[9/18.5] bg-slate-200 dark:bg-[#0a0a0a] rounded-[1.75rem] md:rounded-[2.25rem] border-[6px] md:border-[8px] border-slate-300 dark:border-[#1a1a1a] overflow-hidden flex flex-col items-center justify-center group transform-gpu preserve-3d transition-colors duration-300"
              style={{
                transform: "rotateY(-18deg) rotateX(5deg) rotateZ(2deg)",
                boxShadow: "20px 30px 60px rgba(0,0,0,0.15), 8px 12px 25px rgba(0,0,0,0.08)",
                WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                WebkitMaskComposite: "destination-in",
                maskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                maskComposite: "intersect",
              }}
            >
              <img 
                src="/images/bisafe-screen1.jpg" 
                alt="App Interface" 
                className="absolute inset-0 w-full h-full object-cover" 
                onError={(e) => (e.currentTarget.style.display = 'none')} 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </section>


      {/* Section 2: BiPANTAU Dashboard Demo (Left Laptop, Right Typography) */}
      <section id="pantau-demo" className="relative py-16 md:py-24 overflow-visible bg-transparent text-slate-900 dark:text-white transition-colors duration-300 z-10 border-t border-slate-200 dark:border-white/5">
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center min-h-[70vh]">
          
          {/* Left: 3D Laptop Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center lg:justify-start"
            style={{ perspective: "1200px" }}
          >
            <div className="absolute w-[90%] h-[90%] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[100px] rounded-full top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2" />
            
            <div 
              className="relative w-full max-w-[720px]"
              style={{
                transform: "rotateY(18deg) rotateX(5deg) rotateZ(-2deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div 
                className="relative w-full aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden border-[5px] md:border-[10px] border-slate-300 dark:border-[#1a1a1a] bg-slate-200 dark:bg-[#0a0a0a] transition-colors duration-300"
                style={{
                  boxShadow: theme === 'dark'
                    ? "-30px 40px 80px rgba(0,0,0,0.7), -10px 15px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.03)"
                    : "-20px 30px 60px rgba(0,0,0,0.15), -8px 12px 25px rgba(0,0,0,0.08)",
                  WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0) 100%)",
                  WebkitMaskComposite: "destination-in",
                  maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0) 100%)",
                  maskComposite: "intersect",
                }}
              >
                <img 
                  src="/images/bipantau-laptop.jpg" 
                  alt="Dashboard Preview" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300`}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-emerald-500/20 dark:from-[#0a0e17] dark:via-[#111827] dark:to-emerald-500/30 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
              <div className="w-[60%] mx-auto h-[4px] md:h-[6px] bg-slate-300 dark:bg-[#1a1a1a] rounded-b-xl transition-colors duration-300" />
            </div>
          </motion.div>

          {/* Right: Typography */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="flex flex-col space-y-6 lg:pl-4 justify-center"
          >
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800/50">
                <LayoutDashboard className="w-4 h-4" /> Command Center Pemda
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live GIS
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight">
              Dashboard <br/>
              <em className="font-black italic text-emerald-600 dark:text-emerald-500">
                BiPANTAU Admin
              </em>
            </h2>
            
            <p className="text-slate-500 dark:text-white/70 text-sm md:text-base leading-relaxed max-w-md font-light">
              Pantau peta rintangan aksesibilitas kota, periksa sebaran laporan jalur tunanetra/kursi roda yang rusak, serta lakukan moderasi status rintangan secara real-time seperti yang digunakan pengelola kota.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Visualisasi pemetaan rintangan interaktif Leaflet GIS",
                "Manajemen tiket dan verifikasi laporan warga kota",
                "Riwayat audit status kelayakan fasilitas publik",
              ].map((hl, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 flex flex-wrap gap-4">
              <Link
                href="/admin/rintangan?demo=true"
                className="inline-flex py-4 px-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] items-center justify-center gap-2"
              >
                <span>Masuk Dashboard BiPANTAU</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      <FloatingAccessibility />
    </div>
  );
}
