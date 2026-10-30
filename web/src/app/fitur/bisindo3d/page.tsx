"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Code2,
  Globe2,
  Layers,
  ArrowRight,
  CheckCircle2,
  Play,
  BookOpen,
  Copy,
  ExternalLink,
  Hand,
  Volume2,
  Brain,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Bisindo3DCharacter from "@/components/Bisindo3DCharacter";

const API_FEATURES = [
  {
    icon: Hand,
    title: "Penerjemahan Isyarat 3D",
    desc: "Terjemahkan teks dan huruf menjadi animasi isyarat BISINDO 3D secara real-time.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    border: "border-emerald-500/20 dark:border-emerald-500/30",
  },
  {
    icon: Brain,
    title: "AI-Powered Recognition",
    desc: "Model AI mengenali bahasa isyarat dari kamera dan menerjemahkan ke teks.",
    color: "text-blue-500",
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    border: "border-blue-500/20 dark:border-blue-500/30",
  },
  {
    icon: Volume2,
    title: "Text-to-Sign + TTS",
    desc: "Konversi teks menjadi animasi isyarat 3D dan suara secara simultan.",
    color: "text-purple-500",
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    border: "border-purple-500/20 dark:border-purple-500/30",
  },
  {
    icon: Code2,
    title: "REST API & WebSocket",
    desc: "API endpoints lengkap dengan WebSocket untuk komunikasi isyarat real-time.",
    color: "text-orange-500",
    bg: "bg-orange-500/10 dark:bg-orange-500/20",
    border: "border-orange-500/20 dark:border-orange-500/30",
  },
  {
    icon: Globe2,
    title: "Embeddable Widget",
    desc: "Embed karakter 3D ke website mana saja dengan satu baris kode.",
    color: "text-pink-500",
    bg: "bg-pink-500/10 dark:bg-pink-500/20",
    border: "border-pink-500/20 dark:border-pink-500/30",
  },
  {
    icon: Layers,
    title: "Multi-Platform SDK",
    desc: "SDK tersedia untuk Web, React, Flutter, dan native Android/iOS.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    border: "border-cyan-500/20 dark:border-cyan-500/30",
  },
];

const CODE_EXAMPLES = {
  embed: `<!-- Embed Widget BISINDO 3D di Website Anda -->
<script src="https://api.dibisalitas.id/widget.js"></script>
<div id="bisindo-widget" 
  data-position="bottom-right"
  data-theme="auto"
  data-lang="id">
</div>`,
  api: `// REST API - Terjemahkan teks ke isyarat
const response = await fetch(
  'https://api.dibisalitas.id/v1/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      text: 'Halo, selamat pagi!',
      output: '3d_animation',
      speed: 1.0
    })
  }
);

const { signs, animationUrl } = await response.json();`,
  websocket: `// WebSocket - Real-time Sign Language
const ws = new WebSocket(
  'wss://api.dibisalitas.id/v1/stream'
);

ws.onopen = () => {
  ws.send(JSON.stringify({
    action: 'subscribe',
    channel: 'sign_recognition',
    api_key: 'YOUR_API_KEY'
  }));
};

ws.onmessage = (event) => {
  const { sign, confidence, animation } = 
    JSON.parse(event.data);
  console.log(\`Detected: \${sign} (\${confidence}%)\`);
  // Render 3D animation...
};`,
};

