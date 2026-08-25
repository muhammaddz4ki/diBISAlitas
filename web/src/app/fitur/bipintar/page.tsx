"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Zap,
  ArrowLeft,
  Flame,
  Star,
  Hand,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";
import InteractiveDeviceMockup from "@/components/InteractiveDeviceMockup";

export default function BiPintarDetailPage() {
  const [activeTab, setActiveTab] = useState<"bisindo" | "hijaiyah">("bisindo");
  const [selectedLetter, setSelectedLetter] = useState<string>("A");

  const bisindoLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  const hijaiyahLetters = ["Alif (ا)", "Ba (ب)", "Ta (ت)", "Tsa (ث)", "Jim (ج)", "Ha (ح)", "Kha (خ)"];

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-800 selection:bg-emerald-500/20">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/fitur" className="hover:text-slate-700 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Semua Fitur
            </Link>
            <span>/</span>
            <span className="text-emerald-600 font-bold">BiPINTAR</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" /> Gamified E-Learning BISINDO &amp; Hijaiyah
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                BiPINTAR: Belajar <br />
                <span className="text-emerald-600">Bahasa Isyarat</span> Menjadi Menyenangkan
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                BiPINTAR menghadirkan pengalaman belajar bahasa isyarat BISINDO dan Isyarat Huruf Hijaiyah dengan panduan animasi GIF berstandar nasional, kuis interaktif, level gamifikasi, dan lencana prestasi.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/app/bipintar"
                  className="px-7 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Mulai Belajar di BiPINTAR
                </Link>
                <a
                  href="#simulator"
                  className="px-7 py-3.5 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Lihat Kamus Isyarat
                </a>
              </div>
            </div>

            {/* Right: Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <InteractiveDeviceMockup activeFeature="bipintar" interactive={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Kamus Simulator */}
      <section id="simulator" className="py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase text-emerald-600 bg-emerald-100/60 px-3 py-1 rounded-full">
              Kamus Interaktif BiPINTAR
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Eksplorasi Alfabet &amp; Isyarat
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Pilih abjad BISINDO untuk melihat panduan gestur tangan resminya.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setActiveTab("bisindo")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeTab === "bisindo"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Alfabet BISINDO (A-Z)
              </button>
              <button
                onClick={() => setActiveTab("hijaiyah")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeTab === "hijaiyah"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Isyarat Hijaiyah
              </button>
            </div>

            {/* Letter Grid */}
            <div className="flex flex-wrap justify-center gap-2">
              {(activeTab === "bisindo" ? bisindoLetters : hijaiyahLetters).map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-12 h-12 rounded-2xl font-black text-sm border transition-all ${
                    selectedLetter === letter
                      ? "bg-emerald-600 text-white border-emerald-600 scale-110 shadow-md"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {letter.slice(0, 1)}
                </button>
              ))}
            </div>

            {/* Preview Box */}
            <div className="p-6 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  Panduan Gestur Isyarat:
                </span>
                <div className="text-3xl font-black text-white">Huruf {selectedLetter}</div>
                <p className="text-xs text-slate-400 max-w-sm">
                  Posisikan telapak tangan tegak setinggi dada dengan jari membentuk karakter isyarat {selectedLetter}.
                </p>
              </div>

              <div className="w-28 h-28 rounded-2xl bg-slate-900 border border-emerald-500/30 flex flex-col items-center justify-center shadow-inner">
                <Hand className="w-10 h-10 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-300 mt-1">Gestur {selectedLetter}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: "Kurikulum Terstruktur",
              desc: "Mulai dari abjad dasar, kata sehari-hari, hingga percakapan kalimat isyarat kompleks.",
            },
            {
              icon: Flame,
              title: "Streak & Gamification",
              desc: "Kumpulkan XP harian, pertahankan streak belajar, dan capai posisi teratas papan peringkat.",
            },
            {
              icon: Star,
              title: "Modul Hijaiyah Inklusif",
              desc: "Inovasi pertama di Indonesia untuk pembelajaran bahasa isyarat huruf hijaiyah pendidikan Islam.",
            },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{c.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <FloatingAccessibility />
    </div>
  );
}
