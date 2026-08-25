"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Smartphone,
  LayoutDashboard,
  ShieldAlert,
  BarChart,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Navigation,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
  Eye,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";

export default function DemoHubPage() {

  return (
    <div className="min-h-screen bg-[#FDFEFE] dark:bg-[#090e17] text-slate-800 dark:text-slate-100 selection:bg-[#1B9981]/20 transition-colors duration-300">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#1B9981]/15 via-[#00D4AA]/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B9981]/10 dark:bg-[#1B9981]/20 border border-[#1B9981]/20 text-[#1B9981] dark:text-[#00D4AA] text-xs font-bold uppercase tracking-wider">
            <Unlock className="w-3.5 h-3.5" /> Akses Demo Instan Tanpa Hambatan
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Pusat Demo Ekosistem <br />
            <span className="text-[#1B9981] dark:text-[#00D4AA]">diBISAlitas Platform</span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Pilih pengalaman demo yang ingin Anda coba di bawah ini. Anda dapat mencoba aplikasi pengguna langsung tanpa perlu mendaftar atau masuk ke dashboard monitoring BiPANTAU.
          </p>
        </div>
      </section>

      {/* 2 Primary Demo Cards: App Demo & BiPANTAU Admin Demo */}
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. App Demo Card */}
          <div
            id="app-demo"
            className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-slate-950/60 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#1B9981]/5 dark:bg-[#1B9981]/10 pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-[#1B9981]/10 dark:bg-[#1B9981]/20 text-[#1B9981] dark:text-[#00D4AA] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> Mode Pengguna (Tamu Demo)
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                  Tanpa Perlu Login
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-[#1B9981] dark:group-hover:text-[#00D4AA] transition-colors">
                  Demo Aplikasi diBISAlitas
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-2">
                  Akses langsung ke seluruh fitur aplikasi (biSAPA penerjemah isyarat kamera, biBACA pembaca teks OCR, biJALAN navigasi spasial, biSAFE tombol darurat, dan biPINTAR modul belajar) dengan status akun tamu terverifikasi otomatis.
                </p>
              </div>

              {/* Module Quick Shortcuts */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Pintasan Modul Aplikasi:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: "Dashboard", href: "/app/dashboard?demo=true", color: "text-[#1B9981] dark:text-[#00D4AA]" },
                    { name: "BiSAPA Isyarat", href: "/app/bisapa", color: "text-amber-600 dark:text-amber-400" },
                    { name: "BiBACA Scanner", href: "/app/bibaca", color: "text-purple-600 dark:text-purple-400" },
                    { name: "BiJALAN Kamera", href: "/app/bijalan", color: "text-sky-600 dark:text-sky-400" },
                    { name: "BiSAFE Darurat", href: "/app/bisafe", color: "text-rose-600 dark:text-rose-400" },
                    { name: "BiPINTAR Kuis", href: "/app/bipintar", color: "text-emerald-600 dark:text-emerald-400" },
                  ].map((m, idx) => (
                    <Link
                      key={idx}
                      href={m.href}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className={m.color}>{m.name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
              <Link
                href="/app/dashboard?demo=true"
                className="flex-1 text-center py-4 px-6 rounded-2xl bg-[#1B9981] text-white font-extrabold text-sm hover:bg-[#168C74] transition-all shadow-lg shadow-[#1B9981]/25 flex items-center justify-center gap-2"
              >
                <span>Buka Aplikasi Utama (Tanpa Login)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 2. BiPANTAU Dashboard Demo Card */}
          <div
            id="pantau-demo"
            className="bg-slate-900 dark:bg-[#0B1120] text-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#00D4AA]/10 pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-[#00D4AA] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" /> Command Center Pemda &amp; Relawan
                </span>
                <span className="text-[11px] font-bold text-[#00D4AA] bg-[#00D4AA]/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                  Live GIS Monitoring
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#00D4AA] transition-colors">
                  Demo Dashboard BiPANTAU
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed mt-2">
                  Pantau peta rintangan aksesibilitas kota, periksa sebaran laporan jalur tunanetra/kursi roda yang rusak, serta lakukan moderasi status rintangan secara real-time seperti yang digunakan pengelola kota.
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-2.5 pt-2">
                {[
                  "Visualisasi pemetaan rintangan interaktif Leaflet GIS",
                  "Manajemen tiket dan verifikasi laporan warga kota",
                  "Riwayat audit status kelayakan fasilitas publik",
                ].map((hl, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00D4AA] shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-800 flex flex-wrap items-center gap-3">
              <Link
                href="/admin/rintangan?demo=true"
                className="flex-1 text-center py-4 px-6 rounded-2xl bg-[#00D4AA] text-slate-950 font-extrabold text-sm hover:bg-[#00D4AA]/90 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Masuk Dashboard BiPANTAU Admin</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/dashboard?demo=true"
                className="py-4 px-5 rounded-2xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all text-center"
              >
                Statistik Global
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FloatingAccessibility />
    </div>
  );
}
