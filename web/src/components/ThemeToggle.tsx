"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      title={isDark ? "Mode Terang (Light Mode)" : "Mode Gelap (Dark Mode)"}
      className={`relative inline-flex items-center justify-center p-2.5 rounded-2xl border transition-all duration-300 ${
        isDark
          ? "bg-slate-800/90 border-slate-700/80 text-amber-400 hover:bg-slate-700 hover:text-amber-300 shadow-sm"
          : "bg-slate-100/90 border-slate-200/80 text-slate-700 hover:bg-slate-200 hover:text-slate-900 shadow-sm"
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Moon className="w-4 h-4 text-amber-400" />
            {showLabel && <span className="text-xs font-bold text-slate-200">Mode Gelap</span>}
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Sun className="w-4 h-4 text-amber-500" />
            {showLabel && <span className="text-xs font-bold text-slate-700">Mode Terang</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
