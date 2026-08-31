"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, GraduationCap, X, CheckCircle2, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { HIJAIYAH_LABELS, SignLabel } from "@/constants/signLabels";
import { subscribeLearningStats, LearningStats, LetterStat } from "@/lib/learningStats";
import ModalPortal from "@/components/ModalPortal";

// Urutan abjad Hijaiyah yang benar (sesuai standar)
const HIJAIYAH_SORTED_IDS = [
  1,  // Alif
  2,  // Ba
  21, // Ta
  24, // Tsa
  10, // Jim
  8,  // Ha
  12, // Kha
  3,  // Dal
  5,  // Dzal
  17, // Ra
  28, // Zay (Zai)
  19, // Sin
  20, // Syin
  18, // Shad
  4,  // Dhad
  23, // Tha
  27, // Zaa (Zha)
  0,  // Ain
  7,  // Gain (Ghain)
  6,  // Fa
  16, // Qaf
  11, // Kaf
  13, // Lam
  14, // Mim
  15, // Nun
  25, // Waw (Wau)
  9,  // Hha (Ha besar)
  26, // Ya
  22, // TaMarbutah
];

const SORTED_LABELS = HIJAIYAH_SORTED_IDS.map(id => HIJAIYAH_LABELS.find(l => l.id === id)!).filter(Boolean);

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
  master: { dot: "bg-purple-500", label: "Mahir", text: "text-purple-600" },
};

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

export default function KamusPage() {
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
    return HIJAIYAH_LABELS.filter((l) => masteryOf(stats.letters?.[String(l.id)]) === "master").length;
  }, [stats]);

  return (
    <div className="min-h-full bg-[#f4f6fc] flex flex-col pb-10">
      {/* Header — Sticky 3D Neumorphism */}
      <div className="sticky top-0 z-50 px-6 pt-5 pb-5 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0 bubble-3d text-white">
              <GraduationCap className="w-7 h-7 drop-shadow-md" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-[24px] font-black text-slate-800 tracking-tight leading-none text-3d">Kamus Hijaiyah</h1>
              <p className="text-slate-500 text-[12px] font-bold mt-1.5 uppercase tracking-wide text-3d">
                29 Huruf · {learnedCount} Dikuasai
              </p>
            </div>
          </div>
          
          <Link
            href="/app/bipintar"
            aria-label="Kembali"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white active:scale-95 transition-transform shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-purple-600 drop-shadow-sm" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* Grid huruf */}
      <div className="px-6 grid grid-cols-3 gap-4">
        {SORTED_LABELS.map((l) => {
          const m = masteryOf(stats?.letters?.[String(l.id)]);
          return (
            <button
              key={l.id}
              onClick={() => setSelected(l)}
              className="relative bg-[#f4f6fc] border border-white rounded-[24px] py-5 flex flex-col items-center shadow-3d shadow-3d-active active:scale-95 transition-all"
            >
              <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full shadow-inner ${masteryStyle[m].dot}`} />
              <span
                className="text-[44px] leading-none text-purple-600 mb-1 drop-shadow-sm"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {l.arabic}
              </span>
              <span className="text-[13px] font-black text-slate-700 text-3d">{l.indo}</span>
            </button>
          );
        })}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <ModalPortal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-end sm:items-center sm:justify-center p-6 sm:p-0"
            onClick={() => { setSelected(null); setShowDemonstration(false); }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-[400px] bg-[#f4f6fc] rounded-[32px] p-7 pb-7 shadow-2xl border-t border-white mb-6"
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
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-[#f4f6fc] rounded-3xl mb-4 mt-2 flex items-center justify-center overflow-hidden shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white p-2">
                    {(() => {
                      const l = selected.label.toLowerCase();
                      const map: Record<string, string> = {
                        gain: "ghain",
                        hha: "ha_besar",
                        tamarbutah: "ta_marbutah",
                        waw: "wau",
                        zaa: "zha",
                        zay: "zai"
                      };
                      const fileName = map[l] || l;
                      return (
                        <img
                          src={`/images/hijaiyah/${fileName}.png`}
                          alt={`Peragaan isyarat ${selected.indo}`}
                          className="w-full h-full object-contain mix-blend-multiply"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="text-center text-slate-400 p-2"><p class="text-xs font-semibold">Gambar Belum Tersedia</p></div>';
                          }}
                        />
                      );
                    })()}
                  </div>
                ) : (
                  <span
                    className="text-[110px] leading-none text-purple-600 mb-2 drop-shadow-md"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {selected.arabic}
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
                    className="flex-1 py-4 rounded-[20px] bg-[#f4f6fc] shadow-3d shadow-3d-active border border-white text-purple-600 font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-all"
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
                  className="mt-4 w-full py-4 rounded-[20px] bg-purple-600 shadow-[0_8px_16px_rgba(147,51,234,0.3)] border border-purple-600/50 text-white font-black text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <CheckCircle2 className="w-5 h-5 drop-shadow-sm" /> Latih Isyarat
                </Link>

                <Link
                  href="/app/bipintar/hijaiyah"
                  className="mt-3 text-[13px] font-bold text-slate-400 underline underline-offset-2"
                >
                  Buka kamera deteksi
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
