"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Volume2, Info, Navigation } from "lucide-react";
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
    <div className="min-h-[100dvh] bg-[#f4f6fc] selection:bg-[#1B9981]/20 flex flex-col pb-4 relative overflow-x-hidden">

      {/* Header — Sticky 3D Neumorphism */}
      <div className="sticky top-0 z-50 px-6 pt-5 pb-5 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B9981] to-[#00D4AA] flex items-center justify-center shrink-0 bubble-3d text-white">
              <Navigation className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2.5} />
            </div>
            <div>

              <h1 className="text-[24px] font-black text-slate-800 tracking-tight leading-tight text-3d">BiJALAN Indoor</h1>
              <p className="text-slate-500 text-[13px] leading-snug line-clamp-2 max-w-[240px] mt-0.5 text-3d">
                Deteksi rintangan jalan secara real-time.
              </p>
            </div>
          </div>
          
          <Link
            href="/app/dashboard"
            aria-label="Kembali"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white active:scale-95 transition-transform shrink-0 mt-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#1B9981]" strokeWidth={3} />
          </Link>
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
          <motion.div variants={itemVariants} className="bg-[#f4f6fc] rounded-[32px] p-2 shadow-3d border border-white overflow-hidden relative group">
            
            <div className="rounded-[24px] overflow-hidden relative w-full min-h-[400px] bg-slate-900 flex shadow-inner">
              {/* Indikator "Live/Rekaman" ala UI Kamera */}
              <div className="absolute top-4 left-4 z-30 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                <span className="text-white text-[10px] font-bold tracking-wider">LIVE AI</span>
              </div>



              {/* Render Kamera Asli */}
              <div className="relative z-10 w-full h-full flex flex-1">
                <BijalanCameraDetector />
              </div>
            </div>

          </motion.div>

          {/* Info & Status Section */}
          <motion.div variants={itemVariants} className="bg-[#f4f6fc] rounded-[32px] p-6 shadow-3d border border-white">
            <div className="flex flex-col items-center">

              <div className="w-14 h-14 bg-[#f4f6fc] rounded-full flex items-center justify-center mb-4 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white">
                <Volume2 className="w-7 h-7 text-[#1B9981] drop-shadow-sm" strokeWidth={2.5} />
              </div>

              <div className="text-center space-y-2 mb-6">
                <h2 className="text-[20px] font-black text-slate-800 tracking-tight text-3d">
                  Pemandu Audio Aktif
                </h2>
                <p className="text-[13px] font-bold text-slate-500 max-w-[280px] mx-auto leading-relaxed text-3d">
                  Arahkan kamera lurus ke depan. Sistem AI akan memberitahu Anda benda apa saja yang ada di jalur Anda melalui suara.
                </p>
              </div>

              <div className="w-full bg-[#f4f6fc] border border-white rounded-[20px] p-4 flex items-center justify-center gap-3 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)]">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B9981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D4AA]"></span>
                </div>
                <span className="text-[13px] font-black text-[#1B9981] tracking-wide">
                  Mendeteksi Rintangan...
                </span>
              </div>

              {/* Note tambahan untuk aksesibilitas */}
              <div className="mt-5 flex items-start gap-2 bg-[#f4f6fc] p-4 rounded-[20px] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1),_inset_-1px_-1px_3px_rgba(255,255,255,1)] border border-white/50">
                <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5 drop-shadow-sm" strokeWidth={2.5} />
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed text-3d">
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
