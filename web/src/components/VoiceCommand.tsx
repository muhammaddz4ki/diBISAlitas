"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Mic, MicOff, HelpCircle, Volume2, X } from "lucide-react";

/**
 * Perintah suara untuk Tunanetra — buka fitur tanpa melihat layar.
 * Contoh: "buka BiJALAN", "kirim darurat", "komunitas", "bantuan".
 * Memakai Web Speech API (id-ID) + umpan balik TTS & getar.
 */

type Cmd = { keys: string[]; path: string; label: string };

const COMMANDS: Cmd[] = [
  { keys: ["beranda", "dashboard", "utama", "depan"], path: "/app/dashboard", label: "Beranda" },
  { keys: ["komunitas", "forum", "pengumuman"], path: "/app/komunitas", label: "Komunitas" },
  { keys: ["peta", "lokasi", "rintangan"], path: "/app/peta", label: "Peta Komunitas" },
  { keys: ["profil", "akun", "pengaturan", "setelan"], path: "/app/profile", label: "Profil" },
  { keys: ["darurat", "tolong", "panik", "bahaya", "bisafe"], path: "/app/bisafe", label: "BiSAFE Darurat" },
  { keys: ["sapa", "bisapa", "ngobrol", "obrol", "percakapan", "komunikasi", "terjemah"], path: "/app/bisapa", label: "BiSAPA" },
  { keys: ["baca", "membaca", "bibaca", "pindai", "dokumen", "tulisan", "teks"], path: "/app/bibaca", label: "BiBACA" },
  { keys: ["jalan", "bijalan", "navigasi", "rute"], path: "/app/bijalan", label: "BiJALAN" },
  { keys: ["pintar", "bipintar", "belajar", "kuis", "materi", "isyarat", "latihan"], path: "/app/bipintar", label: "BiPINTAR" },
];

/** Item panduan yang ditampilkan ke pengguna. */
const HELP_ITEMS: { w: string; d: string }[] = [
  { w: "baca", d: "BiBACA — pindai & bacakan teks" },
  { w: "ngobrol", d: "BiSAPA — terjemah suara & teks" },
  { w: "jalan", d: "BiJALAN — navigasi rintangan" },
  { w: "belajar", d: "BiPINTAR — materi & kuis" },
  { w: "darurat", d: "BiSAFE — tombol darurat" },
  { w: "peta", d: "Peta Komunitas" },
  { w: "komunitas", d: "Komunitas & info" },
  { w: "beranda", d: "Halaman utama" },
  { w: "profil", d: "Akun & pengaturan" },
];

const GUIDE_SPEECH =
  "Ketuk mikrofon, tunggu nada, lalu ucapkan satu kata untuk membuka fitur. " +
  "Baca untuk BiBACA. Ngobrol untuk BiSAPA. Jalan untuk BiJALAN. Belajar untuk BiPINTAR. " +
  "Darurat untuk BiSAFE. Atau ucapkan peta, komunitas, profil, atau beranda.";

/** Pilih perintah dengan skor paling spesifik (kata utuh & lebih panjang menang). */
function pickCommand(t: string): Cmd | null {
  const words = t.split(/\s+/);
  let best: Cmd | null = null;
  let bestScore = 0;
  for (const c of COMMANDS) {
    for (const k of c.keys) {
      if (t.includes(k)) {
        const score = k.length + (words.includes(k) ? 5 : 0);
        if (score > bestScore) {
          bestScore = score;
          best = c;
        }
      }
    }
  }
  return best;
}

