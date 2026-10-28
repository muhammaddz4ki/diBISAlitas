/**
 * Client-side auto-translation utility for diBISAlitas
 * Handles translating strings, arrays, or objects automatically
 */

export async function translateText(
  text: string,
  target: "en" | "id" = "en",
  source: "id" | "en" = "id"
): Promise<string> {
  if (!text || !text.trim()) return text;
  if (target === source) return text;

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target, source }),
    });

    if (!res.ok) return text;
    const data = await res.json();
    return data.translation || text;
  } catch (err) {
    console.warn("Client translation fallback:", err);
    return text;
  }
}

export async function translateBatch(
  texts: string[],
  target: "en" | "id" = "en",
  source: "id" | "en" = "id"
): Promise<string[]> {
  if (!texts || texts.length === 0) return texts;
  if (target === source) return texts;

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, target, source }),
    });

    if (!res.ok) return texts;
    const data = await res.json();
    return data.translations || texts;
  } catch (err) {
    console.warn("Batch translation error:", err);
    return texts;
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
