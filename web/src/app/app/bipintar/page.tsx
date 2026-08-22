"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { BookOpen, PlayCircle, Clock, Camera, Sparkles, ChevronRight, Trophy, GraduationCap, BarChart3, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnailUrl?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

export default function BiPintarPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "bipintar_courses"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Course[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Course);
      });
      setCourses(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-full bg-white selection:bg-[#1B9981]/20 flex flex-col pb-6">

      {/* Header — Minimal White */}
      <div className="px-6 pt-14 pb-5 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#00B894]/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-[#00B894]" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-widest">diBISAlitas</p>
            <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-tight">BiPINTAR</h1>
            <p className="text-slate-400 text-[12px] leading-snug line-clamp-2 max-w-[240px] mt-0.5">
              Akses modul interaktif dan kelas keahlian untuk tingkatkan kompetensimu.
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 relative z-20 flex-1 space-y-8">

        {/* SEKSI 1: MODUL INTERAKTIF AI (STATIS) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3.5 px-1">
            <Sparkles className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
            <h2 className="font-extrabold text-slate-800 text-[17px] tracking-tight">Modul Interaktif AI</h2>
          </div>

          <div className="flex flex-col gap-3.5">
            <Link href="/app/bipintar/hijaiyah" className="block group -webkit-tap-highlight-color-transparent outline-none">
              <div className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden relative">

                <div className="w-14 h-14 bg-[#1B9981]/15 rounded-[18px] flex items-center justify-center shrink-0">
                  <Camera className="w-6 h-6 text-[#1B9981]" strokeWidth={2.5} />
                </div>

                <div className="flex-1 py-0.5">
                  <h3 className="font-bold text-slate-800 text-[15px] leading-snug mb-1 group-active:text-slate-600 transition-colors">
                    Edukasi Isyarat Hijaiyah
                  </h3>
                  <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2">
                    Deteksi dan praktik isyarat abjad Arab real-time.
                  </p>
                </div>

                <div className="flex items-center justify-center pr-1">
                  <ChevronRight className="w-5 h-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </div>
              </div>
            </Link>

            <Link href="/app/bipintar/bisindo" className="block group -webkit-tap-highlight-color-transparent outline-none">
              <div className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden relative">

                <div className="w-14 h-14 bg-[#0984E3]/15 rounded-[18px] flex items-center justify-center shrink-0">
                  <Camera className="w-6 h-6 text-[#0984E3]" strokeWidth={2.5} />
                </div>

                <div className="flex-1 py-0.5">
                  <h3 className="font-bold text-slate-800 text-[15px] leading-snug mb-1 group-active:text-slate-600 transition-colors">
                    Edukasi Isyarat BISINDO
                  </h3>
                  <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2">
                    Deteksi dan praktik isyarat abjad umum dengan AI.
                  </p>
                </div>

                <div className="flex items-center justify-center pr-1">
                  <ChevronRight className="w-5 h-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </div>
              </div>
            </Link>

            <button onClick={() => setShowQuizModal(true)} className="block w-full text-left group -webkit-tap-highlight-color-transparent outline-none">
              <div className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all duration-300 ease-out">

                <div className="w-14 h-14 bg-amber-500/15 rounded-[18px] flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-amber-500" strokeWidth={2.5} />
                </div>

                <div className="flex-1 py-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 text-[15px] leading-snug">
                      Tantangan Isyarat
                    </h3>
                    <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Baru</span>
                  </div>
                  <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2">
                    Uji hafalanmu: peragakan huruf Hijaiyah atau BISINDO, kumpulkan skor, dan naik papan peringkat.
                  </p>
                </div>

                <div className="flex items-center justify-center pr-1">
                  <ChevronRight className="w-5 h-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </div>
              </div>
            </button>

            <Link href="/app/bipintar/kamus" className="block group -webkit-tap-highlight-color-transparent outline-none">
              <div className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden relative">
                <div className="w-14 h-14 bg-[#00B894]/15 rounded-[18px] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-[#00B894]" strokeWidth={2.5} />
                </div>
                <div className="flex-1 py-0.5">
                  <h3 className="font-bold text-slate-800 text-[15px] leading-snug mb-1 group-active:text-slate-600 transition-colors">
                    Kamus Isyarat Hijaiyah
                  </h3>
                  <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2">
                    Pelajari 29 huruf Hijaiyah + dengarkan pelafalannya.
                  </p>
                </div>
                <div className="flex items-center justify-center pr-1">
                  <ChevronRight className="w-5 h-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </div>
              </div>
            </Link>

            <Link href="/app/bipintar/kamus-bisindo" className="block group -webkit-tap-highlight-color-transparent outline-none">
              <div className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden relative">
                <div className="w-14 h-14 bg-[#0984E3]/15 rounded-[18px] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-[#0984E3]" strokeWidth={2.5} />
                </div>
                <div className="flex-1 py-0.5">
                  <h3 className="font-bold text-slate-800 text-[15px] leading-snug mb-1 group-active:text-slate-600 transition-colors">
                    Kamus Isyarat BISINDO
                  </h3>
                  <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2">
                    Pelajari 48 isyarat umum BISINDO + dengarkan pelafalannya.
                  </p>
                </div>
                <div className="flex items-center justify-center pr-1">
                  <ChevronRight className="w-5 h-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </div>
              </div>
            </Link>

            <Link href="/app/bipintar/statistik" className="block group -webkit-tap-highlight-color-transparent outline-none">
              <div className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden relative">
                <div className="w-14 h-14 bg-violet-500/15 rounded-[18px] flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6 text-violet-500" strokeWidth={2.5} />
                </div>
                <div className="flex-1 py-0.5">
                  <h3 className="font-bold text-slate-800 text-[15px] leading-snug mb-1 group-active:text-slate-600 transition-colors">
                    Statistik Belajar
                  </h3>
                  <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2">
                    Lihat kemajuan & huruf yang perlu kamu latih.
                  </p>
                </div>
                <div className="flex items-center justify-center pr-1">
                  <ChevronRight className="w-5 h-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </div>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* SEKSI 2: DAFTAR KELAS (DINAMIS DARI FIRESTORE) */}
        <section>
          <div className="flex items-center gap-2 mb-3.5 px-1">
            <BookOpen className="w-5 h-5 text-indigo-500" strokeWidth={2.5} />
            <h2 className="font-extrabold text-slate-800 text-[17px] tracking-tight">Kelas &amp; Materi Pelatihan</h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 rounded-[24px] p-4 h-[116px] animate-pulse border border-slate-100 flex gap-4">
                  <div className="w-[84px] h-[84px] bg-slate-200/50 rounded-[16px] shrink-0"></div>
                  <div className="flex-1 py-2 flex flex-col justify-between">
                    <div className="w-16 h-5 bg-slate-200/50 rounded-md"></div>
                    <div className="w-full h-4 bg-slate-200/50 rounded-md"></div>
                    <div className="w-2/3 h-4 bg-slate-200/50 rounded-md mt-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[24px] p-8 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-[18px] flex items-center justify-center mb-4 border border-slate-100">
                <BookOpen className="w-7 h-7 text-slate-300" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-slate-800 text-[16px] mb-1">Belum ada kelas</h3>
              <p className="text-slate-500 text-[13px] leading-relaxed max-w-[200px]">
                Materi pelatihan sedang disiapkan oleh admin.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-3.5"
            >
              {courses.map((course) => (
                <motion.div key={course.id} variants={itemVariants}>
                  <div className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-4 cursor-pointer group active:scale-[0.98] transition-all duration-300 ease-out -webkit-tap-highlight-color-transparent">

                    <div className="w-[84px] h-[84px] bg-slate-50 rounded-[16px] overflow-hidden relative shrink-0 border border-slate-100/50">
                      {course.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50/50">
                          <PlayCircle className="w-8 h-8 text-indigo-300" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center flex-1 h-full py-1">
                      <div className="inline-block px-2.5 py-1 bg-[#1B9981]/10 text-[#1B9981] text-[10px] font-bold rounded-md uppercase tracking-wider mb-2 w-max">
                        {course.category || "Umum"}
                      </div>
                      <h3 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-2 mb-2 group-active:text-slate-600 transition-colors">
                        {course.title || "Kursus Tanpa Judul"}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium mt-auto">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.duration || "Fleksibel"}</span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Modal Pilih Tantangan */}
        {showQuizModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowQuizModal(false)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-[17px]">Pilih Mode Tantangan</h3>
                  <p className="text-slate-500 text-xs mt-1">Uji hafalan isyarat pilihanmu.</p>
                </div>
                <button onClick={() => setShowQuizModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col gap-2.5 mt-2">
                <button 
                  onClick={() => { setShowQuizModal(false); router.push("/app/bipintar/quiz?mode=hijaiyah"); }} 
                  className="flex w-full items-center justify-between p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-[#00B894] hover:bg-[#00B894]/5 transition-all font-bold text-slate-700 group active:scale-[0.98]"
                >
                  Huruf Hijaiyah
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#00B894] group-hover:translate-x-1 transition-all" />
                </button>
                <button 
                  onClick={() => { setShowQuizModal(false); router.push("/app/bipintar/quiz?mode=bisindo"); }}
                  className="flex w-full items-center justify-between p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-[#0984E3] hover:bg-[#0984E3]/5 transition-all font-bold text-slate-700 group active:scale-[0.98]"
                >
                  Isyarat BISINDO
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0984E3] group-hover:translate-x-1 transition-all" />
                </button>
                <button 
                  onClick={() => { setShowQuizModal(false); router.push("/app/bipintar/quiz?mode=gabungan"); }}
                  className="flex w-full items-center justify-between p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-amber-500 hover:bg-amber-500/5 transition-all font-bold text-slate-700 group active:scale-[0.98]"
                >
                  Gabungan (Keduanya)
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
