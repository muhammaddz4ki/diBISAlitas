"use client";

import { useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Plus,
  Video,
  Search,
  Filter,
  Trash2,
  Play,
  RotateCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Upload,
  BookOpen,
  Film,
  Eye,
  EyeOff,
  Camera,
  Image as ImageIcon,
  Sliders,
  ChevronRight,
  Cpu,
  Layers,
  Zap,
  Radio,
  ArrowRight,
  Check,
  Maximize2,
  Activity,
  UserCheck,
  Copy,
  FileText,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { BisindoItem, BisindoCategory, BisindoDifficulty } from "@/lib/types";
import {
  subscribeBisindoItems,
  addBisindoItem,
  updateBisindoItem,
  deleteBisindoItem,
  mapGestureTo3DAsset,
  extractVideoFrames,
  generate3DAnimatedGif,
  FramePairInfo,
  DEFAULT_BISINDO_ITEMS,
  GESTURE_PRESETS,
  GesturePreset,
} from "@/lib/bisindoService";
import Bisindo3DCharacter from "@/components/Bisindo3DCharacter";
import {
  computeMocapLandmarks,
  analyzeMotionFromLandmarks,
  detectLandmarksFromMedia,
  VisionDetectionResult,
  MotionAnalysisData,
} from "@/utils/motionCaptureEngine";

const CATEGORY_LABELS: Record<BisindoCategory, { label: string; icon: string }> = {
  sapaan: { label: "Sapaan & Adab", icon: "👋" },
  akademik: { label: "Akademik POLMAN", icon: "🎓" },
  darurat: { label: "Tanggap Darurat", icon: "🚨" },
  harian: { label: "Kebutuhan Harian", icon: "☀️" },
  angka: { label: "Angka & Bilangan", icon: "🔢" },
  alfabet: { label: "Alfabet Jari (A-Z)", icon: "🔤" },
};

export default function StudioIsyaratPage() {
  const [items, setItems] = useState<BisindoItem[]>(DEFAULT_BISINDO_ITEMS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [preview3DItem, setPreview3DItem] = useState<BisindoItem | null>(null);

  // Form State
  const [formWord, setFormWord] = useState("");
  const [formCategory, setFormCategory] = useState<BisindoCategory>("sapaan");
  const [formDifficulty, setFormDifficulty] = useState<BisindoDifficulty>("mudah");
  const [formDescription, setFormDescription] = useState("");
  const [formPoseKey, setFormPoseKey] = useState<string>("auto");
  const [mediaInputMode, setMediaInputMode] = useState<"video" | "image">("video");
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoFilePreview, setVideoFilePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageFilePreview, setImageFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Media element refs for real Computer Vision pixel detection
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const modalImageRef = useRef<HTMLImageElement | null>(null);
  const pipelineVideoRef = useRef<HTMLVideoElement | null>(null);
  const pipelineImageRef = useRef<HTMLImageElement | null>(null);

  // Dynamic CV detection status on active media
  const [modalCvStatus, setModalCvStatus] = useState<{
    detected: boolean;
    confidence: number;
    label: string;
  } | null>(null);
  const lastCvStatusRef = useRef<string>("");

  // Tab modal pipeline: 3d visual vs motion description vs ai prompt
  const [pipelineTab, setPipelineTab] = useState<"3d" | "motion" | "ai_prompt">("3d");

  // AI 3D Generation Pipeline Modal State
  const [pipelineState, setPipelineState] = useState<{
    isOpen: boolean;
    word: string;
    videoUrl?: string | null;
    itemId?: string;
    targetPoseKey: string;
    targetAsset3dUrl: string;
    gestureLabel: string;
    progress: number;
    stepIndex: number;
    stepDescription: string;
    isFinished: boolean;
    compiledGifUrl?: string | null;
    framePairs: FramePairInfo[];
    analysis?: MotionAnalysisData;
    motionDescription?: string;
    aiPrompt?: {
      positive: string;
      negative: string;
      parameters: string;
      fullText: string;
    };
  }>({
    isOpen: false,
    word: "",
    videoUrl: null,
    itemId: undefined,
    targetPoseKey: "salam",
    targetAsset3dUrl: "/avatars/rian_salam.jpg",
    gestureLabel: "",
    progress: 0,
    stepIndex: 0,
    stepDescription: "",
    isFinished: false,
    compiledGifUrl: null,
    framePairs: [],
  });

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} berhasil disalin!`);
    } catch {
      toast.error("Gagal menyalin ke clipboard");
    }
  };

  const pipelineIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (pipelineIntervalRef.current) clearInterval(pipelineIntervalRef.current);
    };
  }, []);

  // Subscribe to real-time data
  useEffect(() => {
    const unsubscribe = subscribeBisindoItems((data) => {
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sinkronisasi status Computer Vision di background tanpa menggambar garis hijau di layar
  useEffect(() => {
    if (!showAddModal) return;
    const mediaElem = modalVideoRef.current || modalImageRef.current;
    if (!mediaElem) return;

    const intervalId = setInterval(() => {
      const targetKey = formPoseKey === "auto" ? "terima_kasih" : ((formPoseKey as any) || "terima_kasih");
      const detection = detectLandmarksFromMedia(mediaElem, targetKey);
      if (detection) {
        const statusKey = `${detection.personDetected}_${detection.confidence}_${detection.analysis.handPositionLabel}`;
        if (statusKey !== lastCvStatusRef.current) {
          lastCvStatusRef.current = statusKey;
          setModalCvStatus({
            detected: detection.personDetected,
            confidence: detection.confidence,
            label: detection.analysis.handPositionLabel,
          });
        }
      }
    }, 600);

    return () => clearInterval(intervalId);
  }, [showAddModal, formPoseKey, videoFilePreview, imageFilePreview]);

  // Handle Video file pick
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Format file harus berupa video (MP4, WebM, MOV)!");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Ukuran video maksimal 50 MB!");
      return;
    }

    setSelectedVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoFilePreview(objectUrl);
  };

  // Handle Image file pick
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus berupa gambar (JPG, PNG, WebP)!");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 20 MB!");
      return;
    }

    setSelectedImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImageFilePreview(objectUrl);
  };

  // Start the futuristic AI 3D Motion Pipeline: Ekstraksi Media Per-Frame & Kompilasi 3D Animated GIF
  const startGenerationPipeline = async (
    word: string,
    mediaSource?: File | string | null,
    existingItemId?: string,
    extraData?: {
      category?: BisindoCategory;
      difficulty?: BisindoDifficulty;
      description?: string;
      poseKey?: string;
    }
  ) => {
    if (pipelineIntervalRef.current) clearInterval(pipelineIntervalRef.current);

    const gesture3D = mapGestureTo3DAsset(word, extraData?.poseKey);
    const initialMocap = computeMocapLandmarks(gesture3D.poseKey as any, 0.5);
    const initialAnalysis = analyzeMotionFromLandmarks(initialMocap, gesture3D.poseKey as any);

    let mediaPreviewUrl =
      typeof mediaSource === "string"
        ? mediaSource
        : mediaSource instanceof File
        ? URL.createObjectURL(mediaSource)
        : null;

    setPipelineState({
      isOpen: true,
      word,
      videoUrl: mediaPreviewUrl,
      itemId: existingItemId,
      targetPoseKey: gesture3D.poseKey,
      targetAsset3dUrl: gesture3D.asset3dUrl,
      gestureLabel: gesture3D.label,
      progress: 8,
      stepIndex: 0,
      stepDescription: "Membagi media peragaan menjadi 32 frame gerakan padat...",
      isFinished: false,
      compiledGifUrl: null,
      framePairs: [],
      analysis: initialAnalysis,
    });

    try {
      // 1. Ekstraksi frame-frame dari media (32 frame detail & padat)
      let extractedFrames: { time: number; dataUrl: string }[] = [];
      if (mediaSource) {
        extractedFrames = await extractVideoFrames(mediaSource, 32, (cur, total, text) => {
          setPipelineState((prev) => ({
            ...prev,
            progress: Math.min(38, Math.round((cur / total) * 38)),
            stepIndex: 0,
            stepDescription: text,
          }));
        });
      }

      setPipelineState((prev) => ({
        ...prev,
        stepIndex: 1,
        progress: 40,
        stepDescription: `AI MediaPipe CV: Memetakan 543 titik landmark nyata & kinematika ${extractedFrames.length || 32} frame (${gesture3D.positionLabel})...`,
      }));

      // 2. Konversi per frame ke 3D Rian & kompilasi ke file GIF89a Looping (32 frame padat, ~13.3 fps)
      const gifResult = await generate3DAnimatedGif(
        word,
        extractedFrames.length || 32,
        (pct, text) => {
          const mapped = 40 + Math.round((pct / 100) * 52);
          setPipelineState((prev) => ({
            ...prev,
            progress: Math.min(95, mapped),
            stepIndex: mapped > 68 ? 2 : 1,
            stepDescription: text,
          }));
        },
        extractedFrames,
        extraData?.poseKey || "auto"
      );

      // Tentukan pose final dari hasil MediaPipe AI atau fallback gesture
      const finalPoseKey = (gifResult.poseKey || gifResult.analysis?.predictedPoseKey || gesture3D.poseKey) as any;
      const finalPreset = GESTURE_PRESETS[finalPoseKey];
      const finalPositionLabel = finalPreset ? finalPreset.positionLabel : gesture3D.positionLabel;
      const finalGestureLabel = finalPreset ? `${finalPreset.icon} ${finalPreset.name} (${finalPreset.positionLabel})` : gesture3D.label;

      // 3. Selesai! Update state pipeline dengan hasil GIF & AI Prompts
      setPipelineState((prev) => ({
        ...prev,
        progress: 100,
        stepIndex: 3,
        stepDescription: `Selesai! Animasi 3D Rian (${finalPositionLabel}) berhasil direkonstruksi & Prompt AI Video siap digunakan.`,
        isFinished: true,
        targetPoseKey: finalPoseKey,
        gestureLabel: finalGestureLabel,
        targetAsset3dUrl: gifResult.gifUrl,
        compiledGifUrl: gifResult.gifUrl,
        framePairs: gifResult.framePairs,
        analysis: gifResult.analysis || prev.analysis,
        motionDescription: gifResult.motionDescription,
        aiPrompt: gifResult.aiPrompt,
      }));

      // 4. Simpan ke database Firestore & hybrid local storage
      if (existingItemId) {
        await updateBisindoItem(existingItemId, {
          status: "ready",
          poseKey: finalPoseKey,
          asset3dUrl: gifResult.gifUrl,
          thumbnailUrl: gifResult.gifUrl,
        });
        toast.success(`Animasi 3D GIF untuk "${word}" (${finalPositionLabel}) berhasil diperbarui!`);
      } else {
        const newId = await addBisindoItem(
          {
            word,
            category: extraData?.category || "sapaan",
            difficulty: extraData?.difficulty || "mudah",
            description: extraData?.description || "",
            poseKey: finalPoseKey,
            videoRawUrl: mediaPreviewUrl || "",
            asset3dUrl: gifResult.gifUrl,
            thumbnailUrl: gifResult.gifUrl,
            status: "ready",
          },
          mediaSource instanceof File ? mediaSource : null
        );
        setPipelineState((prev) => ({ ...prev, itemId: newId }));
        toast.success(`Media "${word}" berhasil diubah menjadi Animasi 3D GIF!`);
      }
    } catch (err: any) {
      console.error("Gagal pipeline per-frame 3D:", err);
      toast.error("Gagal membuat 3D GIF: " + (err?.message || "Kesalahan"));
      setPipelineState((prev) => ({
        ...prev,
        stepDescription: "Terjadi kendala saat ekstraksi frame. Silakan coba kembali.",
        isFinished: true,
      }));
    }
  };

  // Submit new sign item
  const handleSubmitNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWord.trim()) {
      toast.error("Kata atau frasa isyarat wajib diisi!");
      return;
    }

    const word = formWord.trim();
    const category = formCategory;
    const difficulty = formDifficulty;
    const description = formDescription.trim();
    const poseKey = formPoseKey;

    // Pick media file based on selected mode
    const mediaFile =
      mediaInputMode === "video"
        ? selectedVideoFile
        : mediaInputMode === "image"
        ? selectedImageFile
        : selectedVideoFile || selectedImageFile;

    // Reset modal form
    setFormWord("");
    setFormCategory("sapaan");
    setFormDifficulty("mudah");
    setFormDescription("");
    setFormPoseKey("auto");
    setSelectedVideoFile(null);
    setVideoFilePreview(null);
    setSelectedImageFile(null);
    setImageFilePreview(null);
    setShowAddModal(false);

    // Langsung jalankan ekstraksi per-frame dan pembuatan 3D Animated GIF
    startGenerationPipeline(word, mediaFile, undefined, {
      category,
      difficulty,
      description,
      poseKey,
    });
  };

  // Trigger 3D Generation Simulation / Retry
  const handleTrigger3D = async (item: BisindoItem, overridePoseKey?: string) => {
    const poseKey = overridePoseKey || item.poseKey;
    try {
      await updateBisindoItem(item.id, { status: "generating_3d" });
    } catch (e) {
      console.error(e);
    }
    startGenerationPipeline(item.word, item.videoRawUrl || null, item.id, {
      category: item.category,
      difficulty: item.difficulty,
      description: item.description,
      poseKey,
    });
  };

  // Delete item
  const handleDeleteItem = async (item: BisindoItem) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kosakata "${item.word}"?`)) return;

    const toastId = toast.loading(`Menghapus "${item.word}"...`);
    try {
      await deleteBisindoItem(item.id);
      toast.success(`"${item.word}" berhasil dihapus dari database.`, { id: toastId });
    } catch (err: any) {
      toast.error("Gagal menghapus: " + err.message, { id: toastId });
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || item.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Calculate statistics
  const totalCount = items.length;
  const ready3DCount = items.filter((i) => i.status === "ready").length;
  const videoCount = items.filter((i) => i.videoRawUrl).length;
  const generatingCount = items.filter((i) => i.status === "generating_3d").length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header Neumorphic Sesuai Standar Admin ── */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="flex gap-4 sm:gap-5">
          <div className="p-3.5 sm:p-4 neo-icon-btn rounded-2xl text-[#00B894] h-fit shrink-0">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <div className="pt-1 sm:pt-1.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center text-[11px] font-extrabold neo-pressed text-[#00B894] px-3.5 py-1 rounded-full uppercase tracking-wider">
                Portal Developer & Super Admin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Studio Isyarat 3D & CMS Dinamis
            </h1>
            <p className="text-slate-500 mt-1 font-medium text-sm sm:text-base leading-relaxed">
              Unggah video peragaan orang asli, ekstrak otomatis gerakannya ke karakter 3D Rian POLMAN, dan sinkronkan secara dinamis tanpa *hardcode*.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center sm:justify-start gap-2 neo-flat-primary animate-pulse-glow px-6 py-3.5 font-bold w-full sm:w-auto border-none shrink-0 cursor-pointer rounded-2xl text-white text-sm"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Tambah Bahan Isyarat</span>
        </button>
      </header>

      {/* ── Statistics Metric Cards (Neumorphic Soft Cards) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="neo-flat p-5 rounded-2xl border-none flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Kosakata</span>
            <div className="p-2 neo-icon-btn rounded-xl text-blue-500">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 mt-2">{totalCount}</div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">Tersimpan di Katalog</div>
        </div>

        <div className="neo-flat p-5 rounded-2xl border-none flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video Asli HP</span>
            <div className="p-2 neo-icon-btn rounded-xl text-indigo-500">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 mt-2">{videoCount}</div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">File rekaman terunggah</div>
        </div>

        <div className="neo-flat p-5 rounded-2xl border-none flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aset 3D Siap</span>
            <div className="p-2 neo-icon-btn rounded-xl text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#00B894] mt-2">{ready3DCount}</div>
          <div className="text-[11px] font-bold text-[#00B894]/80 mt-1">Siap diputar di web</div>
        </div>

        <div className={`p-5 rounded-2xl border-none flex flex-col justify-between transition-all ${
          generatingCount > 0 ? "neo-flat ring-2 ring-amber-500 animate-pulse" : "neo-flat"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Proses AI 3D</span>
            <div className="p-2 neo-icon-btn rounded-xl text-amber-500">
              <RotateCw className={`w-4 h-4 ${generatingCount > 0 ? "animate-spin" : ""}`} />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 mt-2">{generatingCount}</div>
          <div className="text-[11px] font-bold text-amber-600/80 mt-1">
            {generatingCount > 0 ? "Sedang mengekstrak gerak..." : "Antrean ekstraksi kosong"}
          </div>
        </div>
      </div>

      {/* ── Search & Filter Toolbar (Neumorphic Inset) ── */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari kata isyarat atau petunjuk gerakan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-5 py-4 rounded-2xl neo-pressed border-none text-slate-700 font-extrabold focus:outline-none placeholder:text-slate-400 transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="relative flex-1 md:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto appearance-none pl-5 pr-11 py-4 rounded-2xl neo-pressed border-none text-sm font-extrabold text-slate-700 focus:outline-none bg-transparent cursor-pointer min-w-[180px]"
            >
              <option value="all">Semua Kategori</option>
              {Object.entries(CATEGORY_LABELS).map(([catKey, catVal]) => (
                <option key={catKey} value={catKey}>
                  {catVal.icon} {catVal.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="relative flex-1 md:flex-none">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full md:w-auto appearance-none pl-5 pr-11 py-4 rounded-2xl neo-pressed border-none text-sm font-extrabold text-slate-700 focus:outline-none bg-transparent cursor-pointer min-w-[170px]"
            >
              <option value="all">Semua Kesulitan</option>
              <option value="mudah">Tingkat: Mudah</option>
              <option value="sedang">Tingkat: Sedang</option>
              <option value="sulit">Tingkat: Sulit</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Card Grid of Sign Items (Neumorphic Elevated Cards) ── */}
      {loading ? (
        <div className="flex flex-col gap-5 py-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="neo-flat h-[180px] w-full rounded-3xl overflow-hidden shimmer border-none" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="neo-pressed p-16 text-center border-none rounded-3xl">
          <div className="w-16 h-16 neo-flat rounded-2xl flex items-center justify-center mx-auto mb-4 border-none">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-lg mb-1">Kosakata Tidak Ditemukan</h3>
          <p className="text-slate-500 text-sm font-medium">
            Tidak ada kosakata yang cocok. Coba sesuaikan kata kunci atau klik &quot;Tambah Bahan Isyarat&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const catInfo = CATEGORY_LABELS[item.category] || CATEGORY_LABELS.sapaan;
            const isReady = item.status === "ready";
            const isGenerating = item.status === "generating_3d";

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`neo-flat p-5 sm:p-6 rounded-3xl border-none flex flex-col justify-between relative group transition-all duration-300 hover:-translate-y-1 ${
                  isGenerating ? "ring-2 ring-[#00B894] ring-offset-2 ring-offset-[#E8F4F1] animate-pulse" : ""
                }`}
              >
                <div className="space-y-4">
                  {/* Category & Difficulty Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="neo-pressed px-3 py-1 rounded-full text-xs font-bold text-[#00B894] flex items-center gap-1.5 border-none">
                      <span>{catInfo.icon}</span>
                      <span>{catInfo.label}</span>
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider neo-flat border-none ${
                        item.difficulty === "mudah"
                          ? "text-emerald-600"
                          : item.difficulty === "sedang"
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {item.difficulty}
                    </span>
                  </div>

                  {/* Word Title & Gesture Pose Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {item.word}
                      </h3>
                      {(() => {
                        const poseInfo = GESTURE_PRESETS[item.poseKey || ""] || mapGestureTo3DAsset(item.word);
                        return (
                          <span
                            className="neo-pressed px-2.5 py-1 rounded-full text-[11px] font-extrabold text-[#00B894] flex items-center gap-1 shrink-0"
                            title={`Posisi Tangan: ${poseInfo.positionLabel}`}
                          >
                            <span>{poseInfo.icon}</span>
                            <span className="hidden sm:inline">{poseInfo.name}</span>
                          </span>
                        );
                      })()}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Visual Preview Box (Neumorphic Inset) */}
                  <div className="relative w-full h-44 rounded-2xl neo-pressed p-2 border-none overflow-hidden flex items-center justify-center">
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.word}
                          fill
                          unoptimized
                          className={`object-cover object-top transition-transform duration-500 ${
                            isGenerating ? "scale-105 filter brightness-90" : "group-hover:scale-105"
                          }`}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
                      )}

                      {/* Status saat Generasi 3D berlangsung */}
                      {isGenerating && (
                        <div className="absolute inset-0 bg-[#E8F4F1]/60 backdrop-blur-xs flex items-center justify-center pointer-events-none z-10">
                          <div className="p-3 rounded-full neo-flat text-[#00B894] shadow-md">
                            <RotateCw className="w-5 h-5 animate-spin" />
                          </div>
                        </div>
                      )}

                      {/* Status Badges Overlay */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-20">
                        {isReady ? (
                          <span className="neo-flat px-3 py-1.5 rounded-full text-xs font-bold text-[#00B894] flex items-center gap-1.5 border-none shadow-sm bg-[#E8F4F1]/90 backdrop-blur-sm">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{item.asset3dUrl?.startsWith("data:image/gif") ? "3D GIF Animasi" : "3D Rian Siap"}</span>
                          </span>
                        ) : isGenerating ? (
                          <button
                            onClick={() =>
                              startGenerationPipeline(item.word, item.videoRawUrl, item.id, {
                                category: item.category,
                                difficulty: item.difficulty,
                                description: item.description,
                                poseKey: item.poseKey || "auto",
                              })
                            }
                            className="neo-flat-primary px-3 py-1.5 rounded-full text-xs font-black text-white flex items-center gap-1.5 border-none shadow-md animate-pulse cursor-pointer"
                          >
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Ekstraksi AI 3D Aktif...</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="neo-flat px-3 py-1.5 rounded-full text-xs font-bold text-blue-600 flex items-center gap-1.5 border-none shadow-sm bg-[#E8F4F1]/90 backdrop-blur-sm">
                            <Video className="w-3.5 h-3.5" />
                            <span>Video Terunggah</span>
                          </span>
                        )}

                        {item.videoRawUrl && (
                          <button
                            onClick={() => setPreviewVideoUrl(item.videoRawUrl)}
                            className="p-2 rounded-full neo-flat hover:-translate-y-[2px] text-slate-700 transition-all border-none cursor-pointer"
                            title="Tonton Video Peragaan Asli"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 pt-4 border-t border-white/50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreview3DItem(item)}
                    className="px-4 py-2 rounded-xl neo-flat text-xs font-extrabold text-[#00B894] hover:-translate-y-[2px] transition-all flex items-center gap-2 border-none cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Uji Coba 3D</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTrigger3D(item)}
                      className="p-2.5 rounded-xl neo-icon-btn text-slate-500 hover:text-[#00B894] transition-all border-none cursor-pointer"
                      title="Ekstrak / Generate Ulang 3D"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="p-2.5 rounded-xl neo-icon-btn text-rose-500 hover:text-rose-600 transition-all border-none cursor-pointer"
                      title="Hapus Kosakata"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── MODAL 1: FUTURISTIC AI 3D MOTION PIPELINE (Neumorphic Glass) ── */}
      <AnimatePresence>
        {pipelineState.isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative w-full max-w-4xl bg-[#E8F4F1] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] border-2 border-white/60 p-6 sm:p-8 max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col"
            >
              {/* Header Pipeline */}
              <div className="flex items-center justify-between pb-5 border-b border-white/50">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neo-pressed text-[#00B894] text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#00B894] animate-ping" />
                    <span>AI MOTION CAPTURE & PIPELINE</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Ekstraksi Gerakan:</span>
                    <span className="text-[#00B894]">&quot;{pipelineState.word}&quot;</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    MediaPipe Holistic AI (543 Landmarks) ➔ Skeletal Retargeting ➔ 3D Rian POLMAN
                  </p>
                </div>

                <button
                  onClick={() => setPipelineState((prev) => ({ ...prev, isOpen: false }))}
                  className="p-2.5 rounded-full neo-icon-btn text-slate-500 hover:text-slate-800 transition-all border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Split Screen Video & 3D Avatar */}
              <div className="py-6 grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {/* Left Side: Input Video/Image + MediaPipe Tracker */}
                <div className="md:col-span-5 neo-pressed rounded-2xl p-2.5 overflow-hidden flex flex-col border-none">
                  <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span className="flex items-center gap-1.5 text-[#00B894]">
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      1. INPUT: MEDIA PERAGAAN ASLI
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 neo-pressed px-2.5 py-1 rounded-full">
                      Video Bersih
                    </span>
                  </div>

                  <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                    {pipelineState.videoUrl ? (
                      pipelineState.videoUrl.startsWith("data:image/") ||
                      /\.(jpe?g|png|webp|svg)(\?.*)?$/i.test(pipelineState.videoUrl) ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            ref={pipelineImageRef}
                            src={pipelineState.videoUrl}
                            alt="Media peragaan"
                            crossOrigin="anonymous"
                            loading="eager"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <video
                          ref={pipelineVideoRef}
                          src={pipelineState.videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          crossOrigin="anonymous"
                          className="w-full h-full object-contain"
                        />
                      )
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          ref={pipelineImageRef}
                          src="/avatars/rian_salam.jpg"
                          alt="Demo peragaan"
                          crossOrigin="anonymous"
                          loading="eager"
                          fetchPriority="high"
                          className="w-full h-full object-contain opacity-80"
                        />
                      </div>
                    )}

                    <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-between text-[10px] font-medium text-white/90 bg-slate-900/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10">
                      <span>MEDIA PERAGAAN ASLI</span>
                      <span className="text-[#00B894] font-bold">32 FRAME DETAIL (13.3 FPS)</span>
                    </div>
                  </div>
                </div>

                {/* Center Neural Bridge */}
                <div className="md:col-span-1 flex md:flex-col items-center justify-center gap-2 py-2">
                  <div className="p-3 rounded-full neo-icon-btn text-[#00B894] border-none">
                    <Cpu className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="hidden md:flex flex-col items-center gap-1">
                    <ArrowRight className="w-4 h-4 text-[#00B894] rotate-90 md:rotate-0 animate-bounce" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      AI RETARGET
                    </span>
                  </div>
                </div>

                {/* Right Side: 3D Rian Reconstruction */}
                <div className="md:col-span-5 neo-pressed rounded-2xl p-2.5 overflow-hidden flex flex-col border-none">
                  <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span className="flex items-center gap-1.5 text-[#00B894]">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      2. OUTPUT: 3D RIAN POLMAN
                    </span>
                    <span className="text-[#00B894] font-extrabold">
                      {pipelineState.isFinished ? "✅ 3D READY" : "SYNTHESIZING..."}
                    </span>
                  </div>

                  <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#edf2f7] to-[#d9e2ec] flex items-center justify-center">
                    {/* Holographic Ring Base */}
                    <div className="absolute bottom-2 w-44 h-12 rounded-[100%] border border-[#00B894]/40 bg-[#00B894]/10 pointer-events-none" />
                    <div className="absolute bottom-3 w-32 h-8 rounded-[100%] border border-dashed border-[#00B894]/60 animate-spin pointer-events-none" />

                    <div className="w-44 h-56 relative z-10 flex items-center justify-center">
                      <Bisindo3DCharacter
                        isAnimating={true}
                        customImage={pipelineState.compiledGifUrl || pipelineState.targetAsset3dUrl}
                        currentSign={pipelineState.targetPoseKey || "salam"}
                        speed={1.0}
                        avatarModel="rian"
                      />
                    </div>

                    <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-between text-[10px] font-bold text-slate-700 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-lg neo-flat border-none">
                      <span>RIGGING: 3D MOTION SIKLUS</span>
                      <span className="text-[#00B894] font-extrabold">RIAN POLMAN</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigasi Tab Pipeline: Visual 3D Rian vs Deskripsi Kinematika vs Prompt AI Video */}
              <div className="flex items-center gap-2 border-b border-white/50 pb-2 mb-2 overflow-x-auto custom-scrollbar">
                <button
                  type="button"
                  onClick={() => setPipelineTab("3d")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border-none cursor-pointer whitespace-nowrap ${
                    pipelineTab === "3d"
                      ? "neo-flat-primary text-white shadow-sm"
                      : "neo-flat text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1. Visual 3D Rian</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPipelineTab("motion")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border-none cursor-pointer whitespace-nowrap ${
                    pipelineTab === "motion"
                      ? "neo-flat-primary text-white shadow-sm"
                      : "neo-flat text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>2. Deskripsi Gerak 3D</span>
                  {pipelineState.motionDescription && (
                    <span className="w-2 h-2 rounded-full bg-[#00B894] animate-pulse" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPipelineTab("ai_prompt")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border-none cursor-pointer whitespace-nowrap ${
                    pipelineTab === "ai_prompt"
                      ? "neo-flat-primary text-white shadow-sm"
                      : "neo-flat text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>3. Prompt AI Video (Kling/Runway/Sora)</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-700 px-1.5 py-0.2 rounded font-black">
                    LOCK 3D
                  </span>
                </button>
              </div>

              {/* TAB 1: Visual 3D & Infografis Kinematika */}
              {pipelineTab === "3d" && pipelineState.analysis && (
                <div className="neo-pressed rounded-2xl p-4 border-none space-y-2.5 mb-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 text-[#00B894]">
                      <Activity className="w-4 h-4" />
                      ANALISIS KINEMATIKA GERAKAN (543 TITIK LANDMARK AI)
                    </span>
                    <span className="font-mono text-[11px] text-[#00B894] font-black bg-[#00B894]/10 px-2.5 py-0.5 rounded-md">
                      {pipelineState.analysis.confidenceScore}% MATCH
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="neo-flat p-2.5 rounded-xl border-none">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                        📍 Posisi Relatif
                      </span>
                      <span className="font-extrabold text-slate-800 block text-xs">
                        {pipelineState.analysis.handPositionLabel}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                        Jarak ke Dagu: {pipelineState.analysis.handToMouthDistanceCm} cm
                      </span>
                    </div>

                    <div className="neo-flat p-2.5 rounded-xl border-none">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                        🖐️ Bentuk Jari & Sendi
                      </span>
                      <span className="font-extrabold text-slate-800 block text-xs line-clamp-1">
                        {pipelineState.analysis.fingerShapeLabel}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                        Fleksi: {pipelineState.analysis.fingerFlexionPercentage}% • 21 Sendi
                      </span>
                    </div>

                    <div className="neo-flat p-2.5 rounded-xl border-none">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                        🧭 Arah & Fase Gerak
                      </span>
                      <span className="font-extrabold text-slate-800 block text-xs line-clamp-1">
                        {pipelineState.analysis.movementDirection}
                      </span>
                      <span className="text-[10px] text-[#00B894] font-bold block mt-0.5">
                        Fase: {pipelineState.analysis.movementPhase}
                      </span>
                    </div>

                    <div className="neo-flat p-2.5 rounded-xl border-none">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                        🎯 Prediksi Gestur
                      </span>
                      <span className="font-extrabold text-[#00B894] block text-xs">
                        {pipelineState.analysis.predictedGesture}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-0.5 line-clamp-1">
                        {pipelineState.analysis.technicalDescription}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Deskripsi Detail Gerakan 3D Animasi */}
              {pipelineTab === "motion" && (
                <div className="neo-pressed rounded-2xl p-4 border-none space-y-3 mb-2 max-h-72 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#00B894]">
                      <FileText className="w-4 h-4" />
                      SPESIFIKASI KINEMATIKA 3D ANIMASI BISINDO
                    </span>
                    {pipelineState.motionDescription && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(pipelineState.motionDescription!, "Deskripsi Gerak 3D")
                        }
                        className="px-2.5 py-1 rounded-lg neo-flat text-xs font-bold text-slate-700 hover:text-[#00B894] flex items-center gap-1 border-none cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Deskripsi</span>
                      </button>
                    )}
                  </div>

                  <div className="neo-flat p-3.5 rounded-xl text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans border-none">
                    {pipelineState.motionDescription ||
                      "Deskripsi gerakan 3D akan digenerate otomatis setelah proses analisis frame selesai."}
                  </div>
                </div>
              )}

              {/* TAB 3: Prompt AI Video Generator (Character Consistency Lock: Rian) */}
              {pipelineTab === "ai_prompt" && (
                <div className="neo-pressed rounded-2xl p-4 border-none space-y-3 mb-2 max-h-72 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#00B894]">
                        <Terminal className="w-4 h-4" />
                        PROMPT AI VIDEO (CONSISTENT CHARACTER: RIAN 3D)
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Siap di-copy ke Kling AI, Runway Gen-3 Alpha, Sora, Luma Dream Machine, Midjourney v6
                      </span>
                    </div>
                    {pipelineState.aiPrompt && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(pipelineState.aiPrompt!.fullText, "Prompt AI Video")
                        }
                        className="px-3 py-1.5 rounded-xl neo-flat-primary text-xs font-bold text-white flex items-center gap-1.5 border-none cursor-pointer shadow-sm hover:-translate-y-[1px] transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Prompt Lengkap</span>
                      </button>
                    )}
                  </div>

                  {pipelineState.aiPrompt ? (
                    <div className="space-y-2 text-xs">
                      <div className="neo-flat p-3 rounded-xl border-none">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                          🟢 Positive Prompt (Character & Action)
                        </span>
                        <p className="font-mono text-[11px] text-slate-800 leading-relaxed select-all">
                          {pipelineState.aiPrompt.positive}
                        </p>
                      </div>

                      <div className="neo-flat p-3 rounded-xl border-none">
                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block mb-1">
                          🔴 Negative Prompt (Anti-Distortion)
                        </span>
                        <p className="font-mono text-[11px] text-slate-600 leading-relaxed select-all">
                          {pipelineState.aiPrompt.negative}
                        </p>
                      </div>

                      <div className="neo-flat p-2.5 rounded-xl border-none flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-bold">⚙️ Parameters:</span>
                        <code className="bg-slate-200/80 px-2 py-0.5 rounded text-[#00B894] font-mono font-bold">
                          {pipelineState.aiPrompt.parameters}
                        </code>
                      </div>
                    </div>
                  ) : (
                    <div className="neo-flat p-4 rounded-xl text-center text-xs text-slate-500 border-none">
                      Prompt AI Video akan dibuat otomatis setelah proses pipeline selesai.
                    </div>
                  )}
                </div>
              )}

              {/* Progress & Stepper Bar */}
              <div className="pt-4 border-t border-white/50 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#00B894] animate-pulse" />
                      <span>{pipelineState.stepDescription}</span>
                    </span>
                    <span className="text-[#00B894] font-black text-sm">{pipelineState.progress}%</span>
                  </div>

                  <div className="w-full h-3 neo-pressed rounded-full overflow-hidden p-0.5 border-none">
                    <motion.div
                      className="h-full rounded-full neo-flat-primary shadow-sm"
                      animate={{ width: `${pipelineState.progress}%` }}
                      transition={{ ease: "easeOut", duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* 4 Step Tracker Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "1. Unggah Video", icon: Video },
                    { label: "2. MediaPipe 543 Pts", icon: Activity },
                    { label: "3. Retargeting 3D", icon: Layers },
                    { label: "4. Selesai & Terhubung", icon: CheckCircle2 },
                  ].map((step, idx) => {
                    const isActive = pipelineState.stepIndex === idx;
                    const isDone = pipelineState.stepIndex > idx || pipelineState.isFinished;
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.label}
                        className={`p-2.5 rounded-2xl border-none text-center flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                          isActive
                            ? "neo-flat-primary text-white"
                            : isDone
                            ? "neo-flat text-[#00B894]"
                            : "neo-pressed text-slate-400"
                        }`}
                      >
                        {isDone ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <StepIcon className={`w-4 h-4 ${isActive ? "animate-spin" : ""}`} />
                        )}
                        <span className="truncate">{step.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons Once Finished */}
                {pipelineState.isFinished && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3"
                  >
                    <Link
                      href="/app/bipintar/kamus-bisindo"
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl neo-flat font-bold text-slate-700 hover:-translate-y-[2px] transition-all text-xs flex items-center justify-center gap-2 border-none cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-[#00B894]" />
                      <span>Buka di Kamus biPINTAR</span>
                    </Link>

                    <button
                      onClick={() => setPipelineState((prev) => ({ ...prev, isOpen: false }))}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl neo-flat-primary font-bold text-white hover:-translate-y-[2px] transition-all text-xs flex items-center justify-center gap-2 border-none cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai & Tutup Pipeline</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: FORM TAMBAH BAHAN ISYARAT (Neumorphic Inset) ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative w-full max-w-xl bg-[#E8F4F1] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/50 mb-6">
                <div>
                  <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                    Tambah Bahan Isyarat 3D Baru
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Masukkan kata dan unggah video peragaan dari kamera HP Anda
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full neo-icon-btn text-slate-500 hover:text-slate-800 transition-all border-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmitNewItem} className="space-y-5 flex-1">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Kata atau Frasa Isyarat <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formWord}
                    onChange={(e) => setFormWord(e.target.value)}
                    placeholder="Contoh: Selamat Pagi, Terima Kasih, Gedung POLMAN"
                    className="w-full neo-pressed-input text-slate-900 font-bold px-4 py-3 border-none rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Kategori
                    </label>
                    <div className="relative">
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as BisindoCategory)}
                        className="w-full neo-pressed-input text-slate-900 font-bold px-4 py-3 appearance-none border-none rounded-xl cursor-pointer"
                      >
                        {Object.entries(CATEGORY_LABELS).map(([key, info]) => (
                          <option key={key} value={key}>
                            {info.icon} {info.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Tingkat Kesulitan (Kuis)
                    </label>
                    <div className="relative">
                      <select
                        value={formDifficulty}
                        onChange={(e) => setFormDifficulty(e.target.value as BisindoDifficulty)}
                        className="w-full neo-pressed-input text-slate-900 font-bold px-4 py-3 appearance-none border-none rounded-xl cursor-pointer"
                      >
                        <option value="mudah">🟢 Mudah (Pemula)</option>
                        <option value="sedang">🟡 Sedang (Menengah)</option>
                        <option value="sulit">🔴 Sulit (Mahir)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Pose 3D Avatar (AI Motion Sync) */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Target Pose 3D Avatar (AI Motion Sync)
                  </label>
                  <div className="relative">
                    <select
                      value={formPoseKey}
                      onChange={(e) => setFormPoseKey(e.target.value)}
                      className="w-full neo-pressed-input text-slate-900 font-bold px-4 py-3 appearance-none border-none rounded-xl cursor-pointer"
                    >
                      <option value="auto">🤖 Deteksi Otomatis dari Video (AI MediaPipe) [Direkomendasikan]</option>
                      <option value="terima_kasih">🗣️ Terima Kasih (Dagu / Bibir Bawah)</option>
                      <option value="salam">🫀 Salam / Hormat (Dada Kiri / Jantung)</option>
                      <option value="bisa">👍 Pasti BISA! (Jempol Mengacung)</option>
                      <option value="ya">✊ Ya / Setuju (Kepalan Mengangguk)</option>
                      <option value="halo">👋 Halo / Sapaan (Pelipis / Lambaian)</option>
                      <option value="tolong">🤲 Tolong / Bantuan (Kedua Telapak Menengadah)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Filter className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
                    {formPoseKey === "auto"
                      ? "✨ AI MediaPipe 543 titik akan menganalisis otomatis pose tangan dan ritme peragaan dari video yang Anda unggah."
                      : `🔒 Pose 3D dikunci ke: ${GESTURE_PRESETS[formPoseKey]?.name || formPoseKey} (${GESTURE_PRESETS[formPoseKey]?.positionLabel || ""})`}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Petunjuk Pelafalan / Gerakan Tangan
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Jelaskan bentuk telapak tangan dan arah ayunan gerakannya..."
                    className="w-full neo-pressed-input text-slate-900 font-bold px-4 py-3 resize-none border-none rounded-xl"
                  />
                </div>

                {/* Segmented Media Input Mode Tabs */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Metode Input Peragaan Isyarat <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl neo-pressed border-none mb-4">
                    <button
                      type="button"
                      onClick={() => setMediaInputMode("video")}
                      className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border-none cursor-pointer ${
                        mediaInputMode === "video"
                          ? "neo-flat-primary text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>1. Video Peragaan (Fokus Frame)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMediaInputMode("image")}
                      className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border-none cursor-pointer ${
                        mediaInputMode === "image"
                          ? "neo-flat-primary text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>2. Foto / Gambar</span>
                    </button>
                  </div>

                  {/* TAB 1: VIDEO UPLOAD */}
                  {mediaInputMode === "video" && (
                    <div className="space-y-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={handleVideoSelect}
                        className="hidden"
                      />

                      {videoFilePreview ? (
                        <div className="relative rounded-2xl neo-pressed p-2 border-none">
                          <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                            <video
                              ref={modalVideoRef}
                              src={videoFilePreview}
                              controls
                              autoPlay
                              loop
                              muted
                              playsInline
                              crossOrigin="anonymous"
                              className="w-full h-full object-contain"
                            />
                            {/* Top HUD Controls on Preview */}
                            <div className="absolute top-2 right-2 z-20">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedVideoFile(null);
                                  if (videoFilePreview) URL.revokeObjectURL(videoFilePreview);
                                  setVideoFilePreview(null);
                                  setModalCvStatus(null);
                                }}
                                className="p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Deteksi Posisi Nyata Tag */}
                            {modalCvStatus?.detected && (
                              <div className="absolute bottom-11 left-2 z-20 bg-slate-900/85 backdrop-blur-md text-[#E2E8F0] text-[9.5px] px-2.5 py-1 rounded-md border border-white/10 font-medium flex items-center gap-1.5">
                                <span className="text-[#00B894] font-bold">📍 POSISI NYATA:</span>
                                <span>{modalCvStatus.label}</span>
                              </div>
                            )}

                            {/* Bottom Status HUD */}
                            <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-between text-[10px] font-semibold text-white/90 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10">
                              <span className="flex items-center gap-1.5 font-bold">
                                <Video className="w-3.5 h-3.5 text-[#00B894]" />
                                VIDEO PERAGAAN
                              </span>
                              {modalCvStatus && !modalCvStatus.detected ? (
                                <span className="text-[#F43F5E] font-bold flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 text-[#F43F5E]" />
                                  TIDAK ADA ORANG TERDETEKSI (0%)
                                </span>
                              ) : (
                                <span className="text-[#00B894] font-bold flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-[#00B894] animate-pulse" />
                                  {modalCvStatus?.detected
                                    ? `ORANG TERDETEKSI (${modalCvStatus.confidence}%) • 543 PTS`
                                    : "543 TITIK LANDMARK SIAP"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="neo-pressed rounded-2xl p-6 text-center cursor-pointer border-none hover:brightness-105 transition-all space-y-2"
                        >
                          <div className="w-12 h-12 rounded-full neo-icon-btn text-[#00B894] flex items-center justify-center mx-auto border-none">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="text-sm font-extrabold text-slate-800">
                            Klik untuk memilih file video rekaman HP
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            Kamera stabil sejajar dada, format MP4/WebM, maksimal 50 MB.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: IMAGE UPLOAD */}
                  {mediaInputMode === "image" && (
                    <div className="space-y-3">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                      />

                      {imageFilePreview ? (
                        <div className="relative rounded-2xl neo-pressed p-2 border-none">
                          <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                            <img
                              ref={modalImageRef}
                              src={imageFilePreview}
                              alt="Foto peragaan"
                              crossOrigin="anonymous"
                              className="w-full h-full object-contain"
                            />

                            {/* Top HUD Controls on Preview */}
                            <div className="absolute top-2 right-2 z-20">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedImageFile(null);
                                  if (imageFilePreview) URL.revokeObjectURL(imageFilePreview);
                                  setImageFilePreview(null);
                                  setModalCvStatus(null);
                                }}
                                className="p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Deteksi Posisi Nyata Tag */}
                            {modalCvStatus?.detected && (
                              <div className="absolute bottom-11 left-2 z-20 bg-slate-900/85 backdrop-blur-md text-[#E2E8F0] text-[9.5px] px-2.5 py-1 rounded-md border border-white/10 font-medium flex items-center gap-1.5">
                                <span className="text-[#00B894] font-bold">📍 POSISI NYATA:</span>
                                <span>{modalCvStatus.label}</span>
                              </div>
                            )}

                            {/* Bottom Status HUD */}
                            <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-between text-[10px] font-semibold text-white/90 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10">
                              <span className="flex items-center gap-1.5 font-bold">
                                <ImageIcon className="w-3.5 h-3.5 text-[#00B894]" />
                                FOTO PERAGAAN AKTIF
                              </span>
                              {modalCvStatus && !modalCvStatus.detected ? (
                                <span className="text-[#F43F5E] font-bold flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 text-[#F43F5E]" />
                                  TIDAK ADA ORANG TERDETEKSI (0%)
                                </span>
                              ) : (
                                <span className="text-[#00B894] font-bold flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-[#00B894] animate-pulse" />
                                  {modalCvStatus?.detected
                                    ? `ORANG TERDETEKSI (${modalCvStatus.confidence}%) • 32 FRAME 3D`
                                    : "32 FRAME MIKRO-GERAK 3D"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => imageInputRef.current?.click()}
                          className="neo-pressed rounded-2xl p-6 text-center cursor-pointer border-none hover:brightness-105 transition-all space-y-2"
                        >
                          <div className="w-12 h-12 rounded-full neo-icon-btn text-[#00B894] flex items-center justify-center mx-auto border-none">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <div className="text-sm font-extrabold text-slate-800">
                            Klik untuk memilih file foto/gambar peraga
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            Format JPG, PNG, atau WebP. Deteksi pose tangan, dagu, dan dada otomatis.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 border-t border-white/50">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3.5 neo-flat font-bold text-slate-600 rounded-xl hover:-translate-y-[2px] transition-all w-full sm:w-auto border-none cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3.5 neo-flat-primary font-bold text-white rounded-xl flex items-center justify-center gap-2 hover:-translate-y-[2px] transition-all w-full sm:w-auto border-none cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Simpan & Ekstrak 3D</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 3: PREVIEW VIDEO ASLI ── */}
      <AnimatePresence>
        {previewVideoUrl && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-[#E8F4F1] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60 p-5"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/50">
                <span className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#00B894]" /> Video Rekaman Peragaan Asli
                </span>
                <button
                  onClick={() => setPreviewVideoUrl(null)}
                  className="p-2 rounded-full neo-icon-btn text-slate-500 hover:text-slate-800 border-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="rounded-2xl neo-pressed p-2 overflow-hidden border-none">
                <video src={previewVideoUrl} controls autoPlay className="w-full max-h-[65vh] object-contain rounded-xl" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 4: UJI COBA 3D RIAN (Neumorphic) ── */}
      <AnimatePresence>
        {preview3DItem && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-[#E8F4F1] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-white/60 p-6 sm:p-8 flex flex-col items-center text-center space-y-4"
            >
              <button
                onClick={() => setPreview3DItem(null)}
                className="absolute top-5 right-5 p-2 rounded-full neo-icon-btn text-slate-500 hover:text-slate-800 border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {(() => {
                const preset = GESTURE_PRESETS[preview3DItem.poseKey || ""] || mapGestureTo3DAsset(preview3DItem.word);
                const activeAvatarUrl = preview3DItem.asset3dUrl?.startsWith("data:image/gif")
                  ? preview3DItem.asset3dUrl
                  : preset.asset3dUrl;

                return (
                  <>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full neo-pressed text-[#00B894] text-xs font-extrabold border-none">
                        <span>🧑‍🎓 Rian (POLMAN) 3D Avatar</span>
                      </div>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full neo-pressed text-slate-700 text-xs font-extrabold border-none">
                        <span>{preset.icon}</span>
                        <span>{preset.positionLabel}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                        &quot;{preview3DItem.word}&quot;
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1.5 max-w-xs leading-relaxed">
                        {preview3DItem.description &&
                        !preview3DItem.description.toLowerCase().includes("menangkup") &&
                        !preview3DItem.description.toLowerCase().includes("dada sambil sedikit")
                          ? preview3DItem.description
                          : preset.description}
                      </p>
                    </div>

                    {/* 3D Character Canvas */}
                    <div className="w-64 h-80 rounded-2xl neo-pressed p-2 border-none relative overflow-hidden flex items-center justify-center">
                      <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#edf2f7] to-[#d9e2ec]">
                        <Bisindo3DCharacter
                          isAnimating={true}
                          customImage={activeAvatarUrl}
                          currentSign={preset.key}
                          speed={1.0}
                          avatarModel="rian"
                        />
                      </div>
                    </div>
                  </>
                );
              })()}

              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Tersinkronisasi ke biPINTAR, biSAPA, & Widget</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
