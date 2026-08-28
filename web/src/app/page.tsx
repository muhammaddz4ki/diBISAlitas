"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/lib/ThemeContext";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence, Variants, LayoutGroup } from "framer-motion";
import {
  ShieldAlert,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Navigation,
  Eye,
  Ear,
  Accessibility,
  Globe,
  Zap,
  BarChart,
  HeartHandshake,
  Users,
  ArrowRight,
  Smartphone,
  Shield,
  Brain,
  Wifi,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock,
  Play,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingAccessibility from "@/components/FloatingAccessibility";


/* ============================================
   ANIMATION VARIANTS
============================================ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ============================================
   COUNTER HOOK
============================================ */
function useCounter(end: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, startCounting]);
  return count;
}

/* ============================================
   HERO SECTION
============================================ */
function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 flex flex-col items-center justify-start md:justify-center overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">
      {/* Background Glow Elements */}
      <div className="absolute top-[50%] md:top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[900px] md:h-[900px] bg-[#1B9981]/20 dark:bg-[#1B9981]/30 blur-[120px] md:blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-[50%] md:top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[#00D4AA]/30 dark:bg-[#00D4AA]/40 blur-[90px] md:blur-[140px] rounded-full pointer-events-none" />
      
      {/* Giant faint background text */}
      <div className="absolute top-[40%] md:top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03] dark:opacity-[0.05] flex flex-col justify-center items-center z-0">
         <span className="text-[12rem] md:text-[22rem] font-black leading-none tracking-tighter text-[#1B9981] dark:text-[#00D4AA]">diBISA</span>
         <span className="text-[12rem] md:text-[22rem] font-black leading-none tracking-tighter text-[#1B9981] dark:text-[#00D4AA]">litas</span>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center mt-12 md:mt-0">
        {/* Top Logo / Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center justify-center font-bold tracking-[0.3em] text-xs sm:text-sm text-slate-500 dark:text-white/80 uppercase"
        >
          di<span className="text-[#1B9981] dark:text-[#00D4AA] mx-1">BISA</span>litas
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.1] tracking-tight max-w-5xl mx-auto mb-6"
        >
          Aksesibilitas <span className="text-[#1B9981] dark:text-[#00D4AA]">Cerdas</span>, Kemandirian Tanpa Batas.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="text-slate-600 dark:text-white/60 text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-8 leading-relaxed font-normal"
        >
          Satu ekosistem berbasis kecerdasan buatan on-device dan integrasi Cloud untuk menghadirkan kemandirian penuh bagi Tunanetra, Tunarungu, dan Tunadaksa di Indonesia.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6, duration: 0.6 }}
           className="flex flex-wrap items-center justify-center gap-4 mb-4 md:mb-8 relative z-20 pointer-events-auto"
        >
           <Link
             href="/demo"
             className="px-8 py-4 rounded-full bg-[#1B9981] text-white font-bold text-sm hover:bg-[#168C74] transition-colors shadow-[0_0_20px_rgba(27,153,129,0.3)] hover:shadow-[0_0_30px_rgba(27,153,129,0.5)] flex items-center gap-2"
           >
             <Zap className="w-4 h-4 fill-current text-white" />
             Coba Demo Gratis
           </Link>
           <Link
             href="#fitur"
             className="px-8 py-4 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-colors backdrop-blur-md flex items-center gap-2"
           >
             Jelajahi Fitur
           </Link>
        </motion.div>

        {/* Hero Image Group */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
           className="relative w-full max-w-7xl mx-auto flex justify-center mt-[-3rem] md:mt-[-5rem] lg:mt-[-8rem] z-30 pointer-events-none px-2 sm:px-6"
        >
          {/* Faux Fabric effects behind image */}
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-gradient-to-r from-[#1B9981] to-[#00D4AA] blur-[80px] opacity-10 dark:opacity-20 transform -rotate-12 rounded-[100%]" />
          <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-gradient-to-l from-[#1B9981] to-[#00D4AA] blur-[80px] opacity-10 dark:opacity-20 transform rotate-12 rounded-[100%]" />
          
          <motion.img 
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            src="/images/hero-transparent.png" 
            alt="diBISAlitas Users" 
            className="w-full h-auto object-contain max-h-[65vh] md:max-h-[80vh] lg:max-h-[90vh] xl:max-h-none xl:max-w-[115%] drop-shadow-[0_30px_60px_rgba(27,153,129,0.2)] dark:drop-shadow-[0_30px_60px_rgba(27,153,129,0.3)] relative z-10"
          />
        </motion.div>
      </div>
      
      {/* Overlay gradient at bottom to fade into next section and hide image crop */}
      <div className="absolute bottom-[-2px] left-0 w-full h-48 md:h-72 lg:h-[24rem] bg-gradient-to-t from-[#FDFEFE] via-[#FDFEFE]/90 dark:from-[#090e17] dark:via-[#090e17]/90 to-transparent z-30 pointer-events-none transition-colors duration-300" />
    </section>
  );
}

/* ============================================
   ABOUT PROJECT SECTION (NEW)
============================================ */
function AboutProjectSection() {
  const { theme } = useTheme();
  return (
    <section className="relative py-0 overflow-visible bg-transparent text-slate-900 dark:text-white transition-colors duration-300 -mt-10 md:-mt-16 lg:-mt-20 z-40">
      
      {/* Tall soft gradient to seamlessly blend hero into this section */}
      <div className="absolute top-[-6rem] md:top-[-10rem] left-0 w-full h-40 md:h-56 lg:h-72 bg-gradient-to-b from-transparent via-[#FDFEFE]/60 dark:via-[#050505]/60 to-[#FDFEFE] dark:to-[#050505] z-0 pointer-events-none transition-colors duration-300" />
      
      {/* Container */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-4 items-center min-h-[80vh]">
        
        {/* Left: 3D Laptop Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center lg:justify-start"
          style={{ perspective: "1200px" }}
        >
          {/* Faint Glow Behind Laptop */}
          <div className="absolute w-[90%] h-[90%] bg-[#1B9981]/10 dark:bg-[#00D4AA]/15 blur-[100px] rounded-full top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2" />
          
          {/* The 3D Laptop Frame */}
          <div 
            className="relative w-full max-w-[720px]"
            style={{
              transform: "rotateY(18deg) rotateX(5deg) rotateZ(-2deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Laptop Body */}
            <div 
              className="relative w-full aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden border-[5px] md:border-[10px] border-slate-300 dark:border-[#1a1a1a] bg-slate-200 dark:bg-[#0a0a0a] transition-colors duration-300"
              style={{
                boxShadow: theme === 'dark'
                  ? "-30px 40px 80px rgba(0,0,0,0.7), -10px 15px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.03)"
                  : "-20px 30px 60px rgba(0,0,0,0.15), -8px 12px 25px rgba(0,0,0,0.08)",
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0) 100%)",
                WebkitMaskComposite: "destination-in",
                maskImage: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0) 100%)",
                maskComposite: "intersect",
              }}
            >
              {/* Screen Image - Dark version */}
              <img 
                src="/images/laptop-screen-dark.png" 
                alt="Dashboard Preview" 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Screen Image - Light version */}
              <img 
                src="/images/laptop-screen-light.png" 
                alt="Dashboard Preview" 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Fallback gradient when no images */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-[#1B9981]/20 dark:from-[#0a0e17] dark:via-[#111827] dark:to-[#1B9981]/30 -z-10" />
              {/* Subtle shine across screen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>

            {/* Laptop Bottom Bar (keyboard hint) */}
            <div className="w-[60%] mx-auto h-[4px] md:h-[6px] bg-slate-300 dark:bg-[#1a1a1a] rounded-b-xl transition-colors duration-300" />
          </div>
        </motion.div>

        {/* Right: Typography */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="flex flex-col space-y-5 lg:pl-4 justify-center"
        >
          <span className="text-sm md:text-base font-light tracking-normal text-slate-400 dark:text-white/40">
            Tentang proyek:
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.05] tracking-tight">
            diBISAlitas adalah platform AI{" "}
            <em className="font-black italic text-[#1B9981] dark:text-[#00D4AA]">
              yang mengubah hidup penyandang disabilitas.
            </em>
          </h2>
          
          <p className="text-slate-400 dark:text-white/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light">
            Tugas kami adalah merancang platform inklusif yang kuat dan terfokus pada konversi&mdash;sebuah wadah yang merefleksikan energi, memenuhi standar teknologi masa kini, dan membuktikan dampaknya secara nyata.
          </p>
        </motion.div>

      </div>
    </section>
  );
}

