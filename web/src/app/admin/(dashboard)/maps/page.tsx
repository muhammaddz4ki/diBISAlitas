"use client";

import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";

// Dynamic import with SSR false is crucial for Leaflet
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-50 rounded-3xl animate-pulse flex items-center justify-center border border-slate-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#00B894] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium text-sm">Memuat Peta Spasial...</p>
      </div>
    </div>
  ),
});

export default function MapsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <div className="p-2.5 bg-[#00B894]/10 rounded-xl text-[#00B894]">
              <MapIcon className="w-6 h-6" />
            </div>
            Peta Sebaran Rintangan
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Visualisasi spasial dan klasterisasi kepadatan laporan rintangan fasilitas publik secara real-time.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 border border-slate-50 relative z-0">
        <MapComponent />
      </div>
    </div>
  );
}
