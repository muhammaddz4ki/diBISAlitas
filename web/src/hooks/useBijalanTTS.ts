import { useRef, useCallback, useEffect, useState } from "react";
import { BijalanDetectionResult } from "../utils/bijalanYoloInference";

/** Ukuran ruang koordinat model (piksel) */
const FRAME = 640;

/**
 * Panduan suara BiJALAN yang lebih cerdas untuk tunanetra:
 * - Memilih rintangan paling GENTING (kombinasi kedekatan + berada di jalur/tengah).
 * - Menyebut ARAH (kiri / depan / kanan) dan JARAK berjenjang (agak jauh / dekat / sangat dekat).
 * - Getar (Android) & nada/kecepatan bicara meningkat saat sangat dekat.
 * - Throttle adaptif: makin dekat, makin sering diperingatkan.
 */
export function useBijalanTTS() {
  const lastSpokenTimeRef = useRef<Record<string, number>>({});

  const [baseSpeed, setBaseSpeed] = useState(1.05);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const loadVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speakDetections = useCallback(
    (detections: BijalanDetectionResult[], physicalDistanceCm?: number | null) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (window.speechSynthesis.speaking) return;

      const now = Date.now();

      // PROTOKOL FAIL-SAFE: Objek transparan (kaca) atau lingkungan gelap pekat
      // Terpicu jika sensor fisik membaca halangan < 80 cm meskipun kamera tidak melihat objek
      if (detections.length === 0) {
        if (physicalDistanceCm !== null && physicalDistanceCm !== undefined && physicalDistanceCm < 80 && physicalDistanceCm > 0) {
          if (now - (lastSpokenTimeRef.current["__failsafe__"] ?? 0) > 1200) {
            lastSpokenTimeRef.current["__failsafe__"] = now;
            if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
              navigator.vibrate([150, 50, 150]);
            }
            const u = new SpeechSynthesisUtterance("Awas! Ada halangan sangat dekat di depan Anda!");
            u.lang = "id-ID";
            const idVoice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().includes("id"));
            if (idVoice) u.voice = idVoice;
            u.rate = baseSpeed + 0.15;
            u.pitch = 1.25;
            window.speechSynthesis.speak(u);
          }
        }
        return;
      }

      // Pilih rintangan paling genting: urgensi = rasio area × bobot pusat (di jalur)
      let target: BijalanDetectionResult | null = null;
      let bestUrgency = 0;
      for (const d of detections) {
        const areaRatio = d.area / (FRAME * FRAME);
        const cx = d.box[0] / FRAME;
        const centerBonus = Math.max(0, 1 - Math.abs(cx - 0.5) * 2); // 1 di tengah → 0 di tepi
        const urgency = areaRatio * (0.6 + 0.4 * centerBonus);
        if (urgency > bestUrgency) {
          bestUrgency = urgency;
          target = d;
        }
      }
      if (!target) return;

      const cx = target.box[0] / FRAME;
      const isCenter = cx >= 0.38 && cx <= 0.62;
      const arah = cx < 0.38 ? "di kiri" : cx > 0.62 ? "di kanan" : "di depan";
      const label = target.label.charAt(0).toUpperCase() + target.label.slice(1);

      let level = 0;
      let jarakStr = "";

      // Prioritaskan jarak fisik objektif jika rintangan di sektor depan
      if (isCenter && physicalDistanceCm !== null && physicalDistanceCm !== undefined && physicalDistanceCm > 0) {
        level = physicalDistanceCm < 80 ? 2 : physicalDistanceCm < 180 ? 1 : 0;
        const m = (physicalDistanceCm / 100).toFixed(1).replace(".", ",");
        jarakStr = `${m} meter`;
      } else {
        const areaRatio = target.area / (FRAME * FRAME);
        level = areaRatio > 0.35 ? 2 : areaRatio > 0.15 ? 1 : 0; // 2=sangat dekat
        jarakStr = level === 2 ? "sangat dekat" : level === 1 ? "dekat" : "agak jauh";
      }

      const throttle = level === 2 ? 1200 : level === 1 ? 2200 : 3500;
      if (now - (lastSpokenTimeRef.current[target.label] ?? 0) < throttle) return;
      lastSpokenTimeRef.current[target.label] = now;

      const text = level === 2 
        ? `Awas! ${label} ${arah}, sangat dekat, ${jarakStr}.` 
        : `${label} ${arah}, ${jarakStr}.`;

      // Getar (didukung Android Chrome; diabaikan iOS)
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        if (level === 2) navigator.vibrate([120, 60, 120]);
        else if (level === 1) navigator.vibrate(120);
      }

      const u = new SpeechSynthesisUtterance(text);
      u.lang = "id-ID";
      const idVoice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().includes("id"));
      if (idVoice) u.voice = idVoice;
      u.rate = level === 2 ? baseSpeed + 0.1 : baseSpeed;
      u.pitch = level === 2 ? 1.25 : 1.0;
      u.volume = 1.0;
      window.speechSynthesis.speak(u);
    },
    [baseSpeed]
  );

  const cancelTTS = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speakDetections, cancelTTS, baseSpeed, setBaseSpeed };
}
