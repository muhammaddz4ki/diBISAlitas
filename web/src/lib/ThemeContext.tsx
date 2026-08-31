"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig, MotionGlobalConfig } from "framer-motion";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [highContrast, setHighContrastState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Theme
    const savedTheme = localStorage.getItem("dibisalitas_theme") as Theme | null;
    if (savedTheme === "dark" || savedTheme === "light") {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme: Theme = prefersDark ? "dark" : "light";
      setThemeState(initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }

    // Reduce Motion
    const savedRM = localStorage.getItem("a11y_rm") === "1";
    setReduceMotionState(savedRM);
    document.documentElement.classList.toggle("a11y-reduce", savedRM);
    MotionGlobalConfig.skipAnimations = savedRM;

    // High Contrast
    const savedHC = localStorage.getItem("a11y_hc") === "1";
    setHighContrastState(savedHC);
    document.documentElement.classList.toggle("a11y-hc", savedHC);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("dibisalitas_theme", newTheme);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  const setReduceMotion = (val: boolean) => {
    setReduceMotionState(val);
    MotionGlobalConfig.skipAnimations = val;
    try {
      localStorage.setItem("a11y_rm", val ? "1" : "0");
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("a11y-reduce", val);
    }
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    try {
      localStorage.setItem("a11y_hc", val ? "1" : "0");
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("a11y-hc", val);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, reduceMotion, setReduceMotion, highContrast, setHighContrast }}>
      <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
        {children}
      </MotionConfig>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "light" as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
      reduceMotion: false,
      setReduceMotion: () => {},
      highContrast: false,
      setHighContrast: () => {},
    };
  }
  return context;
}
