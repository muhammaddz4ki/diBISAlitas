"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  BarChart,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Navigation,
  ArrowRight,
  Sparkles,
  Zap,
  Cpu,
  Globe,
  CheckCircle2,
  Lock,
  Layers,
  ArrowUpRight,
  Eye,
  Ear,
  Accessibility,
} from "lucide-react";
import Navbar, { FEATURES_LIST } from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";
import InteractiveDeviceMockup, { FeatureKey } from "@/components/InteractiveDeviceMockup";

const DETAILED_FEATURES = [
  {
    key: "bisafe" as FeatureKey,
    slug: "bisafe",
    title: "BiSAFE",
    badge: "Sistem Darurat Cerdas",
    tagline: "Panic Button & Geolocation Broadcaster Real-time",
    description:
      "Dirancang khusus untuk kondisi darurat atau rawan bagi penyandang disabilitas (khususnya Tunadaksa dan Tunanetra). Dengan satu sentuhan atau pintasan suara darurat, lokasi GPS presisi langsung dipancarkan ke Command Center relawan & pihak berwenang.",
    colorTheme: "rose",
    accentBg: "bg-rose-500",
    gradient: "from-rose-500 to-rose-600",
    techStack: ["Geolocation API", "Firebase Firestore Realtime", "Audio Siren Synthesizer", "Background Sync"],
    highlights: [
      "Transmisi koordinat GPS berakurasi tinggi (< 2 meter)",
      "Mode sirene alarm lokal dan getar intensitas tinggi",
      "Pemberitahuan otomatis ke kontak darurat terdaftar",
      "Terintegrasi langsung dengan dashboard BiPANTAU",
    ],
    targetUser: "Tunadaksa, Tunanetra, Lansia",
    href: "/fitur/bisafe",
  },
  {
    key: "bipantau" as FeatureKey,
    slug: "bipantau",
    title: "BiPANTAU",
    badge: "Smart City Command Center",
    tagline: "Monitoring Rintangan Kota & Manajemen Insiden",
    description:
      "Pusat kendali dan dasbor analitik berbasis web untuk memetakan jalur ramah disabilitas, mendeteksi rintangan jalan rusak atau guiding block terhalang, serta memoderasi laporan darurat secara cepat dan transparan.",
    colorTheme: "teal",
    accentBg: "bg-[#1B9981]",
    gradient: "from-[#1B9981] to-[#00D4AA]",
    techStack: ["Leaflet GIS Engine", "Real-time Incident Stream", "Role-based Admin RBAC", "Data Export CSV/JSON"],
    highlights: [
      "Pemetaan GIS interaktif dengan status rintangan realtime",
      "Verifikasi & tindakan cepat oleh petugas atau relawan kota",
      "Analitik heatmap titik rintangan rawan bagi pejalan kaki",
      "Riwayat komprehensif audit pelaporan fasilitas publik",
    ],
    targetUser: "Pemerintah Kota, Relawan, Pengelola Fasilitas Publik",
    href: "/fitur/bipantau",
  },
  {
    key: "bisapa" as FeatureKey,
    slug: "bisapa",
    title: "BiSAPA",
    badge: "Komunikasi Dua Arah AI",
    tagline: "Penerjemah Bahasa Isyarat BISINDO & Web Speech",
    description:
      "Menghilangkan sekat komunikasi antara Tunarungu dan Tunanetra atau masyarakat umum. Memanfaatkan Computer Vision on-device (ONNX) untuk membaca gestur tangan BISINDO secara real-time dan mengubahnya ke audio/teks instan.",
    colorTheme: "amber",
    accentBg: "bg-amber-500",
    gradient: "from-amber-500 to-amber-600",
    techStack: ["ONNX Runtime Web", "MediaPipe Hands (21 Landmark)", "Web Speech Recognition", "Neural TTS"],
    highlights: [
      "Deteksi alfabet BISINDO A-Z dengan akurasi di atas 95%",
      "Pemrosesan on-device tanpa jeda server (latensi < 50ms)",
      "Penerjemah suara ke teks untuk didengar Tunarungu",
      "Penerjemah gestur ke suara untuk didengar Tunanetra",
    ],
    targetUser: "Tunarungu, Tunanetra, Masyarakat Umum",
    href: "/fitur/bisapa",
  },
  {
    key: "bibaca" as FeatureKey,
    slug: "bibaca",
    title: "BiBACA",
    badge: "Smart Document OCR",
    tagline: "Pengubah Teks Visual Menjadi Suara Natural",
    description:
      "Memberikan kemandirian membaca bagi Tunanetra dan penyandang Disleksia. Cukup arahkan kamera ke buku, papan petunjuk jalan, resep obat, atau dokumen cetak, lalu sistem akan membacakannya secara otomatis dalam Bahasa Indonesia.",
    colorTheme: "purple",
    accentBg: "bg-purple-600",
    gradient: "from-purple-500 to-purple-600",
    techStack: ["Tesseract.js OCR", "Image Pre-processing Filters", "Indonesian Speech Synthesis", "Text Summarizer"],
    highlights: [
      "Ekstraksi teks multibahasa fokus Bahasa Indonesia",
      "Optimasi kontras gambar otomatis untuk tulisan buram",
      "Pengaturan kecepatan dan tinggi nada suara pembaca",
      "Penyimpanan riwayat pembacaan dokumen penting",
    ],
    targetUser: "Tunanetra, Disleksia, Lansia",
    href: "/fitur/bibaca",
  },
  {
    key: "bipintar" as FeatureKey,
    slug: "bipintar",
    title: "BiPINTAR",
    badge: "Gamified E-Learning",
    tagline: "Akademi Isyarat BISINDO & Huruf Hijaiyah Inklusif",
    description:
      "Platform belajar interaktif dengan animasi gestur GIF, kuis gamifikasi, sistem EXP, dan lencana prestasi. Membantu siapa saja menguasai bahasa isyarat BISINDO dan Isyarat Hijaiyah secara mandiri dan menyenangkan.",
    colorTheme: "emerald",
    accentBg: "bg-emerald-600",
    gradient: "from-emerald-500 to-emerald-600",
    techStack: ["Gamification Engine", "Interactive Flashcards", "Dynamic Quiz Evaluation", "Badge & XP Tracker"],
    highlights: [
      "Animasi panduan gestur 26 Abjad dan Angka BISINDO",
      "Modul khusus Isyarat Huruf Hijaiyah untuk pendidikan agama",
      "Sistem kuis interaktif dengan feedback koreksi instan",
      "Peringkat global & lencana apresiasi belajar",
    ],
    targetUser: "Pelajar Disabilitas, Guru SLB, Komunitas Inklusi",
    href: "/fitur/bipintar",
  },
  {
    key: "bijalan" as FeatureKey,
    slug: "bijalan",
    title: "BiJALAN",
    badge: "Spatial Vision & Haptic",
    tagline: "Navigasi Spasial & Deteksi Rintangan Berbasis Kamera",
    description:
      "Mata kedua bagi Tunanetra saat berjalan di trotoar atau ruang publik. Kamera smartphone mendeteksi tiang, lubang, tangga, kendaraan, dan orang di depan pengguna, lalu memberikan peringatan audio dan getaran haptic terarah.",
    colorTheme: "sky",
    accentBg: "bg-sky-600",
    gradient: "from-sky-500 to-sky-600",
    techStack: ["YOLO Object Detection", "Spatial Distance Estimator", "Web Vibration API (Haptic)", "Spatial Audio 3D"],
    highlights: [
      "Pengenalan objek rintangan jalan secara instan",
      "Estimasi jarak spasial (dekat, sedang, jauh)",
      "Umpan balik haptic getaran smartphone yang mudah dipahami",
      "Panduan arah suara belok kiri/kanan saat terhalang",
    ],
    targetUser: "Tunanetra, Low Vision, Lansia",
    href: "/fitur/bijalan",
  },
];

