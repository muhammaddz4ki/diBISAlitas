"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";
import InteractiveDeviceMockup, { FeatureKey } from "@/components/InteractiveDeviceMockup";

/* ============================================
   ANIMATION VARIANTS (Clean Apple Spring)
============================================ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
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
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ============================================
   COUNTER HOOK
============================================ */
function useCounter(end: number, duration: number = 1800, startCounting: boolean = false) {
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
   HERO SECTION (Clean & Minimalist)
============================================ */
function HeroSection() {
  const [activeHeroTab, setActiveHeroTab] = useState<FeatureKey>("bisafe");

  return (
    <section className="pt-28 md:pt-32 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Solid Clean Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-[#111115] rounded-[2.5rem] md:rounded-[3rem] border border-slate-200/90 dark:border-zinc-800 shadow-sm p-6 sm:p-10 lg:p-14"
        >
          <div className="grid md:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-7">
              {/* Minimal Clean Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-[#1B9981]" />
                <span className="font-bold text-[#1B9981]">diBISAlitas</span>
                <span className="text-slate-300 dark:text-zinc-600">|</span>
                <span>Ekosistem Aksesibilitas Cerdas</span>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.12] tracking-tight text-slate-950 dark:text-white">
                  Aksesibilitas Cerdas, <br />
                  <span className="text-[#1B9981]">
                    Kemandirian Tanpa Batas.
                  </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                  Satu ekosistem berbasis kecerdasan buatan on-device dan integrasi Cloud untuk menghadirkan kemandirian penuh bagi Tunanetra, Tunarungu, dan Tunadaksa di Indonesia.
                </p>
              </motion.div>

              {/* Clean Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-wrap items-center gap-3 pt-1"
              >
                <Link
                  href="/demo"
                  className="px-7 py-3.5 rounded-full bg-[#1B9981] hover:bg-[#168C74] text-white font-bold text-sm transition-colors flex items-center gap-2 shadow-xs"
                >
                  <span>Coba Demo Gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/fitur"
                  className="px-7 py-3.5 rounded-full bg-slate-50 dark:bg-zinc-800/80 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-slate-100 font-bold text-sm transition-colors"
                >
                  <span>Jelajahi 6 Fitur</span>
                </Link>
              </motion.div>

              {/* Beneficiary Tags without icons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="flex flex-wrap gap-2 pt-1"
              >
                {["Tunanetra", "Tunarungu", "Tunadaksa", "Computer Vision", "Cloud Sync"].map((label, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1 rounded-full bg-slate-100/80 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 text-slate-600 dark:text-slate-300 text-xs font-medium"
                  >
                    {label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: Phone Simulation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
   PILLAR DATA (Clean Flat Solid Cards)
============================================ */
type Pillar = {
  key: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  target: string;
  href: string;
};

const pillars: Pillar[] = [
  {
    key: "bisafe",
    number: "01",
    title: "BiSAFE",
    tagline: "Panic Button & Geolocation Broadcaster",
    description:
      "Satu sentuhan darurat yang langsung menyiarkan titik koordinat satelit presisi, membunyikan sirene alarm frekuensi tinggi, dan mengirimkan sinyal ke Command Center relawan.",
    target: "Tunadaksa & Tunanetra",
    href: "/fitur/bisafe",
  },
  {
    key: "bipantau",
    number: "02",
    title: "BiPANTAU",
    tagline: "Smart City Command Center",
    description:
      "Dasbor pemetaan GIS dan moderasi rintangan kota untuk memonitor jalur ramah disabilitas dan merespons insiden secara real-time.",
    target: "Pemda & Relawan",
    href: "/fitur/bipantau",
  },
  {
    key: "bisapa",
    number: "03",
    title: "BiSAPA",
    tagline: "Penerjemah Isyarat AI Dua Arah",
    description:
      "Penerjemah bahasa isyarat BISINDO AI dua arah secara real-time dari gestur kamera ke teks dan suara.",
    target: "Tunarungu & Tunanetra",
    href: "/fitur/bisapa",
  },
  {
    key: "bibaca",
    number: "04",
    title: "BiBACA",
    tagline: "Smart OCR ke Audio",
    description:
      "Smart OCR yang memindai buku, papan petunjuk, dan dokumen cetak menjadi audio Bahasa Indonesia jernih.",
    target: "Tunanetra & Disleksia",
    href: "/fitur/bibaca",
  },
  {
    key: "bipintar",
    number: "05",
    title: "BiPINTAR",
    tagline: "Gamifikasi Belajar Bahasa Isyarat",
    description:
      "Platform gamifikasi belajar bahasa isyarat BISINDO dan Isyarat Hijaiyah dengan kuis dan lencana prestasi.",
    target: "Pelajar & Komunitas",
    href: "/fitur/bipintar",
  },
  {
    key: "bijalan",
    number: "06",
    title: "BiJALAN",
    tagline: "Spatial Vision & Haptic Guidance",
    description:
      "Mata kedua Tunanetra saat berjalan di trotoar. Mendeteksi tiang, lubang, tangga, dan kendaraan secara visual lalu memberikan umpan balik getaran haptic dan suara terarah.",
    target: "Tunanetra & Pejalan Kaki",
    href: "/fitur/bijalan",
  },
];

/* ============================================
   STACK PANEL (Clean Solid Minimalist Card)
============================================ */
function StackPanel({ pillar, index }: { pillar: Pillar; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: `${96 + index * 16}px`, zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-[#15151a] rounded-[2.5rem] md:rounded-[3rem] p-8 sm:p-10 md:p-14 border border-slate-200 dark:border-zinc-800 shadow-md mb-8"
      >
        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Giant Bold Clean Number */}
          <div className="md:col-span-4 flex flex-col justify-center items-start md:items-center">
            <span className="text-6xl sm:text-7xl md:text-8xl font-black text-slate-200 dark:text-zinc-800 leading-none">
              {pillar.number}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B9981] mt-2">
              Pilar Ekosistem
            </span>
          </div>

          {/* Right: Content */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1B9981]/10 text-[#1B9981] dark:text-[#00D4AA]">
                {pillar.target}
              </span>
            </div>

            <div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {pillar.tagline}
              </p>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {pillar.description}
            </p>

            <div className="pt-2">
              <Link
                href={pillar.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                <span>Pelajari Detail Fitur</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================
   BENTO FEATURES SECTION (Clean Stacked Pillars)
============================================ */
function BentoFeaturesSection() {
  return (
    <section id="fitur" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[#1B9981] font-bold text-xs uppercase tracking-wider">
            6 Pilar Ekosistem Cerdas
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Solusi Menyeluruh untuk <br />
            <span className="text-[#1B9981]">Setiap Tantangan Disabilitas</span>
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
   STATS SECTION (Clean Solid Monoliths)
============================================ */
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stat1 = useCounter(22, 1800, isInView);
  const stat2 = useCounter(6, 1400, isInView);
  const stat3 = useCounter(99, 1800, isInView);
  const stat4 = useCounter(2, 1400, isInView);

  return (
    <section id="statistik" className="py-24 md:py-28 bg-[#0a0a0d] text-white px-4 sm:px-6">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#1B9981] bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full">
            Dampak Riset &amp; Pengujian
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
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
              className="bg-[#121216] border border-zinc-800/80 rounded-[2rem] p-6 sm:p-8 text-center flex flex-col items-center justify-center"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#1B9981] mt-2 uppercase tracking-wider">
                {s.unit}
              </div>
              <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed font-normal">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   IMPACT SECTION (Clean Bento Grid)
============================================ */
function ImpactSection() {
  return (
    <section id="dampak" className="py-24 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-14">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs font-bold uppercase text-[#1B9981] bg-[#1B9981]/10 px-3.5 py-1.5 rounded-full">
            Dampak Sosial &amp; Inklusivitas
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
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
              category: "Tunanetra & Low Vision",
              items: [
                "Navigasi trotoar aman dengan radar deteksi rintangan spasial BiJALAN",
                "Akses baca dokumen cetak dan surat kabar mandiri lewat suara BiBACA",
              ],
            },
            {
              category: "Tunarungu & Wicara",
              items: [
                "Percakapan dua arah langsung dengan penerjemah suara-ke-teks BiSAPA",
                "Edukasi bahasa isyarat BISINDO interaktif bersama BiPINTAR",
              ],
            },
            {
              category: "Tunadaksa & Pengguna Kursi Roda",
              items: [
                "Perlindungan darurat satu sentuhan dengan pemancar lokasi GPS BiSAFE",
                "Pemetaan jalur ramah kursi roda dan rintangan fasilitas di BiPANTAU",
              ],
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white dark:bg-[#111115] rounded-[2rem] p-8 border border-slate-200/90 dark:border-zinc-800 space-y-5"
            >
              <div className="border-b border-slate-100 dark:border-zinc-800/80 pb-4">
                <span className="text-xs font-bold text-[#1B9981] uppercase tracking-wider">
                  Kategori {i + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {card.category}
                </h3>
              </div>

              <ul className="space-y-3">
                {card.items.map((it, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B9981] shrink-0 mt-1.5" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER (Clean Minimalist Footer)
============================================ */
function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-zinc-900 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/logo.png" alt="diBISAlitas" className="w-8 h-8 object-contain" />
            <span className="text-lg font-black text-white tracking-tight">
              di<span className="text-[#1B9981]">BISA</span>litas
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

      <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-zinc-900 text-center text-xs text-slate-600 font-normal">
        Hak Cipta &copy; {new Date().getFullYear()} diBISAlitas Platform. Seluruh Hak Dilindungi.
      </div>
    </footer>
  );
}

/* ============================================
   SPLASH SCREEN (Clean Intro Animation)
============================================ */
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onCompleteRef.current()}
      className="fixed inset-0 z-[99999] bg-[#0a0a0c] flex items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Main Logo Text */}
        <div className="flex items-center justify-center gap-0 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.8, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-white"
          >
            di
          </motion.span>

          <div className="relative mx-3 sm:mx-5 flex items-center justify-center">
            <span className="text-[#1B9981] font-light text-4xl sm:text-5xl md:text-6xl">[</span>
            <span className="text-[#1B9981] font-black px-2 text-4xl sm:text-5xl md:text-6xl">BISA</span>
            <span className="text-[#1B9981] font-light text-4xl sm:text-5xl md:text-6xl">]</span>
          </div>

          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 0.8, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-white"
          >
            litas
          </motion.span>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="text-[#1B9981] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-8"
        >
          Ekosistem Aksesibilitas Cerdas
        </motion.p>

        {/* Progress bar */}
        <div className="w-48 sm:w-56 h-1 bg-zinc-800 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-[#1B9981]"
          />
        </div>

        <span className="text-zinc-500 text-xs font-medium tracking-wider">
          Memuat Sistem...
        </span>
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

      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0D] text-slate-800 dark:text-slate-100 selection:bg-[#1B9981]/20 transition-colors duration-300">
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
