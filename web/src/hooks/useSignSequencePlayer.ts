"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SignToken, parseTextToSignQueue } from "@/utils/textToSignEngine";
import { BisindoItem } from "@/lib/types";

interface UseSignSequencePlayerOptions {
  customDictionary?: BisindoItem[];
  defaultSpeed?: number;
  enableTTS?: boolean;
}

export function useSignSequencePlayer(options: UseSignSequencePlayerOptions = {}) {
  const { customDictionary = [], defaultSpeed = 1.0, enableTTS: initialTTS = true } = options;

  const [sentence, setSentence] = useState<string>("");
  const [tokens, setTokens] = useState<SignToken[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [activeFrameUrl, setActiveFrameUrl] = useState<string>("/avatars/rian_neutral.jpg");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(defaultSpeed);
  const [enableTTS, setEnableTTS] = useState<boolean>(initialTTS);

  // Refs untuk sinkronisasi timer tanpa stale closures
  const tokensRef = useRef<SignToken[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const isPlayingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const speedRef = useRef<number>(playbackSpeed);
  const enableTTSRef = useRef<boolean>(enableTTS);

  const tokenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spokenWordsRef = useRef<Set<string>>(new Set());

  // Sinkronisasi refs
  useEffect(() => {
    tokensRef.current = tokens;
  }, [tokens]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    speedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    enableTTSRef.current = enableTTS;
  }, [enableTTS]);

  // Bersihkan semua timer
  const clearTimers = useCallback(() => {
    if (tokenTimerRef.current) {
      clearTimeout(tokenTimerRef.current);
      tokenTimerRef.current = null;
    }
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
  }, []);

  // Web Speech TTS Synthesizer
  const speakText = useCallback((textToSpeak: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis || !enableTTSRef.current) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "id-ID";
      utterance.rate = Math.min(1.4, Math.max(0.7, 0.95 * speedRef.current));
      
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find((v) => v.lang.toLowerCase().includes("id"));
      if (idVoice) utterance.voice = idVoice;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Abaikan jika speech synthesis dibatasi browser
    }
  }, []);

  // Eksekusi satu token aktif (termasuk perputaran frame gerak mikro)
  const executeToken = useCallback((index: number) => {
    clearTimers();

    const currentTokens = tokensRef.current;
    if (index < 0 || index >= currentTokens.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setIsFinished(true);
      setActiveFrameUrl("/avatars/rian_neutral.jpg");
      return;
    }

    const token = currentTokens[index];
    setCurrentIndex(index);
    setActiveFrameIndex(0);

    // 1. Sinkronisasi Suara (TTS)
    if (token.type === "gesture") {
      speakText(token.displayWord || token.rawText);
    } else if (token.type === "fingerspelling") {
      // Sebutkan kata utuh saat mengeja huruf pertama agar terdengar natural
      if (token.letterIndex === 0 && !spokenWordsRef.current.has(token.displayWord)) {
        spokenWordsRef.current.add(token.displayWord);
        speakText(`Mengeja: ${token.displayWord}`);
      }
    }

    // 2. Tentukan Frame Gambar Awal
    const frames = token.animationFrames && token.animationFrames.length > 0
      ? token.animationFrames
      : [token.assetUrl];

    setActiveFrameUrl(frames[0]);

    // 3. Animasi Mikro-Frame (Jika token memiliki beberapa frame animasi)
    const effectiveDuration = token.durationMs / speedRef.current;
    if (frames.length > 1) {
      const frameDuration = effectiveDuration / frames.length;
      let fIndex = 0;

      frameIntervalRef.current = setInterval(() => {
        fIndex++;
        if (fIndex < frames.length) {
          setActiveFrameIndex(fIndex);
          setActiveFrameUrl(frames[fIndex]);
        } else {
          if (frameIntervalRef.current) {
            clearInterval(frameIntervalRef.current);
            frameIntervalRef.current = null;
          }
        }
      }, frameDuration);
    }

    // 4. Jadwalkan Transisi ke Token Berikutnya
    tokenTimerRef.current = setTimeout(() => {
      if (isPlayingRef.current && !isPausedRef.current) {
        executeToken(index + 1);
      }
    }, effectiveDuration);
  }, [clearTimers, speakText]);

  // Memuat kalimat baru ke dalam antrean
  const loadSentence = useCallback((newSentence: string) => {
    clearTimers();
    spokenWordsRef.current.clear();

    const parsedTokens = parseTextToSignQueue(newSentence, customDictionary);
    setSentence(newSentence);
    setTokens(parsedTokens);
    setCurrentIndex(0);
    setActiveFrameIndex(0);
    setIsFinished(false);
    setIsPaused(false);

    if (parsedTokens.length > 0) {
      setActiveFrameUrl(parsedTokens[0].assetUrl);
    } else {
      setActiveFrameUrl("/avatars/rian_neutral.jpg");
    }
  }, [clearTimers, customDictionary]);

  // Memulai pemutaran sekuens
  const play = useCallback(() => {
    if (tokensRef.current.length === 0) return;

    clearTimers();
    setIsPlaying(true);
    setIsPaused(false);
    setIsFinished(false);

    const startIndex = currentIndexRef.current >= 0 && currentIndexRef.current < tokensRef.current.length
      ? currentIndexRef.current
      : 0;

    executeToken(startIndex);
  }, [clearTimers, executeToken]);

  // Menjeda pemutaran (Pause)
  const pause = useCallback(() => {
    clearTimers();
    setIsPlaying(false);
    setIsPaused(true);
  }, [clearTimers]);

  // Melanjutkan pemutaran (Resume)
  const resume = useCallback(() => {
    if (currentIndexRef.current < 0 || currentIndexRef.current >= tokensRef.current.length) {
      play();
      return;
    }
    setIsPlaying(true);
    setIsPaused(false);
    executeToken(currentIndexRef.current);
  }, [executeToken, play]);

  // Menghentikan pemutaran (Stop) dan reset ke awal
  const stop = useCallback(() => {
    clearTimers();
    setIsPlaying(false);
    setIsPaused(false);
    setIsFinished(false);
    setCurrentIndex(0);
    setActiveFrameIndex(0);
    spokenWordsRef.current.clear();
    if (tokensRef.current.length > 0) {
      setActiveFrameUrl(tokensRef.current[0].assetUrl);
    } else {
      setActiveFrameUrl("/avatars/rian_neutral.jpg");
    }
  }, [clearTimers]);

  // Memutar ulang dari awal (Replay)
  const replay = useCallback(() => {
    clearTimers();
    spokenWordsRef.current.clear();
    setCurrentIndex(0);
    setActiveFrameIndex(0);
    setIsPlaying(true);
    setIsPaused(false);
    setIsFinished(false);
    executeToken(0);
  }, [clearTimers, executeToken]);

  // Lompat ke token spesifik
  const jumpToIndex = useCallback((targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= tokensRef.current.length) return;
    clearTimers();
    setCurrentIndex(targetIndex);
    executeToken(targetIndex);
  }, [clearTimers, executeToken]);

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const currentToken = currentIndex >= 0 && currentIndex < tokens.length ? tokens[currentIndex] : null;
  const progress = tokens.length > 0 && currentIndex >= 0 ? Math.round(((currentIndex + 1) / tokens.length) * 100) : 0;

  return {
    sentence,
    tokens,
    currentIndex,
    currentToken,
    activeFrameIndex,
    activeFrameUrl,
    isPlaying,
    isPaused,
    isFinished,
    playbackSpeed,
    enableTTS,
    progress,
    loadSentence,
    play,
    pause,
    resume,
    stop,
    replay,
    jumpToIndex,
    setPlaybackSpeed,
    setEnableTTS,
  };
}

