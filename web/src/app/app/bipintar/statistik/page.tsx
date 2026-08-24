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
      {/* Header — Sticky 3D Neumorphism */}
      <div className="sticky top-0 z-50 px-6 pt-14 pb-6 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 bubble-3d text-white">
              <BarChart3 className="w-7 h-7 drop-shadow-md" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-[24px] font-black text-slate-800 tracking-tight leading-none text-3d">Statistik Belajar</h1>
              <p className="text-slate-500 text-[12px] font-bold mt-1.5 uppercase tracking-wide text-3d">Kemajuan Isyarat Hijaiyah</p>
            </div>
          </div>
          
          <Link
            href="/app/bipintar"
            aria-label="Kembali"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white active:scale-95 transition-transform shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-600 drop-shadow-sm" strokeWidth={2.5} />
          </Link>
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
            <StatCard icon={<Gamepad2 className="w-[22px] h-[22px] drop-shadow-md" strokeWidth={2.5} />} value={`${stats!.gamesPlayed}`} label="Sesi" bg="bg-gradient-to-br from-sky-400 to-sky-600" />
            <StatCard icon={<Target className="w-[22px] h-[22px] drop-shadow-md" strokeWidth={2.5} />} value={`${Math.round(overallAcc * 100)}%`} label="Akurasi" bg="bg-gradient-to-br from-amber-400 to-amber-500" />
            <StatCard icon={<Trophy className="w-[22px] h-[22px] drop-shadow-md" strokeWidth={2.5} />} value={`${masteredCount}/29`} label="Dikuasai" bg="bg-gradient-to-br from-purple-400 to-purple-600" />
          </div>

          {/* Huruf perlu dilatih */}
          <div className="mt-7">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-5 h-5 text-emerald-500 drop-shadow-sm" strokeWidth={2.4} />
              <h2 className="font-black text-slate-800 text-[16px] text-3d">Perlu dilatih</h2>
            </div>
            {weak.length === 0 ? (
              <div className="bg-[#f4f6fc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white rounded-2xl p-4 text-center">
                <p className="text-[13px] font-bold text-emerald-500">Mantap! Tidak ada huruf lemah saat ini. 🎉</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {weak.map(({ label, acc }) => {
                  const color = acc >= 0.4 ? "text-amber-500" : "text-rose-500";
                  const colorDark = acc >= 0.4 ? "text-amber-600" : "text-rose-600";
                  return (
                    <Link
                      key={label.id}
                      href="/app/bipintar/quiz"
                      className="flex items-center gap-2 bg-[#f4f6fc] shadow-3d shadow-3d-active border border-white rounded-[20px] px-4 py-2.5 active:scale-95 transition-all"
                    >
                      <span className={`text-[22px] leading-none ${color} drop-shadow-sm`} style={{ fontFamily: "Arial, sans-serif" }}>
                        {label.arabic}
                      </span>
                      <span className={`text-[13px] font-bold ${colorDark} text-3d`}>
                        {label.indo} · {Math.round(acc * 100)}%
                      </span>
                    </Link>
                  );
                })}
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
                const barColor = acc < 0 ? "bg-slate-300" : acc >= 0.8 ? "bg-emerald-500" : acc >= 0.4 ? "bg-amber-400" : "bg-rose-500";
                const textColor = acc < 0 ? "text-slate-400" : acc >= 0.8 ? "text-emerald-500" : acc >= 0.4 ? "text-amber-500" : "text-rose-500";
                return (
                  <div key={l.id} className="flex items-center gap-3">
                    <span className={`w-8 text-center text-[24px] leading-none ${textColor} drop-shadow-sm`} style={{ fontFamily: "Arial, sans-serif" }}>
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

function StatCard({ icon, value, label, bg }: { icon: React.ReactNode; value: string; label: string; bg: string }) {
  return (
    <div className="bg-[#f4f6fc] border border-white rounded-[24px] py-5 flex flex-col items-center shadow-3d">
      <div className={`w-12 h-12 rounded-[16px] ${bg} bubble-3d text-white flex items-center justify-center mb-3 shrink-0`}>
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
        <BarChart3 className="w-10 h-10 text-emerald-500 drop-shadow-sm" strokeWidth={2} />
      </div>
      <p className="text-slate-500 font-bold text-[13px] max-w-[240px] leading-relaxed mb-8 text-3d">{text}</p>
      <Link href={href} className="px-8 py-4 rounded-[20px] bg-emerald-500 shadow-[0_8px_16px_rgba(16,185,129,0.3)] border border-emerald-500/50 text-white font-black text-[14px] active:scale-95 transition-transform">
        {cta}
      </Link>
    </div>
  );
}
