import { NextRequest, NextResponse } from "next/server";
import { parseTextToSignQueue, SignToken } from "@/utils/textToSignEngine";

// Standar CORS Headers untuk integrasi publik
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Content-Type": "application/json; charset=utf-8",
};

/**
 * OPTIONS Handler - Preflight Request
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Format payload respon JSON untuk client API
 */
function buildSignResponse(rawText: string, tokens: SignToken[]) {
  const totalDurationMs = tokens.reduce((sum, token) => sum + token.durationMs, 0);

  return {
    status: "success",
    version: "v1",
    timestamp: new Date().toISOString(),
    data: {
      inputText: rawText,
      totalTokens: tokens.length,
      totalDurationMs,
      estimatedSeconds: Number((totalDurationMs / 1000).toFixed(1)),
      character: {
        id: "rian",
        name: "Rian (POLMAN)",
        institution: "Politeknik Manufaktur Negeri Bandung",
        renderEngine: "3D Clay Parallax & Multi-Frame Kinematics",
        almamaterColor: "#1E3A8A", // Royal Blue POLMAN
        neutralAssetUrl: "/avatars/rian_neutral.jpg",
      },
      tokens: tokens.map((token, index) => ({
        index,
        id: token.id,
        rawText: token.rawText,
        displayWord: token.displayWord,
        type: token.type,
        poseKey: token.poseKey,
        assetUrl: token.assetUrl,
        animationFrames: token.animationFrames,
        durationMs: token.durationMs,
        description: token.description || "",
      })),
    },
  };
}

/**
 * GET Handler - Query Parameter: ?text=... atau ?q=...
 * Contoh: GET /api/v1/sign?text=Halo+terima+kasih
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text") || searchParams.get("q") || "";

    if (!text.trim()) {
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "Parameter 'text' atau 'q' wajib diisi. Contoh: /api/v1/sign?text=Halo+terima+kasih",
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const tokens = parseTextToSignQueue(text.trim());
    const responsePayload = buildSignResponse(text.trim(), tokens);

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Gagal memproses translasi isyarat.",
        error: error?.message || "Internal server error",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * POST Handler - Body JSON: { "text": "Halo terima kasih" }
 */
export async function POST(req: NextRequest) {
  try {
    let text = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      text = body?.text || body?.sentence || body?.q || "";
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      text = (formData.get("text") as string) || (formData.get("q") as string) || "";
    }

    if (!text.trim()) {
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "Field 'text' pada body JSON wajib diisi. Format: { \"text\": \"Halo terima kasih\" }",
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const tokens = parseTextToSignQueue(text.trim());
    const responsePayload = buildSignResponse(text.trim(), tokens);

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Gagal memproses translasi isyarat.",
        error: error?.message || "Internal server error",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

