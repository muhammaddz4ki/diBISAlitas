"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useYolo } from "../../../../hooks/useYolo";
import { CameraDetector } from "../../../../components/CameraDetector";
import { HIJAIYAH_LABELS } from "../../../../constants/signLabels";

/**
 * Halaman Utama (Screen) Deteksi Isyarat Hijaiyah YOLOv8.
 * Murni bertugas sebagai layout presentasional tanpa logika AI yang berantakan.
 */
export default function HijaiyahSignWebScreen() {
  const router = useRouter();
  
  // Custom hook memuat seluruh logika model AI dan manajemen state secara bersih
  const { isModelLoading, error, detections, detectionResult, detectFrame } = useYolo(
    "/models/Hijayah/model.onnx",
    HIJAIYAH_LABELS
  );

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center font-sans">
      <div className="w-full max-w-[450px] h-screen sm:h-[850px] bg-black sm:rounded-[40px] sm:shadow-[0_24px_80px_rgba(0,0,0,0.12)] relative overflow-hidden flex flex-col">
        
        {/* Tombol Kembali (3D Neumorphism) */}
        <div className="absolute top-12 left-6 z-30">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 flex items-center justify-center bg-[#f4f6fc]/90 backdrop-blur-md rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.25)] border border-white/80 text-slate-800 transition-all pointer-events-auto active:scale-95"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-6 h-6 drop-shadow-sm" strokeWidth={2.5} />
          </button>
        </div>

        {/* Modul Kamera Terisolasi */}
        <CameraDetector
          isModelLoading={isModelLoading}
          error={error}
          detectFrame={detectFrame}
          detectionResult={detectionResult}
          detections={detections}
        />

        {/* Panel Hasil Deteksi (Result Card 3D Neumorphism) */}
        <div className="absolute bottom-8 left-6 right-6 z-30 pointer-events-none">
          <div className="bg-[#f4f6fc]/90 backdrop-blur-xl rounded-[32px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/80 flex flex-col items-center">
            {detectionResult ? (
              <>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 text-3d">
                  TERDETEKSI
                </span>
                <h2 
                  className="text-[80px] leading-none font-bold text-[#1B9981] mb-2 drop-shadow-md"
                  style={{ fontFamily: "Arial, sans-serif" }} // Standard Arabic Font Fallback
                >
                  {detectionResult.label.arabic}
                </h2>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight text-3d">
                  {detectionResult.label.indo}
                </h3>
                <div className="flex items-center gap-2 mt-5 bg-[#f4f6fc] border border-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] px-5 py-2 rounded-full">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Akurasi</span>
                  <span className="text-[13px] font-black text-[#1B9981]">
                    {(detectionResult.score * 100).toFixed(1)}%
                  </span>
                </div>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 text-3d">
                  STATUS
                </span>
                <div className="flex items-center gap-3">
                  {isModelLoading && (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B9981] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D4AA]"></span>
                    </span>
                  )}
                  <h3 className="text-lg font-black text-slate-800 text-3d">
                    {isModelLoading ? "Menyiapkan AI..." : "Mencari Isyarat..."}
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
