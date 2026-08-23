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

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    readFromFile(file);
    // reset input agar file yang sama bisa dipilih lagi
    e.target.value = "";
  };

  return (
    <div className="min-h-full bg-white selection:bg-purple-500/20 flex flex-col pb-12 relative overflow-hidden">

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
              BiBACA
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Pemindai Teks
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
          {/* Camera / Preview Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-[24px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden relative group">

            <div className="absolute top-4 left-4 z-30 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]'}`}></span>
              <span className="text-white text-[10px] font-bold tracking-wider">
                {isProcessing ? 'MEMINDAI...' : capturedUrl ? 'FOTO SIAP' : 'SIAP'}
              </span>
            </div>

            <div className="relative z-10 w-full min-h-[350px] bg-slate-900 flex flex-col items-center justify-center">
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

              {/* Foto diam yang sudah ditangkap / diunggah */}
              {capturedUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capturedUrl}
                  alt="Foto yang dipindai"
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              )}

              {!isCameraReady && !error && !capturedUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-20">
                  <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-3"></div>
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
                    className="absolute inset-0 z-40 bg-purple-900/60 backdrop-blur-sm flex flex-col items-center justify-center"
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
                className="w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
              >
                <ImageIcon className="w-5 h-5 text-purple-600" strokeWidth={2.4} />
              </button>

              {capturedUrl && !isProcessing ? (
                /* Tombol Pindai Ulang (kembali ke kamera live) */
                <button
                  onClick={reset}
                  aria-label="Pindai ulang"
                  className="w-16 h-16 bg-white rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.2)] flex items-center justify-center active:scale-90 transition-transform border-[4px] border-purple-500/20"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-white" />
                  </div>
                </button>
              ) : (
                /* Tombol Ambil Foto */
                <button
                  onClick={captureAndRead}
                  disabled={isProcessing || !isCameraReady}
                  aria-label="Ambil foto & pindai teks"
                  className="w-16 h-16 bg-white rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.2)] flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50 disabled:scale-100 border-[4px] border-purple-500/20"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <ScanText className="w-5 h-5 text-white" />
                  </div>
                </button>
              )}

              {/* Spacer agar tombol tengah tetap center */}
              <div className="w-12 h-12" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Info & Status Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="flex flex-col items-center">

              {scannedText ? (
                <div className="w-full text-center space-y-3" aria-live="polite" aria-atomic="true">
                  <button
                    onClick={() => (isSpeaking ? stopSpeaking() : speak(scannedText))}
                    aria-label={isSpeaking ? "Hentikan suara" : "Bacakan teks"}
                    className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 active:scale-90 transition-transform"
                  >
                    <Volume2 className={`w-6 h-6 text-purple-600 ${isSpeaking ? "animate-pulse" : ""}`} strokeWidth={2.5} />
                  </button>
                  <h2 className="text-[17px] font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Hasil Bacaan
                  </h2>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl max-h-[150px] overflow-y-auto text-left w-full shadow-inner">
                    <p className="text-[14px] text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                      {scannedText}
                    </p>
                  </div>
                  <button
                    onClick={reset}
                    className="text-[13px] font-bold text-purple-600 underline underline-offset-2 mt-1"
                  >
                    Pindai teks baru
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <Glasses className="w-6 h-6 text-purple-500" strokeWidth={2.5} />
                  </div>

                  <div className="text-center space-y-2 mb-2">
                    <h2 className="text-[18px] font-extrabold text-slate-800 tracking-tight">
                      Arahkan & Pindai
                    </h2>
                    <p className="text-[13px] font-medium text-slate-500 max-w-[280px] mx-auto leading-relaxed">
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
