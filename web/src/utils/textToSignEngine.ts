import { BisindoItem } from "@/lib/types";

export type SignTokenType = "gesture" | "fingerspelling" | "pause";

export interface SignToken {
  id: string;
  rawText: string;             // Teks token asli, misal: "Aksesibilitas", "Cerdas", "Halo"
  displayWord: string;         // Kata tampilan
  type: SignTokenType;
  poseKey: string;             // 'terima_kasih' | 'halo' | 'salam' | 'bisa' | 'ya' | 'tolong'
  assetUrl: string;            // URL render 3D Rian POLMAN utama
  animationFrames: string[];   // Rangkaian multi-frame gerak 3D Rian POLMAN
  durationMs: number;          // Durasi tampil peraga (ms)
  description?: string;        // Deskripsi teknis peragaan
  letterIndex?: number;
  totalLetters?: number;
}

/**
 * Sekuens multi-frame mikro 3D Avatar Rian POLMAN.
 * Seluruh frame bersumber murni dari render 3D resolusi tinggi berjas almamater POLMAN Bandung.
 */
export const RIAN_GESTURE_FRAMES: Record<string, string[]> = {
  terima_kasih: [
    "/avatars/rian_tk_prep.jpg",
    "/avatars/rian_terimakasih.jpg",
    "/avatars/rian_terimakasih_fwd.jpg",
    "/avatars/rian_tk_return.jpg",
  ],
  halo: [
    "/avatars/rian_halo.jpg",
    "/avatars/rian_halo_wave2.jpg",
    "/avatars/rian_halo.jpg",
  ],
  ya: [
    "/avatars/rian_ya.jpg",
    "/avatars/rian_ya_down.jpg",
    "/avatars/rian_ya.jpg",
  ],
  salam: [
    "/avatars/rian_neutral.jpg",
    "/avatars/rian_salam.jpg",
    "/avatars/rian_salam.jpg",
  ],
  bisa: [
    "/avatars/rian_neutral.jpg",
    "/avatars/rian_bisa.jpg",
    "/avatars/rian_bisa.jpg",
  ],
  tolong: [
    "/avatars/rian_neutral.jpg",
    "/avatars/rian_tolong.jpg",
    "/avatars/rian_tolong.jpg",
  ],
  neutral: [
    "/avatars/rian_neutral.jpg",
  ],
};

/**
 * Kamus Frasa Multi-Kata Lengkap untuk Landing Page dan Percakapan Umum
 */
interface PhraseMapping {
  phrase: string;
  poseKey: string;
  label: string;
  description: string;
}

