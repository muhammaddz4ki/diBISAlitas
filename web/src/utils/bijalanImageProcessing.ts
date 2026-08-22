import { Tensor } from "onnxruntime-web";

export function extractBijalanNchwTensor(
  canvas: HTMLCanvasElement,
  targetSize: number = 640
): Tensor {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not found");

  const imageData = ctx.getImageData(0, 0, targetSize, targetSize).data;

  const float32Data = new Float32Array(3 * targetSize * targetSize);
  const area = targetSize * targetSize;
  
  for (let i = 0; i < area; i++) {
    float32Data[i] = imageData[i * 4] / 255.0;            // Red
    float32Data[i + area] = imageData[i * 4 + 1] / 255.0; // Green
    float32Data[i + 2 * area] = imageData[i * 4 + 2] / 255.0; // Blue
  }

  return new Tensor("float32", float32Data, [1, 3, targetSize, targetSize]);
}
