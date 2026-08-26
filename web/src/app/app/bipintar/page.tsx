"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { BookOpen, PlayCircle, Clock, Camera, Sparkles, ChevronRight, Trophy, GraduationCap, BarChart3, X, Hand } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useAccessibility } from "@/lib/AccessibilityContext";
import ModalPortal from "@/components/ModalPortal";

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
  const colorfulMode = false;
  const themeGrad = "from-amber-400 to-amber-500";
  const themeShadow = "shadow-[0_8px_16px_rgba(245,158,11,0.3)]";
  const themeText = "text-amber-500";
  const themeSelection = "selection:bg-amber-500/20";

  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showEdukasiModal, setShowEdukasiModal] = useState(false);
  const [showKamusModal, setShowKamusModal] = useState(false);

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
    <div className={`min-h-[100dvh] bg-[#f4f6fc] ${themeSelection} flex flex-col`}>

      {/* Header — Sticky 3D Neumorphism */}
      <div className="sticky top-0 z-50 px-6 pt-5 pb-5 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0 mb-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${themeGrad} flex items-center justify-center shrink-0 bubble-3d text-white`}>
            <BookOpen className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2.5} />
          </div>
          <div>

            <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-tight text-3d">BiPINTAR</h1>
            <p className="text-slate-500 text-[13px] leading-snug line-clamp-2 max-w-[240px] mt-0.5 text-3d">
              Akses modul interaktif dan kelas keahlian untuk tingkatkan kompetensimu.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 relative z-20 flex-1 space-y-8">

        {/* SEKSI 1: MODUL INTERAKTIF AI (STATIS) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between px-1 mb-3.5">
            <h2 className="font-extrabold text-slate-800 text-[17px] tracking-tight text-3d">Modul Interaktif AI</h2>
            <Sparkles className={`w-5 h-5 ${themeText} drop-shadow-sm`} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col gap-3.5">
            <FeatureModalButton 
              onClick={() => setShowEdukasiModal(true)}
              title="Edukasi Isyarat"
              desc="Deteksi dan praktik isyarat abjad menggunakan AI."
              icon={<Camera className="w-[26px] h-[26px] text-white drop-shadow-md" strokeWidth={2.5} />}
              bg="bg-gradient-to-br from-sky-400 to-sky-600"
              buttonColor="bg-[#f4f6fc] text-sky-600"
            />
            
            <FeatureModalButton 
              onClick={() => setShowQuizModal(true)}
              title="Tantangan Isyarat"
              desc="Uji hafalanmu: peragakan huruf, kumpulkan skor, dan naik peringkat."
              icon={<Trophy className="w-[26px] h-[26px] text-white drop-shadow-md" strokeWidth={2.5} />}
              bg={`bg-gradient-to-br ${themeGrad}`}
              buttonColor={`bg-[#f4f6fc] ${themeText}`}
              badge="Baru"
            />

            <FeatureModalButton 
              onClick={() => setShowKamusModal(true)}
              title="Kamus Isyarat"
              desc="Pelajari daftar huruf dan dengarkan pelafalannya."
              icon={<GraduationCap className="w-[26px] h-[26px] text-white drop-shadow-md" strokeWidth={2.5} />}
              bg="bg-gradient-to-br from-purple-400 to-purple-600"
              buttonColor="bg-[#f4f6fc] text-purple-600"
            />

            <FeatureCard 
              href="/app/bipintar/statistik"
              title="Statistik Belajar"
              desc="Lihat kemajuan & huruf yang perlu kamu latih."
              icon={<BarChart3 className="w-[26px] h-[26px] text-white drop-shadow-md" strokeWidth={2.5} />}
              bg="bg-gradient-to-br from-emerald-400 to-emerald-600"
              buttonColor="bg-[#f4f6fc] text-emerald-600"
            />
          </div>
        </motion.section>

        {/* SEKSI 2: DAFTAR KELAS (DINAMIS DARI FIRESTORE) */}
        <section>
          <div className="flex items-center justify-between px-1 mb-3.5">
            <h2 className="font-extrabold text-slate-800 text-[17px] tracking-tight text-3d">Kelas &amp; Materi Pelatihan</h2>
            <BookOpen className="w-5 h-5 text-[#1B9981] drop-shadow-sm" strokeWidth={2.5} />
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-transparent border border-white rounded-[24px] p-4 h-[116px] flex gap-4 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)]">
                  <div className="w-[84px] h-[84px] bg-slate-200/50 rounded-[16px] shrink-0 animate-pulse"></div>
                  <div className="flex-1 py-2 flex flex-col justify-between animate-pulse">
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
              className="bg-transparent rounded-[24px] p-8 text-center shadow-[inset_3px_3px_8px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)] border border-white flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-[18px] flex items-center justify-center mb-4 border border-white shadow-3d">
                <BookOpen className="w-7 h-7 text-slate-400" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-slate-800 text-[16px] mb-1 text-3d">Belum ada kelas</h3>
              <p className="text-slate-500 text-[13px] leading-relaxed max-w-[200px] font-medium">
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
                  <div className="bg-transparent p-4 rounded-[24px] shadow-3d shadow-3d-hover shadow-3d-active border border-white flex items-center gap-4 cursor-pointer group transition-all -webkit-tap-highlight-color-transparent">

                    <div className="w-[84px] h-[84px] rounded-[16px] overflow-hidden relative shrink-0 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),_inset_-2px_-2px_5px_rgba(255,255,255,0.8)] border border-white/50">
                      {course.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                          <PlayCircle className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center flex-1 h-full py-1 min-w-0">
                      <div className="inline-block px-2.5 py-1 bg-[#f4f6fc] border border-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),_inset_-2px_-2px_4px_rgba(255,255,255,1)] text-[#1B9981] text-[10px] font-extrabold rounded-md uppercase tracking-wider mb-2 w-max">
                        {course.category || "Umum"}
                      </div>
                      <h3 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-2 mb-2 group-active:text-slate-600 transition-colors text-3d">
                        {course.title || "Kursus Tanpa Judul"}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold mt-auto">
                        <Clock className="w-3.5 h-3.5 text-[#1B9981]" />
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
        <SelectionModal 
          isOpen={showQuizModal}
          onClose={() => setShowQuizModal(false)}
          title="Pilih Mode Tantangan"
          desc="Uji hafalan isyarat pilihanmu."
          options={[
            {
              label: "Isyarat Hijaiyah",
              onClick: () => { setShowQuizModal(false); router.push("/app/bipintar/quiz?mode=hijaiyah"); },
              color: "text-[#1B9981]",
              bgGradient: "bg-gradient-to-b from-[#2dd4bf] to-[#0f766e]",
              iconNode: <span className="text-[28px] font-bold font-serif leading-none relative top-[-3px] drop-shadow-md">ع</span>
            },
            {
              label: "Isyarat BISINDO",
              onClick: () => { setShowQuizModal(false); router.push("/app/bipintar/quiz?mode=bisindo"); },
              color: "text-sky-500",
              bgGradient: "bg-gradient-to-b from-[#38bdf8] to-[#0369a1]",
              iconNode: <span className="text-[20px] font-black drop-shadow-md">A</span>
            },
            {
              label: "Gabungan (Keduanya)",
              onClick: () => { setShowQuizModal(false); router.push("/app/bipintar/quiz?mode=gabungan"); },
              color: "text-amber-500",
              bgGradient: "bg-gradient-to-b from-[#fcd34d] to-[#d97706]",
              iconNode: <Sparkles className="w-[22px] h-[22px] drop-shadow-md" strokeWidth={2.5} />
            }
          ]}
        />

        {/* Modal Pilih Edukasi */}
        <SelectionModal 
          isOpen={showEdukasiModal}
          onClose={() => setShowEdukasiModal(false)}
          title="Pilih Edukasi Isyarat"
          desc="Praktik abjad dengan kamera AI."
          options={[
            {
              label: "Isyarat Hijaiyah",
              onClick: () => { setShowEdukasiModal(false); router.push("/app/bipintar/hijaiyah"); },
              color: "text-sky-500",
              bgGradient: "bg-gradient-to-b from-sky-500 to-sky-700",
              iconNode: <span className="text-[28px] font-bold font-serif leading-none relative top-[-3px] drop-shadow-md">ع</span>
            },
            {
              label: "Isyarat BISINDO",
              onClick: () => { setShowEdukasiModal(false); router.push("/app/bipintar/bisindo"); },
              color: "text-sky-500",
              bgGradient: "bg-gradient-to-b from-sky-300 to-sky-500",
              iconNode: <span className="text-[20px] font-black drop-shadow-md">A</span>
            }
          ]}
        />

        {/* Modal Pilih Kamus */}
        <SelectionModal 
          isOpen={showKamusModal}
          onClose={() => setShowKamusModal(false)}
          title="Pilih Kamus Isyarat"
          desc="Pelajari daftar huruf isyarat."
          options={[
            {
              label: "Kamus Hijaiyah",
              onClick: () => { setShowKamusModal(false); router.push("/app/bipintar/kamus"); },
              color: "text-purple-500",
              bgGradient: "bg-gradient-to-b from-purple-500 to-purple-700",
              iconNode: <span className="text-[28px] font-bold font-serif leading-none relative top-[-3px] drop-shadow-md">ع</span>
            },
            {
              label: "Kamus BISINDO",
              onClick: () => { setShowKamusModal(false); router.push("/app/bipintar/kamus-bisindo"); },
              color: "text-purple-500",
              bgGradient: "bg-gradient-to-b from-purple-300 to-purple-500",
              iconNode: <span className="text-[20px] font-black drop-shadow-md">A</span>
            }
          ]}
        />

      </div>
    </div>
  );
}

