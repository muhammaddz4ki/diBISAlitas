"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  BarChart,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Navigation,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Smartphone,
  LayoutDashboard,
  Sparkles,
  Zap,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export const FEATURES_LIST = [
  {
    slug: "bisafe",
    name: "BiSAFE",
    badge: "Darurat & SOS",
    desc: "Panic Button satu sentuhan dengan transmisi GPS presisi ke sistem Cloud.",
    icon: ShieldAlert,
    color: "text-rose-600 bg-rose-50 border-rose-100",
    hoverBg: "hover:bg-rose-50/70",
    href: "/fitur/bisafe",
  },
  {
    slug: "bipantau",
    name: "BiPANTAU",
    badge: "Smart City",
    desc: "Command center monitoring rintangan kota dan penanganan insiden real-time.",
    icon: BarChart,
    color: "text-[#1B9981] bg-[#1B9981]/10 border-[#1B9981]/20",
    hoverBg: "hover:bg-[#1B9981]/5",
    href: "/fitur/bipantau",
  },
  {
    slug: "bisapa",
    name: "BiSAPA",
    badge: "Bahasa Isyarat AI",
    desc: "Penerjemah gestur BISINDO real-time dua arah ke teks dan suara natural.",
    icon: MessageCircle,
    color: "text-amber-600 bg-amber-50 border-amber-100",
    hoverBg: "hover:bg-amber-50/70",
    href: "/fitur/bisapa",
  },
  {
    slug: "bibaca",
    name: "BiBACA",
    badge: "OCR & Vision",
    desc: "Pemindai dokumen cerdas berbasis Computer Vision menjadi audio jernih.",
    icon: BookOpen,
    color: "text-purple-600 bg-purple-50 border-purple-100",
    hoverBg: "hover:bg-purple-50/70",
    href: "/fitur/bibaca",
  },
  {
    slug: "bipintar",
    name: "BiPINTAR",
    badge: "E-Learning Inklusif",
    desc: "Modul gamifikasi pembelajaran BISINDO dan Hijaiyah berbasis interaktif.",
    icon: GraduationCap,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    hoverBg: "hover:bg-emerald-50/70",
    href: "/fitur/bipintar",
  },
  {
    slug: "bijalan",
    name: "BiJALAN",
    badge: "Navigasi & Haptic",
    desc: "Deteksi rintangan jalan secara visual dengan umpan balik getaran terarah.",
    icon: Navigation,
    color: "text-sky-600 bg-sky-50 border-sky-100",
    hoverBg: "hover:bg-sky-50/70",
    href: "/fitur/bijalan",
  },
];

