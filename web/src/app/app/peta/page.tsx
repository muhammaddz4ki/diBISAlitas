"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { MapPin, User, Calendar, ThumbsUp, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, query, orderBy, updateDoc, doc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ObstacleReport {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  obstacleType: string;
  reporterName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
  densityCount?: number;
  upvoteCount?: number;
  photoUrl?: string;
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Leaflet must be loaded client-side only (no SSR)
const PetaMapComponent = dynamic(() => import("./PetaMapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50/50 rounded-[20px] animate-pulse flex items-center justify-center min-h-[400px] border border-slate-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#1B9981]/30 border-t-[#1B9981] rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-[13px] tracking-wide">Memuat Peta...</p>
      </div>
    </div>
  ),
});

export default function PetaPage() {
  const [reports, setReports] = useState<ObstacleReport[]>([]);
  const [confirmedIds, setConfirmedIds] = useState<Record<string, boolean>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const q = query(collection(db, "obstacle_reports"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const raw: ObstacleReport[] = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data.latitude && data.longitude) raw.push({ id: d.id, ...data } as ObstacleReport);
      });
      const clustered = raw.map((r) => {
        let count = 0;
        raw.forEach((o) => {
          if (getDistanceKm(r.latitude, r.longitude, o.latitude, o.longitude) <= 0.1) count++;
        });
        return { ...r, densityCount: count };
      });
      setReports(clustered);
    });
    return () => unsub();
  }, []);

  const confirmObstacle = async (id: string) => {
    if (confirmedIds[id]) return;
    setConfirmedIds((c) => ({ ...c, [id]: true }));
    try {
      await updateDoc(doc(db, "obstacle_reports", id), { upvoteCount: increment(1) });
    } catch {
      /* abaikan */
    }
  };

  const handleDetailClick = (id: string) => {
    const el = itemRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-4", "ring-[#00B894]/50", "bg-[#E8F4F1]");
      setTimeout(() => {
        el.classList.remove("ring-4", "ring-[#00B894]/50", "bg-[#E8F4F1]");
      }, 1500);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (ts: any) => {
    if (!ts) return "-";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: '2-digit', minute: '2-digit' }).format(d);
  };

  return (
    <div className="min-h-full bg-[#f4f6fc] selection:bg-[#1B9981]/20 flex flex-col">
      {/* Header — Sticky 3D Neumorphism */}
      <div className="sticky top-0 z-50 px-6 pt-5 pb-5 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00B894] to-[#00D4AA] flex items-center justify-center shrink-0 bubble-3d text-white">
            <MapPin className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-tight text-3d">Peta Komunitas</h1>
            <p className="text-slate-500 text-[13px] font-medium mt-0.5 text-3d">Rintangan &amp; jalur aman dilaporkan bersama</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 relative z-20 flex flex-col gap-6 pb-6">
        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-full bg-[#f4f6fc] rounded-[24px] shadow-3d border border-white overflow-hidden p-1 min-h-[450px]"
        >
          <PetaMapComponent reports={reports} onDetailClick={handleDetailClick} />
        </motion.div>

        {/* Detailed Reports List */}
        <div ref={listRef} className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[16px] font-extrabold text-slate-800 tracking-tight text-3d">Detail Laporan</h2>
            <span className="text-[12px] font-bold text-slate-500 bg-white/50 px-3 py-1 rounded-full shadow-inner border border-white/50">
              {reports.length} Laporan
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {reports.map((r) => (
                <motion.div
                  key={r.id}
                  ref={(el) => { itemRefs.current[r.id] = el; }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-transparent rounded-[24px] p-5 shadow-3d border border-white flex flex-col gap-3 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1B9981] to-[#00D4AA] flex items-center justify-center shrink-0 shadow-3d icon-3d">
                        <MapPin className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-[16px] tracking-tight text-3d">{r.obstacleType || "Rintangan"}</h4>
                        <div className="flex items-center gap-2 text-[12px] text-slate-500 mt-1">
                          <User className="w-3.5 h-3.5" />
                          <span className="font-medium text-3d">{r.reporterName || "Anonim"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#f4f6fc] px-3 py-1.5 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] border border-white flex items-center gap-1.5 shrink-0">
                      <Calendar className="w-3 h-3 text-[#1B9981]" />
                      <span className="text-[10px] font-bold text-slate-600">{formatDate(r.createdAt)}</span>
                    </div>
                  </div>

                  {r.photoUrl && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-100 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.1)] border border-white/50 my-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.photoUrl} alt="Foto Rintangan" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <p className="text-[14px] text-slate-600 leading-relaxed font-medium px-1">
                    {r.description || "Tidak ada detail laporan."}
                  </p>

                  <div className="h-[1px] w-full bg-slate-200/50 my-1 shadow-[0_1px_1px_rgba(255,255,255,1)]" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                    {typeof r.upvoteCount === "number" && r.upvoteCount > 0 ? (
                      <div className="flex items-center gap-2 text-[13px] text-[#00B894] font-bold bg-[#00B894]/10 px-3 py-1.5 rounded-xl border border-[#00B894]/20">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Dikonfirmasi {r.upvoteCount}x oleh komunitas</span>
                      </div>
                    ) : (
                      <div className="text-[12px] text-slate-400 font-medium italic">Belum dikonfirmasi komunitas</div>
                    )}
                    
                    <button
                      onClick={() => confirmObstacle(r.id)}
                      disabled={!!confirmedIds[r.id]}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-[16px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
                        confirmedIds[r.id] 
                          ? "bg-slate-100 text-slate-400 border border-slate-200" 
                          : "bg-gradient-to-br from-[#1B9981] to-[#00D4AA] text-white shadow-3d shadow-3d-active icon-3d"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${confirmedIds[r.id] ? "" : "drop-shadow-md"}`} /> 
                      {confirmedIds[r.id] ? "Terima kasih!" : "Masih ada di sini"}
                    </button>
                  </div>
                </motion.div>
              ))}
              {reports.length === 0 && (
                <div className="text-center py-10 px-4">
                  <div className="w-16 h-16 rounded-full bg-[#f4f6fc] shadow-[inset_3px_3px_8px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)] border border-white flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-semibold text-3d text-[14px]">Belum ada laporan dari komunitas.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}