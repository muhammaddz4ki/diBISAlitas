import { useState, useEffect, RefObject } from "react";

/**
 * Custom Hook untuk mengelola siklus hidup aliran (stream) kamera web (navigator.mediaDevices).
 *
 * @param videoRef Referensi elemen HTMLVideoElement untuk disuntik stream
 * @param canvasRef Referensi elemen HTMLCanvasElement untuk dicocokkan dimensinya
 * @returns State kesiapan kamera (isCameraReady) dan error message jika gagal (cameraError)
 */
export function useCamera(
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>
) {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;
    setIsCameraReady(false);

    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });

        if (!isMounted) return;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Pastikan dimensi video sudah dihitung browser sebelum memicu status Ready
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          };
        }
      } catch (err) {
        console.error("Camera Error:", err);
        if (isMounted) setCameraError("Gagal mengakses kamera. Pastikan izin telah diberikan.");
      }
    };

    initCamera();

    // Fungsi pembersihan (Cleanup) saat hook di-unmount agar lampu kamera mati
    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoRef, canvasRef, facingMode]);

  return { isCameraReady, cameraError, toggleCamera, facingMode };
}
