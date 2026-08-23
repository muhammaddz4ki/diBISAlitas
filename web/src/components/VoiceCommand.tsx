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
        <div className="absolute bottom-[12.5rem] right-6 z-[60] max-w-[220px] bg-slate-900 text-white text-[13px] font-medium px-3.5 py-2 rounded-2xl shadow-xl">
          &ldquo;{caption}&rdquo;
        </div>
      )}

      {/* Tombol panduan */}
      <button
        onClick={() => setShowHelp(true)}
        aria-label="Panduan perintah suara"
        title="Panduan perintah suara"
        className="absolute bottom-[9.5rem] right-[5.5rem] z-[60] w-12 h-12 rounded-full bg-white border-2 border-white shadow-3d shadow-3d-hover shadow-3d-active icon-3d flex items-center justify-center text-slate-500 hover:text-[#00B894]"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Tombol mikrofon */}
      <button
        onClick={toggle}
        aria-label={listening ? "Berhenti mendengarkan perintah suara" : "Aktifkan perintah suara"}
        title="Perintah suara"
        className={`absolute bottom-36 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center border-2 border-white shadow-3d shadow-3d-active icon-3d ${
          listening ? "bg-gradient-to-br from-rose-400 to-rose-600 scale-105 animate-pulse" : "bg-gradient-to-br from-[#00B894] to-[#00D4AA]"
        }`}
      >
        {listening ? <MicOff className="w-6 h-6 text-white drop-shadow-md" /> : <Mic className="w-6 h-6 text-white drop-shadow-md" />}
      </button>

      {/* Panel panduan */}
      {showHelp && (
        <div
          className="absolute inset-0 z-[70] bg-black/40 flex items-end"
          onClick={() => setShowHelp(false)}
          role="dialog"
          aria-label="Panduan perintah suara"
        >
          <div
            className="w-full bg-white rounded-t-[2rem] p-6 pb-8 max-h-[82%] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[17px] font-black text-slate-800">Panduan Perintah Suara</h3>
              <button
                onClick={() => setShowHelp(false)}
                aria-label="Tutup"
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-[13px] text-slate-500 mb-4">Ketuk mikrofon, tunggu nada, lalu ucapkan satu kata:</p>

            <div className="space-y-2.5">
              {HELP_ITEMS.map((it) => (
                <div key={it.w} className="flex items-center gap-3">
                  <span className="shrink-0 px-3 py-1.5 rounded-xl bg-[#00B894]/10 text-[#00B894] font-bold text-[13px] min-w-[92px] text-center">
                    &ldquo;{it.w}&rdquo;
                  </span>
                  <span className="text-[13px] text-slate-600">{it.d}</span>
                </div>
              ))}
            </div>

            <button
              onClick={speakGuide}
              className="mt-5 w-full py-3.5 rounded-2xl bg-[#00B894] text-white font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Volume2 className="w-5 h-5" /> Dengarkan Panduan
            </button>
            <p className="text-[12px] text-slate-400 mt-3 text-center">
              Tips: ucapkan satu kata inti saja, mis. &ldquo;baca&rdquo;. Ucapkan &ldquo;bantuan&rdquo; kapan saja untuk mendengar daftar ini.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