export default function Bisindo3DApiPage() {
  const [activeTab, setActiveTab] = useState<"embed" | "api" | "websocket">("embed");
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeSign, setActiveSign] = useState("idle");
  const [isPlaying, setIsPlaying] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSignClick = (sign: string) => {
    setIsPlaying(false);
    setActiveSign(sign);
    setTimeout(() => {
      setActiveSign("idle");
      setIsPlaying(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/40 dark:from-black dark:to-emerald-950/15 text-slate-800 dark:text-slate-200 selection:bg-emerald-500/20">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6 relative overflow-visible">
        {/* Background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#1B9981]/10 dark:bg-[#00D4AA]/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-[10%] w-[200px] h-[200px] bg-emerald-400/10 dark:bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[60vh]">
            {/* Left: Info */}
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B9981]/10 dark:bg-[#00D4AA]/20 border border-[#1B9981]/20 dark:border-[#00D4AA]/30 text-[#1B9981] dark:text-[#00D4AA] text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-4 h-4" /> BISINDO 3D API
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                  Bahasa Isyarat <br />
                  <span className="text-[#1B9981] dark:text-[#00D4AA]">3D Interaktif</span>
                  <br />
                  di Website Anda
                </h1>

                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-light mt-5">
                  Integrasikan karakter 3D BISINDO ke dalam platform Anda. Widget aksesibilitas yang
                  menterjemahkan konten menjadi bahasa isyarat Indonesia secara real-time, ditenagai oleh AI.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href="#demo"
                    className="px-8 py-4 rounded-full bg-gradient-to-br from-[#1B9981] to-[#00D4AA] text-white font-extrabold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#1B9981]/20 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" /> Coba Demo
                  </Link>
                  <Link
                    href="#api-docs"
                    className="px-8 py-4 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white font-bold text-sm hover:bg-slate-300 dark:hover:bg-white/20 transition-all border border-transparent dark:border-white/10 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" /> Dokumentasi API
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex gap-8 pt-6">
                  {[
                    { value: "500+", label: "Kosakata Isyarat" },
                    { value: "<50ms", label: "Latensi API" },
                    { value: "99.9%", label: "Uptime" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: 3D Character Preview */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 flex justify-center relative z-10"
            >
              <div className="relative">
                {/* Glowing background card */}
                <div className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-br from-[#1B9981]/5 to-[#00D4AA]/10 dark:from-[#1B9981]/10 dark:to-[#00D4AA]/20 border border-[#1B9981]/10 dark:border-[#00D4AA]/15 backdrop-blur-sm" />
                
                {/* Character container */}
                <div className="relative p-8 flex flex-col items-center gap-6">
                  <Bisindo3DCharacter isAnimating={isPlaying} currentSign={activeSign} size="lg" />
                  
                  {/* Quick sign buttons */}
                  <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
                    {["halo", "A", "B", "terima_kasih", "ya"].map((sign) => (
                      <button
                        key={sign}
                        onClick={() => handleSignClick(sign)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold
                          bg-white/80 dark:bg-slate-800/80
                          text-slate-700 dark:text-slate-300
                          border border-slate-200 dark:border-slate-700
                          hover:bg-[#1B9981]/10 hover:border-[#1B9981]/40 hover:text-[#1B9981]
                          dark:hover:bg-[#00D4AA]/10 dark:hover:border-[#00D4AA]/40 dark:hover:text-[#00D4AA]
                          transition-all duration-200 shadow-sm"
                      >
                        {sign.replace("_", " ").toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="py-16 md:py-24 px-4 sm:px-6 border-t border-slate-200 dark:border-white/5 relative overflow-visible">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-14"
          >
            <span className="text-sm font-light text-slate-400 dark:text-white/40">Kemampuan Lengkap</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] mt-2">
              Satu API untuk Semua <br />
              <em className="italic text-[#1B9981] dark:text-[#00D4AA]">Kebutuhan Aksesibilitas</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {API_FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group p-6 rounded-2xl bg-white/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5 hover:border-[#1B9981]/30 dark:hover:border-[#00D4AA]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#1B9981]/5"
              >
                <div className={`w-11 h-11 rounded-xl ${feat.bg} border ${feat.border} flex items-center justify-center mb-4`}>
                  <feat.icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIVE DEMO SECTION ===== */}
      <section id="demo" className="py-16 md:py-24 px-4 sm:px-6 border-t border-slate-200 dark:border-white/5 relative overflow-visible">
        <div className="absolute left-[20%] top-1/2 w-[300px] h-[300px] bg-[#1B9981]/5 dark:bg-[#00D4AA]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/30">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 text-xs text-slate-400 dark:text-slate-500 font-mono mx-4">
                    https://yourwebsite.com
                  </div>
                </div>

                {/* Simulated website content */}
                <div className="relative p-6 min-h-[350px] bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                  {/* Fake content lines */}
                  <div className="space-y-4">
                    <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-md" />
                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-700/60 rounded" />
                    <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-700/60 rounded" />
                    <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-700/60 rounded" />
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="h-24 bg-slate-100 dark:bg-slate-700/40 rounded-lg" />
                      <div className="h-24 bg-slate-100 dark:bg-slate-700/40 rounded-lg" />
                    </div>
                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-700/60 rounded" />
                    <div className="h-4 w-4/5 bg-slate-100 dark:bg-slate-700/60 rounded" />
                  </div>

                  {/* Floating BISINDO Widget Preview (within the mockup) */}
                  <div className="absolute bottom-4 right-4 w-[180px] rounded-xl bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                    <div className="px-3 py-2 bg-gradient-to-r from-[#1B9981] to-[#00D4AA] text-white">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 11.5V14a5 5 0 0 0 10 0v-3" />
                            <path d="M5 9h14" />
                          </svg>
                        </div>
                        <span className="text-[9px] font-bold">BISINDO 3D</span>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                      <Bisindo3DCharacter isAnimating={true} size="sm" />
                    </div>
                    <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-slate-400">diBISAlitas</span>
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[8px] text-emerald-500 font-semibold">Aktif</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="order-1 lg:order-2 space-y-5"
            >
              <span className="text-sm font-light text-slate-400 dark:text-white/40">Widget Embed</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] tracking-tight text-slate-900 dark:text-white">
                Aksesibilitas <br />
                <em className="italic text-[#1B9981] dark:text-[#00D4AA]">Satu Baris Kode</em>
              </h2>
              <p className="text-slate-500 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
                Seperti Komdigi yang menyematkan penerjemah isyarat 3D di website-nya, Anda juga bisa
                menambahkan karakter BISINDO 3D ke platform Anda. Widget floating yang non-intrusif namun selalu siap membantu pengguna tunarungu memahami konten Anda.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Integrasi kurang dari 5 menit",
                  "Responsif di semua perangkat",
                  "Dark mode otomatis",
                  "Kustomisasi warna & posisi",
                  "Analytics penggunaan aksesibilitas",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1B9981] dark:text-[#00D4AA] flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CODE EXAMPLES SECTION ===== */}
      <section id="api-docs" className="py-16 md:py-24 px-4 sm:px-6 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="text-sm font-light text-slate-400 dark:text-white/40">Integrasi Mudah</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] mt-2">
              Mulai dalam <em className="italic text-[#1B9981] dark:text-[#00D4AA]">Hitungan Menit</em>
            </h2>
          </motion.div>

          {/* Code tabs */}
          <div className="rounded-2xl overflow-hidden bg-slate-900 dark:bg-[#0a1020] border border-slate-800 dark:border-white/5 shadow-2xl shadow-black/20">
            {/* Tab header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/50 dark:bg-slate-900/50 border-b border-slate-700/50 dark:border-white/5">
              <div className="flex gap-1">
                {(["embed", "api", "websocket"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-[#1B9981] text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab === "embed" ? "Widget Embed" : tab === "api" ? "REST API" : "WebSocket"}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin
                  </>
                )}
              </button>
            </div>

            {/* Code content */}
            <div className="p-5 overflow-x-auto">
              <pre className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre">
                <code>{CODE_EXAMPLES[activeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 md:py-24 px-4 sm:px-6 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-14"
          >
            <span className="text-sm font-light text-slate-400 dark:text-white/40">Arsitektur</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] mt-2">
              Cara <em className="italic text-[#1B9981] dark:text-[#00D4AA]">Kerja</em> API
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Input Teks atau Suara",
                desc: "Kirim teks, audio, atau stream video ke API endpoint kami.",
                icon: BookOpen,
              },
              {
                step: "02",
                title: "AI Processing",
                desc: "Model NLP & Computer Vision memproses input dan mencocokkan dengan dataset BISINDO.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Animasi 3D Output",
                desc: "Karakter 3D menampilkan isyarat dengan gerakan natural dan ekspresi wajah.",
                icon: Hand,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative text-center group"
              >
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[#1B9981]/30 to-transparent" />
                )}

                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1B9981]/10 dark:bg-[#00D4AA]/15 flex items-center justify-center text-[#1B9981] dark:text-[#00D4AA] mb-4 shadow-sm"><item.icon className="w-7 h-7" /></div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#1B9981]/10 dark:bg-[#00D4AA]/20 text-[#1B9981] dark:text-[#00D4AA] text-xs font-bold mb-3">
                  Step {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-4 sm:px-6 text-center border-t border-slate-200 dark:border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B9981]/5 to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1]">
            Jadikan Platform Anda
            <br />
            <span className="text-[#1B9981] dark:text-[#00D4AA]">Inklusif untuk Semua</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto">
            Bergabung dengan ribuan website Indonesia yang sudah menggunakan BISINDO 3D API
            untuk memberikan aksesibilitas penuh bagi penyandang tunarungu.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#"
              className="px-8 py-4 rounded-full bg-gradient-to-br from-[#1B9981] to-[#00D4AA] text-white font-extrabold text-sm hover:opacity-90 shadow-lg shadow-[#1B9981]/20 hover:shadow-[#1B9981]/40 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Daftar API Key Gratis
            </Link>
            <Link
              href="/fitur"
              className="px-8 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2"
            >
              Eksplorasi Fitur Lain <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
