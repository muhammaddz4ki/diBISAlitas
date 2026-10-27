"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  Video,
  Radio,
  RefreshCw,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Activity,
  Layers,
  Zap,
  StopCircle,
} from "lucide-react";
import {
  computeMocapLandmarks,
  analyzeMotionFromLandmarks,
  drawMocapOverlay,
  detectLandmarksFromMedia,
  VisionDetectionResult,
  MotionAnalysisData,
} from "@/utils/motionCaptureEngine";
import {
  getMediaPipeHolistic,
  processMediaPipeHolisticResults,
  MediaPipeHolisticResults,
} from "@/utils/mediaPipeHolisticService";
import { GESTURE_PRESETS } from "@/lib/bisindoService";

interface LiveMocapRecorderProps {
  onRecordingComplete: (file: File, previewUrl: string, detectedPoseKey: string) => void;
  initialPoseKey?: string;
  onPoseChange?: (poseKey: string) => void;
}

function computeMediaViewport(
  mediaElem: HTMLVideoElement | null,
  containerW: number,
  containerH: number,
  fit: "contain" | "cover" = "cover"
) {
  if (!mediaElem || !mediaElem.videoWidth || !mediaElem.videoHeight) {
    return { offsetX: 0, offsetY: 0, renderedW: containerW, renderedH: containerH };
  }

  const srcAspect = mediaElem.videoWidth / mediaElem.videoHeight;
  const dstAspect = containerW / containerH;

  let renderedW = containerW;
  let renderedH = containerH;
  let offsetX = 0;
  let offsetY = 0;

  if (fit === "contain") {
    if (srcAspect > dstAspect) {
      renderedW = containerW;
      renderedH = containerW / srcAspect;
      offsetY = (containerH - renderedH) / 2;
    } else {
      renderedH = containerH;
      renderedW = containerH * srcAspect;
      offsetX = (containerW - renderedW) / 2;
    }
  } else {
    if (srcAspect > dstAspect) {
      renderedH = containerH;
      renderedW = containerH * srcAspect;
      offsetX = (containerW - renderedW) / 2;
    } else {
      renderedW = containerW;
      renderedH = containerW / srcAspect;
      offsetY = (containerH - renderedH) / 2;
    }
  }

  return { offsetX, offsetY, renderedW, renderedH };
}

