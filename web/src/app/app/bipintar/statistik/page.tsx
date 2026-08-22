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
    <div className="min-h-full bg-white flex flex-col pb-10">
      {/* Header */}
      <div className="px-6 pt-12 pb-5">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/app/bipintar"
            aria-label="Kembali"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#00B894]/10 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-[#00B894]" strokeWidth={2.5} />
          </Link>
          <div className="w-11 h-11" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00B894]/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-[#00B894]" strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="text-[22px] font-black text-slate-800 tracking-tight leading-none">Statistik Belajar</h1>
            <p className="text-slate-400 text-[12px] font-semibold mt-1">Kemajuan Tantangan Isyarat Hijaiyah</p>
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
            <div className="flex items-center gap-2 mb-3">
              <Dumbbell className="w-5 h-5 text-rose-500" strokeWidth={2.4} />
              <h2 className="font-extrabold text-slate-800 text-[15px]">Perlu dilatih</h2>
            </div>
            {weak.length === 0 ? (
              <div className="bg-[#00B894]/5 border border-[#00B894]/15 rounded-2xl p-4 text-center">
                <p className="text-[13px] font-semibold text-[#00B894]">Mantap! Tidak ada huruf lemah saat ini. 🎉</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {weak.map(({ label, acc }) => (
                  <Link
                    key={label.id}
                    href="/app/bipintar/quiz"
                    className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-2xl px-3 py-2 active:scale-95 transition-transform"
                  >
                    <span className="text-[22px] leading-none text-rose-500" style={{ fontFamily: "Arial, sans-serif" }}>
                      {label.arabic}
                    </span>
                    <span className="text-[12px] font-bold text-rose-600">
                      {label.indo} · {Math.round(acc * 100)}%
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Penguasaan per huruf */}
          <div className="mt-7">
            <h2 className="font-extrabold text-slate-800 text-[15px] mb-3">Penguasaan per huruf</h2>
            <div className="flex flex-col gap-2">
              {HIJAIYAH_LABELS.map((l) => {
                const st = stats!.letters?.[String(l.id)];
                const acc = accuracyOf(st);
                const pct = acc < 0 ? 0 : Math.round(acc * 100);
                const barColor = acc < 0 ? "bg-slate-200" : acc >= 0.8 ? "bg-[#00B894]" : acc >= 0.4 ? "bg-amber-400" : "bg-rose-400";
                return (
                  <div key={l.id} className="flex items-center gap-3">
                    <span className="w-8 text-center text-[22px] leading-none text-slate-700" style={{ fontFamily: "Arial, sans-serif" }}>
                      {l.arabic}
                    </span>
                    <span className="w-16 text-[12px] font-bold text-slate-600 shrink-0">{l.indo}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-12 text-right text-[11px] font-bold text-slate-400 shrink-0">
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
    <div className="bg-white border border-slate-100 rounded-3xl py-4 flex flex-col items-center shadow-[0_4px_16px_-10px_rgba(0,0,0,0.2)]">
      <div className="w-9 h-9 rounded-xl bg-[#00B894]/10 text-[#00B894] flex items-center justify-center mb-1.5">
        {icon}
      </div>
      <div className="text-[19px] font-black text-slate-800 leading-none">{value}</div>
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}

function EmptyState({ text, cta, href }: { text: string; cta: string; href: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-20 h-20 rounded-full bg-[#00B894]/10 flex items-center justify-center mb-4">
        <BarChart3 className="w-9 h-9 text-[#00B894]" strokeWidth={1.8} />
      </div>
      <p className="text-slate-400 text-[13px] max-w-[240px] leading-relaxed mb-5">{text}</p>
      <Link href={href} className="px-6 py-3 rounded-2xl bg-[#00B894] text-white font-bold text-[14px] active:scale-95 transition-transform">
        {cta}
      </Link>
    </div>
  );
}
