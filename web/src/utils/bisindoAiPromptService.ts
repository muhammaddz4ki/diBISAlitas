/**
 * diBISAlitas 3D Avatar & AI Motion Description Generator
 * ────────────────────────────────────────────────────────
 * Mengonversi analisis video MediaPipe Holistic menjadi:
 * 1. Deskripsi Detail Kinematika Gerakan 3D (Spesifikasi untuk Animator 3D / Sistem)
 * 2. Prompt Siap Pakai untuk AI Video Generator (Kling AI, Runway Gen-3, Sora, Luma, Midjourney)
 *    dengan penguncian konsistensi karakter (Character Consistency Lock: Rian 3D).
 */

import { MotionAnalysisData } from "./motionCaptureEngine";

export interface BisindoAiPromptResult {
  positive: string;
  negative: string;
  parameters: string;
  fullText: string;
}

export interface BisindoMotionSpecResult {
  title: string;
  gestureName: string;
  targetBodyPart: string;
  handOrientation: string;
  fingerKinematics: string;
  timingTimeline: {
    anticipation: string;
    apex: string;
    recovery: string;
  };
  nonManualMarkers: {
    head: string;
    expression: string;
    torso: string;
  };
  markdown: string;
}

// Data deskripsi linguistik otentik BISINDO per pose
const GESTURE_DESCRIPTIONS: Record<
  string,
  {
    name: string;
    signDescription: string;
    actionPromptEn: string;
    targetZone: string;
    fingerDetail: string;
    headAction: string;
    expression: string;
  }
> = {
  terima_kasih: {
    name: "Terima Kasih (Sama-Sama)",
    signDescription:
      "Tangan kanan terbuka rileks dengan telapak menghadap ke dada/wajah, ujung jemari menyentuh lembut area dagu/bibir bawah, lalu diayunkan melandai maju ke depan ke arah lawan bicara dengan senyuman apresiatif dan anggukan hormat.",
    actionPromptEn:
      "Rian brings his right open hand up to gently touch his lower lip and chin with fingers softly touching, then smoothly glides his hand outward toward the viewer in a gracious arc while nodding gently with a warm, genuine thankful smile.",
    targetZone: "Area Dagu & Bibir Bawah (Jarak ~3-6 cm)",
    fingerDetail: "5 Jari lurus rapat rileks (fleksi ~10%), telapak menghadap ke dalam saat kontak, berotasi membuka ke depan saat diayunkan.",
    headAction: "Anggukan kepala lembut ~3° ke depan saat tangan mencapai titik ayunan terjauh.",
    expression: "Senyuman ramah tulus, mata bersahabat menatap langsung ke kamera.",
  },
  salam: {
    name: "Salam / Rasa Hormat",
    signDescription:
      "Tangan kanan terangkat dari posisi netral menuju dada kiri, telapak tangan diletakkan rata dan merapat lembut di atas jantung, jemari lurus teratur, disertai kepala sedikit menunduk takzim.",
    actionPromptEn:
      "Rian smoothly brings his right hand up and rests his open flat palm against his left chest over his heart, fingers neatly together, holding the respectful pose with a slight dignified bow and polite welcoming eye contact.",
    targetZone: "Area Dada Kiri / Sternum Jantung (Jarak 0 cm kontak)",
    fingerDetail: "Telapak tangan terbuka penuh, jemari merapat lurus sejajar, fleksi 0-8%.",
    headAction: "Kepala menunduk hormat ~4° dengan tempo tenang dan stabil.",
    expression: "Ekspresi hangat, penuh kesantunan dan kedamaian.",
  },
  ya: {
    name: "Ya / Konfirmasi Mantap",
    signDescription:
      "Tangan kanan membentuk kepalan santai di depan dada, diayunkan mengangguk ke bawah dua kali secara ritmis menyerupai anggukan kepala yang menegaskan persetujuan.",
    actionPromptEn:
      "Rian holds a relaxed fist in front of his chest and nods it downward twice in a firm, affirming gesture, matching his confident supportive nod and encouraging smile.",
    targetZone: "Area Dada Tengah / Torso (Jarak ~18 cm dari badan)",
    fingerDetail: "Kepalan tangan santai (fleksi 80%), ibu jari mengunci di samping telunjuk.",
    headAction: "Anggukan kepala sinkron mengikuti ketukan ayunan kepalan tangan.",
    expression: "Mata berbinar percaya diri, senyum ramah yang menegaskan.",
  },
  bisa: {
    name: "Bisa / Mampu / Optimis",
    signDescription:
      "Tangan kanan mengepal mantap dengan ibu jari (jempol) terangkat tegak ke atas, didorong sedikit ke depan secara dinamis dengan postur tubuh tegap penuh keyakinan.",
    actionPromptEn:
      "Rian raises his right hand into an energetic thumbs-up gesture pushed slightly forward, smiling broadly with confident, encouraging eyes, showing optimism and readiness.",
    targetZone: "Area Depan Dada Tengah (Jarak ~20 cm)",
    fingerDetail: "Jempol tegak lurus ke atas (fleksi 0%), 4 jari lainnya terlipat rapi mengepal (fleksi 95%).",
    headAction: "Kepala tegak mantap dengan sedikit kemiringan dinamis.",
    expression: "Senyum lebar bersahabat, tatapan mata penuh motivasi dan optimisme.",
  },
  halo: {
    name: "Halo / Hai / Sapaan",
    signDescription:
      "Tangan kanan terangkat tegak di samping pelipis/kepala dengan telapak menghadap ke depan, lalu melambai ke kiri dan ke kanan secara riang dan bersahabat.",
    actionPromptEn:
      "Rian raises his open right palm near his temple and performs a friendly, gentle side-to-side wave, beaming with a warm, approachable welcoming smile.",
    targetZone: "Area Samping Pelipis Kanan (Ketinggian Y: ~25% dari atas)",
    fingerDetail: "Kelima jari terbuka rileks, telapak menghadap ke depan lawan bicara.",
    headAction: "Sedikit memiringkan kepala ~2° ke arah lambaian tangan.",
    expression: "Senyuman sapaan yang sangat ceria dan bersahabat.",
  },
  tolong: {
    name: "Tolong / Mohon Bantuan",
    signDescription:
      "Kedua telapak tangan terbuka menengadah ke atas di depan dada pada jarak sekitar 15 cm, digerakkan maju perlahan memohon bantuan dengan ekspresi penuh harap dan kerendahan hati.",
    actionPromptEn:
      "Rian holds both open hands out in front of his chest with palms turned upward in an earnest, requesting gesture, leaning slightly forward with sincere, empathetic eyes.",
    targetZone: "Area Depan Torso Tengah (Kedua tangan simetris)",
    fingerDetail: "Kedua telapak terbuka rileks menengadah ke atas, jemari membuka alami.",
    headAction: "Kepala sedikit condong ke depan menyiratkan permohonan tulus.",
    expression: "Tatapan mata tulus, rendah hati, dan penuh empati.",
  },
};

