# 🌐 Next.js Web App - BiPINTAR (diBISAlitas)

Ini adalah sub-proyek Web dari aplikasi **BiPINTAR**, dibangun menggunakan **Next.js 16 (App Router)** dan **TypeScript**. Aplikasi ini difokuskan pada deteksi isyarat tangan secara *real-time* di dalam browser menggunakan model Object Detection **YOLOv8** dan **ONNX Runtime Web** (`onnxruntime-web`).

Tujuan utama sistem ini adalah menghadirkan fitur penerjemah bahasa isyarat Arab (Hijaiyah) berkinerja tinggi tanpa memerlukan instalasi aplikasi tambahan bagi pengguna desktop/browser.

---

## 🏗️ Struktur Folder (Enterprise Modular Architecture)

Proyek ini telah melalui proses refactoring skala *Enterprise* untuk memisahkan UI (tampilan presentasional) dari logika berat kecerdasan buatan (State, Siklus Memori, Matematika Tensor).

```text
d:/lomba kmipn/web/
├── .next/                   # Build folder buatan Next.js (Dihasilkan Otomatis)
├── public/                  # Aset Statis yang dapat diakses dari browser
│   └── models/
│       └── Hijayah/
│           ├── model.onnx   # Model utama YOLOv8 Nano yang sudah dilatih (Dataset Roboflow)
│           └── labels_config.yaml # Konfigurasi cadangan label
├── src/
│   ├── app/                 # Routing Aplikasi (App Router)
│   │   ├── app/bipintar/hijaiyah/
│   │   │   └── page.tsx     # Halaman UI Utama Pendeteksi (Tidak ada logika AI di sini)
│   │   ├── admin/           # (Rencana) Halaman peta hotspot/admin
│   │   ├── globals.css      # Styling CSS utama dan Tailwind directives
│   │   └── layout.tsx       # Root layout untuk font dan struktur halaman dasar
│   │
│   ├── components/          # Komponen UI Reusable
│   │   └── CameraDetector.tsx # Penggabungan `video` dan `canvas` Bounding Box menjadi 1 widget 
│   │
│   ├── hooks/               # Custom React Hooks (Manajemen State & Lifecycle)
│   │   ├── useCamera.ts     # Hook pembungkus API `navigator.mediaDevices.getUserMedia`
│   │   └── useYolo.ts       # Hook orkestrator sesi inferensi WebAssembly (`ort.InferenceSession`)
│   │
│   ├── utils/               # Top-Level Pure Functions (Kalkulasi Matematika Berat)
│   │   ├── imageProcessing.ts # Menarik RGBA frame kamera -> Dibalik (Un-Mirror) -> Output NCHW Tensor
│   │   └── yoloInference.ts   # Membaca Float32Array YOLO, mencari Confidence Score > 0.25 (Threshold)
│   │
│   └── constants/           # Data Statis
│       └── signLabels.ts      # Daftar pemetaan 29 Kelas Huruf Arab (Urutan Sangat Sensitif)
│
├── package.json             # Dependensi Proyek (onnxruntime-web, lucide-react, next, react)
├── next.config.ts           # Konfigurasi Next.js (Termasuk Webpack handler untuk WebAssembly)
├── tsconfig.json            # Aturan kompilator TypeScript
└── firebase.json            # Konfigurasi hosting aplikasi ke platform Firebase
```

---

## 🧠 Konsep Utama Sistem Kecerdasan Buatan (AI) di Web

Terdapat tiga fondasi penting mengapa arsitektur di atas dibangun sedemikian rupa agar mendatangkan skor tinggi dalam lomba KMIPN:

### 1. Ekstraksi *NCHW RGB Planar* Secara Manual (`utils/imageProcessing.ts`)
Model YOLOv8 dalam format ONNX tidak dapat menerima input piksel gambar biasa dari tag HTML `<video>`. Ia mengharapkan sebuah matriks tensor 4 Dimensi dengan ukuran ketat: `[Batch(1), Channel(3), Tinggi(640), Lebar(640)]`.
Oleh karena itu, modul ini menarik data murni RGBA 0-255 dari elemen kanvas, menormalkannya ke nilai 0.0 - 1.0, lalu mengelompokkan secara terpisah (Planar) menjadi Red Channel, Green Channel, lalu Blue Channel dalam sebuah struktur memori `Float32Array`.

### 2. Logika *Un-Mirroring* Cermin Lensa Kamera
Dalam standar WebRTC (`useCamera.ts`), stream kamera depan dari perangkat (laptop/HP) diubah seolah-olah berfungsi sebagai cermin menggunakan CSS (`scale-x-[-1]`). Namun, ini hanyalah ilusi visual. Jika kita menyerahkan frame terbalik tersebut pada AI, AI akan menganggap orientasi gestur tangan terbalik (berdampak buruk pada akurasi arah jari huruf Arab).

Penyelesaiannya:
Di `imageProcessing.ts`, sebelum gambar masuk ke ONNX, gambar dipantulkan ulang (dikembalikan secara asli) menggunakan *Canvas Translate & Scale Math*. 
Oleh sebab itu, hasil tebakan lokasi kotak (Bounding Box) dari `yoloInference.ts` harus dipantulkan balik kembali saat digambar oleh file `CameraDetector.tsx` agar kotak tepat melingkari tangan di cermin bayangan UI.

### 3. *Dynamic Tensor Output Parsing* (`utils/yoloInference.ts`)
Output ekspor dari YOLO Ultralytics biasanya tidak beraturan. Ada yang keluar berukuran `[1, 33, 8400]` (Transposed Matrix), ada yang berukuran `[1, 8400, 33]` (Flat Matrix).
Di mana `8400` adalah tebakan grid deteksi objek per frame, dan `33` adalah (X, Y, Lebar, Tinggi, dan 29 Probabilitas Kelas Huruf).
Fungsi `parseDynamicTensor` membaca struktur dimensi matriks ini di awal dan menggunakan aritmatika indeks memori murni untuk mengambil *1 Kotak Tangan Terbaik* dengan nilai di atas batas `25% (0.25 Threshold)`.

---

## 🚀 Cara Menjalankan

1. Pastikan Anda berada di dalam folder `web`:
   ```bash
   cd "D:/lomba kmipn/web"
   ```
2. Jalankan instalasi Node Modules (jika belum):
   ```bash
   npm install
   ```
3. Mulai Server Pengembangan lokal:
   ```bash
   npm run dev
   ```
4. Buka Browser (Google Chrome disarankan untuk kompatibilitas kamera) pada: [http://localhost:3000](http://localhost:3000)
