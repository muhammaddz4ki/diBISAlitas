import { useEffect, useRef, useState, useCallback } from "react";
import * as ort from "onnxruntime-web";
import { extractBisindoNchwTensor } from "../utils/bisindoImageProcessing";
import { parseBisindoDynamicTensor, BisindoDetectionResult } from "../utils/bisindoYoloInference";
import { BISINDO_CONFIDENCE_THRESHOLD, BISINDO_MODEL_INPUT_SIZE, BisindoSignLabel } from "../constants/bisindoLabels";

// Set wasm path (diperlukan oleh onnxruntime-web)
ort.env.wasm.wasmPaths = "/wasm/";

/** Interval minimum antar inferensi dalam milidetik (~10 FPS) */
const THROTTLE_INTERVAL_MS = 100;

/**
 * Custom Hook orkestrator untuk inisialisasi AI YOLOv8 ONNX dan siklus eksekusi inferensi.
 *
 * @param modelPath Lokasi relatif aset model ONNX
 * @param labels Kamus array BisindoSignLabel yang digunakan model ini
 * @returns State dari deteksi (loading, error, hasil deteksi array + best, dan fungsi pemicu deteksi per frame)
 */
export function useBisindoDetection(modelPath: string, labels: BisindoSignLabel[]) {
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State deteksi: array penuh (semua deteksi setelah NMS) + best single result (backward compat)
  const [detections, setDetections] = useState<BisindoDetectionResult[]>([]);
  const [detectionResult, setDetectionResult] = useState<BisindoDetectionResult | null>(null);

  const processingRef = useRef(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    let localSession: ort.InferenceSession | null = null;
    const loadModel = async () => {
      try {
        const loadedSession = await ort.InferenceSession.create(modelPath, {
          executionProviders: ["wasm"], // Menggunakan WebAssembly untuk akselerasi CPU
        });
        
        localSession = loadedSession;
        if (isMounted) {
          setSession(loadedSession);
          setIsModelLoading(false);
        } else {
          loadedSession.release();
        }
      } catch (err) {
        console.error("Gagal memuat model:", err);
        if (isMounted) {
          setError("Gagal memuat model YOLOv8 Bisindo (Inference Session Error).");
          setIsModelLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
      // Lepaskan sesi WASM agar memori tidak bocor saat berpindah halaman.
      localSession?.release();
    };
  }, [modelPath]);

  const detectFrame = useCallback(
    async (video: HTMLVideoElement, ctx: CanvasRenderingContext2D, isFrontCamera: boolean = true) => {
      // Mencegah penumpukan thread inference
      if (!session || processingRef.current) return;

      // Throttle ke ~10 FPS (100ms per frame) untuk menghindari patah-patah UI
      const now = performance.now();
      if (now - lastTimeRef.current < THROTTLE_INTERVAL_MS) return;
      
      processingRef.current = true;
      lastTimeRef.current = now;

      try {
        // 1. Pre-Processing: Ekstraksi NCHW RGB Tensor dari Canvas
        const inputTensor = extractBisindoNchwTensor(video, ctx, BISINDO_MODEL_INPUT_SIZE, isFrontCamera);

        // 2. Inference AI
        const results = await session.run({ images: inputTensor });

        // 3. Post-Processing: Membaca Tensor Output
        const outputKey = Object.keys(results)[0];
        const outDims = results[outputKey].dims;
        const data = results[outputKey].data as Float32Array;

        const allDetections = parseBisindoDynamicTensor(data, outDims, labels, BISINDO_CONFIDENCE_THRESHOLD);
        
        setDetections(allDetections);
        // Best single result = deteksi pertama (skor tertinggi setelah NMS)
        setDetectionResult(allDetections.length > 0 ? allDetections[0] : null);

      } catch (err) {
        console.error("ONNX Inference Error:", err);
      } finally {
        processingRef.current = false;
      }
    },
    [session, labels]
  );

  return { isModelLoading, error, detections, detectionResult, detectFrame };
}
