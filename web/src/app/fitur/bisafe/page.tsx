"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  MapPin,
  Volume2,
  Radio,
  Wifi,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Zap,
  Clock,
  Layers,
  ArrowLeft,
  AlertOctagon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";
import InteractiveDeviceMockup from "@/components/InteractiveDeviceMockup";

export default function BiSafeDetailPage() {
  const [testTriggered, setTestTriggered] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);

  const handleTestSOS = () => {
    setTestTriggered(true);
    setSirenPlaying(true);
    setTimeout(() => {
      setSirenPlaying(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-800 selection:bg-rose-500/20">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/fitur" className="hover:text-slate-700 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Semua Fitur
            </Link>
            <span>/</span>
            <span className="text-rose-600 font-bold">BiSAFE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" /> Sistem Alarm &amp; Panic Button Darurat
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                BiSAFE: Perlindungan <br />
                <span className="text-rose-600">Satu Sentuhan</span> Tanpa Jeda
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                BiSAFE dirancang sebagai garis pertahanan pertama bagi penyandang disabilitas saat menghadapi kondisi krisis, ancaman fisik, kecelakaan, atau disorientasi spasial di ruang publik.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/demo"
                  className="px-7 py-3.5 rounded-2xl bg-rose-600 text-white font-extrabold text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Coba Demo BiSAFE
                </Link>
                <a
                  href="#simulator"
                  className="px-7 py-3.5 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Uji Simulator di Layar
                </a>
              </div>
            </div>

            {/* Right: Live Interactive Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <InteractiveDeviceMockup activeFeature="bisafe" interactive={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Simulator on Page */}
      <section id="simulator" className="py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Sandbox Uji Coba Langsung
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Simulasi Sinyal Darurat BiSAFE
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Klik tombol darurat di bawah untuk melihat bagaimana koordinat satelit disiarkan secara instan ke server Cloud relawan diBISAlitas.
          </p>

          <div className="py-6 flex flex-col items-center justify-center">
            <button
              onClick={handleTestSOS}
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center font-black text-white shadow-2xl transition-all ${
                testTriggered
                  ? "bg-rose-700 scale-95 ring-8 ring-rose-400/50"
                  : "bg-rose-600 hover:scale-105 active:scale-95 shadow-rose-600/30"
              }`}
            >
              <ShieldAlert className="w-12 h-12 mb-1" />
              <span className="text-xs tracking-wider">{testTriggered ? "SOS AKTIF!" : "TEKAN SOS"}</span>
            </button>

            {testTriggered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold max-w-md text-left space-y-1.5"
              >
                <div className="font-bold flex items-center gap-1.5 text-rose-900">
                  <CheckCircle2 className="w-4 h-4 text-rose-600" /> Sinyal Terverifikasi ke Command Center:
                </div>
                <div>• Koordinat: <span className="font-mono">-6.2088° S, 106.8456° E (Presisi 1.2m)</span></div>
                <div>• Timestamp: <span className="font-mono">{new Date().toLocaleTimeString()} WIB</span></div>
                <div>• Status Sirene: <span className="font-bold text-rose-700">{sirenPlaying ? "Membunyikan Frekuensi Bahaya 85dB" : "Sinyal Siap"}</span></div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Deep Breakdown */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900">
              Bagaimana BiSAFE Melindungi Pengguna?
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              4 pilar perlindungan tanpa kompromi saat detik-detik genting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MapPin,
                title: "Geolokasi GPS Presisi",
                desc: "Mengunci posisi koordinat satelit dalam hitungan milidetik dan memperbarui pergerakan secara real-time.",
              },
              {
                icon: Volume2,
                title: "Sirene Akustik & Getaran",
                desc: "Memicu nada sirene frekuensi tinggi dan getaran ritmis di HP untuk menarik perhatian warga sekitar.",
              },
              {
                icon: Wifi,
                title: "Sinkronisasi Cloud Cepat",
                desc: "Data langsung terhubung ke dashboard BiPANTAU relawan dan pengelola darurat kota.",
              },
              {
                icon: PhoneCall,
                title: "Broadcast Kontak Darurat",
                desc: "Otomatis mengirim tautan lokasi langsung kepada keluarga atau pendamping terdaftar.",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Specs Table */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Spesifikasi Arsitektur BiSAFE</h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="grid grid-cols-3 p-4 border-b border-slate-100 font-bold bg-slate-50 text-slate-700">
              <span>Komponen</span>
              <span>Teknologi</span>
              <span>Spesifikasi</span>
            </div>
            <div className="grid grid-cols-3 p-4 border-b border-slate-100 text-slate-600">
              <span className="font-semibold text-slate-800">Positioning Engine</span>
              <span>HTML5 Geolocation + GPS</span>
              <span>Akurasi &lt; 2 meter, Update interval 1.5s</span>
            </div>
            <div className="grid grid-cols-3 p-4 border-b border-slate-100 text-slate-600">
              <span className="font-semibold text-slate-800">Transmission Protocol</span>
              <span>Firestore WebSocket Stream</span>
              <span>Latensi transmisi &lt; 150 ms</span>
            </div>
            <div className="grid grid-cols-3 p-4 border-b border-slate-100 text-slate-600">
              <span className="font-semibold text-slate-800">Audio Alarm Synthesizer</span>
              <span>Web Audio API</span>
              <span>Dual-frequency siren (800Hz / 1200Hz)</span>
            </div>
            <div className="grid grid-cols-3 p-4 text-slate-600">
              <span className="font-semibold text-slate-800">Trigger Methods</span>
              <span>GUI Tap, Voice &quot;TOLONG&quot;, Volume Key</span>
              <span>Tiga jalur aktivasi redundan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-black text-slate-900">
            Coba BiSAFE di Aplikasi Sekarang
          </h2>
          <p className="text-slate-500 text-sm">
            Rasakan langsung kemudahan dan kecepatan aktivasi sistem darurat diBISAlitas.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/demo"
              className="px-8 py-3.5 rounded-2xl bg-rose-600 text-white font-extrabold text-sm hover:bg-rose-700 shadow-md transition-all"
            >
              Buka Demo Aplikasi
            </Link>
            <Link
              href="/fitur"
              className="px-8 py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Lihat Fitur Lainnya
            </Link>
          </div>
        </div>
      </section>

      <FloatingAccessibility />
    </div>
  );
}