export default function FiturOverviewPage() {
  const [selectedFeature, setSelectedFeature] = useState<FeatureKey>("bisafe");

  const currentFeatureData =
    DETAILED_FEATURES.find((f) => f.key === selectedFeature) || DETAILED_FEATURES[0];

  return (
    <div className="min-h-screen bg-[#FDFEFE] dark:bg-[#090e17] text-slate-800 dark:text-slate-100 selection:bg-[#1B9981]/20 transition-colors duration-300">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#1B9981]/15 via-[#00D4AA]/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-5 leading-relaxed"
          >
            Setiap pilar dirancang khusus dengan perpaduan Artificial Intelligence, Computer Vision,
            dan Cloud Sync untuk mengatasi hambatan aksesibilitas sehari-hari secara menyeluruh.
          </motion.p>
        </div>
      </section>

      {/* Interactive Showcase & Scrollytelling Simulator */}
      <section className="py-12 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Feature Tabs Selector */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {DETAILED_FEATURES.map((item) => {
              const isActive = selectedFeature === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedFeature(item.key)}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isActive
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-lg scale-105"
                      : "bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.key === "bisafe"
                        ? "bg-rose-500"
                        : item.key === "bipantau"
                        ? "bg-[#1B9981]"
                        : item.key === "bisapa"
                        ? "bg-amber-500"
                        : item.key === "bibaca"
                        ? "bg-purple-500"
                        : item.key === "bipintar"
                        ? "bg-emerald-500"
                        : "bg-sky-500"
                    }`}
                  />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Interactive Stage */}
          <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-[0_20px_70px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_70px_rgba(0,0,0,0.5)] p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Interactive Details */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeatureData.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {currentFeatureData.badge}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                      {currentFeatureData.title} – {currentFeatureData.tagline}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed pt-2">
                      {currentFeatureData.description}
                    </p>
                  </div>

                  {/* Highlights checklist */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Fitur Utama &amp; Keunggulan
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentFeatureData.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#1B9981] dark:text-[#00D4AA] mt-0.5 shrink-0" />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                            {h}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack pills */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Teknologi yang Digunakan
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentFeatureData.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-semibold flex items-center gap-1.5"
                        >
                          <Cpu className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href={currentFeatureData.href}
                      className="px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-[#1B9981] text-white font-bold text-sm hover:bg-slate-800 dark:hover:bg-[#168C74] transition-all shadow-md flex items-center gap-2"
                    >
                      <span>Pelajari Detail {currentFeatureData.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/demo"
                      className="px-6 py-3.5 rounded-2xl bg-[#1B9981]/10 text-[#1B9981] dark:text-[#00D4AA] border border-[#1B9981]/30 font-bold text-sm hover:bg-[#1B9981]/20 transition-all flex items-center gap-2"
                    >
                      <span>Coba Demo Langsung</span>
                      <Zap className="w-4 h-4 fill-current" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Realistic Animated Device Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <InteractiveDeviceMockup
                activeFeature={selectedFeature}
                onSelectFeature={(k) => setSelectedFeature(k)}
                interactive={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid of All 6 Features Deep-Dive Cards */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50/60 dark:bg-[#070b12] border-t border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B9981] dark:text-[#00D4AA] bg-[#1B9981]/10 dark:bg-[#1B9981]/20 px-3.5 py-1.5 rounded-full">
              Eksplorasi Lengkap
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4">
              Pilih Fitur untuk Membaca Panduan Lengkap
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Klik kartu di bawah untuk membuka halaman dokumentasi detail, arsitektur AI, dan live preview.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DETAILED_FEATURES.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="bg-white dark:bg-[#0F172A] rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 hover:border-[#1B9981]/50 dark:hover:border-[#00D4AA]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.badge}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#1B9981] group-hover:text-white transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-[#1B9981] dark:group-hover:text-[#00D4AA] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                      {item.tagline}
                    </p>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#1B9981] dark:text-[#00D4AA]">
                  <span>Buka Halaman Spesifikasi</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Synergy Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto bg-slate-900 dark:bg-[#0F172A] rounded-[2.5rem] p-8 sm:p-14 text-white relative overflow-hidden border border-transparent dark:border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1B9981]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#00D4AA] text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" /> Sinergi Ekosistem
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              Semua Fitur Saling Terhubung <br />
              Dalam Satu Sinkronisasi Real-Time
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Ketika pengguna mendeteksi rintangan jalan dengan <strong>BiJALAN</strong> atau menekan tombol darurat <strong>BiSAFE</strong>, data langsung tersinkronisasi ke <strong>BiPANTAU</strong> untuk ditindaklanjuti relawan dan pengelola kota. Semua berjalan tanpa batas antar perangkat.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/demo"
                className="px-7 py-3.5 rounded-2xl bg-[#00D4AA] text-slate-950 font-extrabold text-sm hover:bg-[#00D4AA]/90 transition-all shadow-lg"
              >
                Jelajahi Demo Hub
              </Link>
              <Link
                href="/app/login"
                className="px-7 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all"
              >
                Daftar Akun Pengguna
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FloatingAccessibility />
    </div>
  );
}
