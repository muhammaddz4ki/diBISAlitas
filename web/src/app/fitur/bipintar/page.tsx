"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";

// Reusable component for 2 overlapping mockups
const DualMockup = ({ img1, img2, label1, label2, reverse = false }: { img1: string, img2: string, label1: string, label2: string, reverse?: boolean }) => {
  return (
    <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] flex items-center justify-center" style={{ perspective: "1200px" }}>
      {/* Background Phone */}
      <div 
        className="absolute w-[180px] sm:w-[220px] lg:w-[260px] aspect-[9/18.5] bg-slate-200 dark:bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2rem] border-[5px] md:border-[8px] border-slate-300 dark:border-[#1a1a1a] overflow-hidden transform-gpu z-0"
        style={{
          transform: reverse 
            ? "rotateY(18deg) rotateX(5deg) rotateZ(-2deg) translateZ(-80px) translateX(65%)" 
            : "rotateY(-18deg) rotateX(5deg) rotateZ(2deg) translateZ(-80px) translateX(-65%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          WebkitMaskImage: reverse
            ? "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
          WebkitMaskComposite: "destination-in",
          maskImage: reverse
            ? "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
          maskComposite: "intersect",
        }}
      >
        <span className="absolute top-4 left-0 w-full text-center text-[10px] text-slate-600 dark:text-slate-400 z-10 font-medium">{label1}</span>
        <img src={img1} className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-orange-500/10 dark:from-[#0a0e17] dark:to-orange-500/20 -z-10" />
      </div>

      {/* Foreground Phone */}
      <div 
        className="absolute w-[200px] sm:w-[240px] lg:w-[290px] aspect-[9/18.5] bg-slate-200 dark:bg-[#0a0a0a] rounded-[1.75rem] md:rounded-[2.25rem] border-[6px] md:border-[8px] border-slate-300 dark:border-[#1a1a1a] overflow-hidden transform-gpu z-10"
        style={{
          transform: reverse
            ? "rotateY(18deg) rotateX(5deg) rotateZ(-2deg) translateZ(50px) translateX(-25%)"
            : "rotateY(-18deg) rotateX(5deg) rotateZ(2deg) translateZ(50px) translateX(25%)",
          boxShadow: reverse 
            ? "-20px 30px 60px rgba(0,0,0,0.25)"
            : "20px 30px 60px rgba(0,0,0,0.25)",
          WebkitMaskImage: reverse
            ? "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
          WebkitMaskComposite: "destination-in",
          maskImage: reverse
            ? "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
          maskComposite: "intersect",
        }}
      >
        <span className="absolute top-4 left-0 w-full text-center text-[10px] text-slate-600 dark:text-slate-400 z-10 font-medium">{label2}</span>
        <img src={img2} className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-orange-500/20 dark:from-[#0a0e17] dark:to-orange-500/30 -z-10" />
      </div>
    </div>
  );
};

// Reusable component for 1 mockup
const SingleMockup = ({ img, label, reverse = false }: { img: string, label: string, reverse?: boolean }) => {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ perspective: "1200px" }}>
      <div 
        className="relative w-[270px] sm:w-[310px] lg:w-[340px] aspect-[9/18.5] mx-auto bg-slate-200 dark:bg-[#0a0a0a] rounded-[1.75rem] md:rounded-[2.25rem] border-[6px] md:border-[8px] border-slate-300 dark:border-[#1a1a1a] overflow-hidden flex flex-col items-center justify-center transform-gpu transition-colors duration-300"
        style={{
          transform: reverse 
            ? "rotateY(18deg) rotateX(5deg) rotateZ(-2deg)"
            : "rotateY(-18deg) rotateX(5deg) rotateZ(2deg)",
          boxShadow: reverse
            ? "-20px 30px 60px rgba(0,0,0,0.15), -8px 12px 25px rgba(0,0,0,0.08)"
            : "20px 30px 60px rgba(0,0,0,0.15), 8px 12px 25px rgba(0,0,0,0.08)",
          WebkitMaskImage: reverse
            ? "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
          WebkitMaskComposite: "destination-in",
          maskImage: reverse
            ? "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)"
            : "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
          maskComposite: "intersect",
        }}
      >
        <span className="text-slate-500 dark:text-slate-400 font-medium text-xs text-center px-4 absolute top-4 z-10">{label}</span>
        <img src={img} className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-orange-500/20 dark:from-[#0a0e17] dark:to-orange-500/30 -z-10" />
      </div>
    </div>
  );
};