const MULTI_WORD_PHRASES: PhraseMapping[] = [
  // 1. Headline & Hero Section
  {
    phrase: "aksesibilitas cerdas kemandirian tanpa batas",
    poseKey: "bisa",
    label: "Aksesibilitas Cerdas, Kemandirian Tanpa Batas",
    description: "Visi kemandirian penuh penyandang disabilitas di Indonesia",
  },
  {
    phrase: "aksesibilitas cerdas",
    poseKey: "bisa",
    label: "Aksesibilitas Cerdas",
    description: "Peragaan kapabilitas teknologi cerdas dan kemandirian",
  },
  {
    phrase: "kemandirian tanpa batas",
    poseKey: "salam",
    label: "Kemandirian Tanpa Batas",
    description: "Peragaan kesetaraan akses dan penghormatan persaudaraan",
  },
  {
    phrase: "satu ekosistem berbasis kecerdasan buatan",
    poseKey: "bisa",
    label: "Ekosistem AI Cerdas",
    description: "Satu ekosistem berbasis kecerdasan buatan on-device dan cloud",
  },
  {
    phrase: "kecerdasan buatan",
    poseKey: "bisa",
    label: "Kecerdasan Buatan",
    description: "Teknologi kecerdasan buatan on-device untuk disabilitas",
  },
  {
    phrase: "tunanetra tunarungu dan tunadaksa",
    poseKey: "tolong",
    label: "Tunanetra, Tunarungu, Tunadaksa",
    description: "Tiga pilar solusi inklusif untuk seluruh ragam disabilitas",
  },
  {
    phrase: "penyandang disabilitas",
    poseKey: "tolong",
    label: "Penyandang Disabilitas",
    description: "Komunitas dan sahabat disabilitas Indonesia",
  },
  {
    phrase: "coba demo gratis",
    poseKey: "ya",
    label: "Coba Demo Gratis",
    description: "Akses simulasi interaktif seluruh modul secara gratis",
  },
  {
    phrase: "jelajahi fitur",
    poseKey: "halo",
    label: "Jelajahi Fitur",
    description: "Menjelajahi seluruh fitur cerdas diBISAlitas",
  },

  // 2. About & Almamater POLMAN Bandung
  {
    phrase: "tentang proyek",
    poseKey: "ya",
    label: "Tentang Proyek",
    description: "Informasi dan latar belakang platform diBISAlitas",
  },
  {
    phrase: "dibisalitas adalah platform ai",
    poseKey: "bisa",
    label: "Platform AI diBISAlitas",
    description: "Platform kecerdasan buatan untuk kemandirian disabilitas",
  },
  {
    phrase: "platform ai inklusivitas",
    poseKey: "bisa",
    label: "Platform AI Inklusivitas",
    description: "Platform inklusif yang dirancang ramah bagi semua pengguna",
  },
  {
    phrase: "kolaborasi mahasiswa polman bandung",
    poseKey: "salam",
    label: "Mahasiswa POLMAN Bandung",
    description: "Karya inovatif kolaborasi mahasiswa Politeknik Manufaktur Negeri Bandung",
  },
  {
    phrase: "polman bandung",
    poseKey: "salam",
    label: "POLMAN Bandung",
    description: "Politeknik Manufaktur Negeri Bandung",
  },
  {
    phrase: "indonesia inklusif",
    poseKey: "salam",
    label: "Indonesia Inklusif",
    description: "Mewujudkan masa depan Indonesia yang setara dan ramah disabilitas",
  },

  // 3. Modul & Fitur diBISAlitas
  {
    phrase: "kamus bisindo 3d",
    poseKey: "halo",
    label: "Kamus BISINDO 3D",
    description: "Kamus visual BISINDO interaktif dengan avatar 3D Rian POLMAN",
  },
  {
    phrase: "deteksi rintangan",
    poseKey: "ya",
    label: "Deteksi Rintangan",
    description: "Pendeteksian objek dan rintangan real-time untuk tunanetra",
  },
  {
    phrase: "speech to text",
    poseKey: "halo",
    label: "Speech to Text",
    description: "Pengenalan suara menjadi teks real-time",
  },
  {
    phrase: "text to speech",
    poseKey: "halo",
    label: "Text to Speech",
    description: "Pengucapan teks otomatis menggunakan kecerdasan buatan",
  },
  {
    phrase: "dampak nyata",
    poseKey: "bisa",
    label: "Dampak Nyata",
    description: "Kontribusi nyata untuk kemandirian dan kesetaraan disabilitas",
  },
  {
    phrase: "aplikasi mobile",
    poseKey: "ya",
    label: "Aplikasi Mobile",
    description: "Aplikasi mobile ramah pengguna dan ringan di berbagai perangkat",
  },

  // 4. Percakapan Umum & Ungkapan Sehari-hari
  {
    phrase: "terima kasih",
    poseKey: "terima_kasih",
    label: "Terima Kasih",
    description: "Ujung jemari menyentuh dagu lalu diayunkan maju terbuka",
  },
  {
    phrase: "terima kasih banyak",
    poseKey: "terima_kasih",
    label: "Terima Kasih Banyak",
    description: "Ujung jemari menyentuh dagu lalu diayunkan maju terbuka",
  },
  {
    phrase: "sama sama",
    poseKey: "salam",
    label: "Sama-Sama",
    description: "Telapak tangan kanan di dada kiri dengan rasa hormat",
  },
  {
    phrase: "selamat pagi",
    poseKey: "halo",
    label: "Selamat Pagi",
    description: "Telapak tangan terbuka setinggi pelipis dilambaikan ramah",
  },
  {
    phrase: "selamat siang",
    poseKey: "halo",
    label: "Selamat Siang",
    description: "Telapak tangan terbuka setinggi pelipis dilambaikan ramah",
  },
  {
    phrase: "selamat sore",
    poseKey: "halo",
    label: "Selamat Sore",
    description: "Telapak tangan terbuka setinggi pelipis dilambaikan ramah",
  },
  {
    phrase: "selamat malam",
    poseKey: "halo",
    label: "Selamat Malam",
    description: "Telapak tangan terbuka setinggi pelipis dilambaikan ramah",
  },
  {
    phrase: "selamat datang",
    poseKey: "halo",
    label: "Selamat Datang",
    description: "Lambaian hangat sapaan selamat datang",
  },
  {
    phrase: "apa kabar",
    poseKey: "halo",
    label: "Apa Kabar",
    description: "Lambaian tangan di samping pelipis diikuti gestur ramah",
  },
  {
    phrase: "pasti bisa",
    poseKey: "bisa",
    label: "Pasti BISA!",
    description: "Mengacungkan jempol ke depan dengan mantap dan percaya diri",
  },
  {
    phrase: "bisa bantu",
    poseKey: "tolong",
    label: "Bisa Bantu",
    description: "Kedua telapak tangan menengadah menawarkan bantuan",
  },
  {
    phrase: "tolong bantu",
    poseKey: "tolong",
    label: "Tolong Bantu",
    description: "Kedua telapak tangan terbuka menengadah memohon bantuan",
  },
];

