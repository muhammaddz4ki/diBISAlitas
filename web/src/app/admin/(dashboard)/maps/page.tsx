"use client";

import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";

// Dynamic import with SSR false is crucial for Leaflet
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] neo-pressed rounded-3xl animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#00B894] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-extrabold text-sm tracking-wide">Memuat Peta Spasial...</p>
      </div>
    </div>
  ),
});

export default function MapsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="flex gap-4 sm:gap-5">
          <div className="p-3.5 sm:p-4 neo-icon-btn rounded-2xl text-[#00B894] h-fit shrink-0">
            <MapIcon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <div className="pt-1 sm:pt-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Peta Sebaran Rintangan
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm sm:text-base font-medium leading-relaxed">
              Visualisasi spasial dan klasterisasi kepadatan laporan rintangan fasilitas publik secara real-time
            </p>
          </div>
        </div>
      </header>

      <div className="neo-flat p-4 sm:p-6 overflow-hidden relative z-0">
        <MapComponent />
      </div>
    </div>
  );
}