export default function VoiceCommand() {
  const pathname = usePathname();
  const router = useRouter();
  const [listening, setListening] = useState(false);
  const [caption, setCaption] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);
  const supportedRef = useRef(false);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID";
    window.speechSynthesis.speak(u);
  };

  const buzz = (p: number | number[]) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(p);
  };

  const handleCommand = (t: string) => {
    if (t.includes("bantuan") || t.includes("perintah") || t.includes("daftar")) {
      speak(
        "Ucapkan salah satu kata ini: baca, ngobrol, jalan, belajar, peta, komunitas, profil, beranda, atau darurat."
      );
      return;
    }
    const match = pickCommand(t);
    if (match) {
      speak(`Membuka ${match.label}`);
      buzz(40);
      router.push(match.path);
    } else {
      speak("Perintah tidak dikenali. Ucapkan bantuan untuk mendengar daftar perintah.");
      buzz([30, 40, 30]);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    supportedRef.current = true;
    const rec = new SR();
    rec.lang = "id-ID";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const t = String(e.results[0][0].transcript || "").toLowerCase().trim();
      setCaption(t);
      handleCommand(t);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;

    return () => {
      try {
        rec.abort();
      } catch {
        /* noop */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const speakGuide = () => speak(GUIDE_SPEECH);

  const toggle = () => {
    if (!supportedRef.current) {
      speak("Perintah suara tidak didukung di peramban ini.");
      setShowHelp(true);
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }

    // Pertama kali: tampilkan + bacakan panduan dulu, belum mendengarkan.
    const seen = typeof window !== "undefined" && window.localStorage.getItem("dibisalitas_voice_intro") === "1";
    if (!seen) {
      if (typeof window !== "undefined") window.localStorage.setItem("dibisalitas_voice_intro", "1");
      setShowHelp(true);
      speak("Selamat datang di perintah suara. " + GUIDE_SPEECH);
      buzz(30);
      return;
    }

    setCaption("");
    try {
      recRef.current?.start();
      setListening(true);
      speak("Silakan bicara");
      buzz(30);
    } catch {
      /* start() bisa gagal jika sudah berjalan */
    }
  };

  const isAuth = pathname === "/app/login" || pathname === "/app/register";
  if (isAuth) return null;

  return (
    <>
      {listening && caption && (
        <div className="absolute bottom-[13rem] right-6 z-[60] max-w-[220px] bg-slate-800 text-white text-[13px] font-semibold px-4 py-2.5 rounded-[16px] shadow-xl border border-slate-700">
          &ldquo;{caption}&rdquo;
        </div>
      )}

      {/* Tombol panduan — di atas mic, vertikal */}
      <button
        onClick={() => setShowHelp(true)}
        aria-label="Panduan perintah suara"
        title="Panduan perintah suara"
        className="absolute bottom-[199px] right-7 z-[60] w-12 h-12 rounded-full bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),_inset_-3px_-3px_7px_rgba(255,255,255,1),_3px_3px_8px_rgba(0,0,0,0.08)] border border-white flex items-center justify-center text-slate-400 hover:text-[#1B9981] active:scale-90 transition-all"
      >
        <HelpCircle className="w-5 h-5" strokeWidth={2.5} />
      </button>

      {/* Tombol mikrofon */}
      <button
        onClick={toggle}
        aria-label={listening ? "Berhenti mendengarkan perintah suara" : "Aktifkan perintah suara"}
        title="Perintah suara"
        className={`absolute bottom-32 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center bubble-3d shadow-[0_6px_16px_rgba(0,0,0,0.12)] ${
          listening ? "bg-gradient-to-b from-rose-400 to-rose-600 scale-105 animate-pulse" : "bg-gradient-to-b from-[#00B894] to-[#1B9981]"
        }`}
      >
        {listening ? <MicOff className="w-6 h-6 text-white drop-shadow-md" /> : <Mic className="w-6 h-6 text-white drop-shadow-md" />}
      </button>

      {/* Panel panduan */}
      {showHelp && (
        <div
          className="absolute inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-end"
          onClick={() => setShowHelp(false)}
          role="dialog"
          aria-label="Panduan perintah suara"
        >
          <div
            className="w-full bg-[#f4f6fc] rounded-t-[28px] max-h-[82%] flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between shrink-0 px-6 py-5 border-b border-white shadow-[0_4px_10px_rgba(0,0,0,0.02)] z-10 bg-[#f4f6fc] rounded-t-[28px]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00B894] to-[#1B9981] flex items-center justify-center bubble-3d text-white shrink-0">
                  <Mic className="w-5 h-5 text-white drop-shadow-md" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[17px] font-black text-slate-800 tracking-tight text-3d">Perintah Suara</h3>
                  <p className="text-[11px] text-slate-400 font-semibold text-3d">Ketuk mikrofon, lalu ucapkan kata</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                aria-label="Tutup"
                className="w-9 h-9 rounded-full bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white flex items-center justify-center active:scale-90 transition-transform"
              >
                <X className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pt-5 pb-8 [&::-webkit-scrollbar]:hidden">
              {/* Command list — satu card besar */}
              <div className="rounded-[15px] shadow-3d border border-white bg-white/50 p-4">
              <div className="flex flex-col gap-0 divide-y divide-slate-100">
                {HELP_ITEMS.map((it) => (
                  <div key={it.w} className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0">
                    <span className="shrink-0 px-3 py-1.5 rounded-xl bg-[#f4f6fc] text-[#1B9981] font-bold text-[12px] min-w-[85px] text-center shadow-[2px_2px_5px_rgba(0,0,0,0.08),_-2px_-2px_5px_rgba(255,255,255,1)] border border-white">
                      &ldquo;{it.w}&rdquo;
                    </span>
                    <span className="text-[13px] text-slate-600 font-medium">{it.d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Listen button */}
            <button
              onClick={speakGuide}
              className="mt-5 w-full py-3.5 rounded-[18px] bg-gradient-to-r from-[#1B9981] to-[#00D4AA] text-white font-black text-[14px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-[0_6px_16px_rgba(27,153,129,0.3)]"
            >
              <Volume2 className="w-5 h-5 drop-shadow-sm" /> Dengarkan Panduan
            </button>
            <p className="text-[11px] text-slate-400 mt-3 text-center font-medium">
              Tips: ucapkan satu kata inti saja, mis. &ldquo;baca&rdquo;. Ucapkan &ldquo;bantuan&rdquo; kapan saja untuk mendengar daftar ini.
            </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
