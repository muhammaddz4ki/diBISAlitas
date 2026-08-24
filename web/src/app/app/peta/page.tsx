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
        <p className="text-slate-500 font-medium text-[13px] tracking-wide">Memuat Peta...</p>
      </div>
    </div>
  ),
});

export default function PetaPage() {
  return (
    <div className="min-h-full bg-[#f4f6fc] selection:bg-[#1B9981]/20 flex flex-col pb-24">
      {/* Header — Sticky 3D Neumorphism */}
      <div className="sticky top-0 z-50 px-6 pt-14 pb-6 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00B894] to-[#00D4AA] flex items-center justify-center shrink-0 bubble-3d text-white">
            <MapPin className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2.5} />
          </div>
          <div>

            <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-tight text-3d">Peta Komunitas</h1>
            <p className="text-slate-500 text-[13px] font-medium mt-0.5 text-3d">Rintangan &amp; jalur aman dilaporkan bersama</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 relative z-20 flex flex-col gap-4 pb-4 flex-1">
        {/* Legend Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-transparent rounded-[24px] px-5 py-4 shadow-3d border border-white flex items-center gap-4"
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 text-3d">Legenda</span>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#f4f6fc] px-2 py-1 rounded-[10px] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),_inset_-2px_-2px_4px_rgba(255,255,255,1)]">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 opacity-80 shadow-sm" />
              <span className="text-[12px] font-semibold text-slate-600 text-3d">Bahaya</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f4f6fc] px-2 py-1 rounded-[10px] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),_inset_-2px_-2px_4px_rgba(255,255,255,1)]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-90 shadow-sm" />
              <span className="text-[12px] font-semibold text-slate-600 text-3d">Waspada</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f4f6fc] px-2 py-1 rounded-[10px] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),_inset_-2px_-2px_4px_rgba(255,255,255,1)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00B894] shadow-sm" />
              <span className="text-[12px] font-semibold text-slate-600 text-3d">1 laporan</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f4f6fc] px-2 py-1 rounded-[10px] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),_inset_-2px_-2px_4px_rgba(255,255,255,1)]">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
              <span className="text-[12px] font-semibold text-slate-600 text-3d">Lokasi Anda</span>
            </div>
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, type: "spring" }}
          className="flex-1 bg-[#f4f6fc] rounded-[24px] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.06),_inset_-4px_-4px_10px_rgba(255,255,255,1)] border border-white overflow-hidden min-h-[450px] relative p-1"
        >
          <div className="w-full h-full rounded-[20px] overflow-hidden">
            <PetaMapComponent />
          </div>
        </motion.div>
      </div>
    </div>
  );
}