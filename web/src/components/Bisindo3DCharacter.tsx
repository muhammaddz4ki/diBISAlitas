"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export type AvatarModelId = "rian" | "budi" | "nadia";

interface Bisindo3DCharacterProps {
  isAnimating?: boolean;
  currentSign?: string;
  speed?: number;
  size?: "sm" | "md" | "lg";
  avatarModel?: AvatarModelId;
  jacketColor?: "blue" | "dark" | "mustard";
  customImage?: string;
  onSignComplete?: () => void;
  onSignChange?: (sign: string) => void;
}

// Mapping of BISINDO signs to high-resolution 3D clay avatar poses
const RIAN_POSES: Record<string, string> = {
  idle: "/avatars/rian_salam.jpg",
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
  B: "/avatars/rian_halo.jpg",
  C: "/avatars/rian_tolong.jpg",
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
}: Bisindo3DCharacterProps) {
  const [activeSign, setActiveSign] = useState(currentSign);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize external sign changes
  useEffect(() => {
    setActiveSign(currentSign);
  }, [currentSign]);

  // Autoplay demonstration cycle hanya jika eksplisit diminta (currentSign === "cycle" atau "demo")
  useEffect(() => {
    // Jangan lakukan rotasi pose otomatis jika pengguna sedang memilih atau menguji pose spesifik
    if (!isAnimating || customImage || (currentSign && currentSign !== "cycle" && currentSign !== "demo")) {
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
  }, [isAnimating, speed, onSignChange, onSignComplete, customImage, currentSign]);

  // 3D Parallax Tilt effect on mouse movement
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

  // Determine current image source based on avatarModel, customImage, and active sign
  const getImageSrc = () => {
    if (customImage) return customImage;
    if (avatarModel === "nadia") return "/avatars/nadia_salam.jpg";
    if (avatarModel === "budi") return "/avatars/budi_salam.jpg";
    const normalizedKey = (activeSign || "").toLowerCase().replace(/-/g, '_');
    return RIAN_POSES[normalizedKey] || RIAN_POSES[activeSign] || RIAN_POSES.salam;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer select-none"
      style={{ perspective: "1000px" }}
    >
      {/* Subtle Studio Lighting Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/[0.02] to-black/[0.08] pointer-events-none z-10" />

      {/* 3D Floating Avatar Container */}
      <motion.div
        animate={{
          rotateY: mousePos.x * 12,
          rotateX: -mousePos.y * 12,
          y: [0, -6, 0],
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
            key={`${avatarModel}-${activeSign}`}
            initial={{ opacity: 0.88, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.88, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <Image
              src={getImageSrc()}
              alt={`Avatar 3D BISINDO - ${activeSign}`}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 320px, 350px"
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
  );
}
