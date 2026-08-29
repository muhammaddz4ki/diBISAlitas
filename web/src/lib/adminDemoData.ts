export interface DemoObstacleReport {
  id: string;
  reporterId: string;
  reporterName: string;
  obstacleType: string;
  description: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  isResolved: boolean;
  createdAt: { seconds: number };
}

export interface DemoEmergencyReport {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  disabilityType: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  message: string;
  status: string;
  timestamp: { seconds: number };
  createdAt: { seconds: number };
}

export interface DemoAnnouncement {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: { seconds: number };
  author: string;
}

export function isAdminDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    new URLSearchParams(window.location.search).get("demo") === "true" ||
    window.sessionStorage.getItem("dibisalitas_admin_demo") === "true" ||
    window.sessionStorage.getItem("dibisalitas_admin_demo_mode") === "true" ||
    window.localStorage.getItem("dibisalitas_admin_demo") === "true" ||
    window.localStorage.getItem("dibisalitas_admin_demo_mode") === "true"
  );
}

export function safeFormatDate(
  timestamp: any,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!timestamp) return "-";
  try {
    let date: Date;
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp?.toDate === "function") {
      date = timestamp.toDate();
    } else if (typeof timestamp?.seconds === "number") {
      date = new Date(timestamp.seconds * 1000);
    } else if (typeof timestamp?._seconds === "number") {
      date = new Date(timestamp._seconds * 1000);
    } else if (typeof timestamp === "number") {
      date = new Date(timestamp);
    } else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      date = new Date();
    }

    if (isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("id-ID", options || {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "-";
  }
}

export const INITIAL_DEMO_OBSTACLES: DemoObstacleReport[] = [
  {
    id: "obs-demo-1",
    reporterId: "user-101",
    reporterName: "Budi Santoso (Tunanetra)",
    obstacleType: "Guiding Block Rusak",
    description: "Jalur pemandu tunanetra terputus akibat galian kabel di depan Halte Busway Tosari.",
    latitude: -6.1969,
    longitude: 106.8234,
    photoUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=500&auto=format&fit=crop&q=60",
    isResolved: false,
    createdAt: { seconds: Math.floor((Date.now() - 1800000) / 1000) },
  },
  {
    id: "obs-demo-2",
    reporterId: "user-102",
    reporterName: "Rian Prasetya (Pengguna Kursi Roda)",
    obstacleType: "Ramp Terlalu Curam / Terhalang",
    description: "Ramp kursi roda terhalang tiang rambu darurat di trotoar Stasiun Cikini sisi timur.",
    latitude: -6.1983,
    longitude: 106.8431,
    photoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60",
    isResolved: false,
    createdAt: { seconds: Math.floor((Date.now() - 7200000) / 1000) },
  },
  {
    id: "obs-demo-3",
    reporterId: "user-103",
    reporterName: "Siti Rahma (Relawan Inklusi)",
    obstacleType: "Lubang Trotoar Berbahaya",
    description: "Tutup bak kontrol utilitas terbuka tanpa penutup di jalur pedestrian Jl. Rasuna Said.",
    latitude: -6.2241,
    longitude: 106.8317,
    photoUrl: "https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=500&auto=format&fit=crop&q=60",
    isResolved: true,
    createdAt: { seconds: Math.floor((Date.now() - 86400000) / 1000) },
  },
  {
    id: "obs-demo-4",
    reporterId: "user-104",
    reporterName: "Agus Pratama",
    obstacleType: "Pedagang Menutupi Jalur",
    description: "Lapak PKL menutupi jalur kuning pemandu di kawasan Stasiun Gondangdia.",
    latitude: -6.1862,
    longitude: 106.8329,
    photoUrl: "",
    isResolved: true,
    createdAt: { seconds: Math.floor((Date.now() - 172800000) / 1000) },
  },
];

export const INITIAL_DEMO_EMERGENCIES: DemoEmergencyReport[] = [
  {
    id: "emg-demo-1",
    userId: "usr-demo-01",
    userName: "Hendra Wijaya",
    userPhone: "081298765432",
    disabilityType: "Tunanetra",
    latitude: -6.1932,
    longitude: 106.8228,
    message: "Tersesat di persimpangan jalan saat hujan deras, butuh asistensi navigasi penyeberangan.",
    status: "active",
    timestamp: { seconds: Math.floor((Date.now() - 900000) / 1000) },
    createdAt: { seconds: Math.floor((Date.now() - 900000) / 1000) },
  },
  {
    id: "emg-demo-2",
    userId: "usr-demo-02",
    userName: "Dewi Lestari",
    userPhone: "085612349876",
    disabilityType: "Tunadaksa (Kursi Roda)",
    latitude: -6.2115,
    longitude: 106.8153,
    message: "Roda kursi roda tersangkut pada celah lantai trotoar di depan Gedung WTC.",
    status: "active",
    timestamp: { seconds: Math.floor((Date.now() - 3600000) / 1000) },
    createdAt: { seconds: Math.floor((Date.now() - 3600000) / 1000) },
  },
  {
    id: "emg-demo-3",
    userId: "usr-demo-03",
    userName: "Fajar Nugraha",
    userPhone: "087733445566",
    disabilityType: "Tunarungu",
    latitude: -6.1754,
    longitude: 106.8272,
    message: "Sinyal BiSAFE dipicu dari halte Monas, relawan terdekat telah mendampingi.",
    status: "resolved",
    timestamp: { seconds: Math.floor((Date.now() - 86400000) / 1000) },
    createdAt: { seconds: Math.floor((Date.now() - 86400000) / 1000) },
  },
];

export const INITIAL_DEMO_ANNOUNCEMENTS: DemoAnnouncement[] = [
  {
    id: "ann-demo-1",
    title: "Pemutakhiran Sensor Jalur Pemandu Sudirman - Thamrin",
    content: "Dinas Perhubungan dan Tim Relawan diBISAlitas telah menyelesaikan kalibrasi 14 titik rintangan trotoar.",
    category: "Infrastruktur",
    createdAt: { seconds: Math.floor((Date.now() - 43200000) / 1000) },
    author: "Tim Admin diBISAlitas",
  },
  {
    id: "ann-demo-2",
    title: "Jadwal Pelatihan Relawan Pendamping Disabilitas Batch 3",
    content: "Pendaftaran pendamping ramah disabilitas dibuka untuk kegiatan car free day akhir pekan.",
    category: "Komunitas",
    createdAt: { seconds: Math.floor((Date.now() - 172800000) / 1000) },
    author: "Koordinator Relawan",
  },
];