export const DEMO_LIST = [
  {
    title: "Demo Aplikasi diBISAlitas",
    badge: "Langsung Tanpa Login",
    desc: "Jelajahi seluruh modul di HP/Web secara instan dengan akun tamu demo.",
    icon: Smartphone,
    color: "text-[#1B9981] bg-[#1B9981]/10",
    href: "/demo#app-demo",
  },
  {
    title: "Demo Dashboard BiPANTAU",
    badge: "Command Center",
    desc: "Pantau peta rintangan aksesibilitas kota dan verifikasi laporan warga.",
    icon: LayoutDashboard,
    color: "text-blue-600 bg-blue-50",
    href: "/demo#pantau-demo",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#090e17]/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-slate-100 dark:border-slate-800/80 py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/logo.png"
            alt="Logo diBISAlitas"
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              di<span className="text-[#1B9981]">BISA</span>litas
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
              AI INCLUSIVITY PLATFORM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="/"
            className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
              pathname === "/"
                ? "text-[#1B9981] font-bold"
                : "text-slate-600 dark:text-slate-300 hover:text-[#1B9981] dark:hover:text-[#00D4AA]"
            }`}
          >
            {pathname === "/" && (
              <motion.span
                layoutId="navbar-active-pill"
                className="absolute inset-0 rounded-xl bg-[#1B9981]/10 dark:bg-[#1B9981]/20"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">Beranda</span>
          </Link>

          {/* Fitur Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("fitur")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/fitur"
              className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname.startsWith("/fitur")
                  ? "text-[#1B9981] font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-[#1B9981] dark:hover:text-[#00D4AA]"
              }`}
            >
              {pathname.startsWith("/fitur") && (
                <motion.span
                  layoutId="navbar-active-pill"
                  className="absolute inset-0 rounded-xl bg-[#1B9981]/10 dark:bg-[#1B9981]/20"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">Fitur</span>
              <ChevronDown
                className={`relative z-10 w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === "fitur" ? "rotate-180 text-[#1B9981]" : ""
                }`}
              />
            </Link>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {activeDropdown === "fitur" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[680px] bg-white dark:bg-[#0F172A] rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.14)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2.5 z-50"
                >
                  <div className="col-span-2 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        6 Pilar Ekosistem Cerdas
                      </h4>
                    </div>
                    <Link
                      href="/fitur"
                      className="text-xs font-bold text-[#1B9981] dark:text-[#00D4AA] hover:text-[#168C74] flex items-center gap-1"
                    >
                      <span>Lihat Ringkasan Fitur</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {FEATURES_LIST.map((f) => {
                    const Icon = f.icon;
                    return (
                      <Link
                        key={f.slug}
                        href={f.href}
                        className={`p-3 rounded-2xl border border-transparent transition-all flex items-start gap-3.5 ${f.hoverBg} dark:hover:bg-slate-800/80 hover:border-slate-200/80 dark:hover:border-slate-700/80 group`}
                      >
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${f.color} shadow-sm group-hover:scale-105 transition-transform`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#1B9981] dark:group-hover:text-[#00D4AA] transition-colors">
                              {f.name}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {f.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {f.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Demo Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("demo")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/demo"
              className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === "/demo"
                  ? "text-[#1B9981] font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-[#1B9981] dark:hover:text-[#00D4AA]"
              }`}
            >
              {pathname === "/demo" && (
                <motion.span
                  layoutId="navbar-active-pill"
                  className="absolute inset-0 rounded-xl bg-[#1B9981]/10 dark:bg-[#1B9981]/20"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1B9981] animate-pulse" />
                Demo
              </span>
              <ChevronDown
                className={`relative z-10 w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === "demo" ? "rotate-180 text-[#1B9981]" : ""
                }`}
              />
            </Link>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {activeDropdown === "demo" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[400px] bg-white dark:bg-[#0F172A] rounded-3xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.14)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-slate-800 flex flex-col gap-2 z-50"
                >
                  <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Pusat Akses Demo
                    </h4>
                    <Link
                      href="/demo"
                      className="text-xs font-bold text-[#1B9981] dark:text-[#00D4AA] flex items-center gap-1"
                    >
                      Buka Demo Hub <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {DEMO_LIST.map((d, i) => {
                    const Icon = d.icon;
                    return (
                      <Link
                        key={i}
                        href={d.href}
                        className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-start gap-3 group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${d.color}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#1B9981] dark:group-hover:text-[#00D4AA] transition-colors">
                              {d.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {d.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/#video-demo"
            className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1B9981] dark:hover:text-[#00D4AA] transition-colors"
          >
            Video Demo
          </Link>
          <Link
            href="/#statistik"
            className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1B9981] dark:hover:text-[#00D4AA] transition-colors"
          >
            Statistik
          </Link>
          <Link
            href="/#dampak"
            className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1B9981] dark:hover:text-[#00D4AA] transition-colors"
          >
            Dampak
          </Link>
        </nav>

        {/* CTA Actions & Theme Toggle */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/demo"
            className="px-4 py-2.5 rounded-full text-xs font-bold text-[#1B9981] dark:text-[#00D4AA] bg-[#1B9981]/10 hover:bg-[#1B9981]/20 transition-all border border-[#1B9981]/20 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Coba Demo Gratis
          </Link>
          <Link
            href="/app/login"
            className="px-5 py-2.5 rounded-full bg-[#1B9981] text-white text-xs font-bold hover:bg-[#168C74] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-1.5"
          >
            Masuk / Daftar
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button & Theme Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu Navigasi Mobile"
            className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-[#090e17] border-b border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <Link
                href="/"
                className="block py-2 text-base font-bold text-slate-800 dark:text-slate-100 hover:text-[#1B9981] dark:hover:text-[#00D4AA]"
              >
                Beranda
              </Link>

              {/* Fitur Accordion */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between py-2 text-base font-bold text-slate-800 dark:text-slate-100">
                  <span>Pilihan Fitur Unggulan</span>
                  <Link
                    href="/fitur"
                    className="text-xs font-semibold text-[#1B9981] dark:text-[#00D4AA]"
                  >
                    Lihat Semua
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {FEATURES_LIST.map((f) => {
                    const Icon = f.icon;
                    return (
                      <Link
                        key={f.slug}
                        href={f.href}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 border border-transparent dark:border-slate-800"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${f.color}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">
                            {f.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {f.badge}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Demo Section Mobile */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                <div className="text-base font-bold text-slate-800 dark:text-slate-100">Akses Demo</div>
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    href="/demo#app-demo"
                    className="p-3 rounded-xl bg-[#1B9981]/10 text-[#1B9981] dark:text-[#00D4AA] font-bold text-xs flex items-center justify-between border border-[#1B9981]/20"
                  >
                    <span>Demo Aplikasi (Tanpa Login)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/demo#pantau-demo"
                    className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-between border border-blue-100 dark:border-blue-900"
                  >
                    <span>Demo Dashboard BiPANTAU</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                <Link
                  href="/#video-demo"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1B9981] dark:hover:text-[#00D4AA]"
                >
                  Video Demo Aplikasi
                </Link>
                <Link
                  href="/#statistik"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1B9981] dark:hover:text-[#00D4AA]"
                >
                  Statistik Riset
                </Link>
                <Link
                  href="/#dampak"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1B9981] dark:hover:text-[#00D4AA]"
                >
                  Dampak Komunitas
                </Link>
              </div>

              <div className="pt-2">
                <Link
                  href="/app/login"
                  className="block w-full py-3.5 text-center bg-[#1B9981] text-white font-bold rounded-2xl text-sm shadow-md"
                >
                  Masuk / Daftar Akun
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
