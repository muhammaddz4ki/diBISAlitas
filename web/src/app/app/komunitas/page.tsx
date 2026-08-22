"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Megaphone, Info, AlertTriangle, Siren, Clock, ChevronRight, Trophy, Crown, Medal } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { subscribeLeaderboard, QuizScoreEntry } from "@/lib/quizService";

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
    icon: <Info className="w-4 h-4" />,
    bg: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-100",
    dot: "bg-sky-400",
  },
  penting: {
    label: "Penting",
    icon: <AlertTriangle className="w-4 h-4" />,
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    dot: "bg-amber-400",
  },
  darurat: {
    label: "Darurat",
    icon: <Siren className="w-4 h-4" />,
    bg: "bg-rose-50",
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
    <div className="min-h-full bg-white selection:bg-[#1B9981]/20 pb-12">
      {/* Header — Minimal White */}
      <div className="px-6 pt-14 pb-5 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#00B894]/10 flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6 text-[#00B894]" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-widest">diBISAlitas</p>
            <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">Komunitas &amp; Info</h1>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 relative z-20">

        {/* ── PAPAN PERINGKAT — Tantangan Isyarat ── */}
        <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border border-slate-100 mb-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className="font-extrabold text-slate-800 text-[15px] tracking-tight leading-none">Papan Peringkat</h2>
              <p className="text-slate-400 text-[11px] font-medium mt-0.5">Tantangan Isyarat Hijaiyah</p>
            </div>
            <Link href="/app/ranking" className="text-[12px] font-bold text-[#1B9981] shrink-0 active:scale-95 transition-transform">
              Lihat semua
            </Link>
          </div>

          {lbLoading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-11 bg-slate-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-400 text-[13px] font-medium">Belum ada skor. Jadilah yang pertama!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {leaderboard.map((entry, i) => {
                const rank = i + 1;
                const isTop = rank <= 3;
                const rankColor =
                  rank === 1 ? "text-amber-500" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-orange-400" : "text-slate-300";
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isTop ? "bg-amber-50/60" : "bg-white"}`}
                  >
                    <div className="w-7 flex items-center justify-center shrink-0">
                      {rank === 1 ? (
                        <Crown className={`w-5 h-5 ${rankColor}`} strokeWidth={2.5} />
                      ) : isTop ? (
                        <Medal className={`w-5 h-5 ${rankColor}`} strokeWidth={2.5} />
                      ) : (
                        <span className="text-[13px] font-bold text-slate-400">{rank}</span>
                      )}
                    </div>
                    <span className="flex-1 min-w-0 text-[14px] font-bold text-slate-700 truncate">
                      {entry.userName}
                    </span>
                    <span className="text-[13px] font-black text-[#1B9981] shrink-0">{entry.score}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex flex-col gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 rounded-[24px] p-5 h-[116px] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
              <Megaphone className="w-9 h-9 text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-slate-800 text-[17px] mb-2 tracking-tight">Belum ada pengumuman</h3>
            <p className="text-slate-400 text-sm max-w-[220px] leading-relaxed">
              Admin belum memposting pengumuman. Pantau terus ya!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-3.5 mt-2"
          >
            {announcements.map((item) => {
              const cfg = categoryConfig[item.category] ?? categoryConfig.info;
              return (
                <motion.div key={item.id} variants={itemVariants}>
                  <button
                    onClick={() => setSelected(item)}
                    className="w-full text-left bg-white rounded-[24px] p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:shadow-none hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] border border-slate-100 flex items-start gap-4 active:scale-[0.98] transition-all duration-300 ease-out -webkit-tap-highlight-color-transparent group"
                  >
                    {/* Category Icon */}
                    <div className={`w-14 h-14 rounded-[18px] shrink-0 flex items-center justify-center ${cfg.bg} ${cfg.text}`}>
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 py-0.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                        {/* Unread dot */}
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} opacity-80`} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-1 group-active:text-slate-600 transition-colors">{item.title}</h3>
                      <p className="text-slate-500 text-[12px] mt-1 line-clamp-2 leading-relaxed">{item.content}</p>
                      <div className="flex items-center gap-1.5 mt-2.5 text-slate-400 text-[11px] font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex h-full items-center justify-center pt-5">
                      <ChevronRight className="w-5 h-5 text-slate-300 shrink-0 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] flex items-end sm:items-center sm:justify-center"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-[400px] bg-white rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-12 sm:pb-6 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              {/* iOS style handle */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-7 sm:hidden" />

              {(() => {
                const cfg = categoryConfig[selected.category] ?? categoryConfig.info;
                return (
                  <>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full ${cfg.bg} ${cfg.text} mb-4`}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <h2 className="font-extrabold text-slate-800 text-[22px] leading-snug mb-3 tracking-tight">{selected.title}</h2>

                    <div className="flex items-center gap-2 text-slate-500 text-[12px] font-medium mb-6 bg-slate-50 py-2 px-3 rounded-xl border border-slate-100 inline-flex">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(selected.createdAt)}</span>
                      {selected.authorName && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-slate-600 font-semibold">{selected.authorName}</span>
                        </>
                      )}
                    </div>

                    <div className="w-full h-[1px] bg-slate-100 mb-6"></div>

                    <p className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap">{selected.content}</p>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
