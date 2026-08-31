"use client";

import React from "react";
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
  CheckCircle2
} from "lucide-react";
import Navbar from "@/components/Navbar";


export default function BiSapaDetailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/60 dark:from-black dark:to-blue-950/20 text-slate-800 dark:text-slate-200 selection:bg-blue-500/20">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 relative overflow-visible">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[200px]  bg-blue-500/10 dark:bg-blue-500/20  blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[60vh]">
            {/* Left: Info */}
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <MessageCircle className="w-4 h-4" /> Asisten Komunikasi Dua Arah
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                BiSAPA: Komunikasi <br />
                <span className="text-blue-600 dark:text-blue-500">Dua Arah Instan</span> Tanpa Batas
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-light">
                BiSAPA memfasilitasi percakapan inklusif antara Teman Tuli (Tunarungu) dan Teman Netra (Tunanetra) maupun masyarakat luas. Teks yang diketik akan diubah menjadi suara untuk didengar, dan suara lawan bicara langsung diterjemahkan menjadi teks untuk dibaca.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/app/bisapa"
                  className="px-8 py-4 rounded-full bg-blue-600 text-white font-extrabold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Buka Kamera BiSAPA
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
                  src="/video/bisapa.mp4"
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

      {/* Screen 1: Mobile UI Screenshot */}
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
                <span className="text-slate-400 dark:text-slate-600 font-medium text-xs text-center px-4">Screenshot: Terjemahan BiSAPA</span>
                <img src="/images/bisapa-screen1.jpg" alt="BiSAPA Translation Screen" className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                
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
                Aksesibilitas Tanpa Batas:
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                Komunikasi 2 Arah <br />
                <em className="font-black italic text-blue-600 dark:text-blue-500">
                  lintas disabilitas.
                </em>
              </h2>
              <p className="text-slate-500 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
                Teman Tuli dapat mengetikkan pesan yang kemudian disuarakan secara keras (Text-to-Speech) agar dipahami oleh Teman Netra. Sebaliknya, saat lawan bicara merespons melalui mikrofon, suara tersebut seketika divisualisasikan sebagai teks di layar (Speech-to-Text). Ini sangat memudahkan komunikasi dengan masyarakat yang tidak mengerti bahasa isyarat sama sekali!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 text-center relative z-10 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1]">
            Hancurkan Batasan Komunikasi
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
            Gunakan BiSAPA sekarang dan mulailah berinteraksi dengan siapa saja, kapan saja tanpa halangan bahasa isyarat.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/app/bisapa"
              className="px-8 py-4 rounded-full bg-blue-600 text-white font-extrabold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all"
            >
              Buka Kamera BiSAPA
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

      
    </div>
  );
}
