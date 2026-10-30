"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Loader2 } from "lucide-react";
import {
  RianSkeletalController,
  resolveSkeletalPose,
} from "@/utils/rianSkeletalEngine";

export interface Rian3DCanvasProps {
  currentSign?: string;
  isAnimating?: boolean;
  speed?: number;
  jacketColor?: "blue" | "dark" | "mustard";
  enableParallax?: boolean;
  enableBreathing?: boolean;
  className?: string;
  onLoaded?: () => void;
  onError?: (error: Error) => void;
}

const BLAZER_COLORS: Record<"blue" | "dark" | "mustard", number[]> = {
  blue: [0.15, 0.20, 0.58, 1.0],     // Biru Almamater POLMAN Bandung
  dark: [0.12, 0.15, 0.22, 1.0],     // Charcoal Hitam Elegan
  mustard: [0.72, 0.45, 0.10, 1.0],  // Emas / Mustard Modern
};

export default function Rian3DCanvas({
  currentSign = "neutral",
  isAnimating = true,
  speed = 1.0,
  jacketColor = "blue",
  enableParallax = true,
  enableBreathing = true,
  className = "w-full h-full",
  onLoaded,
  onError,
}: Rian3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Reference instance Three.js
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controllerRef = useRef<RianSkeletalController | null>(null);
  const blazerMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Parallax koordinat mouse kursor
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // Waktu render loop presisi tinggi (pengganti THREE.Clock yang deprecated)
  const lastTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Refs reaktif untuk props agar tidak memicu unmount WebGL berulang
  const currentSignRef = useRef<string>(currentSign);
  const isAnimatingRef = useRef<boolean>(isAnimating);
  const speedRef = useRef<number>(speed);
  const enableParallaxRef = useRef<boolean>(enableParallax);
  const enableBreathingRef = useRef<boolean>(enableBreathing);
  const jacketColorRef = useRef<"blue" | "dark" | "mustard">(jacketColor);

  useEffect(() => {
    currentSignRef.current = currentSign;
    if (controllerRef.current) {
      const target = currentSign && currentSign.trim() ? currentSign : "neutral";
      controllerRef.current.setTargetSign(target);
    }
  }, [currentSign]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    enableParallaxRef.current = enableParallax;
  }, [enableParallax]);

  useEffect(() => {
    enableBreathingRef.current = enableBreathing;
  }, [enableBreathing]);

  // Update warna jas almamater secara dinamis tanpa recreate context
  useEffect(() => {
    jacketColorRef.current = jacketColor;
    if (blazerMaterialRef.current) {
      const rgba = BLAZER_COLORS[jacketColor] || BLAZER_COLORS.blue;
      blazerMaterialRef.current.color.setRGB(rgba[0], rgba[1], rgba[2]);
      blazerMaterialRef.current.needsUpdate = true;
    }
  }, [jacketColor]);

  // Handler interaksi mouse untuk efek parallax leher & kepala
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enableParallaxRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mousePosRef.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      };
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    mousePosRef.current = { x: 0, y: 0 };
  }, []);

  // Inisialisasi Siklus Hidup Three.js (Hanya Sekali saat Mount)
  useEffect(() => {
    const mountContainer = canvasMountRef.current;
    if (!mountContainer) return;

    let isDisposed = false;
    const width = mountContainer.clientWidth || 320;
    const height = mountContainer.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: Komposisi Waist-Up Lega dengan Headroom Aman & Margin Sisi
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 20);
    camera.position.set(0, 1.05, 2.35);
    camera.lookAt(0, 0.98, 0);
    cameraRef.current = camera;

    // 3. WebGLRenderer Fotorealistik (ACESFilmic + sRGB + Dynamic DevicePixelRatio)
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // Injeksi canvas secara defensif ke isolated mount container
      if (renderer.domElement.parentNode !== mountContainer) {
        mountContainer.appendChild(renderer.domElement);
      }
      rendererRef.current = renderer;
    } catch (err) {
      console.error("[Rian3DCanvas] Gagal inisialisasi WebGLRenderer:", err);
      setHasError(true);
      onError?.(err instanceof Error ? err : new Error(String(err)));
      return;
    }

    // 4. Tata Cahaya Studio Tiga Titik Fotorealistik Terkalibrasi
    // A. Ambient Light lembut (0.6 intensitas, warna netral kebiruan halus)
    const ambientLight = new THREE.AmbientLight(0xf1f5f9, 0.6);
    scene.add(ambientLight);

    // B. Directional Key Light dari kanan depan-atas (1.4 intensitas, putih hangat)
    const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.4);
    keyLight.position.set(1.6, 2.6, 2.2);
    scene.add(keyLight);

    // C. Soft Fill Light dari kiri depan (0.8 intensitas, biru pastel lembut untuk aksen almamater)
    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.8);
    fillLight.position.set(-1.6, 1.6, 1.8);
    scene.add(fillLight);

    // D. Subtle Rim / Hair Light dari belakang atas (1.2 intensitas, memisahkan lekuk bahu & rambut dari background)
    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 1.2);
    rimLight.position.set(0, 2.4, -2.0);
    scene.add(rimLight);

    // E. Subtle Lapel / Chest Bounce Light
    const chestFill = new THREE.DirectionalLight(0xfff8ee, 0.35);
    chestFill.position.set(0, 0.8, 1.6);
    scene.add(chestFill);

    // 5. Muat Model Rian Berkerangka (rian_rigged.glb)
    const loader = new GLTFLoader();
    const modelUrl = "/avatars/rian_rigged.glb";

    loader.load(
      modelUrl,
      (gltf) => {
        if (isDisposed) return;
        const root = gltf.scene;

        // Skala 78% dan posisikan sedikit turun (-0.18) agar:
        // 1. Kepala tidak menabrak batas atas / tombol close
        // 2. Rentangan tangan kiri-kanan tidak terpotong tepi canvas
        // 3. Menghasilkan framing waist-up yang luas dan lega
        root.scale.set(0.78, 0.78, 0.78);
        root.position.set(0, -0.18, 0);
        scene.add(root);

        // Kumpulkan semua tulang armature
        const bones: THREE.Bone[] = [];
        root.traverse((child) => {
          if ((child as any).isBone) {
            bones.push(child as THREE.Bone);
          }

          // Deteksi material blazer untuk penggantian warna dinamis
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const materials = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];

            materials.forEach((mat) => {
              if (mat && mat.name === "Blazer") {
                blazerMaterialRef.current = mat as THREE.MeshStandardMaterial;
                const rgba =
                  BLAZER_COLORS[jacketColorRef.current] || BLAZER_COLORS.blue;
                (mat as THREE.MeshStandardMaterial).color.setRGB(
                  rgba[0],
                  rgba[1],
                  rgba[2]
                );
              }
            });
          }
        });

        // Inisialisasi Skeletal Motion Controller
        const controller = new RianSkeletalController(bones);
        controllerRef.current = controller;

        const initialSign =
          currentSignRef.current && currentSignRef.current.trim()
            ? currentSignRef.current
            : "neutral";
        controller.setTargetSign(initialSign);

        setIsLoading(false);
        onLoaded?.();
      },
      undefined,
      (err) => {
        if (isDisposed) return;
        console.error("[Rian3DCanvas] Gagal memuat model rian_rigged.glb:", err);
        setHasError(true);
        setIsLoading(false);
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    );

    // 6. Loop Animasi Utama (Render Loop murni presisi tinggi performance.now() - Bebas Warning Deprecated)
    lastTimeRef.current = performance.now();
    startTimeRef.current = performance.now();
    const renderLoop = (timeNow?: number) => {
      animFrameIdRef.current = requestAnimationFrame(renderLoop);

      const currentTime = typeof timeNow === "number" && timeNow > 0 ? timeNow : performance.now();
      const delta = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;
      const elapsed = (currentTime - startTimeRef.current) / 1000;

      // Controller selalu di-update setiap frame agar slerp pose selalu tereksekusi mulus
      if (controllerRef.current) {
        controllerRef.current.update({
          deltaTime: delta,
          speed: speedRef.current,
          mouseParallax: enableParallaxRef.current
            ? mousePosRef.current
            : { x: 0, y: 0 },
          enableBreathing: enableBreathingRef.current,
          clockTime: elapsed,
          isAnimating: isAnimatingRef.current,
        });
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    // 7. Penanganan Ukuran Responsif (Resize Observer)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });

    resizeObserver.observe(mountContainer);

    // 8. Pembersihan Defensif (Defensive Cleanup saat Unmount)
    return () => {
      isDisposed = true;

      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      resizeObserver.disconnect();

      // Bersihkan scene tanpa melempar exception
      try {
        if (sceneRef.current) {
          sceneRef.current.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.geometry?.dispose();
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => m?.dispose());
              } else if (mesh.material) {
                mesh.material.dispose();
              }
            }
          });
        }
      } catch {
        // Abaikan error traversal pada scene saat unmount
      }

      // Pembuangan WebGLRenderer defensif
      try {
        const canvas = rendererRef.current?.domElement;
        if (mountContainer && canvas && canvas.parentNode === mountContainer) {
          mountContainer.removeChild(canvas);
        }
      } catch {
        // Abaikan error pelepasan node jika DOM sudah di-detach oleh browser
      }

      try {
        rendererRef.current?.dispose();
      } catch {
        // Abaikan error dispose renderer
      }

      controllerRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      blazerMaterialRef.current = null;
    };
  }, [onLoaded, onError]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative overflow-hidden select-none cursor-pointer ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Kontainer Khusus Terisolasi untuk Canvas WebGL Three.js (Bebas Anak React) */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Loading Overlay Halus */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm z-30 transition-opacity duration-300 pointer-events-none">
          <Loader2 className="w-7 h-7 text-[#1B9981] animate-spin mb-2" />
          <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
            Memuat 3D Rian POLMAN...
          </span>
        </div>
      )}

      {/* Fallback jika WebGL error */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-30 bg-slate-900/60 pointer-events-none">
          <p className="text-xs font-semibold text-rose-300">
            Gagal memuat akselerasi 3D WebGL.
          </p>
        </div>
      )}
    </div>
  );
}
