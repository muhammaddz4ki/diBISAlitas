"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Bisindo3DCharacter from "./Bisindo3DCharacter";

interface FloatingBisindo3DProps {
  position?: "bottom-right" | "bottom-left";
}

const BISINDO_VOCAB = [
  { word: "Halo", sign: "halo", desc: "Sapaan umum" },
  { word: "Terima Kasih", sign: "terima_kasih", desc: "Ungkapan syukur" },
  { word: "Tolong", sign: "tolong", desc: "Meminta bantuan" },
  { word: "Ya", sign: "ya", desc: "Persetujuan" },
  { word: "Tidak", sign: "tidak", desc: "Penolakan" },
  { word: "A", sign: "A", desc: "Huruf A" },
  { word: "B", sign: "B", desc: "Huruf B" },
  { word: "C", sign: "C", desc: "Huruf C" },
  { word: "D", sign: "D", desc: "Huruf D" },
  { word: "E", sign: "E", desc: "Huruf E" },
];

export default function FloatingBisindo3D({ position = "bottom-right" }: FloatingBisindo3DProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSign, setCurrentSign] = useState("idle");
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [inputText, setInputText] = useState("");
  const [speed, setSpeed] = useState(1.0);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const positionClass = position === "bottom-right" ? "right-4 sm:right-6" : "left-4 sm:left-6";

  const handleWordClick = (sign: string) => {
    setIsAutoPlay(false);
    setCurrentSign(sign);
    setTimeout(() => setCurrentSign("idle"), 1500);
  };

  const handleTextSubmit = () => {
    if (!inputText.trim()) return;
    setIsAutoPlay(false);
    // Simulate translating text to signs letter by letter
    const letters = inputText.toUpperCase().split("");
    let i = 0;
    const playNext = () => {
      if (i < letters.length) {
        const letter = letters[i];
        if (letter in { A: 1, B: 1, C: 1, D: 1, E: 1 }) {
          setCurrentSign(letter);
        }
        i++;
        setTimeout(playNext, 1000 / speed);
      } else {
        setCurrentSign("idle");
        setIsAutoPlay(true);
      }
    };
    playNext();
    setInputText("");
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-4 sm:bottom-6 ${positionClass} z-[9999] w-14 h-14 sm:w-16 sm:h-16 rounded-full 
              bg-gradient-to-br from-[#1B9981] to-[#00D4AA] 
              shadow-[0_4px_20px_rgba(27,153,129,0.4),0_0_40px_rgba(0,212,170,0.15)] 
              flex items-center justify-center cursor-pointer
              border-2 border-white/20
              group`}
            aria-label="Buka BISINDO 3D"
            id="bisindo-3d-toggle"
          >
            {/* Sign language icon */}
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 11.5V14a5 5 0 0 0 10 0v-3" />
              <path d="M12 3v4" />
              <path d="M8.5 5.5l1 2" />
              <path d="M15.5 5.5l-1 2" />
              <path d="M5 9h14" />
              <path d="M12 19v2" />
            </svg>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#1B9981]/30 animate-ping" style={{ animationDuration: "2s" }} />
            
            {/* Tooltip */}
            <span className="absolute bottom-full mb-2 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
              BISINDO 3D
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "auto",
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed bottom-4 sm:bottom-6 ${positionClass} z-[9999]
              w-[340px] sm:w-[380px]
              rounded-2xl overflow-hidden
              bg-white/95 dark:bg-[#0f1729]/95
              backdrop-blur-xl
              border border-slate-200/60 dark:border-white/10
              shadow-[0_8px_40px_rgba(0,0,0,0.12),0_0_1px_rgba(0,0,0,0.08)]
              dark:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_1px_rgba(255,255,255,0.05)]`}
            id="bisindo-3d-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1B9981] to-[#00D4AA] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 11.5V14a5 5 0 0 0 10 0v-3" />
                    <path d="M12 3v4" />
                    <path d="M5 9h14" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">BISINDO 3D API</h3>
                  <p className="text-[10px] font-medium text-white/70">Bahasa Isyarat Indonesia</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-7 h-7 rounded-md hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label={isMinimized ? "Perbesar" : "Perkecil"}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {isMinimized ? (
                      <polyline points="15 3 21 3 21 9" />
                    ) : (
                      <line x1="5" y1="12" x2="19" y2="12" />
                    )}
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-md hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Tutup"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* 3D Character Display Area */}
                  <div className="relative flex items-center justify-center py-4 bg-gradient-to-b from-slate-50 to-white dark:from-[#0a1020] dark:to-[#0f1729] min-h-[220px]">
                    {/* Decorative grid */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                      style={{
                        backgroundImage: "radial-gradient(circle, #1B9981 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                    {/* Glow behind character */}
                    <div className="absolute w-32 h-32 bg-[#1B9981]/10 dark:bg-[#00D4AA]/15 rounded-full blur-3xl" />
                    
                    <Bisindo3DCharacter
                      isAnimating={isAutoPlay}
                      currentSign={currentSign}
                      size="md"
                    />

                    {/* Speed control */}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <button
                        onClick={() => {
                          setIsAutoPlay(!isAutoPlay);
                        }}
                        className={`p-1.5 rounded-md text-xs font-bold transition-all ${
                          isAutoPlay
                            ? "bg-[#1B9981]/10 text-[#1B9981] dark:bg-[#00D4AA]/20 dark:text-[#00D4AA]"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                        }`}
                        title={isAutoPlay ? "Jeda" : "Putar"}
                      >
                        {isAutoPlay ? (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,3 19,12 5,21" />
                          </svg>
                        )}
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => setShowSpeedControl(!showSpeedControl)}
                          className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          {speed}x
                        </button>
                        {showSpeedControl && (
                          <div className="absolute top-full right-0 mt-1 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col gap-1 z-50">
                            {[0.5, 0.75, 1.0, 1.5, 2.0].map((s) => (
                              <button
                                key={s}
                                onClick={() => {
                                  setSpeed(s);
                                  setShowSpeedControl(false);
                                }}
                                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                                  speed === s
                                    ? "bg-[#1B9981] text-white"
                                    : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                }`}
                              >
                                {s}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Text Input */}
                  <div className="px-4 py-3 border-t border-slate-100 dark:border-white/5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                        placeholder="Ketik teks untuk diterjemahkan..."
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1B9981]/50 focus:border-[#1B9981] transition-all"
                        id="bisindo-text-input"
                      />
                      <button
                        onClick={handleTextSubmit}
                        className="px-3 py-2 rounded-lg bg-[#1B9981] text-white text-sm font-bold hover:bg-[#158a74] transition-colors shadow-sm"
                        id="bisindo-translate-btn"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Quick Sign Vocabulary */}
                  <div className="px-4 pb-3">
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      Kosakata Cepat
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {BISINDO_VOCAB.map((item) => (
                        <button
                          key={item.sign}
                          onClick={() => handleWordClick(item.sign)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-semibold
                            bg-slate-100 dark:bg-slate-800/70 
                            text-slate-600 dark:text-slate-300
                            border border-slate-200 dark:border-slate-700
                            hover:bg-[#1B9981]/10 hover:border-[#1B9981]/30 hover:text-[#1B9981]
                            dark:hover:bg-[#00D4AA]/10 dark:hover:border-[#00D4AA]/30 dark:hover:text-[#00D4AA]
                            transition-all duration-200 cursor-pointer"
                          title={item.desc}
                        >
                          {item.word}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/50 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      Powered by <span className="font-bold text-[#1B9981]">diBISAlitas</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-emerald-500 font-semibold">API Aktif</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
