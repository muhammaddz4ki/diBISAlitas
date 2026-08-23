"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/** Level ukuran teks → faktor perbesaran tampilan */
export const FONT_SCALES = [1, 1.15, 1.3];
export const FONT_LABELS = ["Normal", "Besar", "Sangat Besar"];

interface AccessibilityValue {
  fontLevel: number; // index ke FONT_SCALES
  setFontLevel: (n: number) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const Ctx = createContext<AccessibilityValue | null>(null);

function readFontLevel(): number {
  if (typeof window === "undefined") return 0;
  const f = Number(window.localStorage.getItem("a11y_font") ?? 0);
  return Number.isFinite(f) ? Math.min(2, Math.max(0, f)) : 0;
}
function readFlag(key: string): boolean {
  return typeof window !== "undefined" && window.localStorage.getItem(key) === "1";
}

/**
 * Provider pengaturan aksesibilitas global (berlaku untuk seluruh area /app).
 * - Ukuran teks: memperbesar tampilan via CSS zoom pada body.
 * - Kontras tinggi: kelas CSS `.a11y-hc` (filter kontras).
 * - Kurangi animasi: MotionConfig framer-motion + kelas `.a11y-reduce`.
 * Preferensi disimpan di localStorage (dibaca lewat lazy initializer, aman SSR).
 */
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontLevel, setFontLevelState] = useState<number>(readFontLevel);
  const [highContrast, setHighContrast] = useState<boolean>(() => readFlag("a11y_hc"));
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => readFlag("a11y_rm"));

  // Auto-detect OS preference: prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Hanya auto-set jika user belum pernah mengatur secara manual
    const manuallySet = window.localStorage.getItem("a11y_rm");
    if (manuallySet !== null) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setReduceMotion(true);

    const handler = (e: MediaQueryListEvent) => {
      if (window.localStorage.getItem("a11y_rm") === null) {
        setReduceMotion(e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Terapkan efek ke DOM (bukan setState → tidak memicu cascading render)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const scale = FONT_SCALES[fontLevel] ?? 1;
    // `zoom` didukung Chromium/Safari/Firefox modern — memperbesar seluruh konten.
    (document.body.style as CSSStyleDeclaration & { zoom?: string }).zoom = String(scale);
    document.body.classList.toggle("a11y-hc", highContrast);
    document.body.classList.toggle("a11y-reduce", reduceMotion);
  }, [fontLevel, highContrast, reduceMotion]);

  const setFontLevel = (n: number) => {
    const clamped = Math.min(2, Math.max(0, n));
    setFontLevelState(clamped);
    try {
      window.localStorage.setItem("a11y_font", String(clamped));
    } catch {
      /* abaikan */
    }
  };

  const toggleHighContrast = () =>
    setHighContrast((v) => {
      const nv = !v;
      try {
        window.localStorage.setItem("a11y_hc", nv ? "1" : "0");
      } catch {
        /* abaikan */
      }
      return nv;
    });

  const toggleReduceMotion = () =>
    setReduceMotion((v) => {
      const nv = !v;
      try {
        window.localStorage.setItem("a11y_rm", nv ? "1" : "0");
      } catch {
        /* abaikan */
      }
      return nv;
    });

  return (
    <Ctx.Provider
      value={{
        fontLevel,
        setFontLevel,
        highContrast,
        toggleHighContrast,
        reduceMotion,
        toggleReduceMotion,
      }}
    >
      <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>{children}</MotionConfig>
    </Ctx.Provider>
  );
}

export function useAccessibility(): AccessibilityValue {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return c;
}
