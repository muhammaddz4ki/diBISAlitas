"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Volume2,
  Scan,
  Sparkles,
  ArrowRight,
  Zap,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Sliders,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";
import InteractiveDeviceMockup from "@/components/InteractiveDeviceMockup";

export default function BiBacaDetailPage() {
  const [selectedSample, setSelectedSample] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const samples = [
    {
      title: "Papan Petunjuk Stasiun",
      text: "PERON 1: Kereta Commuter Line menuju Manggarai dan Stasiun Kota. Jalur aksesibilitas kursi roda berada di pintu nomor 3.",
    },
    {
      title: "Petunjuk Penggunaan Obat",
      text: "Diminum 3 kali sehari 1 tablet sesudah makan. Simpan pada suhu ruangan terhindar dari sinar matahari langsung.",
    },
    {
      title: "Menu Restoran / Kafe",
      text: "Kopi Susu Gula Aren Rp 18.000. Roti Bakar Cokelat Keju Rp 22.000. Tersedia sedotan ramah disabilitas.",
    },
  ];

  const handleReadSample = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "id-ID";
      u.rate = 0.95;
      u.onstart = () => setIsReading(true);
      u.onend = () => setIsReading(false);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-800 selection:bg-purple-500/20">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/fitur" className="hover:text-slate-700 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Semua Fitur
            </Link>
            <span>/</span>
            <span className="text-purple-600 font-bold">BiBACA</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-600 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" /> Smart OCR Document-to-Speech
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                BiBACA: Mendengar <br />
                <span className="text-purple-600">Setiap Tulisan</span> di Dunia Nyata
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                BiBACA memberdayakan Tunanetra, Low Vision, dan penyandang Disleksia untuk membaca buku cetak, label kemasan, surat kabar, hingga papan tanda publik secara instan melalui suara Bahasa Indonesia yang alami.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/app/bibaca"
                  className="px-7 py-3.5 rounded-2xl bg-purple-600 text-white font-extrabold text-sm hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Buka Scanner BiBACA
                </Link>
                <a
                  href="#simulator"
                  className="px-7 py-3.5 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Uji Coba Teks Suara
                </a>
              </div>
            </div>

            {/* Right: Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <InteractiveDeviceMockup activeFeature="bibaca" interactive={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator */}
      <section id="simulator" className="py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase text-purple-600 bg-purple-100/60 px-3 py-1 rounded-full">
              Simulator Pembaca Teks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Uji Coba Pengenalan Teks &amp; Suara
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Pilih sampel dokumen di bawah untuk melihat hasil ekstraksi OCR dan mendengarkan pembacaan suaranya.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {samples.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedSample(i);
                    handleReadSample(s.text);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedSample === i
                      ? "bg-purple-600 text-white border-purple-600 shadow-md scale-105"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="font-bold text-xs">{s.title}</div>
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 text-white space-y-4">
              <div className="flex items-center justify-between text-xs text-purple-400 font-bold">
                <span>Hasil Ekstraksi OCR Tesseract:</span>
                <span>{isReading ? "🔊 Sedang Membaca..." : "Siap Diputar"}</span>
              </div>
              <p className="text-base sm:text-lg font-semibold leading-relaxed text-slate-100">
                &ldquo;{samples[selectedSample].text}&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs text-slate-400">Bahasa: Indonesia (id-ID)</span>
                <button
                  onClick={() => handleReadSample(samples[selectedSample].text)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" /> Bacakan Ulang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Scan,
              title: "Adaptive Document Enhancement",
              desc: "Otomatis memperbaiki kontras, rotasi sudut, dan kecerahan gambar sebelum diekstrak OCR.",
            },
            {
              icon: Volume2,
              title: "Natural Indonesian Speech",
              desc: "Pelafalan kalimat Indonesia yang luwes dengan intonasi jeda tanda baca yang akurat.",
            },
            {
              icon: FileText,
              title: "Penyimpanan Riwayat Teks",
              desc: "Simpan hasil scan dokumen penting ke perpustakaan lokal untuk didengarkan kembali kapan saja.",
            },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
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
