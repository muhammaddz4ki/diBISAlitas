"use client";

import { useCallback, useEffect, useRef, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Trophy,
  Flame,
  Timer,
  CheckCircle2,
  XCircle,
  Hand,
  Award,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useYolo } from "@/hooks/useYolo";
import { useSignQuiz, QuizSummary } from "@/hooks/useSignQuiz";
import { CameraDetector } from "@/components/CameraDetector";
import { HIJAIYAH_LABELS, UMUM_LABELS } from "@/constants/signLabels";
import { DetectionResult } from "@/utils/yoloInference";
import { auth, db } from "@/lib/firebase";
import { saveQuizScore } from "@/lib/quizService";
import { saveLearningSession } from "@/lib/learningStats";
import { QUIZ_CONFIG } from "@/lib/quizConfig";

type SaveState = "idle" | "saving" | "saved" | "error" | "guest";

export default function HijaiyahQuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">Loading...</div>}>
      <QuizCore />
    </Suspense>
  );
}

function QuizCore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "hijaiyah";

  const isHijaiyahActive = mode === "hijaiyah" || mode === "gabungan";
  const isBisindoActive = mode === "bisindo" || mode === "gabungan";

  const hijaiyahLabels = useMemo(() => HIJAIYAH_LABELS.map((l) => ({ ...l, type: "hijaiyah" as const })), []);
  const bisindoLabels = useMemo(() => UMUM_LABELS.map((l) => ({ ...l, type: "bisindo" as const })), []);

  const { isModelLoading: loadH, error: errH, detections: detH, detectionResult: resH, detectFrame: frameH } = useYolo(
    isHijaiyahActive ? "/models/Hijayah/model.onnx" : null,
    hijaiyahLabels
  );

  const { isModelLoading: loadB, error: errB, detections: detB, detectionResult: resB, detectFrame: frameB } = useYolo(
    isBisindoActive ? "/models/Bisindo/model.onnx" : null,
    bisindoLabels
  );

  const combinedLabels = useMemo(() => {
    if (mode === "gabungan") {
      return [...hijaiyahLabels, ...bisindoLabels];
    }
    if (mode === "bisindo") {
      return bisindoLabels;
    }
    return hijaiyahLabels;
  }, [mode, hijaiyahLabels, bisindoLabels]);

  const [activeRes, setActiveRes] = useState<DetectionResult | null>(null);

  const [user, setUser] = useState<{ uid: string; name: string } | null>(null);
  const userRef = useRef<{ uid: string; name: string } | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isNewBest, setIsNewBest] = useState(false);

  // Simpan skor saat sesi selesai (dipanggil oleh hook, bukan via effect)
  const handleFinish = useCallback((summary: QuizSummary) => {
    const u = userRef.current;
    if (!u) {
      setSaveState("guest");
      return;
    }
    setSaveState("saving");
    // Simpan statistik belajar per-huruf (fire-and-forget, tak memblokir UI skor)
    void saveLearningSession(u.uid, summary.answers);
    saveQuizScore({
      uid: u.uid,
      userName: u.name,
      score: summary.score,
      correctCount: summary.correctCount,
      totalQuestions: summary.totalQuestions,
      bestStreak: summary.bestStreak,
    })
      .then((r) => {
        setIsNewBest(r.isNewBest);
        setSaveState("saved");
      })
      .catch(() => setSaveState("error"));
  }, []);

  const quizState = useSignQuiz(activeRes, combinedLabels, handleFinish);
  const {
    phase,
    target,
    index,
    totalQuestions,
    timeLeft,
    holdProgress,
    score,
    streak,
    bestStreak,
    correctCount,
    lastOutcome,
    start,
    reset,
  } = quizState;

  useEffect(() => {
    if (target?.type === "bisindo") {
      setActiveRes(resB);
    } else if (target?.type === "hijaiyah") {
      setActiveRes(resH);
    } else {
      setActiveRes(mode === "bisindo" ? resB : resH);
    }
  }, [target?.type, resB, resH, mode]);

  const detectFrame = useCallback(
    async (v: HTMLVideoElement, c: CanvasRenderingContext2D, f: boolean = true) => {
      if (target?.type === "bisindo") {
        await frameB(v, c, f);
      } else if (target?.type === "hijaiyah") {
        await frameH(v, c, f);
      } else {
        if (mode === "bisindo") await frameB(v, c, f);
        else await frameH(v, c, f);
      }
    },
    [target?.type, frameB, frameH, mode]
  );

  const isModelLoading = mode === "gabungan" ? (loadH || loadB) : (mode === "bisindo" ? loadB : loadH);
  const error = errH || errB;
  const detections = target?.type === "bisindo" ? detB : (target?.type === "hijaiyah" ? detH : (mode === "bisindo" ? detB : detH));
  const detectionResult = activeRes;

  // Ambil user login + nama tampilan (dari dokumen users bila ada)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        userRef.current = null;
        setUser(null);
        return;
      }
      let name = u.displayName || (u.email ? u.email.split("@")[0] : "Pengguna");
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const d = snap.data();
          name = (d.name as string) || (d.fullName as string) || name;
        }
      } catch {
        /* abaikan; pakai nama fallback */
      }
      const info = { uid: u.uid, name };
      userRef.current = info;
      setUser(info);
    });
    return () => unsub();
  }, []);

  const timePct = Math.max(0, Math.min(1, timeLeft / QUIZ_CONFIG.timePerQuestionSec));

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center font-sans">
      <div className="w-full max-w-[450px] h-screen sm:h-[850px] bg-black sm:rounded-[40px] sm:shadow-[0_24px_80px_rgba(0,0,0,0.35)] relative overflow-hidden flex flex-col">

        {/* Tombol Kembali */}
        <div className="absolute top-12 left-6 z-40">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.12)] text-slate-800 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Kamera + deteksi (selalu aktif saat main) */}
        <div className="absolute inset-0 z-0">
          <CameraDetector
            isModelLoading={isModelLoading}
            error={error}
            detectFrame={detectFrame}
            detectionResult={detectionResult}
            detections={detections}
          />
        </div>

        {/* ── LAYER: IDLE (Intro) ── */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-gradient-to-b from-black/70 via-black/60 to-black/85 backdrop-blur-[2px] flex flex-col items-center justify-center px-8 text-center"
            >
              <div className="w-20 h-20 rounded-[26px] bg-[#00B894] flex items-center justify-center shadow-[0_10px_40px_rgba(0,184,148,0.5)] mb-6">
                <Hand className="w-10 h-10 text-white" strokeWidth={2.2} />
              </div>
              <h1 className="text-white text-[26px] font-black tracking-tight mb-2">
                Tantangan Isyarat
              </h1>
              <p className="text-white/70 text-[14px] leading-relaxed max-w-[300px] mb-8">
                Peragakan isyarat {mode === "hijaiyah" ? "huruf Hijaiyah" : mode === "bisindo" ? "BISINDO" : "Hijaiyah dan BISINDO"} yang muncul di depan kamera. Tahan isyaratmu
                sampai terkunci. {QUIZ_CONFIG.questionsPerSession} soal, {QUIZ_CONFIG.timePerQuestionSec} detik per soal.
              </p>

              <button
                onClick={start}
                disabled={isModelLoading}
                className="w-full max-w-[280px] py-4 rounded-2xl bg-[#00B894] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(0,184,148,0.45)] active:scale-95 transition-transform disabled:opacity-50"
              >
                <Play className="w-5 h-5" fill="white" />
                {isModelLoading ? "Menyiapkan AI..." : "Mulai Tantangan"}
              </button>

              {!user && (
                <p className="text-white/50 text-[12px] mt-5 max-w-[280px]">
                  Kamu belum login — skor tetap bisa dimainkan, tapi tidak masuk papan peringkat.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LAYER: PLAYING (HUD) ── */}
        {phase === "playing" && (
          <>
            {/* Top bar: soal, streak, skor */}
            <div className="absolute top-11 left-0 right-0 z-30 px-6 pt-1 flex items-center justify-between pointer-events-none">
              <div className="ml-16 bg-black/45 backdrop-blur-md rounded-full px-3.5 py-1.5 text-white text-[12px] font-bold">
                Soal {index + 1}/{totalQuestions}
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-black/45 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-[12px] font-bold">
                  <Flame className={`w-4 h-4 ${streak > 0 ? "text-amber-400" : "text-white/50"}`} />
                  {streak}
                </div>
                <div className="bg-black/45 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-[12px] font-bold">
                  <Trophy className="w-4 h-4 text-[#00B894]" />
                  {score}
                </div>
              </div>
            </div>

            {/* Timer bar */}
            <div className="absolute top-[92px] left-6 right-6 z-30 pointer-events-none">
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-[width] duration-200 ease-linear ${
                    timePct < 0.25 ? "bg-rose-500" : "bg-[#00B894]"
                  }`}
                  style={{ width: `${timePct * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-center gap-1 mt-1.5 text-white/80 text-[11px] font-bold">
                <Timer className="w-3.5 h-3.5" />
                {Math.ceil(timeLeft)}s
              </div>
            </div>

            {/* Target huruf + progress hold */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
              <span className="text-white/70 text-[12px] font-bold uppercase tracking-widest mb-3 drop-shadow">
                Peragakan huruf ini
              </span>
              <div className="relative">
                <div className="bg-white/95 rounded-[32px] px-10 py-6 shadow-[0_16px_50px_rgba(0,0,0,0.4)] flex flex-col items-center min-w-[180px]">
                  <span
                    className="text-[96px] leading-none font-medium text-[#0B0B0F]"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {target?.arabic}
                  </span>
                  <span className="text-[20px] font-black text-slate-700 mt-1">
                    {target?.indo}
                  </span>
                </div>
                {/* Hold progress bar */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[70%] h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00B894] rounded-full"
                    style={{ width: `${holdProgress * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-white/60 text-[11px] mt-6 drop-shadow">
                {holdProgress > 0 ? "Tahan... hampir terkunci!" : "Arahkan tangan ke kamera"}
              </span>
            </div>

            {/* Feedback flash */}
            <AnimatePresence>
              {lastOutcome && (
                <motion.div
                  key={`${lastOutcome}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                >
                  <div
                    className={`flex flex-col items-center ${
                      lastOutcome === "correct" ? "text-[#00B894]" : "text-rose-400"
                    }`}
                  >
                    {lastOutcome === "correct" ? (
                      <CheckCircle2 className="w-24 h-24 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]" strokeWidth={2.5} />
                    ) : (
                      <XCircle className="w-24 h-24 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]" strokeWidth={2.5} />
                    )}
                    <span className="mt-2 text-[20px] font-black bg-black/40 px-4 py-1 rounded-full backdrop-blur">
                      {lastOutcome === "correct" ? "Benar!" : "Waktu Habis"}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* ── LAYER: FINISHED (Result) ── */}
        <AnimatePresence>
          {phase === "finished" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center px-7"
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="w-full bg-white rounded-[32px] p-7 text-center shadow-2xl"
              >
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-amber-500" strokeWidth={2.2} />
                </div>

                {isNewBest && saveState === "saved" && (
                  <span className="inline-block text-[11px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
                    Rekor Baru!
                  </span>
                )}

                <h2 className="text-slate-900 text-[22px] font-black tracking-tight">Sesi Selesai</h2>
                <p className="text-slate-400 text-[13px] mb-5">Ini hasil tantanganmu</p>

                <div className="text-[56px] leading-none font-black text-[#00B894] mb-1">{score}</div>
                <p className="text-slate-500 text-[13px] font-semibold mb-5">total poin</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 rounded-2xl py-3">
                    <div className="text-slate-900 text-[20px] font-black">
                      {correctCount}/{totalQuestions}
                    </div>
                    <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">Benar</div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl py-3">
                    <div className="text-slate-900 text-[20px] font-black flex items-center justify-center gap-1">
                      <Flame className="w-4 h-4 text-amber-500" /> {bestStreak}
                    </div>
                    <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wide">Streak Terbaik</div>
                  </div>
                </div>

                {/* Status simpan */}
                <p className="text-[12px] mb-5 min-h-[18px]">
                  {saveState === "saving" && <span className="text-slate-400">Menyimpan skor...</span>}
                  {saveState === "saved" && <span className="text-[#00B894] font-semibold">Skor tersimpan ke papan peringkat.</span>}
                  {saveState === "guest" && <span className="text-slate-400">Login untuk menyimpan skormu ke papan peringkat.</span>}
                  {saveState === "error" && <span className="text-rose-500">Gagal menyimpan skor. Coba lagi nanti.</span>}
                </p>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setSaveState("idle");
                      setIsNewBest(false);
                      start();
                    }}
                    className="w-full py-3.5 rounded-2xl bg-[#00B894] text-white font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <RotateCcw className="w-5 h-5" /> Main Lagi
                  </button>
                  <Link
                    href="/app/ranking"
                    className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Trophy className="w-5 h-5 text-amber-500" /> Lihat Papan Peringkat
                  </Link>
                  <button
                    onClick={() => reset()}
                    className="w-full py-2 text-slate-400 font-semibold text-[13px]"
                  >
                    Kembali ke menu
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