/* ============================================
   PILLAR DATA (used by the stacked scroll section)
============================================ */
type Pillar = {
  key: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  target: string;
  href: string;
  gradient: string;
  accent: string;
  video: string;
  hoverBorder: string;
  hoverText: string;
  glass1Title: string;
  glass1Subtitle: string;
  glass2Title: string;
  glass2Subtitle: string;
};

const pillars: Pillar[] = [
  {
    key: "bisafe",
    number: "01",
    title: "BiSAFE",
    tagline: "Panic Button & Geolocation Broadcaster",
    description:
      "Satu tombol darurat yang langsung menyiarkan titik koordinat satelit presisi, membunyikan sirene alarm frekuensi tinggi, dan mengirimkan sinyal ke Command Center relawan.",
    icon: ShieldAlert,
    target: "Tunadaksa & Tunanetra",
    href: "/fitur/bisafe",
    gradient: "from-rose-600 via-rose-500 to-rose-700 dark:from-rose-900 dark:via-rose-800 dark:to-[rgb(60,10,20)]",
    accent: "text-rose-100",
    video: "bisafe.mp4",
    hoverBorder: "hover:border-rose-500/50 dark:hover:border-rose-400/50",
    hoverText: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
    glass1Title: "Respons Secepat Kilat",
    glass1Subtitle: "Satu klik untuk siarkan sinyal darurat dan lokasi presisi ke relawan terdekat.",
    glass2Title: "Ketenangan Pikiran 24/7",
    glass2Subtitle: "Proteksi penuh di setiap langkah untuk kemandirian yang jauh lebih aman.",
  },
  {
    key: "bipantau",
    number: "02",
    title: "BiPANTAU",
    tagline: "Smart City Command Center",
    description:
      "Dasbor pemetaan GIS dan moderasi rintangan kota untuk memonitor jalur ramah disabilitas dan merespons insiden secara real-time.",
    icon: BarChart,
    target: "Pemda & Relawan",
    href: "/fitur/bipantau",
    gradient: "from-[#168C74] via-[#1B9981] to-[#0A6B58] dark:from-[#0B4A3D] dark:via-[#0F6352] dark:to-[#05261F]",
    accent: "text-[#8FEAD4]",
    video: "peta.mp4",
    hoverBorder: "hover:border-[#1B9981]/50 dark:hover:border-[#00D4AA]/50",
    hoverText: "group-hover:text-[#1B9981] dark:group-hover:text-[#00D4AA]",
    glass1Title: "Pantauan Real-time",
    glass1Subtitle: "Kendali penuh atas insiden kota dalam satu dasbor visual yang sangat cerdas.",
    glass2Title: "Kolaborasi Ekstra Cepat",
    glass2Subtitle: "Hubungkan laporan warga langsung dengan relawan dan pemerintah daerah.",
  },
  {
    key: "bisapa",
    number: "03",
    title: "BiSAPA",
    tagline: "Penerjemah Isyarat AI Dua Arah",
    description:
      "Penerjemah bahasa isyarat BISINDO AI dua arah secara real-time dari gestur kamera ke teks dan suara.",
    icon: MessageCircle,
    target: "Tunarungu & Tunanetra",
    href: "/fitur/bisapa",
    gradient: "from-blue-600 via-blue-500 to-blue-700 dark:from-blue-900 dark:via-blue-800 dark:to-blue-950",
    accent: "text-blue-100",
    video: "bisapa.mp4",
    hoverBorder: "hover:border-blue-500/50 dark:hover:border-blue-400/50",
    hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    glass1Title: "Komunikasi Tanpa Batas",
    glass1Subtitle: "Terjemahkan bahasa isyarat ke teks dan suara secara instan lewat AI canggih.",
    glass2Title: "Pahami & Dipahami",
    glass2Subtitle: "Jembatani interaksi antara teman Tuli dan masyarakat umum dengan sangat mulus.",
  },
  {
    key: "bibaca",
    number: "04",
    title: "BiBACA",
    tagline: "Smart OCR ke Audio",
    description:
      "Smart OCR yang memindai buku, papan petunjuk, dan dokumen cetak menjadi audio Bahasa Indonesia jernih.",
    icon: BookOpen,
    target: "Tunanetra & Disleksia",
    href: "/fitur/bibaca",
    gradient: "from-purple-700 via-purple-600 to-purple-800 dark:from-purple-900 dark:via-purple-800 dark:to-[rgb(35,10,50)]",
    accent: "text-purple-100",
    video: "bibaca.mp4",
    hoverBorder: "hover:border-purple-500/50 dark:hover:border-purple-400/50",
    hoverText: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
    glass1Title: "Dunia dalam Suara",
    glass1Subtitle: "Ubah buku, dokumen, dan papan teks jalanan menjadi audio jernih seketika.",
    glass2Title: "Akses Informasi Bebas",
    glass2Subtitle: "Teknologi OCR brilian yang membuka lebar jendela literasi untuk Tunanetra.",
  },
  {
    key: "bipintar",
    number: "05",
    title: "BiPINTAR",
    tagline: "Gamifikasi Belajar Bahasa Isyarat",
    description:
      "Platform gamifikasi belajar bahasa isyarat BISINDO dan Isyarat Hijaiyah dengan kuis dan lencana prestasi.",
    icon: GraduationCap,
    target: "Pelajar & Komunitas",
    href: "/fitur/bipintar",
    gradient: "from-amber-500 via-orange-500 to-orange-600 dark:from-amber-700 dark:via-orange-700 dark:to-orange-950",
    accent: "text-orange-100",
    video: "bipintar.mp4",
    hoverBorder: "hover:border-orange-500/50 dark:hover:border-orange-400/50",
    hoverText: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
    glass1Title: "Belajar Sambil Bermain",
    glass1Subtitle: "Kuasai bahasa isyarat lewat gamifikasi level dan kuis yang sangat interaktif.",
    glass2Title: "Raih Prestasimu",
    glass2Subtitle: "Kumpulkan lencana dan pamerkan kemajuan belajarmu dari pemula hingga mahir.",
  },
  {
    key: "bijalan",
    number: "06",
    title: "BiJALAN",
    tagline: "Spatial Vision & Haptic Guidance",
    description:
      "Mata kedua Tunanetra saat berjalan di trotoar. Mendeteksi tiang, lubang, tangga, dan kendaraan secara visual lalu memberikan umpan balik getaran haptic dan suara terarah.",
    icon: Navigation,
    target: "Tunanetra & Pejalan Kaki",
    href: "/fitur/bijalan",
    gradient: "from-sky-700 via-sky-600 to-sky-800 dark:from-sky-900 dark:via-sky-800 dark:to-[#081e36]",
    accent: "text-sky-100",
    video: "bijalan.mp4",
    hoverBorder: "hover:border-sky-500/50 dark:hover:border-sky-400/50",
    hoverText: "group-hover:text-sky-600 dark:group-hover:text-sky-400",
    glass1Title: "Navigasi Lebih Cerdas",
    glass1Subtitle: "Deteksi rintangan di depanmu dengan asisten AI dan panduan suara akurat.",
    glass2Title: "Langkah Lebih Mantap",
    glass2Subtitle: "Jelajahi rute pejalan kaki dengan pemetaan jalan yang ramah dan aman.",
  },
];