// Reusable component for Laptop + Mobile mockup combo
const LaptopAndMobileMockup = ({ laptopImg, mobileImg, label1, label2 }: { laptopImg: string, mobileImg: string, label1: string, label2: string }) => {
  return (
    <div className="relative w-full flex items-center justify-center pt-8 pb-16" style={{ perspective: "1500px" }}>
      {/* Laptop */}
      <div 
        className="relative w-[85%] sm:w-[80%] md:w-[75%] max-w-4xl aspect-[16/10] bg-slate-200 dark:bg-[#0a0a0a] rounded-xl md:rounded-2xl border-[6px] md:border-[12px] border-slate-300 dark:border-[#1a1a1a] border-b-[24px] md:border-b-[40px] overflow-hidden transform-gpu shadow-2xl z-0"
        style={{ transform: "rotateX(5deg) translateY(-10px) translateX(-5%)" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 md:w-16 md:h-3 bg-slate-800 dark:bg-black rounded-b-lg flex items-center justify-center z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-white/20" />
        </div>
        <span className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-600 font-medium text-xs md:text-sm text-center px-4">{label1}</span>
        <img src={laptopImg} className="absolute inset-0 w-full h-full object-cover z-10" onError={(e) => (e.currentTarget.style.display = 'none')} />
      </div>

      {/* Mobile */}
      <div 
        className="absolute w-[120px] sm:w-[150px] md:w-[180px] lg:w-[220px] aspect-[9/18.5] bg-slate-200 dark:bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2rem] border-[5px] md:border-[8px] border-slate-300 dark:border-[#1a1a1a] overflow-hidden transform-gpu z-10 bottom-0 right-[5%] sm:right-[10%] md:right-[15%]"
        style={{
          transform: "rotateY(-15deg) rotateX(10deg) translateZ(60px)",
          boxShadow: "-20px 30px 50px rgba(0,0,0,0.4)",
                  WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  WebkitMaskComposite: "destination-in",
                  maskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  maskComposite: "intersect"
        }}
      >
        <span className="absolute top-4 left-0 w-full text-center text-[8px] sm:text-[10px] text-slate-600 dark:text-slate-400 z-10 font-medium px-2">{label2}</span>
        <img src={mobileImg} className="absolute inset-0 w-full h-full object-cover z-10" onError={(e) => (e.currentTarget.style.display = 'none')} />
      </div>
    </div>
  );
};

export default function BiPintarDetailPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-200 selection:bg-orange-500/20">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-visible">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[200px]  bg-orange-500/10 dark:bg-orange-500/20  blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[60vh]">
            {/* Left: Info */}
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" /> Gamified E-Learning BISINDO & Hijaiyah
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                BiPINTAR: Belajar <br />
                <span className="text-orange-600 dark:text-orange-500">Bahasa Isyarat</span> Sangat Seru
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-light">
                BiPINTAR menghadirkan pengalaman belajar bahasa isyarat melalui kecerdasan buatan. Dilengkapi deteksi gestur tangan langsung dari kamera, tantangan interaktif, kamus komprehensif, dan papan peringkat kompetitif.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/app/bipintar"
                  className="px-8 py-4 rounded-full bg-orange-600 text-white font-extrabold text-sm hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Mulai Belajar Sekarang
                </Link>
                <Link
                  href="/demo"
                  className="px-8 py-4 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white font-bold text-sm hover:bg-slate-300 dark:hover:bg-white/20 transition-all border border-transparent dark:border-white/10"
                >
                  Jelajahi Modul
                </Link>
              </div>
            </div>

            {/* Right: Video Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 flex justify-center relative z-10" 
            >
              <SingleMockup img="" label="" />
              {/* Inject video over the static img in the single mockup specifically for hero */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: "1200px" }}>
                 <div 
                  className="relative w-[270px] sm:w-[310px] lg:w-[340px] aspect-[9/18.5] rounded-[1.75rem] md:rounded-[2.25rem] overflow-hidden transform-gpu"
                  style={{ 
                    transform: "rotateY(-18deg) rotateX(5deg) rotateZ(2deg)",
                    WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                    WebkitMaskComposite: "destination-in",
                    maskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                    maskComposite: "intersect"
                  }}
                 >
                    <video
                      src="/video/bipintar.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 1: Edukasi Bahasa Isyarat AI */}
      <section className="py-16 md:py-24 px-4 sm:px-6 overflow-visible relative z-10 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center min-h-[60vh]">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1 relative"
            >
              <div className="absolute w-[40%] h-[60%]  bg-orange-500/10 dark:bg-orange-500/15  blur-[70px] rounded-full top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2" />
              <DualMockup 
                img1="/images/bipintar-kamera-bisindo.jpg" 
                img2="/images/bipintar-kamera-hijaiyah.jpg" 
                label1="Kamera AI - BISINDO" 
                label2="Kamera AI - Hijaiyah" 
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="order-1 lg:order-2 flex flex-col space-y-5 lg:pl-4 justify-center"
            >
              <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
                Pendeteksi Gestur Pintar:
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                Kamera Edukasi <br />
                <em className="font-black italic text-orange-600 dark:text-orange-500">
                  berbasis AI real-time.
                </em>
              </h2>
              <p className="text-slate-500 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
                Praktikkan langsung isyarat tangan Anda di depan kamera. Kecerdasan buatan kami akan langsung membaca gestur dan memunculkan pemberitahuan karakter apa yang sedang Anda peragakan—tersedia untuk modul alfabet BISINDO maupun isyarat huruf Hijaiyah!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Tantangan & Leaderboard */}
      <section className="py-16 md:py-24 px-4 sm:px-6 overflow-visible relative z-10 bg-white/40 dark:bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-8 items-center min-h-[60vh]">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="flex flex-col space-y-5 lg:pr-4 justify-center"
            >
              <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
                Gamifikasi Interaktif:
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                Tantangan &amp; <br />
                <em className="font-black italic text-orange-600 dark:text-orange-500">
                  Papan Peringkat.
                </em>
              </h2>
              <p className="text-slate-500 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
                Uji pengetahuan Anda melalui kuis tebak isyarat yang menantang. Kumpulkan skor tertinggi, pertahankan *streak* belajar harian, dan bersainglah dengan pembelajar lain di Leaderboard nasional untuk menjadi yang terbaik.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute w-[40%] h-[60%]  bg-orange-500/10 dark:bg-orange-500/15  blur-[70px] rounded-full top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2" />
              <DualMockup 
                img1="/images/bipintar-tantangan.jpg" 
                img2="/images/bipintar-leaderboard.jpg" 
                label1="Tantangan Kuis" 
                label2="Papan Peringkat" 
                reverse={true}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Kamus Isyarat */}
      <section className="py-16 md:py-24 px-4 sm:px-6 overflow-visible relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center min-h-[60vh]">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1 relative"
            >
              <div className="absolute w-[40%] h-[60%]  bg-orange-500/10 dark:bg-orange-500/15  blur-[70px] rounded-full top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2" />
              <DualMockup 
                img1="/images/bipintar-kamus1.jpg" 
                img2="/images/bipintar-kamus2.jpg" 
                label1="Kamus Isyarat 1" 
                label2="Kamus Isyarat 2" 
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="order-1 lg:order-2 flex flex-col space-y-5 lg:pl-4 justify-center"
            >
              <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
                Pustaka Referensi:
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                Kamus Isyarat <br />
                <em className="font-black italic text-orange-600 dark:text-orange-500">
                  dengan animasi GIF.
                </em>
              </h2>
              <p className="text-slate-500 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
                Butuh referensi cepat? Buka modul kamus isyarat komprehensif yang kami sediakan. Setiap huruf atau kosakata dilengkapi dengan ilustrasi dan gambar bergerak (GIF) animasi yang jelas untuk menuntun gerakan tangan Anda.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Statistik Belajar */}
      <section className="py-16 md:py-24 px-4 sm:px-6 overflow-visible relative z-10 bg-white/40 dark:bg-transparent border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-8 items-center min-h-[60vh]">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="flex flex-col space-y-5 lg:pr-4 justify-center"
            >
              <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
                Pantau Perkembangan:
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                Statistik Belajar <br />
                <em className="font-black italic text-orange-600 dark:text-orange-500">
                  &amp; progres kosakata.
                </em>
              </h2>
              <p className="text-slate-500 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
                Pantau terus persentase penguasaan kosa kata Anda. Sistem akan mencatat sejauh mana Anda menyelesaikan modul, huruf mana yang sudah dikuasai, dan metrik pembelajaran lainnya agar Anda termotivasi!
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute w-[40%] h-[60%]  bg-orange-500/10 dark:bg-orange-500/15  blur-[70px] rounded-full top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2" />
              <SingleMockup 
                img="/images/bipintar-statistik.jpg" 
                label="Statistik Belajar" 
                reverse={true}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5: Materi & Pelatihan */}
      <section className="py-16 md:py-32 px-4 sm:px-6 overflow-visible relative z-10 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
              Modul Pelatihan Admin:
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
              Materi &amp; Jadwal <br />
              <em className="font-black italic text-orange-600 dark:text-orange-500">
                terintegrasi di satu platform.
              </em>
            </h2>
            <p className="text-slate-500 dark:text-white/70 text-sm md:text-base leading-relaxed font-light mx-auto max-w-2xl">
              Admin dan relawan pengajar dapat dengan mudah menambahkan jadwal pelatihan bahasa isyarat harian beserta link video pendukung melalui *dashboard* web di laptop. Pengguna lalu bisa mengakses seluruh materi dan jadwal secara praktis melalui *smartphone* mereka.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center relative z-10 w-full"
          >
            <div className="absolute w-[80%] h-[80%] bg-orange-500/15 dark:bg-orange-500/20 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <LaptopAndMobileMockup 
              laptopImg="/images/bipintar-pelatihan-admin.jpg" 
              mobileImg="/images/bipintar-pelatihan-mobile.jpg" 
              label1="Input Admin (Web)" 
              label2="Tampilan Pengguna" 
            />
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1]">
            Jadilah Jagoan Bahasa Isyarat
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
            Bergabunglah dengan ribuan pembelajar lain dan rasakan serunya menaklukkan tantangan bahasa isyarat di BiPINTAR.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/app/bipintar"
              className="px-8 py-4 rounded-full bg-orange-600 text-white font-extrabold text-sm hover:bg-orange-700 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 transition-all"
            >
              Buka BiPINTAR
            </Link>
            <Link
              href="/fitur"
              className="px-8 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              Eksplorasi Fitur Lain
            </Link>
          </div>
        </div>
      </section>

      <FloatingAccessibility />
    </div>
  );
}
