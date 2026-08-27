"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";
import {
  ShieldAlert,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Navigation,
  Eye,
  Ear,
  Accessibility,
  Globe,
  Zap,
  BarChart,
  HeartHandshake,
  Users,
  ArrowRight,
  Smartphone,
  Shield,
  Brain,
  Wifi,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock,
  Play,
  Compass,
  Scan,
  Volume2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";
import InteractiveDeviceMockup, { FeatureKey } from "@/components/InteractiveDeviceMockup";

/* ============================================
   ANIMATION VARIANTS (Apple Fluid Spring)
============================================ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ============================================
   COUNTER HOOK
============================================ */
function useCounter(end: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, startCounting]);
  return count;
}

/* ============================================
   HERO SECTION (Apple Liquid Crystal Style)
============================================ */
function HeroSection() {
  const [activeHeroTab, setActiveHeroTab] = useState<FeatureKey>("bisafe");

  return (
    <section className="pt-32 md:pt-36 pb-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Liquid Mesh Gradient Orbs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-[#1B9981]/20 via-[#00D4AA]/15 to-sky-400/10 blur-[110px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-64 -left-32 w-[420px] h-[420px] bg-gradient-to-br from-[#00D4AA]/15 to-transparent blur-[90px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-80 -right-32 w-[420px] h-[420px] bg-gradient-to-bl from-teal-400/15 to-transparent blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Main Liquid Crystal Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative liquid-glass rounded-[2.75rem] md:rounded-[3.25rem] overflow-hidden p-6 sm:p-10 lg:p-14"
        >
          {/* Internal Specular Highlight Ring */}
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] border border-white/40 dark:border-white/10" />

          {/* Dot matrix texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 grid md:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-7">
              {/* Dynamic Island Inspired Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full liquid-pill text-slate-800 dark:text-slate-200 text-xs font-bold tracking-wide shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-[#1B9981] dark:bg-[#00D4AA] animate-pulse" />
                <span className="text-[#1B9981] dark:text-[#00D4AA] font-extrabold uppercase tracking-wider text-[11px]">
                  diBISAlitas AI
                </span>
                <span className="text-slate-300 dark:text-slate-600 font-light">|</span>
                <span>Ekosistem Cerdas Terintegrasi</span>
              </motion.div>

              {/* Main Apple Headline */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                  Aksesibilitas Cerdas, <br />
                  <span className="bg-gradient-to-r from-[#1B9981] via-[#00D4AA] to-sky-500 bg-clip-text text-transparent">
                    Kemandirian Tanpa Batas.
                  </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal pt-1">
                  Satu ekosistem berbasis kecerdasan buatan on-device dan integrasi Cloud untuk menghadirkan kemandirian penuh bagi Tunanetra, Tunarungu, dan Tunadaksa di Indonesia.
                </p>
              </motion.div>

              {/* Liquid Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap items-center gap-3.5 pt-1"
              >
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link
                    href="/demo"
                    className="px-7 py-4 rounded-full bg-gradient-to-r from-[#1B9981] to-[#00D4AA] text-white font-extrabold text-sm shadow-[0_10px_30px_rgba(27,153,129,0.35)] hover:shadow-[0_15px_40px_rgba(27,153,129,0.45)] transition-all flex items-center gap-2.5"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Coba Demo Gratis</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link
                    href="/fitur"
                    className="px-7 py-4 rounded-full liquid-pill text-slate-800 dark:text-slate-100 font-bold text-sm hover:bg-white/90 dark:hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-[#1B9981] dark:text-[#00D4AA]" />
                    <span>Jelajahi 6 Fitur</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Beneficiary Liquid Chips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.8 }}
                className="flex flex-wrap gap-2 pt-2"
              >
                {[
                  { label: "Tunanetra", icon: <Eye className="w-3.5 h-3.5 text-sky-500" /> },
                  { label: "Tunarungu", icon: <Ear className="w-3.5 h-3.5 text-amber-500" /> },
                  { label: "Tunadaksa", icon: <Accessibility className="w-3.5 h-3.5 text-rose-500" /> },
                  { label: "ONNX / YOLO Vision", icon: <Brain className="w-3.5 h-3.5 text-emerald-500" /> },
                  { label: "Cloud Sync", icon: <Wifi className="w-3.5 h-3.5 text-[#1B9981]" /> },
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-pill text-slate-700 dark:text-slate-200 text-xs font-semibold"
                  >
                    {item.icon}
                    {item.label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: Realistic iPhone Pro Device Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-5 flex justify-center"
            >
              <InteractiveDeviceMockup
                activeFeature={activeHeroTab}
                onSelectFeature={(k) => setActiveHeroTab(k)}
                interactive={true}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   PILLAR DATA (Liquid Crystal Stacked Scroll)
============================================ */
type Pillar = {
  key: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  target: string;
  href: string;
  gradient: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
};

const pillars: Pillar[] = [
  {
    key: "bisafe",
    number: "01",
    title: "BiSAFE",
    tagline: "Panic Button & Geolocation Broadcaster",
    description:
      "Satu sentuhan darurat yang langsung menyiarkan titik koordinat satelit presisi, membunyikan sirene alarm frekuensi tinggi, dan mengirimkan sinyal ke Command Center relawan.",
    icon: ShieldAlert,
    target: "Tunadaksa & Tunanetra",
    href: "/fitur/bisafe",
    gradient: "from-rose-600 via-rose-500 to-rose-700",
    accent: "text-rose-100",
    badgeBg: "bg-rose-500/20 border-rose-400/30",
    badgeText: "text-rose-200",
    glowColor: "rgba(244, 63, 94, 0.35)",
  },
  {
    key: "bipantau",
    number: "02",
    title: "BiPANTAU",
    tagline: "Smart City Command Center",
    description:
      "Dasbor pemetaan GIS dan moderasi rintangan kota untuk memonitor jalur ramah disabilitas dan merespons insiden secara real-time.",
    icon: BarChart,
    target: "Pemda & Relawan",
    href: "/fitur/bipantau",
    gradient: "from-[#168C74] via-[#1B9981] to-[#0A6B58]",
    accent: "text-[#8FEAD4]",
    badgeBg: "bg-[#00D4AA]/20 border-[#00D4AA]/30",
    badgeText: "text-[#00D4AA]",
    glowColor: "rgba(0, 212, 170, 0.35)",
  },
  {
    key: "bisapa",
    number: "03",
    title: "BiSAPA",
    tagline: "Penerjemah Isyarat AI Dua Arah",
    description:
      "Penerjemah bahasa isyarat BISINDO AI dua arah secara real-time dari gestur kamera ke teks dan suara.",
    icon: MessageCircle,
    target: "Tunarungu & Tunanetra",
    href: "/fitur/bisapa",
    gradient: "from-amber-600 via-amber-500 to-amber-700",
    accent: "text-amber-100",
    badgeBg: "bg-amber-500/20 border-amber-400/30",
    badgeText: "text-amber-200",
    glowColor: "rgba(245, 158, 11, 0.35)",
  },
  {
    key: "bibaca",
    number: "04",
    title: "BiBACA",
    tagline: "Smart OCR ke Audio",
    description:
      "Smart OCR yang memindai buku, papan petunjuk, dan dokumen cetak menjadi audio Bahasa Indonesia jernih.",
    icon: BookOpen,
    target: "Tunanetra & Disleksia",
    href: "/fitur/bibaca",
    gradient: "from-purple-700 via-purple-600 to-purple-800",
    accent: "text-purple-100",
    badgeBg: "bg-purple-500/20 border-purple-400/30",
    badgeText: "text-purple-200",
    glowColor: "rgba(168, 85, 247, 0.35)",
  },
  {
    key: "bipintar",
    number: "05",
    title: "BiPINTAR",
    tagline: "Gamifikasi Belajar Bahasa Isyarat",
    description:
      "Platform gamifikasi belajar bahasa isyarat BISINDO dan Isyarat Hijaiyah dengan kuis dan lencana prestasi.",
    icon: GraduationCap,
    target: "Pelajar & Komunitas",
    href: "/fitur/bipintar",
    gradient: "from-emerald-700 via-emerald-600 to-emerald-800",
    accent: "text-emerald-100",
    badgeBg: "bg-emerald-500/20 border-emerald-400/30",
    badgeText: "text-emerald-200",
    glowColor: "rgba(16, 185, 129, 0.35)",
  },
  {
    key: "bijalan",
    number: "06",
    title: "BiJALAN",
    tagline: "Spatial Vision & Haptic Guidance",
    description:
      "Mata kedua Tunanetra saat berjalan di trotoar. Mendeteksi tiang, lubang, tangga, dan kendaraan secara visual lalu memberikan umpan balik getaran haptic dan suara terarah.",
    icon: Navigation,
    target: "Tunanetra & Pejalan Kaki",
    href: "/fitur/bijalan",
    gradient: "from-sky-700 via-sky-600 to-sky-800",
    accent: "text-sky-100",
    badgeBg: "bg-sky-500/20 border-sky-400/30",
    badgeText: "text-sky-200",
    glowColor: "rgba(14, 165, 233, 0.35)",
  },
];

/* ============================================
   STACK PANEL (Liquid Glass Apple Card)
============================================ */
function StackPanel({ pillar, index }: { pillar: Pillar; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const Icon = pillar.icon;

  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: `${96 + index * 16}px`, zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className={`relative bg-gradient-to-br ${pillar.gradient} rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.28)] mb-8 border border-white/25`}
      >
        {/* Specular Top Border Glow */}
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]" />

        <div className="relative grid md:grid-cols-12 gap-8 lg:gap-14 p-8 sm:p-10 md:p-14 items-center min-h-[440px] md:min-h-[500px]">
          {/* Ambient Liquid Glow */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/10 blur-3xl rounded-full pointer-events-none" />

          {/* Left: Liquid Glass Icon Chamber */}
          <div className="md:col-span-5 flex items-center justify-center relative z-10">
            <div className="relative w-full max-w-[280px] aspect-square rounded-[2.25rem] bg-white/15 border border-white/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden">
              {/* Inner Specular Highlight */}
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]" />

              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
                  backgroundSize: "26px 26px",
                }}
              />
              <Icon className="w-20 h-20 md:w-24 md:h-24 text-white relative z-10 drop-shadow-md" strokeWidth={1.4} />
            </div>
          </div>

          {/* Right: Content */}
          <div className="md:col-span-7 space-y-4 text-white relative z-10">
            <div className="flex items-center gap-2.5">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] ${pillar.badgeBg} border ${pillar.badgeText}`}>
                Pilar {pillar.number} / 06
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/20 text-white">
                {pillar.target}
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-[2.65rem] font-black leading-tight tracking-tight">
              {pillar.title}
            </h3>
            <p className={`font-bold text-xs sm:text-sm uppercase tracking-wider ${pillar.accent}`}>
              {pillar.tagline}
            </p>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
              {pillar.description}
            </p>

            <div className="pt-2">
              <Link
                href={pillar.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-xs transition-all shadow-sm group backdrop-blur-md"
              >
                <span>Buka Detail Fitur</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================
   BENTO FEATURES SECTION (Scroll-Stacked Pillars)
============================================ */
function BentoFeaturesSection() {
  return (
    <section id="fitur" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full liquid-pill text-[#1B9981] dark:text-[#00D4AA] font-extrabold text-xs uppercase tracking-wider shadow-xs">
            <Layers className="w-3.5 h-3.5" /> 6 Pilar Ekosistem Cerdas
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Solusi Menyeluruh untuk <br />
            <span className="bg-gradient-to-r from-[#1B9981] via-[#00D4AA] to-sky-500 bg-clip-text text-transparent">
              Setiap Tantangan Disabilitas
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Ditenagai oleh Computer Vision, Natural Language Processing, dan Cloud Data Sync yang bekerja secara harmonis.
          </p>
        </motion.div>

        {/* Scroll-stacked pillar cards */}
        <div className="relative">
          {pillars.map((pillar, i) => (
            <StackPanel key={pillar.key} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   STATS SECTION (Apple Liquid Glass Monoliths)
============================================ */
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stat1 = useCounter(22, 2000, isInView);
  const stat2 = useCounter(6, 1500, isInView);
  const stat3 = useCounter(99, 2000, isInView);
  const stat4 = useCounter(2, 1500, isInView);

  return (
    <section id="statistik" className="py-24 md:py-32 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Liquid Ambient Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-gradient-to-tr from-[#1B9981]/25 via-[#00D4AA]/20 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#00D4AA] bg-white/10 border border-white/15 px-4 py-1.5 rounded-full backdrop-blur-md">
            Dampak Riset &amp; Pengujian
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Kesiapan Teknologi Nyata <br />
            Untuk Indonesia Inklusif
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { value: `${stat1}+`, unit: "Juta", label: "Penyandang disabilitas di Indonesia yang membutuhkan akses setara" },
            { value: `${stat2}`, unit: "Pilar", label: "Modul AI cerdas terintegrasi dalam satu platform" },
            { value: `${stat3}%`, unit: "Akurasi", label: "Keberhasilan deteksi alfabet BISINDO on-device" },
            { value: `< ${stat4}`, unit: "Detik", label: "Latensi transmisi darurat SOS ke Command Center" },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 text-center flex flex-col items-center justify-center backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] group overflow-hidden"
            >
              {/* Internal Specular Rim */}
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />

              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#00D4AA] mt-1.5 uppercase tracking-wider">
                {s.unit}
              </div>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-normal">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   IMPACT SECTION (Apple Bento Glass Grid)
============================================ */
function ImpactSection() {
  return (
    <section id="dampak" className="py-24 md:py-32 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs font-extrabold uppercase text-[#1B9981] dark:text-[#00D4AA] liquid-pill px-4 py-1.5 rounded-full shadow-xs">
            Dampak Sosial &amp; Inklusivitas
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Didesain Khusus Bersama Komunitas
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Kami mengembangkan fitur dengan mendengarkan langsung pengalaman dan tantangan nyata penyandang disabilitas di lapangan.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Tunanetra & Low Vision",
              icon: Eye,
              color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
              items: [
                "Navigasi trotoar aman dengan radar deteksi rintangan spasial BiJALAN",
                "Akses baca dokumen cetak dan surat kabar mandiri lewat suara BiBACA",
              ],
            },
            {
              title: "Tunarungu & Wicara",
              icon: Ear,
              color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
              items: [
                "Percakapan dua arah langsung dengan penerjemah suara-ke-teks BiSAPA",
                "Edukasi bahasa isyarat BISINDO interaktif bersama BiPINTAR",
              ],
            },
            {
              title: "Tunadaksa & Pengguna Kursi Roda",
              icon: Accessibility,
              color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
              items: [
                "Perlindungan darurat satu sentuhan dengan pemancar lokasi GPS BiSAFE",
                "Pemetaan jalur ramah kursi roda dan rintangan fasilitas di BiPANTAU",
              ],
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="liquid-glass-card rounded-[2.25rem] p-8 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl ${card.color} border flex items-center justify-center shadow-xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {card.title}
                    </h3>
                  </div>

                  <ul className="space-y-3 pt-2">
                    {card.items.map((it, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        <CheckCircle2 className="w-4 h-4 text-[#1B9981] dark:text-[#00D4AA] shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER (Apple Minimalist Liquid Footer)
============================================ */
function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900/80 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/logo.png" alt="diBISAlitas" className="w-8 h-8 object-contain" />
            <span className="text-lg font-black text-white tracking-tight">
              di<span className="text-[#1B9981] dark:text-[#00D4AA]">BISA</span>litas
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-normal">
            Ekosistem Aksesibilitas Cerdas Berbasis AI untuk Kesetaraan dan Kemandirian Disabilitas di Indonesia.
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <div className="font-bold text-white uppercase tracking-wider mb-2">Fitur Unggulan</div>
          <div><Link href="/fitur/bisafe" className="hover:text-white transition-colors">BiSAFE (Darurat SOS)</Link></div>
          <div><Link href="/fitur/bipantau" className="hover:text-white transition-colors">BiPANTAU (Command Center)</Link></div>
          <div><Link href="/fitur/bisapa" className="hover:text-white transition-colors">BiSAPA (Isyarat AI)</Link></div>
          <div><Link href="/fitur/bibaca" className="hover:text-white transition-colors">BiBACA (Smart OCR)</Link></div>
          <div><Link href="/fitur/bipintar" className="hover:text-white transition-colors">BiPINTAR (E-Learning)</Link></div>
          <div><Link href="/fitur/bijalan" className="hover:text-white transition-colors">BiJALAN (Navigasi Spasial)</Link></div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="font-bold text-white uppercase tracking-wider mb-2">Akses Cepat</div>
          <div><Link href="/demo" className="hover:text-white transition-colors">Demo Aplikasi (Tanpa Login)</Link></div>
          <div><Link href="/admin/rintangan" className="hover:text-white transition-colors">Dashboard BiPANTAU</Link></div>
          <div><Link href="/fitur" className="hover:text-white transition-colors">Pusat Fitur</Link></div>
          <div><Link href="/app/login" className="hover:text-white transition-colors">Masuk / Daftar Akun</Link></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-slate-900 text-center text-xs text-slate-600 font-normal">
        Hak Cipta &copy; {new Date().getFullYear()} diBISAlitas Platform. Seluruh Hak Dilindungi.
      </div>
    </footer>
  );
}

/* ============================================
   SPLASH SCREEN (Intro Animation)
============================================ */
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onCompleteRef.current()}
      className="fixed inset-0 z-[99999] bg-[#050811] flex items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      {/* Ambient Liquid Glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(27,153,129,0.6) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid subtle bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(27,153,129,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Main Logo Text */}
        <div className="flex items-center justify-center gap-0 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          {/* "di" */}
          <motion.span
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-white"
          >
            di
          </motion.span>

          {/* Bracket + BISA group */}
          <div className="relative mx-4 sm:mx-6 flex items-center justify-center">
            <span className="text-[#1B9981] font-light text-4xl sm:text-5xl md:text-6xl">[</span>
            <span className="text-[#1B9981] font-black px-2 text-4xl sm:text-5xl md:text-6xl">BISA</span>
            <span className="text-[#1B9981] font-light text-4xl sm:text-5xl md:text-6xl">]</span>

            {/* Scanner line */}
            <motion.div
              initial={{ left: "0%", opacity: 0 }}
              animate={{
                left: ["0%", "100%", "0%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                delay: 0.2,
                duration: 1.4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute top-0 bottom-0 w-[3px] bg-[#00D4AA] shadow-[0_0_16px_4px_rgba(0,212,170,0.8)] z-20"
            />
          </div>

          {/* "litas" */}
          <motion.span
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-white"
          >
            litas
          </motion.span>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-[#00D4AA] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-8"
        >
          Ekosistem Aksesibilitas Cerdas
        </motion.p>

        {/* Progress bar */}
        <div className="w-52 sm:w-64 h-[3px] bg-white/15 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #1B9981, #00D4AA, #38BDF8)",
            }}
          />
        </div>

        {/* Loading text */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-slate-200 text-xs sm:text-sm font-semibold tracking-wider animate-pulse"
        >
          Mempersiapkan Sistem...
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ============================================
   MAIN LANDING PAGE EXPORT
============================================ */
export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050811] text-slate-800 dark:text-slate-100 selection:bg-[#1B9981]/20 transition-colors duration-300 relative">
        <Navbar />
        <HeroSection />
        <BentoFeaturesSection />
        <StatsSection />
        <ImpactSection />
        <Footer />
        <FloatingAccessibility />
      </div>
    </>
  );
}