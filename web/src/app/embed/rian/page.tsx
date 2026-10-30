"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  Hand,
  Volume2,
  VolumeX,
} from "lucide-react";
import Bisindo3DCharacter from "@/components/Bisindo3DCharacter";
import { useSignSequencePlayer } from "@/hooks/useSignSequencePlayer";

const DEFAULT_QUICK_PHRASES = [
  "Aksesibilitas cerdas",
  "Kemandirian tanpa batas",
  "Halo terima kasih",
  "Pasti bisa",
  "Tolong bantu saya",
  "POLMAN Bandung",
];

export default function EmbedRianPage() {
  const [inputText, setInputText] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const sequencePlayer = useSignSequencePlayer({
    defaultSpeed: speed,
    enableTTS: ttsEnabled,
  });

  // Kirim event postMessage ke parent host window
  const postToParent = useCallback((payload: Record<string, any>) => {
    if (typeof window !== "undefined" && window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          source: "DIBISA_WIDGET",
          timestamp: Date.now(),
          ...payload,
        },
        "*"
      );
    }
  }, []);

  // Handler memutar kalimat baru
  const handlePlaySentence = useCallback(
    (textToPlay: string) => {
      if (!textToPlay || !textToPlay.trim()) return;
      sequencePlayer.loadSentence(textToPlay.trim());
      setTimeout(() => {
        sequencePlayer.play();
      }, 80);
    },
    [sequencePlayer]
  );

  // Notifikasi DIBISA_READY saat halaman selesai termuat
  useEffect(() => {
    setIsReady(true);
    postToParent({ type: "DIBISA_READY" });

    // Cek parameter URL: ?text=...&autoplay=true&speed=1.0
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryText = params.get("text") || params.get("q");
      const autoPlay = params.get("autoplay") === "1" || params.get("autoplay") === "true";
      const paramSpeed = parseFloat(params.get("speed") || "");

      if (!isNaN(paramSpeed) && paramSpeed > 0) {
        setSpeed(paramSpeed);
        sequencePlayer.setPlaybackSpeed(paramSpeed);
      }

      if (queryText) {
        setInputText(queryText);
        if (autoPlay) {
          handlePlaySentence(queryText);
        } else {
          sequencePlayer.loadSentence(queryText);
        }
      }
    }
  }, [handlePlaySentence, postToParent, sequencePlayer]);

  // Sync state perubahan token/kata ke parent window
  useEffect(() => {
    if (sequencePlayer.isPlaying && sequencePlayer.currentToken) {
      postToParent({
        type: "DIBISA_TOKEN_CHANGE",
        word: sequencePlayer.currentToken.displayWord || sequencePlayer.currentToken.rawText,
        index: sequencePlayer.currentIndex,
        total: sequencePlayer.tokens.length,
      });
    }
  }, [sequencePlayer.currentIndex, sequencePlayer.isPlaying, sequencePlayer.currentToken, sequencePlayer.tokens.length, postToParent]);

  // Sync state selesai ke parent window
  useEffect(() => {
    if (sequencePlayer.isFinished && sequencePlayer.sentence) {
      postToParent({
        type: "DIBISA_PLAY_FINISHED",
        sentence: sequencePlayer.sentence,
      });
    }
  }, [sequencePlayer.isFinished, sequencePlayer.sentence, postToParent]);

  // Listener event postMessage dari Host Website
  useEffect(() => {
    const handleHostMessage = (e: MessageEvent) => {
      let data = e.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      if (!data || typeof data !== "object") return;

      switch (data.type) {
        case "PLAY_SIGN":
        case "TRANSLATE_TEXT":
        case "SET_TEXT":
          if (data.text) {
            handlePlaySentence(String(data.text));
          }
          break;

        case "PAUSE_SIGN":
          sequencePlayer.pause();
          break;

        case "RESUME_SIGN":
          sequencePlayer.resume();
          break;

        case "STOP_SIGN":
          sequencePlayer.stop();
          break;

        case "REPLAY_SIGN":
          sequencePlayer.replay();
          break;

        case "SET_SPEED":
          if (typeof data.speed === "number") {
            setSpeed(data.speed);
            sequencePlayer.setPlaybackSpeed(data.speed);
          }
          break;

        case "TOGGLE_TTS":
          setTtsEnabled((prev) => !prev);
          sequencePlayer.setEnableTTS(!ttsEnabled);
          break;

        case "PING":
          postToParent({ type: "PONG" });
          break;
      }
    };

    window.addEventListener("message", handleHostMessage);
    return () => {
      window.removeEventListener("message", handleHostMessage);
    };
  }, [handlePlaySentence, postToParent, sequencePlayer, ttsEnabled]);

  const handleSpeedCycle = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setSpeed(newSpeed);
    sequencePlayer.setPlaybackSpeed(newSpeed);
    postToParent({ type: "DIBISA_SPEED_CHANGE", speed: newSpeed });
  };

  const handleInputSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    handlePlaySentence(inputText.trim());
    setShowDrawer(false);
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#edf2f7] to-[#d9e2ec] text-slate-800 flex flex-col select-none relative font-sans">
      {/* Top Speaker Notch Visual (Simulasi Smartphone Modern) */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1 rounded-full bg-slate-300/80 z-50 pointer-events-none" />

      {/* Header Bar */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-40 flex items-center justify-between pointer-events-auto">
        {/* Tombol Tutup Widget (Memberi sinyal DIBISA_CLOSE_REQUEST ke host) */}
        <button
          onClick={() => postToParent({ type: "DIBISA_CLOSE_REQUEST" })}
          className="w-9 h-9 rounded-full bg-white/95 text-slate-700 shadow-md flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all border border-slate-200/80 cursor-pointer"
          title="Tutup Widget"
          aria-label="Tutup"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Lencana Identitas Karakter: Rian POLMAN */}
        <div className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm text-[11px] font-bold text-slate-700 flex items-center gap-1.5 border border-white/80">
          <span className="w-2 h-2 rounded-full bg-[#1B9981] animate-pulse" />
          <span>Rian (POLMAN)</span>
        </div>
      </div>

      {/* Canvas Viewport 3D Karakter Rian POLMAN */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <Bisindo3DCharacter
          isAnimating={sequencePlayer.isPlaying}
          currentSign={
            sequencePlayer.tokens.length > 0 && sequencePlayer.currentToken
              ? sequencePlayer.currentToken.poseKey || sequencePlayer.currentToken.displayWord || sequencePlayer.currentToken.rawText
              : "salam"
          }
          speed={speed}
          avatarModel="rian"
          activeFrameUrl={
            sequencePlayer.tokens.length > 0
              ? sequencePlayer.activeFrameUrl
              : "/avatars/rian_neutral.jpg"
          }
        />
      </div>

      {/* Floating Control Toolbar di Bagian Bawah */}
      <div className="absolute bottom-3 left-0 right-0 z-40 px-3.5 flex flex-col items-center gap-2 pointer-events-auto">
        {/* Subtitle Badge & Status Progres di Bagian Bawah */}
      
        <motion.div
          key={
            sequencePlayer.tokens.length > 0
              ? `${sequencePlayer.currentIndex}-${sequencePlayer.activeFrameUrl}`
              : "idle"
          }
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-white/80 text-slate-800 text-xs font-bold flex items-center justify-center max-w-[270px] text-center notranslate" translate="no"
        >
          <span className="truncate">
            {sequencePlayer.tokens.length > 0
              ? sequencePlayer.isFinished
                ? `Selesai: "${sequencePlayer.sentence.slice(0, 24)}${sequencePlayer.sentence.length > 24 ? "..." : ""}"`
                : sequencePlayer.currentToken && sequencePlayer.currentToken.displayWord
                ? sequencePlayer.currentToken.displayWord
                : sequencePlayer.currentToken?.rawText || sequencePlayer.sentence
              : "Siap Menerjemahkan"}
          </span>
        </motion.div>

        {/* Progress Bar & Word Counter */}
        {sequencePlayer.tokens.length > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-1 w-full max-w-[220px]"
          >
            <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#1B9981] rounded-full"
                animate={{ width: `${sequencePlayer.progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-white/90 px-2 py-0.5 rounded-full shadow-xs">
              {Math.min(sequencePlayer.currentIndex + 1, sequencePlayer.tokens.length)} / {sequencePlayer.tokens.length} kata
            </span>
          </motion.div>
        )}
      

      {/* Bilah Kontrol Kaca Frosted */}
        <div className="w-full max-w-[275px] bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-around">
          {/* 1. Tombol Play / Pause / Replay */}
          <button
            onClick={() => {
              if (sequencePlayer.tokens.length > 0) {
                if (sequencePlayer.isFinished) {
                  sequencePlayer.replay();
                } else if (sequencePlayer.isPlaying) {
                  sequencePlayer.pause();
                } else {
                  sequencePlayer.resume();
                }
              } else if (inputText.trim()) {
                handlePlaySentence(inputText.trim());
              } else {
                handlePlaySentence("Halo terima kasih");
              }
            }}
            className="w-10 h-10 rounded-full bg-[#1B9981] hover:bg-[#157a67] text-white flex items-center justify-center border-2 border-white shadow-md transition-all active:scale-90 cursor-pointer"
            title={
              sequencePlayer.isPlaying
                ? "Jeda Animasi"
                : sequencePlayer.isFinished
                ? "Putar Ulang Sekuens"
                : "Mulai Peragaan"
            }
            aria-label="Play / Pause"
          >
            {sequencePlayer.isPlaying ? (
              <Pause className="w-4 h-4 fill-white stroke-none" />
            ) : sequencePlayer.isFinished ? (
              <RotateCcw className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white stroke-none ml-0.5" />
            )}
          </button>

          {/* 2. Tombol Stop */}
          <button
            onClick={() => {
              sequencePlayer.stop();
            }}
            className="w-10 h-10 rounded-full bg-[#1B9981] hover:bg-[#157a67] text-white flex items-center justify-center border-2 border-white shadow-md transition-all active:scale-90 cursor-pointer"
            title="Hentikan / Pose Netral"
            aria-label="Stop"
          >
            <Square className="w-3.5 h-3.5 fill-white stroke-none rounded-xs" />
          </button>

          {/* 3. Tombol Kecepatan (Speed) */}
          <button
            onClick={handleSpeedCycle}
            className="w-10 h-10 rounded-full bg-[#1B9981] hover:bg-[#157a67] text-white flex items-center justify-center border-2 border-white shadow-md transition-all active:scale-90 font-bold text-xs cursor-pointer"
            title="Ubah Kecepatan"
            aria-label="Speed"
          >
            {speed}x
          </button>

          {/* 4. Tombol Audio TTS */}
          <button
            onClick={() => {
              const next = !ttsEnabled;
              setTtsEnabled(next);
              sequencePlayer.setEnableTTS(next);
            }}
            className={`w-10 h-10 rounded-full border-2 border-white shadow-md transition-all active:scale-90 flex items-center justify-center cursor-pointer ${
              ttsEnabled ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-600"
            }`}
            title={ttsEnabled ? "Matikan Suara (TTS)" : "Aktifkan Suara (TTS)"}
            aria-label="Toggle Audio"
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Tombol Toggle Drawer Teks Cepat */}
        <button
          onClick={() => setShowDrawer(!showDrawer)}
          className="px-3 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-slate-700 shadow-sm border border-white/70 flex items-center gap-1 hover:bg-white transition-all cursor-pointer"
        >
          <span>{showDrawer ? "Tutup Input Teks" : "Ketik Teks Sendiri"}</span>
          {showDrawer ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>

        {/* Drawer Input Teks & Frasa Cepat */}
        <AnimatePresence>
          {showDrawer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full bg-white/95 backdrop-blur-xl rounded-2xl p-3 border border-white/80 shadow-xl space-y-2 overflow-hidden"
            >
              <form onSubmit={handleInputSubmit} className="flex gap-1.5">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik kalimat untuk Rian..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B9981]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#1B9981] hover:bg-[#157a67] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  title="Peragakan"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Frasa Cepat */}
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto custom-scrollbar">
                {DEFAULT_QUICK_PHRASES.map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => {
                      setInputText(phrase);
                      handlePlaySentence(phrase);
                      setShowDrawer(false);
                    }}
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 hover:bg-[#1B9981] hover:text-white text-slate-600 border border-slate-200 transition-all cursor-pointer"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

