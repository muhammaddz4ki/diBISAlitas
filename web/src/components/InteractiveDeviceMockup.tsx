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
  PhoneCall,
  Camera,
  Mic,
  VolumeX,
  Eye,
  Sliders,
  Check,
  Flame,
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
  const [bisapaIndex, setBisapaIndex] = useState(0);
  const [isSpeakingSapa, setIsSpeakingSapa] = useState(false);
  const bisapaDialogues = [
    {
      stt: "Permisi, jalan menuju peron 2 lewat mana ya?",
      tts: "Silakan jalan lurus, lalu belok kanan di dekat lift.",
      speaker: "Lawan Bicara",
    },
    {
      stt: "Apakah di stasiun ini ada toilet ramah kursi roda?",
      tts: "Ada, terletak 20 meter di sebelah loket tiket utama.",
      speaker: "Pengunjung",
    },
    {
      stt: "Terima kasih banyak atas bantuannya!",
      tts: "Sama-sama, semoga perjalanan Anda lancar dan nyaman!",
      speaker: "Lawan Bicara",
    },
  ];

  // BiBACA state
  const [bibacaIndex, setBibacaIndex] = useState(0);
  const [isPlayingBaca, setIsPlayingBaca] = useState(true);
  const bibacaSamples = [
    {
      title: "Papan Informasi Stasiun",
      text: "Jalur landai dan lift prioritas disabilitas tersedia di sisi timur peron 1 menuju concourse.",
      tag: "Fasilitas Publik",
    },
    {
      title: "Resep & Petunjuk Obat",
      text: "Diminum 3 kali sehari 1 tablet sesudah makan. Simpan pada suhu sejuk terhindar dari sinar matahari.",
      tag: "Kesehatan",
    },
    {
      title: "Buku Panduan Belajar",
      text: "Bab 3: Prinsip Desain Inklusif dan Aksesibilitas Web Berbasis Standar WCAG 2.1 Level AA.",
      tag: "Edukasi",
    },
  ];

  // BiPINTAR state
  const [pintarGesture, setPintarGesture] = useState({ letter: "A", conf: 98.4, xp: 50 });
  const pintarLetters = [
    { letter: "A", conf: 98.4, desc: "Kepalan tegak dengan jempol di samping" },
    { letter: "B", conf: 97.2, desc: "Empat jari tegak rapat, jempol ditekuk di telapak" },
    { letter: "C", conf: 99.1, desc: "Jari melengkung membentuk setengah lingkaran C" },
    { letter: "L", conf: 96.8, desc: "Jempol dan telunjuk tegak membentuk huruf L" },
  ];

  // BiJALAN state
  const [radarStep, setRadarStep] = useState(0);
  const radarObjects = [
    { label: "Kursi Tunggu", dist: "1.2 Meter", dir: "Depan Kiri", color: "border-amber-400 text-amber-300" },
    { label: "Tangga Turun", dist: "2.8 Meter", dir: "Depan Lurus", color: "border-rose-400 text-rose-300" },
    { label: "Pintu Masuk Otomatis", dist: "4.5 Meter", dir: "Kanan", color: "border-emerald-400 text-emerald-300" },
  ];

  // Auto rotation timers
  useEffect(() => {
    const interval = setInterval(() => {
      setBisapaIndex((prev) => (prev + 1) % bisapaDialogues.length);
      setBibacaIndex((prev) => (prev + 1) % bibacaSamples.length);
      setPintarGesture((prev) => {
        const nextIdx = (pintarLetters.findIndex((p) => p.letter === prev.letter) + 1) % pintarLetters.length;
        return {
          letter: pintarLetters[nextIdx].letter,
          conf: pintarLetters[nextIdx].conf,
          xp: 50 + nextIdx * 10,
        };
      });
      setRadarStep((prev) => (prev + 1) % radarObjects.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto flex items-center justify-center">
      {/* Dynamic Ambient Background Glow */}
      <div
        className={`absolute -inset-10 rounded-[4rem] blur-3xl opacity-25 transition-all duration-700 pointer-events-none ${
          activeFeature === "bisafe"
            ? "bg-rose-500"
            : activeFeature === "bipantau"
            ? "bg-[#1B9981]"
            : activeFeature === "bisapa"
            ? "bg-sky-500"
            : activeFeature === "bibaca"
            ? "bg-purple-500"
            : activeFeature === "bipintar"
            ? "bg-emerald-500"
            : "bg-teal-500"
        }`}
      />

      {/* Realistic Smartphone Chassis */}
      <div className="relative w-[300px] sm:w-[325px] h-[610px] rounded-[3.2rem] bg-slate-900 p-3.5 shadow-[0_25px_80px_rgba(0,0,0,0.35)] border-4 border-slate-700/70">
        {/* Dynamic Island Pill */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <span className="w-2 h-2 rounded-full bg-[#1B9981] animate-pulse" />
        </div>

        {/* Screen Display Container */}
        <div className="w-full h-full bg-[#0F172A] rounded-[2.5rem] overflow-hidden flex flex-col relative text-slate-100 font-sans select-none border border-white/5">
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold text-slate-400 z-30 bg-slate-900/60 backdrop-blur-md">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span className="w-4 h-2 border border-slate-400 rounded-sm p-0.5 flex">
                <span className="h-full w-3/4 bg-[#1B9981] rounded-2xs" />
              </span>
            </div>
          </div>

          {/* Dynamic App Screens */}
          <div className="flex-1 relative overflow-hidden flex flex-col bg-[#F8FAFC]">
            <AnimatePresence mode="wait">
              {/* 1. BiSAFE SCREEN */}
              {activeFeature === "bisafe" && (
                <motion.div
                  key="bisafe"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-rose-50/70 via-white to-rose-50/50 text-slate-800"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-1 border-b border-rose-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-rose-500 flex items-center justify-center text-white font-black text-xs shadow-sm">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">BiSAFE Darurat</h4>
                        <p className="text-[9px] text-rose-600 font-semibold">Live GPS SOS Protocol</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      GPS Terkunci
                    </span>
                  </div>

                  {/* Big Panic SOS Button */}
                  <div className="my-auto flex flex-col items-center justify-center relative py-2">
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute w-36 h-36 rounded-full bg-rose-400/25"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.2, 0.7] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                        className="absolute w-28 h-28 rounded-full bg-rose-500/30"
                      />

                      <button
                        onClick={() => setBisafeTriggered(!bisafeTriggered)}
                        className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center font-black text-white shadow-xl transition-all ${
                          bisafeTriggered
                            ? "bg-rose-600 ring-4 ring-rose-400 scale-95"
                            : "bg-gradient-to-tr from-rose-600 to-rose-500 hover:scale-105 active:scale-95 shadow-rose-500/40"
                        }`}
                      >
                        <ShieldAlert className="w-8 h-8 mb-0.5 drop-shadow" />
                        <span className="text-[11px] tracking-wider uppercase font-extrabold">
                          {bisafeTriggered ? "TERKIRIM!" : "PANIC SOS"}
                        </span>
                      </button>
                    </div>

                    <p className="text-[10px] text-center text-slate-500 mt-3 font-medium px-4">
                      {bisafeTriggered
                        ? "Sinyal bahaya & koordinat (-6.2088, 106.8456) terkirim ke Relawan terdekat."
                        : "Tekan tombol di atas atau guncangkan ponsel untuk memicu sinyal bahaya."}
                    </p>
                  </div>

                  {/* Emergency Contacts & Location Card */}
                  <div className="space-y-2">
                    <div className="bg-white rounded-2xl p-2.5 border border-slate-100 shadow-sm flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-[11px] text-slate-800">Jl. MH Thamrin No. 28</div>
                          <div className="text-[9px] text-slate-400">Akurasi GPS: 1.8 Meter</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        Siaga
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center gap-1.5 font-bold text-slate-700 shadow-2xs">
                        <PhoneCall className="w-3 h-3 text-rose-500" />
                        <span>Ambulans 118</span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-100 flex items-center gap-1.5 font-bold text-slate-700 shadow-2xs">
                        <PhoneCall className="w-3 h-3 text-blue-500" />
                        <span>Polisi 110</span>
                      </div>
                    </div>
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
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-between p-3.5 bg-slate-50 text-slate-800"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#1B9981] flex items-center justify-center text-white font-black text-xs">
                        <BarChart className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">BiPANTAU Live</h4>
                        <p className="text-[9px] text-[#1B9981] font-semibold">Command Center Pemda</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold">
                      14 Laporan
                    </span>
                  </div>

                  {/* Leaflet GIS Map Simulation */}
                  <div className="h-32 bg-slate-900 rounded-2xl relative overflow-hidden border border-slate-200 shadow-inner p-2.5 flex flex-col justify-between text-white">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: "radial-gradient(circle, #00D4AA 1px, transparent 1px)",
                        backgroundSize: "14px 14px",
                      }}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-[#00D4AA]/40 animate-ping" />

                    <div className="absolute top-3 left-4 flex items-center gap-1 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-md animate-bounce">
                      <AlertTriangle className="w-2.5 h-2.5" /> Guiding Block Rusak
                    </div>
                    <div className="absolute bottom-3 right-4 flex items-center gap-1 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-md">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Ramp Diperbaiki
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-300">
                      <span>Kawasan Sudirman - Thamrin</span>
                      <span className="font-mono text-[#00D4AA]">Akurasi GIS 99.2%</span>
                    </div>
                  </div>

                  {/* Recent Reports List */}
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Laporan Terbaru
                    </div>
                    {[
                      { title: "Trotoar Berlubang Tosari", time: "2m lalu", stat: "Baru", color: "bg-rose-100 text-rose-700" },
                      { title: "Guiding Block Halte Dukuh Atas", time: "8m lalu", stat: "Selesai", color: "bg-emerald-100 text-emerald-700" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[10px] text-slate-800">{item.title}</div>
                          <div className="text-[8px] text-slate-400">{item.time} oleh Warga Inklusif</div>
                        </div>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md ${item.color}`}>
                          {item.stat}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="bg-[#1B9981]/10 rounded-xl p-2 border border-[#1B9981]/20 flex items-center justify-between text-[10px] font-bold text-[#1B9981]">
                    <span>Moderasi Otomatis AI</span>
                    <span className="bg-[#1B9981] text-white px-2 py-0.5 rounded-lg text-[9px]">Aktif</span>
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
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-between p-3.5 bg-gradient-to-b from-sky-50 via-white to-sky-50 text-slate-800"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-1 border-b border-sky-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-sky-500 flex items-center justify-center text-white font-black text-xs">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">BiSAPA Percakapan</h4>
                        <p className="text-[9px] text-sky-600 font-semibold">Jembatan Suara &amp; Teks</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[9px] font-bold">
                      2-Arah Aktif
                    </span>
                  </div>

                  {/* Dual Channel Conversation Screen */}
                  <div className="space-y-2.5 my-auto">
                    {/* Top Speech Recognition (STT) Box */}
                    <div className="p-3 rounded-2xl bg-white border border-sky-200 shadow-sm relative">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-extrabold text-sky-700 uppercase tracking-wider flex items-center gap-1">
                          <Mic className="w-3 h-3 text-sky-500 animate-pulse" /> Suara Masuk (STT)
                        </span>
                        <span className="text-[8px] text-slate-400 font-mono">Bahasa Indonesia</span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-800 leading-relaxed min-h-[36px]">
                        "{bisapaDialogues[bisapaIndex].stt}"
                      </p>
                    </div>

                    {/* Bottom Text To Speech (TTS) Box */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md relative">
                      <div className="flex items-center justify-between mb-1.5 text-white/80">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 text-white">
                          <Volume2 className="w-3 h-3" /> Balasan Teks Anda (TTS)
                        </span>
                        <button
                          onClick={() => setIsSpeakingSapa(!isSpeakingSapa)}
                          className="px-1.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[8px] font-bold text-white transition-colors"
                        >
                          Putar Suara
                        </button>
                      </div>
                      <p className="text-[11px] font-bold text-white leading-relaxed min-h-[36px]">
                        "{bisapaDialogues[bisapaIndex].tts}"
                      </p>
                    </div>
                  </div>

                  {/* Quick Phrase Chips */}
                  <div className="space-y-1">
                    <div className="text-[8px] font-bold text-slate-400 uppercase">Frasa Cepat</div>
                    <div className="flex flex-wrap gap-1">
                      {["Tolong", "Terima kasih", "Saya tunarungu", "Toilet?"].map((phrase, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-lg bg-white border border-sky-100 text-slate-700 font-bold text-[9px] shadow-2xs"
                        >
                          {phrase}
                        </span>
                      ))}
                    </div>
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
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-between p-3.5 bg-gradient-to-b from-purple-50 via-white to-purple-50 text-slate-800"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-1 border-b border-purple-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-purple-500 flex items-center justify-center text-white font-black text-xs">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">BiBACA Scanner</h4>
                        <p className="text-[9px] text-purple-600 font-semibold">OCR &amp; Suara Alami</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[9px] font-bold">
                      OCR Siap
                    </span>
                  </div>

                  {/* Document Viewfinder Simulator */}
                  <div className="h-32 bg-slate-900 rounded-2xl relative overflow-hidden border border-purple-200 shadow-md p-3 flex flex-col justify-between text-white">
                    {/* Laser Scanner Line */}
                    <motion.div
                      animate={{ y: [0, 95, 0] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_8px_rgba(192,132,252,1)]"
                    />

                    <div className="flex items-center justify-between text-[9px] text-purple-300 font-bold z-10">
                      <span className="flex items-center gap-1">
                        <Scan className="w-3 h-3" /> Memindai Dokumen
                      </span>
                      <span className="bg-purple-500/30 px-1.5 py-0.5 rounded text-[8px]">
                        {bibacaSamples[bibacaIndex].tag}
                      </span>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl text-[9px] text-slate-200 line-clamp-2 z-10 border border-white/10">
                      {bibacaSamples[bibacaIndex].text}
                    </div>
                  </div>

                  {/* Audio Synthesizer Controls */}
                  <div className="bg-white rounded-2xl p-2.5 border border-purple-100 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsPlayingBaca(!isPlayingBaca)}
                          className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-md hover:bg-purple-600 transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <div>
                          <div className="font-bold text-[10px] text-slate-800">Suara Bahasa Indonesia</div>
                          <div className="text-[8px] text-slate-400">Kecepatan 1.0x - Suara Natural</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                        100% Akurat
                      </span>
                    </div>

                    {/* Fake Audio Wave Animation */}
                    <div className="flex items-center justify-center gap-1 h-3 pt-1">
                      {[40, 80, 50, 100, 70, 30, 90, 60, 100, 45].map((h, idx) => (
                        <motion.span
                          key={idx}
                          animate={{ height: isPlayingBaca ? [`${h}%`, `${100 - h}%`, `${h}%`] : "20%" }}
                          transition={{ repeat: Infinity, duration: 0.8 + (idx % 3) * 0.2 }}
                          className="w-1 bg-purple-500 rounded-full"
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
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-between p-3.5 bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-slate-800"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-1 border-b border-emerald-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#1B9981] flex items-center justify-center text-white font-black text-xs">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">BiPINTAR Isyarat</h4>
                        <p className="text-[9px] text-[#1B9981] font-semibold">ONNX YOLOv8 Vision</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-extrabold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                      2.850 XP
                    </span>
                  </div>

                  {/* Camera Bounding Box Viewport */}
                  <div className="h-36 bg-slate-900 rounded-2xl relative overflow-hidden border border-emerald-200 shadow-md p-2.5 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between text-[9px] text-emerald-300 font-bold z-10">
                      <span>Kamera ONNX WASM</span>
                      <span>30 FPS</span>
                    </div>

                    {/* Hand Bounding Box Target */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-2xl border-2 border-dashed border-[#00D4AA] flex flex-col items-center justify-center bg-[#00D4AA]/10">
                      <Hand className="w-8 h-8 text-[#00D4AA] animate-pulse mb-1" />
                      <span className="text-[9px] font-black bg-[#00D4AA] text-slate-950 px-1.5 py-0.2 rounded font-mono">
                        Huruf '{pintarGesture.letter}' ({pintarGesture.conf}%)
                      </span>
                    </div>

                    <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-xl text-[8px] text-slate-300 text-center z-10 border border-white/10">
                      Pendeteksian gestur waktu-nyata di peramban
                    </div>
                  </div>

                  {/* Level Up / Learning Card */}
                  <div className="bg-white rounded-2xl p-2.5 border border-emerald-100 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-[11px] text-slate-800">
                        Huruf '{pintarGesture.letter}' Terdeteksi!
                      </div>
                      <div className="text-[9px] text-emerald-600 font-semibold">
                        Akurasi {pintarGesture.conf}% (+{pintarGesture.xp} XP)
                      </div>
                    </div>
                    <span className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      <Award className="w-4 h-4" />
                    </span>
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
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-between p-3.5 bg-gradient-to-b from-teal-50 via-white to-teal-50 text-slate-800"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-1 border-b border-teal-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-xs">
                        <Navigation className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 leading-tight">BiJALAN Radar</h4>
                        <p className="text-[9px] text-teal-600 font-semibold">Sensor Spasial &amp; Audio</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[9px] font-bold">
                      Radar ON
                    </span>
                  </div>

                  {/* Spatial Radar Camera Viewport */}
                  <div className="h-36 bg-slate-900 rounded-2xl relative overflow-hidden border border-teal-200 shadow-md p-2.5 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between text-[9px] text-teal-300 font-bold z-10">
                      <span>Visi Spasial AI</span>
                      <span className="text-amber-300">Deteksi Aktif</span>
                    </div>

                    {/* Detected Object Bounding Box */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-20 rounded-xl border-2 border-amber-400 bg-amber-400/15 flex flex-col items-center justify-center p-1 shadow-lg">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mb-0.5" />
                      <span className="text-[9px] font-extrabold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">
                        {radarObjects[radarStep].label}
                      </span>
                      <span className="text-[8px] font-bold text-white mt-0.5">
                        Jarak: {radarObjects[radarStep].dist}
                      </span>
                    </div>

                    <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-xl text-[8px] text-slate-300 text-center z-10 border border-white/10">
                      Arah: {radarObjects[radarStep].dir}
                    </div>
                  </div>

                  {/* Live Voice Guidance Ticker */}
                  <div className="bg-white rounded-2xl p-2.5 border border-teal-100 shadow-sm flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Volume2 className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-[8px] font-extrabold text-teal-700 uppercase tracking-wider">
                        Panduan Suara Terarah
                      </div>
                      <div className="text-[10px] font-bold text-slate-800 leading-tight">
                        "Perhatian: Ada {radarObjects[radarStep].label.toLowerCase()} di {radarObjects[radarStep].dir.toLowerCase()} ({radarObjects[radarStep].dist})."
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Realistic Bottom Navigation Dock */}
          <div className="h-12 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 flex items-center justify-around z-30 shadow-lg">
            {[
              { key: "bisafe" as FeatureKey, icon: ShieldAlert, color: "text-rose-500" },
              { key: "bipantau" as FeatureKey, icon: BarChart, color: "text-[#1B9981]" },
              { key: "bisapa" as FeatureKey, icon: MessageCircle, color: "text-sky-500" },
              { key: "bibaca" as FeatureKey, icon: BookOpen, color: "text-purple-500" },
              { key: "bipintar" as FeatureKey, icon: GraduationCap, color: "text-emerald-500" },
              { key: "bijalan" as FeatureKey, icon: Navigation, color: "text-teal-600" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFeature === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onSelectFeature?.(tab.key)}
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? `bg-slate-100 ${tab.color} scale-110 shadow-2xs font-bold`
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
