"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface LanguageSwitcherProps {
  variant?: "pill" | "compact" | "card" | "dropdown";
  className?: string;
  showIcon?: boolean;
}

export default function LanguageSwitcher({
  variant = "pill",
  className = "",
}: LanguageSwitcherProps) {
  const { language, setLanguage, toggleLanguage, isLoading } = useLanguage();
  const pathname = usePathname();
  const isApp = pathname?.startsWith("/app");

  // =========================================================================
  // 1. APP ROUTE SPECIFIC STYLING (/app/*)
  // The mobile app is strictly light-mode neumorphic design (#f4f6fc).
  // =========================================================================
  if (isApp) {
    if (variant === "card") {
      return (
        <div
          className={`p-4 rounded-[20px] bg-[#f4f6fc] border border-white shadow-3d notranslate ${className}`}
          translate="no"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[13px] font-black text-slate-800 uppercase tracking-wider notranslate" translate="no">
                Bahasa Aplikasi
              </div>
              <div className="text-[11px] text-slate-500 font-medium notranslate" translate="no">
                Pilih bahasa tampilan sistem
              </div>
            </div>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-[#2a9d8f]" />}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Indonesian Option */}
            <button
              type="button"
              onClick={() => setLanguage("id")}
              className={`p-3 rounded-[16px] border flex items-center justify-between transition-all ${
                language === "id"
                  ? "bg-gradient-to-br from-[#2a9d8f] to-[#4fd1c5] text-white border-white shadow-3d"
                  : "bg-[#f4f6fc] text-slate-600 border-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),_inset_-2px_-2px_4px_rgba(255,255,255,0.9)] hover:text-slate-900"
              }`}
              aria-pressed={language === "id"}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-white/20 text-inherit notranslate" translate="no">
                  ID
                </span>
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight notranslate" translate="no">Indonesia</div>
                  <div className={`text-[9px] ${language === "id" ? "text-white/80" : "text-slate-400"} notranslate`} translate="no">Asli</div>
                </div>
              </div>
              {language === "id" && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </button>

            {/* English Option */}
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`p-3 rounded-[16px] border flex items-center justify-between transition-all ${
                language === "en"
                  ? "bg-gradient-to-br from-[#2a9d8f] to-[#4fd1c5] text-white border-white shadow-3d"
                  : "bg-[#f4f6fc] text-slate-600 border-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),_inset_-2px_-2px_4px_rgba(255,255,255,0.9)] hover:text-slate-900"
              }`}
              aria-pressed={language === "en"}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-white/20 text-inherit notranslate" translate="no">
                  EN
                </span>
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight notranslate" translate="no">English</div>
                  <div className={`text-[9px] ${language === "en" ? "text-white/80" : "text-slate-400"} notranslate`} translate="no">Auto</div>
                </div>
              </div>
              {language === "en" && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </button>
          </div>
        </div>
      );
    }

    // Default Pill inside App: Clean Light Neumorphic Style
    return (
      <div
        role="group"
        aria-label="Pilih Bahasa / Choose Language"
        className={`relative inline-flex items-center p-1 rounded-full bg-[#f4f6fc] border border-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),_inset_-3px_-3px_6px_rgba(255,255,255,1)] notranslate ${className}`}
        translate="no"
      >
        {/* Indonesian Pill */}
        <button
          type="button"
          onClick={() => setLanguage("id")}
          disabled={isLoading}
          aria-pressed={language === "id"}
          className={`relative px-3 py-1.5 rounded-full text-xs font-black transition-all duration-200 flex items-center justify-center z-10 ${
            language === "id"
              ? "text-[#1e7b6d]"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          {language === "id" && (
            <motion.div
              layoutId="lang-active-pill-app"
              className="absolute inset-0 rounded-full bg-white border border-white/80 shadow-[2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,1)] -z-10"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <span className="text-[11px] tracking-wider uppercase font-black notranslate" translate="no">
            ID
          </span>
        </button>

        {/* English Pill */}
        <button
          type="button"
          onClick={() => setLanguage("en")}
          disabled={isLoading}
          aria-pressed={language === "en"}
          className={`relative px-3 py-1.5 rounded-full text-xs font-black transition-all duration-200 flex items-center justify-center z-10 ${
            language === "en"
              ? "text-[#1e7b6d]"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          {language === "en" && (
            <motion.div
              layoutId="lang-active-pill-app"
              className="absolute inset-0 rounded-full bg-white border border-white/80 shadow-[2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,1)] -z-10"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <span className="text-[11px] tracking-wider uppercase font-black notranslate" translate="no">
            EN
          </span>
        </button>

        {isLoading && (
          <div className="absolute right-1 -top-1">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2a9d8f] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2a9d8f]"></span>
            </span>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. GENERAL WEB & LANDING PAGE STYLING (Responsive Light & Dark Mode)
  // Adapts seamlessly to root Light and Dark themes.
  // =========================================================================
  if (variant === "card") {
    return (
      <div
        className={`p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/10 ${className} notranslate`}
        translate="no"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider notranslate" translate="no">
              Bahasa / Language
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium notranslate" translate="no">
              Pilih bahasa tampilan situs web
            </div>
          </div>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-[#2a9d8f]" />}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Indonesian Option */}
          <button
            type="button"
            onClick={() => setLanguage("id")}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
              language === "id"
                ? "bg-white dark:bg-white/10 border-[#2a9d8f] dark:border-[#2a9d8f] shadow-sm text-slate-900 dark:text-white"
                : "bg-transparent border-slate-200/60 dark:border-white/5 text-slate-500 hover:bg-white/50 dark:hover:bg-white/5"
            }`}
            aria-pressed={language === "id"}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 notranslate" translate="no">
                ID
              </span>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight notranslate" translate="no">Indonesia</div>
                <div className="text-[9px] text-slate-400 notranslate" translate="no">Asli</div>
              </div>
            </div>
            {language === "id" && <Check className="w-3.5 h-3.5 text-[#2a9d8f] dark:text-[#4fd1c5]" />}
          </button>

          {/* English Option */}
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
              language === "en"
                ? "bg-white dark:bg-white/10 border-[#2a9d8f] dark:border-[#2a9d8f] shadow-sm text-slate-900 dark:text-white"
                : "bg-transparent border-slate-200/60 dark:border-white/5 text-slate-500 hover:bg-white/50 dark:hover:bg-white/5"
            }`}
            aria-pressed={language === "en"}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 notranslate" translate="no">
                EN
              </span>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight notranslate" translate="no">English</div>
                <div className="text-[9px] text-slate-400 notranslate" translate="no">Auto</div>
              </div>
            </div>
            {language === "en" && <Check className="w-3.5 h-3.5 text-[#2a9d8f] dark:text-[#4fd1c5]" />}
          </button>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        disabled={isLoading}
        title={language === "id" ? "Ganti ke Bahasa Inggris" : "Switch to Indonesian"}
        aria-label={language === "id" ? "Ganti ke Bahasa Inggris" : "Switch to Indonesian"}
        className={`relative inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-black bg-white dark:bg-white/10 border border-slate-200/70 dark:border-white/15 shadow-sm hover:shadow hover:border-[#2a9d8f]/50 dark:hover:border-[#4fd1c5]/50 transition-all text-slate-700 dark:text-white notranslate ${className}`}
        translate="no"
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2a9d8f]" />
        ) : (
          <span className="text-[11px] font-black uppercase tracking-wider notranslate" translate="no">
            {language}
          </span>
        )}
      </button>
    );
  }

  // Default: Segmented Pill Switcher with high-contrast Light and Dark mode styling
  return (
    <div
      role="group"
      aria-label="Pilih Bahasa / Choose Language"
      className={`relative inline-flex items-center p-0.5 rounded-full bg-slate-100/90 dark:bg-white/[0.08] backdrop-blur-xl border border-slate-200/80 dark:border-white/10 notranslate shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] ${className}`}
      translate="no"
    >
      {/* Indonesian Pill */}
      <button
        type="button"
        onClick={() => setLanguage("id")}
        disabled={isLoading}
        aria-pressed={language === "id"}
        className={`relative px-3 py-1.5 rounded-full text-xs font-black transition-colors duration-200 flex items-center justify-center z-10 ${
          language === "id"
            ? "text-[#1e7b6d] dark:text-[#4fd1c5]"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        {language === "id" && (
          <motion.div
            layoutId="lang-active-pill"
            className="absolute inset-0 rounded-full bg-white dark:bg-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)] border border-slate-200/70 dark:border-white/20 -z-10"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <span className="text-[11px] tracking-wider uppercase font-black notranslate" translate="no">
          ID
        </span>
      </button>

      {/* English Pill */}
      <button
        type="button"
        onClick={() => setLanguage("en")}
        disabled={isLoading}
        aria-pressed={language === "en"}
        className={`relative px-3 py-1.5 rounded-full text-xs font-black transition-colors duration-200 flex items-center justify-center z-10 ${
          language === "en"
            ? "text-[#1e7b6d] dark:text-[#4fd1c5]"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        {language === "en" && (
          <motion.div
            layoutId="lang-active-pill"
            className="absolute inset-0 rounded-full bg-white dark:bg-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)] border border-slate-200/70 dark:border-white/20 -z-10"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <span className="text-[11px] tracking-wider uppercase font-black notranslate" translate="no">
          EN
        </span>
      </button>

      {isLoading && (
        <div className="absolute right-1 -top-1">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2a9d8f] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2a9d8f]"></span>
          </span>
        </div>
      )}
    </div>
  );
}
