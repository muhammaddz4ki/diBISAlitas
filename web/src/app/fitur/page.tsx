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
  Layers,
  ArrowRight
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
    videoSrc: "/video/bisafe.gif",
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
    videoSrc: "/video/peta.gif",
    bgGlow: "bg-[#2a9d8f]/10 dark:bg-[#2a9d8f]/30",
    badgeBg: "bg-[#2a9d8f]/10 dark:bg-[#2a9d8f]/30",
    badgeBorder: "border-[#2a9d8f]/20 dark:border-[#2a9d8f]/40",
    badgeText: "text-[#2a9d8f] dark:text-[#4fd1c5]",
    highlightText: "text-[#2a9d8f] dark:text-[#4fd1c5]",
    buttonBg: "bg-[#2a9d8f] hover:bg-[#1e7b6d]",
    buttonShadow: "shadow-[#2a9d8f]/30 hover:shadow-[#2a9d8f]/50",
    indicatorColor: "bg-[#2a9d8f]",
    tabActiveBg: "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
    tabInactiveBg: "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#2a9d8f]/50",
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
    videoSrc: "/video/bisapa.gif",
    bgGlow: "bg-blue-500/10 dark:bg-blue-600/30",
    badgeBg: "bg-blue-500/10 dark:bg-blue-900/30",
    badgeBorder: "border-blue-500/20 dark:border-blue-700/40",
    badgeText: "text-blue-600 dark:text-blue-500",
    highlightText: "text-blue-600 dark:text-blue-500",
    buttonBg: "bg-blue-500 hover:bg-blue-600",
    buttonShadow: "shadow-blue-500/30 hover:shadow-blue-500/50",
    indicatorColor: "bg-blue-500",
    tabActiveBg: "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
    tabInactiveBg: "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-500/50",
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
    videoSrc: "/video/bibaca.gif",
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
    videoSrc: "/video/bipintar.gif",
    bgGlow: "bg-orange-600/10 dark:bg-orange-700/30",
    badgeBg: "bg-orange-600/10 dark:bg-orange-900/30",
    badgeBorder: "border-orange-600/20 dark:border-orange-700/40",
    badgeText: "text-orange-600 dark:text-orange-400",
    highlightText: "text-orange-600 dark:text-orange-500",
    buttonBg: "bg-orange-600 hover:bg-orange-700",
    buttonShadow: "shadow-orange-600/30 hover:shadow-orange-600/50",
    indicatorColor: "bg-orange-500",
    tabActiveBg: "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
    tabInactiveBg: "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-orange-500/50",
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
    videoSrc: "/video/bijalan.gif",
    bgGlow: "bg-[#2a9d8f]/10 dark:bg-[#2a9d8f]/30",
    badgeBg: "bg-[#2a9d8f]/10 dark:bg-[#2a9d8f]/30",
    badgeBorder: "border-[#2a9d8f]/20 dark:border-[#2a9d8f]/40",
    badgeText: "text-[#2a9d8f] dark:text-[#4fd1c5]",
    highlightText: "text-[#2a9d8f] dark:text-[#4fd1c5]",
    buttonBg: "bg-[#2a9d8f] hover:bg-[#1e7b6d]",
    buttonShadow: "shadow-[#2a9d8f]/30 hover:shadow-[#2a9d8f]/50",
    indicatorColor: "bg-[#2a9d8f]",
    tabActiveBg: "bg-slate-900 dark:bg-white text-white dark:text-slate-900",
    tabInactiveBg: "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#2a9d8f]/50",
    href: "/fitur/bijalan",
  },
];

