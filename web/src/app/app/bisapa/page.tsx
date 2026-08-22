"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, XCircle, MicOff, Type } from "lucide-react";

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
    <div className="flex flex-col h-full bg-slate-50 font-sans">
      
      {/* ── TOP SECTION (Rotated 180) ── */}
      <div className="flex-1 flex flex-col justify-end p-6 bg-[#00B894] rotate-180 rounded-b-3xl">
        <div className="w-full h-full flex flex-col justify-between pt-6">
          <div className="text-white/80 font-medium text-sm flex items-center justify-center gap-2">
            <Mic className="w-4 h-4" /> Area Suara (Tunanetra)
          </div>
          
          <textarea
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            placeholder="Hasil suara akan muncul di sini..."
            className="w-full flex-1 mt-4 bg-white/10 border-transparent rounded-3xl p-6 text-white placeholder-white/50 focus:bg-white/20 focus:ring-0 resize-none text-2xl font-bold leading-relaxed text-center"
            readOnly={isListening}
          />

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => speakText(topText)}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <Volume2 className="w-8 h-8 text-[#00B894]" />
            </button>
            <button
              onClick={toggleListen}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${isListening ? "bg-red-500 hover:bg-red-600 scale-110" : "bg-white hover:scale-105"}`}
            >
              {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-[#00B894]" />}
            </button>
            <button
              onClick={() => setTopText("")}
              className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <XCircle className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION (Normal) ── */}
      <div className="flex-1 flex flex-col p-6 bg-white rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-10 -mt-6">
        <div className="w-full h-full flex flex-col justify-between pb-6">
          <div className="text-slate-400 font-medium text-sm flex items-center justify-center gap-2 pt-2">
            <Type className="w-4 h-4" /> Area Ketik (Tunarungu)
          </div>

          {/* Frasa cepat — ketuk untuk langsung disuarakan */}
          <div className="flex gap-2 overflow-x-auto mt-3 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {QUICK_PHRASES.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setBottomText(p);
                  speakText(p);
                }}
                className="shrink-0 px-4 py-2 rounded-full bg-[#00B894]/10 text-[#00B894] text-sm font-semibold hover:bg-[#00B894]/20 active:scale-95 transition-all whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>

          <textarea
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="Ketik pesan Anda di sini..."
            className="w-full flex-1 mt-4 bg-slate-50 border-transparent rounded-3xl p-6 text-slate-800 placeholder-slate-400 focus:bg-slate-100 focus:ring-0 resize-none text-2xl font-bold leading-relaxed text-center"
          />

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => speakText(bottomText)}
              className="w-16 h-16 bg-[#00B894] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <Volume2 className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={() => setBottomText("")}
              className="w-16 h-16 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
            >
              <XCircle className="w-8 h-8 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
