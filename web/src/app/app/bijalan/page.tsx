"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Volume2, Info } from "lucide-react";
import dynamic from "next/dynamic";
import { motion, Variants } from "framer-motion";

// Memastikan component menggunakan object navigator kamera hanya dirender di klien
const BijalanCameraDetector = dynamic(
  () => import("@/components/BijalanCameraDetector"),
  {
    ssr: false, loading: () => (
      <div className="w-full h-[400px] bg-slate-100 animate-pulse flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1B9981]/30 border-t-[#1B9981] rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium text-[13px]">Menyiapkan Kamera AI...</p>
      </div>
    )
  }
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

export default function BijalanScreen() {
  return (
    <div className="min-h-full bg-white selection:bg-[#1B9981]/20 flex flex-col pb-12 relative overflow-hidden">

      {/* Header — Minimal White */}
      <div className="px-6 pt-12 pb-4 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between">
          <Link
            href="/app/dashboard"
            aria-label="Kembali ke dashboard"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" strokeWidth={2.5} />
          </Link>

          <div className="text-center">
            <h1 className="text-[18px] font-black text-slate-900 tracking-tight">
              BiJALAN Indoor
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Deteksi Rintangan
            </p>
          </div>

          <div className="w-11 h-11" />
        </div>
      </div>

      <main className="flex-1 w-full px-5 pt-4 relative z-20 flex flex-col gap-4 pb-4">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5"
        >
          {/* Camera Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-[24px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden relative group">

            {/* Indikator "Live/Rekaman" ala UI Kamera */}
            <div className="absolute top-4 left-4 z-30 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
              <span className="text-white text-[10px] font-bold tracking-wider">LIVE AI</span>
            </div>

            {/* Frame Sudut Kamera (Estetika Scanner) */}
            <div className="absolute inset-0 z-20 pointer-events-none p-4">
              <div className="w-full h-full border-2 border-white/10 rounded-[12px] relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#1B9981]/70 rounded-tl-[12px]"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#1B9981]/70 rounded-tr-[12px]"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#1B9981]/70 rounded-bl-[12px]"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#1B9981]/70 rounded-br-[12px]"></div>
              </div>
            </div>

            {/* Render Kamera Asli */}
            <div className="relative z-10 w-full min-h-[400px] bg-slate-900 flex">
              <BijalanCameraDetector />
            </div>

          </motion.div>

          {/* Info & Status Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="flex flex-col items-center">

              <div className="w-12 h-12 bg-[#1B9981]/10 rounded-full flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6 text-[#1B9981]" strokeWidth={2.5} />
              </div>

              <div className="text-center space-y-2 mb-6">
                <h2 className="text-[20px] font-extrabold text-slate-800 tracking-tight">
                  Pemandu Audio Aktif
                </h2>
                <p className="text-[13px] font-medium text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                  Arahkan kamera lurus ke depan. Sistem AI akan memberitahu Anda benda apa saja yang ada di jalur Anda melalui suara.
                </p>
              </div>

              <div className="w-full bg-emerald-50 border border-emerald-100/50 rounded-[16px] p-4 flex items-center justify-center gap-3 shadow-inner">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1B9981]"></span>
                </div>
                <span className="text-[13px] font-bold text-[#1B9981] tracking-wide">
                  Mendeteksi Rintangan...
                </span>
              </div>

              {/* Note tambahan untuk aksesibilitas */}
              <div className="mt-5 flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-slate-500 leading-snug">
                  Pastikan volume perangkat Anda cukup keras untuk mendengar instruksi arah dengan jelas.
                </p>
              </div>

            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}