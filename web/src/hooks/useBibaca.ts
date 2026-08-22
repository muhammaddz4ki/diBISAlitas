import { useRef, useState, useCallback, useEffect } from "react";
import { createWorker, PSM, type Worker } from "tesseract.js";

/**
 * Preprocessing gambar untuk OCR.
 * Alih-alih menangkap frame video yang blur, kita bekerja pada gambar diam (foto/galeri),
 * lalu: (1) resize ke ukuran ramah-OCR, (2) grayscale, (3) contrast-stretch (percentile 2%-98%).
 * Binarisasi final dibiarkan ke mesin Tesseract agar tahan terhadap pencahayaan tidak merata.
 */
function preprocessForOcr(
  source: CanvasImageSource,
  sw: number,
  sh: number
): HTMLCanvasElement {
  const longSide = Math.max(sw, sh);
  let scale = 1;
  if (longSide < 1400) {
    scale = Math.min(1400 / longSide, 2.5); // upscale teks kecil (maks 2.5x)
  } else if (longSide > 2200) {
    scale = 2200 / longSide; // downscale foto raksasa agar OCR tidak lambat
  }

  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return canvas;

  ctx.drawImage(source, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const n = w * h;

  // Grayscale (luminance) + histogram
  const gray = new Uint8ClampedArray(n);
  const hist = new Array<number>(256).fill(0);
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    const g = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) | 0;
    gray[p] = g;
    hist[g]++;
  }

  // Cari batas percentile 2% dan 98% untuk contrast stretch
  const loCut = n * 0.02;
  const hiCut = n * 0.98;
  let acc = 0;
  let lo = 0;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc >= loCut) {
      lo = v;
      break;
    }
  }
  acc = 0;
  let hi = 255;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc >= hiCut) {
      hi = v;
      break;
    }
  }
  if (hi <= lo) {
    lo = 0;
    hi = 255;
  }
  const range = hi - lo;

  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    let v = ((gray[p] - lo) / range) * 255;
    v = v < 0 ? 0 : v > 255 ? 255 : v;
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    // alpha (d[i+3]) dibiarkan
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function cleanText(raw: string): string {
  return raw
    .replace(/[ \t]+/g, " ") // rapikan spasi/tab berlebih
    .replace(/ *\n */g, "\n") // rapikan spasi di sekitar newline
    .replace(/\n{3,}/g, "\n\n") // maksimal 1 baris kosong
    .trim();
}

export function useBibaca() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Tesseract worker di-preload sekali (bukan load model tiap pindai)
  const workerRef = useRef<Worker | null>(null);
  const workerPromiseRef = useRef<Promise<Worker> | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [scannedText, setScannedText] = useState("");
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // ── Worker lifecycle ──────────────────────────────────────────
  const ensureWorker = useCallback(async (): Promise<Worker> => {
    if (workerRef.current) return workerRef.current;
    if (!workerPromiseRef.current) {
      workerPromiseRef.current = createWorker("ind", 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") setProgress(m.progress);
        },
      }).then(async (w) => {
        await w.setParameters({ tessedit_pageseg_mode: PSM.AUTO });
        workerRef.current = w;
        return w;
      });
    }
    return workerPromiseRef.current;
  }, []);

  // ── Camera lifecycle ──────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Kamera tidak didukung di perangkat ini.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
          setIsCameraReady(true);
        } catch (playErr) {
          if ((playErr as Error).name !== "AbortError") throw playErr;
        }
      }
    } catch (err) {
      console.error("Camera error:", err);
      const name = (err as Error)?.name;
      if (name === "NotAllowedError") {
        setError("Izin kamera ditolak. Aktifkan akses kamera di pengaturan browser.");
      } else if (name === "NotFoundError") {
        setError("Kamera tidak ditemukan pada perangkat ini.");
      } else {
        setError("Gagal mengakses kamera. Coba muat ulang halaman.");
      }
      setIsCameraReady(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraReady(false);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // ── OCR core ──────────────────────────────────────────────────
  const runOcr = useCallback(
    async (source: CanvasImageSource, sw: number, sh: number) => {
      setIsProcessing(true);
      setProgress(0);
      setScannedText("");
      setError(null);
      try {
        const worker = await ensureWorker();
        const processed = preprocessForOcr(source, sw, sh);
        const { data } = await worker.recognize(processed);
        const text = cleanText(data.text ?? "");
        if (!text) {
          setError("Tidak ada teks yang terbaca. Coba dekatkan atau perbaiki pencahayaan.");
        } else {
          setScannedText(text);
        }
      } catch (err) {
        console.error("OCR error:", err);
        setError("Gagal membaca teks. Silakan coba lagi.");
      } finally {
        setIsProcessing(false);
        setProgress(1);
      }
    },
    [ensureWorker]
  );

  // Ambil foto DIAM dari kamera (bukan proses frame video terus-menerus)
  const captureAndRead = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || isProcessing) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError("Kamera belum siap, coba lagi sebentar.");
      return;
    }
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);

    // Bekukan frame sebagai preview + sumber OCR (identik dengan yang dilihat user)
    setCapturedUrl(canvas.toDataURL("image/jpeg", 0.92));
    await runOcr(canvas, w, h);
  }, [isProcessing, runOcr]);

  // Baca dari galeri / file (seperti "Buka Galeri" di mobile)
  const readFromFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) return;
      setError(null);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      const img = new Image();
      img.onload = () => {
        setCapturedUrl(url);
        void runOcr(img, img.naturalWidth, img.naturalHeight);
      };
      img.onerror = () => {
        setError("Gagal memuat gambar. Coba file lain.");
        URL.revokeObjectURL(url);
        objectUrlRef.current = null;
      };
      img.src = url;
    },
    [runOcr]
  );

  // ── Text-to-Speech ────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.toLowerCase().includes("id"));
    if (idVoice) utterance.voice = idVoice;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const reset = useCallback(() => {
    setScannedText("");
    setError(null);
    setProgress(0);
    setCapturedUrl(null);
    stopSpeaking();
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, [stopSpeaking]);

  // Preload worker sekali saat mount; bersihkan saat unmount
  useEffect(() => {
    void ensureWorker();
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      const w = workerRef.current;
      workerRef.current = null;
      workerPromiseRef.current = null;
      if (w) void w.terminate();
    };
  }, [ensureWorker]);

  return {
    videoRef,
    canvasRef,
    isCameraReady,
    isProcessing,
    isSpeaking,
    scannedText,
    capturedUrl,
    progress,
    error,
    startCamera,
    stopCamera,
    captureAndRead,
    readFromFile,
    speak,
    stopSpeaking,
    reset,
  };
}
