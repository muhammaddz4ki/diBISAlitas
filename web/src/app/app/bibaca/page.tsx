"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Glasses,
  ScanText,
  Volume2,
  Info,
  CheckCircle2,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useBibaca } from "@/hooks/useBibaca";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

export default function BibacaScreen() {
  const {
    videoRef,
    canvasRef,
    isCameraReady,
    isProcessing,
    isSpeaking,
    scannedText,
    capturedUrl,
    progress,
    error,
    startCamera,
    stopCamera,
    captureAndRead,
    readFromFile,
    speak,
    stopSpeaking,
    reset,
  } = useBibaca();

  const tSelection = "selection:bg-purple-500/20";
  const tText = "text-purple-600";
  const tBgIndicator = "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]";
  const tSpinner = "border-purple-500/30 border-t-purple-500";
  const tOverlay = "bg-purple-900/60";
  const tBgBtn = "bg-purple-500";

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance("Kamera sedang disiapkan, mohon tunggu");
      u.lang = "id-ID";
      window.speechSynthesis.speak(u);
    }
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    readFromFile(file);
    e.target.value = "";
  };

  return (
    <div className={`min-h-[100dvh] bg-[#f4f6fc] ${tSelection} flex flex-col pb-4 relative overflow-x-hidden`}>
      <div className="sticky top-0 z-50 px-6 pt-5 pb-5 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0 bubble-3d text-white">
              <Glasses className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2.5} />
            </div>
            <div>

              <h1 className="text-[24px] font-black text-slate-800 tracking-tight leading-tight text-3d">BiBACA</h1>
              <p className="text-slate-500 text-[13px] leading-snug line-clamp-2 max-w-[240px] mt-0.5 text-3d">
                Pemindai Teks Pintar
              </p>
            </div>
          </div>
          
          <Link
            href="/app/dashboard"
            aria-label="Kembali"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white active:scale-95 transition-transform shrink-0 mt-2"
          >
            <ArrowLeft className={`w-4 h-4 ${tText}`} strokeWidth={3} />
          </Link>
        </div>
      </div>

      <main className="flex-1 w-full px-5 pt-4 relative z-20 flex flex-col gap-4 pb-2">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5"
        >
          {/* Camera / Preview Card */}
          <motion.div variants={itemVariants} className="bg-[#f4f6fc] rounded-[32px] p-2 shadow-3d border border-white overflow-hidden relative group">
            
            <div className="rounded-[24px] overflow-hidden relative w-full min-h-[380px] bg-slate-900 flex flex-col shadow-inner">
              <div className="absolute top-4 left-4 z-30 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]' : tBgIndicator}`}></span>
                <span className="text-white text-[10px] font-bold tracking-wider">
                  {isProcessing ? 'MEMINDAI...' : capturedUrl ? 'FOTO SIAP' : 'SIAP'}
                </span>
              </div>

              <div className="relative z-10 w-full h-full flex-1 flex flex-col items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                aria-label="Tampilan kamera langsung untuk memindai teks"
                aria-hidden={!!capturedUrl}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {capturedUrl && (
                <img
                  src={capturedUrl}
                  alt="Foto yang dipindai"
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              )}

              {!isCameraReady && !error && !capturedUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-20">
                  <div className={`w-10 h-10 border-4 ${tSpinner} rounded-full animate-spin mb-3`}></div>
                  <p className="text-white font-medium text-[13px]">Mengakses Kamera...</p>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-30 p-6 text-center">
                  <Info className="w-10 h-10 text-rose-500 mb-3" />
                  <p className="text-white font-medium text-[13px]">{error}</p>
                  <div className="mt-4 flex items-center gap-2">
                    {capturedUrl ? (
                      <button
                        onClick={reset}
                        className="px-4 py-2 bg-white/10 border border-white/30 rounded-full text-white text-[12px] font-bold active:scale-95 transition-transform"
                      >
                        Pindai Ulang
                      </button>
                    ) : (
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-white/10 border border-white/30 rounded-full text-white text-[12px] font-bold active:scale-95 transition-transform"
                      >
                        Coba Lagi
                      </button>
                    )}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 z-40 ${tOverlay} backdrop-blur-sm flex flex-col items-center justify-center`}
                  >
                    <div className="w-16 h-16 relative flex items-center justify-center mb-4">
                      <svg className="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <p className="text-white font-bold tracking-widest text-[14px] uppercase mb-2">Membaca Teks</p>
                    <div className="w-48 bg-white/20 rounded-full h-1.5 mb-1 overflow-hidden">
                      <div className="bg-white h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress * 100}%` }}></div>
                    </div>
                    <p className="text-white/80 text-[10px] font-bold">{(progress * 100).toFixed(0)}% Selesai</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hidden file input untuk galeri / kamera perangkat */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

              {/* Kontrol bawah: Galeri + Pindai / Pindai Ulang */}
              <div className="absolute bottom-6 left-0 w-full flex items-center justify-center gap-8 z-30">
                {/* Tombol Galeri */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  aria-label="Pilih dari galeri"
                  className="w-12 h-12 bg-[#f4f6fc] border border-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
                >
                  <ImageIcon className={`w-5 h-5 ${tText} drop-shadow-sm`} strokeWidth={2.4} />
                </button>

                {capturedUrl && !isProcessing ? (
                  /* Tombol Pindai Ulang (kembali ke kamera live) */
                  <button
                    onClick={reset}
                    aria-label="Pindai ulang"
                    className="w-16 h-16 bg-[#f4f6fc] rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.6)] flex items-center justify-center active:scale-90 transition-transform border-4 border-white"
                  >
                    <div className={`w-12 h-12 ${tBgBtn} rounded-full flex items-center justify-center shadow-inner`}>
                      <RotateCcw className="w-5 h-5 text-white" />
                    </div>
                  </button>
                ) : (
                  /* Tombol Ambil Foto */
                  <button
                    onClick={captureAndRead}
                    disabled={isProcessing || !isCameraReady}
                    aria-label="Ambil foto & pindai teks"
                    className="w-16 h-16 bg-[#f4f6fc] rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.6)] flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50 disabled:scale-100 border-4 border-white"
                  >
                    <div className={`w-12 h-12 ${tBgBtn} rounded-full flex items-center justify-center shadow-inner`}>
                      <ScanText className="w-5 h-5 text-white" />
                    </div>
                  </button>
                )}

                {/* Spacer agar tombol tengah tetap center */}
                <div className="w-12 h-12" aria-hidden="true" />
              </div>
            </div>
          </motion.div>

          {/* Info & Status Section */}
          <motion.div variants={itemVariants} className="bg-[#f4f6fc] rounded-[32px] p-6 shadow-3d border border-white">
            <div className="flex flex-col items-center">

              {scannedText ? (
                <div className="w-full text-center space-y-3" aria-live="polite" aria-atomic="true">
                  <motion.button
                    whileTap={{ scale: 0.8 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => (isSpeaking ? stopSpeaking() : speak(scannedText))}
                    aria-label={isSpeaking ? "Hentikan suara" : "Bacakan teks"}
                    className={`w-[72px] h-[72px] ${tBgBtn} shadow-lg border-none rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Volume2 className={`w-9 h-9 text-white drop-shadow-md ${isSpeaking ? "animate-pulse text-white/50" : ""}`} strokeWidth={2.5} />
                  </motion.button>
                  <h2 className="text-[18px] font-black text-slate-800 tracking-tight flex items-center justify-center gap-2 text-3d">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-sm" /> Hasil Bacaan
                  </h2>
                  <div className="bg-[#f4f6fc] border border-white/50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] p-5 rounded-[24px] max-h-[180px] overflow-y-auto text-left w-full">
                    <p className="text-[14px] text-slate-700 leading-relaxed font-bold whitespace-pre-line text-3d">
                      {scannedText}
                    </p>
                  </div>
                  <button
                    onClick={reset}
                    className={`text-[13px] font-black ${tText} active:scale-95 transition-transform mt-3 text-3d inline-block px-6 py-2 rounded-full bg-[#f4f6fc] shadow-3d shadow-3d-active border border-white`}
                  >
                    Pindai teks baru
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white rounded-[16px] flex items-center justify-center mb-4">
                    <Glasses className={`w-7 h-7 ${tText} drop-shadow-sm`} strokeWidth={2.5} />
                  </div>

                  <div className="text-center space-y-2 mb-2">
                    <h2 className="text-[20px] font-black text-slate-800 tracking-tight text-3d">
                      Arahkan & Pindai
                    </h2>
                    <p className="text-[13px] font-bold text-slate-500 max-w-[280px] mx-auto leading-relaxed text-3d">
                      Arahkan kamera ke teks (buku, menu, papan nama) lalu tekan tombol pindai, atau pilih foto dari galeri. Pastikan teks jelas & fokus.
                    </p>
                  </div>
                </>
              )}

            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}

