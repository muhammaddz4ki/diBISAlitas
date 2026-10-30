"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  GraduationCap,
  X,
  CheckCircle2,
  Video,
  Sparkles,
  Film,
  Send,
  Play,
  Pause,
  RotateCcw,
  Type,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UMUM_LABELS, SignLabel } from "@/constants/signLabels";
import { subscribeLearningStats, LearningStats, LetterStat } from "@/lib/learningStats";
import { subscribeBisindoItems } from "@/lib/bisindoService";
import { BisindoItem } from "@/lib/types";
import Bisindo3DCharacter from "@/components/Bisindo3DCharacter";
import ModalPortal from "@/components/ModalPortal";
import { useSignSequencePlayer } from "@/hooks/useSignSequencePlayer";

type Mastery = "none" | "weak" | "ok" | "master";

function masteryOf(stat: LetterStat | undefined): Mastery {
  if (!stat || stat.seen === 0) return "none";
  const acc = stat.correct / stat.seen;
  if (acc >= 0.8) return "master";
  if (acc >= 0.4) return "ok";
  return "weak";
}

const masteryStyle: Record<Mastery, { dot: string; label: string; text: string }> = {
  none: { dot: "bg-slate-200", label: "Belum dicoba", text: "text-slate-400" },
  weak: { dot: "bg-rose-400", label: "Perlu latihan", text: "text-rose-500" },
  ok: { dot: "bg-amber-400", label: "Cukup", text: "text-amber-500" },
  master: { dot: "bg-indigo-500", label: "Mahir", text: "text-indigo-600" },
};

