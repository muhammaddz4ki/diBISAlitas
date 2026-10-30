"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  DO_NOT_TRANSLATE_WHITELIST,
  BRAND_DICTIONARY,
  BRAND_NAME,
} from "@/lib/brandProtection";

export { DO_NOT_TRANSLATE_WHITELIST, BRAND_DICTIONARY, BRAND_NAME };

export type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isLoading: boolean;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const COOKIE_NAME = "googtrans";

// Helper to set cookie for multiple domain scopes
function setGoogleTransCookie(lang: Language) {
  if (typeof document === "undefined") return;

  const cookieVal = `/id/${lang}`;
  const hostname = window.location.hostname;

  // Path = /
  document.cookie = `${COOKIE_NAME}=${cookieVal}; path=/; max-age=31536000; SameSite=Lax`;

  // Domain = current hostname
  document.cookie = `${COOKIE_NAME}=${cookieVal}; domain=${hostname}; path=/; max-age=31536000; SameSite=Lax`;

  // For subdomains (e.g. .dibisalitas.id or .vercel.app)
  if (hostname.includes(".")) {
    document.cookie = `${COOKIE_NAME}=${cookieVal}; domain=.${hostname}; path=/; max-age=31536000; SameSite=Lax`;
  }

  // If switching back to Indonesian, clear alternate cookies as well
  if (lang === "id") {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${hostname}; path=/;`;
    if (hostname.includes(".")) {
      document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${hostname}; path=/;`;
    }
  }
}

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "id";

  try {
    const saved = localStorage.getItem("dibisalitas_lang");
    if (saved === "en" || saved === "id") return saved;

    // Check cookie
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, val] = cookie.trim().split("=");
      if (name === COOKIE_NAME) {
        if (val && val.includes("/en")) return "en";
      }
    }
  } catch {}

  return "id";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Trigger Google Translate select element
  const applyGoogleTranslate = useCallback((lang: Language): boolean => {
    if (typeof document === "undefined") return false;

    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (select) {
      if (select.value !== lang) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
      }
      return true;
    }
    return false;
  }, []);



  // Initialize Google Translate script
  useEffect(() => {
    const initialLang = getStoredLanguage();
    setLanguageState(initialLang);
    setGoogleTransCookie(initialLang);

    // Setup global callback for Google Translate
    (window as any).googleTranslateElementInit = () => {
      try {
        if ((window as any).google?.translate?.TranslateElement) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: "id",
              includedLanguages: "id,en",
              autoDisplay: false,
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            "google_translate_element"
          );
          setIsReady(true);

          // Apply saved language if English
          if (initialLang === "en") {
            setTimeout(() => {
              applyGoogleTranslate("en");
            }, 300);
          }
        }
      } catch (err) {
        console.warn("Google Translate initialization warning:", err);
      }
    };

    // Inject Google Translate script if not present
    const SCRIPT_ID = "google-translate-script";
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if ((window as any).google?.translate?.TranslateElement) {
      setIsReady(true);
      if (initialLang === "en") {
        setTimeout(() => applyGoogleTranslate("en"), 300);
      }
    }

    // Set HTML lang attribute
    document.documentElement.lang = initialLang;
  }, [applyGoogleTranslate]);

  // In English mode, intercept internal link clicks to perform full-page navigation.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLinkClick = (e: MouseEvent) => {
      if (language !== "en") return;
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (
        href &&
        !href.startsWith("#") &&
        !href.startsWith("http") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        target.target !== "_blank"
      ) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = href;
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => document.removeEventListener("click", handleLinkClick, { capture: true });
  }, [language]);

  // Handle client-side Next.js route transitions:
  const lastPathnameRef = useRef(pathname);
  useEffect(() => {
    if (language === "en" && lastPathnameRef.current !== pathname) {
      lastPathnameRef.current = pathname;
      window.location.reload();
    } else {
      lastPathnameRef.current = pathname;
    }
  }, [pathname, language]);

  const setLanguage = (newLang: Language) => {
    if (newLang === language) return;
    setIsLoading(true);
    setLanguageState(newLang);

    try {
      localStorage.setItem("dibisalitas_lang", newLang);
    } catch {}

    setGoogleTransCookie(newLang);
    document.documentElement.lang = newLang;

    // Announce to Screen Readers / Accessibility Talkback
    const announcement =
      newLang === "en"
        ? "Language changed to English"
        : "Bahasa berhasil diubah ke Bahasa Indonesia";
    const liveRegion = document.getElementById("a11y-live-announcer");
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }

    applyGoogleTranslate(newLang);

    // Perform an instant clean reload so the entire page is 100% translated (or pristine Indonesian)
    setTimeout(() => {
      window.location.reload();
    }, 120);
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isLoading,
        isReady,
      }}
    >
      {/* Hidden Google Translate Mount Container */}
      <div
        id="google_translate_element"
        className="notranslate pointer-events-none fixed -top-[9999px] -left-[9999px] opacity-0 overflow-hidden"
        style={{ display: "none" }}
        aria-hidden="true"
      />
      {/* Screen Reader live announcer */}
      <div
        id="a11y-live-announcer"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