/**
 * Kamus Kata Tunggal Semantik 3D Rian POLMAN
 */
interface WordSemanticMapping {
  keywords: string[];
  poseKey: string;
  label: string;
  description: string;
}

const SEMANTIC_MAPPINGS: WordSemanticMapping[] = [
  // 1. Terima Kasih & Apresiasi
  {
    keywords: ["terima", "kasih", "makasih", "thanks", "nuhun", "syukur", "alhamdulillah", "apresiasi"],
    poseKey: "terima_kasih",
    label: "Terima Kasih",
    description: "Ujung jemari menyentuh dagu lalu diayunkan maju terbuka",
  },
  // 2. Halo, Sapaan & Selamat Datang
  {
    keywords: ["halo", "hai", "sapa", "bye", "pagi", "siang", "sore", "malam", "lambai", "datang", "kenal", "sapaan", "b1suara", "bicara", "dengar", "suara", "jelajahi"],
    poseKey: "halo",
    label: "Halo",
    description: "Telapak tangan kanan terbuka setinggi pelipis dilambaikan ke samping",
  },
  // 3. Salam, Identitas, Platform, Hati & Kesetaraan
  {
    keywords: ["dibisalitas", "salam", "hormat", "jantung", "persaudaraan", "hati", "ekosistem", "wadah", "komunitas", "indonesia", "kita", "kamu", "saya", "polman", "bandung", "mahasiswa", "kampus", "akademik", "pendidikan"],
    poseKey: "salam",
    label: "Salam Hormat",
    description: "Telapak tangan kanan terbuka diletakkan di dada kiri",
  },
  // 4. Aksesibilitas, Cerdas, Teknologi, AI, Bisa, Mampu, Kemandirian, Solusi
  {
    keywords: ["bisa", "pasti", "mampu", "sukses", "mantap", "jempol", "aksesibilitas", "cerdas", "kemandirian", "teknologi", "ai", "inovasi", "pintar", "unggul", "juara", "solusi", "modern", "mutakhir", "b1pintar", "masa", "depan", "kamera", "visi"],
    poseKey: "bisa",
    label: "Pasti BISA!",
    description: "Mengacungkan jempol ke depan dengan mantap dan penuh keyakinan",
  },
  // 5. Bantuan, Tolong, Disabilitas, Inklusif, Teman Tuli, Netra, Daksa
  {
    keywords: ["tolong", "bantu", "bantuan", "mohon", "harap", "tolonglah", "disabilitas", "inklusif", "inklusivitas", "tunanetra", "tunarungu", "tunadaksa", "difabel", "ramah", "peduli", "layanan", "fasilitas", "akses"],
    poseKey: "tolong",
    label: "Tolong & Bantuan",
    description: "Membuka kedua telapak tangan menghadap ke atas di depan dada",
  },
  // 6. Konfirmasi, Ya, Siap, Proyek, Mulai, Sistem, Coba, Daftar
  {
    keywords: ["ya", "setuju", "oke", "siap", "betul", "benar", "angguk", "fist", "proyek", "sistem", "coba", "demo", "daftar", "masuk", "fitur", "mulai", "aktif", "b1jalan", "b1ketik", "jalan", "rintangan", "navigasi", "sensor", "tentang"],
    poseKey: "ya",
    label: "Ya (Setuju)",
    description: "Mengepalkan tangan di depan dada lalu mengangguk ke bawah dengan mantap",
  },
];

/**
 * Membersihkan tanda baca di sekeliling kata
 */
function cleanWord(str: string): string {
  return str.replace(/^[^\w\s]+|[^\w\s]+$/g, "").trim();
}

/**
 * Fallback Pose Selector untuk kata-kata umum lainnya agar Rian SELALU tampil dalam 3D
 * Memilih pose 3D Rian secara variatif dan harmonis berdasarkan hash kata.
 */
function getFallback3dPose(word: string): { poseKey: string; label: string; description: string } {
  const poses = [
    { poseKey: "bisa", label: word, description: `Peragaan isyarat 3D untuk kata "${word}"` },
    { poseKey: "salam", label: word, description: `Peragaan isyarat 3D untuk kata "${word}"` },
    { poseKey: "ya", label: word, description: `Peragaan isyarat 3D untuk kata "${word}"` },
    { poseKey: "halo", label: word, description: `Peragaan isyarat 3D untuk kata "${word}"` },
    { poseKey: "tolong", label: word, description: `Peragaan isyarat 3D untuk kata "${word}"` },
  ];

  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = (hash << 5) - hash + word.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % poses.length;
  return poses[index];
}

/**
 * TEXT-TO-SIGN TOKENIZER ENGINE
 * Mengubah kalimat menjadi rangkaian gerakan 3D Rian POLMAN tanpa menggunakan emotikon
 * dan tanpa beralih ke animasi kartun 2D.
 */
