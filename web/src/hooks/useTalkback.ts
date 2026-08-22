"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "dibisalitas_talkback_enabled";

export function useTalkback() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved preference from localStorage on mount.
  // Sengaja dibaca di useEffect (bukan lazy initializer) agar tidak terjadi
  // hydration mismatch saat SSR Next.js (localStorage tidak tersedia di server).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "true") {
      setIsEnabled(true);
    }
    setIsInitialized(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isEnabled || !text || typeof window === "undefined") return;
      if (!("speechSynthesis" in window)) return;

      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID"; // Bahasa Indonesia
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to find an Indonesian voice, fall back to default
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(
        (v) => v.lang === "id-ID" || v.lang.startsWith("id")
      );
      if (idVoice) {
        utterance.voice = idVoice;
      }

      window.speechSynthesis.speak(utterance);
    },
    [isEnabled]
  );

  const toggle = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));

      // Cancel speech when turning off
      if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      return next;
    });
  }, []);

  const enable = useCallback(() => {
    setIsEnabled(true);
    localStorage.setItem(STORAGE_KEY, "true");
  }, []);

  const disable = useCallback(() => {
    setIsEnabled(false);
    localStorage.setItem(STORAGE_KEY, "false");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { isEnabled, isInitialized, speak, toggle, enable, disable };
}