/* ============================================
   BENTO FEATURES SECTION (single-page showcase)
============================================ */
function BentoFeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const activePillar = pillars[activeIndex];
  const ActiveIcon = activePillar.icon;

  // Bulletproof step sizes based on Tailwind classes
  // Desktop: button w-[130px] + gap-3 (12px) = 142px step
  const desktopStep = 142;
  // Mobile: button min-h-[100px] + gap-2 (8px) = 108px step
  const mobileStep = 108;

  // Calculate centered targets based on average container sizes
  // Desktop avg container width ~600px -> center offset ~229px
  const targetX = -activeIndex * desktopStep + 229;
  const clampedX = Math.min(0, targetX);

  // Mobile avg container height ~300px -> center offset ~96px
  const targetY = -activeIndex * mobileStep + 96;
  const clampedY = Math.min(0, targetY);

  // Framer motion drag end handlers for manual swiping
  const handleDragEndDesktop = (e: any, info: any) => {
    if (info.offset.x < -50 || info.velocity.x < -500) {
      setActiveIndex(Math.min(activeIndex + 1, pillars.length - 1));
    } else if (info.offset.x > 50 || info.velocity.x > 500) {
      setActiveIndex(Math.max(activeIndex - 1, 0));
    }
  };

  const handleDragEndMobile = (e: any, info: any) => {
    if (info.offset.y < -50 || info.velocity.y < -500) {
      setActiveIndex(Math.min(activeIndex + 1, pillars.length - 1));
    } else if (info.offset.y > 50 || info.velocity.y > 500) {
      setActiveIndex(Math.max(activeIndex - 1, 0));
    }
  };

  // Get 2 "info" pillars for the glass cards (next 2 after active)
  const glass1 = pillars[(activeIndex + 1) % pillars.length];
  const glass2 = pillars[(activeIndex + 2) % pillars.length];

  return (
    <section id="fitur" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1B9981]/10 text-[#1B9981] dark:text-[#00D4AA] font-bold text-xs uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> 6 Pilar Ekosistem Cerdas
          </span>
        </motion.div>

        {/* === MAIN BENTO GRID === */}
        <LayoutGroup>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-8 lg:gap-10">

          {/* ──── MOBILE TOP ROW: Big Card + Vertical Selector ──── */}
          <div className="flex flex-row gap-2 sm:gap-4 w-full h-[280px] sm:h-[340px] lg:h-auto">
            
            {/* ──── LEFT: Large Gradient Card ──── */}
            <div className="relative flex-1 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)] h-full lg:min-h-[480px]">
            {/* Shared layout gradient background — slides from small card */}
            <motion.div
              layoutId="pillarGradient"
              className={`absolute inset-0 bg-gradient-to-br ${activePillar.gradient}`}
              transition={{ type: "spring", stiffness: 200, damping: 28, mass: 0.8 }}
            />

            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full pointer-events-none" />

            {/* Label top-left */}
            <div className="absolute top-5 left-5 md:top-7 md:left-7 z-20">
              <span className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] ${activePillar.accent}`}>
                Pilar {activePillar.number} / 06
              </span>
            </div>

            {/* 3D Phone and Glass Cards Container */}
            <div className="absolute inset-0 z-10 flex flex-row items-center justify-between gap-2 sm:gap-6 px-3 pr-4 sm:px-8 md:px-12">
              
              {/* 3D Tilted Phone Video Mockup */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePillar.key + "-video"}
                  initial={{ opacity: 0, x: -30, rotateY: 25, rotateX: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, rotateY: 12, rotateX: 4, scale: 1 }}
                  exit={{ opacity: 0, x: -20, rotateY: -10, rotateX: 15, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="relative shrink-0 w-[135px] h-[310px] sm:w-[200px] sm:h-[450px] md:w-[250px] md:h-[520px] lg:w-[240px] lg:h-[490px] rounded-[1rem] sm:rounded-[1.75rem] bg-black border-[4px] md:border-[10px] border-[#1f2022] shadow-[25px_25px_50px_rgba(0,0,0,0.5),-10px_-10px_30px_rgba(255,255,255,0.1)_inset,0_0_0_1px_rgba(255,255,255,0.15)] overflow-hidden ring-1 ring-black/50 translate-y-16 sm:translate-y-32 md:translate-y-36 lg:translate-y-32 -translate-x-1 sm:translate-x-0"
                  style={{ transformPerspective: 1200 }}
                >
                  {/* Screen Glare Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.25] pointer-events-none z-30 mix-blend-overlay" />

                  {/* iPhone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[12px] md:h-[24px] bg-[#1f2022] rounded-b-xl md:rounded-b-[18px] z-20 flex justify-center items-center">
                    <div className="w-[30%] h-[2px] md:h-[4px] bg-black/50 rounded-full mt-1" />
                  </div>
                  
                  <video
                    key={activePillar.video}
                    src={`/video/${activePillar.video}`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-[1.2rem] md:rounded-[2rem]"
                  />
                  
                  {/* Floating active icon on top of the phone */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="absolute -right-2 sm:-right-3 md:-right-6 bottom-4 md:bottom-10 w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center z-30"
                  >
                    <ActiveIcon className="w-4 h-4 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* 2 Glass Cards stacked */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePillar.key + "-glass"}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  className="relative flex-1 flex flex-col gap-1.5 sm:gap-4 max-w-[110px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[260px]"
                >
                  {/* Glass card 1 */}
                  <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-6 flex flex-col justify-center">
                    <h4 className="text-white font-black text-[10px] sm:text-[13px] md:text-xl lg:text-2xl leading-tight line-clamp-2">{activePillar.glass1Title}</h4>
                    <p className="text-white/70 text-[8px] sm:text-[9px] md:text-[13px] leading-relaxed mt-1 md:mt-2 line-clamp-3 md:line-clamp-4">
                      {activePillar.glass1Subtitle}
                    </p>
                  </div>

                  {/* Glass card 2 */}
                  <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-6 flex flex-col justify-center">
                    <h4 className="text-white font-black text-[10px] sm:text-[13px] md:text-xl lg:text-2xl leading-tight line-clamp-2">{activePillar.glass2Title}</h4>
                    <p className="text-white/70 text-[8px] sm:text-[9px] md:text-[13px] leading-relaxed mt-1 md:mt-2 line-clamp-3 md:line-clamp-4">
                      {activePillar.glass2Subtitle}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ──── MOBILE VERTICAL SELECTOR (< LG) ──── */}
          <div className="flex lg:hidden flex-col w-[110px] sm:w-[130px] shrink-0 overflow-hidden pb-4 relative">
            <motion.div 
              ref={mobileTrackRef}
              className="flex flex-col gap-2 cursor-grab active:cursor-grabbing w-full"
              drag="y"
              dragConstraints={{ top: -mobileStep * pillars.length, bottom: 0 }}
              onDragEnd={handleDragEndMobile}
              animate={{ y: clampedY }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {pillars.map((p, i) => {
                const PIcon = p.icon;
                const isActive = i === activeIndex;
                return (
                  <button
                    key={p.key + "-mobile"}
                    onClick={() => setActiveIndex(i)}
                    className={`relative flex-shrink-0 min-h-[90px] sm:min-h-[100px] w-full rounded-xl transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col items-center justify-center gap-2 ${
                      isActive
                        ? `bg-gradient-to-br ${p.gradient} shadow-lg scale-[1.02] z-10 ring-1 ring-white/30`
                        : `bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] ${p.hoverBorder}`
                    }`}
                  >
                    <PIcon
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${isActive ? "text-white" : `text-slate-400 dark:text-white/40 ${p.hoverText}`}`}
                      strokeWidth={1.5}
                    />
                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide leading-tight ${isActive ? "text-white/90" : "text-slate-500 dark:text-white/40"} text-center px-2 w-full break-words`}>
                      {p.title}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* ──── RIGHT COLUMN ──── */}
          <div className="flex flex-col gap-4 md:gap-5 h-full">

            {/* RIGHT TOP: Title + Description */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.key + "-desc"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4 md:space-y-6 pt-1"
              >
                <h3 className="text-3xl sm:text-4xl md:text-[2.8rem] font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white line-clamp-3">
                  {activePillar.title}
                  <br />
                  <em className={`font-black italic bg-clip-text text-transparent bg-gradient-to-r ${activePillar.gradient}`}>
                    {activePillar.tagline}
                  </em>
                </h3>

                <p className="text-slate-500 dark:text-white/60 text-xs md:text-sm leading-relaxed max-w-sm line-clamp-3">
                  {activePillar.description}
                </p>

                <Link
                  href={activePillar.href}
                  className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm group hover:text-[#1B9981] dark:hover:text-[#00D4AA] transition-colors"
                >
                  Lihat Detail
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* RIGHT BOTTOM: DESKTOP HORIZONTAL SELECTOR (>= LG) */}
            <div className="hidden lg:flex relative overflow-hidden mt-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              <motion.div 
                ref={desktopTrackRef}
                className="flex gap-2 md:gap-3 min-w-max cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ right: 0, left: -desktopStep * pillars.length }}
                onDragEnd={handleDragEndDesktop}
                animate={{ x: clampedX }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {pillars.map((p, i) => {
                  const PIcon = p.icon;
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={p.key}
                      onClick={() => setActiveIndex(i)}
                      className={`relative flex-shrink-0 w-[110px] md:w-[130px] aspect-square rounded-xl md:rounded-2xl transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col items-center justify-center gap-1.5 ${
                        isActive
                          ? `bg-gradient-to-br ${p.gradient} shadow-lg scale-105`
                          : `bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] ${p.hoverBorder}`
                      }`}
                    >
                      <PIcon
                        className={`w-6 h-6 md:w-8 md:h-8 transition-colors ${isActive ? "text-white" : `text-slate-400 dark:text-white/40 ${p.hoverText}`}`}
                        strokeWidth={1.5}
                      />
                      <span className={`text-xs md:text-sm font-bold uppercase tracking-wider mt-1 ${isActive ? "text-white/90" : "text-slate-500 dark:text-white/40"}`}>
                        {p.title}
                      </span>
                      
                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </div>

          </div>
        </div>
        </LayoutGroup>
      </div>
    </section>
  );
}

/* ============================================
   CTA / ROTATING TEXT SECTION
============================================ */
function CTASection() {
  const text = "riset pengujian • riset pengujian • ";
  const characters = text.split("");

  return (
    <section className="relative w-full min-h-[70vh] md:min-h-screen bg-black overflow-hidden flex items-center justify-center py-20 z-40">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-[#1B9981]/20 blur-[100px] md:blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-[#00D4AA]/20 blur-[100px] md:blur-[150px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* 3D Scene */}
      <div 
        className="relative w-full max-w-4xl aspect-[4/3] md:aspect-square flex items-center justify-center z-10"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      >
        {/* Central Object (Static, facing front) */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: "translateZ(0)", transformStyle: "preserve-3d" }}
        >
           {/* Fallback glow if image is missing */}
           <div className="absolute w-40 h-40 md:w-80 md:h-80 bg-[#00D4AA]/10 blur-3xl rounded-full" />
           <img 
             src="/images/placeholder-hand.png" 
             alt="Hand Placeholder" 
             className="w-56 sm:w-72 md:w-[28rem] h-auto object-contain drop-shadow-[0_0_40px_rgba(0,212,170,0.3)] -translate-y-4 md:-translate-y-10"
             style={{
               WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)',
               maskImage: 'linear-gradient(to top, transparent 0%, black 20%)'
             }}
             onError={(e) => {
               e.currentTarget.style.display = 'none';
             }}
           />
        </div>

        {/* Tilted Wrapper for the Ring */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: "rotateZ(-15deg) rotateX(15deg)", transformStyle: "preserve-3d" }}
        >
          {/* Rotating 3D Text Ring */}
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {characters.map((char, i) => (
              <span
                key={i}
                className="absolute text-5xl sm:text-6xl md:text-[5.5rem] font-black text-white lowercase select-none tracking-tight"
                style={{
                  transform: `rotateY(${i * (360 / characters.length)}deg) translateZ(clamp(160px, 35vw, 350px))`,
                  textShadow: "0 0 15px rgba(0, 212, 170, 0.9), 0 0 40px rgba(0, 212, 170, 0.4)",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   STATS SECTION (Asymmetrical Bento)
============================================ */
/* ============================================
   STATS SECTION (Asymmetrical Bento)
============================================ */
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stat1 = useCounter(22, 2000, isInView);
  const stat2 = useCounter(6, 1500, isInView);
  const stat3 = useCounter(99, 2000, isInView);
  const stat4 = useCounter(2, 1500, isInView);
  const stat5 = useCounter(24, 2000, isInView);
  const stat6 = useCounter(100, 2000, isInView);

  return (
    <section id="dampak" className="py-24 md:py-40 bg-[#050505] text-white relative overflow-hidden z-20">
      
      {/* Subtle background glow behind the grid */}
      <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-[#1B9981]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-[#00D4AA]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-6 relative z-10" ref={ref}>
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-32 relative">
          {/* Top Left Logo */}
          <div className="absolute -top-10 left-0 md:-top-16 md:left-0 text-xs font-black tracking-widest uppercase text-white/50">
            di<span className="text-[#00D4AA]">BISA</span>litas
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex-1"
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
              dampak<br />nyata
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex-1 md:text-right mt-6 md:mt-0"
          >
            <p className="text-lg md:text-2xl font-medium leading-tight max-w-xs md:ml-auto text-white/80">
              <span className="text-[#00D4AA] font-light mr-1">/</span>kesiapan teknologi nyata untuk indonesia inklusif
            </p>
          </motion.div>
        </div>

        {/* 6-CARD ASYMMETRICAL GRID */}
        {/* MOBILE: CSS Grid (Flattened via 'contents') | DESKTOP: Staggered Flex Columns */}
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-row justify-center items-start md:gap-[24px] w-full relative">
          
          {/* COLUMN 1 */}
          <div className="contents md:flex md:flex-col w-full md:w-1/3 md:pt-[calc(50%+12px)] relative z-20">
             {/* Card 03: Square Gradient */}
             <div className="relative w-full pb-[100%] group order-2 md:order-none">
               <motion.div 
                 variants={fadeUp}
                 initial="hidden"
                 animate={isInView ? "visible" : "hidden"}
                 custom={2}
                 className="absolute inset-0 bg-gradient-to-br from-[#1B9981] via-[#168C74] to-[#0A6B58] rounded-[2rem] p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-[0_0_50px_-12px_rgba(27,153,129,0.5)]"
               >
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50 mix-blend-overlay pointer-events-none" />
                  
                  <h3 className="text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-light leading-none tracking-tight text-white relative z-10">{stat3}%</h3>
                  <div className="relative z-10 w-full">
                    <h4 className="text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-bold leading-[1.1] text-white">
                      Akurasi Deteksi BISINDO
                    </h4>
                  </div>
               </motion.div>
             </div>
          </div>

          {/* COLUMN 2 */}
          <div className="contents md:flex md:flex-col md:gap-[24px] w-full md:w-1/3 relative z-30">
             {/* Card 01: Square White */}
             <div className="relative w-full pb-[100%] order-1 md:order-none">
               <motion.div 
                 variants={fadeUp}
                 initial="hidden"
                 animate={isInView ? "visible" : "hidden"}
                 custom={0}
                 className="absolute inset-0 bg-white rounded-[2rem] p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl"
               >
                  <h3 className="text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-light leading-none tracking-tight text-[#1B9981]">{stat1}+</h3>
                  <div className="relative z-10 w-full">
                    <h4 className="text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-bold leading-[1.1] text-black">
                      Juta Penyandang Disabilitas
                    </h4>
                  </div>
               </motion.div>
             </div>

             {/* Card 04: Square Black Outline */}
             <div className="relative w-full pb-[100%] order-4 md:order-none">
               <motion.div 
                 variants={fadeUp}
                 initial="hidden"
                 animate={isInView ? "visible" : "hidden"}
                 custom={3}
                 className="absolute inset-0 bg-[#050505] border border-[#1B9981]/50 rounded-[2rem] p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-xl"
               >
                  <h3 className="text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-light leading-none tracking-tight text-[#1B9981]">&lt;{stat4}s</h3>
                  <div className="relative z-10 w-full">
                    <h4 className="text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-bold leading-[1.1] text-white">
                      Latensi Darurat SOS
                    </h4>
                  </div>
               </motion.div>
             </div>

             {/* Card 05: Square White */}
             <div className="relative w-full pb-[100%] order-5 md:order-none">
               <motion.div 
                 variants={fadeUp}
                 initial="hidden"
                 animate={isInView ? "visible" : "hidden"}
                 custom={4}
                 className="absolute inset-0 bg-white rounded-[2rem] p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl"
               >
                  <h3 className="text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-light leading-none tracking-tight text-[#1B9981]">{stat5}/7</h3>
                  <div className="relative z-10 w-full">
                    <h4 className="text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-bold leading-[1.1] text-black">
                      Pantauan Relawan Siaga
                    </h4>
                  </div>
               </motion.div>
             </div>
          </div>

          {/* COLUMN 3 */}
          <div className="contents md:flex md:flex-col w-full md:w-1/3 relative z-10">
             
             {/* Card 02: Wide Gradient */}
             {/* Mobile: col-span-2 and pb-[50%] creates a wide rectangle spanning both grid columns */}
             {/* Desktop: pb-[100%] forces square height, but absolute w-[145%] creates the right overflow */}
             <div className="relative w-full pb-[50%] md:pb-[100%] col-span-2 md:col-span-1 order-3 md:order-none">
               <motion.div 
                 variants={fadeUp}
                 initial="hidden"
                 animate={isInView ? "visible" : "hidden"}
                 custom={1}
                 className="absolute top-0 left-0 w-full md:w-[145%] h-full bg-gradient-to-br from-[#1B9981] via-[#168C74] to-[#0A6B58] rounded-[2rem] p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-[0_0_50px_-12px_rgba(27,153,129,0.5)] z-20"
               >
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50 mix-blend-overlay pointer-events-none" />
                  
                  <h3 className="text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-light leading-none tracking-tight text-white relative z-10">{stat2}</h3>
                  
                  <div className="relative z-10 w-full h-full flex flex-col justify-end">
                    {/* Paragraph positioned Top-Right */}
                    <p className="absolute top-0 right-0 max-w-[55%] md:max-w-[45%] text-[10px] sm:text-xs lg:text-sm text-right font-medium leading-relaxed opacity-90 text-white mt-1">
                      Menghadirkan solusi hulu ke hilir untuk penyandang disabilitas Tunanetra, Tunarungu, dan Tunadaksa di Indonesia.
                    </p>
                    <h4 className="text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-bold leading-[1.1] text-white md:max-w-[80%]">
                      Pilar Cerdas Terintegrasi
                    </h4>
                  </div>
               </motion.div>
             </div>

             {/* Card 06: Square Dark */}
             {/* Mobile: no margin-top. Desktop: mt-[calc(50%+12px)] pushes it down perfectly */}
             <div className="relative w-full pb-[100%] mt-0 md:mt-[calc(50%+12px)] order-6 md:order-none">
               <motion.div 
                 variants={fadeUp}
                 initial="hidden"
                 animate={isInView ? "visible" : "hidden"}
                 custom={5}
                 className="absolute inset-0 bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-xl"
               >
                  <h3 className="text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-light leading-none tracking-tight text-[#1B9981]">{stat6}%</h3>
                  <div className="relative z-10 w-full">
                    <h4 className="text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-bold leading-[1.1] text-white">
                      Kemandirian Tanpa Batas
                    </h4>
                  </div>
               </motion.div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ============================================
   IMPACT SECTION
============================================ */
function ImpactSection() {
  return (
    <section id="dampak" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs font-bold uppercase text-[#1B9981] dark:text-[#00D4AA] bg-[#1B9981]/10 dark:bg-[#1B9981]/20 px-3.5 py-1.5 rounded-full">
            Dampak Sosial &amp; Inklusivitas
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Didesain Khusus Bersama Komunitas
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Kami mengembangkan fitur dengan mendengarkan langsung pengalaman dan tantangan nyata penyandang disabilitas di lapangan.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Tunanetra & Low Vision",
              icon: Eye,
              color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60",
              items: [
                "Navigasi trotoar aman dengan radar deteksi rintangan spasial BiJALAN",
                "Akses baca dokumen cetak dan surat kabar mandiri lewat suara BiBACA",
              ],
            },
            {
              title: "Tunarungu & Wicara",
              icon: Ear,
              color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60",
              items: [
                "Percakapan dua arah langsung dengan penerjemah suara-ke-teks BiSAPA",
                "Edukasi bahasa isyarat BISINDO interaktif bersama BiPINTAR",
              ],
            },
            {
              title: "Tunadaksa & Pengguna Kursi Roda",
              icon: Accessibility,
              color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60",
              items: [
                "Perlindungan darurat satu sentuhan dengan pemancar lokasi GPS BiSAFE",
                "Pemetaan jalur ramah kursi roda dan rintangan fasilitas di BiPANTAU",
              ],
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="bg-white dark:bg-[#0F172A] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg dark:hover:border-slate-700 transition-all space-y-6"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center border border-transparent dark:border-white/5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{card.title}</h3>
                </div>

                <ul className="space-y-3">
                  {card.items.map((it, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#1B9981] dark:text-[#00D4AA] shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER
============================================ */
function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/logo.png" alt="diBISAlitas" className="w-8 h-8 object-contain" />
            <span className="text-lg font-black text-white">
              di<span className="text-[#1B9981]">BISA</span>litas
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Ekosistem Aksesibilitas Cerdas Berbasis AI untuk Kesetaraan dan Kemandirian Disabilitas di Indonesia.
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <div className="font-bold text-white uppercase tracking-wider mb-2">Fitur Unggulan</div>
          <div><Link href="/fitur/bisafe" className="hover:text-white">BiSAFE (Darurat SOS)</Link></div>
          <div><Link href="/fitur/bipantau" className="hover:text-white">BiPANTAU (Command Center)</Link></div>
          <div><Link href="/fitur/bisapa" className="hover:text-white">BiSAPA (Isyarat AI)</Link></div>
          <div><Link href="/fitur/bibaca" className="hover:text-white">BiBACA (Smart OCR)</Link></div>
          <div><Link href="/fitur/bipintar" className="hover:text-white">BiPINTAR (E-Learning)</Link></div>
          <div><Link href="/fitur/bijalan" className="hover:text-white">BiJALAN (Navigasi Spasial)</Link></div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="font-bold text-white uppercase tracking-wider mb-2">Akses Cepat</div>
          <div><Link href="/demo" className="hover:text-white">Demo Aplikasi (Tanpa Login)</Link></div>
          <div><Link href="/admin/rintangan" className="hover:text-white">Dashboard BiPANTAU</Link></div>
          <div><Link href="/fitur" className="hover:text-white">Pusat Fitur</Link></div>
          <div><Link href="/app/login" className="hover:text-white">Masuk / Daftar Akun</Link></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-slate-900 text-center text-xs text-slate-600">
        Hak Cipta &copy; {new Date().getFullYear()} diBISAlitas Platform. Seluruh Hak Dilindungi.
      </div>
    </footer>
  );
}

/* ============================================
   SPLASH SCREEN (INTRO ANIMATION)
============================================ */
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onCompleteRef.current()}
      className="fixed inset-0 z-[99999] bg-[#0a0f1a] flex items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      {/* Ambient glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(27,153,129,0.6) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid subtle bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(27,153,129,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Main Logo Text */}
        <div className="flex items-center justify-center gap-0 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          {/* "di" */}
          <motion.span
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-white"
          >
            di
          </motion.span>

          {/* Bracket + BISA group */}
          <div className="relative mx-4 sm:mx-6 flex items-center justify-center">
            <span className="text-[#1B9981] font-light text-4xl sm:text-5xl md:text-6xl">[</span>
            <span className="text-[#1B9981] font-black px-2 text-4xl sm:text-5xl md:text-6xl">BISA</span>
            <span className="text-[#1B9981] font-light text-4xl sm:text-5xl md:text-6xl">]</span>

            {/* Scanner line */}
            <motion.div
              initial={{ left: "0%", opacity: 0 }}
              animate={{
                left: ["0%", "100%", "0%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                delay: 0.2,
                duration: 1.4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute top-0 bottom-0 w-[3px] bg-[#00D4AA] shadow-[0_0_16px_4px_rgba(0,212,170,0.8)] z-20"
            />
          </div>

          {/* "litas" */}
          <motion.span
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-white"
          >
            litas
          </motion.span>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-[#00D4AA] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-8"
        >
          Ekosistem Aksesibilitas Cerdas
        </motion.p>

        {/* Progress bar */}
        <div className="w-52 sm:w-64 h-[3px] bg-white/15 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #1B9981, #00D4AA, #38BDF8)",
            }}
          />
        </div>

        {/* Loading text */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-slate-200 text-xs sm:text-sm font-semibold tracking-wider animate-pulse"
        >
          Mempersiapkan Sistem...
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ============================================
   MAIN LANDING PAGE EXPORT
============================================ */
export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
    <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#FDFEFE] dark:bg-[#050505] text-slate-800 dark:text-slate-100 selection:bg-[#1B9981]/20 transition-colors duration-300">
        <Navbar />
        <HeroSection />
        <AboutProjectSection />
        <BentoFeaturesSection />
        <CTASection />
        <StatsSection />
        <ImpactSection />
        <Footer />
        <FloatingAccessibility />
      </div>
    </>
  );
}