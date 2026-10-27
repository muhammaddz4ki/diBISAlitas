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
  Activity,
  ChevronRight,
  Pointer,
  Hand,
  Pause,
  Play,
  Square,
  Palette,
  ChevronUp,
  ChevronDown,
  Send
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import Bisindo3DCharacter, { AvatarModelId } from "@/components/Bisindo3DCharacter";
import { subscribeBisindoItems } from "@/lib/bisindoService";
import { BisindoItem } from "@/lib/types";

export default function FloatingAccessibility() {
  const { theme, setTheme, reduceMotion, setReduceMotion, highContrast, setHighContrast } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(0);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [grayscaleMode, setGrayscaleMode] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(false);
  const [bisindo3dOpen, setBisindo3dOpen] = useState(false);
  const [bisindoSign, setBisindoSign] = useState("salam");
  const [bisindoAutoPlay, setBisindoAutoPlay] = useState(true);
  const [bisindoInput, setBisindoInput] = useState("");
  const [bisindoSpeed, setBisindoSpeed] = useState(1.0);
  const [jacketColor, setJacketColor] = useState<"blue" | "dark" | "mustard">("blue");
  const [avatarModel, setAvatarModel] = useState<AvatarModelId>("rian");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showWordDrawer, setShowWordDrawer] = useState(false);
  const [dbVocab, setDbVocab] = useState<BisindoItem[]>([]);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubBisindo = subscribeBisindoItems((items) => {
      setDbVocab(items);
    });

    const savedFont = localStorage.getItem("a11y_font");
    const savedRM = localStorage.getItem("a11y_rm") === "1";
    const savedDyslexia = localStorage.getItem("a11y_dyslexia") === "1";
    const savedGray = localStorage.getItem("a11y_gray") === "1";
    const savedLinks = localStorage.getItem("a11y_links") === "1";

    if (savedFont !== null) {
      const idx = Number(savedFont);
      setFontSizeIndex(Number.isFinite(idx) ? Math.min(2, Math.max(0, idx)) : 0);
    }
    setReduceMotion(savedRM);
    setDyslexiaMode(savedDyslexia);
    setGrayscaleMode(savedGray);
    setHighlightLinks(savedLinks);
    setHapticFeedback(localStorage.getItem("a11y_haptic") === "1");

    applyDomClasses({
      font: Number(savedFont || 0),
      rm: savedRM,
      dyslexia: savedDyslexia,
      gray: savedGray,
      links: savedLinks,
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    
    const updateVideos = (rmState: boolean) => {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        if (rmState) {
          video.pause();
        } else {
          if (video.autoplay) video.play().catch(() => {});
        }
      });
    };
    
    updateVideos(savedRM);

    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains("a11y-reduce")) {
        updateVideos(true);
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
      unsubBisindo();
    };
  }, []);

  const applyDomClasses = ({ font, rm, dyslexia, gray, links }: { font: number; rm: boolean; dyslexia: boolean; gray: boolean; links: boolean; }) => {
    if (typeof document === "undefined") return;
    const scales = [1, 1.15, 1.3];
    const scale = scales[font] ?? 1;

    (document.body.style as CSSStyleDeclaration & { zoom?: string }).zoom = String(scale);
    
    document.documentElement.classList.toggle("a11y-reduce", rm);
    document.documentElement.classList.toggle("a11y-dyslexia", dyslexia);
    document.documentElement.classList.toggle("a11y-grayscale", gray);
    document.documentElement.classList.toggle("a11y-highlight-links", links);

    document.body.classList.toggle("a11y-reduce", rm);
    document.body.classList.toggle("a11y-dyslexia", dyslexia);
    document.body.classList.toggle("a11y-highlight-links", links);
  };

  const handleFontChange = (idx: number) => {
    setFontSizeIndex(idx);
    localStorage.setItem("a11y_font", String(idx));
    applyDomClasses({ font: idx, rm: reduceMotion, dyslexia: dyslexiaMode, gray: grayscaleMode, links: highlightLinks });
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    applyDomClasses({ font: fontSizeIndex, rm: reduceMotion, dyslexia: dyslexiaMode, gray: grayscaleMode, links: highlightLinks });
  };

  const toggleReduceMotion = () => {
    const next = !reduceMotion;
    setReduceMotion(next);
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (next) video.pause();
      else if (video.autoplay) video.play().catch(() => {});
    });
    applyDomClasses({ font: fontSizeIndex, rm: next, dyslexia: dyslexiaMode, gray: grayscaleMode, links: highlightLinks });
  };

  const toggleDyslexia = () => {
    const next = !dyslexiaMode;
    setDyslexiaMode(next);
    localStorage.setItem("a11y_dyslexia", next ? "1" : "0");
    applyDomClasses({ font: fontSizeIndex, rm: reduceMotion, dyslexia: next, gray: grayscaleMode, links: highlightLinks });
  };

  const toggleGrayscale = () => {
    const next = !grayscaleMode;
    setGrayscaleMode(next);
    localStorage.setItem("a11y_gray", next ? "1" : "0");
    applyDomClasses({ font: fontSizeIndex, rm: reduceMotion, dyslexia: dyslexiaMode, gray: next, links: highlightLinks });
  };

  const toggleHighlightLinks = () => {
    const next = !highlightLinks;
    setHighlightLinks(next);
    localStorage.setItem("a11y_links", next ? "1" : "0");
    applyDomClasses({ font: fontSizeIndex, rm: reduceMotion, dyslexia: dyslexiaMode, gray: grayscaleMode, links: next });
  };

  const toggleHapticFeedback = () => {
    const next = !hapticFeedback;
    setHapticFeedback(next);
    localStorage.setItem("a11y_haptic", next ? "1" : "0");
    if (next && navigator.vibrate) navigator.vibrate(50);
  };

  const handleReset = () => {
    setFontSizeIndex(0);
    setHighContrast(false);
    setReduceMotion(false);
    setDyslexiaMode(false);
    setGrayscaleMode(false);
    setHighlightLinks(false);
    setHapticFeedback(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("a11y_font");
      localStorage.removeItem("a11y_hc");
      localStorage.removeItem("a11y_rm");
      localStorage.removeItem("a11y_dyslexia");
      localStorage.removeItem("a11y_gray");
      localStorage.removeItem("a11y_links");
      localStorage.removeItem("a11y_haptic");
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
    applyDomClasses({ font: 0, rm: false, dyslexia: false, gray: false, links: false });
  };

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
    const speechText = `${title}. ${mainHeading}. Platform cerdas berbasis kecerdasan buatan untuk aksesibilitas dan kemandirian penyandang disabilitas di Indonesia.`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = "id-ID";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const activeCount = (fontSizeIndex > 0 ? 1 : 0) + (highContrast ? 1 : 0) + (reduceMotion ? 1 : 0) + (dyslexiaMode ? 1 : 0) + (grayscaleMode ? 1 : 0) + (highlightLinks ? 1 : 0) + (hapticFeedback ? 1 : 0) + (bisindo3dOpen ? 1 : 0);

  const SIGN_LABELS: Record<string, { label: string; icon: string }> = {
    salam: { label: "Salam diBISAlitas", icon: "✨" },
    dada: { label: "Salam diBISAlitas", icon: "✨" },
    halo: { label: "Halo / Selamat Datang", icon: "👋" },
    terima_kasih: { label: "Terima Kasih", icon: "🙏" },
    sama_sama: { label: "Sama-sama", icon: "🤝" },
    bisa: { label: "Pasti BISA!", icon: "💪" },
    tolong: { label: "Tolong / Bantuan", icon: "🤲" },
    ya: { label: "Ya (Setuju)", icon: "✅" },
    tidak: { label: "Tidak (Menolak)", icon: "❌" },
    A: { label: "Huruf A", icon: "🔤" },
    B: { label: "Huruf B", icon: "🔤" },
    C: { label: "Huruf C", icon: "🔤" },
    idle: { label: "Siap Mendengar", icon: "👂" },
  };

  const BISINDO_VOCAB = [
    { word: "Salam", sign: "salam" },
    { word: "Halo", sign: "halo" },
    { word: "Terima Kasih", sign: "terima_kasih" },
    { word: "Pasti BISA!", sign: "bisa" },
    { word: "Tolong", sign: "tolong" },
    { word: "Ya (Setuju)", sign: "ya" },
    { word: "Sama-sama", sign: "sama_sama" },
    { word: "A", sign: "A" },
    { word: "B", sign: "B" },
    { word: "C", sign: "C" },
  ];

  const activeVocabList = React.useMemo(() => {
    if (dbVocab.length > 0) {
      return dbVocab.map((v) => ({ word: v.word, sign: v.id }));
    }
    return BISINDO_VOCAB;
  }, [dbVocab]);

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(bisindoSpeed) + 1) % speeds.length;
    setBisindoSpeed(speeds[nextIdx]);
  };

  const handleBisindoWordClick = (sign: string) => {
    setBisindoAutoPlay(false);
    setBisindoSign(sign);
  };

  const handleBisindoTextSubmit = () => {
    if (!bisindoInput.trim()) return;
    setBisindoAutoPlay(false);
    const textLower = bisindoInput.trim().toLowerCase();

    // Check dynamic Firestore items first
    const matchedDb = dbVocab.find(
      (v) =>
        textLower === v.word.toLowerCase() ||
        textLower.includes(v.word.toLowerCase()) ||
        v.word.toLowerCase().includes(textLower)
    );
    if (matchedDb) {
      setBisindoSign(matchedDb.id);
      setBisindoInput("");
      return;
    }
    
    if (textLower.includes("halo") || textLower.includes("hai")) {
      setBisindoSign("halo");
    } else if (textLower.includes("makasih") || textLower.includes("terima")) {
      setBisindoSign("terima_kasih");
    } else if (textLower.includes("bisa")) {
      setBisindoSign("bisa");
    } else if (textLower.includes("tolong") || textLower.includes("bantu")) {
      setBisindoSign("tolong");
    } else if (textLower.includes("ya") || textLower.includes("oke") || textLower.includes("siap") || textLower.includes("betul")) {
      setBisindoSign("ya");
    } else if (textLower.includes("sama") || textLower.includes("kembali")) {
      setBisindoSign("sama_sama");
    } else if (textLower.includes("salam")) {
      setBisindoSign("salam");
    } else {
      // Spell letters
      const letters = bisindoInput.toUpperCase().split("");
      let i = 0;
      const playNext = () => {
        if (i < letters.length) {
          const letter = letters[i];
          if (["A","B","C"].includes(letter)) {
            setBisindoSign(letter);
          }
          i++;
          setTimeout(playNext, 1200 / bisindoSpeed);
        } else {
          setBisindoSign("salam");
        }
      };
      playNext();
    }
    setBisindoInput("");
  };

  const FeatureCard = ({ active, onClick, icon: Icon, title, subtitle, colorClass, shadowClass }: any) => {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center bg-white dark:bg-[#1f1f1f] rounded-[1.25rem] p-3 transition-all duration-300 hover:scale-[1.02] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-slate-50 dark:border-white/5"
      >
        <div className={`w-[46px] h-[46px] rounded-[14px] flex items-center justify-center shrink-0 transition-all duration-500 ${active ? `${colorClass} text-white ${shadowClass}` : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="ml-3.5 text-left flex-1 pr-2">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{title}</div>
          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            {subtitle}
          </div>
        </div>
        <div className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors duration-300 shrink-0 shadow-inner ${active ? 'bg-[#2a9d8f]' : 'bg-rose-500'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      </button>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        .a11y-content-wrapper {
          filter: ${highContrast && grayscaleMode ? 'contrast(1.25) grayscale(100%)' : highContrast ? 'contrast(1.25) saturate(1.2)' : grayscaleMode ? 'grayscale(100%)' : 'none'} !important;
          transition: filter 0.3s ease !important;
        }
      `}} />

      <div className="relative flex items-center justify-end">
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
          className={`relative w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 ${
            isOpen
              ? "bg-slate-900 dark:bg-slate-800 text-white shadow-[0_15px_30px_rgba(0,0,0,0.3),_inset_0_2px_4px_rgba(255,255,255,0.1)] border border-slate-700"
              : activeCount > 0
              ? "bg-[#2a9d8f] text-white shadow-[0_10px_25px_rgba(42,157,143,0.5)] ring-4 ring-[#2a9d8f]/20 animate-pulse border border-[#1e7b6d]"
              : "bg-gradient-to-tr from-[#2a9d8f] to-[#4fd1c5] text-white shadow-[0_10px_25px_rgba(42,157,143,0.4)] hover:shadow-[0_15px_35px_rgba(42,157,143,0.5)] border border-white/20"
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : (
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-48px)] sm:w-[400px] max-h-[calc(100vh-110px)] sm:max-h-[calc(100vh-130px)] flex flex-col bg-[#f4f7f9] dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 rounded-[1.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/80 dark:border-white/5 overflow-hidden ring-1 ring-slate-900/5"
          >
            {/* Header */}
            <div className="shrink-0 bg-white dark:bg-[#1a1a1a] p-5 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#2a9d8f] to-[#4fd1c5] shadow-[0_6px_15px_rgba(42,157,143,0.3)] flex items-center justify-center text-white">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight text-slate-800 dark:text-white">Aksesibilitas</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">Sesuaikan pengalaman UI/UX</p>
                </div>
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 p-4 space-y-3.5 overflow-y-auto custom-scrollbar">
              
              {/* Tema Layar */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-2">Tema Layar</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setTheme("light")} className={`flex items-center justify-center gap-2.5 p-2.5 rounded-full border transition-all duration-300 hover:-translate-y-0.5 ${theme === "light" ? "bg-gradient-to-br from-amber-400 to-orange-500 border-transparent shadow-[0_8px_20px_rgba(245,158,11,0.4)]" : "bg-white dark:bg-[#1f1f1f] border-slate-100 dark:border-white/5 shadow-[0_6px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_6px_15px_rgba(0,0,0,0.3)]"}`}>
                    <Sun className={`w-4 h-4 ${theme === "light" ? "text-white" : "text-amber-500"}`} />
                    <span className={`text-xs font-bold ${theme === "light" ? "text-white" : "text-slate-700 dark:text-slate-200"}`}>Terang</span>
                  </button>
                  <button onClick={() => setTheme("dark")} className={`flex items-center justify-center gap-2.5 p-2.5 rounded-full border transition-all duration-300 hover:-translate-y-0.5 ${theme === "dark" ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-transparent shadow-[0_8px_20px_rgba(59,130,246,0.4)]" : "bg-white dark:bg-[#1f1f1f] border-slate-100 dark:border-white/5 shadow-[0_6px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_6px_15px_rgba(0,0,0,0.3)]"}`}>
                    <Moon className={`w-4 h-4 ${theme === "dark" ? "text-white" : "text-blue-500"}`} />
                    <span className={`text-xs font-bold ${theme === "dark" ? "text-white" : "text-slate-700 dark:text-slate-200"}`}>Gelap</span>
                  </button>
                </div>
              </div>

              {/* Ukuran Teks */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-2">Ukuran Teks</label>
                <div className="bg-white dark:bg-[#1a1a1a] p-1.5 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-white/5 flex">
                  {[{l: "100%", s: "Normal"}, {l: "115%", s: "Besar"}, {l: "130%", s: "Ekstra"}].map((lvl, idx) => (
                    <button key={lvl.l} onClick={() => handleFontChange(idx)} className={`flex-1 py-2 rounded-2xl transition-all duration-300 ${fontSizeIndex === idx ? "bg-gradient-to-br from-[#2a9d8f] to-[#4fd1c5] text-white shadow-[0_6px_15px_rgba(42,157,143,0.3)]" : "bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"}`}>
                      <div className="text-sm font-bold">{lvl.l}</div>
                      <div className={`text-[10px] font-medium ${fontSizeIndex === idx ? "text-white/80" : "text-slate-400"}`}>{lvl.s}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Features */}
              <div className="space-y-2.5 pt-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-2">Bantuan Visual & Kognitif</label>
                
                <FeatureCard 
                  active={highContrast} onClick={toggleHighContrast} icon={Contrast} 
                  title="Kontras Tinggi" subtitle="Pertajam elemen UI" 
                  colorClass="bg-gradient-to-br from-indigo-500 to-purple-600" shadowClass="shadow-[0_8px_20px_rgba(99,102,241,0.4)]" 
                />
                
                <FeatureCard 
                  active={reduceMotion} onClick={toggleReduceMotion} icon={ZapOff} 
                  title="Kurangi Animasi" subtitle="Hentikan gerak UI" 
                  colorClass="bg-gradient-to-br from-rose-400 to-red-500" shadowClass="shadow-[0_8px_20px_rgba(244,63,94,0.4)]" 
                />

                <FeatureCard 
                  active={dyslexiaMode} onClick={toggleDyslexia} icon={BookOpen} 
                  title="Mode Disleksia" subtitle="Spasi & font khusus" 
                  colorClass="bg-gradient-to-br from-amber-400 to-orange-500" shadowClass="shadow-[0_8px_20px_rgba(245,158,11,0.4)]" 
                />

                <FeatureCard 
                  active={grayscaleMode} onClick={toggleGrayscale} icon={Sparkles} 
                  title="Mode Monokrom" subtitle="Tampilan Hitam-Putih" 
                  colorClass="bg-gradient-to-br from-slate-500 to-slate-700" shadowClass="shadow-[0_8px_20px_rgba(100,116,139,0.4)]" 
                />
                
                <FeatureCard 
                  active={highlightLinks} onClick={toggleHighlightLinks} icon={Pointer} 
                  title="Sorot Tautan" subtitle="Garis bawahi link" 
                  colorClass="bg-gradient-to-br from-cyan-400 to-blue-500" shadowClass="shadow-[0_8px_20px_rgba(6,182,212,0.4)]" 
                />

                <FeatureCard 
                  active={hapticFeedback} onClick={toggleHapticFeedback} icon={Activity} 
                  title="Getar (Haptic)" subtitle="Umpan balik saat tekan" 
                  colorClass="bg-gradient-to-br from-emerald-400 to-teal-500" shadowClass="shadow-[0_8px_20px_rgba(16,185,129,0.4)]" 
                />
              </div>

              {/* Text to Speech */}
              <div className="pt-2">
                <FeatureCard 
                  active={isSpeaking} onClick={toggleSpeechReader} icon={isSpeaking ? VolumeX : Volume2} 
                  title={isSpeaking ? "Hentikan Suara" : "Pembaca Layar"} subtitle="Text-to-Speech AI" 
                  colorClass="bg-gradient-to-br from-fuchsia-500 to-pink-600" shadowClass="shadow-[0_8px_20px_rgba(217,70,239,0.4)] animate-pulse" 
                />
              </div>

              {/* BISINDO 3D */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pl-2">Bahasa Isyarat 3D</label>
                <FeatureCard
                  active={bisindo3dOpen} 
                  onClick={() => {
                    const next = !bisindo3dOpen;
                    setBisindo3dOpen(next);
                    if (next) setIsOpen(false);
                  }} 
                  icon={Hand}
                  title="BISINDO 3D Avatar" 
                  subtitle="Asisten isyarat 3D interaktif"
                  colorClass="bg-gradient-to-br from-blue-500 to-indigo-600" 
                  shadowClass="shadow-[0_8px_20px_rgba(59,130,246,0.4)]"
                />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== BISINDO 3D Floating Smartphone Overlay ("muncul kayaa hpp") ===== */}
      <AnimatePresence>
        {bisindo3dOpen && (
          <motion.div
            initial={{ opacity: 0, y: 70, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 70, scale: 0.88 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="fixed bottom-24 right-4 sm:right-8 z-[9998] w-[310px] sm:w-[335px] h-[525px] rounded-[34px] overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#edf2f7] to-[#d9e2ec] border-[3px] border-white/95 shadow-[0_25px_80px_rgba(0,0,0,0.32)] flex flex-col select-none"
            id="bisindo-3d-panel"
          >
            {/* Top Phone Speaker Pill Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-slate-300/80 z-50 pointer-events-none" />

            {/* Top Close Button (Round white button with 'X' like user reference) */}
            <button
              onClick={() => setBisindo3dOpen(false)}
              className="absolute top-4 left-4 z-40 w-10 h-10 rounded-full bg-white text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all border border-slate-100 cursor-pointer"
              aria-label="Tutup Asisten 3D"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Top Right Avatar Switcher (Rian POLMAN, Budi, Nadia) */}
            <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5">
              <div className="relative">
                <button
                  onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm text-[11px] font-bold text-slate-700 flex items-center gap-1.5 border border-white/80 hover:bg-white transition-all cursor-pointer"
                  title="Pilih Model Karakter 3D"
                >
                  <span>{avatarModel === "rian" ? "🧑‍🎓 Rian (POLMAN)" : avatarModel === "budi" ? "🧢 Budi" : "👩 Nadia"}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showAvatarMenu && (
                  <div className="absolute top-full right-0 mt-1.5 p-1.5 bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 flex flex-col gap-1 z-50 min-w-[175px]">
                    <div className="px-2 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Karakter 3D BISINDO</div>
                    <button
                      onClick={() => { setAvatarModel("rian"); setShowAvatarMenu(false); }}
                      className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl text-left flex items-center gap-2 transition-all cursor-pointer ${
                        avatarModel === "rian" ? "bg-blue-600 text-white shadow-sm" : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="text-base">🧑‍🎓</span>
                      <div>
                        <div className="font-bold leading-tight">Rian (POLMAN)</div>
                        <div className={`text-[9px] ${avatarModel === "rian" ? "text-blue-100" : "text-slate-400"}`}>Almamater POLMAN Bandung</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { setAvatarModel("budi"); setShowAvatarMenu(false); }}
                      className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl text-left flex items-center gap-2 transition-all cursor-pointer ${
                        avatarModel === "budi" ? "bg-blue-600 text-white shadow-sm" : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="text-base">🧢</span>
                      <div>
                        <div className="font-bold leading-tight">Budi</div>
                        <div className={`text-[9px] ${avatarModel === "budi" ? "text-blue-100" : "text-slate-400"}`}>Casual Hoodie & Topi</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { setAvatarModel("nadia"); setShowAvatarMenu(false); }}
                      className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl text-left flex items-center gap-2 transition-all cursor-pointer ${
                        avatarModel === "nadia" ? "bg-blue-600 text-white shadow-sm" : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span className="text-base">👩</span>
                      <div>
                        <div className="font-bold leading-tight">Nadia</div>
                        <div className={`text-[9px] ${avatarModel === "nadia" ? "text-blue-100" : "text-slate-400"}`}>Cardigan & Anting Emas</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Subtitle Badge at Top Center (Current Sign Word) */}
            <div className="absolute top-16 left-0 right-0 z-30 flex justify-center pointer-events-none px-4">
              <motion.div
                key={bisindoSign}
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="px-3.5 py-1 rounded-full bg-white/92 backdrop-blur-md shadow-sm border border-white/80 text-slate-800 text-xs font-bold flex items-center gap-1.5"
              >
                <span>{SIGN_LABELS[bisindoSign]?.icon || "🤟"}</span>
                <span>
                  {SIGN_LABELS[bisindoSign]?.label ||
                    dbVocab.find((v) => v.id === bisindoSign)?.word ||
                    bisindoSign}
                </span>
              </motion.div>
            </div>

            {/* 3D Character Canvas (Fills the phone viewport) */}
            <div className="relative flex-1 w-full h-full overflow-hidden">
              <Bisindo3DCharacter
                isAnimating={bisindoAutoPlay}
                currentSign={bisindoSign}
                speed={bisindoSpeed}
                avatarModel={avatarModel}
                jacketColor={jacketColor}
                onSignChange={(newSign) => setBisindoSign(newSign)}
              />
            </div>

            {/* Floating Controls Overlay at Bottom (EXACTLY like user reference photo!) */}
            <div className="absolute bottom-4 left-0 right-0 z-40 px-4 flex flex-col items-center gap-2">
              {/* White Frosted Glass Pill with 3 Teal Buttons */}
              <div className="w-full max-w-[275px] bg-white/88 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-around">
                {/* 1. Pause/Play Button (Teal round button with || or ▶) */}
                <button
                  onClick={() => setBisindoAutoPlay(!bisindoAutoPlay)}
                  className="w-11 h-11 rounded-full bg-[#40b59f] hover:bg-[#349e89] text-white flex items-center justify-center border-2 border-white shadow-md transition-all active:scale-90 cursor-pointer"
                  title={bisindoAutoPlay ? "Jeda Animasi" : "Lanjutkan Animasi"}
                  aria-label="Pause or Play"
                >
                  {bisindoAutoPlay ? (
                    <Pause className="w-5 h-5 fill-white stroke-none" />
                  ) : (
                    <Play className="w-5 h-5 fill-white stroke-none ml-0.5" />
                  )}
                </button>

                {/* 2. Stop / Reset Button (Teal round button with rounded square) */}
                <button
                  onClick={() => {
                    setBisindoAutoPlay(false);
                    setBisindoSign("salam");
                  }}
                  className="w-11 h-11 rounded-full bg-[#40b59f] hover:bg-[#349e89] text-white flex items-center justify-center border-2 border-white shadow-md transition-all active:scale-90 cursor-pointer"
                  title="Hentikan / Pose Salam"
                  aria-label="Stop"
                >
                  <Square className="w-4 h-4 fill-white stroke-none rounded-sm" />
                </button>

                {/* 3. Speed Badge Button (Teal round button with speed e.g. 1.0) */}
                <button
                  onClick={cycleSpeed}
                  className="w-11 h-11 rounded-full bg-[#40b59f] hover:bg-[#349e89] text-white flex items-center justify-center border-2 border-white shadow-md transition-all active:scale-90 font-bold text-xs cursor-pointer"
                  title="Atur Kecepatan Gerak"
                  aria-label="Speed"
                >
                  {bisindoSpeed}x
                </button>
              </div>

              {/* Toggle Vocabulary / Text Drawer */}
              <button
                onClick={() => setShowWordDrawer(!showWordDrawer)}
                className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-slate-700 shadow-sm border border-white/70 flex items-center gap-1 hover:bg-white transition-all cursor-pointer"
              >
                <span>{showWordDrawer ? "Tutup Pilihan Kata" : "Pilihan Kata & Teks"}</span>
                {showWordDrawer ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </button>

              {/* Expandable Word Drawer */}
              <AnimatePresence>
                {showWordDrawer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-3 border border-white/80 dark:border-white/10 shadow-xl space-y-2 overflow-hidden"
                  >
                    {/* Text Input */}
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={bisindoInput}
                        onChange={(e) => setBisindoInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleBisindoTextSubmit()}
                        placeholder="Ketik teks untuk dieja..."
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3db59b]"
                      />
                      <button
                        onClick={handleBisindoTextSubmit}
                        className="px-2.5 py-1.5 rounded-lg bg-[#3db59b] hover:bg-[#329f87] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Vocabulary Chips */}
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar">
                      {activeVocabList.map((item) => (
                        <button
                          key={item.sign}
                          onClick={() => handleBisindoWordClick(item.sign)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                            bisindoSign === item.sign
                              ? "bg-[#3db59b] text-white border-[#3db59b] shadow-sm"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#3db59b]"
                          }`}
                        >
                          {item.word}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
