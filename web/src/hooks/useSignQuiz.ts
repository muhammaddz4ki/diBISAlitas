import { useCallback, useEffect, useRef, useState } from "react";
import { SignLabel } from "@/constants/signLabels";
import { DetectionResult } from "@/utils/yoloInference";
import {
  QUIZ_CONFIG,
  buildQuestionQueue,
  computeQuestionScore,
} from "@/lib/quizConfig";

export type QuizPhase = "idle" | "playing" | "finished";
export type QuizOutcome = "correct" | "timeout" | null;

export interface QuizAnswer {
  labelId: number;
  correct: boolean;
}

export interface QuizSummary {
  score: number;
  correctCount: number;
  totalQuestions: number;
  bestStreak: number;
  answers: QuizAnswer[];
}

/**
 * Hook logika permainan "Tantangan Isyarat" (Camera Challenge).
 * Loop game berjalan di interval internal (tickMs) agar countdown & deteksi
 * "hold-to-confirm" mulus walau frame deteksi hanya ~10 FPS.
 * Mencatat hasil per-huruf (answers) untuk statistik belajar.
 * @param onFinish dipanggil sekali saat sesi selesai.
 */
export function useSignQuiz(
  detectionResult: DetectionResult | null,
  labels: SignLabel[],
  onFinish?: (summary: QuizSummary) => void
) {
  const [phase, setPhase] = useState<QuizPhase>("idle");
  const [target, setTarget] = useState<SignLabel | null>(null);
  const [index, setIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(QUIZ_CONFIG.questionsPerSession);
  const [timeLeft, setTimeLeft] = useState<number>(QUIZ_CONFIG.timePerQuestionSec);
  const [holdProgress, setHoldProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastOutcome, setLastOutcome] = useState<QuizOutcome>(null);

  const queueRef = useRef<SignLabel[]>([]);
  const indexRef = useRef(0);
  const latestRef = useRef<DetectionResult | null>(detectionResult);
  const holdStartRef = useRef<number | null>(null);
  const deadlineRef = useRef(0);
  const lockRef = useRef(false);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFinishRef = useRef(onFinish);
  const answersRef = useRef<QuizAnswer[]>([]);

  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const bestStreakRef = useRef(0);
  const correctRef = useRef(0);

  useEffect(() => {
    latestRef.current = detectionResult;
  }, [detectionResult]);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const finish = useCallback(() => {
    setPhase("finished");
    setTarget(null);
    setHoldProgress(0);
    holdStartRef.current = null;
    onFinishRef.current?.({
      score: scoreRef.current,
      correctCount: correctRef.current,
      totalQuestions: queueRef.current.length,
      bestStreak: bestStreakRef.current,
      answers: answersRef.current,
    });
  }, []);

  const loadQuestion = useCallback(
    (i: number) => {
      const q = queueRef.current;
      if (i >= q.length) {
        finish();
        return;
      }
      indexRef.current = i;
      setIndex(i);
      setTarget(q[i]);
      setLastOutcome(null);
      holdStartRef.current = null;
      setHoldProgress(0);
      deadlineRef.current = performance.now() + QUIZ_CONFIG.timePerQuestionSec * 1000;
      setTimeLeft(QUIZ_CONFIG.timePerQuestionSec);
      lockRef.current = false;
    },
    [finish]
  );

  const goNextAfterDelay = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    transitionRef.current = setTimeout(() => {
      loadQuestion(indexRef.current + 1);
    }, 900);
  }, [loadQuestion]);

  const onCorrect = useCallback(
    (remainSec: number) => {
      lockRef.current = true;
      const tgt = queueRef.current[indexRef.current];
      if (tgt) answersRef.current.push({ labelId: tgt.id, correct: true });
      streakRef.current += 1;
      bestStreakRef.current = Math.max(bestStreakRef.current, streakRef.current);
      correctRef.current += 1;
      scoreRef.current += computeQuestionScore(remainSec, streakRef.current);

      setStreak(streakRef.current);
      setBestStreak(bestStreakRef.current);
      setCorrectCount(correctRef.current);
      setScore(scoreRef.current);
      setLastOutcome("correct");
      setHoldProgress(1);
      goNextAfterDelay();
    },
    [goNextAfterDelay]
  );

  const onTimeout = useCallback(() => {
    lockRef.current = true;
    const tgt = queueRef.current[indexRef.current];
    if (tgt) answersRef.current.push({ labelId: tgt.id, correct: false });
    streakRef.current = 0;
    setStreak(0);
    setLastOutcome("timeout");
    setHoldProgress(0);
    goNextAfterDelay();
  }, [goNextAfterDelay]);

  const start = useCallback(() => {
    const q = buildQuestionQueue(labels, QUIZ_CONFIG.questionsPerSession);
    queueRef.current = q;
    answersRef.current = [];
    setTotalQuestions(q.length);
    scoreRef.current = 0;
    streakRef.current = 0;
    bestStreakRef.current = 0;
    correctRef.current = 0;
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setLastOutcome(null);
    setPhase("playing");
    loadQuestion(0);
  }, [labels, loadQuestion]);

  const reset = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setPhase("idle");
    setTarget(null);
    setHoldProgress(0);
    holdStartRef.current = null;
    lockRef.current = false;
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      const now = performance.now();
      const remainMs = deadlineRef.current - now;
      const remainSec = Math.max(0, remainMs / 1000);
      setTimeLeft(remainSec);

      if (lockRef.current) return;

      const det = latestRef.current;
      const tgt = queueRef.current[indexRef.current];
      const isMatch =
        !!det &&
        !!tgt &&
        det.label.id === tgt.id &&
        (det.label.type === tgt.type || (!det.label.type && !tgt.type)) &&
        det.score >= QUIZ_CONFIG.matchScore;

      if (isMatch) {
        if (holdStartRef.current == null) holdStartRef.current = now;
        const held = now - holdStartRef.current;
        setHoldProgress(Math.min(1, held / QUIZ_CONFIG.holdMs));
        if (held >= QUIZ_CONFIG.holdMs) {
          onCorrect(remainSec);
          return;
        }
      } else {
        holdStartRef.current = null;
        setHoldProgress(0);
      }

      if (remainMs <= 0) onTimeout();
    }, QUIZ_CONFIG.tickMs);

    return () => clearInterval(id);
  }, [phase, onCorrect, onTimeout]);

  useEffect(() => {
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  return {
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
  };
}