export function parseTextToSignQueue(
  text: string,
  customItems: BisindoItem[] = []
): SignToken[] {
  if (!text || !text.trim()) return [];

  const queue: SignToken[] = [];
  let tokenCounter = 0;

  // Split kata berdasarkan spasi
  const rawWords = text.trim().split(/\s+/);
  let i = 0;

  while (i < rawWords.length) {
    const rawWord = rawWords[i];
    const cleaned = cleanWord(rawWord).toLowerCase();

    if (!cleaned) {
      i++;
      continue;
    }

    // 1. Greedy Multi-Word Matching: Periksa frasa dari 5 kata hingga 2 kata
    let matchedPhrase: PhraseMapping | undefined;
    let matchedWordCount = 0;

    for (let len = Math.min(5, rawWords.length - i); len >= 2; len--) {
      const sliceWords = rawWords.slice(i, i + len).map((w) => cleanWord(w).toLowerCase()).filter(Boolean);
      const combo = sliceWords.join(" ");
      const found = MULTI_WORD_PHRASES.find((p) => p.phrase === combo);
      if (found) {
        matchedPhrase = found;
        matchedWordCount = len;
        break;
      }
    }

    if (matchedPhrase) {
      const frames = RIAN_GESTURE_FRAMES[matchedPhrase.poseKey] || RIAN_GESTURE_FRAMES.salam;
      queue.push({
        id: `token-${tokenCounter++}`,
        rawText: matchedPhrase.label,
        displayWord: matchedPhrase.label,
        type: "gesture",
        poseKey: matchedPhrase.poseKey,
        assetUrl: frames[0],
        animationFrames: frames,
        durationMs: 1400,
        description: matchedPhrase.description,
      });
      i += matchedWordCount;
      continue;
    }

    // 2. Cek di kosakata dinamis Firestore bisindo_dictionary
    const matchedCustom = customItems.find(
      (item) => item.word.toLowerCase() === cleaned || item.id.toLowerCase() === cleaned
    );

    if (matchedCustom) {
      const poseKey = matchedCustom.poseKey || "salam";
      const frames = RIAN_GESTURE_FRAMES[poseKey] || RIAN_GESTURE_FRAMES.salam;
      queue.push({
        id: `token-${tokenCounter++}`,
        rawText: matchedCustom.word,
        displayWord: matchedCustom.word,
        type: "gesture",
        poseKey,
        assetUrl: frames[0],
        animationFrames: frames,
        durationMs: 1350,
        description: matchedCustom.description || `Peragaan 3D untuk ${matchedCustom.word}`,
      });
      i++;
      continue;
    }

    // 3. Cek di kamus semantik kata tunggal
    const matchedSemantic = SEMANTIC_MAPPINGS.find((m) =>
      m.keywords.some((k) => cleaned === k || (cleaned.length > 3 && (cleaned.startsWith(k) || cleaned.endsWith(k))))
    );

    if (matchedSemantic) {
      const frames = RIAN_GESTURE_FRAMES[matchedSemantic.poseKey] || RIAN_GESTURE_FRAMES.salam;
      queue.push({
        id: `token-${tokenCounter++}`,
        rawText: rawWord,
        displayWord: matchedSemantic.label,
        type: "gesture",
        poseKey: matchedSemantic.poseKey,
        assetUrl: frames[0],
        animationFrames: frames,
        durationMs: 1300,
        description: matchedSemantic.description,
      });
      i++;
      continue;
    }

    // 4. Fallback kata umum: Gunakan 3D Rian POLMAN pose yang dinamis dan ekspresif
    // (Seluruh peragaan 100% konsisten menggunakan 3D Avatar Rian POLMAN)
    const fallback = getFallback3dPose(cleaned);
    const frames = RIAN_GESTURE_FRAMES[fallback.poseKey] || RIAN_GESTURE_FRAMES.salam;
    queue.push({
      id: `token-${tokenCounter++}`,
      rawText: rawWord,
      displayWord: rawWord,
      type: "gesture",
      poseKey: fallback.poseKey,
      assetUrl: frames[0],
      animationFrames: frames,
      durationMs: 1200,
      description: fallback.description,
    });

    i++;
  }

  // Jeda akhir kembali ke pose netral
  if (queue.length > 0) {
    queue.push({
      id: `token-neutral-${tokenCounter++}`,
      rawText: "Posisi Siap",
      displayWord: "",
      type: "pause",
      poseKey: "neutral",
      assetUrl: "/avatars/rian_neutral.jpg",
      animationFrames: ["/avatars/rian_neutral.jpg"],
      durationMs: 650,
      description: "Posisi istirahat netral",
    });
  }

  return queue;
}
