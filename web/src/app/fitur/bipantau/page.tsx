"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart,
  MapPin,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  Zap,
  ArrowLeft,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";
import InteractiveDeviceMockup from "@/components/InteractiveDeviceMockup";

export default function BiPantauDetailPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const sampleIncidents = [
    {
      id: "RNT-101",
      title: "Guiding block rusak & terputus",
      loc: "Depan Halte Tosari, Sudirman",
      type: "Tunanetra",
      severity: "Tinggi",
      status: "Belum Ditangani",
    },
    {
      id: "RNT-102",
      title: "Ramp kursi roda terlalu curam (15°)",
      loc: "JPO Stasiun Juanda",
      type: "Tunadaksa",
      severity: "Kritis",
      status: "Dalam Proses",
    },
    {
      id: "RNT-103",
      title: "Tiang reklame menghalangi trotoar",
      loc: "Jl. Sabang No. 44",
      type: "Tunanetra",
      severity: "Sedang",
      status: "Selesai",
    },
  ];

  const filteredIncidents =
    filterStatus === "all"
      ? sampleIncidents
      : sampleIncidents.filter((i) => i.status === filterStatus);

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-800 selection:bg-[#1B9981]/20">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#1B9981]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/fitur" className="hover:text-slate-700 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Semua Fitur
            </Link>
            <span>/</span>
            <span className="text-[#1B9981] font-bold">BiPANTAU</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B9981]/10 border border-[#1B9981]/20 text-[#1B9981] text-xs font-bold uppercase tracking-wider">
                <BarChart className="w-4 h-4" /> Command Center &amp; Analisis GIS Kota
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                BiPANTAU: Manajemen <br />
                <span className="text-[#1B9981]">Aksesibilitas Kota</span> Terpadu
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                BiPANTAU adalah pusat komando berbasis web bagi pengelola kota, dinas perhubungan, dan komunitas relawan untuk memonitor rintangan jalan, mengaudit fasilitas ramah disabilitas, dan merespons sinyal darurat secara presisi.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/admin/rintangan?demo=true"
                  className="px-7 py-3.5 rounded-2xl bg-[#1B9981] text-white font-extrabold text-sm hover:bg-[#168C74] transition-all shadow-lg shadow-[#1B9981]/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Buka Dashboard BiPANTAU
                </Link>
                <a
                  href="#simulator"
                  className="px-7 py-3.5 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Lihat Demo Interaktif
                </a>
              </div>
            </div>

            {/* Right: Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <InteractiveDeviceMockup activeFeature="bipantau" interactive={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator: Moderation Matrix */}
      <section id="simulator" className="py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase text-[#1B9981] bg-[#1B9981]/10 px-3 py-1 rounded-full">
              Live Interactive Data Feed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Simulasi Moderasi Laporan Rintangan
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Coba filter status di bawah untuk melihat bagaimana pengelola kota mengelompokkan dan menindaklanjuti laporan rintangan aksesibilitas.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Filter Status:</span>
              </div>
              <div className="flex gap-2">
                {[
                  { label: "Semua", val: "all" },
                  { label: "Belum Ditangani", val: "Belum Ditangani" },
                  { label: "Dalam Proses", val: "Dalam Proses" },
                  { label: "Selesai", val: "Selesai" },
                ].map((btn) => (
                  <button
                    key={btn.val}
                    onClick={() => setFilterStatus(btn.val)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === btn.val
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Incidents Table */}
            <div className="space-y-3">
              {filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1B9981]">{inc.id}</span>
                      <span className="font-bold text-slate-900 text-sm">{inc.title}</span>
                    </div>
                    <div className="text-slate-500 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inc.loc}</span>
                      <span>•</span>
                      <span>Target: <strong className="text-slate-700">{inc.type}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                        inc.severity === "Kritis"
                          ? "bg-rose-100 text-rose-700"
                          : inc.severity === "Tinggi"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      Urgensi {inc.severity}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                        inc.status === "Selesai"
                          ? "bg-emerald-100 text-emerald-800"
                          : inc.status === "Dalam Proses"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of BiPANTAU */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900">
              Fitur Unggulan BiPANTAU Command Center
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Solusi data-driven untuk mewujudkan kota ramah disabilitas berstandar global.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: "Pemetaan GIS Berbasis Heatmap",
                desc: "Memvisualisasikan titik-titik rintangan rawan secara geografis di peta Leaflet interaktif.",
              },
              {
                icon: Activity,
                title: "Live Incident Triage & Resolusi",
                desc: "Sistem tiket otomatis untuk menugaskan relawan atau petugas lapangan dalam memperbaiki rintangan.",
              },
              {
                icon: FileSpreadsheet,
                title: "Ekspor Laporan Audit Fasilitas",
                desc: "Generate laporan berkala dalam format CSV dan ringkasan eksekutif untuk pengambil kebijakan.",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1B9981]/10 text-[#1B9981] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 text-center bg-slate-900 text-white rounded-[3rem] mx-4 sm:mx-8 mb-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            Siap Mengoptimalkan Aksesibilitas Kota?
          </h2>
          <p className="text-slate-300 text-sm">
            Buka langsung dasbor monitoring BiPANTAU untuk melihat demonstrasi peta live.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/admin/rintangan?demo=true"
              className="px-8 py-3.5 rounded-2xl bg-[#00D4AA] text-slate-950 font-extrabold text-sm hover:bg-[#00D4AA]/90 shadow-md transition-all"
            >
              Masuk Dashboard Admin
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all"
            >
              Pusat Demo
            </Link>
          </div>
        </div>
      </section>

      <FloatingAccessibility />
    </div>
  );
}
