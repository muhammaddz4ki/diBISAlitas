"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, Compass, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { useBijalanCamera } from "../hooks/useBijalanCamera";
import { useBijalanDetection } from "../hooks/useBijalanDetection";
import { useBijalanTTS } from "../hooks/useBijalanTTS";
import { computeBijalanGuidance } from "../utils/bijalanYoloInference";

export default function BijalanCameraDetector() {
  const { videoRef, canvasRef, startCamera, stopCamera } = useBijalanCamera();
  const { detections, isModelLoading, detectFrame } = useBijalanDetection(videoRef);
  const { speakDetections, cancelTTS, baseSpeed, setBaseSpeed } = useBijalanTTS();
  const animationFrameId = useRef<number>(0);

  // Mulai kamera saat komponen dimount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      cancelTTS();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [startCamera, stopCamera, cancelTTS]);

  // Main loop untuk deteksi dan render
  useEffect(() => {
    if (isModelLoading) return;

    const renderLoop = () => {
      if (canvasRef.current && videoRef.current) {
        detectFrame(canvasRef.current);
      }
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isModelLoading, detectFrame, canvasRef, videoRef]);

  // Handle TTS
  useEffect(() => {
    if (detections.length > 0) {
      speakDetections(detections);
    }
  }, [detections, speakDetections]);

  return (
    <div className="relative w-full h-[60vh] bg-black rounded-3xl overflow-hidden shadow-2xl ring-4 ring-[#00B894]/20 flex flex-col justify-center items-center">
      {/* Video Stream (Tanpa Mirror) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        aria-label="Kamera deteksi rintangan BiJALAN sedang aktif"
        className="absolute w-full h-full object-cover"
      />

      {/* Hidden Canvas untuk Inference */}
      <canvas
        ref={canvasRef}
        width={640}
        height={640}
        className="hidden"
      />

      {/* Bounding Box Overlay Canvas (Bisa pakai div overlay, kita pakai div absolute untuk responsivitas) */}
      <div className="absolute inset-0 pointer-events-none">
        {detections.map((det, index) => {
          const [xc, yc, w, h] = det.box;
          const left = ((xc - w / 2) / 640) * 100;
          const top = ((yc - h / 2) / 640) * 100;
          const width = (w / 640) * 100;
          const height = (h / 640) * 100;
          
          return (
            <div
              key={`${det.classId}-${index}`}
              className="absolute border-4 border-yellow-400 rounded-lg shadow-lg flex flex-col items-center justify-end"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
            >
              <div className="bg-yellow-400 text-black font-bold text-xs md:text-sm px-2 py-1 rounded-t-lg -translate-y-full absolute top-0 w-max max-w-[200px] text-center truncate">
                {det.label.toUpperCase()} {(det.score * 100).toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>

      {isModelLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-10">
          <div className="w-12 h-12 border-4 border-[#00B894]/30 border-t-[#00B894] rounded-full animate-spin mb-4"></div>
          <p className="text-white font-semibold tracking-wide">
            Menyiapkan AI BiJALAN...
          </p>
        </div>
      )}

      {/* Slider Kecepatan Suara */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg flex flex-col gap-2 items-center border border-white/50">
          <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
            Kecepatan Suara: {baseSpeed.toFixed(1)}x
          </span>
          <input 
            type="range" 
            min="0.5" 
            max="2.0" 
            step="0.1" 
            value={baseSpeed} 
            onChange={(e) => setBaseSpeed(parseFloat(e.target.value))} 
            className="w-24 accent-[#00B894] cursor-pointer" 
          />
        </div>
      </div>

      {/* HUD Panduan (rintangan prioritas + arah + level jarak) */}
      {!isModelLoading && (() => {
        const g = computeBijalanGuidance(detections);
        const accent = !g.hasObstacle
          ? "#00B894"
          : g.level === 2
            ? "#F43F5E"
            : g.level === 1
              ? "#F59E0B"
              : "#00B894";
        const title = g.hasObstacle
          ? g.label.charAt(0).toUpperCase() + g.label.slice(1)
          : "Rute Aman";
        const jarak = g.level === 2 ? "Sangat dekat" : g.level === 1 ? "Dekat" : "Terpantau";
        const subtitle = g.hasObstacle
          ? `${jarak} · di ${g.direction}`
          : "Kamera aktif memindai lingkungan.";
        const Arrow = g.direction === "kiri" ? ArrowLeft : g.direction === "kanan" ? ArrowRight : ArrowUp;
        const barPct = !g.hasObstacle ? 12 : ((g.level + 1) / 3) * 100;
        return (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-white rounded-3xl p-4" style={{ boxShadow: `0 14px 44px -8px ${accent}55` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}1f` }}>
                  {g.hasObstacle ? (
                    <AlertTriangle className="w-6 h-6" style={{ color: accent }} />
                  ) : (
                    <Compass className="w-6 h-6" style={{ color: accent }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-[16px] leading-tight truncate" style={{ color: g.hasObstacle ? accent : "#0f172a" }}>
                    {title}
                  </p>
                  <p className="text-slate-500 text-[12px] leading-snug">{subtitle}</p>
                </div>
                {g.hasObstacle && (
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}1f` }}>
                    <Arrow className="w-6 h-6" strokeWidth={2.5} style={{ color: accent }} />
                  </div>
                )}
              </div>
              <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${barPct}%`, backgroundColor: accent }} />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
