"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Camera, MapPin, Activity, CheckCircle2, AlertTriangle, ExternalLink, Trash2, Search, Filter } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface ObstacleReport {
  id: string;
  reporterId?: string;
  reporterName?: string;
  obstacleType: string;
  description: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  isResolved?: boolean;
  createdAt?: any;
}

export default function RintanganDashboard() {
  const [reports, setReports] = useState<ObstacleReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'single', id: string } | { type: 'bulk', count: number } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  useEffect(() => {
    const q = query(
      collection(db, "obstacle_reports"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ObstacleReport[];
      setReports(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching obstacle reports:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleResolveAction = async (id: string) => {
    try {
      const reportRef = doc(db, "obstacle_reports", id);
      await updateDoc(reportRef, {
        isResolved: true,
      });
    } catch (error) {
      console.error("Error updating report status:", error);
      alert("Gagal memperbarui status.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "obstacle_reports", id));
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Gagal menghapus laporan.");
    }
  };

  const handleDeleteResolved = async () => {
    const resolved = reports.filter((r) => r.isResolved);
    if (resolved.length === 0) {
      alert("Tidak ada laporan selesai untuk dihapus.");
      return;
    }
    setConfirmDelete({ type: 'bulk', count: resolved.length });
  };

  const executeBulkDelete = async () => {
    const resolved = reports.filter((r) => r.isResolved);
    try {
      await Promise.all(resolved.map((r) => deleteDoc(doc(db, "obstacle_reports", r.id))));
    } catch (error) {
      console.error("Error bulk delete:", error);
      alert("Sebagian laporan gagal dihapus.");
    }
  };

  const getStatusBadge = (isResolved: boolean | undefined) => {
    if (!isResolved) {
      return (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold neo-flat text-amber-500">
          <AlertTriangle className="w-3.5 h-3.5" />
          Butuh Perbaikan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold neo-pressed text-slate-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Sudah Diperbaiki
      </span>
    );
  };

  const filteredReports = reports.filter((report) => {
    const queryStr = searchQuery.toLowerCase();
    const typeMatch = (report.obstacleType || "").toLowerCase().includes(queryStr);
    const descMatch = (report.description || "").toLowerCase().includes(queryStr);
    
    let statusMatch = true;
    if (statusFilter !== "Semua") {
      if (statusFilter === "Sudah Diperbaiki") statusMatch = !!report.isResolved;
      if (statusFilter === "Butuh Perbaikan") statusMatch = !report.isResolved;
    }
    
    return (typeMatch || descMatch) && statusMatch;
  });

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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="flex gap-4 sm:gap-5">
          <div className="p-3.5 sm:p-4 neo-icon-btn rounded-2xl text-[#00B894] h-fit shrink-0">
            <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <div className="pt-1 sm:pt-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Laporan Rintangan
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm sm:text-base font-medium leading-relaxed">
              Monitoring titik rintangan dari fitur BiJALAN
            </p>
          </div>
        </div>
      </header>

      <div className="neo-flat p-4 sm:p-6 overflow-hidden">
        <div className="px-4 py-2 mb-4 flex flex-col xl:flex-row items-start xl:items-center justify-between border-b border-white/20 pb-4 gap-4">
          <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-start">
            <h2 className="font-extrabold text-lg text-slate-800 tracking-tight">Daftar Titik Rintangan</h2>
            <span className="text-xs font-bold neo-pressed text-[#00B894] px-4 py-2 rounded-full whitespace-nowrap">
              {filteredReports.length} Laporan
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari rintangan..."
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
                <option value="Butuh Perbaikan">Butuh Perbaikan</option>
                <option value="Sudah Diperbaiki">Sudah Diperbaiki</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <button
              onClick={handleDeleteResolved}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold neo-flat text-rose-500 hover:-translate-y-[2px] transition-all border-none"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" /> Hapus Selesai
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="neo-flat h-[140px] lg:h-[100px] w-full rounded-2xl overflow-hidden shimmer"></div>
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center neo-pressed rounded-3xl mt-4 border-none">
              <div className="w-16 h-16 neo-icon-btn rounded-2xl flex items-center justify-center mb-5 border-none animate-shake">
                <CheckCircle2 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-slate-700 font-extrabold text-xl">Lingkungan Bebas Hambatan</h3>
              <p className="text-slate-500 text-sm mt-1.5 font-bold">Belum ada laporan rintangan fisik yang masuk ke sistem atau sesuai filter.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <div className="flex flex-col gap-4">
                {/* Header Row (Desktop Only) */}
                <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 items-center neo-flat px-6 py-4 mb-2">
                  <div className="col-span-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Status & Waktu</div>
                  <div className="col-span-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Foto & Jenis</div>
                  <div className="col-span-2 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Deskripsi</div>
                  <div className="col-span-2 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Lokasi</div>
                  <div className="col-span-2 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Tindakan</div>
                </div>

                {/* Data Rows */}
                {filteredReports.map((report) => (
                  <motion.div 
                    variants={itemVariants}
                    key={report.id}
                    className="neo-flat transition-all duration-300 hover:-translate-y-1 flex flex-col lg:grid lg:grid-cols-12 lg:items-center p-5 lg:px-6 lg:py-5 gap-5 lg:gap-4 border-none"
                  >
                    {/* Status & Waktu */}
                    <div className="col-span-3">
                      <div className="flex lg:hidden text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Status & Waktu</div>
                      <div className="mb-4">{getStatusBadge(report.isResolved)}</div>
                      <div className="text-[13px] text-slate-600 font-extrabold mb-1 tracking-wide">
                        {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleString('id-ID', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'
                        }) : 'Baru saja'}
                      </div>
                      <div className="text-xs text-slate-400 capitalize font-bold">Oleh: {report.reporterName || 'Anonim'}</div>
                    </div>

                    {/* Foto & Jenis */}
                    <div className="col-span-3">
                      <div className="flex lg:hidden text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Foto & Jenis</div>
                      <div className="flex items-center gap-4">
                        {report.photoUrl ? (
                          <a href={report.photoUrl} target="_blank" rel="noreferrer" className="block relative w-16 h-16 rounded-xl overflow-hidden neo-pressed p-1">
                            <img src={report.photoUrl} alt="Obstacle" className="w-full h-full object-cover rounded-lg" />
                          </a>
                        ) : (
                          <div className="w-16 h-16 neo-pressed rounded-xl flex items-center justify-center">
                            <Camera className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div className="font-extrabold text-slate-800 tracking-tight capitalize">{report.obstacleType}</div>
                      </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="col-span-2">
                      <div className="flex lg:hidden text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Deskripsi</div>
                      <p className="text-sm text-slate-600 font-bold max-w-xs">{report.description || '-'}</p>
                    </div>

                    {/* Lokasi */}
                    <div className="col-span-2">
                      <div className="flex lg:hidden text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Lokasi</div>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold neo-pressed text-slate-600 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Buka di Peta
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-50" />
                      </a>
                    </div>

                    {/* Tindakan */}
                    <div className="col-span-2 mt-2 lg:mt-0 flex items-center lg:justify-end gap-3">
                      {report.isResolved ? (
                        <button disabled className="w-full lg:w-auto px-4 py-2.5 lg:py-2.5 rounded-xl text-sm font-bold neo-pressed text-slate-400 cursor-not-allowed border-none">
                          Telah Diperbaiki
                        </button>
                      ) : (
                        <button onClick={() => handleResolveAction(report.id)} className="w-full lg:w-auto px-4 py-2.5 lg:py-2.5 rounded-xl text-sm font-bold neo-flat-primary border-none hover:-translate-y-[2px]">
                          Selesai
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDelete({ type: 'single', id: report.id })}
                        title="Hapus laporan"
                        className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-bold neo-icon-btn text-rose-500 border-none transition-all hover:-translate-y-[2px]"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

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
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">
                {confirmDelete.type === 'bulk' ? `Hapus ${confirmDelete.count} Laporan?` : 'Hapus Laporan?'}
              </h3>
              <p className="text-sm text-slate-500 mb-6 font-bold leading-relaxed">
                {confirmDelete.type === 'bulk' 
                  ? 'Apakah Anda yakin ingin menghapus semua laporan yang sudah selesai secara permanen?' 
                  : 'Apakah Anda yakin ingin menghapus laporan rintangan ini secara permanen?'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 px-4 neo-flat text-slate-600 font-bold rounded-xl hover:-translate-y-[2px] transition-all border-none"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (confirmDelete.type === 'bulk') executeBulkDelete();
                    else handleDelete(confirmDelete.id);
                    setConfirmDelete(null);
                  }}
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