function StaticGif({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
      }
    };
    img.onerror = () => {
      setError(true);
    };
  }, [src]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-slate-50 rounded-xl text-slate-300 ${className}`}>
        <span className="text-[10px] font-bold">No Image</span>
      </div>
    );
  }

  return <canvas ref={canvasRef} className={className} title={alt} />;
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "id-ID";
  u.rate = 0.9;
  const idVoice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().includes("id"));
  if (idVoice) u.voice = idVoice;
  window.speechSynthesis.speak(u);
}

export type UnifiedSign =
  | { type: "3d"; item: BisindoItem }
  | { type: "static"; item: SignLabel };

const QUICK_PHRASES = [
  "Halo terima kasih",
  "Pasti bisa",
  "Tolong bantu saya",
  "POLMAN Bandung",
  "Salam hormat",
];

export default function KamusBisindoPage() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [dynamic3DItems, setDynamic3DItems] = useState<BisindoItem[]>([]);
  const [selectedSign, setSelectedSign] = useState<UnifiedSign | null>(null);
  const [showDemonstration, setShowDemonstration] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [speed3D, setSpeed3D] = useState<number>(1.0);
  const [showRawVideo, setShowRawVideo] = useState(false);

  // State untuk Input Text-to-Sign Interpreter
  const [inputText, setInputText] = useState("Halo terima kasih");
  const [showInterpreterPlayer, setShowInterpreterPlayer] = useState(false);

  // Hook State Machine Sequence Player
  const player = useSignSequencePlayer({
    customDictionary: dynamic3DItems,
    defaultSpeed: 1.0,
    enableTTS: true,
  });

  // Subscribe to learning stats
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) {
        setStats(null);
        return;
      }
      const unsub = subscribeLearningStats(u.uid, (s) => setStats(s), () => setStats(null));
      return () => unsub();
    });
    return () => unsubAuth();
  }, []);

  // Subscribe to dynamic 3D items from Firestore
  useEffect(() => {
    const unsub = subscribeBisindoItems((items) => {
      setDynamic3DItems(items);
    });
    return () => unsub();
  }, []);

  // Filter items
  const displayItems = useMemo<UnifiedSign[]>(() => {
    const d3dList: UnifiedSign[] = dynamic3DItems.map((item) => ({ type: "3d" as const, item }));
    const staticList: UnifiedSign[] = UMUM_LABELS.map((item) => ({ type: "static" as const, item }));

    if (activeTab === "3d") return d3dList;
    if (activeTab === "sapaan") return d3dList.filter((x) => x.type === "3d" && x.item.category === "sapaan");
    if (activeTab === "akademik") return d3dList.filter((x) => x.type === "3d" && x.item.category === "akademik");
    if (activeTab === "darurat") return d3dList.filter((x) => x.type === "3d" && x.item.category === "darurat");
    if (activeTab === "harian") return d3dList.filter((x) => x.type === "3d" && x.item.category === "harian");
    if (activeTab === "alfabet") return staticList.filter((x) => x.type === "static" && x.item.label.length === 1);
    return [...d3dList, ...staticList];
  }, [dynamic3DItems, activeTab]);

  // Handler Submit Teks ke Interpreter
  const handleTranslateSentence = (sentenceToPlay?: string) => {
    const targetText = sentenceToPlay || inputText;
    if (!targetText.trim()) return;

    setShowInterpreterPlayer(true);
    player.loadSentence(targetText);
    setTimeout(() => {
      player.play();
    }, 150);
  };

  return (
    <div className="min-h-full bg-[#f4f6fc] flex flex-col pb-12">
      {/* Header — Sticky 3D Neumorphism */}
      <div className="sticky top-0 z-50 px-6 pt-5 pb-5 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shrink-0 bubble-3d text-white">
              <GraduationCap className="w-7 h-7 drop-shadow-md" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-[24px] font-black text-slate-800 tracking-tight leading-none text-3d">
                Kamus BISINDO
              </h1>
              <p className="text-slate-500 text-[12px] font-bold mt-1.5 uppercase tracking-wide text-3d flex items-center gap-1.5">
                <span>{displayItems.length} Isyarat</span>
                <span>•</span>
                <span className="text-indigo-600 font-extrabold">{dynamic3DItems.length} 3D Rian POLMAN</span>
              </p>
            </div>
          </div>

          <Link
            href="/app/bipintar"
            aria-label="Kembali"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white active:scale-95 transition-transform shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-600 drop-shadow-sm" strokeWidth={2.5} />
          </Link>
        </div>

        {/* Filter Tab Chips */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-4 pb-1">
          {[
            { id: "all", label: "Semua" },
            { id: "3d", label: "3D Rian POLMAN" },
            { id: "sapaan", label: "Sapaan" },
            { id: "akademik", label: "Akademik" },
            { id: "darurat", label: "Darurat" },
            { id: "harian", label: "Harian" },
            { id: "alfabet", label: "Abjad A-Z" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                  : "bg-white/80 text-slate-600 border-white hover:bg-white shadow-sm"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          FITUR UTAMA: INTERACTIVE TEXT-TO-SIGN INTERPRETER ENGINE (RIAN POLMAN)
          ========================================================================= */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-br from-white via-[#f8faff] to-[#edf2fc] rounded-[28px] p-5 border-2 border-indigo-200/80 shadow-3d">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-[15px] font-black text-slate-800 leading-tight">
                  Penerjemah Kalimat ke Isyarat 3D
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Rian POLMAN memperagakan kalimat kata demi kata
                </p>
              </div>
            </div>

            {showInterpreterPlayer && (
              <button
                onClick={() => {
                  player.stop();
                  setShowInterpreterPlayer(false);
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Tutup Player
              </button>
            )}
          </div>

          {/* Input Kalimat Bebas */}
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTranslateSentence();
                }}
                placeholder="Ketik kalimat (misal: Halo terima kasih POLMAN)..."
                className="w-full pl-3.5 pr-8 py-3 rounded-2xl bg-[#f4f6fc] border border-indigo-100 text-[13px] font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
              />
              {inputText && (
                <button
                  onClick={() => setInputText("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleTranslateSentence()}
              className="px-4 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Peragakan</span>
            </button>
          </div>

          {/* Quick Phrases Chip */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Cepat:
            </span>
            {QUICK_PHRASES.map((phrase) => (
              <button
                key={phrase}
                onClick={() => {
                  setInputText(phrase);
                  handleTranslateSentence(phrase);
                }}
                className="px-2.5 py-1 rounded-full bg-white border border-indigo-100 text-indigo-700 font-bold text-[11px] whitespace-nowrap shadow-sm hover:bg-indigo-50 active:scale-95 transition-all cursor-pointer"
              >
                {phrase}
              </button>
            ))}
          </div>

          {/* Active Sequence Player Viewport */}
          <AnimatePresence>
            {showInterpreterPlayer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="overflow-hidden mt-4 pt-4 border-t border-indigo-100/80"
              >
                {/* 3D Character Viewport Box */}
                <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-[#f8fafc] via-[#edf2f7] to-[#d9e2ec] rounded-3xl overflow-hidden shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border-2 border-white flex items-center justify-center">
                  <Bisindo3DCharacter
                    isAnimating={player.isPlaying}
                    speed={player.playbackSpeed}
                    avatarModel="rian"
                    activeFrameUrl={player.activeFrameUrl}
                    highlightText={player.currentToken?.rawText}
                    subtitle={player.currentToken?.description}
                    showControls={true}
                    isPlaying={player.isPlaying}
                    onPlay={player.resume}
                    onPause={player.pause}
                    onReplay={player.replay}
                    onSpeedChange={player.setPlaybackSpeed}
                  />

                  {/* Sound TTS Toggle Badge */}
                  <button
                    onClick={() => player.setEnableTTS(!player.enableTTS)}
                    title={player.enableTTS ? "Suara TTS Aktif" : "Suara TTS Nonaktif"}
                    className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border shadow-sm transition-all z-20 ${
                      player.enableTTS
                        ? "bg-white/90 text-indigo-600 border-indigo-100"
                        : "bg-black/40 text-white/60 border-transparent"
                    }`}
                  >
                    {player.enableTTS ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                {/* Progress Bar & Sequence Chips */}
                <div className="mt-3.5 space-y-2">
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>
                      Progres Isyarat: {player.currentIndex + 1} dari {player.tokens.length} gestur
                    </span>
                    <span className="text-indigo-600">{player.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-600 rounded-full"
                      animate={{ width: `${player.progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>

                  {/* Interactive Word Sequence Tokens */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {player.tokens.map((token, idx) => {
                      const isActive = idx === player.currentIndex;
                      return (
                        <button
                          key={token.id}
                          onClick={() => player.jumpToIndex(idx)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {token.rawText}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid Isyarat Regular */}
      <div className="px-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
        {displayItems.map((entry, idx) => {
          if (entry.type === "3d") {
            const item = entry.item;
            return (
              <button
                key={`3d-${item.id}-${idx}`}
                onClick={() => {
                  setSelectedSign(entry);
                  setShowDemonstration(false);
                  setShowRawVideo(false);
                }}
                className="relative bg-gradient-to-b from-white to-[#f0f4fa] border-2 border-indigo-200/80 rounded-[24px] py-3.5 px-2 flex flex-col items-center shadow-3d shadow-3d-active active:scale-95 transition-all group cursor-pointer"
              >
                {/* 3D Special Pill */}
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-black shadow-sm flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>3D</span>
                </span>

                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-2xl overflow-hidden relative shadow-sm border border-slate-100">
                  <Image
                    src={item.thumbnailUrl || "/avatars/rian_salam.jpg"}
                    alt={item.word}
                    fill
                    sizes="80px"
                    className="object-cover object-top group-hover:scale-105 transition-transform"
                  />
                </div>

                <span className="text-[12px] font-black text-indigo-950 leading-tight text-center px-1 truncate w-full">
                  {item.word}
                </span>
                <span className="text-[9px] font-semibold text-indigo-500 uppercase tracking-wider mt-0.5">
                  {item.category}
                </span>
              </button>
            );
          }

          // Static item
          const l = entry.item;
          const m = masteryOf(stats?.letters?.[String(l.id)]);
          return (
            <button
              key={`static-${l.id}`}
              onClick={() => {
                setSelectedSign(entry);
                setShowDemonstration(false);
                setShowRawVideo(false);
              }}
              className="relative bg-[#f4f6fc] border border-white rounded-[24px] py-4 flex flex-col items-center shadow-3d shadow-3d-active active:scale-95 transition-all cursor-pointer"
            >
              <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full shadow-inner ${masteryStyle[m].dot}`} />

              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 overflow-hidden flex items-center justify-center mix-blend-multiply opacity-80">
                <StaticGif
                  src={
                    l.label.length === 1
                      ? `/gifs/abjad/${l.label.toUpperCase()}.gif`
                      : `/gifs/bisindo/${l.label.toLowerCase()}.gif`
                  }
                  alt={`Isyarat ${l.indo}`}
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>

              <span className="text-[13px] font-black text-slate-700 leading-tight text-center px-2 text-3d">
                {l.indo}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail Modal Portal (Bila item diklik dari Grid) */}
      <AnimatePresence>
        {selectedSign && (
          <ModalPortal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center sm:justify-center p-4 sm:p-0"
              onClick={() => setSelectedSign(null)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:w-[420px] bg-[#f4f6fc] rounded-[32px] p-6 pb-7 shadow-2xl border-t border-white mb-2 max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                {/* Modal Top Bar */}
                <div className="flex justify-between items-center mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {selectedSign.type === "3d" ? "Asisten 3D Rian (POLMAN)" : "Kamus Isyarat BISINDO"}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedSign(null)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f4f6fc] shadow-3d border border-white active:scale-95 transition-all text-slate-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Content Renderer */}
                <div className="flex flex-col items-center text-center">
                  {selectedSign.type === "3d" ? (
                    <div className="w-full space-y-4">
                      {showRawVideo && selectedSign.item.videoRawUrl ? (
                        <div className="w-full h-56 rounded-3xl overflow-hidden bg-black shadow-inner border border-slate-200">
                          <video
                            src={selectedSign.item.videoRawUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-[#f8fafc] via-[#edf2f7] to-[#d9e2ec] rounded-3xl overflow-hidden shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border-2 border-white flex items-center justify-center">
                          <Bisindo3DCharacter
                            currentSign={selectedSign.item.id}
                            speed={speed3D}
                            isAnimating={true}
                            avatarModel="rian"
                            highlightText={selectedSign.item.word}
                            subtitle={selectedSign.item.description}
                          />
                          {/* Speed Badge */}
                          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-white text-[11px] font-bold text-slate-700 z-20">
                            <span>Kecepatan:</span>
                            <button
                              onClick={() => setSpeed3D((prev) => (prev === 1.0 ? 0.75 : prev === 0.75 ? 1.25 : 1.0))}
                              className="text-indigo-600 underline font-black"
                            >
                              {speed3D}x
                            </button>
                          </div>
                        </div>
                      )}

                      <div>
                        <h2 className="text-[26px] font-black text-slate-900 leading-tight">
                          {selectedSign.item.word}
                        </h2>
                        {selectedSign.item.description && (
                          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                            {selectedSign.item.description}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons for 3D */}
                      <div className="flex gap-2.5 w-full pt-2">
                        <button
                          onClick={() => speak(selectedSign.item.word)}
                          className="flex-1 py-3.5 rounded-[20px] bg-[#f4f6fc] shadow-3d border border-white text-indigo-600 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" /> Dengar Suara
                        </button>

                        {selectedSign.item.videoRawUrl && (
                          <button
                            onClick={() => setShowRawVideo(!showRawVideo)}
                            className={`flex-1 py-3.5 rounded-[20px] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-3d border border-white cursor-pointer ${
                              showRawVideo ? "bg-amber-100 text-amber-700" : "bg-[#f4f6fc] text-slate-700"
                            }`}
                          >
                            <Film className="w-4 h-4" /> {showRawVideo ? "Karakter 3D" : "Video Asli"}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Static GIF Viewport */
                    <div className="w-full space-y-4">
                      <div className="w-full h-48 sm:h-56 bg-[#f4f6fc] rounded-3xl flex items-center justify-center overflow-hidden shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white p-2 mix-blend-multiply opacity-90">
                        {showDemonstration ? (
                          <img
                            src={
                              selectedSign.item.label.length === 1
                                ? `/gifs/abjad/${selectedSign.item.label.toUpperCase()}.gif`
                                : `/gifs/bisindo/${selectedSign.item.label.toLowerCase()}.gif`
                            }
                            alt={`Peragaan isyarat ${selectedSign.item.indo}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <StaticGif
                            src={
                              selectedSign.item.label.length === 1
                                ? `/gifs/abjad/${selectedSign.item.label.toUpperCase()}.gif`
                                : `/gifs/bisindo/${selectedSign.item.label.toLowerCase()}.gif`
                            }
                            alt={`Isyarat statis ${selectedSign.item.indo}`}
                            className="w-full h-full object-contain drop-shadow-sm"
                          />
                        )}
                      </div>

                      <h2 className="text-[28px] font-black text-slate-800 text-3d">
                        {selectedSign.item.indo}
                      </h2>

                      {/* Action Buttons for Static */}
                      <div className="flex gap-2.5 w-full pt-2">
                        <button
                          onClick={() => speak(selectedSign.item.indo)}
                          className="flex-1 py-3.5 rounded-[20px] bg-[#f4f6fc] shadow-3d border border-white text-indigo-600 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" /> Dengar
                        </button>
                        <button
                          onClick={() => setShowDemonstration(!showDemonstration)}
                          className={`flex-1 py-3.5 rounded-[20px] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-3d border border-white cursor-pointer ${
                            showDemonstration ? "bg-amber-100 text-amber-600" : "bg-[#f4f6fc] text-amber-500"
                          }`}
                        >
                          <Video className="w-4 h-4" /> {showDemonstration ? "Tutup" : "Peragakan"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Common Link to Quiz */}
                  <Link
                    href="/app/bipintar/quiz"
                    className="mt-4 w-full py-4 rounded-[20px] bg-indigo-600 shadow-[0_8px_16px_rgba(79,70,229,0.3)] border border-indigo-600/50 text-white font-black text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <CheckCircle2 className="w-4 h-4 drop-shadow-sm" /> Latih di Kuis Tantangan
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </div>
  );
}
