"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, XCircle, MicOff, Type } from "lucide-react";
import { useAccessibility } from "@/lib/AccessibilityContext";

const QUICK_PHRASES = [
  "Tolong",
  "Terima kasih",
  "Saya tunarungu",
  "Di mana toilet?",
  "Bisa bantu saya?",
  "Tunggu sebentar",
  "Maaf",
  "Ya",
  "Tidak",
  "Panggil bantuan",
];

export default function BiSapaPage() {
  const colorfulMode = false;
  const themeGrad = "from-sky-500 to-sky-700";
  const themeTextHover = "hover:text-sky-600";
  
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "id-ID";

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Put recognized text in the top input box (for example, the person speaking to the deaf person)
        if (finalTranscript) {
          setTopText(finalTranscript);
        } else {
          setTopText(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTopText("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`flex flex-col h-full bg-[#f4f6fc] font-sans ${colorfulMode ? "selection:bg-sky-500/20" : "selection:bg-[#1B9981]/20"}`}>
      
      {/* ── TOP SECTION (Rotated 180) ── */}
      <div className={`flex-[0.45] flex flex-col p-6 pt-10 pb-12 bg-gradient-to-br ${themeGrad} rotate-180 rounded-b-[2.5rem] shadow-3d z-20 border-b-2 border-white/40`}>
        <div className="w-full h-full flex flex-col justify-between max-w-md mx-auto">
          <div className="text-white/90 font-black tracking-wide text-[12px] uppercase flex items-center justify-center gap-2 drop-shadow-md">
            <Mic className="w-4 h-4" strokeWidth={2.5} /> Area Suara (Tunanetra)
          </div>
          
          <textarea
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            placeholder="Ketuk tombol mic untuk bicara..."
            className="w-full flex-1 my-5 bg-white/10 border-none rounded-[28px] p-6 text-white placeholder-white/60 focus:bg-white/20 focus:outline-none focus:ring-0 resize-none text-[24px] font-bold leading-relaxed text-center shadow-[inset_2px_2px_10px_rgba(0,0,0,0.1)] transition-all"
            readOnly={isListening}
          />

          <div className="flex justify-center items-center gap-5">
            <button
              onClick={() => speakText(topText)}
              className="w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center bubble-3d border-none transition-all backdrop-blur-md active:scale-95"
            >
              <Volume2 className="w-6 h-6 text-white drop-shadow-md" strokeWidth={2.5} />
            </button>
            
            {/* Main Action Button with Pulse if listening */}
            <div className="relative">
              {isListening && (
                <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-75"></span>
              )}
              <button
                onClick={toggleListen}
                className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center bubble-3d border-none transition-all active:scale-95 backdrop-blur-md
                  ${isListening ? "bg-gradient-to-b from-rose-500 to-rose-600 shadow-[0_0_30px_rgba(244,63,94,0.6)]" : "bg-white/20 hover:bg-white/30"}`}
              >
                {isListening ? (
                  <MicOff className="w-9 h-9 text-white drop-shadow-md" strokeWidth={2.5} />
                ) : (
                  <Mic className="w-9 h-9 text-white drop-shadow-md" strokeWidth={2.5} />
                )}
              </button>
            </div>

            <button
              onClick={() => setTopText("")}
              className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center bubble-3d border-none transition-all backdrop-blur-md active:scale-95"
            >
              <XCircle className="w-6 h-6 text-white drop-shadow-md" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION (Normal) ── */}
      <div className="flex-[0.55] flex flex-col p-6 bg-[#f4f6fc] rounded-t-[2.5rem] z-10 -mt-8 pt-14">
        <div className="w-full h-full flex flex-col justify-between max-w-md mx-auto">
          <div className="text-slate-800 font-black tracking-wide text-[12px] uppercase flex items-center justify-center gap-2 text-3d drop-shadow-sm">
            <Type className="w-4 h-4" strokeWidth={2.5} /> Area Ketik (Tunarungu)
          </div>

          {/* Frasa cepat - Better spacing and touch targets */}
          <div className="flex gap-4 overflow-x-auto mt-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] px-2 -mx-2">
            {QUICK_PHRASES.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setBottomText(p);
                  speakText(p);
                }}
                className={`shrink-0 px-5 py-3.5 rounded-[16px] bg-[#f4f6fc] text-slate-700 ${themeTextHover} text-[14px] font-bold transition-all duration-300 ease-out shadow-[4px_4px_10px_rgba(15,23,42,0.08),_-4px_-4px_10px_rgba(255,255,255,1)] active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)] active:scale-[0.97]`}
              >
                {p}
              </button>
            ))}
          </div>

          <textarea
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="Ketik pesan Anda di sini..."
            className="w-full flex-1 my-4 bg-[#f4f6fc] border-none rounded-[28px] py-6 pl-6 pr-20 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 resize-none text-[24px] font-bold leading-relaxed text-center shadow-[inset_4px_4px_10px_rgba(0,0,0,0.06),_inset_-4px_-4px_12px_rgba(255,255,255,1)] transition-all"
          />

          <div className="flex justify-center items-center gap-5 mt-2">
            <button
              onClick={() => speakText(bottomText)}
              className={`w-[72px] h-[72px] bg-gradient-to-b ${themeGrad} rounded-full flex items-center justify-center bubble-3d border-none transition-all active:scale-95`}
            >
              <Volume2 className="w-9 h-9 text-white drop-shadow-md" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setBottomText("")}
              className="w-14 h-14 bg-transparent hover:bg-slate-50 rounded-full flex items-center justify-center shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border-none transition-all active:scale-95"
            >
              <XCircle className="w-6 h-6 text-slate-400" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
