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
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTheme } from "@/lib/ThemeContext";

export const FEATURES_LIST = [
  {
    slug: "bisafe",
    name: "BiSAFE",
    badge: "Darurat & SOS",
    desc: "Panic Button satu sentuhan dengan transmisi GPS presisi ke sistem Cloud.",
    icon: ShieldAlert,
    gradient: "bg-gradient-to-br from-rose-400 to-red-500",
    shadow: "shadow-[0_8px_20px_rgba(244,63,94,0.4)]",
    hoverBg: "hover:bg-red-500/5",
    href: "/fitur/bisafe",
  },
  {
    slug: "bipantau",
    name: "BiPANTAU",
    badge: "Smart City",
    desc: "Command center monitoring rintangan kota dan penanganan insiden real-time.",
    icon: BarChart,
    gradient: "bg-gradient-to-br from-[#2a9d8f] to-[#4fd1c5]",
    shadow: "shadow-[0_8px_20px_rgba(42,157,143,0.4)]",
    hoverBg: "hover:bg-[#2a9d8f]/5",
    href: "/fitur/bipantau",
  },
  {
    slug: "bisapa",
    name: "BiSAPA",
    badge: "Bahasa Isyarat AI",
    desc: "Penerjemah gestur BISINDO real-time dua arah ke teks dan suara natural.",
    icon: MessageCircle,
    gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
    shadow: "shadow-[0_8px_20px_rgba(59,130,246,0.4)]",
    hoverBg: "hover:bg-blue-500/5",
    href: "/fitur/bisapa",
  },
  {
    slug: "bibaca",
    name: "BiBACA",
    badge: "OCR & Vision",
    desc: "Pemindai dokumen cerdas berbasis Computer Vision menjadi audio jernih.",
    icon: BookOpen,
    gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
    shadow: "shadow-[0_8px_20px_rgba(168,85,247,0.4)]",
    hoverBg: "hover:bg-purple-500/5",
    href: "/fitur/bibaca",
  },
  {
    slug: "bipintar",
    name: "BiPINTAR",
    badge: "E-Learning Inklusif",
    desc: "Modul gamifikasi pembelajaran BISINDO dan Hijaiyah berbasis interaktif.",
    icon: GraduationCap,
    gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
    shadow: "shadow-[0_8px_20px_rgba(245,158,11,0.4)]",
    hoverBg: "hover:bg-orange-500/5",
    href: "/fitur/bipintar",
  },
  {
    slug: "bijalan",
    name: "BiJALAN",
    badge: "Navigasi & Haptic",
    desc: "Deteksi rintangan jalan secara visual dengan umpan balik getaran terarah.",
    icon: Navigation,
    gradient: "bg-gradient-to-br from-[#2a9d8f] to-[#1e7b6d]",
    shadow: "shadow-[0_8px_20px_rgba(42,157,143,0.4)]",
    hoverBg: "hover:bg-[#2a9d8f]/5",
    href: "/fitur/bijalan",
  },
];

