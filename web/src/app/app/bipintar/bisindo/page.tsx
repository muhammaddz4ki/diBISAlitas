"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Scan } from "lucide-react";
import { useBisindoDetection } from "../../../../hooks/useBisindoDetection";
import { BisindoCameraDetector } from "../../../../components/BisindoCameraDetector";
import { BISINDO_LABELS } from "../../../../constants/bisindoLabels";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Halaman Utama (Screen) Deteksi Isyarat BISINDO YOLOv8.
 * Murni bertugas sebagai layout presentasional tanpa logika AI yang berantakan.
 */
export default function BisindoSignWebScreen() {
  const router = useRouter();

  // Custom hook memuat seluruh logika model AI dan manajemen state secara bersih
  const { isModelLoading, error, detections, detectionResult, detectFrame } = useBisindoDetection(
    "/models/Bisindo/model.onnx",
    BISINDO_LABELS
  );

  // Menentukan warna aksen berdasarkan tipe deteksi (Kata vs Huruf)
  const brandColor = detectionResult?.label.isWord ? "#0984E3" : "#1B9981";

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans selection:bg-[#1B9981]/20">
      <div className="w-full max-w-[450px] h-screen sm:h-[850px] bg-black sm:rounded-[2.5rem] sm:shadow-2xl relative overflow-hidden flex flex-col sm:border-[8px] sm:border-slate-900">

        {/* Modul Kamera Terisolasi (berada di lapisan paling bawah) */}
        <div className="absolute inset-0 z-0">
          <BisindoCameraDetector
            isModelLoading={isModelLoading}
            error={error}
            detectFrame={detectFrame}
            detectionResult={detectionResult}
            detections={detections}
          />
        </div>

        {/* HUD (Head-Up Display) Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 px-6 pt-12 pb-6 flex items-start justify-between pointer-events-none bg-gradient-to-b from-black/60 via-black/20 to-transparent">
          {/* Tombol Kembali */}
          <button
            onClick={() => router.back()}
            className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all shadow-sm -webkit-tap-highlight-color-transparent pointer-events-auto"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>


        </div>

        {/* Scanner Overlay Frame (Efek Visual AI Scanner) */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className={`w-[280px] h-[280px] relative -mt-20 transition-all duration-500 ${!detectionResult && !isModelLoading ? 'animate-pulse' : ''}`}>
            <div
              className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 rounded-tl-[24px] transition-colors duration-300 shadow-sm"
              style={{ borderColor: detectionResult ? brandColor : 'rgba(255,255,255,0.6)' }}
            />
            <div
              className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 rounded-tr-[24px] transition-colors duration-300 shadow-sm"
              style={{ borderColor: detectionResult ? brandColor : 'rgba(255,255,255,0.6)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 rounded-bl-[24px] transition-colors duration-300 shadow-sm"
              style={{ borderColor: detectionResult ? brandColor : 'rgba(255,255,255,0.6)' }}
            />
            <div
              className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 rounded-br-[24px] transition-colors duration-300 shadow-sm"
              style={{ borderColor: detectionResult ? brandColor : 'rgba(255,255,255,0.6)' }}
            />
          </div>
        </div>

        {/* Panel Hasil Deteksi (Result Card Premium) */}
        <div className="absolute bottom-8 left-6 right-6 z-30">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] p-6 shadow-[0_20px_48px_rgba(0,0,0,0.3)] flex flex-col items-center border border-white/40 min-h-[180px] justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {detectionResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex flex-col items-center w-full"
                >
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    {detectionResult.label.isWord ? "Kata Terdeteksi" : "Huruf Terdeteksi"}
                  </span>

                  <h2
                    className="text-[64px] leading-none font-black mb-3 tracking-tighter drop-shadow-sm"
                    style={{ color: brandColor, fontFamily: "Inter, system-ui, sans-serif" }}
                  >
                    {detectionResult.label.label}
                  </h2>

                  <div className="flex items-center gap-2 mt-2 bg-slate-50/80 px-4 py-2 rounded-full border border-slate-200/50 shadow-inner">
                    <Scan className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                    <span className="text-[12px] font-semibold text-slate-500">Akurasi</span>
                    <span className="text-[13px] font-bold drop-shadow-sm" style={{ color: brandColor }}>
                      {(detectionResult.score * 100).toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-4 w-full"
                >
                  {isModelLoading ? (
                    <>
                      <div className="w-10 h-10 border-4 border-[#1B9981]/20 border-t-[#1B9981] rounded-full animate-spin mb-4" />
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                        Sistem AI
                      </span>
                      <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
                        Menyiapkan Model...
                      </h3>
                    </>
                  ) : (
                    <>
                      <div className="relative flex h-10 w-10 items-center justify-center mb-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B9981] opacity-20"></span>
                        <Scan className="relative w-6 h-6 text-[#1B9981]" strokeWidth={2.5} />
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                        Status
                      </span>
                      <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
                        Mencari Isyarat...
                      </h3>
                      <p className="text-[12px] text-slate-500 mt-2 text-center font-medium max-w-[220px]">
                        Arahkan tangan ke area kamera untuk mulai mendeteksi
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}