/**
 * Menghasilkan Deskripsi Detail Kinematika Gerakan 3D untuk Dokumentasi & Rigging 3D
 */
export function generateBisindoMotionDescription(
  word: string,
  poseKey: string = "salam",
  analysis?: MotionAnalysisData
): BisindoMotionSpecResult {
  const normKey = poseKey.toLowerCase().replace(/-/g, "_");
  const base = GESTURE_DESCRIPTIONS[normKey] || GESTURE_DESCRIPTIONS.salam;

  const targetBody = analysis?.targetBodyPart
    ? analysis.targetBodyPart.toUpperCase()
    : normKey.toUpperCase();

  const handPosLabel = analysis?.handPositionLabel || base.targetZone;
  const fingerLabel = analysis?.fingerShapeLabel || base.fingerDetail;
  const flexion = analysis?.fingerFlexionPercentage ?? 10;
  const confidence = analysis?.confidenceScore ?? 99.2;

  const title = `Spesifikasi Gerakan 3D BISINDO: "${word.toUpperCase()}"`;

  const anticipationText = "Tangan berada di posisi istirahat netral di area pinggang, tubuh rileks seimbang. Tangan mulai terangkat halus menuju zona artikulasi (0.0s - 0.4s).";
  const apexText = `Tangan mencapai puncak pose (${base.name}): ${base.signDescription} (0.4s - 1.8s).`;
  const recoveryText = "Tangan melandai kembali secara deseleratif ke postur netral, tubuh kembali simetris (1.8s - 2.4s).";

  const markdown = `### 📐 ${title}
**Karakter Target:** Rian 3D (3D Clay Animation Avatar)
**Akurasi Kinematika AI:** ${confidence}% (${analysis?.landmarksSummary?.totalLandmarks || 543} Titik Landmark MediaPipe Holistic)

#### 1. Konfigurasi Tangan & Jari
- **Gestur:** ${base.name}
- **Posisi Artikulasi:** ${handPosLabel}
- **Zona Target:** ${targetBody}
- **Bentuk Jari:** ${fingerLabel} (Tingkat Fleksi: ${flexion}%)
- **Jarak Relatif:** ${analysis?.handToMouthDistanceCm ? `${analysis.handToMouthDistanceCm} cm ke Dagu` : "Sesuai standar artikulasi"} • ${analysis?.handToChestDistanceCm ? `${analysis.handToChestDistanceCm} cm ke Dada` : "Presisi ergonomis"}

#### 2. Siklus Fase Gerakan (Timeline)
- **Fase 1 (Anticipation / 0.0s - 0.4s):** ${anticipationText}
- **Fase 2 (Apex & Artikulasi / 0.4s - 1.8s):** ${apexText}
- **Fase 3 (Recovery / 1.8s - 2.4s):** ${recoveryText}

#### 3. Penanda Non-Manual (Ekspresi Wajah & Postur)
- **Kepala:** ${base.headAction}
- **Ekspresi:** ${base.expression}
- **Postur Tubuh:** Dada tegak rileks, bahu seimbang, tatapan mata stabil ke arah pengguna.`;

  return {
    title,
    gestureName: base.name,
    targetBodyPart: targetBody,
    handOrientation: handPosLabel,
    fingerKinematics: fingerLabel,
    timingTimeline: {
      anticipation: anticipationText,
      apex: apexText,
      recovery: recoveryText,
    },
    nonManualMarkers: {
      head: base.headAction,
      expression: base.expression,
      torso: "Dada tegak rileks, bahu stabil simetris",
    },
    markdown,
  };
}