function FeatureCard({ href, title, desc, icon, bg, buttonColor }: { href: string; title: string; desc: string; icon: React.ReactNode; bg: string; buttonColor: string }) {
  return (
    <Link href={href} className="block group -webkit-tap-highlight-color-transparent outline-none">
      <div className="bg-transparent p-4 rounded-[24px] shadow-3d shadow-3d-hover shadow-3d-active border border-white flex items-center gap-4 transition-all">
        <div className={`w-14 h-14 ${bg} rounded-[18px] flex items-center justify-center shrink-0 bubble-3d text-white`}>
          {icon}
        </div>
        <div className="flex-1 py-0.5">
          <h3 className="font-bold text-slate-800 text-[16px] leading-snug mb-1 group-active:text-slate-600 transition-colors text-3d">
            {title}
          </h3>
          <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2 font-medium">
            {desc}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white shrink-0 ${buttonColor}`}>
          <ChevronRight className="w-5 h-5 drop-shadow-sm" strokeWidth={2.5} />
        </div>
      </div>
    </Link>
  );
}

function FeatureModalButton({ onClick, title, desc, icon, bg, buttonColor, badge }: { onClick: () => void; title: string; desc: string; icon: React.ReactNode; bg: string; buttonColor: string; badge?: string }) {
  return (
    <button onClick={onClick} className="block w-full text-left group -webkit-tap-highlight-color-transparent outline-none">
      <div className="bg-transparent p-4 rounded-[24px] shadow-3d shadow-3d-hover shadow-3d-active border border-white flex items-center gap-4 transition-all">
        <div className={`w-14 h-14 ${bg} rounded-[18px] flex items-center justify-center shrink-0 bubble-3d text-white`}>
          {icon}
        </div>
        <div className="flex-1 py-0.5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-800 text-[16px] leading-snug group-active:text-slate-600 transition-colors text-3d">
              {title}
            </h3>
            {badge && (
              <span className="text-[9px] font-black text-amber-600 bg-amber-100/80 px-1.5 py-0.5 rounded-full uppercase tracking-wide shadow-sm border border-white">{badge}</span>
            )}
          </div>
          <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2 font-medium">
            {desc}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white shrink-0 ${buttonColor}`}>
          <ChevronRight className="w-5 h-5 drop-shadow-sm" strokeWidth={2.5} />
        </div>
      </div>
    </button>
  );
}

