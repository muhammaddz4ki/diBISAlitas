"use client";

import { useEffect, useRef } from "react";
import { DetectionResult } from "../utils/yoloInference";
import { useCamera } from "../hooks/useCamera";
import { MODEL_INPUT_SIZE } from "../constants/signLabels";

interface CameraDetectorProps {
  isModelLoading: boolean;
  error: string | null;
  detectFrame: (video: HTMLVideoElement, ctx: CanvasRenderingContext2D, isFrontCamera: boolean) => Promise<void>;
  detectionResult: DetectionResult | null;
  /** Array deteksi penuh setelah NMS (opsional, untuk render multi-box) */
  detections?: DetectionResult[];
}

/**
 * Komponen presentasional yang menyatukan input video kamera dengan kanvas overlay bounding box.
 */
export function CameraDetector({
  isModelLoading,
  error,
  detectFrame,
  detectionResult,
  detections,
}: CameraDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Menyuntikkan custom hook useCamera untuk siklus hidup aliran media
  const { isCameraReady, cameraError, toggleCamera, facingMode } = useCamera(videoRef, canvasRef);

  // Efek Siklus Inferensi Frame-by-Frame
  useEffect(() => {
    if (isModelLoading || !isCameraReady || cameraError || error) return;

    const loop = async () => {
      if (videoRef.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          await detectFrame(videoRef.current, ctx, facingMode === "user");
        }
      }
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [isModelLoading, isCameraReady, detectFrame, cameraError, error, facingMode]);

  // Efek Menggambar Bounding Box (mendukung multi-detection)
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const canvasW = canvasRef.current.width;
    const canvasH = canvasRef.current.height;

    // Bersihkan frame kanvas lama secara absolut
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Gunakan array detections jika tersedia, fallback ke single result
    const results: DetectionResult[] = detections && detections.length > 0
      ? detections
      : detectionResult
        ? [detectionResult]
        : [];

    if (results.length === 0) return;

    // Konversi koordinat AI skala statis MODEL_INPUT_SIZE ke rasio layar sesungguhnya
    const scaleX = canvasW / MODEL_INPUT_SIZE;
    const scaleY = canvasH / MODEL_INPUT_SIZE;

    for (const detection of results) {
      const { box, score, label } = detection;

      const xCenter = box[0] * scaleX;
      const yCenter = box[1] * scaleY;
      const w = box[2] * scaleX;
      const h = box[3] * scaleY;

      // Un-Mirror koordinat secara matematika (Sangat Krusial!)
      // Karena preprocessing membalik piksel sebelum inferensi pada kamera depan,
      // box hasil AI harus di-mirror kembali untuk tampilan kamera yang mirrored.
      const xCenterOriginal = facingMode === "user" ? canvasW - xCenter : xCenter;
      const xMin = Math.max(0, xCenterOriginal - w / 2);
      const yMin = Math.max(0, yCenter - h / 2);

      // Desain Bounding Box Premium
      ctx.strokeStyle = "#00B894";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.strokeRect(xMin, yMin, w, h);

      // Label text di atas bounding box
      const labelText = `${label.indo} ${(score * 100).toFixed(1)}%`;
      ctx.font = "bold 14px Inter, system-ui, sans-serif";
      const textMetrics = ctx.measureText(labelText);
      const textW = textMetrics.width + 12;
      const textH = 24;

      // Background label
      ctx.fillStyle = "#00B894";
      ctx.fillRect(xMin, yMin - textH, textW, textH);

      // Teks label
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(labelText, xMin + 6, yMin - 7);
    }
  }, [detections, detectionResult, facingMode]);

  return (
    <div className="flex-1 relative bg-black w-full h-full">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
        playsInline
        autoPlay
        muted
      />

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-20 pointer-events-none"
      />

      {/* Tombol Ganti Kamera */}
      <div className="absolute top-6 right-6 z-40">
        <button
          onClick={toggleCamera}
          className="p-3.5 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 hover:bg-slate-50 transition-colors active:scale-95"
          title="Ganti Kamera"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 22v-6h6"></path>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
          </svg>
        </button>
      </div>

      {/* Loading Overlay State */}
      {(!isCameraReady || isModelLoading) && !error && !cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
          <div className="w-10 h-10 border-4 border-[#00B894] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium mt-4 tracking-wide text-sm">
            {isModelLoading ? "Memuat AI YOLOv8..." : "Memulai Kamera..."}
          </p>
        </div>
      )}

      {/* Error State */}
      {(error || cameraError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-30 p-6 text-center">
          <p className="text-red-500 font-bold mb-2">Terjadi Kesalahan</p>
          <p className="text-slate-300 text-sm">{error || cameraError}</p>
        </div>
      )}
    </div>
  );
}
