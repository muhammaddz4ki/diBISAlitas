"use client";

import { useState, useEffect, useRef } from "react";
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
  Menu,
  X,
  ArrowRight,
  Smartphone,
  Monitor,
  Shield,
  Brain,
  Wifi,
  Clock,
} from "lucide-react";

/* ============================================
   ANIMATION VARIANTS
============================================ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ============================================
   COUNTER ANIMATION HOOK
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
   NAVBAR
============================================ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#fitur", label: "Fitur" },
    { href: "#statistik", label: "Statistik" },
    { href: "#dampak", label: "Dampak" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_20px_-6px_rgba(0,0,0,0.06)]"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/logo.png"
            alt="diBISAlitas"
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            di<span className="text-[#1B9981]">BISA</span>litas
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm font-semibold text-slate-500 hover:text-[#1B9981] transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3 z-10">
          <Link
            href="/app/login"
            className="px-6 py-2.5 rounded-full bg-[#1B9981] text-white text-sm font-bold hover:bg-[#168C74] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Masuk / Daftar
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 transition-colors z-10"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-xl"
        >
          <div className="px-6 py-6 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-[#1B9981] py-3 border-b border-slate-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-3">
              <Link
                href="/app/login"
                className="bg-[#1B9981] text-center px-6 py-3.5 rounded-2xl text-white font-bold text-sm"
              >
                Masuk / Daftar
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

/* ============================================
   HERO SECTION — Large green rounded container
   Inspired by reference: phone mockup + text
============================================ */
function HeroSection() {
  return (
    <section className="pt-20 md:pt-22 pb-6 md:pb-8 px-4 md:px-5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-[#1B9981] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden"
        >
          {/* Decorative QR-style grid (top-left, like reference) */}
          <div className="absolute top-6 left-6 md:top-10 md:left-10 opacity-20 z-20">
            <div className="grid grid-cols-5 gap-[3px]">
              {[1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1].map((v, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-[2px] ${v ? "bg-white" : "bg-transparent"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Organic circles */}
          <div
            className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
          />
          <div
            className="absolute -left-10 -bottom-20 w-[300px] h-[300px] rounded-full pointer-events-none opacity-10"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
          />

          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 px-8 md:px-14 lg:px-20 py-12 md:py-16 items-center">
            {/* Left: text content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Revolusi Aksesibilitas AI
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] text-white mb-6 leading-[1.1] tracking-tight"
              >
                <span className="font-extrabold">Aksesibilitas premium,</span>
                <br />
                <span className="font-display italic font-normal opacity-90">
                  untuk setiap orang.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-md"
              >
                Satu ekosistem cerdas berbasis AI untuk memberikan kemandirian
                penuh bagi Tunanetra, Tunarungu, dan Tunadaksa di Indonesia.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                <Link
                  href="/app/login"
                  className="px-7 py-3.5 rounded-full bg-white text-[#1B9981] font-bold text-sm hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Coba Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#fitur"
                  className="px-7 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  Pelajari Fitur
                </Link>
              </motion.div>

              {/* Category pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex flex-wrap gap-2"
              >
                {[
                  { label: "Tunanetra", icon: <Eye className="w-3.5 h-3.5" /> },
                  { label: "Tunarungu", icon: <Ear className="w-3.5 h-3.5" /> },
                  { label: "Tunadaksa", icon: <Accessibility className="w-3.5 h-3.5" /> },
                  { label: "AI Detection", icon: <Brain className="w-3.5 h-3.5" /> },
                  { label: "Real-time", icon: <Clock className="w-3.5 h-3.5" /> },
                ].map((cat) => (
                  <span
                    key={cat.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs font-medium backdrop-blur-sm"
                  >
                    {cat.icon}
                    {cat.label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center md:justify-end"
            >
              <div className="relative">
                {/* Glow behind phone */}
                <div className="absolute -inset-8 bg-white/5 rounded-[3rem] blur-2xl" />

                {/* Phone frame */}
                <div className="relative w-[240px] sm:w-[260px] h-[480px] sm:h-[520px] rounded-[2.5rem] border-[5px] border-white/20 bg-white shadow-2xl shadow-black/20 overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-20" />

                  <div className="h-full flex flex-col">
                    {/* App header */}
                    <div className="bg-[#1B9981] px-5 pt-9 pb-6 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                          diBISAlitas
                        </p>
                        <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
                      </div>
                      <h3 className="text-lg font-bold">BiSAFE</h3>
                      <p className="text-white/60 text-[11px] mt-1 leading-relaxed">
                        Tekan tombol darurat untuk mengirim lokasi
                      </p>
                    </div>

                    {/* Panic button area */}
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-slate-50 relative">
                      <span className="absolute w-36 h-36 rounded-full bg-rose-500/10 animate-ping" />
                      <span className="absolute w-28 h-28 rounded-full bg-rose-500/10" />
                      <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex flex-col items-center justify-center text-white shadow-xl shadow-rose-500/25">
                        <ShieldAlert className="w-8 h-8" />
                        <span className="text-[10px] font-bold tracking-wider mt-1">
                          DARURAT
                        </span>
                      </div>
                    </div>

                    {/* Bottom nav */}
                    <div className="h-14 bg-white border-t border-slate-100 flex items-center justify-around px-4">
                      {[Zap, Users, ShieldAlert, Navigation].map((Icon, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 2
                              ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                              : "text-slate-300"
                            }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   BENTO FEATURES SECTION — 6 Pilar Ekosistem
   Asymmetric bento grid like reference
============================================ */
function BentoSection() {
  return (
    <section id="fitur" className="py-20 md:py-28 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B9981]/5 border border-[#1B9981]/10 text-[#1B9981] font-semibold text-xs uppercase tracking-wider mb-5">
            Fitur Unggulan
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            6 Pilar{" "}
            <span className="text-[#1B9981]">Ekosistem Cerdas</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
            Setiap fitur ditenagai kecerdasan buatan dan integrasi Cloud untuk
            menjamin performa dan pengalaman tanpa batas.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5"
        >
          {/* ── BiSAFE — Large card (col-span-7) ── */}
          <motion.div
            variants={fadeUp}
            className="md:col-span-7 bento-card bg-gradient-to-br from-[#f0f9f6] to-[#e8f5f0] rounded-[2rem] p-8 md:p-10 relative overflow-hidden group min-h-[300px] flex flex-col justify-between"
          >
            <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[#1B9981]/5" />
            <div className="absolute right-6 top-6 opacity-10">
              <div className="w-20 h-20 rounded-full border-[3px] border-[#1B9981]" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-5 text-rose-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                BiSAFE
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                Sistem darurat satu tombol (Panic Button) yang otomatis merekam
                koordinat geolokasi secara presisi dan mengirimkan peringatan
                real-time ke sistem Cloud.
              </p>
            </div>
            <div className="relative z-10 mt-6">
              <span className="inline-flex text-[11px] font-bold uppercase tracking-wider text-[#1B9981] bg-[#1B9981]/10 px-3.5 py-1.5 rounded-lg">
                Geolocation &amp; Cloud Sync
              </span>
            </div>
          </motion.div>

          {/* ── BiPANTAU — Green card (col-span-5) ── */}
          <motion.div
            variants={fadeUp}
            custom={1}
            className="md:col-span-5 bento-card bg-[#1B9981] rounded-[2rem] p-8 md:p-10 relative overflow-hidden group min-h-[300px] flex flex-col justify-between"
          >
            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/5" />
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-5 text-white backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <BarChart className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                BiPANTAU
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Dashboard analitik kelas Enterprise bagi pengelola layanan
                darurat untuk memantau insiden, mengelola respons, dan menjaga
                keamanan pengguna secara real-time.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
              <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                Real-time Analytics
              </span>
            </div>
          </motion.div>

          {/* ── BiSAPA (col-span-4) ── */}
          <motion.div
            variants={fadeUp}
            custom={2}
            className="md:col-span-4 bento-card bg-white rounded-[2rem] p-7 md:p-8 border border-slate-100 hover:border-amber-200 relative overflow-hidden group"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-amber-50/50" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                BiSAPA
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Penerjemah dua arah revolusioner antara suara dan teks.
                Memfasilitasi interaksi langsung Tunanetra-Tunarungu secara
                instan.
              </p>
              <span className="inline-flex text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md mt-4">
                Web Speech &amp; NLP
              </span>
            </div>
          </motion.div>

          {/* ── BiBACA (col-span-4) ── */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="md:col-span-4 bento-card bg-white rounded-[2rem] p-7 md:p-8 border border-slate-100 hover:border-purple-200 relative overflow-hidden group"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-purple-50/50" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                BiBACA
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Pemindai dokumen berbasis Computer Vision yang mengubah teks
                cetak menjadi audio jernih untuk kemandirian Tunanetra.
              </p>
              <span className="inline-flex text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md mt-4">
                OCR Machine Learning
              </span>
            </div>
          </motion.div>

          {/* ── BiPINTAR (col-span-4) ── */}
          <motion.div
            variants={fadeUp}
            custom={4}
            className="md:col-span-4 bento-card bg-white rounded-[2rem] p-7 md:p-8 border border-slate-100 hover:border-emerald-200 relative overflow-hidden group"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-50/50" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                BiPINTAR
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Platform E-Learning inklusif dengan kurikulum terstruktur untuk
                meningkatkan soft-skill maupun hard-skill secara mandiri.
              </p>
              <span className="inline-flex text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md mt-4">
                Inclusive LMS
              </span>
            </div>
          </motion.div>

          {/* ── BiJALAN — Full width card (col-span-12) ── */}
          <motion.div
            variants={fadeUp}
            custom={5}
            className="md:col-span-12 bento-card bg-gradient-to-br from-sky-50/80 to-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-100 hover:border-sky-200 relative overflow-hidden group"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-5 text-sky-500 group-hover:scale-110 transition-transform duration-300">
                  <Navigation className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                  BiJALAN
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                  Mata digital bagi Tunanetra. Mampu mengenali rintangan jalan
                  dan marka secara visual, kemudian memberikan umpan balik
                  getaran (haptic) sebagai panduan arah.
                </p>
                <span className="inline-flex text-[11px] font-bold uppercase tracking-wider text-sky-600 bg-sky-100 px-3 py-1.5 rounded-lg mt-5">
                  Object Tracking &amp; Haptic
                </span>
              </div>

              {/* Camera detection visual */}
              <div className="flex items-center justify-center md:justify-end">
                <div className="relative w-full max-w-[320px] h-[180px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
                  {/* Detection boxes */}
                  <div className="absolute top-5 left-5 w-16 h-20 border-2 border-sky-400 rounded-lg opacity-80">
                    <span className="absolute -top-2.5 left-1 bg-sky-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      Person
                    </span>
                  </div>
                  <div className="absolute top-8 right-8 w-12 h-16 border-2 border-amber-400 rounded-lg opacity-80">
                    <span className="absolute -top-2.5 left-1 bg-amber-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      Pole
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-1/3 w-20 h-8 border-2 border-rose-400 rounded-lg opacity-80">
                    <span className="absolute -top-2.5 left-1 bg-rose-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      Pothole
                    </span>
                  </div>
                  {/* Haptic wave indicator */}
                  <div className="absolute bottom-4 right-4 flex items-end gap-1">
                    <div
                      className="w-1.5 h-3 bg-[#1B9981] rounded-full animate-pulse"
                    />
                    <div
                      className="w-1.5 h-5 bg-[#1B9981] rounded-full animate-pulse"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <div
                      className="w-1.5 h-7 bg-[#1B9981] rounded-full animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    />
                    <div
                      className="w-1.5 h-4 bg-[#1B9981] rounded-full animate-pulse"
                      style={{ animationDelay: "0.45s" }}
                    />
                  </div>
                  {/* Camera viewfinder corners */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-slate-300 rounded-tl" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-slate-300 rounded-tr" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-slate-300 rounded-bl" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-slate-300 rounded-br" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   STATS SECTION — Large numbers grid
   Inspired by reference's "10 лет / 200+ / 40+"
============================================ */
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stat1 = useCounter(3, 2000, isInView);
  const stat2 = useCounter(6, 1500, isInView);
  const stat3 = useCounter(100, 2000, isInView);
  const stat4 = useCounter(2, 1500, isInView);

  return (
    <section id="statistik" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section text */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-sm text-slate-400 font-medium mb-4 tracking-wide">
            Lebih dari 3 tahun riset untuk aksesibilitas Indonesia
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            <span className="font-extrabold">Aksesibilitas premium,</span>
            <br />
            <span className="font-display italic text-[#1B9981]">
              untuk setiap orang.
            </span>
          </h2>
          <Link
            href="/app/login"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1B9981] text-white font-bold text-sm hover:bg-[#168C74] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Coba Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Stats Grid — 2x2 with divider lines */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-100"
        >
          {[
            {
              value: `${stat1}+`,
              unit: "Juta",
              label:
                "Penyandang disabilitas di kota besar membutuhkan aksesibilitas layak",
            },
            {
              value: `${stat2}`,
              unit: "Pilar",
              label:
                "Ekosistem fitur terintegrasi yang saling melengkapi",
            },
            {
              value: `${stat3}%`,
              unit: "",
              label:
                "Kesiapan sistem alarm darurat SOS terintegrasi real-time",
            },
            {
              value: `< ${stat4}`,
              unit: "Detik",
              label:
                "Waktu respons Machine Learning dalam menerjemahkan objek",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="bg-white p-8 md:p-10 text-center flex flex-col items-center justify-center min-h-[200px]"
            >
              <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
                {stat.value}
              </p>
              {stat.unit && (
                <p className="text-lg md:text-xl font-bold text-[#1B9981] mt-1">
                  {stat.unit}
                </p>
              )}
              <p className="text-slate-400 text-xs md:text-sm mt-3 leading-relaxed max-w-[200px]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   SHOWCASE SECTION — Web & Mobile (dark panel)
============================================ */
function ShowcaseSection() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#0a0f1a] overflow-hidden px-8 md:px-16 py-16 md:py-20">
          {/* Decorative glow + grid */}
          <div
            className="absolute top-[-20%] right-[-5%] w-[440px] h-[440px] rounded-full pointer-events-none opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(27,153,129,0.35) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #1B9981 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Text */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#00D4AA] font-semibold text-xs uppercase tracking-wider mb-6">
                <Smartphone className="w-3.5 h-3.5" /> Web &amp; Mobile
              </span>
              <h2 className="text-3xl md:text-5xl text-white tracking-tight mb-5 leading-[1.1]">
                <span className="font-extrabold">Satu Ekosistem,</span>
                <br />
                <span className="font-display italic text-[#00D4AA]">
                  Semua Perangkat.
                </span>
              </h2>
              <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                Deteksi isyarat dan rintangan langsung di browser (ONNX) maupun
                HP (TFLite), tersinkron real-time via Cloud — tanpa batas.
              </p>
              <ul className="space-y-4">
                {[
                  {
                    icon: <Brain className="w-5 h-5" />,
                    t: "AI on-device — privasi terjaga, respons < 2 detik",
                  },
                  {
                    icon: <Wifi className="w-5 h-5" />,
                    t: "Sinkronisasi Cloud real-time antar perangkat",
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    t: "Laporan darurat langsung ke Command Center",
                  },
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1B9981]/15 text-[#00D4AA] flex items-center justify-center shrink-0">
                      {f.icon}
                    </div>
                    <span className="text-white/80 text-sm md:text-base">
                      {f.t}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Dual device mockup */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="flex justify-center md:justify-end"
            >
              <div className="relative">
                {/* Laptop mockup */}
                <div className="w-[300px] md:w-[340px] h-[200px] md:h-[220px] rounded-xl border-[4px] border-slate-700 bg-white overflow-hidden shadow-2xl">
                  <div className="h-6 bg-slate-800 flex items-center gap-1.5 px-3">
                    <span className="w-2 h-2 rounded-full bg-rose-400/60" />
                    <span className="w-2 h-2 rounded-full bg-amber-400/60" />
                    <span className="w-2 h-2 rounded-full bg-[#1B9981]/60" />
                    <span className="ml-2 text-[8px] text-slate-500 font-medium">
                      dibisalitas.app
                    </span>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-slate-50 to-white h-full">
                    <div className="flex gap-2 mb-2">
                      <div className="w-16 h-2 bg-[#1B9981]/20 rounded" />
                      <div className="w-12 h-2 bg-slate-100 rounded" />
                      <div className="w-10 h-2 bg-slate-100 rounded" />
                    </div>
                    <div className="w-full h-3 bg-[#1B9981]/10 rounded mb-2" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-14 bg-[#1B9981]/5 rounded-lg border border-[#1B9981]/10 flex items-center justify-center">
                        <ShieldAlert className="w-4 h-4 text-[#1B9981]/40" />
                      </div>
                      <div className="h-14 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center">
                        <BarChart className="w-4 h-4 text-blue-300" />
                      </div>
                      <div className="h-14 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-amber-300" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Laptop stand */}
                <div className="w-[320px] md:w-[360px] h-3 bg-slate-700 rounded-b-lg mx-auto -mt-px" />

                {/* Phone mockup overlapping */}
                <div className="absolute -right-4 -bottom-4 w-[100px] h-[200px] rounded-2xl border-[3px] border-slate-700 bg-white shadow-2xl overflow-hidden z-10">
                  <div className="h-full flex flex-col">
                    <div className="bg-[#1B9981] h-10 px-2 pt-3">
                      <p className="text-[6px] text-white/80 font-bold">
                        BiSAFE
                      </p>
                    </div>
                    <div className="flex-1 flex items-center justify-center bg-white">
                      <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center shadow-md shadow-rose-500/20">
                        <ShieldAlert className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="h-6 border-t border-slate-100 flex items-center justify-center gap-2 px-1">
                      {[Zap, ShieldAlert, Navigation].map((Icon, i) => (
                        <Icon
                          key={i}
                          className={`w-2.5 h-2.5 ${i === 1 ? "text-rose-500" : "text-slate-300"
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   IMPACT SECTION — 3 beneficiary cards
============================================ */
function ImpactSection() {
  const impactData = [
    {
      title: "Tunanetra",
      icon: <Eye className="w-7 h-7" />,
      color: "bg-sky-50 text-sky-600",
      borderHover: "hover:border-sky-200",
      benefits: [
        {
          icon: <Globe className="w-5 h-5 text-[#1B9981]" />,
          text: "Mobilitas jalan yang jauh lebih aman dengan deteksi objek rintangan secara real-time.",
        },
        {
          icon: <BookOpen className="w-5 h-5 text-[#1B9981]" />,
          text: "Akses literasi visual tanpa batasan melalui teknologi OCR teks-ke-suara.",
        },
      ],
    },
    {
      title: "Tunarungu & Wicara",
      icon: <Ear className="w-7 h-7" />,
      color: "bg-amber-50 text-amber-600",
      borderHover: "hover:border-amber-200",
      benefits: [
        {
          icon: <MessageCircle className="w-5 h-5 text-[#1B9981]" />,
          text: "Interaksi kasual dan sosial tanpa hambatan komunikasi verbal.",
        },
        {
          icon: <HeartHandshake className="w-5 h-5 text-[#1B9981]" />,
          text: "Mengeliminasi perasaan terisolasi di tempat pelayanan publik umum.",
        },
      ],
    },
    {
      title: "Tunadaksa",
      icon: <Accessibility className="w-7 h-7" />,
      color: "bg-violet-50 text-violet-600",
      borderHover: "hover:border-violet-200",
      benefits: [
        {
          icon: <ShieldAlert className="w-5 h-5 text-[#1B9981]" />,
          text: "Respons evakuasi atau bantuan yang cepat dalam kondisi terdesak/rawan.",
        },
        {
          icon: <Navigation className="w-5 h-5 text-[#1B9981]" />,
          text: "Kepastian pemantauan lokasi saat melakukan perjalanan jauh secara mandiri.",
        },
      ],
    },
  ];

  return (
    <section id="dampak" className="py-20 md:py-28 bg-slate-50/50 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B9981]/5 border border-[#1B9981]/10 text-[#1B9981] font-semibold text-xs uppercase tracking-wider mb-5">
            Dampak Nyata
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Dampak Nyata Untuk{" "}
            <span className="text-[#1B9981]">Setiap Kebutuhan</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
            Desain yang dilandasi oleh empati. Setiap lini fitur dirancang
            dengan sangat spesifik untuk menjawab tantangan sehari-hari.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {impactData.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              custom={i}
              className={`bg-white rounded-[2rem] p-8 border border-slate-100 ${item.borderHover} transition-all duration-300 hover:shadow-lg hover:shadow-slate-100/50 group`}
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                  {item.title}
                </h3>
              </div>
              <ul className="space-y-5">
                {item.benefits.map((benefit, j) => (
                  <li key={j} className="flex items-start gap-3.5">
                    <div className="mt-0.5 shrink-0">{benefit.icon}</div>
                    <span className="text-slate-600 text-sm leading-relaxed">
                      {benefit.text}
                    </span>
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
   CTA SECTION — Green rounded container
============================================ */
function CTASection() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative bg-[#1B9981] rounded-[2.5rem] px-8 md:px-16 py-16 md:py-20 text-center overflow-hidden"
        >
          {/* Decorative orbs */}
          <div
            className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none opacity-15"
            style={{
              background:
                "radial-gradient(circle, white 0%, transparent 70%)",
              animation: "float 10s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-[-30%] left-[-10%] w-[350px] h-[350px] rounded-full pointer-events-none opacity-10"
            style={{
              background:
                "radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 70%)",
              animation: "floatReverse 8s ease-in-out infinite",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white font-semibold text-xs uppercase tracking-wider mb-8 backdrop-blur-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              Mulai Sekarang
            </motion.div>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="text-3xl md:text-5xl text-white mb-6 tracking-tight leading-tight"
            >
              <span className="font-extrabold">Siap Merasakan</span>
              <br />
              <span className="font-display italic">Perubahan?</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              className="text-white/70 max-w-xl mx-auto mb-10 text-base md:text-lg leading-relaxed"
            >
              Bergabunglah dalam ekosistem diBISAlitas dan rasakan bagaimana
              teknologi AI mengubah kehidupan sehari-hari menjadi lebih inklusif.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/app/login"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#1B9981] font-bold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base"
              >
                <Monitor className="w-5 h-5" />
                Buka Aplikasi Web
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 border-2 border-white/20 text-white font-bold hover:bg-white/20 backdrop-blur-sm transition-all flex items-center justify-center gap-2 text-base"
              >
                <Smartphone className="w-5 h-5" />
                Unduh Mobile App
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER — Clean minimal
============================================ */
function Footer() {
  return (
    <footer className="py-12 md:py-16 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/logo.png"
                alt="diBISAlitas"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                di<span className="text-[#1B9981]">BISA</span>litas
              </span>
            </Link>
            <p className="text-slate-400 text-sm">
              Hak Cipta © {new Date().getFullYear()}. Seluruh Hak Dilindungi.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500">
            <Link
              href="#"
              className="hover:text-[#1B9981] transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
            <Link
              href="#"
              className="hover:text-[#1B9981] transition-colors"
            >
              Syarat &amp; Ketentuan
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
            <Link
              href="#"
              className="hover:text-[#1B9981] transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-400">
            Dibuat dengan ❤️ untuk Indonesia yang lebih inklusif
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================
   SPLASH SCREEN (INTRO ANIMATION)
   ⚠ PRESERVED EXACTLY AS ORIGINAL ⚠
============================================ */
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Total animation duration: ~3.5s, then trigger exit
    const timer = setTimeout(onComplete, 3800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#0a0f1a] flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ambient glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(27,153,129,0.4) 0%, transparent 70%)",
          animation: "pulseGlow 3s ease-in-out infinite",
        }}
      />

      {/* Dot grid subtle bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(27,153,129,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Main Logo Text */}
        <div className="flex items-center gap-0 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
          {/* "di" - fades in first */}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/50"
          >
            di
          </motion.span>

          {/* Bracket + BISA group */}
          <div className="relative mx-6 sm:mx-8">
            {/* Left bracket */}
            <motion.span
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#1B9981] font-light absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2"
            >
              [
            </motion.span>

            {/* "BISA" - main highlight */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#1B9981] relative z-10 px-2.5 sm:px-3.5"
            >
              BISA
            </motion.span>

            {/* Right bracket */}
            <motion.span
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#1B9981] font-light absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2"
            >
              ]
            </motion.span>

            {/* Scanner line */}
            <motion.div
              initial={{ left: 0, opacity: 0 }}
              animate={{
                left: ["0%", "100%", "0%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                delay: 0.7,
                duration: 1.2,
                ease: "easeInOut",
              }}
              className="absolute top-0 bottom-0 w-[2px] bg-[#00D4AA] shadow-[0_0_15px_3px_rgba(0,212,170,0.5)] z-20"
            />
          </div>

          {/* "litas" - fades in after */}
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/50"
          >
            litas
          </motion.span>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="text-white/40 text-sm sm:text-base font-medium tracking-[0.2em] uppercase mb-10"
        >
          Ekosistem Aksesibilitas Cerdas
        </motion.p>

        {/* Progress bar */}
        <div className="w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #1B9981, #00D4AA, #0EA5E9)",
            }}
          />
        </div>

        {/* Loading text */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.4 }}
          className="text-white/20 text-[11px] font-medium tracking-wider uppercase mt-4"
        >
          Mempersiapkan Sistem...
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ============================================
   MAIN PAGE
============================================ */
export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Small delay to let exit animation play
    setTimeout(() => setContentReady(true), 100);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="min-h-screen bg-white text-slate-900 selection:bg-[#1B9981]/20 selection:text-[#1B9981]"
      >
        <Navbar />
        <HeroSection />
        <BentoSection />
        <StatsSection />
        <ShowcaseSection />
        <ImpactSection />
        <CTASection />
        <Footer />
      </motion.div>
    </>
  );
}