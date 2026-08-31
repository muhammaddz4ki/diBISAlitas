"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  ShieldAlert,
  MapPin,
  MessageCircle,
  BookOpen,
  Gamepad2,
  Navigation,
  Layers
} from "lucide-react";
import Navbar from "@/components/Navbar";

type FeatureKey = "bisafe" | "bipantau" | "bisapa" | "bibaca" | "bipintar" | "bijalan";

const DETAILED_FEATURES = [
  {
    key: "bisafe" as FeatureKey,
    slug: "bisafe",
    title: "BiSAFE",
    icon: ShieldAlert,
    badge: "Sistem Darurat Cerdas",
    titlePart1: "BiSAFE: Perlindungan",
    titleHighlight: "Satu Sentuhan",
    titlePart2: "Tanpa Jeda",
    description:
      "BiSAFE dirancang sebagai garis pertahanan pertama bagi penyandang disabilitas saat menghadapi kondisi krisis, ancaman fisik, kecelakaan, atau disorientasi spasial di ruang publik.",
    videoSrc: "/video/bisafe.mp4",
    bgGlow: "bg-rose-500/10 dark:bg-rose-600/30",
    badgeBg: "bg-rose-500/10 dark:bg-rose-600/20",
    badgeBorder: "border-rose-500/20 dark:border-rose-600/30",
    badgeText: "text-rose-600 dark:text-rose-600",
    highlightText: "text-rose-600 dark:text-rose-600",
    buttonBg: "bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800",
    buttonShadow: "shadow-rose-600/30 hover:shadow-rose-600/50",
    indicatorColor: "bg-rose-600",
    tabActiveBg: "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
    tabInactiveBg: "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-rose-600/50",
    href: "/fitur/bisafe",
  },
  {
    key: "bipantau" as FeatureKey,
    slug: "bipantau",
    title: "BiPANTAU",
    icon: MapPin,
    badge: "Smart City Command Center",
    titlePart1: "BiPANTAU: Monitoring",
    titleHighlight: "Rintangan Kota",
    titlePart2: "Real-Time",
    description:
      "Pusat kendali dan dasbor analitik berbasis web untuk memetakan jalur ramah disabilitas, mendeteksi rintangan jalan rusak atau guiding block terhalang secara cepat dan transparan.",
    videoSrc: "/video/peta.mp4",
    bgGlow: "bg-[#1B9981]/10 dark:bg-[#1B9981]/30",
    badgeBg: "bg-[#1B9981]/10 dark:bg-[#1B9981]/30",
    badgeBorder: "border-[#1B9981]/20 dark:border-[#1B9981]/40",
    badgeText: "text-[#1B9981] dark:text-[#00D4AA]",
    highlightText: "text-[#1B9981] dark:text-[#00D4AA]",
    buttonBg: "bg-[#1B9981] hover:bg-[#168C74]",
    buttonShadow: "shadow-[#1B9981]/30 hover:shadow-[#1B9981]/50",
    indicatorColor: "bg-[#1B9981]",
    tabActiveBg: "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
    tabInactiveBg: "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#1B9981]/50",
    href: "/fitur/bipantau",
  },
  {
    key: "bisapa" as FeatureKey,
    slug: "bisapa",
    title: "BiSAPA",
    icon: MessageCircle,
    badge: "Komunikasi Dua Arah AI",
    titlePart1: "BiSAPA: Penerjemah",
    titleHighlight: "Bahasa Isyarat",
    titlePart2: "& Web Speech",
    description:
      "Menghilangkan sekat komunikasi antara Tunarungu dan masyarakat umum. Memanfaatkan Computer Vision on-device (ONNX) untuk membaca gestur tangan BISINDO secara real-time ke teks/audio.",
    videoSrc: "/video/bisapa.mp4",
    bgGlow: "bg-amber-500/10 dark:bg-amber-600/30",
    badgeBg: "bg-amber-500/10 dark:bg-amber-900/30",
    badgeBorder: "border-amber-500/20 dark:border-amber-700/40",
    badgeText: "text-amber-600 dark:text-amber-500",
    highlightText: "text-amber-600 dark:text-amber-500",
    buttonBg: "bg-amber-500 hover:bg-amber-600",
    buttonShadow: "shadow-amber-500/30 hover:shadow-amber-500/50",
    indicatorColor: "bg-amber-500",
    tabActiveBg: "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
    tabInactiveBg: "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-500/50",
    href: "/fitur/bisapa",
  },
  {
    key: "bibaca" as FeatureKey,
    slug: "bibaca",
    title: "BiBACA",
    icon: BookOpen,
    badge: "Smart Document OCR",
    titlePart1: "BiBACA: Pengubah Teks",
    titleHighlight: "Menjadi Suara",
    titlePart2: "Natural",
    description:
      "Memberikan kemandirian membaca bagi Tunanetra dan penyandang Disleksia. Cukup arahkan kamera ke buku atau papan petunjuk jalan, sistem akan membacakannya secara otomatis.",
    videoSrc: "/video/bibaca.mp4",
    bgGlow: "bg-purple-600/10 dark:bg-purple-700/30",
    badgeBg: "bg-purple-600/10 dark:bg-purple-900/30",
    badgeBorder: "border-purple-600/20 dark:border-purple-700/40",
    badgeText: "text-purple-600 dark:text-purple-400",
    highlightText: "text-purple-600 dark:text-purple-500",
    buttonBg: "bg-purple-600 hover:bg-purple-700",
    buttonShadow: "shadow-purple-600/30 hover:shadow-purple-600/50",
    indicatorColor: "bg-purple-500",
    tabActiveBg: "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
    tabInactiveBg: "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-purple-500/50",
    href: "/fitur/bibaca",
  },
  {
    key: "bipintar" as FeatureKey,
    slug: "bipintar",
    title: "BiPINTAR",
    icon: Gamepad2,
    badge: "Gamified E-Learning",
    titlePart1: "BiPINTAR: Akademi",
    titleHighlight: "Isyarat & Gamifikasi",
    titlePart2: "Inklusif",
    description:
      "Platform belajar interaktif dengan animasi gestur GIF, kuis gamifikasi, sistem EXP, dan lencana prestasi. Membantu siapa saja menguasai bahasa isyarat BISINDO secara menyenangkan.",
    videoSrc: "/video/bipintar.mp4",
    bgGlow: "bg-emerald-600/10 dark:bg-emerald-700/30",
    badgeBg: "bg-emerald-600/10 dark:bg-emerald-900/30",
    badgeBorder: "border-emerald-600/20 dark:border-emerald-700/40",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    highlightText: "text-emerald-600 dark:text-emerald-500",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700",
    buttonShadow: "shadow-emerald-600/30 hover:shadow-emerald-600/50",
    indicatorColor: "bg-emerald-500",
    tabActiveBg: "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
    tabInactiveBg: "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50",
    href: "/fitur/bipintar",
  },
  {
    key: "bijalan" as FeatureKey,
    slug: "bijalan",
    title: "BiJALAN",
    icon: Navigation,
    badge: "Spatial Vision & Haptic",
    titlePart1: "BiJALAN: Navigasi Spasial",
    titleHighlight: "& Deteksi",
    titlePart2: "Kamera",
    description:
      "Mata kedua bagi Tunanetra saat berjalan di trotoar. Kamera smartphone mendeteksi rintangan di depan pengguna, lalu memberikan peringatan audio dan getaran haptic terarah.",
    videoSrc: "/video/bijalan.mp4",
    bgGlow: "bg-sky-600/10 dark:bg-sky-700/30",
    badgeBg: "bg-sky-600/10 dark:bg-sky-900/30",
    badgeBorder: "border-sky-600/20 dark:border-sky-700/40",
    badgeText: "text-sky-600 dark:text-sky-400",
    highlightText: "text-sky-600 dark:text-sky-500",
    buttonBg: "bg-sky-600 hover:bg-sky-700",
    buttonShadow: "shadow-sky-600/30 hover:shadow-sky-600/50",
    indicatorColor: "bg-sky-500",
    tabActiveBg: "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
    tabInactiveBg: "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-sky-500/50",
    href: "/fitur/bijalan",
  },
];

