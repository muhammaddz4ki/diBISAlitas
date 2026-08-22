"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Crown, Medal, Flame, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { subscribeLeaderboard, QuizScoreEntry } from "@/lib/quizService";

const LOGO = "/logo/logo.png";
const TOSCA = "#00B894";

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
  const rest = entries.slice(3);

  // Urutan podium: [2, 1, 3]
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumHeights = ["h-24", "h-32", "h-20"];
  const podiumRank = [2, 1, 3];

  return (
    <div className="min-h-full bg-white flex flex-col pb-10">

      {/* Header putih + tosca dengan logo */}
      <div className="relative px-6 pt-12 pb-8 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <Link
            href="/app/bipintar"
            aria-label="Kembali"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#00B894]/10 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-[#00B894]" strokeWidth={2.5} />
          </Link>
          <div className="w-11 h-11" />
        </div>

        <div className="flex flex-col items-center mt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="diBISAlitas" className="w-20 h-20 object-contain mb-3" />
          <h1 className="text-[22px] font-black text-slate-800 tracking-tight">Papan Peringkat</h1>
          <p className="text-[12px] font-semibold text-[#00B894] uppercase tracking-widest mt-0.5">
            Tantangan Isyarat Hijaiyah
          </p>
        </div>
      </div>

      {loading ? (
        <div className="px-6 flex flex-col gap-3 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-8">
          <div className="w-20 h-20 rounded-full bg-[#00B894]/10 flex items-center justify-center mb-4">
            <Trophy className="w-9 h-9 text-[#00B894]" strokeWidth={1.8} />
          </div>
          <h3 className="font-bold text-slate-800 text-[16px] mb-1">Belum ada skor</h3>
          <p className="text-slate-400 text-[13px] max-w-[240px] leading-relaxed">
            Mainkan Tantangan Isyarat dan jadilah yang pertama masuk papan peringkat!
          </p>
          <Link
            href="/app/bipintar/quiz"
            className="mt-5 px-6 py-3 rounded-2xl bg-[#00B894] text-white font-bold text-[14px] active:scale-95 transition-transform"
          >
            Main Sekarang
          </Link>
        </div>
      ) : (
        <>
          {/* Podium Top 3 */}
          {top3.length > 0 && (
            <div className="flex items-end justify-center gap-3 px-6 mt-4 mb-6">
              {podiumOrder.map((entry, i) =>
                entry ? (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center flex-1 max-w-[110px]"
                  >
                    <div className="relative mb-2">
                      <div
                        className={`rounded-full flex items-center justify-center overflow-hidden border-[3px] ${
                          podiumRank[i] === 1 ? "w-16 h-16 border-amber-400" : "w-14 h-14 border-[#00B894]/40"
                        } bg-[#00B894]/10`}
                      >
                        <span className={`font-black text-[#00B894] ${podiumRank[i] === 1 ? "text-2xl" : "text-xl"}`}>
                          {entry.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {podiumRank[i] === 1 && (
                        <Crown className="w-6 h-6 text-amber-400 absolute -top-4 left-1/2 -translate-x-1/2 fill-amber-400" />
                      )}
                    </div>
                    <span className="text-[12px] font-bold text-slate-700 truncate w-full text-center">
                      {entry.userName}
                    </span>
                    <span className="text-[13px] font-black text-[#00B894]">{entry.score}</span>
                    <div
                      className={`w-full ${podiumHeights[i]} rounded-t-2xl mt-2 flex items-start justify-center pt-2 ${
                        podiumRank[i] === 1 ? "bg-amber-400" : "bg-[#00B894]"
                      }`}
                    >
                      <span className="text-white font-black text-[18px]">{podiumRank[i]}</span>
                    </div>
                  </motion.div>
                ) : (
                  <div key={`empty-${i}`} className="flex-1 max-w-[110px]" />
                )
              )}
            </div>
          )}

          {/* Sisa peringkat */}
          <div className="px-5 flex flex-col gap-2">
            {rest.map((entry, i) => {
              const rank = i + 4;
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_-6px_rgba(0,0,0,0.1)]"
                >
                  <span className="w-6 text-center text-[14px] font-bold text-slate-400">{rank}</span>
                  <div className="w-9 h-9 rounded-full bg-[#00B894]/10 flex items-center justify-center shrink-0">
                    <span className="text-[13px] font-black text-[#00B894]">
                      {entry.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-slate-700 truncate">{entry.userName}</p>
                    <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" /> streak {entry.bestStreak} · {entry.correctCount} benar
                    </p>
                  </div>
                  <span className="text-[15px] font-black text-[#00B894] shrink-0">{entry.score}</span>
                </div>
              );
            })}
          </div>

          <div className="px-5 mt-6">
            <Link
              href="/app/bipintar/quiz"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#00B894] text-white font-bold text-[15px] active:scale-95 transition-transform"
              style={{ boxShadow: `0 8px 24px -8px ${TOSCA}` }}
            >
              <Medal className="w-5 h-5" /> Ikut Tantangan
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
