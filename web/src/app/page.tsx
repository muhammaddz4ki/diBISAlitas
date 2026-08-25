"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
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
  ArrowUpRight,
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
                <Link
                  href="/demo"
                  className="px-7 py-3.5 rounded-full bg-white text-[#168C74] font-black text-sm hover:bg-white/95 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current text-[#168C74]" />
                  Coba Demo Gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/fitur"
                  className="px-7 py-3.5 rounded-full bg-white/15 border border-white/25 text-white font-bold text-sm hover:bg-white/25 transition-all backdrop-blur-md flex items-center gap-2"
                >
                  <span>Jelajahi 6 Fitur</span>
                </Link>
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
   BENTO FEATURES SECTION
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
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1B9981]/10 text-[#1B9981] font-bold text-xs uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> 6 Pilar Ekosistem Cerdas
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Solusi Menyeluruh untuk <br />
            <span className="text-[#1B9981]">Setiap Tantangan Disabilitas</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Ditenagai oleh Computer Vision, Natural Language Processing, dan Cloud Data Sync yang bekerja secara harmonis.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-5"
        >
          {/* 1. BiSAFE (col-7) */}
          <motion.div
            variants={fadeUp}
            className="md:col-span-7 bg-gradient-to-br from-rose-50 to-white rounded-[2.5rem] p-8 sm:p-10 border border-rose-100 hover:border-rose-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <Link
                  href="/fitur/bisafe"
                  className="w-10 h-10 rounded-full bg-white border border-rose-100 flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">BiSAFE</h3>
                <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mt-0.5">
                  Panic Button &amp; Geolocation Broadcaster
                </p>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                Satu tombol darurat yang langsung menyiarkan titik koordinat satelit presisi, membunyikan sirene alarm frekuensi tinggi, dan mengirimkan sinyal ke Command Center relawan.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-rose-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Target: Tunadaksa &amp; Tunanetra</span>
              <Link href="/fitur/bisafe" className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
                Pelajari Detail <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* 2. BiPANTAU (col-5) */}
          <motion.div
            variants={fadeUp}
            className="md:col-span-5 bg-gradient-to-br from-[#168C74] to-[#1B9981] text-white rounded-[2.5rem] p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <BarChart className="w-7 h-7" />
                </div>
                <Link
                  href="/fitur/bipantau"
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">BiPANTAU</h3>
                <p className="text-xs font-bold text-[#00D4AA] uppercase tracking-wider mt-0.5">
                  Smart City Command Center
                </p>
              </div>

              <p className="text-white/80 text-sm leading-relaxed">
                Dasbor pemetaan GIS dan moderasi rintangan kota untuk memonitor jalur ramah disabilitas dan merespons insiden secara real-time.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/15 flex items-center justify-between">
              <span className="text-xs font-bold text-white/70">Target: Pemda &amp; Relawan</span>
              <Link href="/fitur/bipantau" className="text-xs font-bold text-white flex items-center gap-1">
                Pelajari Detail <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* 3. BiSAPA (col-4) */}
          <motion.div
            variants={fadeUp}
            className="md:col-span-4 bg-white rounded-[2.5rem] p-7 sm:p-8 border border-slate-200/80 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">BiSAPA</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Penerjemah bahasa isyarat BISINDO AI dua arah secara real-time dari gestur kamera ke teks dan suara.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Tunarungu &amp; Tunanetra</span>
              <Link href="/fitur/bisapa" className="hover:underline flex items-center gap-1">Detail <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </motion.div>

          {/* 4. BiBACA (col-4) */}
          <motion.div
            variants={fadeUp}
            className="md:col-span-4 bg-white rounded-[2.5rem] p-7 sm:p-8 border border-slate-200/80 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">BiBACA</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Smart OCR yang memindai buku, papan petunjuk, dan dokumen cetak menjadi audio Bahasa Indonesia jernih.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>Tunanetra &amp; Disleksia</span>
              <Link href="/fitur/bibaca" className="hover:underline flex items-center gap-1">Detail <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </motion.div>

          {/* 5. BiPINTAR (col-4) */}
          <motion.div
            variants={fadeUp}
            className="md:col-span-4 bg-white rounded-[2.5rem] p-7 sm:p-8 border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">BiPINTAR</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Platform gamifikasi belajar bahasa isyarat BISINDO dan Isyarat Hijaiyah dengan kuis dan lencana prestasi.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Pelajar &amp; Komunitas</span>
              <Link href="/fitur/bipintar" className="hover:underline flex items-center gap-1">Detail <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </motion.div>

          {/* 6. BiJALAN (col-12) */}
          <motion.div
            variants={fadeUp}
            className="md:col-span-12 bg-gradient-to-br from-sky-50 to-white rounded-[2.5rem] p-8 sm:p-10 border border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between gap-8 group"
          >
            <div className="space-y-4 max-w-xl">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">BiJALAN</h3>
                <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mt-0.5">
                  Spatial Vision &amp; Haptic Guidance
                </p>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Mata kedua Tunanetra saat berjalan di trotoar. Mendeteksi tiang, lubang, tangga, dan kendaraan secara visual lalu memberikan umpan balik getaran haptic dan suara terarah.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
              <Link
                href="/fitur/bijalan"
                className="px-6 py-3 rounded-2xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 shadow-md transition-all flex items-center gap-2"
              >
                <span>Buka Spesifikasi BiJALAN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
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
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D4AA] bg-white/10 px-3.5 py-1.5 rounded-full">
            Dampak Riset &amp; Pengujian
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
            Kesiapan Teknologi Nyata <br />
            Untuk Indonesia Inklusif
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { value: `${stat1}+`, unit: "Juta", label: "Penyandang disabilitas di Indonesia yang membutuhkan akses setara" },
            { value: `${stat2}`, unit: "Pilar", label: "Modul AI cerdas terintegrasi dalam satu platform" },
            { value: `${stat3}%`, unit: "Akurasi", label: "Keberhasilan deteksi alfabet BISINDO on-device" },
            { value: `< ${stat4}`, unit: "Detik", label: "Latensi transmisi darurat SOS ke Command Center" },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center backdrop-blur-sm"
            >
              <div className="text-3xl sm:text-5xl font-black text-white">{s.value}</div>
              <div className="text-sm font-bold text-[#00D4AA] mt-1">{s.unit}</div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
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
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase text-[#1B9981] bg-[#1B9981]/10 px-3.5 py-1.5 rounded-full">
            Dampak Sosial &amp; Inklusivitas
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Didesain Khusus Bersama Komunitas
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Kami mengembangkan fitur dengan mendengarkan langsung pengalaman dan tantangan nyata penyandang disabilitas di lapangan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Tunanetra & Low Vision",
              icon: Eye,
              color: "text-sky-600 bg-sky-50",
              items: [
                "Navigasi trotoar aman dengan radar deteksi rintangan spasial BiJALAN",
                "Akses baca dokumen cetak dan surat kabar mandiri lewat suara BiBACA",
              ],
            },
            {
              title: "Tunarungu & Wicara",
              icon: Ear,
              color: "text-amber-600 bg-amber-50",
              items: [
                "Percakapan dua arah langsung dengan penerjemah suara-ke-teks BiSAPA",
                "Edukasi bahasa isyarat BISINDO interaktif bersama BiPINTAR",
              ],
            },
            {
              title: "Tunadaksa & Pengguna Kursi Roda",
              icon: Accessibility,
              color: "text-rose-600 bg-rose-50",
              items: [
                "Perlindungan darurat satu sentuhan dengan pemancar lokasi GPS BiSAFE",
                "Pemetaan jalur ramah kursi roda dan rintangan fasilitas di BiPANTAU",
              ],
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all space-y-6"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                </div>

                <ul className="space-y-3">
                  {card.items.map((it, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#1B9981] shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
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

      <div className="min-h-screen bg-[#FDFEFE] text-slate-800 selection:bg-[#1B9981]/20">
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