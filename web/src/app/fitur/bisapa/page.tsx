"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Volume2,
  Mic,
  Camera,
  Cpu,
  Sparkles,
  ArrowRight,
  Zap,
  ArrowLeft,
  CheckCircle2,
  Play,
  RotateCcw,
  Hand,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";
import InteractiveDeviceMockup from "@/components/InteractiveDeviceMockup";

export default function BiSapaDetailPage() {
  const [selectedGesture, setSelectedGesture] = useState<string>("TERIMA KASIH");

  const gestures = [
    { text: "TERIMA KASIH", detail: "Kedua telapak tangan terkatup di dada maju perlahan." },
    { text: "SELAMAT PAGI", detail: "Tangan kanan menyentuh pelipis lalu membuka seperti fajar." },
    { text: "APA KABAR", detail: "Dua tangan terbuka di depan dada digerakkan memutar ringan." },
    { text: "SAYA BUTUH BANTUAN", detail: "Telapak tangan menepuk dada lalu menengadah ke depan." },
  ];

  const handleTestTTS = (text: string) => {
    setSelectedGesture(text);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "id-ID";
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-800 selection:bg-amber-500/20">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/fitur" className="hover:text-slate-700 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Semua Fitur
            </Link>
            <span>/</span>
            <span className="text-amber-600 font-bold">BiSAPA</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold uppercase tracking-wider">
                <MessageCircle className="w-4 h-4" /> Penerjemah Bahasa Isyarat BISINDO AI
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                BiSAPA: Komunikasi <br />
                <span className="text-amber-600">Dua Arah Instan</span> Tanpa Batas
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                BiSAPA menjembatani percakapan antara Teman Tuli (Tunarungu) dan Teman Netra (Tunanetra) atau masyarakat luas menggunakan kecerdasan buatan on-device. Gestur tangan diterjemahkan ke suara, dan suara langsung diubah ke teks visual.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/app/bisapa"
                  className="px-7 py-3.5 rounded-2xl bg-amber-600 text-white font-extrabold text-sm hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Buka Kamera BiSAPA
                </Link>
                <a
                  href="#simulator"
                  className="px-7 py-3.5 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Coba Simulator
                </a>
              </div>
            </div>

            {/* Right: Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <InteractiveDeviceMockup activeFeature="bisapa" interactive={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator */}
      <section id="simulator" className="py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase text-amber-600 bg-amber-100/60 px-3 py-1 rounded-full">
              Live Interactive Simulator
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Uji Coba Penerjemah Gestur BISINDO
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Pilih salah satu frasa isyarat di bawah untuk menguji hasil deteksi model dan dengarkan sintesis suaranya secara langsung.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400">Pilih Frasa Gestur:</div>
              <div className="space-y-2">
                {gestures.map((g) => (
                  <button
                    key={g.text}
                    onClick={() => handleTestTTS(g.text)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      selectedGesture === g.text
                        ? "bg-amber-500 text-white border-amber-500 shadow-md scale-[1.02]"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedGesture === g.text ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>
                        <Hand className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">{g.text}</div>
                        <div className={`text-[10px] ${selectedGesture === g.text ? "text-amber-100" : "text-slate-400"}`}>
                          {g.detail}
                        </div>
                      </div>
                    </div>
                    <Volume2 className="w-4 h-4 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Output Box */}
            <div className="bg-slate-950 rounded-2xl p-6 text-white flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-2">
                  <span>AI Inference Result (ONNX)</span>
                  <span className="bg-amber-500/20 px-2 py-0.5 rounded text-[10px]">Akurasi 98.4%</span>
                </div>
                <div className="text-2xl font-black text-white mt-4">
                  &ldquo;{selectedGesture}&rdquo;
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Diterjemahkan secara instan dari 21 titik koordinat MediaPipe Hands.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">Putar Ulang Suara TTS:</span>
                <button
                  onClick={() => handleTestTTS(selectedGesture)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Putar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Breakdown */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900">
              Arsitektur AI di Balik BiSAPA
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Kombinasi MediaPipe Hand Landmark, ONNX Runtime Web, dan Speech Synthesis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                title: "21 Hand Landmark Tracking",
                desc: "Mengekstrak geometri sendi jari tangan pada resolusi tinggi bahkan dalam pencahayaan redup.",
              },
              {
                icon: Cpu,
                title: "ONNX Runtime on Web/Mobile",
                desc: "Eksekusi model neural network langsung di perangkat lokal pengguna tanpa memerlukan koneksi server berbayar.",
              },
              {
                icon: Volume2,
                title: "Dual Speech & Voice Engine",
                desc: "Konversi otomatis suara lawan bicara ke teks besar serta pembacaan kalimat isyarat dalam audio Bahasa Indonesia.",
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{c.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FloatingAccessibility />
    </div>
  );
}
