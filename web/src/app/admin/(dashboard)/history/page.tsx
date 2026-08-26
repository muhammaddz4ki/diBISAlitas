"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { EmergencyReport } from "@/lib/types";
import { History, MapPin, Clock, CheckCircle2, ShieldAlert, Trash2, Search, Filter } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { INITIAL_DEMO_EMERGENCIES, isAdminDemoMode, safeFormatDate } from "@/lib/adminDemoData";

export default function EmergencyHistoryPage() {
  const [reports, setReports] = useState<EmergencyReport[]>(INITIAL_DEMO_EMERGENCIES as any);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  useEffect(() => {
    if (isAdminDemoMode()) {
      setReports(INITIAL_DEMO_EMERGENCIES as any);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "emergency_reports"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: EmergencyReport[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as EmergencyReport);
        });
        setReports(data);
        setIsLoading(false);
      },
      (error) => {
        console.warn("Using demo dataset for history:", error.message);
        setReports(INITIAL_DEMO_EMERGENCIES as any);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatDateTime = (timestamp: any) => {
    return safeFormatDate(timestamp);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "emergency_reports", id));
    } catch (error) {
      console.error("Error deleting emergency report:", error);
      alert("Gagal menghapus riwayat.");
    }
  };

  const getStatusBadge = (status?: string) => {
    const isCompleted = status?.toLowerCase() === "selesai" || status?.toLowerCase() === "resolved";

    if (isCompleted) {
      return (
        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full neo-pressed text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase tracking-wider">Selesai Ditangani</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full neo-flat text-amber-500">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span className="text-xs font-bold uppercase tracking-wider">Butuh Pertolongan</span>
      </div>
    );
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 10 } }
  };

  const filteredReports = reports.filter((report) => {
    const queryStr = searchQuery.toLowerCase();
    const nameMatch = (report.reporterName || report.userName || "Pengguna Anonim").toLowerCase().includes(queryStr);
    const emailMatch = (report.email || report.reporterEmail || "").toLowerCase().includes(queryStr);
    
    let statusMatch = true;
    if (statusFilter !== "Semua") {
      const isCompleted = report.status?.toLowerCase() === "selesai" || report.status?.toLowerCase() === "resolved";
      if (statusFilter === "Selesai") statusMatch = isCompleted;
      if (statusFilter === "Butuh Pertolongan") statusMatch = !isCompleted;
    }
    
    return (nameMatch || emailMatch) && statusMatch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="flex gap-4 sm:gap-5">
          <div className="p-3.5 sm:p-4 neo-icon-btn rounded-2xl text-[#00B894] h-fit shrink-0">
            <History className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <div className="pt-1 sm:pt-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Riwayat Darurat
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm sm:text-base font-medium leading-relaxed">
              Pantau dan kelola seluruh riwayat laporan darurat dari pengguna
            </p>
          </div>
        </div>
      </header>

      <div className="neo-flat p-4 sm:p-6 overflow-hidden">
        <div className="px-4 py-2 mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-white/20 pb-4 gap-4">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <h2 className="font-extrabold text-lg text-slate-800 tracking-tight">Daftar Riwayat</h2>
            <span className="text-xs font-bold neo-pressed text-[#00B894] px-4 py-2 rounded-full">
              {filteredReports.length} Laporan
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari pelapor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl neo-pressed border-none text-sm font-extrabold text-slate-700 focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="relative w-full sm:w-auto shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2.5 rounded-xl neo-pressed border-none text-sm font-extrabold text-slate-700 focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="Butuh Pertolongan">Butuh Pertolongan</option>
                <option value="Selesai">Selesai</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="neo-flat h-[120px] lg:h-[80px] w-full rounded-2xl overflow-hidden shimmer"></div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center neo-pressed rounded-3xl mt-4 border-none">
              <div className="w-16 h-16 neo-icon-btn rounded-2xl flex items-center justify-center mb-5 border-none animate-shake">
                <History className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-slate-700 font-extrabold text-xl">Riwayat Kosong</h3>
              <p className="text-slate-500 text-sm mt-1.5 font-bold">Belum ada riwayat laporan darurat yang sesuai.</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-4"
            >
              {/* Header Row (Desktop Only) */}
              <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 items-center neo-flat px-6 py-4 mb-3">
                <div className="col-span-2 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider pl-0">Waktu Kejadian</div>
                <div className="col-span-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Pelapor</div>
                <div className="col-span-2 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Status</div>
                <div className="col-span-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Titik Lokasi</div>
                <div className="col-span-2 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right pr-0">Aksi</div>
              </div>

              {/* Data Rows */}
              {filteredReports.map((report) => (
                <motion.div 
                  variants={itemVariants}
                  key={report.id} 
                  className="neo-flat transition-all duration-300 hover:-translate-y-1 flex flex-col lg:grid lg:grid-cols-12 lg:items-center p-5 lg:px-6 lg:py-5 gap-5 lg:gap-4 border-none"
                >
                  
                  {/* Waktu Kejadian */}
                  <div className="col-span-2">
                    <div className="flex lg:hidden text-[11px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Waktu Kejadian</div>
                    <div className="flex items-center gap-2 text-slate-600 font-extrabold tracking-wide text-[13px]">
                      <Clock className="w-4 h-4 text-[#00B894] shrink-0" />
                      {formatDateTime(report.createdAt)}
                    </div>
                  </div>

                  {/* Pelapor */}
                  <div className="col-span-3">
                    <div className="flex lg:hidden text-[11px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Pelapor</div>
                    <div className="font-extrabold text-slate-800 tracking-tight text-[14px]">
                      {report.reporterName || report.userName || "Pengguna Anonim"}
                    </div>
                    {(report.email || report.reporterEmail) && (
                      <div className="text-xs font-bold text-slate-500 mt-0.5">{report.email || report.reporterEmail}</div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <div className="flex lg:hidden text-[11px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">Status</div>
                    {getStatusBadge(report.status)}
                  </div>

                  {/* Titik Lokasi */}
                  <div className="col-span-3">
                    <div className="flex lg:hidden text-[11px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">Titik Lokasi</div>
                    <div className="flex flex-row lg:flex-col gap-2.5 lg:gap-2">
                      <span className="text-[12px] font-bold text-slate-500 font-mono neo-pressed px-3 py-1.5 rounded-lg w-fit">
                        Lat: {report.latitude?.toFixed(5) || "-"}
                      </span>
                      <span className="text-[12px] font-bold text-slate-500 font-mono neo-pressed px-3 py-1.5 rounded-lg w-fit">
                        Lng: {report.longitude?.toFixed(5) || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Aksi */}
                  <div className="col-span-2 mt-2 lg:mt-0 flex items-center lg:justify-end gap-3">
                    {report.latitude && report.longitude ? (
                      <a
                        href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 lg:py-2.5 neo-flat-primary rounded-xl font-bold text-sm transition-colors border-none hover:-translate-y-[2px]"
                      >
                        <MapPin className="w-4 h-4 shrink-0" />
                        Peta
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400 font-bold neo-pressed px-4 py-3 lg:py-2.5 rounded-xl flex-1 lg:flex-none text-center border-none">Tidak valid</span>
                    )}
                    <button
                      onClick={() => setConfirmDelete(report.id)}
                      title="Hapus riwayat"
                      className="w-12 h-12 lg:w-11 lg:h-11 shrink-0 rounded-xl flex items-center justify-center font-bold neo-icon-btn text-rose-500 border-none hover:text-white hover:bg-rose-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

      {/* Modal Konfirmasi Hapus */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm bg-[#E8F4F1] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 p-6 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full neo-pressed flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-rose-500" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Hapus Riwayat?</h3>
              <p className="text-sm font-bold text-slate-500 mb-6 leading-relaxed">Apakah Anda yakin ingin menghapus riwayat laporan darurat ini secara permanen?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 px-4 neo-flat text-slate-600 font-bold rounded-xl hover:-translate-y-[2px] transition-all border-none"
                >
                  Batal
                </button>
                <button
                  onClick={() => { handleDelete(confirmDelete); setConfirmDelete(null); }}
                  className="flex-1 py-3 px-4 neo-flat text-white font-bold bg-rose-500 hover:bg-rose-600 rounded-xl hover:-translate-y-[2px] transition-all border-none"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
