"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  MapPin,
  Volume2,
  Wifi,
  PhoneCall,
  CheckCircle2,
  Zap,
  ArrowLeft,
  Users,
  FileClock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";
import InteractiveDeviceMockup from "@/components/InteractiveDeviceMockup";

export default function BiSafeDetailPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-300 selection:bg-red-500/20">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[200px]  bg-red-500/10 dark:bg-red-500/20  blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">


          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Info */}
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" /> Sistem Alarm &amp; Panic Button Darurat
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                BiSAFE: Perlindungan <br className="hidden md:block" />
                <span className="text-red-600 dark:text-red-500">Satu Sentuhan</span> Tanpa Jeda
              </h1>

              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                BiSAFE dirancang sebagai garis pertahanan pertama bagi penyandang disabilitas saat menghadapi kondisi krisis, ancaman fisik, kecelakaan, atau disorientasi spasial di ruang publik.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/demo"
                  className="px-7 py-3.5 rounded-full bg-red-600 text-white font-extrabold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Coba Demo BiSAFE
                </Link>
              </div>
            </div>

            {/* Right: Video Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 flex justify-center relative z-10" 
              style={{ perspective: "1200px" }}
            >
              <div 
                className="relative w-[270px] sm:w-[310px] lg:w-[340px] aspect-[9/18.5] mx-auto bg-slate-200 dark:bg-[#0a0a0a] rounded-[1.75rem] md:rounded-[2.25rem] border-[6px] md:border-[8px] border-slate-300 dark:border-[#1a1a1a] overflow-hidden flex flex-col items-center justify-center group transform-gpu preserve-3d transition-colors duration-300"
                style={{
                  transform: "rotateY(-18deg) rotateX(5deg) rotateZ(2deg)",
                  boxShadow: "20px 30px 60px rgba(0,0,0,0.15), 8px 12px 25px rgba(0,0,0,0.08)",
                  WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  WebkitMaskComposite: "destination-in",
                  maskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  maskComposite: "intersect",
                }}
              >
                <video
                  src="/video/bisafe.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Deep Breakdown */}
      <section className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Bagaimana BiSAFE Melindungi Pengguna?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-4">
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
                  className="bg-white dark:bg-transparent rounded-3xl p-7 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{card.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Screen 1: Halaman Utama Panic Button */}
      <section className="py-16 md:py-24 px-4 sm:px-6 overflow-visible relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center min-h-[60vh]">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1 relative flex items-center justify-center lg:justify-start"
              style={{ perspective: "1200px" }}
            >
              <div className="absolute w-[40%] h-[60%]  bg-red-500/10 dark:bg-red-500/15  blur-[70px] rounded-full top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2" />
              <div 
                className="relative w-[270px] sm:w-[310px] lg:w-[340px] aspect-[9/18.5] mx-auto bg-slate-200 dark:bg-[#0a0a0a] rounded-[1.75rem] md:rounded-[2.25rem] border-[6px] md:border-[8px] border-slate-300 dark:border-[#1a1a1a] overflow-hidden flex flex-col items-center justify-center group transform-gpu preserve-3d transition-colors duration-300"
                style={{
                  transform: "rotateY(18deg) rotateX(5deg) rotateZ(-2deg)",
                  boxShadow: "-20px 30px 60px rgba(0,0,0,0.15), -8px 12px 25px rgba(0,0,0,0.08)",
                  WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  WebkitMaskComposite: "destination-in",
                  maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  maskComposite: "intersect",
                }}
              >
                <span className="text-slate-400 dark:text-slate-600 font-medium text-xs text-center px-4">Screenshot: Halaman Utama</span>
                <img src="/images/bisafe-screen1.jpg" alt="BiSAFE Main Screen" className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                
                {/* Fallback gradient if no image */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-red-500/20 dark:from-[#0a0e17] dark:via-[#111827] dark:to-red-500/30 -z-10" />
                {/* Subtle shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="order-1 lg:order-2 flex flex-col space-y-5 lg:pl-4 justify-center"
            >
              <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
                Fitur utama:
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                Akses Instan Panic Button{" "}
                <em className="font-black italic text-red-600 dark:text-red-500">
                  satu sentuhan di saat genting.
                </em>
              </h2>
              <p className="text-slate-500 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
                Halaman utama didesain dengan kontras visual tinggi dan tombol berukuran masif agar mudah dijangkau dalam keadaan panik. Mengirimkan koordinat presisi dan menyalakan sirene secara bersamaan.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Screen 2: Halaman Tambah Kontak Darurat */}
      <section className="py-16 md:py-24 px-4 sm:px-6 overflow-visible bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-8 items-center min-h-[60vh]">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="flex flex-col space-y-5 lg:pr-4 justify-center"
            >
              <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
                Integrasi keluarga:
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                Kelola Kontak Darurat{" "}
                <em className="font-black italic text-red-600 dark:text-red-500">
                  dengan mudah dan tanpa batas.
                </em>
              </h2>
              <p className="text-slate-500 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
                Tambahkan keluarga atau pendamping yang akan dihubungi oleh sistem saat Anda menekan tombol SOS. Mereka menerima notifikasi prioritas beserta tautan tracking lokasi live.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center lg:justify-end"
              style={{ perspective: "1200px" }}
            >
              <div className="absolute w-[40%] h-[60%]  bg-red-500/10 dark:bg-red-500/15  blur-[70px] rounded-full top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2" />
              <div 
                className="relative w-[270px] sm:w-[310px] lg:w-[340px] aspect-[9/18.5] mx-auto bg-slate-200 dark:bg-[#0a0a0a] rounded-[1.75rem] md:rounded-[2.25rem] border-[6px] md:border-[8px] border-slate-300 dark:border-[#1a1a1a] overflow-hidden flex flex-col items-center justify-center group transform-gpu preserve-3d transition-colors duration-300"
                style={{
                  transform: "rotateY(-18deg) rotateX(5deg) rotateZ(2deg)",
                  boxShadow: "20px 30px 60px rgba(0,0,0,0.15), 8px 12px 25px rgba(0,0,0,0.08)",
                  WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  WebkitMaskComposite: "destination-in",
                  maskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  maskComposite: "intersect",
                }}
              >
                <span className="text-slate-400 dark:text-slate-600 font-medium text-xs text-center px-4">Screenshot: Tambah Kontak Darurat</span>
                <img src="/images/bisafe-screen2.jpg" alt="BiSAFE Emergency Contacts" className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                
                {/* Fallback gradient if no image */}
                <div className="absolute inset-0 bg-gradient-to-bl from-slate-100 via-slate-200 to-red-500/20 dark:from-[#0a0e17] dark:via-[#111827] dark:to-red-500/30 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Screen 3: Riwayat Laporan */}
      <section className="py-16 md:py-24 px-4 sm:px-6 overflow-visible relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center min-h-[60vh]">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1 relative flex items-center justify-center lg:justify-start"
              style={{ perspective: "1200px" }}
            >
              <div className="absolute w-[40%] h-[60%]  bg-red-500/10 dark:bg-red-500/15  blur-[70px] rounded-full top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2" />
              <div 
                className="relative w-[270px] sm:w-[310px] lg:w-[340px] aspect-[9/18.5] mx-auto bg-slate-200 dark:bg-[#0a0a0a] rounded-[1.75rem] md:rounded-[2.25rem] border-[6px] md:border-[8px] border-slate-300 dark:border-[#1a1a1a] overflow-hidden flex flex-col items-center justify-center group transform-gpu preserve-3d transition-colors duration-300"
                style={{
                  transform: "rotateY(18deg) rotateX(5deg) rotateZ(-2deg)",
                  boxShadow: "-20px 30px 60px rgba(0,0,0,0.15), -8px 12px 25px rgba(0,0,0,0.08)",
                  WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  WebkitMaskComposite: "destination-in",
                  maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  maskComposite: "intersect",
                }}
              >
                <span className="text-slate-400 dark:text-slate-600 font-medium text-xs text-center px-4">Screenshot: Riwayat Laporan</span>
                <img src="/images/bisafe-screen3.jpg" alt="BiSAFE History" className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                
                {/* Fallback gradient if no image */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-red-500/20 dark:from-[#0a0e17] dark:via-[#111827] dark:to-red-500/30 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="order-1 lg:order-2 flex flex-col space-y-5 lg:pl-4 justify-center"
            >
              <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
                Pencatatan transparan:
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                Riwayat Sinyal Bahaya{" "}
                <em className="font-black italic text-red-600 dark:text-red-500">
                  terekam secara persisten.
                </em>
              </h2>
              <p className="text-slate-500 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
                Setiap laporan yang dipancarkan dicatat dengan log waktu kejadian dan lokasi untuk bukti pelaporan yang kredibel kepada pihak relawan atau kepolisian.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 text-center relative z-10 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1]">
            Coba BiSAFE di Aplikasi Sekarang
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
            Rasakan langsung kemudahan dan kecepatan aktivasi sistem darurat diBISAlitas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/demo"
              className="px-8 py-4 rounded-full bg-red-600 text-white font-extrabold text-sm hover:bg-red-700 shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all"
            >
              Buka Demo Aplikasi
            </Link>
            <Link
              href="/fitur"
              className="px-8 py-4 rounded-full bg-slate-100 dark:bg-transparent border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
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
