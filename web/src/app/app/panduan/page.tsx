"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight, Check, BookOpen, Hand, ShieldAlert } from "lucide-react";

/* ============================================
   KUMPULAN ANIMASI KUSTOM (SIMULASI)
============================================ */

const LogoAnimation = () => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    className="relative flex items-center justify-center w-full h-full"
  >
    <img src="/logo/logo.png" alt="diBISAlitas" className="w-28 h-28 object-contain drop-shadow-xl" />
  </motion.div>
);

const BiPintarAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center text-sky-500">
    <Hand className="w-20 h-20 opacity-80" />
    <motion.div
      initial={{ width: 100, height: 100, opacity: 0 }}
      animate={{ width: [120, 100, 110], height: [120, 100, 110], opacity: [0, 1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="absolute border-2 border-emerald-400 rounded-lg flex items-start justify-start p-1"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="bg-emerald-400 text-white text-[10px] font-bold px-2 py-0.5 rounded -mt-4 -ml-1"
      >
        Huruf A (98%)
      </motion.div>
    </motion.div>
    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-300 rounded-tl" />
    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-300 rounded-tr" />
    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-300 rounded-bl" />
    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-300 rounded-br" />
  </div>
);

const BiBacaAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center text-purple-500">
    <BookOpen className="w-20 h-20 opacity-80" />
    <motion.div
      animate={{ y: [-40, 40, -40] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      className="absolute w-24 h-0.5 bg-purple-500 shadow-[0_0_8px_2px_rgba(168,85,247,0.5)]"
    />
  </div>
);

const BiSafeAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center text-rose-500">
    <motion.div
      animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      className="absolute w-20 h-20 bg-rose-500 rounded-full"
    />
    <motion.div
      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
      className="absolute w-20 h-20 bg-rose-500 rounded-full"
    />
    <ShieldAlert className="w-16 h-16 relative z-10 drop-shadow-md bg-white rounded-full text-rose-600" />
  </div>
);

/* ============================================
   DATA SLIDE
============================================ */

const ONBOARDING_SLIDES = [
  {
    id: 0,
    title: "Selamat Datang di diBISAlitas",
    description: "Ekosistem Aksesibilitas Cerdas yang memberikan kemandirian penuh tanpa batas untuk setiap orang.",
    color: "bg-[#1B9981]/10",
    icon: <LogoAnimation />,
    visual: "/splashscreen/splashscreen.png"
  },
  {
    id: 1,
    title: "Simulasi BiPINTAR",
    description: "Kecerdasan Buatan (AI) di perangkat Anda akan melacak gerakan tangan dan menerjemahkannya ke teks secara instan.",
    color: "bg-sky-500/10",
    icon: <BiPintarAnimation />,
    visual: "/splashscreen/BiPINTAR.png"
  },
  {
    id: 2,
    title: "Pemindai BiBACA",
    description: "Arahkan kamera ke dokumen tertulis. Sistem akan memindainya dengan akurasi tinggi dan merubahnya menjadi suara yang jernih.",
    color: "bg-purple-500/10",
    icon: <BiBacaAnimation />,
    visual: "/splashscreen/BiBACA.png"
  },
  {
    id: 3,
    title: "Darurat BiSAFE & BiJALAN",
    description: "Tekan tombol darurat untuk memancarkan sinyal ke Cloud, serta dapatkan panduan getaran arah jalan dari BiJALAN.",
    color: "bg-rose-500/10",
    icon: <BiSafeAnimation />,
    visual: "/splashscreen/BiSAFE.png"
  },
];

/* ============================================
   KOMPONEN HALAMAN UTAMA
============================================ */

export default function PanduanPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    // Simpan penanda bahwa user sudah melihat splashscreen ini
    if (typeof window !== 'undefined') {
      localStorage.setItem("hasSeenPanduan", "true");
    }
    router.replace("/app/login");
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Gambar Full Screen Background (Transparan & Blur) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={ONBOARDING_SLIDES[currentSlide].visual} 
            alt=""
            className="w-full h-full object-cover object-center blur-sm"
          />
        </motion.div>
      </AnimatePresence>

      {/* Tombol Lewati (Skip) */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={handleFinish}
          className="text-slate-500 font-semibold text-sm hover:text-[#1B9981] transition-colors"
        >
          Lewati
        </button>
      </div>

      {/* Konten Slide (Framer Motion) */}
      <div className="flex-1 flex flex-col justify-center relative z-10 pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center px-8"
          >
            {/* Area Gambar Visual (Foreground) */}
            <div className={`w-56 h-56 rounded-full flex items-center justify-center mb-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 ${ONBOARDING_SLIDES[currentSlide].color}`}>
              {ONBOARDING_SLIDES[currentSlide].icon}
            </div>
            
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight drop-shadow-sm">
              {ONBOARDING_SLIDES[currentSlide].title}
            </h1>
            
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-sm font-medium">
              {ONBOARDING_SLIDES[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Kontrol Bawah (Dots & Button) */}
      <div className="px-8 pb-12 pt-6 z-10 relative">
        {/* Indikator Titik (Dots) */}
        <div className="flex justify-center gap-2 mb-8">
          {ONBOARDING_SLIDES.map((slide) => (
            <div
              key={slide.id}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentSlide === slide.id 
                  ? "w-10 bg-[#1B9981]" 
                  : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Tombol Utama */}
        <button
          onClick={handleNext}
          className="w-full py-4 bg-[#1B9981] hover:bg-[#168C74] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          {currentSlide === ONBOARDING_SLIDES.length - 1 ? (
            <>
              Mulai Sekarang
              <Check className="w-5 h-5" />
            </>
          ) : (
            <>
              Selanjutnya
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
