/**
 * Client-side auto-translation utility for diBISAlitas
 * Dilengkapi proteksi token masking merek resmi "diBISAlitas"
 */

import { maskBrand, unmaskBrand } from "@/lib/brandProtection";

export async function translateText(
  text: string,
  target: "en" | "id" = "en",
  source: "id" | "en" = "id"
): Promise<string> {
  if (!text || !text.trim()) return text;
  if (target === source) return text;

  try {
    const maskedText = maskBrand(text);
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: maskedText, target, source }),
    });

    if (!res.ok) return unmaskBrand(text);
    const data = await res.json();
    return unmaskBrand(data.translation || text);
  } catch (err) {
    console.warn("Client translation fallback:", err);
    return unmaskBrand(text);
  }
}

export async function translateBatch(
  texts: string[],
  target: "en" | "id" = "en",
  source: "id" | "en" = "id"
): Promise<string[]> {
  if (!texts || texts.length === 0) return texts;
  if (target === source) return texts.map(unmaskBrand);

  try {
    const maskedTexts = texts.map(maskBrand);
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: maskedTexts, target, source }),
    });

    if (!res.ok) return texts.map(unmaskBrand);
    const data = await res.json();
    const rawTranslations: string[] = data.translations || texts;
    return rawTranslations.map(unmaskBrand);
  } catch (err) {
    console.warn("Batch translation error:", err);
    return texts.map(unmaskBrand);
  }
}

/**
 * Automatically attaches an English translation (`_en`) to a dynamic object or Firestore document
 * e.g. { title: "Pemberitahuan", body: "Hari ini sistem diupdate" }
 * => { title: "Pemberitahuan", title_en: "Notice", body: "Hari ini sistem diupdate", body_en: "Today the system is updated" }
 */
export async function enrichWithEnglish<T extends Record<string, any>>(
  data: T,
  fieldsToTranslate: (keyof T)[]
): Promise<T & Record<string, string>> {
  const enriched: any = { ...data };
  const keys: (keyof T)[] = [];
  const textsToTranslate: string[] = [];

  for (const field of fieldsToTranslate) {
    const val = data[field];
    if (typeof val === "string" && val.trim().length > 0) {
      keys.push(field);
      textsToTranslate.push(val);
    }
  }

  if (textsToTranslate.length === 0) return enriched;

  const translations = await translateBatch(textsToTranslate, "en", "id");
  keys.forEach((key, index) => {
    enriched[`${String(key)}_en`] = translations[index] || data[key];
  });

  return enriched;
}
