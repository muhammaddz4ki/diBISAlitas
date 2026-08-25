"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MapPin, User, FileText, Calendar } from "lucide-react";

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface ObstacleReport {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  obstacleType: string;
  reporterName?: string;
  email?: string;
  photoUrl?: string;
  createdAt: any;
  // Dynamic property for rendering
  densityCount?: number;
}

// Haversine formula to calculate distance between two coordinates in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

import { INITIAL_DEMO_OBSTACLES, isAdminDemoMode, safeFormatDate } from "@/lib/adminDemoData";

export default function MapComponent() {
  const [reports, setReports] = useState<ObstacleReport[]>([]);
  // Central Jakarta Area Coordinates for demo
  const mapCenter: [number, number] = [-6.1969, 106.8234];

  useEffect(() => {
    const processData = (rawData: ObstacleReport[]) => {
      const radiusKm = 0.5;
      const clusteredData = rawData.map((report) => {
        let count = 0;
        rawData.forEach((other) => {
          const dist = getDistanceFromLatLonInKm(
            report.latitude,
            report.longitude,
            other.latitude,
            other.longitude
          );
          if (dist <= radiusKm) {
            count++;
          }
        });
        return { ...report, densityCount: count };
      });
      setReports(clusteredData);
    };

    if (isAdminDemoMode()) {
      processData(INITIAL_DEMO_OBSTACLES as any);
      return;
    }

    const q = query(collection(db, "obstacle_reports"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rawData: ObstacleReport[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.latitude && data.longitude) {
            rawData.push({ id: doc.id, ...data } as ObstacleReport);
          }
        });
        processData(rawData.length > 0 ? rawData : (INITIAL_DEMO_OBSTACLES as any));
      },
      (err) => {
        console.warn("Using demo dataset for map:", err.message);
        processData(INITIAL_DEMO_OBSTACLES as any);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: any) => {
    return safeFormatDate(timestamp, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden relative z-0">
      <MapContainer 
        center={mapCenter} 
        zoom={14} 
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#f8fafc' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <ZoomControl position="bottomright" />

        {reports.map((report) => {
          // Density Logic
          // >= 3: Danger (Red), == 2: Warning (Orange/Amber), else Safe (Teal)
          const density = report.densityCount || 1;
          let color = "#00B894"; // Default Teal
          let radius = 10;
          let opacity = 0.8;

          if (density >= 3) {
            color = "#EF4444"; // Red 500
            radius = 24;
            opacity = 0.4; // More transparent for large overlapping circles
          } else if (density === 2) {
            color = "#F59E0B"; // Amber 500
            radius = 16;
            opacity = 0.6;
          }

          return (
            <CircleMarker
              key={report.id}
              center={[report.latitude, report.longitude]}
              radius={radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: opacity,
                weight: density >= 3 ? 0 : 2, // No border for large red hotspots
              }}
            >
              <Popup className="ios-popup">
                <div className="w-64 p-1">
                  {report.photoUrl && (
                    <div className="w-full h-32 mb-3 rounded-xl overflow-hidden bg-slate-100">
                      <img 
                        src={report.photoUrl} 
                        alt="Rintangan" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2.5">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {report.obstacleType || "Rintangan Tidak Diketahui"}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        {report.description || "Tidak ada deskripsi."}
                      </p>
                    </div>

                    <div className="h-px w-full bg-slate-100 my-1"></div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{report.reporterName || "Pengguna Anonim"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(report.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                          {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend Keterangan */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100/50">
        <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3">Tingkat Kepadatan Laporan</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#EF4444] opacity-70 border-2 border-[#EF4444]"></span>
            <span className="text-xs font-semibold text-slate-600">Tinggi (≥ 3 laporan berdekatan)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] opacity-70 border-2 border-[#F59E0B]"></span>
            <span className="text-xs font-semibold text-slate-600">Sedang (2 laporan berdekatan)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#00B894] opacity-70 border-2 border-[#00B894]"></span>
            <span className="text-xs font-semibold text-slate-600">Rendah (1 laporan)</span>
          </div>
        </div>
      </div>

      {/* Global CSS injected for Popup styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12) !important;
          padding: 4px !important;
          border: 1px solid #f1f5f9 !important;
        }
        .leaflet-popup-content {
          margin: 12px !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 10px 40px rgba(0,0,0,0.12) !important;
        }
        .leaflet-container {
          font-family: inherit !important;
        }
      `}} />
    </div>
  );
}
