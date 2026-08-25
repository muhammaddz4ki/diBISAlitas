"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility,
  Type,
  Contrast,
  ZapOff,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  X,
  Check,
  Eye,
  SlidersHorizontal,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function FloatingAccessibility() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(0); // 0: Normal, 1: Besar (115%), 2: Sangat Besar (130%)
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [grayscaleMode, setGrayscaleMode] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedFont = localStorage.getItem("a11y_font");
    const savedHC = localStorage.getItem("a11y_hc") === "1";
    const savedRM = localStorage.getItem("a11y_rm") === "1";
    const savedDyslexia = localStorage.getItem("a11y_dyslexia") === "1";
    const savedGray = localStorage.getItem("a11y_gray") === "1";
    const savedLinks = localStorage.getItem("a11y_links") === "1";

    if (savedFont !== null) {
      const idx = Number(savedFont);
      setFontSizeIndex(Number.isFinite(idx) ? Math.min(2, Math.max(0, idx)) : 0);
    }
    setHighContrast(savedHC);
    setReduceMotion(savedRM);
    setDyslexiaMode(savedDyslexia);
    setGrayscaleMode(savedGray);
    setHighlightLinks(savedLinks);

    // Apply to DOM
    applyDomClasses({
      font: Number(savedFont || 0),
      hc: savedHC,
      rm: savedRM,
      dyslexia: savedDyslexia,
      gray: savedGray,
      links: savedLinks,
    });

    // Keyboard shortcut: Alt + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const applyDomClasses = ({
    font,
    hc,
    rm,
    dyslexia,
    gray,
    links,
  }: {
    font: number;
    hc: boolean;
    rm: boolean;
    dyslexia: boolean;
    gray: boolean;
    links: boolean;
  }) => {
    if (typeof document === "undefined") return;
    const scales = [1, 1.15, 1.3];
    const scale = scales[font] ?? 1;

    (document.body.style as CSSStyleDeclaration & { zoom?: string }).zoom = String(scale);
    
    // Toggle on documentElement (root html) so position: fixed is NEVER broken
    document.documentElement.classList.toggle("a11y-hc", hc);
    document.documentElement.classList.toggle("a11y-reduce", rm);
    document.documentElement.classList.toggle("a11y-dyslexia", dyslexia);
    document.documentElement.classList.toggle("a11y-grayscale", gray);
    document.documentElement.classList.toggle("a11y-highlight-links", links);

    // Also toggle on body for legacy rule fallback
    document.body.classList.toggle("a11y-reduce", rm);
    document.body.classList.toggle("a11y-dyslexia", dyslexia);
    document.body.classList.toggle("a11y-highlight-links", links);
  };

  const handleFontChange = (idx: number) => {
    setFontSizeIndex(idx);
    localStorage.setItem("a11y_font", String(idx));
    applyDomClasses({
      font: idx,
      hc: highContrast,
      rm: reduceMotion,
      dyslexia: dyslexiaMode,
      gray: grayscaleMode,
      links: highlightLinks,
    });
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem("a11y_hc", next ? "1" : "0");
    applyDomClasses({
      font: fontSizeIndex,
      hc: next,
      rm: reduceMotion,
      dyslexia: dyslexiaMode,
      gray: grayscaleMode,
      links: highlightLinks,
    });
  };

  const toggleReduceMotion = () => {
    const next = !reduceMotion;
    setReduceMotion(next);
    localStorage.setItem("a11y_rm", next ? "1" : "0");
    applyDomClasses({
      font: fontSizeIndex,
      hc: highContrast,
      rm: next,
      dyslexia: dyslexiaMode,
      gray: grayscaleMode,
      links: highlightLinks,
    });
  };

  const toggleDyslexia = () => {
    const next = !dyslexiaMode;
    setDyslexiaMode(next);
    localStorage.setItem("a11y_dyslexia", next ? "1" : "0");
    applyDomClasses({
      font: fontSizeIndex,
      hc: highContrast,
      rm: reduceMotion,
      dyslexia: next,
      gray: grayscaleMode,
      links: highlightLinks,
    });
  };

  const toggleGrayscale = () => {
    const next = !grayscaleMode;
    setGrayscaleMode(next);
    localStorage.setItem("a11y_gray", next ? "1" : "0");
    applyDomClasses({
      font: fontSizeIndex,
      hc: highContrast,
      rm: reduceMotion,
      dyslexia: dyslexiaMode,
      gray: next,
      links: highlightLinks,
    });
  };

  const toggleHighlightLinks = () => {
    const next = !highlightLinks;
    setHighlightLinks(next);
    localStorage.setItem("a11y_links", next ? "1" : "0");
    applyDomClasses({
      font: fontSizeIndex,
      hc: highContrast,
      rm: reduceMotion,
      dyslexia: dyslexiaMode,
      gray: grayscaleMode,
      links: next,
    });
  };

  const handleReset = () => {
    setFontSizeIndex(0);
    setHighContrast(false);
    setReduceMotion(false);
    setDyslexiaMode(false);
    setGrayscaleMode(false);
    setHighlightLinks(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("a11y_font");
      localStorage.removeItem("a11y_hc");
      localStorage.removeItem("a11y_rm");
      localStorage.removeItem("a11y_dyslexia");
      localStorage.removeItem("a11y_gray");
      localStorage.removeItem("a11y_links");
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
    applyDomClasses({
      font: 0,
      hc: false,
      rm: false,
      dyslexia: false,
      gray: false,
      links: false,
    });
  };

  // Text-to-speech overview
  const toggleSpeechReader = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Browser Anda belum mendukung fitur Text-to-Speech.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const title = document.title || "diBISAlitas";
    const mainHeading = document.querySelector("h1")?.textContent || "Selamat datang di diBISAlitas";
    const speechText = `${title}. ${mainHeading}. Platform cerdas berbasis kecerdasan buatan untuk aksesibilitas dan kemandirian penyandang disabilitas di Indonesia. Anda dapat menggunakan tombol aksesibilitas untuk menyesuaikan ukuran teks, kontras warna, dan alat bantu lainnya.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = "id-ID";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const activeCount =
    (fontSizeIndex > 0 ? 1 : 0) +
    (highContrast ? 1 : 0) +
    (reduceMotion ? 1 : 0) +
    (dyslexiaMode ? 1 : 0) +
    (grayscaleMode ? 1 : 0) +
    (highlightLinks ? 1 : 0);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Action Button */}
      <div className="relative flex items-center justify-end">
        {/* Tooltip on hover */}
        <AnimatePresence>
          {!isOpen && tooltipVisible && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              className="absolute right-16 px-3.5 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap shadow-xl backdrop-blur-md border border-white/10 flex items-center gap-2 pointer-events-none"
            >
              <span>Fitur Aksesibilitas</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white/20 rounded font-mono">Alt+A</kbd>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Buka Pengaturan Aksesibilitas"
          aria-expanded={isOpen}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isOpen
              ? "bg-slate-900 text-white shadow-slate-900/30"
              : activeCount > 0
              ? "bg-[#1B9981] text-white shadow-[#1B9981]/40 ring-4 ring-[#1B9981]/20 animate-pulse"
              : "bg-gradient-to-tr from-[#1B9981] to-[#00D4AA] text-white shadow-[#1B9981]/30 hover:shadow-[#1B9981]/50"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Accessibility className="w-7 h-7" />
              {activeCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md border-2 border-white">
                  {activeCount}
                </span>
              )}
            </>
          )}
        </motion.button>
      </div>

      {/* Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-16 right-0 w-[340px] sm:w-[380px] bg-white dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B9981] to-[#00D4AA] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Aksesibilitas</h3>
                  <p className="text-white/80 text-xs">Sesuaikan kenyamanan tampilan</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                title="Reset Semua Pengaturan"
                className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Content Options */}
            <div className="p-5 space-y-4 max-h-[440px] overflow-y-auto">
              {/* Mode Tema Tampilan */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#1B9981]" />
                  Tema Tampilan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                      theme === "light"
                        ? "bg-[#1B9981]/10 border-[#1B9981] text-[#1B9981] font-bold shadow-sm"
                        : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-xs">Terang</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                      theme === "dark"
                        ? "bg-[#1B9981]/10 border-[#1B9981] text-[#1B9981] font-bold shadow-sm"
                        : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                    }`}
                  >
                    <Moon className="w-4 h-4 text-amber-400" />
                    <span className="text-xs">Gelap</span>
                  </button>
                </div>
              </div>

              {/* Ukuran Teks */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#1B9981]" />
                  Ukuran Teks
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "100%", sub: "Normal" },
                    { label: "115%", sub: "Besar" },
                    { label: "130%", sub: "Ekstra" },
                  ].map((lvl, idx) => (
                    <button
                      key={lvl.label}
                      onClick={() => handleFontChange(idx)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        fontSizeIndex === idx
                          ? "bg-[#1B9981]/10 border-[#1B9981] text-[#1B9981] font-bold shadow-sm"
                          : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                      }`}
                    >
                      <div className="text-sm">{lvl.label}</div>
                      <div className="text-[10px] opacity-70">{lvl.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Toggle Features */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#1B9981]" />
                  Tampilan &amp; Visual
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* High Contrast */}
                  <button
                    onClick={toggleHighContrast}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-[84px] ${
                      highContrast
                        ? "bg-slate-900 border-slate-900 dark:bg-slate-100 dark:border-slate-100 text-white dark:text-slate-900 shadow-md"
                        : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Contrast className={`w-4 h-4 ${highContrast ? "text-[#00D4AA]" : "text-slate-500 dark:text-slate-400"}`} />
                      {highContrast && <Check className="w-3.5 h-3.5 text-[#00D4AA]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">Kontras Tinggi</div>
                      <div className="text-[10px] opacity-70">Pertajam elemen</div>
                    </div>
                  </button>

                  {/* Reduce Motion */}
                  <button
                    onClick={toggleReduceMotion}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-[84px] ${
                      reduceMotion
                        ? "bg-[#1B9981] border-[#1B9981] text-white shadow-md"
                        : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <ZapOff className={`w-4 h-4 ${reduceMotion ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                      {reduceMotion && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">Kurangi Animasi</div>
                      <div className="text-[10px] opacity-70">Cegah pusing</div>
                    </div>
                  </button>

                  {/* Dyslexia Mode */}
                  <button
                    onClick={toggleDyslexia}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-[84px] ${
                      dyslexiaMode
                        ? "bg-amber-600 border-amber-600 text-white shadow-md"
                        : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <BookOpen className={`w-4 h-4 ${dyslexiaMode ? "text-amber-200" : "text-slate-500 dark:text-slate-400"}`} />
                      {dyslexiaMode && <Check className="w-3.5 h-3.5 text-amber-200" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">Mode Disleksia</div>
                      <div className="text-[10px] opacity-70">Spasi &amp; huruf lebar</div>
                    </div>
                  </button>

                  {/* Grayscale Mode */}
                  <button
                    onClick={toggleGrayscale}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-[84px] ${
                      grayscaleMode
                        ? "bg-slate-700 border-slate-700 text-white shadow-md"
                        : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Sparkles className={`w-4 h-4 ${grayscaleMode ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`} />
                      {grayscaleMode && <Check className="w-3.5 h-3.5 text-slate-300" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">Monokrom</div>
                      <div className="text-[10px] opacity-70">Hitam putih</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Text to Speech & Highlight Links */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={toggleSpeechReader}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    isSpeaking
                      ? "bg-rose-500 border-rose-500 text-white shadow-lg animate-pulse"
                      : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSpeaking ? "bg-white/20 text-white" : "bg-[#1B9981]/10 text-[#1B9981]"
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold">
                        {isSpeaking ? "Hentikan Suara" : "Bacakan Ringkasan Layar"}
                      </div>
                      <div className="text-[10px] opacity-70">Text-to-Speech Bahasa Indonesia</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-white/20">
                    {isSpeaking ? "Aktif" : "Putar"}
                  </span>
                </button>

                <button
                  onClick={toggleHighlightLinks}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all text-xs font-semibold ${
                    highlightLinks
                      ? "bg-[#1B9981]/15 border-[#1B9981] text-[#1B9981]"
                      : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>Garis Bawahi &amp; Sorot Tautan</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${
                      highlightLinks ? "bg-[#1B9981] text-white" : "border border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {highlightLinks && <Check className="w-3 h-3" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Footer info */}
            <div className="bg-slate-50 dark:bg-slate-900/80 px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Shortcut: <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px] text-slate-700 dark:text-slate-300">Alt + A</kbd></span>
              <span className="text-[#1B9981] font-semibold">diBISAlitas A11y Engine</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
