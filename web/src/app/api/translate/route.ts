import { NextRequest, NextResponse } from "next/server";
import { maskBrand, unmaskBrand } from "@/lib/brandProtection";

// Cache in-memory to prevent repeated calls for the same text
const translationCache = new Map<string, string>();

async function translateSingle(
  text: string,
  targetLang: string = "en",
  sourceLang: string = "id"
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Masking nama merek resmi sebelum dikirim ke mesin penerjemah
  const maskedInput = maskBrand(trimmed);

  const cacheKey = `${sourceLang}:${targetLang}:${maskedInput}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const encoded = encodeURIComponent(maskedInput);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encoded}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 }, // Cache on server for 1 hour
    });

    if (!res.ok) {
      return unmaskBrand(trimmed);
    }

    const data = await res.json();
    // data[0] is array of [[translatedText, originalText, ...], ...]
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translatedRaw = data[0]
        .map((item: any) => item[0])
        .filter(Boolean)
        .join("");
      if (translatedRaw) {
        // Kembalikan token kembali ke ejaan baku "diBISAlitas" dan periksa regex pengaman
        const finalTranslated = unmaskBrand(translatedRaw);
        translationCache.set(cacheKey, finalTranslated);
        return finalTranslated;
      }
    }
    return unmaskBrand(trimmed);
  } catch (error) {
    console.error("Auto-translation error:", error);
    return unmaskBrand(trimmed);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, texts, target = "en", source = "id" } = body;

    if (texts && Array.isArray(texts)) {
      const translatedList = await Promise.all(
        texts.map((t: string) =>
          typeof t === "string" ? translateSingle(t, target, source) : t
        )
      );
      return NextResponse.json({
        success: true,
        target,
        translations: translatedList,
      });
    }

    if (typeof text === "string") {
      const translated = await translateSingle(text, target, source);
      return NextResponse.json({
        success: true,
        target,
        translation: translated,
      });
    }

    return NextResponse.json(
      { success: false, error: "Teks tidak valid" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const q = searchParams.get("q") || searchParams.get("text") || "";
  const to = searchParams.get("to") || searchParams.get("target") || "en";
  const from = searchParams.get("from") || searchParams.get("source") || "id";

  if (!q) {
    return NextResponse.json(
      { success: false, error: "Parameter 'q' atau 'text' diperlukan" },
      { status: 400 }
    );
  }

  const translation = await translateSingle(q, to, from);
  return NextResponse.json({
    success: true,
    source: from,
    target: to,
    translation,
  });
}
