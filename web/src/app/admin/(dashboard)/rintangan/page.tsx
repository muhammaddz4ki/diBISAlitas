"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Camera, MapPin, Activity, CheckCircle2, AlertTriangle, ExternalLink, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

import { INITIAL_DEMO_OBSTACLES, isAdminDemoMode, safeFormatDate } from "@/lib/adminDemoData";

export default function RintanganDashboard() {
  const [reports, setReports] = useState<ObstacleReport[]>(INITIAL_DEMO_OBSTACLES);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'single', id: string } | { type: 'bulk', count: number } | null>(null);

  useEffect(() => {
    if (isAdminDemoMode()) {
      setReports(INITIAL_DEMO_OBSTACLES);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "obstacle_reports"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ObstacleReport[];
        setReports(data);
        setLoading(false);
      },
      (error) => {
        // Fallback gracefully to demo data if unauthenticated/permission error
        console.warn("Using demo dataset for obstacle reports:", error.message);
        setReports(INITIAL_DEMO_OBSTACLES);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleResolveAction = async (id: string) => {
    // Update local state immediately for fast feedback
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isResolved: true } : r))
    );

    if (isAdminDemoMode()) return;

    try {
      const reportRef = doc(db, "obstacle_reports", id);
      await updateDoc(reportRef, {
        isResolved: true,
      });
    } catch (error) {
      console.warn("Demo mode status update handled locally:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (isAdminDemoMode()) return;

    try {
      await deleteDoc(doc(db, "obstacle_reports", id));
    } catch (error) {
      console.warn("Demo mode deletion handled locally:", error);
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
    setReports((prev) => prev.filter((r) => !r.isResolved));
    setConfirmDelete(null);

    if (isAdminDemoMode()) return;

    try {
      await Promise.all(resolved.map((r) => deleteDoc(doc(db, "obstacle_reports", r.id))));
    } catch (error) {
      console.warn("Demo mode bulk delete handled locally:", error);
    }
  };

  const getStatusBadge = (isResolved: boolean | undefined) => {
    if (!isResolved) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
          <AlertTriangle className="w-3.5 h-3.5" />
          Butuh Perbaikan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#00B894]/10 text-[#00B894] border border-[#00B894]/20">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Sudah Diperbaiki
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Laporan Rintangan</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Monitoring titik rintangan dari fitur BiJALAN</p>
        </div>
        <button
          onClick={handleDeleteResolved}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-rose-500 border border-rose-200 hover:bg-rose-50 transition-colors self-start"
        >
          <Trash2 className="w-4 h-4" /> Hapus yang Selesai
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Activity className="w-8 h-8 text-[#00B894] animate-spin mb-4" />
          <p className="text-slate-400 text-sm font-medium">Memuat data rintangan...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-slate-800 tracking-tight">Daftar Titik Rintangan</h2>
            <span className="text-xs font-semibold bg-slate-50 text-slate-500 px-3 py-1 rounded-full border border-slate-100">
              {reports.length} Laporan
            </span>
          </div>
          
          {reports.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 border border-slate-100">
                <CheckCircle2 className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-600 font-semibold text-lg">Lingkungan Bebas Hambatan</p>
              <p className="text-slate-400 text-sm mt-1.5 font-medium">Belum ada laporan rintangan fisik yang masuk ke sistem.</p>
            </div>
          ) : (
            <div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status & Waktu</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Foto & Jenis</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Lokasi</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 align-top">
                        <div className="mb-2">{getStatusBadge(report.isResolved)}</div>
                        <div className="text-xs text-slate-500 font-medium">
                          {safeFormatDate(report.createdAt, {
                            day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'
                          })}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 capitalize font-medium">Oleh: {report.reporterName || 'Anonim'}</div>
                      </td>
                      <td className="px-8 py-5 align-top">
                        <div className="flex items-center gap-4">
                          {report.photoUrl ? (
                            <a href={report.photoUrl} target="_blank" rel="noreferrer" className="block relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                              <img src={report.photoUrl} alt="Obstacle" className="w-full h-full object-cover" />
                            </a>
                          ) : (
                            <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                              <Camera className="w-5 h-5 text-slate-300" />
                            </div>
                          )}
                          <div className="font-semibold text-slate-800 tracking-tight capitalize">{report.obstacleType}</div>
                        </div>
                      </td>
                      <td className="px-8 py-5 align-top">
                        <p className="text-sm text-slate-600 font-medium max-w-xs">{report.description || '-'}</p>
                      </td>
                      <td className="px-8 py-5 align-top">
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            Buka di Peta
                            <ExternalLink className="w-3 h-3 ml-0.5 opacity-50" />
                          </a>
                      </td>
                      <td className="px-8 py-5 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          {report.isResolved ? (
                            <button disabled className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed">
                              Telah Diperbaiki
                            </button>
                          ) : (
                            <button onClick={() => handleResolveAction(report.id)} className="px-4 py-2 rounded-xl text-sm font-semibold bg-white text-[#00B894] border border-[#00B894]/30 hover:bg-[#00B894] hover:text-white transition-all shadow-sm">
                              Tandai Selesai
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmDelete({ type: 'single', id: report.id })}
                            title="Hapus laporan"
                            className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-rose-500 border border-rose-200 hover:bg-rose-500 hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-rose-500" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {confirmDelete.type === 'bulk' ? `Hapus ${confirmDelete.count} Laporan?` : 'Hapus Laporan?'}
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {confirmDelete.type === 'bulk' 
                  ? 'Apakah Anda yakin ingin menghapus semua laporan yang sudah selesai secara permanen?' 
                  : 'Apakah Anda yakin ingin menghapus laporan rintangan ini secara permanen?'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 rounded-2xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</button>
                <button 
                  onClick={() => { 
                    if (confirmDelete.type === 'single') handleDelete(confirmDelete.id); 
                    else executeBulkDelete();
                    setConfirmDelete(null); 
                  }} 
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30"
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