export default function LiveMocapRecorder({
  onRecordingComplete,
  initialPoseKey = "terima_kasih",
  onPoseChange,
}: LiveMocapRecorderProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [activePoseKey, setActivePoseKey] = useState<string>(initialPoseKey);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Recording State
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdownValue, setCountdownValue] = useState<number>(3);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // MediaPipe Holistic Deep Learning AI State
  const [aiEngineStatus, setAiEngineStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const latestAiDetectionRef = useRef<VisionDetectionResult | null>(null);
  const isInferringRef = useRef<boolean>(false);

  // Telemetry state for UI cards
  const [currentAnalysis, setCurrentAnalysis] = useState<MotionAnalysisData | null>(null);
  const [fps, setFps] = useState<number>(60);
  const lastFpsUpdateRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);

  // Update pose when prop changes
  useEffect(() => {
    if (initialPoseKey && initialPoseKey !== activePoseKey) {
      setActivePoseKey(initialPoseKey);
    }
  }, [initialPoseKey]);

  // Start webcam
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setCameraError("Kamera tidak didukung pada browser ini. Menjalankan Mode Simulasi Mocap.");
        setCameraActive(false);
        return;
      }

      // Stop existing tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn("Kamera akses:", err);
      setCameraError("Kamera tidak aktif/izin belum diberikan. Menjalankan Mode Simulasi Mocap 543 Titik.");
      setCameraActive(false);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  // Toggle camera front/back
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Google MediaPipe Holistic AI Inference Loop (~30 FPS async WebAssembly / GPU)
  useEffect(() => {
    if (!cameraActive) {
      latestAiDetectionRef.current = null;
      return;
    }

    let isMounted = true;
    let intervalId: any = null;

    async function initHolistic() {
      try {
        setAiEngineStatus("loading");
        const holistic = await getMediaPipeHolistic();
        if (!isMounted || !holistic) return;

        holistic.onResults((results: MediaPipeHolisticResults) => {
          if (!isMounted) return;
          const isMirrored = facingMode === "user";
          const res = processMediaPipeHolisticResults(results, activePoseKey, isMirrored);
          latestAiDetectionRef.current = res;
        });

        if (isMounted) setAiEngineStatus("ready");

        // Loop inferensi AI ~30 FPS secara asinkron tanpa mengganggu 60 FPS kanvas
        intervalId = setInterval(async () => {
          if (
            isInferringRef.current ||
            !videoRef.current ||
            videoRef.current.readyState < 2 ||
            videoRef.current.paused ||
            videoRef.current.ended
          ) {
            return;
          }
          isInferringRef.current = true;
          try {
            await holistic.send({ image: videoRef.current });
          } catch {
            // Frame skip
          } finally {
            isInferringRef.current = false;
          }
        }, 33);
      } catch (err) {
        console.warn("MediaPipe AI initialization fallback:", err);
        if (isMounted) setAiEngineStatus("fallback");
      }
    }

    initHolistic();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [cameraActive, facingMode, activePoseKey]);

  // Main 60 FPS Render Loop for Mocap Overlay
  useEffect(() => {
    let startTime = performance.now();

    const loop = (time: number) => {
      // FPS Counter
      frameCountRef.current++;
      if (time - lastFpsUpdateRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = time;
      }

      const elapsed = (time - startTime) / 1000;
      // Cycle time 2.0s per sign
      const tCycle = (elapsed % 2.0) / 2.0;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Sync canvas dimensions with display size
          const rect = canvas.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          const displayW = Math.max(320, Math.floor(rect.width));
          const displayH = Math.max(240, Math.floor(rect.height));

          if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
            canvas.width = displayW * dpr;
            canvas.height = displayH * dpr;
            ctx.scale(dpr, dpr);
          }

          ctx.clearRect(0, 0, displayW, displayH);

          // If camera is NOT active, draw simulation backdrop
          if (!cameraActive) {
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(0, 0, displayW, displayH);

            // Silhouette of user
            ctx.fillStyle = "rgba(30, 41, 59, 0.85)";
            ctx.beginPath();
            ctx.ellipse(displayW / 2, displayH * 0.32, displayW * 0.16, displayH * 0.22, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(displayW / 2, displayH * 0.85, displayW * 0.35, displayH * 0.35, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Calculate Mocap Model: Prioritaskan AI Deep Learning MediaPipe Holistic (543 Titik Nyata)
          const validPose = (activePoseKey as any) || "terima_kasih";
          const isMirrored = facingMode === "user";
          let detection: VisionDetectionResult | undefined = latestAiDetectionRef.current || undefined;

          // Fallback ke analisis piksel jika model AI masih proses loading
          if (!detection && cameraActive && videoRef.current && videoRef.current.readyState >= 2) {
            detection = detectLandmarksFromMedia(videoRef.current, validPose, isMirrored);
          }

          const mocapData =
            detection && detection.personDetected
              ? detection.mocapData
              : computeMocapLandmarks(validPose, tCycle);

          const analysis =
            detection && detection.personDetected
              ? detection.analysis
              : analyzeMotionFromLandmarks(mocapData, validPose);

          setCurrentAnalysis(analysis);

          const viewport = computeMediaViewport(videoRef.current, displayW, displayH, "cover");

          // Draw neon skeletal lines & landmark dots
          if (showOverlay) {
            drawMocapOverlay(ctx, displayW, displayH, mocapData, analysis, {
              showFace: true,
              showHands: true,
              showBody: true,
              showTelemetryBadge: true,
              detectionResult: detection,
              viewport,
            });
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activePoseKey, showOverlay, cameraActive]);

  // Handle Recording Process
  const startRecordingFlow = () => {
    if (isRecording || isCountingDown) return;

    // 1. Countdown 3.. 2.. 1..
    setIsCountingDown(true);
    setCountdownValue(3);

    let count = 3;
    const countInterval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownValue(count);
      } else {
        clearInterval(countInterval);
        setIsCountingDown(false);
        beginMediaRecording();
      }
    }, 1000);
  };

  const beginMediaRecording = () => {
    setIsRecording(true);
    setRecordProgress(0);
    recordedChunksRef.current = [];

    let stream: MediaStream | null = null;

    if (cameraActive && videoRef.current && videoRef.current.srcObject) {
      stream = videoRef.current.srcObject as MediaStream;
    } else if (canvasRef.current) {
      // Capture from canvas stream fallback
      stream = (canvasRef.current as any).captureStream(30);
    }

    if (!stream) {
      // Fallback: create mock video file
      createMockRecordingResult();
      return;
    }

    try {
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "video/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const videoFile = new File([blob], `live_mocap_${Date.now()}.${mimeType.includes("mp4") ? "mp4" : "webm"}`, {
          type: mimeType,
        });
        const previewUrl = URL.createObjectURL(blob);
        setIsRecording(false);
        setRecordProgress(100);
        onRecordingComplete(videoFile, previewUrl, activePoseKey);
      };

      recorder.start(100);

      // Record for 3.2 seconds
      const startTime = performance.now();
      const duration = 3200;

      const progressInterval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const pct = Math.min(100, Math.round((elapsed / duration) * 100));
        setRecordProgress(pct);

        if (elapsed >= duration) {
          clearInterval(progressInterval);
          if (recorder.state === "recording") {
            recorder.stop();
          }
        }
      }, 100);
    } catch (e) {
      console.warn("MediaRecorder init failed, falling back to canvas snapshot:", e);
      createMockRecordingResult();
    }
  };

  const createMockRecordingResult = () => {
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `mocap_${Date.now()}.png`, { type: "image/png" });
            const url = URL.createObjectURL(blob);
            setIsRecording(false);
            setRecordProgress(100);
            onRecordingComplete(file, url, activePoseKey);
          }
        });
      }
    }, 2000);
  };

  const handleSelectPreset = (key: string) => {
    setActivePoseKey(key);
    if (onPoseChange) onPoseChange(key);
  };

  return (
    <div className="space-y-4">
      {/* Viewport Layar Tracking Live */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border-2 border-white/60 shadow-inner flex items-center justify-center select-none">
        {/* HTML5 Live Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${
            facingMode === "user" ? "scale-x-[-1]" : ""
          } ${cameraActive ? "opacity-90" : "hidden"}`}
        />

        {/* 543-Point Mocap Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
        />

        {/* Header HUD Badges */}
        <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md ${
                isRecording
                  ? "bg-rose-500/90 text-white animate-pulse"
                  : cameraActive
                  ? "bg-slate-900/80 text-[#00B894] border border-[#00B894]/40"
                  : "bg-amber-500/80 text-white"
              }`}
            >
              <Radio className="w-3 h-3 animate-pulse" />
              <span>
                {isRecording ? "🔴 RECORDING MOCAP" : cameraActive ? "LIVE WEBCAM TRACKING" : "SIMULASI MOCAP"}
              </span>
            </span>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-900/70 text-slate-300 backdrop-blur-md border border-white/10">
              {fps} FPS • 543 PTS
            </span>

            {cameraActive && (
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md border ${
                  aiEngineStatus === "ready"
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                    : aiEngineStatus === "loading"
                    ? "bg-amber-950/80 text-amber-300 border-amber-500/40 animate-pulse"
                    : "bg-slate-900/80 text-slate-400 border-white/10"
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#00B894]" />
                {aiEngineStatus === "ready"
                  ? "⚡ AI DEEP LEARNING (543 PTS)"
                  : aiEngineStatus === "loading"
                  ? "MEMUAT AI MODEL..."
                  : "CV FALLBACK"}
              </span>
            )}
          </div>

          {/* Quick HUD Controls */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setShowOverlay(!showOverlay)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer text-xs flex items-center gap-1.5"
              title={showOverlay ? "Sembunyikan Titik & Rangka" : "Tampilkan Titik & Rangka"}
            >
              {showOverlay ? <Eye className="w-3.5 h-3.5 text-[#00B894]" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              <span className="text-[11px] font-bold hidden sm:inline">
                {showOverlay ? "Rangka ON" : "Rangka OFF"}
              </span>
            </button>

            {cameraActive && (
              <button
                type="button"
                onClick={handleToggleFacingMode}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer text-xs"
                title="Putar Kamera"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-300" />
              </button>
            )}
          </div>
        </div>

        {/* Center Countdown Pulse Banner */}
        {isCountingDown && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-24 h-24 rounded-full bg-[#00B894] text-white flex items-center justify-center text-5xl font-black shadow-2xl animate-ping" />
            <div className="absolute text-white text-6xl font-black drop-shadow-lg">
              {countdownValue}
            </div>
            <p className="mt-8 text-white font-bold text-sm tracking-wide bg-black/50 px-4 py-1.5 rounded-full">
              Posisikan tangan sejajar dada...
            </p>
          </div>
        )}

        {/* Recording Active Frame Border */}
        {isRecording && (
          <div className="absolute inset-0 border-4 border-rose-500 pointer-events-none z-20 animate-pulse">
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-rose-500/40 flex items-center justify-between text-xs text-white">
              <span className="flex items-center gap-2 font-bold">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                Merekam Gerakan Isyarat ({recordProgress}%)
              </span>
              <span className="font-mono text-rose-400 font-extrabold">3.2 DETIK</span>
            </div>
          </div>
        )}

        {/* Fallback Info Badge if camera permission not granted */}
        {cameraError && !cameraActive && (
          <div className="absolute bottom-3 inset-x-3 z-20 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-amber-500/30 text-slate-200 text-xs flex items-center justify-between gap-2 pointer-events-auto">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] font-medium leading-tight">{cameraError}</span>
            </div>
            <button
              type="button"
              onClick={startCamera}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-bold border border-amber-400/30 cursor-pointer shrink-0"
            >
              Coba Ulang
            </button>
          </div>
        )}
      </div>

      {/* Target Gestur Cepat (Pilih Isyarat yang Ingin Dipetakan) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Pilih Isyarat untuk Dipetakan ke Titik Tubuh & Wajah:
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Object.values(GESTURE_PRESETS).map((p) => {
            const isSelected = activePoseKey === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => handleSelectPreset(p.key)}
                className={`p-2 rounded-xl text-center border-none transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? "neo-flat-primary text-white shadow-sm scale-105"
                    : "neo-flat text-slate-700 hover:brightness-105"
                }`}
              >
                <span className="text-lg">{p.icon}</span>
                <span className="text-[10px] font-black leading-tight line-clamp-1">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Kinematics Telemetry Card */}
      {currentAnalysis && (
        <div className="neo-pressed rounded-2xl p-4 border-none space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-[#00B894]">
              <Activity className="w-4 h-4" />
              TELEMETRI KINEMATIKA GERAKAN (AI MEDIAPIPE)
            </span>
            <span className="font-mono text-[11px] text-[#00B894] font-black bg-[#00B894]/10 px-2 py-0.5 rounded-md">
              {currentAnalysis.confidenceScore}% MATCH
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="neo-flat p-2.5 rounded-xl border-none">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                📍 Posisi Tangan Relatif
              </span>
              <span className="font-extrabold text-slate-800 block text-xs">
                {currentAnalysis.handPositionLabel}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                Jarak Dagu: {currentAnalysis.handToMouthDistanceCm} cm
              </span>
            </div>

            <div className="neo-flat p-2.5 rounded-xl border-none">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                🖐️ Bentuk & Fleksi Jari
              </span>
              <span className="font-extrabold text-slate-800 block text-xs">
                {currentAnalysis.fingerShapeLabel}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                Tingkat Tekukan: {currentAnalysis.fingerFlexionPercentage}%
              </span>
            </div>

            <div className="neo-flat p-2.5 rounded-xl border-none">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                🧭 Arah & Fase Ayunan
              </span>
              <span className="font-extrabold text-slate-800 block text-xs line-clamp-1">
                {currentAnalysis.movementDirection}
              </span>
              <span className="text-[10px] text-[#00B894] font-bold block mt-0.5">
                Fase: {currentAnalysis.movementPhase}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Mulai Rekam Gerakan Langsung */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isRecording || isCountingDown}
          onClick={startRecordingFlow}
          className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer border-none ${
            isRecording
              ? "bg-rose-500 text-white animate-pulse"
              : "neo-flat-primary text-white hover:scale-[1.01]"
          }`}
        >
          {isRecording ? (
            <>
              <StopCircle className="w-5 h-5 animate-spin" />
              <span>SEDANG MEREKAM GERAKAN ({recordProgress}%)...</span>
            </>
          ) : isCountingDown ? (
            <>
              <Zap className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>BERSIAP... {countdownValue}</span>
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              <span>🔴 MULAI REKAM GERAKAN LIVE (3 DETIK)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
