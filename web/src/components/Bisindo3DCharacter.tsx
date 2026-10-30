"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from "lucide-react";
import { RIAN_GESTURE_FRAMES } from "@/utils/textToSignEngine";

export type AvatarModelId = "rian" | "budi" | "nadia";

export interface Bisindo3DCharacterProps {
  isAnimating?: boolean;
  currentSign?: string;
  speed?: number;
  size?: "sm" | "md" | "lg" | "xl";
  avatarModel?: AvatarModelId;
  jacketColor?: "blue" | "dark" | "mustard";
  customImage?: string;
  onSignComplete?: () => void;
  onSignChange?: (sign: string) => void;

  // Fitur Penerjemah Teks & Pemutar Sekuens Isyarat (Text-to-Sign)
  activeFrameUrl?: string;       // Override frame visual langsung dari hook sequence player
  highlightText?: string;        // Kata/huruf aktif yang sedang disorot di subtitle
  subtitle?: string;             // Deskripsi atau ejaan kata
  showControls?: boolean;        // Tampilkan bilah kontrol Play/Pause/Replay/Speed
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onReplay?: () => void;
  onSpeedChange?: (speed: number) => void;
}

// Mapping dasar pose statis BISINDO Rian POLMAN
const RIAN_POSES: Record<string, string> = {
  idle: "/avatars/rian_neutral.jpg",
  neutral: "/avatars/rian_neutral.jpg",
  dada: "/avatars/rian_salam.jpg",
  salam: "/avatars/rian_salam.jpg",
  hormat: "/avatars/rian_salam.jpg",
  jantung: "/avatars/rian_salam.jpg",
  halo: "/avatars/rian_halo.jpg",
  terima_kasih: "/avatars/rian_terimakasih.jpg",
  terimakasih: "/avatars/rian_terimakasih.jpg",
  dagu: "/avatars/rian_terimakasih.jpg",
  bibir: "/avatars/rian_terimakasih.jpg",
  bisa: "/avatars/rian_bisa.jpg",
  jempol: "/avatars/rian_bisa.jpg",
  tolong: "/avatars/rian_tolong.jpg",
  sama_sama: "/avatars/rian_tolong.jpg",
  ya: "/avatars/rian_ya.jpg",
  fist: "/avatars/rian_ya.jpg",
  kepalan: "/avatars/rian_ya.jpg",
  jari_ketekuk: "/avatars/rian_ya.jpg",
  ketekuk: "/avatars/rian_ya.jpg",
  tekuk: "/avatars/rian_ya.jpg",
  tidak: "/avatars/rian_salam.jpg",
  A: "/avatars/rian_bisa.jpg",
  B: "/avatars/rian_salam.jpg",
  C: "/avatars/rian_ya.jpg",
};

const DEFAULT_CYCLE = ["salam", "halo", "terima_kasih", "bisa", "tolong", "ya"];