export default function FiturOverviewPage() {
  const [selected, setSelected] = useState<FeatureKey>("bisafe");
  const current = DETAILED_FEATURES.find((f) => f.key === selected) || DETAILED_FEATURES[0];

  return (
    <div className="min-h-screen bg-[#FDFEFE] dark:bg-black text-slate-800 dark:text-slate-100 selection:bg-[#1B9981]/20 transition-colors duration-300">
      <Navbar />

      {/* Dynamic Background Glow tied to selected feature */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className={`absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] ${current.bgGlow} blur-[100px] rounded-full`}
          />
        </AnimatePresence>
      </div>

      {/* Hero Header */}
      <section className="pt-32 pb-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B9981]/10 dark:bg-[#1B9981]/20 border border-[#1B9981]/20 text-[#1B9981] dark:text-[#00D4AA] text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Teknologi Aksesibilitas Terintegrasi
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          >
            6 Pilar Ekosistem Cerdas <br />
            <span className="text-[#1B9981] dark:text-[#00D4AA]">diBISAlitas AI</span>
          </motion.h1>
        </div>
      </section>

      {/* Feature Tabs Nav */}
      <section className="px-4 sm:px-6 relative z-20 pb-12">
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {DETAILED_FEATURES.map((feat) => {
            const isActive = selected === feat.key;
            return (
              <button
                key={feat.key}
                onClick={() => setSelected(feat.key)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                  isActive 
                    ? feat.tabActiveBg + " border-transparent shadow-lg scale-105" 
                    : feat.tabInactiveBg + " hover:scale-105 shadow-sm hover:shadow-md"
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${feat.indicatorColor}`} />
                {feat.title}
              </button>
            );
          })}
        </div>
      </section>

      {/* Feature Content (Matches bisafe/page.tsx hero exactly) */}
      <section className="pb-24 px-4 sm:px-6 relative z-10 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left: Info */}
              <div className="lg:col-span-7 space-y-6">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${current.badgeBg} border ${current.badgeBorder} ${current.badgeText} text-xs font-bold uppercase tracking-wider`}>
                  <current.icon className="w-4 h-4" /> {current.badge}
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  {current.titlePart1} <br className="hidden md:block" />
                  <span className={current.highlightText}>{current.titleHighlight}</span> {current.titlePart2}
                </h2>

                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                  {current.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/demo"
                    className={`px-7 py-3.5 rounded-full ${current.buttonBg} text-white font-extrabold text-sm transition-all shadow-lg ${current.buttonShadow} flex items-center gap-2`}
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    Coba Demo {current.title}
                  </Link>
                  <Link
                    href={current.href}
                    className="px-7 py-3.5 rounded-full bg-white dark:bg-[#1a1a1a] border-2 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-extrabold text-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm flex items-center gap-2"
                  >
                    Detail Fitur
                  </Link>
                </div>
              </div>

              {/* Right: Video Mockup */}
              <div className="lg:col-span-5 flex justify-center" style={{ perspective: "1200px" }}>
                <div 
                  className="relative w-[270px] sm:w-[310px] lg:w-[340px] aspect-[9/18.5] mx-auto bg-slate-200 dark:bg-[#0a0a0a] rounded-[1.75rem] md:rounded-[2.25rem] border-[6px] md:border-[8px] border-slate-300 dark:border-[#1a1a1a] overflow-hidden flex flex-col items-center justify-center group transform-gpu preserve-3d transition-colors duration-300"
                  style={{
                    transform: "rotateY(-18deg) rotateX(5deg) rotateZ(2deg)",
                    boxShadow: "20px 30px 60px rgba(0,0,0,0.15), 8px 12px 25px rgba(0,0,0,0.08)",
                    WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                    WebkitMaskComposite: "destination-in",
                    maskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                    maskComposite: "intersect",
                  }}
                >
                  <video
                    key={current.videoSrc}
                    src={current.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Ecosystem Synergy Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto bg-slate-900 dark:bg-[#0F172A] rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-white relative overflow-hidden border border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#1B9981]/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center order-2 lg:order-1" style={{ perspective: "1200px" }}>
              <div 
                className="relative w-[240px] sm:w-[280px] lg:w-[320px] aspect-[9/18.5] mx-auto bg-slate-800 rounded-[1.75rem] md:rounded-[2.25rem] border-[6px] md:border-[8px] border-slate-700 overflow-hidden flex flex-col items-center justify-center group transform-gpu preserve-3d transition-colors duration-300"
                style={{
                  transform: "rotateY(18deg) rotateX(5deg) rotateZ(-2deg)",
                  boxShadow: "-20px 30px 60px rgba(0,0,0,0.4), -8px 12px 25px rgba(0,0,0,0.2)",
                  WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  WebkitMaskComposite: "destination-in",
                  maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  maskComposite: "intersect",
                }}
              >
                <video
                  src="/video/peta.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Right: Info */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#00D4AA] text-xs font-bold uppercase tracking-wider border border-white/10">
                <Layers className="w-3.5 h-3.5" /> Sinergi Ekosistem
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-white">
                Semua Fitur Saling Terhubung <br />
                Dalam Satu Sinkronisasi Real-Time
              </h2>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
                Ketika pengguna mendeteksi rintangan jalan dengan <strong>BiJALAN</strong> atau menekan tombol darurat <strong>BiSAFE</strong>, data langsung tersinkronisasi ke <strong>BiPANTAU</strong> untuk ditindaklanjuti relawan dan pengelola kota. Semua berjalan tanpa batas antar perangkat.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/demo"
                  className="px-7 py-3.5 rounded-full bg-[#00D4AA] text-slate-950 font-extrabold text-sm hover:bg-[#00D4AA]/90 transition-all shadow-[0_0_20px_rgba(0,212,170,0.3)] flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Jelajahi Demo Hub
                </Link>
                <Link
                  href="/app/login"
                  className="px-7 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all"
                >
                  Daftar Akun Pengguna
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
