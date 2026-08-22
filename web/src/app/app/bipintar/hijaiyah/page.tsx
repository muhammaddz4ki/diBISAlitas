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
        
        {/* Tombol Kembali (Desain Minimalis Premium) */}
        <div className="absolute top-12 left-6 z-30">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.12)] text-slate-800 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-6 h-6" />
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

        {/* Panel Hasil Deteksi (Result Card Premium) */}
        <div className="absolute bottom-8 left-6 right-6 z-30 pointer-events-none">
          <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_48px_rgba(0,0,0,0.2)] flex flex-col items-center">
            {detectionResult ? (
              <>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  TERDETEKSI
                </span>
                <h2 
                  className="text-[80px] leading-none font-medium text-[#00B894] mb-2"
                  style={{ fontFamily: "Arial, sans-serif" }} // Standard Arabic Font Fallback
                >
                  {detectionResult.label.arabic}
                </h2>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {detectionResult.label.indo}
                </h3>
                <div className="flex items-center gap-2 mt-4 bg-slate-50 px-4 py-2 rounded-full">
                  <span className="text-xs font-semibold text-slate-500">Akurasi</span>
                  <span className="text-sm font-bold text-[#00B894]">
                    {(detectionResult.score * 100).toFixed(1)}%
                  </span>
                </div>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  STATUS
                </span>
                <h3 className="text-xl font-bold text-slate-800">
                  {isModelLoading ? "Menyiapkan AI..." : "Mencari Isyarat..."}
                </h3>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
