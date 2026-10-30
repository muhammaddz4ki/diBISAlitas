"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Terminal,
  Copy,
  Check,
  Layers,
  ExternalLink,
  Send,
  Play,
  Cpu,
  Globe,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  FileCode,
  Zap,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/LanguageContext";

export default function DeveloperPage() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [activeTab, setActiveTab] = useState<"widget" | "api">("widget");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // State Interactive API Tester
  const [testInput, setTestInput] = useState("Aksesibilitas cerdas kemandirian tanpa batas");
  const [apiResult, setApiResult] = useState<any>({
    status: "success",
    version: "v1",
    timestamp: "2026-10-30T02:13:05.551Z",
    data: {
      inputText: "Aksesibilitas cerdas kemandirian tanpa batas",
      totalTokens: 3,
      totalDurationMs: 3450,
      estimatedSeconds: 3.5,
      character: {
        id: "rian",
        name: "Rian (POLMAN)",
        institution: "Politeknik Manufaktur Negeri Bandung",
        renderEngine: "3D Clay Parallax & Multi-Frame Kinematics",
        neutralAssetUrl: "/avatars/rian_neutral.jpg",
      },
      tokens: [
        {
          index: 0,
          id: "token-0",
          rawText: "Aksesibilitas Cerdas",
          displayWord: "Aksesibilitas Cerdas",
          type: "gesture",
          poseKey: "bisa",
          assetUrl: "/avatars/rian_neutral.jpg",
          durationMs: 1400,
        },
        {
          index: 1,
          id: "token-1",
          rawText: "Kemandirian Tanpa Batas",
          displayWord: "Kemandirian Tanpa Batas",
          type: "gesture",
          poseKey: "salam",
          assetUrl: "/avatars/rian_neutral.jpg",
          durationMs: 1400,
        },
        {
          index: 2,
          id: "token-neutral-2",
          rawText: "Posisi Siap",
          displayWord: "",
          type: "pause",
          poseKey: "neutral",
          assetUrl: "/avatars/rian_neutral.jpg",
          durationMs: 650,
        },
      ],
    },
  });
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const scriptTagCode = `<script\n  src="https://dibisalitas.vercel.app/widget.js"\n  data-position="bottom-right"\n  data-color="#1B9981"\n  defer\n></script>`;

  const curlSnippet = `curl -X POST https://dibisalitas.vercel.app/api/v1/sign \\\n  -H "Content-Type: application/json" \\\n  -d '{"text": "${testInput.replace(/"/g, '\\"')}"}'`;

  const jsApiSnippet = `// Kontrol programmatic dari JavaScript website host\nwindow.DiBISAWidget.open();\nwindow.DiBISAWidget.translate("Selamat datang di website kami");\n\n// Dengarkan event dari avatar 3D Rian\nwindow.DiBISAWidget.on("ready", () => console.log("Avatar 3D siap"));\nwindow.DiBISAWidget.on("finished", (e) => console.log("Selesai:", e.sentence));`;

  const handleCopySnippet = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(scriptTagCode);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2200);
    }
  };

  const handleCopyCurl = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(curlSnippet);
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2200);
    }
  };

  const handleRunApiTest = async (overrideText?: string) => {
    const textToSend = overrideText || testInput;
    if (!textToSend.trim()) return;

    setIsLoadingApi(true);
    try {
      const res = await fetch(`/api/v1/sign?text=${encodeURIComponent(textToSend.trim())}`);
      const data = await res.json();
      setApiResult(data);
    } catch {
      // Mock response fallback jika server lokal offline
      setApiResult({
        status: "success",
        data: {
          inputText: textToSend,
          totalTokens: 2,
          totalDurationMs: 2050,
          character: {
            id: "rian",
            name: "Rian (POLMAN)",
            institution: "Politeknik Manufaktur Negeri Bandung",
          },
        },
      });
    } finally {
      setIsLoadingApi(false);
    }
  };

  const triggerLiveSign = (text: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("dibisalitas:translate-sign", {
          detail: { text },
        })
      );
    }
  };

  // Kamus Dwibahasa ID / EN
  const t = {
    badge: isEn ? "DEVELOPER DOCUMENTATION" : "DOKUMENTASI PENGEMBANG",
    heroTitle: isEn ? "Integrate 3D Sign Interpreter &" : "Integrasikan Asisten 3D &",
    heroHighlight: isEn ? "Headless API" : "API Headless",
    heroSubtitle: isEn
      ? "Embed the Rian POLMAN 3D avatar into any external web platform with a single line of script, or build custom accessibility workflows using our headless sign language tokenizer API."
      : "Sematkan avatar 3D Rian POLMAN ke dalam website eksternal dengan satu baris skrip, atau bangun alur aksesibilitas kustom Anda menggunakan REST API tokenizer bahasa isyarat kami.",
    tabWidget: isEn ? "1-Line Embed Widget" : "Widget Embed (1 Baris)",
    tabApi: isEn ? "Headless REST API" : "Headless REST API",
    embedHeader: isEn ? "Embed 3D Sign Avatar in Seconds" : "Sematkan Avatar Isyarat 3D dalam Hitungan Detik",
    embedDesc: isEn
      ? "Lightweight vanilla JavaScript script (< 15 KB) with Shadow DOM encapsulation. 100% immune to host styling conflicts."
      : "Skrip vanilla JavaScript ultra-ringan (< 15 KB) dengan enkapsulasi Shadow DOM. 100% kebal dari bentrok styling CSS website host.",
    copy: isEn ? "Copy Code" : "Salin Kode",
    copied: isEn ? "Copied!" : "Tersalin!",
    testLiveSign: isEn ? "Test Live Gesture on Screen" : "Uji Peragaan 3D di Layar",
    apiHeader: isEn ? "Headless Sign Tokenizer Endpoint" : "Endpoint Tokenizer Bahasa Isyarat",
    apiDesc: isEn
      ? "Public GET & POST endpoint returning parsed BISINDO gesture tokens, 3D Rian frame URLs, and duration estimates."
      : "Endpoint publik GET & POST yang mengurai kalimat menjadi antrean token gestur BISINDO, URL render 3D Rian POLMAN, dan estimasi durasi.",
    sendRequest: isEn ? "Send Request" : "Kirim Permintaan",
    curlHeading: isEn ? "cURL Command Request:" : "Perintah Permintaan cURL:",
    jsonHeading: isEn ? "Live JSON Response (200 OK):" : "Respon JSON Langsung (200 OK):",
    promptLabel: isEn ? "Input sentence to test:" : "Ketik kalimat untuk diuji:",
    jsApiHeading: isEn ? "Public JavaScript API:" : "API Publik JavaScript:",
    testHarnessTitle: isEn ? "Cross-Origin Test Clients" : "Uji Coba Klien Lintas Domain",
    testHarnessDesc: isEn
      ? "We provide two standalone HTML test clients with different visual themes (Dark Mode SaaS and Light Mode Academic Portal) to prove zero-dependency embedding across separate ports."
      : "Kami menyediakan dua file HTML mandiri dengan tema visual berbeda (Dark Mode SaaS dan Light Mode Portal Akademik) untuk memvalidasi injeksi widget lintas domain di port terpisah.",
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-[#1B9981]/30 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 overflow-hidden border-b border-white/5">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#1B9981]/15 blur-[160px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#2a9d8f]/10 blur-[140px] rounded-full pointer-events-none z-0" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B9981]/15 border border-[#1B9981]/30 text-[#34d399] text-xs font-bold uppercase tracking-wider"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.12]"
          >
            {t.heroTitle} <span className="text-[#00D4AA]">{t.heroHighlight}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            {t.heroSubtitle}
          </motion.p>

          {/* Tab Switcher */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-6 flex justify-center"
          >
            <div className="p-1.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-1.5 shadow-2xl backdrop-blur-xl">
              <button
                onClick={() => setActiveTab("widget")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "widget"
                    ? "bg-[#1B9981] text-white shadow-lg shadow-[#1B9981]/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{t.tabWidget}</span>
              </button>

              <button
                onClick={() => setActiveTab("api")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "api"
                    ? "bg-[#1B9981] text-white shadow-lg shadow-[#1B9981]/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>{t.tabApi}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Documentation Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16 w-full flex-1">
        {activeTab === "widget" ? (
          /* ========================================================
             BAGIAN 1: WIDGET EMBED (1 BARIS)
             ======================================================== */
          <div className="space-y-10">
            {/* Kartu Utama Snippet */}
            <div className="bg-[#0c1220]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                    <Layers className="w-6 h-6 text-[#00D4AA]" />
                    <span>{t.embedHeader}</span>
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                    {t.embedDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 notranslate" translate="no">
                    &lt; 15 KB (Zero Dependency)
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 notranslate" translate="no">
                    Shadow DOM Isolated
                  </span>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono notranslate" translate="no">index.html</span>
                  </div>

                  <button
                    onClick={handleCopySnippet}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B9981]/20 hover:bg-[#1B9981]/30 text-[#00D4AA] text-xs font-bold transition-all border border-[#1B9981]/40 cursor-pointer"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? t.copied : t.copy}</span>
                  </button>
                </div>

                <div className="rounded-2xl bg-[#040810] border border-slate-800 p-5 overflow-x-auto shadow-inner">
                  <pre className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed notranslate" translate="no">
                    <code>
                      <span className="text-slate-500">&lt;!-- diBISAlitas 3D Rian POLMAN Universal Widget --&gt;</span>{"\n"}
                      <span className="text-[#38bdf8]">&lt;script</span>{"\n"}
                      {"  "}<span className="text-[#a5b4fc]">src</span>=<span className="text-[#34d399]">&quot;https://dibisalitas.vercel.app/widget.js&quot;</span>{"\n"}
                      {"  "}<span className="text-[#a5b4fc]">data-position</span>=<span className="text-[#34d399]">&quot;bottom-right&quot;</span>{"\n"}
                      {"  "}<span className="text-[#a5b4fc]">data-color</span>=<span className="text-[#34d399]">&quot;#1B9981&quot;</span>{"\n"}
                      {"  "}<span className="text-[#fbbf24]">defer</span>{"\n"}
                      <span className="text-[#38bdf8]">&gt;&lt;/script&gt;</span>
                    </code>
                  </pre>
                </div>
              </div>

              {/* Action Banner */}
              <div className="p-5 rounded-2xl bg-[#1B9981]/15 border border-[#1B9981]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#1B9981] text-white flex items-center justify-center shrink-0 shadow-md">
                    <Play className="w-4 h-4 fill-white stroke-none ml-0.5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {isEn ? "Test Widget Peragaan Right Now" : "Uji Coba Peragaan Widget Sekarang"}
                    </div>
                    <div className="text-xs text-slate-400">
                      {isEn
                        ? "Click the button to test live gesture sequencing on this screen."
                        : "Klik tombol di samping untuk menguji pembukaan asisten 3D langsung di layar ini."}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => triggerLiveSign("Aksesibilitas cerdas kemandirian tanpa batas")}
                  className="px-5 py-2.5 rounded-xl bg-[#1B9981] hover:bg-[#16816d] text-white text-xs font-bold transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.testLiveSign}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid Parameter Kustomisasi */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00D4AA]" />
                <span>{isEn ? "Customization Attributes" : "Parameter Atribut Tag Script"}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="text-xs font-mono font-bold text-[#34d399] notranslate" translate="no">
                    data-position
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    &quot;bottom-right&quot; | &quot;bottom-left&quot;
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {isEn ? "Sets the corner position of the floating button." : "Menentukan posisi tombol melayang di pojok kanan atau kiri layar."}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="text-xs font-mono font-bold text-[#34d399] notranslate" translate="no">
                    data-color
                  </div>
                  <div className="text-xs font-semibold text-slate-200 notranslate" translate="no">
                    &quot;#1B9981&quot; (Hex code)
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {isEn ? "Customizes the accent theme color of the FAB button." : "Kustomisasi warna tema tombol dan aksen popover asisten 3D."}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="text-xs font-mono font-bold text-[#34d399] notranslate" translate="no">
                    data-selection-helper
                  </div>
                  <div className="text-xs font-semibold text-slate-200 notranslate" translate="no">
                    &quot;true&quot; | &quot;false&quot;
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {isEn ? "Displays floating trigger when visitors highlight text." : "Memunculkan tombol balon melayang otomatis saat pengunjung memblok teks."}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="text-xs font-mono font-bold text-[#34d399] notranslate" translate="no">
                    data-server
                  </div>
                  <div className="text-xs font-semibold text-slate-200 notranslate" translate="no">
                    URL Server diBISAlitas
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {isEn ? "Auto-detects origin or specifies custom instance." : "Otomatis mendeteksi origin atau mengarah ke instance kustom."}
                  </div>
                </div>
              </div>
            </div>

            {/* Public JS API */}
            <div className="bg-[#0c1220]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#00D4AA]" />
                <span>{t.jsApiHeading}</span>
              </h3>

              <div className="rounded-2xl bg-[#040810] border border-slate-800 p-5 overflow-x-auto">
                <pre className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed notranslate" translate="no">
                  <code>{jsApiSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             BAGIAN 2: HEADLESS REST API (/api/v1/sign)
             ======================================================== */
          <div className="space-y-10">
            {/* Header Endpoint Info */}
            <div className="bg-[#0c1220]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xs font-black notranslate" translate="no">
                      GET / POST
                    </span>
                    <span className="font-mono text-sm sm:text-base font-bold text-white notranslate" translate="no">
                      /api/v1/sign
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 max-w-2xl">
                    {t.apiDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 notranslate" translate="no">
                    CORS: *
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 notranslate" translate="no">
                    JSON v1.0
                  </span>
                </div>
              </div>

              {/* Interactive API Tester */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <label className="text-xs font-bold text-slate-300 block">
                  {t.promptLabel}
                </label>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRunApiTest()}
                    placeholder="Contoh: Aksesibilitas cerdas, kemandirian tanpa batas..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1B9981]"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRunApiTest()}
                      disabled={isLoadingApi}
                      className="px-6 py-3 rounded-xl bg-[#1B9981] hover:bg-[#16816d] text-white text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {isLoadingApi ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{t.sendRequest}</span>
                    </button>

                    <button
                      onClick={() => triggerLiveSign(testInput)}
                      title="Peragakan langsung di 3D Avatar Rian"
                      className="px-4 py-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-[#1B9981] hover:text-white transition-all text-xs font-bold cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400 font-semibold mr-1">
                    {isEn ? "Presets:" : "Preset Uji:"}
                  </span>
                  {[
                    "Aksesibilitas cerdas",
                    "Kemandirian tanpa batas",
                    "Halo terima kasih",
                    "Pasti bisa",
                    "POLMAN Bandung",
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => {
                        setTestInput(phrase);
                        handleRunApiTest(phrase);
                      }}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10 hover:border-[#1B9981] hover:text-white transition-all cursor-pointer"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>

              {/* cURL vs Live JSON */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left: cURL Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-400">
                      {t.curlHeading}
                    </span>
                    <button
                      onClick={handleCopyCurl}
                      className="flex items-center gap-1 text-xs font-bold text-[#00D4AA] hover:underline cursor-pointer"
                    >
                      {copiedCurl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCurl ? t.copied : t.copy}</span>
                    </button>
                  </div>

                  <div className="rounded-2xl bg-[#040810] border border-slate-800 p-5 h-[280px] overflow-auto">
                    <pre className="font-mono text-xs text-slate-300 leading-relaxed notranslate" translate="no">
                      <code>{curlSnippet}</code>
                    </pre>
                  </div>
                </div>

                {/* Right: Live JSON Viewer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-400">
                      {t.jsonHeading}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold notranslate" translate="no">
                      application/json
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[#040810] border border-slate-800 p-5 h-[280px] overflow-auto">
                    <pre className="font-mono text-xs text-emerald-400/90 leading-relaxed notranslate" translate="no">
                      <code>{JSON.stringify(apiResult, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Cross-Origin Test Clients */}
        <div className="bg-[#0c1220]/80 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {t.testHarnessTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {t.testHarnessDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">1. Client Dark SaaS (Modern)</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">Port 8080</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulasi website startup tech AI modern dengan event listener konsol real-time dan tombol pemicu JavaScript.
              </p>
              <div className="text-xs font-mono text-slate-300 bg-black/40 p-2.5 rounded-xl border border-white/5 notranslate" translate="no">
                http://localhost:8080/site1-modern.html
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">2. Client Light Portal (POLMAN)</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">Port 8080</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulasi portal resmi akademik kampus POLMAN Bandung dengan integrasi artikel berita dan sambutan direktur.
              </p>
              <div className="text-xs font-mono text-slate-300 bg-black/40 p-2.5 rounded-xl border border-white/5 notranslate" translate="no">
                http://localhost:8080/site2-classic.html
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="border-t border-white/10 py-10 px-6 text-center text-xs text-slate-500">
        &copy; 2026 <span className="notranslate" translate="no">diBISAlitas</span> — Platform Ekosistem Aksesibilitas Cerdas Berbasis AI. Inovasi Mahasiswa <span className="notranslate" translate="no">POLMAN Bandung</span>.
      </footer>
    </div>
  );
}