export default function FiturOverviewPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = DETAILED_FEATURES[activeIndex];
  const ActiveIcon = activeFeature.icon;

  const featureTheme = [
    { gradient: "from-rose-500 to-rose-700", textGradient: "from-rose-500 to-rose-700 dark:from-rose-400 dark:to-rose-300" },
    { gradient: "from-[#2a9d8f] to-[#1e7b6d]", textGradient: "from-[#2a9d8f] to-[#1e7b6d] dark:from-[#4fd1c5] dark:to-[#2a9d8f]" },
    { gradient: "from-blue-500 to-blue-700", textGradient: "from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-300" },
    { gradient: "from-purple-500 to-purple-700", textGradient: "from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-300" },
    { gradient: "from-orange-500 to-orange-700", textGradient: "from-orange-500 to-orange-700 dark:from-orange-400 dark:to-orange-300" },
    { gradient: "from-[#2a9d8f] to-[#1e7b6d]", textGradient: "from-[#2a9d8f] to-[#1e7b6d] dark:from-[#4fd1c5] dark:to-[#2a9d8f]" },
  ];

  const theme = featureTheme[activeIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-100 selection:bg-[#2a9d8f]/20 transition-colors duration-300">
      <Navbar />

      <section id="fitur-showcase" className="relative min-h-screen pt-20 flex items-center overflow-hidden transition-colors duration-300">
        {/* Dynamic Background Glow based on active pillar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.key + "-bg"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} dark:opacity-20 opacity-10`}
          />
        </AnimatePresence>
        
        {/* Radial blur background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full blur-[120px] bg-black/5 dark:bg-white/5 pointer-events-none" />

        <div className="max-w-[1100px] xl:max-w-[1200px] w-full mx-auto px-4 sm:px-6 relative z-10 h-full flex flex-col lg:grid lg:grid-cols-[1.1fr_1fr_1fr] gap-8 lg:gap-2 xl:gap-4 items-center justify-between py-12 lg:py-0">
          
          {/* LEFT COLUMN: Main Typography & Stats */}
          <div className="flex flex-col justify-center w-full mt-4 lg:mt-0 z-20 text-center lg:text-left items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-light leading-[1.15] tracking-tight text-slate-900 dark:text-white mb-8 lg:mb-10">
                {activeFeature.titlePart1} <br className="hidden lg:block" />
                <span className="font-semibold">{activeFeature.titleHighlight}</span> <br className="hidden lg:block"/> {activeFeature.titlePart2}
              </h2>
            </motion.div>

            {/* Stat Cards mimicking the left bottom cards in the reference */}
            <div className="flex gap-4">
              <motion.div
                key="stat1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] p-4 sm:p-5 flex flex-col items-center text-center w-[130px] sm:w-[150px] shadow-xl dark:shadow-none"
              >
                <h4 className={`text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${theme.textGradient}`}>
                  6+
                </h4>
                <p className="text-slate-800 dark:text-white/80 font-bold text-[10px] sm:text-xs uppercase tracking-wider mt-1 mb-2">PILAR CERDAS</p>
                <p className="text-slate-500 dark:text-white/40 text-[8px] sm:text-[9px] leading-relaxed line-clamp-3 font-medium">
                  Modul AI terintegrasi dalam satu platform ekosistem.
                </p>
              </motion.div>

              <motion.div
                key="stat2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] p-4 sm:p-5 flex flex-col items-center text-center w-[130px] sm:w-[150px] shadow-xl dark:shadow-none"
              >
                <h4 className={`text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${theme.textGradient}`}>
                  24/7
                </h4>
                <p className="text-slate-800 dark:text-white/80 font-bold text-[10px] sm:text-xs uppercase tracking-wider mt-1 mb-2">SINKRONISASI</p>
                <p className="text-slate-500 dark:text-white/40 text-[8px] sm:text-[9px] leading-relaxed line-clamp-3 font-medium">
                  Terhubung tanpa henti antara pengguna dan Command Center.
                </p>
              </motion.div>
            </div>
          </div>

          {/* CENTER COLUMN: 3D Phone Video Mockup */}
          <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] xl:h-[550px] flex justify-center items-center pointer-events-none z-10 my-4 lg:my-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.key + "-phone"}
                initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute z-20 w-[170px] h-[350px] sm:w-[200px] sm:h-[410px] lg:w-[230px] lg:h-[470px] xl:w-[250px] xl:h-[510px] rounded-[1.5rem] sm:rounded-[1.75rem] lg:rounded-[2rem] bg-black border-[6px] lg:border-[8px] border-slate-800 dark:border-[#1f2022] shadow-[0_30px_60px_rgba(0,0,0,0.3),inset_0_0_20px_rgba(255,255,255,0.1)] overflow-hidden"
                style={{ transformPerspective: 1000 }}
              >
                {/* iPhone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[16px] lg:h-[20px] bg-slate-800 dark:bg-[#1f2022] rounded-b-[10px] lg:rounded-b-[14px] z-30 flex justify-center items-center">
                  <div className="w-[30%] h-[3px] lg:h-[4px] bg-white/10 rounded-full mt-0.5 lg:mt-1" />
                </div>
                
                <img
                  key={activeFeature.videoSrc}
                  src={activeFeature.videoSrc}
                  alt={activeFeature.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Screen Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent z-40 pointer-events-none mix-blend-overlay" />
              </motion.div>
            </AnimatePresence>

            {/* Central Intense Glow */}
            <AnimatePresence mode="wait">
               <motion.div
                 key={activeFeature.key + "-centerglow"}
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.5 }}
                 transition={{ duration: 0.8 }}
                 className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[350px] sm:w-[300px] sm:h-[400px] lg:w-[350px] lg:h-[500px] bg-gradient-to-br ${theme.gradient} blur-[80px] sm:blur-[100px] opacity-40 dark:opacity-60 z-0 rounded-full`}
               />
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Feature Details Card & Selector */}
          <div className="flex flex-col items-center lg:items-end justify-center w-full z-20 gap-3 lg:gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.key + "-detailcard"}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] lg:rounded-[2rem] p-5 lg:p-7 flex flex-col items-center text-center w-full max-w-[280px] lg:max-w-[300px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] mx-auto lg:mr-0"
              >
                {/* Floating icon at the top of the card */}
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-[1.25rem] lg:rounded-[1.75rem] bg-white dark:bg-[#050505] p-1 -mt-12 lg:-mt-16 mb-3 lg:mb-4 shadow-xl border border-slate-100 dark:border-white/5">
                   <div className={`w-full h-full rounded-xl lg:rounded-[1.25rem] bg-gradient-to-br ${theme.gradient} flex items-center justify-center relative shadow-inner`}>
                      <ActiveIcon className="w-7 h-7 lg:w-9 lg:h-9 text-white drop-shadow-md" />
                   </div>
                </div>

                <h3 className={`text-xl lg:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r ${theme.textGradient} mb-1`}>
                  {activeFeature.title}
                </h3>
                


                <h4 className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 mb-2">
                  {activeFeature.badge}
                </h4>
                
                <p className="text-slate-600 dark:text-white/60 text-xs sm:text-[13px] leading-relaxed font-medium mb-6 line-clamp-3 lg:line-clamp-4">
                  {activeFeature.description}
                </p>

                <Link
                  href={activeFeature.href}
                  className="w-full py-3 lg:py-3.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black text-[11px] lg:text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group shadow-md"
                >
                  Lihat Detail Fitur
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Mini Phones Selector Fixed Under Card */}
            <div className="flex gap-2 bg-white/70 dark:bg-black/40 backdrop-blur-md p-2 lg:p-2.5 rounded-[1.25rem] border border-slate-200 dark:border-white/10 w-full max-w-[280px] lg:max-w-[300px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] mx-auto lg:mr-0 z-30">
              {DETAILED_FEATURES.map((feat, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={feat.key + "-selector"}
                    onClick={() => setActiveIndex(i)}
                    className={`relative flex-1 aspect-[1/2.2] rounded-md lg:rounded-lg overflow-hidden transition-all duration-300 border-[1.5px] ${
                      isActive ? 'border-slate-800 dark:border-white scale-[1.03] shadow-md z-10' : 'border-transparent hover:border-slate-400 dark:hover:border-white/50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={feat.videoSrc}
                      alt={feat.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
                  </button>
                );
              })}
            </div>
          </div>

        </div>



      </section>
    </div>
  );
}
