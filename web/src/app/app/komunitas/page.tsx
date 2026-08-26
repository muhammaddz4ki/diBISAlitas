"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Megaphone, Info, AlertTriangle, Siren, Clock, ChevronRight, Trophy, Crown, Medal } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { subscribeLeaderboard, QuizScoreEntry } from "@/lib/quizService";
import ModalPortal from "@/components/ModalPortal";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "info" | "penting" | "darurat";
  authorName?: string;
  createdAt: Timestamp | null;
}

const categoryConfig = {
  info: {
    label: "Info",
    icon: <Info className="w-6 h-6 drop-shadow-md" />,
    bg: "bg-sky-50",
    bgGradient: "bg-gradient-to-br from-sky-400 to-sky-600",
    text: "text-sky-600",
    border: "border-sky-100",
    dot: "bg-sky-400",
  },
  penting: {
    label: "Penting",
    icon: <AlertTriangle className="w-6 h-6 drop-shadow-md" />,
    bg: "bg-amber-50",
    bgGradient: "bg-gradient-to-br from-amber-400 to-amber-600",
    text: "text-amber-600",
    border: "border-amber-100",
    dot: "bg-amber-400",
  },
  darurat: {
    label: "Darurat",
    icon: <Siren className="w-6 h-6 drop-shadow-md" />,
    bg: "bg-rose-50",
    bgGradient: "bg-gradient-to-br from-rose-400 to-rose-600",
    text: "text-rose-600",
    border: "border-rose-100",
    dot: "bg-rose-500",
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

export default function KomunitasPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [leaderboard, setLeaderboard] = useState<QuizScoreEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data: Announcement[] = [];
      snap.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Announcement);
      });
      setAnnouncements(data);
      setLoading(false);
    }, () => setLoading(false));

    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = subscribeLeaderboard(
      (entries) => {
        setLeaderboard(entries);
        setLbLoading(false);
      },
      () => setLbLoading(false),
      10
    );
    return () => unsub();
  }, []);

  const formatDate = (ts: Timestamp | null) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts as unknown as string);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-full bg-[#f4f6fc] selection:bg-[#1B9981]/20">
      {/* Header — Sticky 3D Neumorphism */}
      <div className="sticky top-0 z-50 px-6 pt-5 pb-5 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00B894] to-[#00D4AA] flex items-center justify-center shrink-0 bubble-3d text-white">
            <Megaphone className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2.5} />
          </div>
          <div>

            <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-tight text-3d">Komunitas &amp; Info</h1>
          </div>
        </div>
      </div>

      <div className="px-5 py-2 relative z-20">

        {/* ── PAPAN PERINGKAT — Tantangan Isyarat ── */}
        <div className="bg-transparent rounded-[24px] p-5 shadow-3d border border-white mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[14px] bg-transparent shadow-3d flex items-center justify-center border border-white shrink-0">
              <Trophy className="w-5 h-5 text-amber-500 drop-shadow-md" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className="font-extrabold text-slate-800 text-[16px] tracking-tight leading-none text-3d">Papan Peringkat</h2>
              <p className="text-slate-400 text-[12px] font-medium mt-1 text-3d">Tantangan Isyarat Hijaiyah</p>
            </div>
            <Link href="/app/ranking" className="w-10 h-10 rounded-[14px] flex items-center justify-center shadow-3d shadow-3d-hover shadow-3d-active shrink-0 transition-transform">
              <ChevronRight className="w-5 h-5 text-[#1B9981]" strokeWidth={3} />
            </Link>
          </div>

          {lbLoading ? (
            <div className="flex flex-col gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-[#f4f6fc] rounded-[16px] shadow-3d border border-white animate-pulse" />
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-400 text-[13px] font-medium text-3d">Belum ada skor. Jadilah yang pertama!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              {leaderboard.map((entry, i) => {
                const rank = i + 1;
                const isTop = rank <= 3;
                const rankColor =
                  rank === 1 ? "text-amber-500 drop-shadow-md" : rank === 2 ? "text-slate-400 drop-shadow-md" : rank === 3 ? "text-orange-400 drop-shadow-md" : "text-slate-300";
                
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[16px] border border-white ${isTop ? "shadow-3d bg-[#f4f6fc]" : "shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)]"}`}
                  >
                    <div className="w-8 flex items-center justify-center shrink-0">
                      {rank === 1 ? (
                        <Crown className={`w-6 h-6 ${rankColor}`} strokeWidth={2.5} />
                      ) : isTop ? (
                        <Medal className={`w-5 h-5 ${rankColor}`} strokeWidth={2.5} />
                      ) : (
                        <span className="text-[14px] font-bold text-slate-400">{rank}</span>
                      )}
                    </div>
                    <span className="flex-1 min-w-0 text-[15px] font-bold text-slate-700 truncate text-3d">
                      {entry.userName}
                    </span>
                    <span className="text-[15px] font-black text-[#1B9981] shrink-0 text-3d">{entry.score}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex flex-col gap-4 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#f4f6fc] rounded-[24px] p-5 h-[120px] animate-pulse shadow-3d border border-white" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)]">
              <Megaphone className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-slate-800 text-[18px] mb-2 tracking-tight text-3d">Belum ada pengumuman</h3>
            <p className="text-slate-400 text-sm max-w-[220px] leading-relaxed text-3d">
              Admin belum memposting pengumuman. Pantau terus ya!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-5 mt-2"
          >
            {announcements.map((item) => {
              const cfg = categoryConfig[item.category] ?? categoryConfig.info;
              return (
                <motion.div key={item.id} variants={itemVariants}>
                  <button
                    onClick={() => setSelected(item)}
                    className="w-full text-left bg-transparent rounded-[24px] p-4 shadow-3d shadow-3d-hover shadow-3d-active border border-white flex items-start gap-4 transition-all duration-300 ease-out -webkit-tap-highlight-color-transparent group"
                  >
                    {/* Category Icon */}
                    <div className={`w-14 h-14 rounded-[16px] shrink-0 flex items-center justify-center bubble-3d text-white ${cfg.bgGradient}`}>
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 py-0.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider text-3d ${cfg.text}`}>
                          {cfg.label}
                        </span>
                        {/* Unread dot */}
                        <span className={`w-2 h-2 rounded-full ${cfg.dot} shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]`} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-[16px] leading-snug line-clamp-1 group-active:text-slate-600 transition-colors text-3d">{item.title}</h3>
                      <p className="text-slate-500 text-[13px] mt-1.5 line-clamp-2 leading-relaxed text-3d">{item.content}</p>
                      <div className="flex items-center gap-1.5 mt-3 text-slate-400 text-[11px] font-semibold text-3d">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex h-full items-center justify-center pt-5">
                      <div className="w-8 h-8 rounded-full shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),_inset_-2px_-2px_6px_rgba(255,255,255,1)] flex items-center justify-center group-hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),_-2px_-2px_6px_rgba(255,255,255,1)] transition-all">
                        <ChevronRight className="w-4 h-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Detail Modal (Bottom Sheet dengan animasi keluar) */}
      <AnimatePresence>
        {selected && (
          <ModalPortal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-end sm:items-center sm:justify-center p-6 sm:p-0"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-[400px] bg-[#f4f6fc] rounded-[2.5rem] p-6 pb-6 max-h-[85vh] overflow-y-auto shadow-2xl border-t border-white mb-6"
            >
              {/* iOS style handle */}
              <div className="w-16 h-1.5 rounded-full shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)] mx-auto mb-7 sm:hidden" />

              {(() => {
                const cfg = categoryConfig[selected.category] ?? categoryConfig.info;
                return (
                  <>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] ${cfg.text} mb-4 text-3d`}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <h2 className="font-extrabold text-slate-800 text-[24px] leading-snug mb-3 tracking-tight text-3d">{selected.title}</h2>

                    <div className="flex items-center gap-2 text-slate-500 text-[12px] font-semibold mb-6 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] py-2.5 px-4 rounded-[16px] inline-flex">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-3d">{formatDate(selected.createdAt)}</span>
                      {selected.authorName && (
                        <>
                          <span className="w-1 h-1 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" />
                          <span className="text-slate-600 font-bold text-3d">{selected.authorName}</span>
                        </>
                      )}
                    </div>

                    <div className="w-full h-[2px] bg-slate-200/50 shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)] mb-6 rounded-full"></div>

                    <p className="text-slate-600 leading-relaxed text-[16px] whitespace-pre-wrap text-3d font-medium">{selected.content}</p>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </div>
  );
}
