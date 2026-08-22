"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Camera, MapPin, Activity, CheckCircle2, XCircle, AlertCircle, ExternalLink, ShieldAlert } from "lucide-react";

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

export default function AdminDashboard() {
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      console.error("Error fetching reports:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleResolveAction = async (id: string) => {
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
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#00B894]/10 text-[#00B894]">
          <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
          Darurat
        </span>
      );
    }
    if (status === 'resolved' || status === 'Selesai') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Selesai
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
          <XCircle className="w-3.5 h-3.5" />
          Dibatalkan
        </span>
      );
    }
    
    return <span className="text-slate-400 text-xs font-medium">{status}</span>;
  };

  return (
    <div>
      {/* Header - iOS Style */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Command Center</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Monitoring Darurat BiSAFE secara real-time</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-full shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-slate-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B894] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00B894]"></span>
            </span>
            <span className="text-sm font-semibold text-slate-600 tracking-wide">Sistem Aktif</span>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Activity className="w-8 h-8 text-[#00B894] animate-spin mb-4" />
          <p className="text-slate-400 text-sm font-medium">Memuat data real-time...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-slate-800 tracking-tight">Laporan Darurat Terbaru</h2>
            <span className="text-xs font-semibold bg-slate-50 text-slate-500 px-3 py-1 rounded-full border border-slate-100">
              {reports.length} Laporan
            </span>
          </div>
          
          {reports.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 border border-slate-100">
                <CheckCircle2 className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-600 font-semibold text-lg">Situasi Aman Terkendali</p>
              <p className="text-slate-400 text-sm mt-1.5 font-medium">Belum ada laporan darurat yang masuk ke sistem.</p>
            </div>
          ) : (
            <div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Waktu</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Pengguna</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Detail</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 align-middle">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-8 py-5 align-middle text-sm text-slate-500 font-medium">
                        {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleString('id-ID', {
                          hour: '2-digit', minute:'2-digit', day: 'numeric', month: 'short'
                        }) : 'Baru saja'}
                      </td>
                      <td className="px-8 py-5 align-middle">
                        <div className="font-semibold text-slate-800 tracking-tight">{report.userName || 'Pengguna Anonim'}</div>
                        <div className="text-xs text-slate-500 mt-0.5 font-medium">{report.userPhone || '-'}</div>
                        <div className="text-xs text-slate-400 mt-1 capitalize font-medium">{report.disabilityType || 'Umum'}</div>
                      </td>
                      <td className="px-8 py-5 align-middle">
                        <div className="flex flex-col gap-2.5">
                          {report.photoUrl ? (
                            <a href={report.photoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#00B894] hover:text-[#009b7c] transition-colors w-fit">
                              <Camera className="w-4 h-4" />
                              Lihat Foto
                              <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                          ) : (
                            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400">
                              <Camera className="w-4 h-4 opacity-50" />
                              Tidak Ada Foto
                            </div>
                          )}
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00B894] hover:text-[#009b7c] transition-colors w-fit"
                          >
                            <MapPin className="w-4 h-4" />
                            Buka di Peta
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        </div>
                      </td>
                      <td className="px-8 py-5 align-middle text-right">
                        <button 
                          onClick={() => handleResolveAction(report.id)}
                          disabled={report.status === 'resolved' || report.status === 'Selesai' || report.status === 'cancelled'}
                          className={`inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                            (report.status === 'resolved' || report.status === 'Selesai' || report.status === 'cancelled')
                              ? 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'
                              : 'bg-white text-[#00B894] border border-[#00B894] hover:bg-[#00B894] hover:text-white shadow-sm hover:shadow'
                          }`}
                        >
                          {(report.status === 'resolved' || report.status === 'Selesai' || report.status === 'cancelled') ? 'Tuntas' : 'Tindak Lanjut'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
