import { useState, useRef, useEffect, useCallback } from "react";
import * as ort from "onnxruntime-web";
import { parseBijalanDynamicTensor, BijalanDetectionResult } from "../utils/bijalanYoloInference";
import { extractBijalanNchwTensor } from "../utils/bijalanImageProcessing";

// Untuk mencegah ort-wasm loading berulang kali
let isOrtInitialized = false;

export function useBijalanDetection(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [detections, setDetections] = useState<BijalanDetectionResult[]>([]);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const sessionRef = useRef<ort.InferenceSession | null>(null);
  
  // Throttle timer
  const lastProcessingTime = useRef<number>(0);
  const PROCESSING_INTERVAL = 100; // ~10 FPS

  useEffect(() => {
    let isMounted = true;
    let localSession: ort.InferenceSession | null = null;
    
    const initModel = async () => {
      try {
        if (!isOrtInitialized) {
          ort.env.wasm.wasmPaths = "/wasm/";
          isOrtInitialized = true;
        }
        
        const session = await ort.InferenceSession.create("/models/IndoorObstacle/model.onnx", {
          executionProviders: ["wasm"],
        });
        
        localSession = session;
        if (isMounted) {
          sessionRef.current = session;
          setIsModelLoading(false);
        } else {
          session.release();
        }
      } catch (err) {
        console.error("Failed to load BiJALAN model:", err);
      }
    };
    
    initModel();
    return () => {
      isMounted = false;
      // Lepaskan sesi WASM agar memori tidak bocor saat berpindah halaman.
      localSession?.release();
      sessionRef.current = null;
    };
  }, []);

  const detectFrame = useCallback(async (canvas: HTMLCanvasElement) => {
    if (!sessionRef.current || !videoRef.current || videoRef.current.readyState < 2) {
      return;
    }

    const now = Date.now();
    if (now - lastProcessingTime.current < PROCESSING_INTERVAL) {
      return;
    }
    lastProcessingTime.current = now;

    try {
      const session = sessionRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const video = videoRef.current;
      // Gunakan aspect ratio cover agar gambar pas 640x640 tanpa distorsi berlebihan
      const size = 640;
      const scale = Math.max(size / video.videoWidth, size / video.videoHeight);
      const scaledW = video.videoWidth * scale;
      const scaledH = video.videoHeight * scale;
      const offsetX = (size - scaledW) / 2;
      const offsetY = (size - scaledH) / 2;

      ctx.clearRect(0, 0, size, size);
      // TANPA FLIP HORIZONTAL KARENA KAMERA BELAKANG
      ctx.drawImage(video, offsetX, offsetY, scaledW, scaledH);

      const inputTensor = extractBijalanNchwTensor(canvas);
      
      const results = await session.run({ images: inputTensor });

      const outputKey = Object.keys(results)[0];
      const outDims = results[outputKey].dims;
      const data = results[outputKey].data as Float32Array;

      const allDetections = parseBijalanDynamicTensor(data, outDims);
      setDetections(allDetections);
    } catch (err) {
      console.error("Inference error:", err);
    }
  }, [videoRef]);

  return { detections, isModelLoading, detectFrame };
}