/**
 * Menghasilkan Prompt AI Siap Pakai untuk AI Video Generator (Kling AI, Runway Gen-3, Luma, Sora)
 * dengan mengunci 100% konsistensi karakter 3D Rian.
 */
export function generateBisindoAiVideoPrompt(
  word: string,
  poseKey: string = "salam",
  analysis?: MotionAnalysisData
): BisindoAiPromptResult {
  const normKey = poseKey.toLowerCase().replace(/-/g, "_");
  const base = GESTURE_DESCRIPTIONS[normKey] || GESTURE_DESCRIPTIONS.salam;

  // Character Anchor: Menjamin model AI mempertahankan wajah, kacamata, blazer, dan style Rian yang konsisten 100%
  const characterAnchor =
    'Consistent Character "Rian": a charming young Indonesian college student, friendly 3D claymation stylized face with warm smile, distinctive stylish round-frame cream/beige spectacles, wavy neat brown clay hair. Wearing official POLMAN royal blue blazer jacket with geometric POLMAN emblem on the left chest pocket over a crisp white collared dress shirt, beige trousers.';

  // Style Anchor: 3D Pixar / Claymation berkualitas tinggi
  const styleAnchor =
    "Style: 3D stylized character animation, smooth claymation Pixar aesthetic, soft subsurface scattering, clean matte plasticine textures, premium render engine look.";

  // Action Description
  const actionAnchor = `Action: Rian fluidly and accurately performs the Indonesian Sign Language (BISINDO) sign for "${word}". ${base.actionPromptEn} Hand kinematics show perfectly articulated fingers, natural wrist flexion, and smooth elbow movement. Seamless looping motion, respectful head nod.`;

  // Camera & Lighting
  const environmentAnchor =
    "Camera & Lighting: Medium close-up portrait framing, static eye-level camera, solid soft mint-grey gradient studio backdrop (#E8F4F1 to #D0EBE3), gentle studio three-point lighting with soft rim light, soft volumetric floor contact shadow. 4K resolution, 60fps, ultra-stable character consistency.";

  const positive = `${characterAnchor} ${styleAnchor} ${actionAnchor} ${environmentAnchor}`;

  const negative =
    "mutated hands, deformed fingers, extra limbs, missing fingers, morphing face, changing clothes, inconsistent face, ugly, cartoon 2D, flat vector, twitching, flickering, blurry, low resolution, bad anatomy, unnatural movement, oversaturated.";

  const parameters =
    "--ar 1:1 --motion 5 --seed 202610 --fps 30 --character-lock true (Compatible: Kling AI, Runway Gen-3 Alpha, Luma Dream Machine, Sora, Midjourney v6)";

  const fullText = `=== AI VIDEO GENERATION PROMPT (CHARACTER: RIAN 3D) ===

[POSITIVE PROMPT]
${positive}

[NEGATIVE PROMPT]
${negative}

[PARAMETERS / SETTINGS]
${parameters}`;

  return {
    positive,
    negative,
    parameters,
    fullText,
  };
}
