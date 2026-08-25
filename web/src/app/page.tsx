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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";
import InteractiveDeviceMockup, { FeatureKey } from "@/components/InteractiveDeviceMockup";

/* ============================================
   ANIMATION VARIANTS
============================================ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
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
   HERO SECTION
============================================ */
function HeroSection() {
  const [activeHeroTab, setActiveHeroTab] = useState<FeatureKey>("bisafe");

  return (
    <section className="pt-28 md:pt-32 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-gradient-to-br from-[#168C74] via-[#1B9981] to-[#0A6B58] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_30px_90px_rgba(27,153,129,0.25)] text-white"
        >
          {/* Decorative Ambient Light */}
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-white/15 via-[#00D4AA]/20 to-transparent blur-3xl pointer-events-none rounded-full" />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 grid md:grid-cols-12 gap-10 lg:gap-14 px-6 sm:px-10 lg:px-16 py-12 md:py-16 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00D4AA]" />
                Platform Aksesibilitas AI Terintegrasi
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-black leading-[1.12] tracking-tight"
              >
                Aksesibilitas Cerdas, <br />
                <span className="font-display italic text-[#00D4AA] font-normal">
                  Kemandirian Tanpa Batas.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl"
              >
                Satu ekosistem berbasis kecerdasan buatan on-device dan integrasi Cloud untuk menghadirkan kemandirian penuh bagi Tunanetra, Tunarungu, dan Tunadaksa di Indonesia.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <motion.span
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="inline-block"
                >
                  <Link
                    href="/demo"
                    className="px-7 py-3.5 rounded-full bg-white text-[#168C74] font-black text-sm hover:bg-white/95 transition-colors shadow-xl hover:shadow-2xl flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current text-[#168C74]" />
                    Coba Demo Gratis
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.span>
                <motion.span
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="inline-block"
                >
                  <Link
                    href="/fitur"
                    className="px-7 py-3.5 rounded-full bg-white/15 border border-white/25 text-white font-bold text-sm hover:bg-white/25 transition-colors backdrop-blur-md flex items-center gap-2"
                  >
                    <span>Jelajahi 6 Fitur</span>
                  </Link>
                </motion.span>
              </motion.div>

              {/* Beneficiary Tags */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.8 }}
                className="flex flex-wrap gap-2 pt-2"
              >
                {[
                  { label: "Tunanetra", icon: <Eye className="w-3.5 h-3.5" /> },
                  { label: "Tunarungu", icon: <Ear className="w-3.5 h-3.5" /> },
                  { label: "Tunadaksa", icon: <Accessibility className="w-3.5 h-3.5" /> },
                  { label: "ONNX / YOLO Vision", icon: <Brain className="w-3.5 h-3.5" /> },
                  { label: "Cloud Sync", icon: <Wifi className="w-3.5 h-3.5" /> },
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-semibold backdrop-blur-sm"
                  >
                    {item.icon}
                    {item.label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: Live Interactive Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
   PILLAR DATA (used by the stacked scroll section)
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
};

const pillars: Pillar[] = [
  {
    key: "bisafe",
    number: "01",
    title: "BiSAFE",
    tagline: "Panic Button & Geolocation Broadcaster",
    description:
      "Satu tombol darurat yang langsung menyiarkan titik koordinat satelit presisi, membunyikan sirene alarm frekuensi tinggi, dan mengirimkan sinyal ke Command Center relawan.",
    icon: ShieldAlert,
    target: "Tunadaksa & Tunanetra",
    href: "/fitur/bisafe",
    gradient: "from-rose-600 via-rose-500 to-rose-700",
    accent: "text-rose-100",
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
  },
];

/* ============================================
   STACK PANEL (sticky scroll-stacking card)
============================================ */
function StackPanel({ pillar, index }: { pillar: Pillar; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const Icon = pillar.icon;

  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: `${96 + index * 18}px`, zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale }}
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`bg-gradient-to-br ${pillar.gradient} rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.25)] mb-8`}
      >
        <div className="relative grid md:grid-cols-12 gap-8 lg:gap-14 p-8 sm:p-10 md:p-14 items-center min-h-[440px] md:min-h-[520px]">
          {/* Ambient decoration */}
          <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-white/10 blur-3xl rounded-full pointer-events-none" />

          {/* Left: Icon visual */}
          <div className="md:col-span-5 flex items-center justify-center relative z-10">
            <div className="relative w-full max-w-[280px] aspect-square rounded-[2rem] bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
                  backgroundSize: "26px 26px",
                }}
              />
              <Icon className="w-20 h-20 md:w-24 md:h-24 text-white relative z-10" strokeWidth={1.4} />
            </div>
          </div>

          {/* Right: Content */}
          <div className="md:col-span-7 space-y-4 text-white relative z-10">
            <span className={`text-xs font-bold uppercase tracking-[0.2em] ${pillar.accent}`}>
              Pilar {pillar.number} / 06
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-[2.65rem] font-black leading-tight">
              {pillar.title}
            </h3>
            <p className={`font-bold text-xs sm:text-sm uppercase tracking-wide ${pillar.accent}`}>
              {pillar.tagline}
            </p>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-lg">
              {pillar.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold">
                Target: {pillar.target}
              </span>
            </div>

            <Link
              href={pillar.href}
              className="inline-flex items-center gap-2 pt-4 text-white font-bold text-sm group"
            >
              Lihat Detail Fitur
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================
   BENTO FEATURES SECTION (scroll-stacked pillars)
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
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1B9981]/10 text-[#1B9981] dark:text-[#00D4AA] font-bold text-xs uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> 6 Pilar Ekosistem Cerdas
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Solusi Menyeluruh untuk <br />
            <span className="text-[#1B9981] dark:text-[#00D4AA]">Setiap Tantangan Disabilitas</span>
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
   STATS SECTION
============================================ */
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stat1 = useCounter(22, 2000, isInView);
  const stat2 = useCounter(6, 1500, isInView);
  const stat3 = useCounter(99, 2000, isInView);
  const stat4 = useCounter(2, 1500, isInView);

  return (
    <section id="statistik" className="py-20 md:py-28 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D4AA] bg-white/10 px-3.5 py-1.5 rounded-full">
            Dampak Riset &amp; Pengujian
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
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
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center backdrop-blur-sm"
            >
              <div className="text-3xl sm:text-5xl font-black text-white">{s.value}</div>
              <div className="text-sm font-bold text-[#00D4AA] mt-1">{s.unit}</div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   IMPACT SECTION
============================================ */
function ImpactSection() {
  return (
    <section id="dampak" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs font-bold uppercase text-[#1B9981] dark:text-[#00D4AA] bg-[#1B9981]/10 dark:bg-[#1B9981]/20 px-3.5 py-1.5 rounded-full">
            Dampak Sosial &amp; Inklusivitas
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Didesain Khusus Bersama Komunitas
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
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
              color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60",
              items: [
                "Navigasi trotoar aman dengan radar deteksi rintangan spasial BiJALAN",
                "Akses baca dokumen cetak dan surat kabar mandiri lewat suara BiBACA",
              ],
            },
            {
              title: "Tunarungu & Wicara",
              icon: Ear,
              color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60",
              items: [
                "Percakapan dua arah langsung dengan penerjemah suara-ke-teks BiSAPA",
                "Edukasi bahasa isyarat BISINDO interaktif bersama BiPINTAR",
              ],
            },
            {
              title: "Tunadaksa & Pengguna Kursi Roda",
              icon: Accessibility,
              color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60",
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
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="bg-white dark:bg-[#0F172A] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg dark:hover:border-slate-700 transition-all space-y-6"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center border border-transparent dark:border-white/5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{card.title}</h3>
                </div>

                <ul className="space-y-3">
                  {card.items.map((it, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#1B9981] dark:text-[#00D4AA] shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER
============================================ */
function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/logo.png" alt="diBISAlitas" className="w-8 h-8 object-contain" />
            <span className="text-lg font-black text-white">
              di<span className="text-[#1B9981]">BISA</span>litas
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Ekosistem Aksesibilitas Cerdas Berbasis AI untuk Kesetaraan dan Kemandirian Disabilitas di Indonesia.
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <div className="font-bold text-white uppercase tracking-wider mb-2">Fitur Unggulan</div>
          <div><Link href="/fitur/bisafe" className="hover:text-white">BiSAFE (Darurat SOS)</Link></div>
          <div><Link href="/fitur/bipantau" className="hover:text-white">BiPANTAU (Command Center)</Link></div>
          <div><Link href="/fitur/bisapa" className="hover:text-white">BiSAPA (Isyarat AI)</Link></div>
          <div><Link href="/fitur/bibaca" className="hover:text-white">BiBACA (Smart OCR)</Link></div>
          <div><Link href="/fitur/bipintar" className="hover:text-white">BiPINTAR (E-Learning)</Link></div>
          <div><Link href="/fitur/bijalan" className="hover:text-white">BiJALAN (Navigasi Spasial)</Link></div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="font-bold text-white uppercase tracking-wider mb-2">Akses Cepat</div>
          <div><Link href="/demo" className="hover:text-white">Demo Aplikasi (Tanpa Login)</Link></div>
          <div><Link href="/admin/rintangan" className="hover:text-white">Dashboard BiPANTAU</Link></div>
          <div><Link href="/fitur" className="hover:text-white">Pusat Fitur</Link></div>
          <div><Link href="/app/login" className="hover:text-white">Masuk / Daftar Akun</Link></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-slate-900 text-center text-xs text-slate-600">
        Hak Cipta &copy; {new Date().getFullYear()} diBISAlitas Platform. Seluruh Hak Dilindungi.
      </div>
    </footer>
  );
}

/* ============================================
   SPLASH SCREEN (INTRO ANIMATION)
============================================ */
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onCompleteRef.current()}
      className="fixed inset-0 z-[99999] bg-[#0a0f1a] flex items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      {/* Ambient glow */}
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
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
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

      <div className="min-h-screen bg-[#FDFEFE] dark:bg-[#090e17] text-slate-800 dark:text-slate-100 selection:bg-[#1B9981]/20 transition-colors duration-300">
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