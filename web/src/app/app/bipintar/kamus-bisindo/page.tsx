"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, GraduationCap, X, CheckCircle2, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UMUM_LABELS, SignLabel } from "@/constants/signLabels";
import { subscribeLearningStats, LearningStats, LetterStat } from "@/lib/learningStats";

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
  master: { dot: "bg-[#00B894]", label: "Mahir", text: "text-[#00B894]" },
};

function StaticGif({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
      }
    };
    img.onerror = () => {
      setError(true);
    };
  }, [src]);

  if (error) {
    return <div className={`flex items-center justify-center bg-slate-50 rounded-xl text-slate-300 ${className}`}><span className="text-[10px] font-bold">No Image</span></div>;
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

export default function KamusBisindoPage() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [selected, setSelected] = useState<SignLabel | null>(null);
  const [showDemonstration, setShowDemonstration] = useState(false);

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

  const selStat = selected ? stats?.letters?.[String(selected.id)] : undefined;
  const learnedCount = useMemo(() => {
    if (!stats) return 0;
    return UMUM_LABELS.filter((l) => masteryOf(stats.letters?.[String(l.id)]) === "master").length;
  }, [stats]);

  return (
    <div className="min-h-full bg-[#f4f6fc] flex flex-col pb-10">
      {/* Header */}
      <div className="px-6 pt-12 pb-5">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/app/bipintar"
            aria-label="Kembali"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#f4f6fc] shadow-3d shadow-3d-active border border-white active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-[#0984E3] drop-shadow-sm" strokeWidth={2.5} />
          </Link>
          <div className="w-11 h-11" />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-[#0984E3]" strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="text-[24px] font-black text-slate-800 tracking-tight leading-none text-3d">Kamus BISINDO</h1>
            <p className="text-slate-500 text-[12px] font-bold mt-1.5 uppercase tracking-wide text-3d">
              48 Isyarat · {learnedCount} Dikuasai
            </p>
          </div>
        </div>
      </div>

      {/* Grid huruf */}
      <div className="px-6 grid grid-cols-3 gap-4">
        {UMUM_LABELS.map((l) => {
          const m = masteryOf(stats?.letters?.[String(l.id)]);
          return (
            <button
              key={l.id}
              onClick={() => setSelected(l)}
              className="relative bg-[#f4f6fc] border border-white rounded-[24px] py-4 flex flex-col items-center shadow-3d shadow-3d-active active:scale-95 transition-all"
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

              <span className="text-[13px] font-black text-slate-700 leading-tight text-center px-2 text-3d">{l.indo}</span>
            </button>
          );
        })}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-end sm:items-center sm:justify-center"
            onClick={() => { setSelected(null); setShowDemonstration(false); }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-[400px] bg-[#f4f6fc] rounded-t-[32px] sm:rounded-[32px] p-7 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-white"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-10" />
                <div className="w-12 h-1.5 bg-white shadow-inner rounded-full mx-auto mt-1 sm:hidden border border-slate-200" />
                <button onClick={() => { setSelected(null); setShowDemonstration(false); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f4f6fc] shadow-3d shadow-3d-active border border-white active:scale-95 transition-all">
                  <X className="w-5 h-5 text-slate-500" strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex flex-col items-center">
                {showDemonstration ? (
                  <div className="w-full h-48 sm:h-56 bg-[#f4f6fc] rounded-3xl mb-4 mt-2 flex items-center justify-center overflow-hidden shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white p-2 mix-blend-multiply opacity-90">
                    <img
                      src={
                        selected.label.length === 1
                          ? `/gifs/abjad/${selected.label.toUpperCase()}.gif`
                          : `/gifs/bisindo/${selected.label.toLowerCase()}.gif`
                      }
                      alt={`Peragaan isyarat ${selected.indo}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="text-center text-slate-400 p-2"><p class="text-xs font-semibold">GIF Belum Tersedia</p></div>';
                      }}
                    />
                  </div>
                ) : (
                  <span
                    className="text-[110px] leading-none text-[#0984E3] mb-2 drop-shadow-md"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {selected.label}
                  </span>
                )}
                <h2 className="text-[28px] font-black text-slate-800 text-3d">{selected.indo}</h2>

                {(() => {
                  const m = masteryOf(selStat);
                  return (
                    <div className="mt-3 flex items-center gap-2 bg-[#f4f6fc] px-4 py-2 rounded-full border border-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)]">
                      <span className={`w-2.5 h-2.5 rounded-full shadow-inner ${masteryStyle[m].dot}`} />
                      <span className={`text-[12px] font-bold ${masteryStyle[m].text}`}>
                        {masteryStyle[m].label}
                      </span>
                      {selStat && selStat.seen > 0 && (
                        <>
                          <span className="w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
                          <span className="text-[12px] font-black text-slate-500">
                            {Math.round((selStat.correct / selStat.seen) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                  );
                })()}

                <div className="flex gap-3 mt-7 w-full">
                  <button
                    onClick={() => speak(selected.indo)}
                    className="flex-1 py-4 rounded-[20px] bg-[#f4f6fc] shadow-3d shadow-3d-active border border-white text-[#0984E3] font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Volume2 className="w-5 h-5 drop-shadow-sm" /> Dengar
                  </button>
                  <button
                    onClick={() => setShowDemonstration(!showDemonstration)}
                    className={`flex-1 py-4 rounded-[20px] font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-3d shadow-3d-active border border-white ${
                      showDemonstration 
                        ? 'bg-amber-100 text-amber-600' 
                        : 'bg-[#f4f6fc] text-amber-500'
                    }`}
                  >
                    <Video className="w-5 h-5 drop-shadow-sm" /> {showDemonstration ? 'Tutup' : 'Peragakan'}
                  </button>
                </div>
                <Link
                  href="/app/bipintar/quiz"
                  className="mt-4 w-full py-4 rounded-[20px] bg-[#0984E3] shadow-[0_8px_16px_rgba(9,132,227,0.3)] border border-[#0984E3]/50 text-white font-black text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <CheckCircle2 className="w-5 h-5 drop-shadow-sm" /> Latih Isyarat
                </Link>

                <Link
                  href="/app/bipintar/bisindo"
                  className="mt-3 text-[13px] font-bold text-slate-400 underline underline-offset-2"
                >
                  Buka kamera deteksi
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
