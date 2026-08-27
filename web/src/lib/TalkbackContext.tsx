"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { useTalkback } from "@/hooks/useTalkback";

interface TalkbackContextType {
  isEnabled: boolean;
  isInitialized: boolean;
  speak: (text: string) => void;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
}

const TalkbackContext = createContext<TalkbackContextType | null>(null);

export function TalkbackProvider({ children }: { children: ReactNode }) {
  const talkback = useTalkback();
  const isEnabledRef = useRef(talkback.isEnabled);

  // Keep ref in sync
  useEffect(() => {
    isEnabledRef.current = talkback.isEnabled;
  }, [talkback.isEnabled]);

  // Global mouse-over listener: reads the aria-label or text of hovered elements
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseOver = (e: MouseEvent) => {
      if (!isEnabledRef.current) return;

      const target = e.target as HTMLElement;
      if (!target) return;

      // Walk up to find a meaningful label
      let el: HTMLElement | null = target;
      let textToRead = "";

      while (el && el !== document.body) {
        const ariaLabel = el.getAttribute("aria-label");
        const title = el.getAttribute("title");
        const alt = (el as HTMLImageElement).alt;
        const placeholder = (el as HTMLInputElement).placeholder;

        if (ariaLabel) {
          textToRead = ariaLabel;
          break;
        }
        if (alt) {
          textToRead = alt;
          break;
        }
        if (title) {
          textToRead = title;
          break;
        }
        // For inputs, read the label above them
        if (
          el.tagName === "INPUT" ||
          el.tagName === "BUTTON" ||
          el.tagName === "A"
        ) {
          if (placeholder) {
            textToRead = el.textContent?.trim() || placeholder;
          } else {
            textToRead = el.textContent?.trim() || "";
          }
          break;
        }
        // For other text elements, read their text
        const text = el.textContent?.trim();
        if (text && text.length < 100 && text.length > 0) {
          textToRead = text;
          break;
        }
        el = el.parentElement;
      }

      if (textToRead && textToRead.length > 0) {
        talkback.speak(textToRead);
      }
    };

    // Debounce: only fire once per 600ms hover
    let hoverTimeout: ReturnType<typeof setTimeout>;
    const debouncedHover = (e: MouseEvent) => {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => handleMouseOver(e), 600);
    };

    document.addEventListener("mouseover", debouncedHover);
    return () => {
      document.removeEventListener("mouseover", debouncedHover);
      clearTimeout(hoverTimeout);
    };
  }, [talkback]);

  // Global click listener for Double-Click to Activate (TalkBack behavior)
  const lastClickedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClick = (e: MouseEvent) => {
      if (!isEnabledRef.current) {
        // Clear focus if talkback disabled
        if (lastClickedRef.current) {
          lastClickedRef.current.classList.remove("talkback-focus");
          lastClickedRef.current = null;
        }
        return;
      }

      const target = e.target as HTMLElement;
      if (!target) return;

      const interactiveEl = target.closest(
        'button, a, input, select, textarea, [role="button"], [role="link"], [tabindex]'
      ) as HTMLElement;

      if (!interactiveEl) {
        // Clicked outside interactive element
        if (lastClickedRef.current) {
          lastClickedRef.current.classList.remove("talkback-focus");
          lastClickedRef.current = null;
        }
        return;
      }

      if (lastClickedRef.current !== interactiveEl) {
        // FIRST CLICK
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (lastClickedRef.current) {
          lastClickedRef.current.classList.remove("talkback-focus");
        }

        interactiveEl.classList.add("talkback-focus");
        lastClickedRef.current = interactiveEl;

        let textToRead = interactiveEl.getAttribute("aria-label") || 
                         interactiveEl.getAttribute("title") || 
                         (interactiveEl as HTMLImageElement).alt || 
                         "";
                         
        if (!textToRead) {
          if (interactiveEl.tagName === "INPUT") {
            textToRead = (interactiveEl as HTMLInputElement).placeholder || "Input";
          } else {
            textToRead = interactiveEl.textContent?.trim() || "Tombol";
          }
        }

        talkback.speak(textToRead);
      } else {
        // SECOND CLICK
        // Let it pass through. We keep the ref so they don't lose the green outline 
        // until they click something else. If they click it again, it will activate again.
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [talkback]);

  return (
    <TalkbackContext.Provider value={talkback}>
      {/* TalkBack Active Indicator Banner */}
      {talkback.isEnabled && talkback.isInitialized && (
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
          style={{ width: "calc(100% - 2rem)", maxWidth: "450px" }}
        >
          <div className="mx-auto mt-2 flex items-center justify-center gap-2 bg-[#00B894] text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-lg">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            TalkBack Aktif
          </div>
        </div>
      )}
      {children}
    </TalkbackContext.Provider>
  );
}

export function useTalkbackContext() {
  const ctx = useContext(TalkbackContext);
  if (!ctx) throw new Error("useTalkbackContext must be used within TalkbackProvider");
  return ctx;
}
