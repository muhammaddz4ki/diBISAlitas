"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

// Leaflet must be loaded client-side only (no SSR)
const PetaMapComponent = dynamic(() => import("./PetaMapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full flex-1 bg-slate-50/50 rounded-[24px] animate-pulse flex items-center justify-center min-h-[400px] border border-slate-100">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner disesuaikan dengan warna toska baru */}
        <div className="w-10 h-10 border-4 border-[#1B9981]/30 border-t-[#1B9981] rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-[13px] tracking-wide">Memuat Peta...</p>
      </div>
    </div>
  ),
});

export default function PetaPage() {
  return (
    <div className="min-h-full bg-white selection:bg-[#1B9981]/20 flex flex-col pb-12">
      {/* Header — Minimal White */}
      <div className="px-6 pt-14 pb-5 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#00B894]/10 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-[#00B894]" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-widest">diBISAlitas</p>
            <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">Peta Komunitas</h1>
            <p className="text-slate-400 text-[12px] font-medium mt-0.5">Rintangan &amp; jalur aman dilaporkan bersama</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 relative z-20 flex flex-col gap-4 pb-4 flex-1">
        {/* Legend Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[24px] px-5 py-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center gap-4"
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Legenda</span>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 opacity-80 shadow-sm" />
              <span className="text-[12px] font-semibold text-slate-600">Bahaya</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-90 shadow-sm" />
              <span className="text-[12px] font-semibold text-slate-600">Waspada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00B894] shadow-sm" />
              <span className="text-[12px] font-semibold text-slate-600">1 laporan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
              <span className="text-[12px] font-semibold text-slate-600">Lokasi Anda</span>
            </div>
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, type: "spring" }}
          className="flex-1 bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden min-h-[450px] relative"
        >
          <PetaMapComponent />
        </motion.div>
      </div>
    </div>
  );
}