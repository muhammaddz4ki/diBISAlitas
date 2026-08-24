"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { EmergencyReport } from "@/lib/types";
import { History, MapPin, Clock, CheckCircle2, ShieldAlert, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EmergencyHistoryPage() {
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "emergency_reports"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: EmergencyReport[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as EmergencyReport);
      });
      setReports(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching emergency reports:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDateTime = (timestamp: EmergencyReport["createdAt"]) => {
    if (!timestamp) return "-";
    // Check if it's a Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp as unknown as string);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase tracking-wider">Selesai Ditangani</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 animate-pulse">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span className="text-xs font-bold uppercase tracking-wider">Butuh Pertolongan</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#00B894] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <div className="p-2.5 bg-[#00B894]/10 rounded-xl text-[#00B894]">
              <History className="w-6 h-6" />
            </div>
            Riwayat Darurat
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Pantau dan kelola seluruh riwayat laporan darurat dari pengguna.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Waktu Kejadian</th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Pelapor</th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Titik Lokasi</th>
                <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    Belum ada riwayat laporan darurat.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        {formatDateTime(report.createdAt)}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="font-bold text-slate-900">
                        {report.reporterName || report.userName || "Pengguna Anonim"}
                      </div>
                      {(report.email || report.reporterEmail) && (
                        <div className="text-sm text-slate-500 mt-0.5">{report.email || report.reporterEmail}</div>
                      )}
                    </td>
                    <td className="py-5 px-6">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded-lg w-fit">
                          Lat: {report.latitude?.toFixed(5) || "-"}
                        </span>
                        <span className="text-sm font-medium text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded-lg w-fit">
                          Lng: {report.longitude?.toFixed(5) || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {report.latitude && report.longitude ? (
                          <a
                            href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00B894]/10 text-[#00B894] hover:bg-[#00B894] hover:text-white rounded-xl font-bold text-sm transition-colors"
                          >
                            <MapPin className="w-4 h-4 shrink-0" />
                            Buka Peta
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400 font-medium">Lokasi tidak valid</span>
                        )}
                        <button
                          onClick={() => setConfirmDelete(report.id)}
                          title="Hapus riwayat"
                          className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-rose-500 border border-rose-200 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-rose-500" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Hapus Riwayat?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">Apakah Anda yakin ingin menghapus riwayat laporan darurat ini secara permanen?</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 rounded-2xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</button>
                <button onClick={() => { handleDelete(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30">Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
