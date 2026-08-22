import { Tensor } from "onnxruntime-web";
import { MODEL_INPUT_SIZE } from "../constants/signLabels";

/**
 * Mengekstrak piksel dari elemen video web (kamera depan),
 * membalik arah horizontal (un-mirror), merender ke hidden canvas,
 * lalu mengubah koordinat piksel menjadi format NCHW Planar RGB (Tensor Float32Array).
 *
 * @param video HTMLVideoElement yang sedang streaming kamera
 * @param ctx Konteks 2D Canvas untuk memanipulasi piksel
 * @param targetSize Ukuran input model (default MODEL_INPUT_SIZE = 640)
 * @param isFrontCamera Apakah kamera yang digunakan adalah kamera depan
 * @returns Object Tensor float32 [1, 3, targetSize, targetSize]
 */
export function extractNchwTensor(
  video: HTMLVideoElement,
  ctx: CanvasRenderingContext2D,
  targetSize: number = MODEL_INPUT_SIZE,
  isFrontCamera: boolean = true
): Tensor {
  // 1. Gambar video ke canvas (Mirror Horizontal)
  // Kamera depan me-mirror secara visual, jadi kita harus mirror ulang secara matematis 
  // agar model AI tidak melihat tangan terbalik.
  // Center-crop persegi (cover) agar rasio tangan tidak gepeng saat di-resize ke 640,
  // sekaligus menyamakan dengan preview kamera yang memakai object-cover.
  const vw = video.videoWidth || targetSize;
  const vh = video.videoHeight || targetSize;
  const side = Math.min(vw, vh);
  const sx = (vw - side) / 2;
  const sy = (vh - side) / 2;

  ctx.save();
  if (isFrontCamera) {
    ctx.scale(-1, 1);
    ctx.translate(-targetSize, 0);
  }
  ctx.drawImage(video, sx, sy, side, side, 0, 0, targetSize, targetSize);
  ctx.restore();

  // 2. Ekstrak piksel warna utuh (RGBA array)
  const imageData = ctx.getImageData(0, 0, targetSize, targetSize).data;

  // 3. Ekstraksi NCHW & Normalisasi
  // NCHW berarti Batch(1), Channel(3), Height(targetSize), Width(targetSize)
  // Float32Array menyimpan channel warna secara terpisah (Planar) alih-alih selang-seling (Interleaved)
  const float32Data = new Float32Array(3 * targetSize * targetSize);
  const area = targetSize * targetSize;
  
  for (let i = 0; i < area; i++) {
    // Normalisasi 0-255 menjadi 0.0-1.0
    float32Data[i] = imageData[i * 4] / 255.0;            // Red channel
    float32Data[i + area] = imageData[i * 4 + 1] / 255.0; // Green channel
    float32Data[i + 2 * area] = imageData[i * 4 + 2] / 255.0; // Blue channel
  }

  // Bungkus dalam object Tensor spesifik library ONNX Runtime
  return new Tensor("float32", float32Data, [1, 3, targetSize, targetSize]);
}
