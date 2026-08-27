"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { MapPin, User, Calendar, Plus, X, Camera, ChevronRight } from "lucide-react";
import ModalPortal from "@/components/ModalPortal";

// Fix Leaflet default icon in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface ObstacleReport {
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

const OBSTACLE_TYPES = ["Lubang / Trotoar Rusak", "Tangga", "Tiang / Halangan", "Kendaraan Parkir", "Genangan Air", "Lainnya"];

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Auto-center peta ke lokasi user saat pertama didapat. */
function Recenter({ pos }: { pos: [number, number] | null }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (pos && !done.current) {
      map.setView(pos, 16);
      done.current = true;
    }
  }, [pos, map]);
  return null;
}

export interface PetaMapProps {
  reports: ObstacleReport[];
  onDetailClick: (id: string) => void;
}

export default function PetaMapComponent({ reports, onDetailClick }: PetaMapProps) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [me, setMe] = useState<{ uid: string; name: string } | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [type, setType] = useState(OBSTACLE_TYPES[0]);
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const mapCenter: [number, number] = [-6.874, 107.619];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setMe(u ? { uid: u.uid, name: u.displayName || u.email?.split("@")[0] || "Pengguna" } : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (ts: any) => {
    if (!ts) return "-";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(d);
  };

  const submitReport = async () => {
    if (!userPos) {
      showToast("Lokasi belum ditemukan, mohon tunggu sebentar atau pastikan GPS menyala.");
      return;
    }
    
    setSubmitting(true);
    try {
      let photoUrl = null;
      if (photo) {
        const formData = new FormData();
        formData.append("upload_preset", "dibisalitas_unsigned");
        formData.append("folder", "dibisalitas/obstacles");
        formData.append("file", photo);

        const res = await fetch("https://api.cloudinary.com/v1_1/dstawey1z/image/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error("Cloudinary Error:", errText);
          throw new Error("Gagal mengunggah foto ke Cloudinary: " + errText);
        }
        
        const data = await res.json();
        photoUrl = data.secure_url;
      }

      await addDoc(collection(db, "obstacle_reports"), {
        latitude: userPos[0],
        longitude: userPos[1],
        obstacleType: type,
        description: desc.trim(),
        reporterId: me?.uid ?? null,
        reporterName: me?.name ?? "Anonim",
        createdAt: serverTimestamp(),
        isResolved: false,
        upvoteCount: 0,
        photoUrl: photoUrl,
      });
      setShowReport(false);
      setDesc("");
      setPhoto(null);
      setPhotoPreview(null);
      showToast("Terima kasih! Laporanmu membantu komunitas.");
    } catch (error) {
      console.error("Error submitting report:", error);
      showToast("Gagal mengirim laporan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] relative z-0 rounded-[24px] overflow-hidden">
      <MapContainer center={mapCenter} zoom={14} zoomControl={false} className="w-full h-full min-h-[400px]" style={{ background: "#f8fafc" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <Recenter pos={userPos} />

        {/* Marker lokasi user */}
        {userPos && (
          <>
            <CircleMarker center={userPos} radius={16} pathOptions={{ color: "#3B82F6", fillColor: "#3B82F6", fillOpacity: 0.15, weight: 0 }} />
            <CircleMarker center={userPos} radius={7} pathOptions={{ color: "#fff", fillColor: "#3B82F6", fillOpacity: 1, weight: 3 }}>
              <Popup>Lokasi Anda</Popup>
            </CircleMarker>
          </>
        )}

        {reports.map((r) => {
          const density = r.densityCount || 1;
          let color = "#00B894";
          let radius = 10;
          let fillOpacity = 0.8;
          if (density >= 3) { color = "#EF4444"; radius = 22; fillOpacity = 0.4; }
          else if (density === 2) { color = "#FBBF24"; radius = 15; fillOpacity = 0.6; }

          return (
            <CircleMarker
              key={r.id}
              center={[r.latitude, r.longitude]}
              radius={radius}
              pathOptions={{ color, fillColor: color, fillOpacity, weight: density >= 3 ? 0 : 2 }}
            >
              <Popup>
                <div className="w-[200px] p-1 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    {r.photoUrl ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shadow-inner shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.photoUrl} alt="Rintangan" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-slate-800 text-[13px] tracking-tight truncate">{r.obstacleType || "Rintangan"}</h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{r.reporterName || "Anonim"}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100">
                    <div className="bg-[#1B9981]/10 text-[#1B9981] px-2 py-0.5 rounded-md text-[10px] font-bold">
                      {formatDate(r.createdAt)}
                    </div>
                    <button
                      onClick={() => onDetailClick(r.id)}
                      className="bg-[#1B9981] hover:bg-[#00D4AA] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                    >
                      Detail <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Top overlay controls */}
      <div className="absolute top-3 left-3 right-3 z-[500] flex justify-between items-start gap-2 pointer-events-none">
        {/* Badge dampak komunitas */}
        <div className="bg-white/95 backdrop-blur rounded-full px-3.5 py-2 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.2)] border border-slate-100 flex items-center gap-2 pointer-events-auto min-w-0">
          <MapPin className="w-4 h-4 text-[#00B894] shrink-0" strokeWidth={2.5} />
          <span className="text-[12px] font-bold text-slate-700 truncate">{reports.length} titik komunitas</span>
        </div>

        {/* Tombol Lapor */}
        <button
          onClick={() => setShowReport(true)}
          className="bg-[#00B894] text-white rounded-full pl-3 pr-4 py-2.5 shadow-[0_8px_24px_-6px_rgba(0,184,148,0.6)] flex items-center gap-1.5 active:scale-95 transition-transform font-bold text-[13px] pointer-events-auto shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" strokeWidth={3} /> Lapor
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900 text-white text-[13px] font-medium px-5 py-3 rounded-2xl shadow-2xl max-w-[90%] text-center animate-in fade-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      {/* Modal Lapor */}
      {showReport && (
        <ModalPortal>
        <div className="absolute inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-6 sm:p-0 transition-opacity animate-in fade-in duration-200" onClick={() => { setShowReport(false); setPhoto(null); setPhotoPreview(null); }}>
          <div className="w-full sm:w-[420px] max-h-[85vh] flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-white/50 sticky top-0 z-10 backdrop-blur-md">
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Lapor Rintangan</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Bantu komunitas dengan melaporkan rintangan</p>
              </div>
              <button onClick={() => { setShowReport(false); setPhoto(null); setPhotoPreview(null); }} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 block">Jenis Rintangan</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {OBSTACLE_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-3 py-3 rounded-xl text-[13px] font-bold border-2 transition-all flex items-center justify-center text-center leading-tight min-h-[56px] ${
                        type === t 
                          ? "bg-[#00B894]/10 text-[#00B894] border-[#00B894]" 
                          : "bg-white text-slate-600 border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Foto Rintangan <span className="text-slate-400 font-medium normal-case">(Opsional)</span></label>
                <div className="flex items-center gap-4">
                  {photoPreview ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => { setPhoto(null); setPhotoPreview(null); }} className="absolute top-2 right-2 bg-slate-900/50 text-white p-1.5 rounded-full hover:bg-slate-900/70 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-[#00B894] hover:text-[#00B894] transition-colors cursor-pointer">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-xs font-medium">Ambil / Pilih Foto</span>
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto(file);
                          setPhotoPreview(URL.createObjectURL(file));
                        }
                      }} />
                    </label>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Keterangan Tambahan <span className="text-slate-400 font-medium normal-case">(Opsional)</span></label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Contoh: Ada galian kabel di trotoar depan minimarket..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00B894] focus:ring-4 focus:ring-[#00B894]/10 transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
              <button
                onClick={submitReport}
                disabled={submitting || !me}
                className="w-full py-4 rounded-2xl bg-[#00B894] hover:bg-[#00a383] text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-[#00B894]/20 active:scale-[0.98]"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    <span>Kirim Laporan Lokasi Ini</span>
                  </>
                )}
              </button>
              {!me && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-rose-500 bg-rose-50 py-2 px-3 rounded-lg border border-rose-100">
                  <User className="w-3.5 h-3.5" />
                  Anda harus login untuk membuat laporan
                </div>
              )}
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .leaflet-popup-content-wrapper { border-radius: 24px !important; box-shadow: 8px 8px 16px #cedcd8, -8px -8px 16px #ffffff !important; padding: 4px !important; border: 1px solid rgba(255, 255, 255, 0.4) !important; background-color: #E8F4F1 !important; }
        .leaflet-popup-content { margin: 8px 10px !important; }
        .leaflet-popup-tip { background-color: #E8F4F1 !important; box-shadow: 4px 4px 8px #cedcd8 !important; }
        .leaflet-container { font-family: inherit !important; }
      `}} />
    </div>
  );
}
