"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Camera, MapPin, Activity, CheckCircle2, XCircle, AlertCircle, ExternalLink, ShieldAlert, Search, Filter } from "lucide-react";

// Types
interface EmergencyReport {
  id: string;
  userId: string;
  userName?: string;
  userPhone?: string;
  disabilityType?: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  message?: string;
  status: string;
  timestamp?: any;
  createdAt?: any;
}

import { INITIAL_DEMO_EMERGENCIES, isAdminDemoMode, safeFormatDate } from "@/lib/adminDemoData";

export default function AdminDashboard() {
  const [reports, setReports] = useState<EmergencyReport[]>(INITIAL_DEMO_EMERGENCIES as any);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  useEffect(() => {
    if (isAdminDemoMode()) {
      setReports(INITIAL_DEMO_EMERGENCIES as any);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "emergency_reports"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EmergencyReport[];
      setReports(data);
      setLoading(false);
    }, (error) => {
      console.warn("Using demo dataset for dashboard:", error.message);
      setReports(INITIAL_DEMO_EMERGENCIES as any);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleResolveAction = async (id: string) => {
    if (isAdminDemoMode()) {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: "resolved" } : r));
      alert("Mode Demo (Hanya Pantau): Status diperbarui di tampilan simulasi. Data server asli tetap aman.");
      return;
    }
    try {
      const reportRef = doc(db, "emergency_reports", id);
      await updateDoc(reportRef, {
        status: "resolved",
      });
    } catch (error) {
      console.error("Error updating report status:", error);
      alert("Gagal memperbarui status. Pastikan koneksi internet stabil.");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pending' || status === 'active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold neo-flat text-[#00B894]">
          <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
          Darurat
        </span>
      );
    }
    if (status === 'resolved' || status === 'Selesai') {
      return (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold neo-pressed text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Selesai
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold neo-pressed text-rose-400">
          <XCircle className="w-3.5 h-3.5" />
          Dibatalkan
        </span>
      );
    }
    
    return <span className="text-slate-400 text-xs font-medium">{status}</span>;
  };

  const filteredReports = reports.filter((report) => {
    const queryStr = searchQuery.toLowerCase();
    const nameMatch = (report.userName || "Pengguna Anonim").toLowerCase().includes(queryStr);
    const phoneMatch = (report.userPhone || "").toLowerCase().includes(queryStr);
    const typeMatch = (report.disabilityType || "Umum").toLowerCase().includes(queryStr);
    
    let statusMatch = true;
    if (statusFilter !== "Semua") {
      if (statusFilter === "Darurat") statusMatch = report.status === "pending" || report.status === "active";
      if (statusFilter === "Selesai") statusMatch = report.status === "resolved" || report.status === "Selesai";
      if (statusFilter === "Dibatalkan") statusMatch = report.status === "cancelled";
    }
    
    return (nameMatch || phoneMatch || typeMatch) && statusMatch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="flex gap-4 sm:gap-5">
          <div className="p-3.5 sm:p-4 neo-icon-btn rounded-2xl text-[#00B894] h-fit shrink-0">
            <Activity className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <div className="pt-1 sm:pt-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Command Center
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm sm:text-base font-medium leading-relaxed">
              Monitoring Darurat BiSAFE secara real-time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <div className="flex items-center gap-2.5 neo-pressed px-5 py-2.5 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B894] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00B894]"></span>
            </span>
            <span className="text-sm font-bold text-slate-600 tracking-wide">Sistem Aktif</span>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 neo-flat">
          <Activity className="w-8 h-8 text-[#00B894] animate-spin mb-4" />
          <p className="text-slate-400 text-sm font-bold">Memuat data real-time...</p>
        </div>
      ) : (
        <div className="neo-flat p-4 sm:p-6 overflow-hidden">
          <div className="px-4 py-2 mb-4 flex flex-col xl:flex-row items-start xl:items-center justify-between border-b border-white/20 pb-4 gap-4">
            <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-start">
              <h2 className="font-extrabold text-lg text-slate-800 tracking-tight">Laporan Darurat Terbaru</h2>
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
                  placeholder="Cari pengguna..."
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
                  <option value="Darurat">Darurat</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
          
          {filteredReports.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center neo-pressed rounded-3xl mt-4">
              <div className="w-16 h-16 neo-icon-btn rounded-2xl flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-slate-700 font-extrabold text-xl">Situasi Aman Terkendali</h3>
              <p className="text-slate-500 text-sm mt-1.5 font-bold">Belum ada laporan darurat yang masuk ke sistem.</p>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-4">
                {/* Header Row (Desktop Only) */}
                <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 items-center neo-flat px-6 py-4 mb-2">
                  <div className="col-span-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status</div>
                  <div className="col-span-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Waktu</div>
                  <div className="col-span-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pengguna</div>
                  <div className="col-span-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Detail</div>
                  <div className="col-span-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">Tindakan</div>
                </div>

                {/* Data Rows */}
                {filteredReports.map((report) => (
                  <div key={report.id} className="neo-flat flex flex-col lg:grid lg:grid-cols-12 lg:items-center p-5 lg:px-6 lg:py-5 gap-4 lg:gap-4 transition-all duration-300 hover:-translate-y-1">
                    {/* Status */}
                    <div className="col-span-2">
                      <div className="flex lg:hidden text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Status</div>
                      <div>{getStatusBadge(report.status)}</div>
                    </div>

                    {/* Waktu */}
                    <div className="col-span-2 text-sm text-slate-500 font-bold">
                      <div className="flex lg:hidden text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Waktu</div>
                      <div>
                        {safeFormatDate(report.createdAt)}
                      </div>
                    </div>

                    {/* Pengguna */}
                    <div className="col-span-3">
                      <div className="flex lg:hidden text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Pengguna</div>
                      <div>
                        <div className="font-extrabold text-slate-800 tracking-tight">{report.userName || 'Pengguna Anonim'}</div>
                        <div className="text-xs text-slate-500 mt-0.5 font-bold">{report.userPhone || '-'}</div>
                        <div className="text-xs text-[#00B894] mt-1 capitalize font-bold">{report.disabilityType || 'Umum'}</div>
                      </div>
                    </div>

                    {/* Detail */}
                    <div className="col-span-3">
                      <div className="flex lg:hidden text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Detail</div>
                      <div className="flex flex-row lg:flex-col gap-4 lg:gap-2.5">
                        {report.photoUrl ? (
                          <a href={report.photoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#00B894] hover:text-[#009b7c] transition-colors w-fit">
                            <Camera className="w-4 h-4" />
                            Lihat Foto
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-400">
                            <Camera className="w-4 h-4 opacity-50" />
                            Tidak Ada Foto
                          </div>
                        )}
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-[#00B894] hover:text-[#009b7c] transition-colors w-fit"
                        >
                          <MapPin className="w-4 h-4" />
                          Buka di Peta
                        </a>
                      </div>
                    </div>

                    {/* Tindakan */}
                    <div className="col-span-2 mt-2 lg:mt-0 flex lg:justify-end">
                      <button 
                        onClick={() => handleResolveAction(report.id)}
                        disabled={report.status === 'resolved' || report.status === 'Selesai' || report.status === 'cancelled'}
                        className={`w-full lg:w-auto inline-flex items-center justify-center px-5 py-3 lg:py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                          (report.status === 'resolved' || report.status === 'Selesai' || report.status === 'cancelled')
                            ? 'neo-pressed text-slate-400 cursor-not-allowed border-none'
                            : 'neo-flat-primary border-none hover:-translate-y-[2px]'
                        }`}
                      >
                        {(report.status === 'resolved' || report.status === 'Selesai' || report.status === 'cancelled') ? 'Tuntas' : 'Tindak Lanjut'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