export const DEMO_LIST = [
  {
    title: "Demo Aplikasi diBISAlitas",
    badge: "Langsung Tanpa Login",
    desc: "Jelajahi seluruh modul di HP/Web secara instan dengan akun tamu demo.",
    icon: Smartphone,
    gradient: "bg-gradient-to-br from-[#2a9d8f] to-[#4fd1c5]",
    shadow: "shadow-[0_8px_20px_rgba(42,157,143,0.4)]",
    href: "/demo#app-demo",
  },
  {
    title: "Demo Dashboard BiPANTAU",
    badge: "Command Center",
    desc: "Pantau peta rintangan aksesibilitas kota dan verifikasi laporan warga.",
    icon: LayoutDashboard,
    gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
    shadow: "shadow-[0_8px_20px_rgba(59,130,246,0.4)]",
    href: "/demo#pantau-demo",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { highContrast } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isSolid = scrolled || highContrast || mobileOpen;

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[96%] xl:w-full max-w-6xl ${
        isSolid
          ? `top-4 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08),_inset_0_2px_4px_rgba(255,255,255,0.5)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6),_inset_0_2px_4px_rgba(255,255,255,0.05)] border border-white/50 dark:border-white/10 ${mobileOpen ? 'rounded-[1.5rem]' : 'rounded-[1.5rem] lg:rounded-full'} py-2 px-3 sm:px-5 overflow-hidden lg:overflow-visible`
          : "top-4 bg-transparent py-4 px-3 sm:px-5"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group z-10 notranslate" translate="no">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/logo.png"
            alt="Logo diBISAlitas"
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col notranslate" translate="no">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none notranslate" translate="no">
              di<span className="text-[#2a9d8f]">BISA</span>litas
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider notranslate" translate="no">
              AI INCLUSIVITY PLATFORM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center p-1.5 gap-0.5">
          <Link
            href="/"
            className={`relative px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
              pathname === "/"
                ? "text-[#2a9d8f] font-bold"
                : "text-slate-600 dark:text-slate-300 font-medium hover:text-[#2a9d8f] dark:hover:text-[#4fd1c5] hover:bg-slate-100 dark:hover:bg-white/[0.04]"
            }`}
          >
            {pathname === "/" && (
              <motion.span
                layoutId="navbar-active-pill"
                className="absolute inset-0 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-sm dark:shadow-none border border-slate-200/60 dark:border-white/5"
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
              className={`relative px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center gap-1.5 ${
                pathname.startsWith("/fitur")
                  ? "text-[#2a9d8f] font-bold"
                  : "text-slate-600 dark:text-slate-300 font-medium hover:text-[#2a9d8f] dark:hover:text-[#4fd1c5] hover:bg-slate-100 dark:hover:bg-white/[0.04]"
            }`}
            >
              {pathname.startsWith("/fitur") && (
                <motion.span
                  layoutId="navbar-active-pill"
                  className="absolute inset-0 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-sm dark:shadow-none border border-slate-200/60 dark:border-white/5"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">Fitur</span>
              <ChevronDown
                className={`relative z-10 w-4 h-4 transition-transform duration-300 ${
                  activeDropdown === "fitur" ? "rotate-180 text-[#2a9d8f]" : ""
                }`}
              />
            </Link>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {activeDropdown === "fitur" && (
                <>
                  <div className="absolute top-full left-0 w-full h-6" /> {/* Invisible bridge */}
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[740px] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-3xl rounded-[1.5rem] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/60 dark:border-white/10 grid grid-cols-2 gap-4 z-50"
                  >
                    <div className="col-span-2 mb-3 px-4 py-3 bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-slate-50 dark:border-white/5 flex items-center justify-between">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                        6 Pilar Ekosistem Cerdas
                      </h4>
                      <Link
                        href="/fitur"
                        className="text-xs font-bold text-[#2a9d8f] dark:text-[#4fd1c5] hover:text-[#1e7b6d] flex items-center gap-1 group bg-[#2a9d8f]/10 dark:bg-[#2a9d8f]/20 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <span>Lihat Ringkasan Fitur</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    {FEATURES_LIST.map((f) => {
                      const Icon = f.icon;
                      return (
                        <Link
                          key={f.slug}
                          href={f.href}
                          className="p-3 bg-white dark:bg-[#1f1f1f] rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-slate-50 dark:border-white/5 flex items-start gap-4 transition-transform hover:scale-[1.02] group"
                        >
                          <div
                            className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 text-white ${f.gradient} ${f.shadow} group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-[#2a9d8f] dark:group-hover:text-[#4fd1c5] transition-colors notranslate" translate="no">
                                {f.name}
                              </span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                                {f.badge}
                              </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400/80 line-clamp-2 leading-relaxed">
                              {f.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                </>
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
              className={`relative px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center gap-1.5 ${
                pathname === "/demo"
                  ? "text-[#2a9d8f] font-bold"
                  : "text-slate-600 dark:text-slate-300 font-medium hover:text-[#2a9d8f] dark:hover:text-[#4fd1c5] hover:bg-slate-100 dark:hover:bg-white/[0.04]"
              }`}
            >
              {pathname === "/demo" && (
                <motion.span
                  layoutId="navbar-active-pill"
                  className="absolute inset-0 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-sm dark:shadow-none border border-slate-200/60 dark:border-white/5"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2a9d8f] animate-pulse" />
                Demo
              </span>
              <ChevronDown
                className={`relative z-10 w-4 h-4 transition-transform duration-300 ${
                  activeDropdown === "demo" ? "rotate-180 text-[#2a9d8f]" : ""
                }`}
              />
            </Link>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {activeDropdown === "demo" && (
                <>
                  <div className="absolute top-full left-0 w-full h-6" /> {/* Invisible bridge */}
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[420px] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-3xl rounded-[1.5rem] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/60 dark:border-white/10 flex flex-col gap-3 z-50"
                  >
                    <div className="mb-3 px-4 py-3 bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-slate-50 dark:border-white/5 flex items-center justify-between">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                        Pusat Akses Demo
                      </h4>
                      <Link
                        href="/demo"
                        className="text-xs font-bold text-[#2a9d8f] dark:text-[#4fd1c5] flex items-center gap-1 group bg-[#2a9d8f]/10 dark:bg-[#2a9d8f]/20 px-3 py-1.5 rounded-full transition-colors"
                      >
                        Buka Demo Hub <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    {DEMO_LIST.map((d, i) => {
                      const Icon = d.icon;
                      return (
                        <Link
                          key={i}
                          href={d.href}
                          className="p-3 bg-white dark:bg-[#1f1f1f] rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-slate-50 dark:border-white/5 flex items-start gap-4 transition-transform hover:scale-[1.02] group"
                        >
                          <div
                            className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 text-white ${d.gradient} ${d.shadow} group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-[#2a9d8f] dark:group-hover:text-[#4fd1c5] transition-colors">
                                {d.title.includes("diBISAlitas") ? (
                                  <>Demo Aplikasi <span className="notranslate" translate="no">diBISAlitas</span></>
                                ) : (
                                  <>Demo Dashboard <span className="notranslate" translate="no">BiPANTAU</span></>
                                )}
                              </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400/80 mt-1 leading-relaxed">
                              {d.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Menu Developer / API */}
          <Link
            href="/developer"
            className={`relative px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center gap-1.5 ${
              pathname.startsWith("/developer")
                ? "text-[#2a9d8f] font-bold"
                : "text-slate-600 dark:text-slate-300 font-medium hover:text-[#2a9d8f] dark:hover:text-[#4fd1c5] hover:bg-slate-100 dark:hover:bg-white/[0.04]"
            }`}
          >
            {pathname.startsWith("/developer") && (
              <motion.span
                layoutId="navbar-active-pill"
                className="absolute inset-0 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-sm dark:shadow-none border border-slate-200/60 dark:border-white/5"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 notranslate" translate="no">
              API
            </span>
          </Link>

        </nav>

        <div className="hidden lg:flex items-center gap-2.5">
          <LanguageSwitcher variant="pill" />
          <ThemeToggle />
          <Link
            href="/demo"
            className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-white/5 shadow-[0_6px_15px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-1.5"
          >
            Coba Demo Gratis
          </Link>
          <Link
            href="/app/login"
            className="px-6 py-2.5 rounded-full bg-gradient-to-br from-[#2a9d8f] to-[#4fd1c5] text-white text-xs font-bold hover:shadow-[0_10px_30px_rgba(42,157,143,0.5)] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_20px_rgba(42,157,143,0.4)] flex items-center gap-1.5"
          >
            Masuk / Daftar
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button & Theme/Language Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher variant="compact" />
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu Navigasi Mobile"
            className="w-11 h-11 rounded-[14px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
            className="lg:hidden mt-2 bg-transparent overflow-y-auto max-h-[75vh] custom-scrollbar"
          >
            <div className="pt-4 pb-6 px-1 space-y-6">
              {/* Beranda Link */}
              <Link
                href="/"
                className="block px-3 py-2 text-base font-bold text-slate-800 dark:text-slate-100 hover:text-[#2a9d8f] dark:hover:text-[#4fd1c5]"
              >
                Beranda
              </Link>

              {/* Fitur Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-3 text-base font-bold text-slate-800 dark:text-slate-100">
                  <span>Pilihan Fitur Unggulan</span>
                  <Link
                    href="/fitur"
                    className="text-[11px] font-semibold text-[#2a9d8f] dark:text-[#4fd1c5]"
                  >
                    Lihat Semua
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {FEATURES_LIST.map((f) => {
                    const Icon = f.icon;
                    return (
                      <Link
                        key={f.slug}
                        href={f.href}
                        className="p-3 bg-white dark:bg-[#1f1f1f] rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-slate-50 dark:border-white/5 flex items-center gap-4 transition-transform hover:scale-[1.02]"
                      >
                        <div
                          className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-white ${f.gradient} ${f.shadow}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white notranslate" translate="no">
                            {f.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {f.desc.slice(0, 45)}...
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Demo Section Mobile */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/10">
                <div className="px-3 text-base font-bold text-slate-800 dark:text-slate-100">Akses Demo</div>
                <div className="grid grid-cols-1 gap-2.5">
                  {DEMO_LIST.map((d, i) => {
                    const Icon = d.icon;
                    return (
                      <Link
                        key={i}
                        href={d.href}
                        className="p-3 bg-white dark:bg-[#1f1f1f] rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-slate-50 dark:border-white/5 flex items-center gap-4 transition-transform hover:scale-[1.02]"
                      >
                        <div
                          className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-white ${d.gradient} ${d.shadow}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">
                            {d.title.includes("diBISAlitas") ? (
                              <>Demo Aplikasi <span className="notranslate" translate="no">diBISAlitas</span></>
                            ) : (
                              <>Demo Dashboard <span className="notranslate" translate="no">BiPANTAU</span></>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Menu Developer / API Mobile */}
              <Link
                href="/developer"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-bold text-slate-800 dark:text-slate-100 hover:text-[#2a9d8f] dark:hover:text-[#4fd1c5]"
              >
                Dokumentasi API & Widget
              </Link>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3 px-1">
                {/* Mobile Language Switcher Card */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-slate-100 dark:border-white/5 shadow-sm">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Bahasa / Language</span>
                  <LanguageSwitcher variant="pill" showIcon={false} />
                </div>

                <Link
                  href="/#video-demo"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#2a9d8f] dark:hover:text-[#4fd1c5] text-center"
                >
                  Tonton Video Demo
                </Link>
                <Link
                  href="/app/login"
                  className="block w-full py-3.5 text-center bg-gradient-to-br from-[#2a9d8f] to-[#4fd1c5] text-white font-bold rounded-2xl text-sm shadow-[0_8px_20px_rgba(42,157,143,0.3)]"
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
