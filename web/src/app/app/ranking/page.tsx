"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Crown, Medal, Flame, Trophy, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { subscribeLeaderboard, QuizScoreEntry } from "@/lib/quizService";

export default function RankingPage() {
  const [entries, setEntries] = useState<QuizScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeLeaderboard(
      (data) => {
        setEntries(data);
        setLoading(false);
      },
      () => setLoading(false),
      50
    );
    return () => unsub();
  }, []);

  const top3 = entries.slice(0, 3);

  // Podium order: [2nd, 1st, 3rd]
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumRank = [2, 1, 3];

  const podiumColors = [
    "from-[#1B9981] to-[#00D4AA]",
    "from-amber-400 to-yellow-300",
    "from-[#1B9981]/60 to-[#00D4AA]/60"
  ];

  const avatarRings = [
    "border-[#00D4AA]",
    "border-amber-400",
    "border-[#00D4AA]/60"
  ];

  const podiumH = ["h-[100px]", "h-[140px]", "h-[75px]"];

  const avatarSizes = [
    "w-[48px] h-[48px] text-[17px]",
    "w-[60px] h-[60px] text-[22px]",
    "w-[44px] h-[44px] text-[15px]",
  ];

  return (
    <div className="min-h-full flex flex-col bg-[#1B9981]">

      {/* Header — Sticky 3D Neumorphism (same as other pages) */}
      <div className="sticky top-0 z-50 px-5 pt-14 pb-6 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B9981] to-[#00D4AA] flex items-center justify-center shrink-0 bubble-3d text-white">
            <Trophy className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2.5} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-widest text-3d truncate">
              Tantangan Hijaiyah
            </p>
            <h1 className="text-[22px] font-black text-slate-800 tracking-tight leading-none text-3d truncate">
              Papan Peringkat
            </h1>
          </div>

          <Link
            href="/app/komunitas"
            aria-label="Kembali"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white active:scale-95 transition-transform shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500 drop-shadow-sm" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* ===== GREEN BG — covers everything below header ===== */}
      <div className="flex-1 relative bg-gradient-to-b from-[#1B9981] via-[#00B894] to-[#00D4AA] overflow-hidden">

        {/* Decorative circles */}
        <div className="absolute top-[-40px] left-[-40px] w-[160px] h-[160px] rounded-full bg-white/5" />
        <div className="absolute top-[60px] right-[-30px] w-[120px] h-[120px] rounded-full bg-white/5" />
        <div className="absolute top-[200px] left-[25%] w-[70px] h-[70px] rounded-full bg-white/[0.07]" />
        <div className="absolute bottom-[100px] right-[15%] w-[90px] h-[90px] rounded-full bg-white/[0.04]" />

        {/* Podium Section — takes generous space */}
        {!loading && top3.length > 0 && (
          <div className="flex items-end justify-center gap-3 px-6 pt-14 pb-0 relative z-10">
            {podiumOrder.map((entry, i) =>
              entry ? (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center flex-1 max-w-[115px]"
                >
                  {/* Avatar + Crown */}
                  <div className="relative mb-1.5">
                    <div
                      className={`${avatarSizes[i]} rounded-full flex items-center justify-center overflow-hidden border-[3px] ${avatarRings[i]} bg-white shadow-lg`}
                    >
                      <span className={`font-black ${podiumRank[i] === 1 ? "text-amber-500" : "text-[#1B9981]"}`}>
                        {entry.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {podiumRank[i] === 1 && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                        <Crown className="w-7 h-7 text-amber-300 fill-amber-300 drop-shadow-lg" />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <span className="text-[11px] font-bold text-white truncate w-full text-center drop-shadow-sm">
                    {entry.userName}
                  </span>
                  
                  {/* Points badge */}
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-extrabold text-white">
                    {entry.score.toLocaleString()} Pt
                  </span>

                  {/* Podium block */}
                  <div
                    className={`w-full ${podiumH[i]} rounded-t-[14px] mt-2 flex items-start justify-center pt-2.5 bg-gradient-to-b ${podiumColors[i]} shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]`}
                  >
                    <span className="text-white/90 font-black text-[20px] drop-shadow-sm">{podiumRank[i]}</span>
                  </div>
                </motion.div>
              ) : (
                <div key={`empty-${i}`} className="flex-1 max-w-[115px]" />
              )
            )}
          </div>
        )}

        {/* ===== WHITE CARD AREA — overlays the green bg ===== */}
        <div className="relative z-20 bg-[#f4f6fc] rounded-t-[28px] pb-10 min-h-[50vh] -mt-5">

          {loading ? (
            <div className="px-5 pt-6 flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-[68px] bg-white rounded-[20px] animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-8">
              <div className="w-20 h-20 rounded-full shadow-[inset_3px_3px_8px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)] border border-white flex items-center justify-center mb-4">
                <Trophy className="w-9 h-9 text-[#1B9981]" strokeWidth={1.8} />
              </div>
              <h3 className="font-bold text-slate-800 text-[16px] mb-1 text-3d">Belum ada skor</h3>
              <p className="text-slate-400 text-[13px] max-w-[240px] leading-relaxed text-3d">
                Mainkan Tantangan Isyarat dan jadilah yang pertama masuk papan peringkat!
              </p>
              <Link
                href="/app/bipintar/quiz"
                className="mt-5 px-6 py-3 rounded-2xl bg-[#1B9981] text-white font-bold text-[14px] active:scale-95 transition-transform shadow-[0_8px_16px_rgba(27,153,129,0.3)]"
              >
                Main Sekarang
              </Link>
            </div>
          ) : (
            <>
              {/* CTA Button */}
              <div className="px-5 pt-6 pb-5">
                <Link
                  href="/app/bipintar/quiz"
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-[20px] bg-gradient-to-r from-[#1B9981] to-[#00D4AA] text-white font-black text-[15px] active:scale-[0.97] transition-all shadow-[0_8px_20px_rgba(27,153,129,0.35)]"
                >
                  <Medal className="w-5 h-5 drop-shadow-sm" /> Ikut Tantangan
                </Link>
              </div>

              {/* Detail Peringkat */}
              <div className="px-5">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="text-[15px] font-extrabold text-slate-800 tracking-tight text-3d">Detail Peringkat</h2>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{entries.length} Peserta</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {entries.map((entry, i) => {
                    const rank = i + 1;
                    const isTop3 = rank <= 3;

                    const rankBadgeColor = rank === 1
                      ? "bg-gradient-to-br from-amber-400 to-yellow-300 text-white"
                      : rank === 2
                      ? "bg-gradient-to-br from-[#1B9981] to-[#00D4AA] text-white"
                      : rank === 3
                      ? "bg-gradient-to-br from-[#7dd3c0] to-[#a7e8d8] text-white"
                      : "bg-[#f4f6fc] text-slate-400";

                    const rankIcon = rank === 1
                      ? <Crown className="w-3.5 h-3.5" />
                      : rank === 2
                      ? <Star className="w-3.5 h-3.5" />
                      : rank === 3
                      ? <Medal className="w-3.5 h-3.5" />
                      : null;

                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.04 }}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-[20px] shadow-3d border border-white ${
                          isTop3 ? "bg-white" : "bg-transparent"
                        }`}
                      >
                        {/* Rank badge */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-[13px] shadow-sm ${rankBadgeColor}`}>
                          {rankIcon || rank}
                        </div>

                        {/* Avatar */}
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ${
                          isTop3
                            ? rank === 1
                              ? "bg-gradient-to-br from-amber-100 to-amber-50"
                              : "bg-gradient-to-br from-[#e0f5ef] to-[#d0ede4]"
                            : "bg-gradient-to-br from-slate-100 to-slate-50"
                        }`}>
                          <span className={`text-[15px] font-black ${
                            rank === 1 ? "text-amber-500" : isTop3 ? "text-[#1B9981]" : "text-slate-400"
                          }`}>
                            {entry.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-[14px] font-bold truncate ${isTop3 ? "text-slate-800" : "text-slate-600"}`}>
                            {entry.userName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-400" />
                              {entry.bestStreak}
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                              <Zap className="w-3 h-3 text-emerald-400" />
                              {entry.correctCount} benar
                            </span>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="flex flex-col items-end shrink-0">
                          <span className={`text-[16px] font-black ${rank === 1 ? "text-amber-500" : "text-[#1B9981]"}`}>
                            {entry.score.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">poin</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
