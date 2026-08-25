"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Navigation,
  Compass,
  Volume2,
  AlertTriangle,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Activity,
  Eye,
  Camera,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";
import InteractiveDeviceMockup from "@/components/InteractiveDeviceMockup";

export default function BiJalanDetailPage() {
  const [activeObstacle, setActiveObstacle] = useState(0);

  const obstacles = [
    { name: "Tiang Listrik", dist: "1.2 Meter", dir: "Depan Kiri", action: "Geser ke kanan 30 cm", haptic: "Getar Ringan" },
    { name: "Lubang Galian Trotoar", dist: "2.0 Meter", dir: "Tepat di Depan", action: "Berhenti dan melangkah ke kiri", haptic: "Getar Cepat Berulang" },
    { name: "Pejalan Kaki Mendekat", dist: "3.5 Meter", dir: "Depan Kanan", action: "Jaga kecepatan jalan normal", haptic: "Getar Lembut" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-800 selection:bg-sky-500/20">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/fitur" className="hover:text-slate-700 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Semua Fitur
            </Link>
            <span>/</span>
            <span className="text-sky-600 font-bold">BiJALAN</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-600 text-xs font-bold uppercase tracking-wider">
                <Navigation className="w-4 h-4" /> Spatial Vision &amp; Haptic Guidance
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                BiJALAN: Navigasi Spasial <br />
                <span className="text-sky-600">Mata Kedua</span> Tunanetra
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                BiJALAN mengubah kamera ponsel menjadi sensor pendeteksi rintangan jalan secara real-time. Dengan kombinasi bounding box YOLO on-device, estimasi jarak spasial, panduan suara, dan getaran haptic, mobilitas Tunanetra di trotoar menjadi jauh lebih aman.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/app/bijalan"
                  className="px-7 py-3.5 rounded-2xl bg-sky-600 text-white font-extrabold text-sm hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Buka Kamera BiJALAN
                </Link>
                <a
                  href="#simulator"
                  className="px-7 py-3.5 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Uji Radar Spasial
                </a>
              </div>
            </div>

            {/* Right: Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <InteractiveDeviceMockup activeFeature="bijalan" interactive={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator */}
      <section id="simulator" className="py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase text-sky-600 bg-sky-100/60 px-3 py-1 rounded-full">
              Simulator Deteksi Spasial
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Uji Coba Pengenalan Rintangan Trotoar
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Pilih rintangan di bawah untuk mensimulasikan respons getaran dan panduan arah suara.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {obstacles.map((obs, i) => (
                <button
                  key={i}
                  onClick={() => setActiveObstacle(i)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    activeObstacle === i
                      ? "bg-sky-600 text-white border-sky-600 shadow-md scale-105"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="font-bold text-xs">{obs.name}</div>
                  <div className={`text-[10px] ${activeObstacle === i ? "text-sky-100" : "text-slate-400"}`}>
                    Jarak {obs.dist}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 text-white space-y-4">
              <div className="flex items-center justify-between text-xs text-sky-400 font-bold">
                <span>YOLO Spatial Inference:</span>
                <span>Posisi: {obstacles[activeObstacle].dir}</span>
              </div>
              <div className="text-xl font-bold text-white">
                ⚠️ Peringatan: {obstacles[activeObstacle].name} terdeteksi dalam jarak {obstacles[activeObstacle].dist}
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-300">Instruksi Suara: <strong>&ldquo;{obstacles[activeObstacle].action}&rdquo;</strong></span>
                <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 font-mono text-[10px]">
                  {obstacles[activeObstacle].haptic}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Camera,
              title: "YOLO Object Detection",
              desc: "Mengenali objek trotoar, marka jalan, tangga, kendaraan, dan orang pada kecepatan 30 FPS.",
            },
            {
              icon: Activity,
              title: "Haptic Vibration Feedback",
              desc: "Pola getaran smartphone intuitif yang mengindikasikan arah aman belok kiri atau kanan.",
            },
            {
              icon: Volume2,
              title: "Voice Audio Guidance",
              desc: "Panduan suara cerdas yang tidak mengganggu pendengaran pengguna di lingkungan luar ruang.",
            },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
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
