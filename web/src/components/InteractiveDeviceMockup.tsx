"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  BarChart,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Navigation,
  Volume2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Search,
  Scan,
  Compass,
  Award,
  Hand,
} from "lucide-react";

export type FeatureKey = "bisafe" | "bipantau" | "bisapa" | "bibaca" | "bipintar" | "bijalan";

interface InteractiveDeviceMockupProps {
  activeFeature: FeatureKey;
  onSelectFeature?: (key: FeatureKey) => void;
  interactive?: boolean;
}

export default function InteractiveDeviceMockup({
  activeFeature,
  onSelectFeature,
  interactive = true,
}: InteractiveDeviceMockupProps) {
  // BiSAFE state
  const [bisafeTriggered, setBisafeTriggered] = useState(false);

  // BiSAPA state
  const [bisapaPhraseIndex, setBisapaPhraseIndex] = useState(0);
  const bisapaPhrases = [
    { letter: "TERIMA KASIH", conf: "98.4%", gesture: "Tangan terbuka dari dada ke depan" },
    { letter: "SELAMAT PAGI", conf: "97.1%", gesture: "Gerakan salam fajar terkoordinasi" },
    { letter: "TOLONG SAYA", conf: "99.2%", gesture: "Dua telapak tangan menengadah" },
    { letter: "SAMA-SAMA", conf: "96.8%", gesture: "Dua tangan melingkar halus" },
  ];

  // BiBACA state
  const [bibacaLineIndex, setBibacaLineIndex] = useState(0);
  const bibacaLines = [
    "PENGUMUMAN JALUR DISABILITAS: Jalur landai tersedia di sisi timur stasiun.",
    "LIFT KHUSUS KURSI RODA: Silakan tekan tombol bantuan darurat jika membutuhkan asisten.",
    "JADWAL PERJALANAN: Kereta api ramah disabilitas tiba pada peron 2 pukul 14:30 WIB.",
  ];

  // BiPINTAR state
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [xpEarned, setXpEarned] = useState(120);

  // Auto animation loops
  useEffect(() => {
    const interval = setInterval(() => {
      setBisapaPhraseIndex((prev) => (prev + 1) % bisapaPhrases.length);
      setBibacaLineIndex((prev) => (prev + 1) % bibacaLines.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handlePanicClick = () => {
    setBisafeTriggered(true);
  };

  return (
    <div className="relative mx-auto flex items-center justify-center">
      {/* Dynamic Ambient Background Glow */}
      <div
        className={`absolute -inset-10 rounded-[4rem] blur-3xl opacity-30 transition-all duration-700 pointer-events-none ${
          activeFeature === "bisafe"
            ? "bg-rose-500"
            : activeFeature === "bipantau"
            ? "bg-[#1B9981]"
            : activeFeature === "bisapa"
            ? "bg-amber-500"
            : activeFeature === "bibaca"
            ? "bg-purple-500"
            : activeFeature === "bipintar"
            ? "bg-emerald-500"
            : "bg-sky-500"
        }`}
      />

      {/* Realistic Smartphone Chassis */}
      <div className="relative w-[300px] sm:w-[320px] h-[610px] rounded-[3rem] bg-slate-900 p-3.5 shadow-[0_25px_80px_rgba(0,0,0,0.35)] border-4 border-slate-700/80">
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#1B9981] animate-pulse" />
        </div>

        {/* Screen Display Container */}
        <div className="w-full h-full bg-slate-950 rounded-[2.3rem] overflow-hidden flex flex-col relative text-slate-100 font-sans select-none">
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold text-slate-300 z-30">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span className="w-4 h-2 border border-slate-300 rounded-sm p-0.5 flex">
                <span className="h-full w-3/4 bg-[#1B9981] rounded-2xs" />
              </span>
            </div>
          </div>

          {/* Dynamic Interactive Screens based on Active Feature */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {/* 1. BiSAFE SCREEN */}
              {activeFeature === "bisafe" && (
                <motion.div
                  key="bisafe"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35 }}
                  className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-rose-950/40 via-slate-950 to-slate-950"
                >
                  <div className="text-center pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold tracking-wider uppercase">
                      <ShieldAlert className="w-3 h-3 animate-bounce" /> Mode Darurat Aktif
                    </span>
                    <h4 className="text-xl font-black text-white mt-2">BiSAFE SOS</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Satu Sentuhan Bantuan Cepat</p>
                  </div>

                  {/* Panic Button Interactive Area */}
                  <div className="my-auto flex flex-col items-center justify-center relative">
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                        className="absolute w-44 h-44 rounded-full bg-rose-600/30"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        className="absolute w-36 h-36 rounded-full bg-rose-600/40"
                      />

                      <button
                        onClick={handlePanicClick}
                        className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center font-extrabold text-white shadow-2xl transition-all ${
                          bisafeTriggered
                            ? "bg-rose-500 scale-95 ring-8 ring-rose-400/50"
                            : "bg-gradient-to-tr from-rose-600 to-rose-500 hover:scale-105 active:scale-95"
                        }`}
                      >
                        <ShieldAlert className="w-10 h-10 mb-1" />
                        <span className="text-xs tracking-wider">
                          {bisafeTriggered ? "TERKIRIM!" : "PANIC SOS"}
                        </span>
                      </button>
                    </div>

                    <p className="text-[11px] text-center text-slate-400 mt-5 max-w-[200px]">
                      {bisafeTriggered
                        ? "Koordinat GPS (Lat -6.2088, Lon 106.8456) telah dipancarkan ke Command Center."
                        : "Tekan tombol di atas untuk menyiarkan sinyal bahaya dan lokasi ke relawan."}
                    </p>
                  </div>

                  <div className="bg-slate-900/90 rounded-2xl p-3 border border-rose-500/20 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <div>
                        <div className="font-bold text-white text-[11px]">GPS Terkunci</div>
                        <div className="text-[10px] text-slate-400">Akurasi plus minus 1.8 Meter</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      Online
                    </span>
                  </div>
                </motion.div>
              )}

              {/* 2. BiPANTAU SCREEN */}
              {activeFeature === "bipantau" && (
                <motion.div
                  key="bipantau"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35 }}
                  className="flex-1 flex flex-col p-4 bg-slate-950 gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-[#1B9981] uppercase tracking-wider">
                        Command Center
                      </div>
                      <h4 className="font-bold text-white text-base">BiPANTAU Live</h4>
                    </div>
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#1B9981]/20 text-[#00D4AA] text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                      Live Feed
                    </span>
                  </div>

                  {/* Mini Map Simulator */}
                  <div className="h-32 bg-slate-900 rounded-2xl relative overflow-hidden border border-slate-800 p-2 flex flex-col justify-between">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: "radial-gradient(circle, #1B9981 1px, transparent 1px)",
                        backgroundSize: "16px 16px",
                      }}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-[#1B9981]/40 animate-ping" />

                    <div className="absolute top-4 left-6 flex items-center gap-1 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-md animate-bounce">
                      <AlertTriangle className="w-2.5 h-2.5" /> Rintangan
                    </div>
                    <div className="absolute bottom-5 right-6 flex items-center gap-1 bg-amber-500 text-slate-950 text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-md">
                      <MapPin className="w-2.5 h-2.5" /> Marka Rusak
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-300">
                      <span>Area: Sudirman - Thamrin</span>
                      <span className="font-mono text-[#00D4AA]">8 Titik Aktif</span>
                    </div>
                  </div>

                  {/* Incident List */}
                  <div className="space-y-2 flex-1 overflow-hidden">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Laporan Terbaru
                    </div>
                    {[
                      { title: "Trotoar Berlubang", loc: "Jl. MH Thamrin No. 12", time: "2m lalu", stat: "Verifikasi" },
                      { title: "Guiding Block Terhalang", loc: "Stasiun MRT Bundaran HI", time: "8m lalu", stat: "Selesai" },
                      { title: "Lampu Penyeberangan Rusak", loc: "Halte Dukuh Atas", time: "15m lalu", stat: "Proses" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white text-[11px]">{item.title}</div>
                          <div className="text-[9px] text-slate-400">{item.loc} - {item.time}</div>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            item.stat === "Selesai"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : item.stat === "Proses"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {item.stat}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 3. BiSAPA SCREEN */}
              {activeFeature === "bisapa" && (
                <motion.div
                  key="bisapa"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35 }}
                  className="flex-1 flex flex-col p-4 bg-slate-950 gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                        BISINDO AI Translator
                      </div>
                      <h4 className="font-bold text-white text-base">BiSAPA Real-Time</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                      ONNX Vision
                    </span>
                  </div>

                  {/* Camera AI Viewfinder */}
                  <div className="h-44 bg-slate-900 rounded-2xl relative overflow-hidden border border-slate-800 flex flex-col justify-between p-3">
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-28 h-28 border border-dashed border-amber-400/60 rounded-2xl flex flex-col items-center justify-center bg-amber-500/5">
                        <Hand className="w-10 h-10 text-amber-400" />
                        <div className="absolute -top-3 left-2 bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded">
                          Hand Landmark (21 Pts)
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-300">
                      <span className="font-mono">FPS: 30 - Res: 640x480</span>
                      <span className="text-amber-400 font-bold">Akurasi {bisapaPhrases[bisapaPhraseIndex].conf}</span>
                    </div>
                  </div>

                  {/* Output Translation Card */}
                  <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 p-3.5 rounded-2xl border border-amber-500/30 flex flex-col gap-1.5">
                    <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>Hasil Terjemahan:</span>
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <div className="text-base font-extrabold text-white">
                      &ldquo;{bisapaPhrases[bisapaPhraseIndex].letter}&rdquo;
                    </div>
                    <div className="text-[10px] text-slate-300">
                      {bisapaPhrases[bisapaPhraseIndex].gesture}
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-slate-500">
                    Mendukung percakapan 2 arah suara ke teks dan teks ke suara.
                  </div>
                </motion.div>
              )}

              {/* 4. BiBACA SCREEN */}
              {activeFeature === "bibaca" && (
                <motion.div
                  key="bibaca"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35 }}
                  className="flex-1 flex flex-col p-4 bg-slate-950 gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        Smart OCR Reader
                      </div>
                      <h4 className="font-bold text-white text-base">BiBACA Scanner</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                      Tesseract + TTS
                    </span>
                  </div>

                  {/* Document Scan Frame */}
                  <div className="h-44 bg-slate-900 rounded-2xl relative overflow-hidden border border-purple-500/30 p-3 flex flex-col justify-between">
                    <motion.div
                      animate={{ y: [0, 140, 0] }}
                      transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
                      className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_12px_#a855f7]"
                    />

                    <div className="space-y-1.5 pt-1">
                      <div className="h-2 w-3/4 bg-purple-400/40 rounded animate-pulse" />
                      <div className="h-2 w-full bg-slate-700 rounded" />
                      <div className="h-2 w-5/6 bg-purple-400/30 rounded" />
                      <div className="h-2 w-2/3 bg-slate-700 rounded" />
                    </div>

                    <div className="bg-slate-950/80 p-2 rounded-xl border border-purple-500/20 text-[10px] text-purple-200">
                      <span className="font-bold">OCR Terdeteksi: </span>
                      {bibacaLines[bibacaLineIndex]}
                    </div>
                  </div>

                  {/* Audio Speech Playback Box */}
                  <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-white">Suara Bahasa Indonesia</div>
                        <div className="text-[9px] text-slate-400">Kecepatan 1.0x - Nada Jernih</div>
                      </div>
                    </div>
                    <div className="flex items-end gap-0.5 h-4">
                      {[6, 12, 16, 8, 14, 10].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, h, 4] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                          className="w-1 bg-purple-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 5. BiPINTAR SCREEN */}
              {activeFeature === "bipintar" && (
                <motion.div
                  key="bipintar"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35 }}
                  className="flex-1 flex flex-col p-4 bg-slate-950 gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        Gamified E-Learning
                      </div>
                      <h4 className="font-bold text-white text-base">BiPINTAR Akademi</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                      <Award className="w-3 h-3" /> {xpEarned} XP
                    </span>
                  </div>

                  {/* Interactive Card */}
                  <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
                    <div className="text-xs font-bold text-white">
                      Tebak Isyarat Huruf dan Angka:
                    </div>
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex flex-col items-center justify-center shadow-inner">
                      <Hand className="w-8 h-8 text-emerald-400" />
                      <span className="text-[9px] font-bold text-emerald-300 mt-1">Gestur O</span>
                    </div>
                    <div className="text-center text-[11px] text-slate-300">
                      Apakah arti gestur tangan di atas?
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Huruf O / Angka 0", correct: true },
                        { label: "Huruf B", correct: false },
                      ].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setQuizAnswered(i);
                            if (opt.correct) setXpEarned((prev) => prev + 25);
                          }}
                          className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                            quizAnswered === i
                              ? opt.correct
                                ? "bg-emerald-500 text-white border-emerald-400"
                                : "bg-rose-500 text-white border-rose-400"
                              : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-white font-bold text-[11px]">Level 3: Pemula Mahir</div>
                      <div className="text-slate-400 text-[9px]">Kurikulum BISINDO dan Hijaiyah</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400">80% Selesai</span>
                  </div>
                </motion.div>
              )}

              {/* 6. BiJALAN SCREEN */}
              {activeFeature === "bijalan" && (
                <motion.div
                  key="bijalan"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35 }}
                  className="flex-1 flex flex-col p-4 bg-slate-950 gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                        Spatial Vision &amp; Haptic
                      </div>
                      <h4 className="font-bold text-white text-base">BiJALAN Radar</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold">
                      YOLOv8 + Haptic
                    </span>
                  </div>

                  {/* Street Camera Detector Simulation */}
                  <div className="h-44 bg-slate-900 rounded-2xl relative overflow-hidden border border-sky-500/30 p-2 flex flex-col justify-between">
                    <div className="absolute top-4 left-4 border-2 border-rose-500 rounded-lg p-1 bg-rose-500/10 text-[8px] font-black text-rose-400">
                      Tiang Listrik [1.2m]
                    </div>
                    <div className="absolute top-10 right-4 border-2 border-amber-500 rounded-lg p-1 bg-amber-500/10 text-[8px] font-black text-amber-400">
                      Pejalan Kaki [3.5m]
                    </div>
                    <div className="absolute bottom-4 left-1/3 border-2 border-rose-500 rounded-lg p-1 bg-rose-500/10 text-[8px] font-black text-rose-400 animate-pulse">
                      Lubang Trotoar [2.8m]
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <Compass className="w-3 h-3 text-sky-400" /> Arah: Utara (350°)
                      </span>
                      <span className="text-sky-300 font-bold">Haptic: Getar Kiri</span>
                    </div>

                    <div className="relative z-10 flex items-center justify-center gap-1">
                      <div className="w-2 h-4 bg-sky-400 rounded-full animate-ping" />
                      <div className="w-2 h-6 bg-sky-500 rounded-full animate-bounce" />
                      <div className="w-2 h-4 bg-sky-400 rounded-full animate-ping" />
                    </div>
                  </div>

                  {/* Obstacle Alert Bar */}
                  <div className="bg-sky-950/40 p-3 rounded-2xl border border-sky-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white text-[11px]">Peringatan Rintangan</div>
                        <div className="text-[9px] text-slate-300">Belok kanan 15° untuk hindari tiang</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                      Audio ON
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Virtual Tab Navigator */}
          {interactive && onSelectFeature && (
            <div className="h-14 bg-slate-900 border-t border-slate-800/80 px-2 flex items-center justify-around z-30">
              {(
                [
                  { key: "bisafe", icon: ShieldAlert, color: "text-rose-400" },
                  { key: "bipantau", icon: BarChart, color: "text-[#00D4AA]" },
                  { key: "bisapa", icon: MessageCircle, color: "text-amber-400" },
                  { key: "bibaca", icon: BookOpen, color: "text-purple-400" },
                  { key: "bipintar", icon: GraduationCap, color: "text-emerald-400" },
                  { key: "bijalan", icon: Navigation, color: "text-sky-400" },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const isActive = activeFeature === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onSelectFeature(item.key)}
                    aria-label={`Pilih Fitur ${item.key}`}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-white/15 text-white scale-110 shadow-sm border border-white/20"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? item.color : ""}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
