"use client";

import React from "react";
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
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Camera,
  Users
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";

export default function BiPantauDetailPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-200 selection:bg-[#1B9981]/20">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-visible">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[200px]  bg-[#1B9981]/10 dark:bg-[#1B9981]/20  blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[60vh]">
            {/* Left: Info */}
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B9981]/10 dark:bg-[#1B9981]/20 border border-[#1B9981]/20 dark:border-[#1B9981]/30 text-[#1B9981] dark:text-[#2DD4BF] text-xs font-bold uppercase tracking-wider">
                <BarChart className="w-4 h-4" /> Command Center &amp; Analisis GIS Kota
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                BiPANTAU: Manajemen <br />
                <span className="text-[#1B9981] dark:text-[#2DD4BF]">Aksesibilitas Kota</span> Terpadu
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-light">
                BiPANTAU adalah pusat komando berbasis web bagi pengelola kota, dinas perhubungan, dan komunitas relawan untuk memonitor rintangan jalan, mengaudit fasilitas ramah disabilitas, dan merespons sinyal darurat secara presisi.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/admin/rintangan?demo=true"
                  className="px-8 py-4 rounded-full bg-[#1B9981] text-white font-extrabold text-sm hover:bg-[#168C74] transition-all shadow-lg shadow-[#1B9981]/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Buka Dashboard BiPANTAU
                </Link>
                <Link
                  href="/demo"
                  className="px-8 py-4 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white font-bold text-sm hover:bg-slate-300 dark:hover:bg-white/20 transition-all border border-transparent dark:border-white/10"
                >
                  Lihat Demo Interaktif
                </Link>
              </div>
            </div>

            {/* Right: Video Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
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
                  src="/video/peta.mp4"
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

      {/* Screen 1: Mobile Map */}
      <section className="py-16 md:py-24 px-4 sm:px-6 overflow-visible relative z-10 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center min-h-[60vh]">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1 relative flex items-center justify-center lg:justify-start"
              style={{ perspective: "1200px" }}
            >
              <div className="absolute w-[40%] h-[60%]  bg-blue-500/10 dark:bg-blue-500/15  blur-[70px] rounded-full top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2" />
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
                <span className="text-slate-400 dark:text-slate-600 font-medium text-xs text-center px-4">Screenshot: Peta Pengguna (Mobile)</span>
                <img src="/images/bipantau-mobile-map.jpg" alt="BiPANTAU Mobile Map" className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-blue-500/20 dark:from-[#0a0e17] dark:via-[#111827] dark:to-blue-500/30 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="order-1 lg:order-2 flex flex-col space-y-5 lg:pl-4 justify-center"
            >
              <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
                Peta aksesibilitas komprehensif:
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                Navigasi Kota <br />
                <em className="font-black italic text-blue-600 dark:text-blue-500">
                  tanpa hambatan tak terduga.
                </em>
              </h2>
              <p className="text-slate-500 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
                BiPANTAU memetakan seluruh fasilitas ramah disabilitas, dari blok pemandu (guiding block), ramp kursi roda, hingga stasiun transportasi inklusif. Terdapat juga peringatan zona rawan dan rintangan fisik secara seketika (real-time).
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Screen 2: Mobile Add Report */}
      <section className="py-16 md:py-24 px-4 sm:px-6 overflow-visible bg-transparent relative z-10 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-8 items-center min-h-[60vh]">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="flex flex-col space-y-5 lg:pr-4 justify-center"
            >
              <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
                Laporan dari masyarakat:
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                Laporkan Rintangan{" "}
                <em className="font-black italic text-rose-600 dark:text-rose-500">
                  dengan bukti foto langsung.
                </em>
              </h2>
              <p className="text-slate-500 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
                Seluruh masyarakat dapat berkontribusi! Temukan guiding block yang terputus atau ramp yang terhalang tiang? Ambil foto, tambahkan deskripsi, dan sistem GIS kami akan secara otomatis menandai koordinat pastinya untuk segera ditangani.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center lg:justify-end"
              style={{ perspective: "1200px" }}
            >
              <div className="absolute w-[40%] h-[60%]  bg-rose-500/10 dark:bg-rose-500/15  blur-[70px] rounded-full top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2" />
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
                <span className="text-slate-400 dark:text-slate-600 font-medium text-xs text-center px-4">Screenshot: Tambah Laporan (Mobile)</span>
                <img src="/images/bipantau-mobile-report.jpg" alt="BiPANTAU Report Screen" className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                
                <div className="absolute inset-0 bg-gradient-to-bl from-slate-100 via-slate-200 to-rose-500/20 dark:from-[#0a0e17] dark:via-[#111827] dark:to-rose-500/30 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Screen 3: Laptop Admin */}
      <section className="py-16 md:py-32 px-4 sm:px-6 overflow-visible relative z-10 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
              Pusat kendali admin:
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
              Tinjauan Makro Kota <br />
              <em className="font-black italic text-[#1B9981] dark:text-[#2DD4BF]">
                pada satu layar dashboard komprehensif.
              </em>
            </h2>
            <p className="text-slate-500 dark:text-white/70 text-sm md:text-base leading-relaxed font-light mx-auto max-w-2xl">
              Untuk pengelola wilayah, dinas sosial, dan admin: BiPANTAU menampilkan Heatmap GIS dari seluruh rintangan dan sinyal darurat dalam satu layar luas. Manajemen data, penugasan perbaikan, dan evaluasi berkala dapat dilakukan dengan jauh lebih transparan.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center relative z-10 w-full"
            style={{ perspective: "1500px" }}
          >
            <div className="absolute w-[80%] h-[80%] bg-[#1B9981]/15 dark:bg-[#1B9981]/20 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            
            {/* Laptop Screen Mockup Frame */}
            <div 
              className="relative w-[95%] sm:w-[90%] md:w-[85%] max-w-5xl aspect-[16/10] bg-slate-200 dark:bg-[#0a0a0a] rounded-xl md:rounded-2xl border-[6px] md:border-[12px] border-slate-300 dark:border-[#1a1a1a] border-b-[24px] md:border-b-[40px] overflow-hidden group transform-gpu preserve-3d"
              style={{
                transform: "rotateX(10deg) translateY(-10px)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.25), 0 10px 30px rgba(0,0,0,0.1)"
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 md:w-16 md:h-3 bg-slate-800 dark:bg-black rounded-b-lg flex items-center justify-center z-20">
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-white/20" />
              </div>
              <span className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-600 font-medium text-xs md:text-sm text-center px-4">
                Screenshot: Dashboard Admin (Laptop)
              </span>
              <img src="/images/bipantau-laptop.jpg" alt="BiPANTAU Admin Dashboard" className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
              
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 via-slate-200 to-[#1B9981]/10 dark:from-[#0a0e17] dark:via-[#111827] dark:to-[#1B9981]/20 -z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 text-center relative z-10 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1]">
            Kelola Aksesibilitas Kota Bersama BiPANTAU
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
            Sistem pengawasan terintegrasi untuk menciptakan lingkungan yang aman bagi semua lapisan masyarakat.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/admin/rintangan?demo=true"
              className="px-8 py-4 rounded-full bg-[#1B9981] text-white font-extrabold text-sm hover:bg-[#168C74] shadow-lg shadow-[#1B9981]/20 hover:shadow-[#1B9981]/40 transition-all"
            >
              Masuk Dashboard Admin
            </Link>
            <Link
              href="/fitur"
              className="px-8 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              Eksplorasi Fitur Lain
            </Link>
          </div>
        </div>
      </section>

      <FloatingAccessibility />
    </div>
  );
}
