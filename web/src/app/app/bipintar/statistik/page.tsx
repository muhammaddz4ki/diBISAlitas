"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Target, Gamepad2, Trophy, Dumbbell } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { HIJAIYAH_LABELS } from "@/constants/signLabels";
import { subscribeLearningStats, LearningStats, LetterStat } from "@/lib/learningStats";

function accuracyOf(stat: LetterStat | undefined): number {
  if (!stat || stat.seen === 0) return -1; // -1 = belum dicoba
  return stat.correct / stat.seen;
}

export default function StatistikPage() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setLoggedIn(!!u);
      if (!u) {
        setStats(null);
        return;
      }
      const unsub = subscribeLearningStats(u.uid, (s) => setStats(s), () => setStats(null));
      return () => unsub();
    });
    return () => unsubAuth();
  }, []);

  const overallAcc =
    stats && stats.totalAnswered > 0 ? stats.totalCorrect / stats.totalAnswered : 0;
  const masteredCount = useMemo(() => {
    if (!stats) return 0;
    return HIJAIYAH_LABELS.filter((l) => accuracyOf(stats.letters?.[String(l.id)]) >= 0.8).length;
  }, [stats]);

  // Huruf lemah: sudah dicoba tapi akurasi < 0.5, urut dari terlemah
  const weak = useMemo(() => {
    if (!stats) return [];
    return HIJAIYAH_LABELS.map((l) => ({ label: l, acc: accuracyOf(stats.letters?.[String(l.id)]) }))
      .filter((x) => x.acc >= 0 && x.acc < 0.5)
      .sort((a, b) => a.acc - b.acc)
      .slice(0, 6);
  }, [stats]);

  const hasData = stats && stats.totalAnswered > 0;

  return (
    <div className="min-h-full bg-[#f4f6fc] flex flex-col pb-10">
      {/* Header */}
      <div className="px-6 pt-12 pb-5">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/app/bipintar"
            aria-label="Kembali"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#f4f6fc] shadow-3d shadow-3d-active border border-white active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-[#1B9981] drop-shadow-sm" strokeWidth={2.5} />
          </Link>
          <div className="w-11 h-11" />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-[#1B9981]" strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="text-[24px] font-black text-slate-800 tracking-tight leading-none text-3d">Statistik Belajar</h1>
            <p className="text-slate-500 text-[12px] font-bold mt-1.5 uppercase tracking-wide text-3d">Kemajuan Isyarat Hijaiyah</p>
          </div>
        </div>
      </div>

      {loggedIn === false ? (
        <EmptyState text="Login untuk melacak kemajuan belajarmu." cta="Masuk" href="/app/login" />
      ) : !hasData ? (
        <EmptyState text="Belum ada data. Mainkan Tantangan Isyarat untuk mulai melacak kemajuanmu." cta="Main Sekarang" href="/app/bipintar/quiz" />
      ) : (
        <div className="px-5">
          {/* Ringkasan */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard icon={<Gamepad2 className="w-5 h-5" />} value={`${stats!.gamesPlayed}`} label="Sesi" />
            <StatCard icon={<Target className="w-5 h-5" />} value={`${Math.round(overallAcc * 100)}%`} label="Akurasi" />
            <StatCard icon={<Trophy className="w-5 h-5" />} value={`${masteredCount}/29`} label="Dikuasai" />
          </div>

          {/* Huruf perlu dilatih */}
          <div className="mt-7">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-5 h-5 text-rose-500 drop-shadow-sm" strokeWidth={2.4} />
              <h2 className="font-black text-slate-800 text-[16px] text-3d">Perlu dilatih</h2>
            </div>
            {weak.length === 0 ? (
              <div className="bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white rounded-2xl p-4 text-center">
                <p className="text-[13px] font-bold text-[#1B9981]">Mantap! Tidak ada huruf lemah saat ini. 🎉</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {weak.map(({ label, acc }) => (
                  <Link
                    key={label.id}
                    href="/app/bipintar/quiz"
                    className="flex items-center gap-2 bg-[#f4f6fc] shadow-3d shadow-3d-active border border-white rounded-[20px] px-4 py-2.5 active:scale-95 transition-all"
                  >
                    <span className="text-[22px] leading-none text-rose-500 drop-shadow-sm" style={{ fontFamily: "Arial, sans-serif" }}>
                      {label.arabic}
                    </span>
                    <span className="text-[13px] font-bold text-rose-600 text-3d">
                      {label.indo} · {Math.round(acc * 100)}%
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Penguasaan per huruf */}
          <div className="mt-7">
            <h2 className="font-black text-slate-800 text-[16px] mb-4 text-3d">Penguasaan per huruf</h2>
            <div className="flex flex-col gap-3">
              {HIJAIYAH_LABELS.map((l) => {
                const st = stats!.letters?.[String(l.id)];
                const acc = accuracyOf(st);
                const pct = acc < 0 ? 0 : Math.round(acc * 100);
                const barColor = acc < 0 ? "bg-slate-300" : acc >= 0.8 ? "bg-[#1B9981]" : acc >= 0.4 ? "bg-amber-400" : "bg-rose-400";
                return (
                  <div key={l.id} className="flex items-center gap-3">
                    <span className="w-8 text-center text-[24px] leading-none text-[#1B9981] drop-shadow-sm" style={{ fontFamily: "Arial, sans-serif" }}>
                      {l.arabic}
                    </span>
                    <span className="w-16 text-[13px] font-bold text-slate-600 shrink-0 text-3d">{l.indo}</span>
                    <div className="flex-1 h-3 bg-[#f4f6fc] rounded-full overflow-hidden shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1),_inset_-1px_-1px_3px_rgba(255,255,255,1)] border border-white/50">
                      <div className={`h-full rounded-full ${barColor} shadow-[inset_0_-1px_2px_rgba(0,0,0,0.2)]`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-12 text-right text-[11px] font-bold text-slate-500 shrink-0">
                      {acc < 0 ? "—" : `${pct}%`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-[#f4f6fc] border border-white rounded-[24px] py-5 flex flex-col items-center shadow-3d">
      <div className="w-12 h-12 rounded-[16px] bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] text-[#1B9981] flex items-center justify-center mb-3 border border-white">
        {icon}
      </div>
      <div className="text-[20px] font-black text-slate-800 leading-none text-3d">{value}</div>
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}

function EmptyState({ text, cta, href }: { text: string; cta: string; href: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-24 h-24 rounded-full bg-[#f4f6fc] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)] border border-white flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-[#1B9981] drop-shadow-sm" strokeWidth={2} />
      </div>
      <p className="text-slate-500 font-bold text-[13px] max-w-[240px] leading-relaxed mb-8 text-3d">{text}</p>
      <Link href={href} className="px-8 py-4 rounded-[20px] bg-[#1B9981] shadow-[0_8px_16px_rgba(27,153,129,0.3)] border border-[#1B9981]/50 text-white font-black text-[14px] active:scale-95 transition-transform">
        {cta}
      </Link>
    </div>
  );
}