export default function Bisindo3DCharacter({
  isAnimating = true,
  currentSign = "salam",
  speed = 1.0,
  size = "md",
  avatarModel = "rian",
  jacketColor = "blue",
  customImage,
  onSignComplete,
  onSignChange,
  // Props Sekuens Baru
  activeFrameUrl,
  highlightText,
  subtitle,
  showControls = false,
  isPlaying = false,
  onPlay,
  onPause,
  onReplay,
  onSpeedChange,
}: Bisindo3DCharacterProps) {
  const [activeSign, setActiveSign] = useState(currentSign);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [internalFrameUrl, setInternalFrameUrl] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sinkronisasi perubahan kata/sign dari luar
  useEffect(() => {
    setActiveSign(currentSign);
  }, [currentSign]);

  // Pemutaran Sekuens Mikro-Frame internal jika pose memiliki multi-frame animasi
  useEffect(() => {
    if (activeFrameUrl) {
      setInternalFrameUrl(activeFrameUrl);
      return;
    }

    const normalizedKey = (activeSign || "").toLowerCase().replace(/-/g, "_");
    const frames = RIAN_GESTURE_FRAMES[normalizedKey];

    if (frames && frames.length > 1 && isAnimating) {
      let idx = 0;
      setInternalFrameUrl(frames[0]);

      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);

      const frameDuration = Math.max(200, 1100 / (frames.length * speed));
      frameIntervalRef.current = setInterval(() => {
        idx = (idx + 1) % frames.length;
        setInternalFrameUrl(frames[idx]);
      }, frameDuration);

      return () => {
        if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      };
    } else if (frames && frames.length === 1) {
      setInternalFrameUrl(frames[0]);
    } else {
      setInternalFrameUrl("");
    }
  }, [activeSign, activeFrameUrl, isAnimating, speed]);

  // Autoplay demonstration cycle hanya jika eksplisit diminta (currentSign === "cycle" atau "demo")
  useEffect(() => {
    if (!isAnimating || customImage || activeFrameUrl || (currentSign && currentSign !== "cycle" && currentSign !== "demo")) {
      return;
    }

    const intervalTime = Math.max(1200, 2600 / speed);
    const interval = setInterval(() => {
      setActiveSign((prev) => {
        const nextIdx = (DEFAULT_CYCLE.indexOf(prev) + 1) % DEFAULT_CYCLE.length;
        const nextSign = DEFAULT_CYCLE[nextIdx];
        if (onSignChange) onSignChange(nextSign);
        if (onSignComplete) onSignComplete();
        return nextSign;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isAnimating, speed, onSignChange, onSignComplete, customImage, currentSign, activeFrameUrl]);

  // 3D Parallax Tilt effect pada kursor mouse / layar sentuh
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Menentukan sumber gambar visual avatar (100% Eksklusif 3D Rian POLMAN)
  const getImageSrc = () => {
    if (activeFrameUrl) return activeFrameUrl;
    if (internalFrameUrl) return internalFrameUrl;
    if (customImage) return customImage;

    const normalizedKey = (activeSign || "").toLowerCase().replace(/-/g, "_");
    return RIAN_POSES[normalizedKey] || RIAN_POSES[activeSign] || RIAN_POSES.salam;
  };

  const getJacketFilter = () => {
    if (jacketColor === "dark") return "contrast(1.05) brightness(0.85)";
    if (jacketColor === "mustard") return "hue-rotate(45deg) saturate(1.2)";
    return "none"; // Default Royal Blue POLMAN Bandung
  };

  return (
    <div className="flex flex-col items-center w-full h-full relative select-none">
      {/* 3D Viewport Box */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer"
        style={{ perspective: "1000px" }}
      >
        {/* Subtle Studio Lighting Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/[0.015] to-black/[0.06] pointer-events-none z-10" />

        {/* 3D Floating Avatar Container */}
        <motion.div
          animate={{
            rotateY: mousePos.x * 12,
            rotateX: -mousePos.y * 12,
            y: [0, -5, 0],
          }}
          transition={{
            rotateY: { type: "spring", stiffness: 120, damping: 20 },
            rotateX: { type: "spring", stiffness: 120, damping: 20 },
            y: { repeat: Infinity, duration: 4 / speed, ease: "easeInOut" },
          }}
          className="relative w-full h-full flex items-center justify-center transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${avatarModel}-${getImageSrc()}`}
              initial={{ opacity: 0.92, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.92, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full h-full flex items-center justify-center"
              style={{ filter: getJacketFilter() }}
            >
              <Image
                src={getImageSrc()}
                alt={`Avatar 3D BISINDO Rian - ${activeSign}`}
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 320px, 400px"
                className="object-cover object-top select-none pointer-events-none drop-shadow-xl"
              />
            </motion.div>
          </AnimatePresence>

          {/* Studio Ground Shadow Simulation */}
          <div
            className="absolute -bottom-6 w-3/4 h-8 bg-slate-900/15 rounded-full blur-xl pointer-events-none"
            style={{ transform: "translateZ(-30px)" }}
          />
        </motion.div>
      </div>

      {/* Indikator Sorot Teks Real-Time (Live Highlight Subtitle) */}
      {(highlightText || subtitle) && (
        <div className="w-full mt-2 px-3 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col items-center text-center z-20">
          {highlightText && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3 text-[#1B9981]" />
              <span>Gerakan Isyarat:</span>
              <span className="px-2 py-0.5 rounded-full bg-[#1B9981]/15 text-[#1B9981] font-black text-sm">
                {highlightText}
              </span>
            </div>
          )}
          {subtitle && (
            <p className="text-[12px] text-slate-600 dark:text-slate-400 font-medium line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Bilah Kontrol Terpadu (Play / Pause / Replay / Speed) */}
      {showControls && (
        <div className="mt-2.5 flex items-center justify-between w-full px-3 py-1.5 bg-[#f4f6fc]/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white dark:border-slate-800 shadow-3d z-20">
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <button
                onClick={onPause}
                title="Jeda Peragaan"
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
              >
                <Pause className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                onClick={onPlay}
                title="Mulai Peragaan"
                className="w-8 h-8 rounded-xl bg-[#1B9981] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(27,153,129,0.35)] hover:bg-[#16816d] active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            )}

            <button
              onClick={onReplay}
              title="Ulangi dari Awal"
              className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Pengatur Kecepatan */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <span>Kecepatan:</span>
            {[0.75, 1.0, 1.25].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange?.(s)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  speed === s
                    ? "bg-[#1B9981] text-white shadow-sm"
                    : "bg-white/80 dark:bg-slate-800 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