function SelectionModal({ isOpen, onClose, title, desc, options }: { isOpen: boolean; onClose: () => void; title: string; desc: string; options: { label: string; onClick: () => void; color: string; bgGradient: string; iconNode: React.ReactNode }[] }) {
  if (!isOpen) return null;
  
  return (
    <ModalPortal>
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-[#f4f6fc] rounded-[2.5rem] p-6 w-full max-w-sm flex flex-col gap-4 shadow-2xl border-t border-white" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-extrabold text-slate-800 text-[18px] text-3d">{title}</h3>
            <p className="text-slate-500 text-[13px] mt-1 font-medium text-3d">{desc}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#f4f6fc] flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white transition-all active:scale-95 shrink-0">
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {options.map((opt, i) => (
            <button 
              key={i}
              onClick={opt.onClick} 
              className="flex w-full items-center justify-between p-5 rounded-[22px] bg-transparent shadow-3d shadow-3d-hover shadow-3d-active border border-white transition-all font-bold text-slate-700 group active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className={`w-[46px] h-[46px] rounded-[14px] flex items-center justify-center bubble-3d border-none text-white ${opt.bgGradient}`}>
                  {opt.iconNode}
                </div>
                <span className="text-[15px]">{opt.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 group-hover:text-slate-500 transition-all" strokeWidth={2.5} />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
    </ModalPortal>
  );
}
