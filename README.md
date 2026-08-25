# diBISAlitas - Platform Aksesibilitas dan Inklusivitas Terintegrasi Berbasis AI

<div align="center">

**Empowering Accessibility, Bridging Communication with On-Device Artificial Intelligence**

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![ONNX Runtime Web](https://img.shields.io/badge/ONNX_Runtime-WebAssembly-005CED?style=flat)](https://onnxruntime.ai/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-FF6F00?style=flat)](https://ultralytics.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFA611?style=flat&logo=firebase)](https://firebase.google.com/)
[![PWA](https://img.shields.io/badge/PWA-Serwist%20Ready-5A0FC8?style=flat)](https://serwist.pages.dev/)

</div>

---

## 1. Ringkasan Ekosistem

diBISAlitas adalah platform web progresif (Progressive Web App / PWA) terintegrasi yang dirancang untuk mendukung kemandirian, keselamatan, mobilitas, dan komunikasi bagi penyandang disabilitas (tunanetra, tunarungu, tunadaksa) serta masyarakat luas. 

Platform ini mengimplementasikan inferensi kecerdasan buatan langsung pada peramban web pengguna (*Client-Side / On-Device AI Inference*) menggunakan WebAssembly (WASM), WebGL, dan ONNX Runtime. Seluruh komputasi visi komputer dijalankan secara lokal di peramban, menjamin privasi visual pengguna secara penuh tanpa latensi pengiriman gambar ke server.

---

## 2. Struktur Repositori

```
diBISAlitas/
├── training/                       # Pipeline Pelatihan dan Konversi Model Machine Learning
│   ├── bisindo/                    # Dataset, skrip pelatihan, & konversi model BISINDO ke ONNX
│   ├── hijaiyah/                   # Pelatihan model deteksi abjad isyarat Hijaiyah
│   └── indoor_obstacle/            # Pelatihan model deteksi rintangan navigasi pedestrian
│
├── web/                            # Aplikasi Web Utama (Next.js App Router & Progressive Web App)
│   ├── public/                     # Aset statis, ikon, model ONNX, dan konfigurasi PWA
│   ├── src/
│   │   ├── app/                    # Routing halaman (Landing, Fitur, Demo, Admin, Web App)
│   │   ├── components/             # Komponen antarmuka (Navbar, A11y Engine, Device Mockup)
│   │   ├── hooks/                  # Custom hooks (Kamera, Web Speech, YOLO Vision Pipeline)
│   │   └── lib/                    # Firebase client, A11y context, dan Mock demo engine
│   ├── package.json
│   └── next.config.ts
│
└── README.md                       # Dokumentasi resmi proyek
```

---

## 3. Fitur Utama

### A. BiPINTAR - Pembelajaran dan Penerjemah Bahasa Isyarat Interaktif
- **Deteksi Isyarat Real-Time**: Mengenali alfabet BISINDO (Bahasa Isyarat Indonesia) dan Isyarat Huruf Hijaiyah langsung dari kamera peramban menggunakan model YOLOv8n terkompresi via ONNX Runtime Web.
- **Kamus Isyarat**: Visualisasi referensi gerakan gestur interaktif dengan panduan fonetik.
- **Kuis Isyarat AI**: Evaluasi interaktif berbasis kecerdasan buatan yang menguji akurasi pembentukan gestur pengguna secara dinamis.
- **Gamifikasi Pembelajaran**: Sistem leaderboard, poin XP, dan visualisasi statistik progres belajar.

### B. BiJALAN - Navigasi Spasial dan Pemetaan Rintangan
- **Deteksi Rintangan Berbasis Visi**: Identifikasi halangan trotoar dan ruangan (tiang, tangga, pintu, kursi) secara real-time.
- **Panduan Suara Terarah**: Integrasi Text-to-Speech (TTS) yang mengumumkan jarak serta posisi rintangan secara berkala.
- **Pelaporan Rintangan Fasilitas Umum**: Warga dapat memotret dan menandai titik rintangan trotoar untuk disinkronkan ke Command Center.

### C. BiSAFE - Protokol Darurat Terintegrasi
- **Pemicu Darurat Satu Sentuhan**: Pengiriman sinyal SOS darurat secara instan.
- **Transmisi Koordinat Presisi**: Memancarkan titik koordinat GPS ke pusat kendali dan kontak darurat terdaftar.

### D. BiBACA - Pembaca Teks dan OCR Aksesibel
- **Ekstraksi Teks Visual**: Membaca dokumen, papan rambu, atau buku fisik melalui kamera menggunakan engine OCR.
- **Audio Synthesizer**: Mengonversi teks yang dipindai menjadi ucapan suara yang ramah bagi tunanetra.

### E. BiSAPA - Jembatan Komunikasi Dua Arah
- **Speech-to-Text (STT)**: Mengonversi ucapan suara lawan bicara menjadi teks waktu-nyata untuk teman tuli.
- **Text-to-Speech (TTS)**: Mengonversi teks yang diketik menjadi output audio bersuara natural.

### F. BiPANTAU - Command Center Pemantauan Fasilitas Publik
- **Peta Hotspot GIS**: Pemetaan sebaran laporan rintangan fasilitas kota berbasis Leaflet GIS.
- **Moderasi Laporan**: Verifikasi dan pembaruan status penyelesaian masalah fasilitas publik secara real-time.
- **Mode Demo Juri**: Panel simulasi interaktif tanpa autentikasi login untuk pengujian dan evaluasi fungsionalitas secara langsung.

### G. Engine Aksesibilitas Universal (Floating A11y Suite)
- **Skala Ukuran Teks**: Penyesuaian fleksibel (100%, 115%, 130%).
- **Kontras Tinggi & Monokrom**: Optimalisasi ketajaman visual untuk pengguna dengan sensitivitas penglihatan.
- **Mode Ramah Disleksia**: Penataan ruang antar huruf, kata, dan baris yang memudahkan pembacaan teks.
- **Pembaca Suara Layar Ringkas**: Pembacaan ringkasan konten situs menggunakan Web Speech Synthesis.
- **Navigasi Keyboard**: Indikator fokus visual yang memenuhi standar WCAG (Web Content Accessibility Guidelines).

---

## 4. Arsitektur Teknologi

```
                                  [ Pengguna Web / Mobile Browser ]
                                                  │
                                                  ▼
                               [ Next.js 16 + TypeScript Frontend ]
                                                  │
                        ┌─────────────────────────┴─────────────────────────┐
                        ▼                                                   ▼
         [ On-Device AI Inference ]                              [ Cloud Data Services ]
         ├── ONNX Runtime WebAssembly                            ├── Firebase Authentication
         ├── YOLOv8n BISINDO Model                               ├── Firestore Realtime Database
         ├── YOLOv8n Hijaiyah Model                              └── Firebase Cloud Storage
         └── Canvas / WebGL Processing
```

---

## 5. Panduan Instalasi dan Menjalankan Proyek

### Prasyarat
- Node.js versi 18.x atau yang lebih baru
- npm, yarn, atau pnpm

### Langkah Menjalankan Web Application

1. Masuk ke direktori web:
   ```bash
   cd web
   ```

2. Instal seluruh dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

4. Buka peramban di alamat:
   ```
   http://localhost:3000
   ```

### Langkah Menjalankan Production Build

```bash
# Kompilasi bundel produksi teroptimasi
npm run build

# Menjalankan server produksi
npm run start
```

---

## 6. Privasi dan Keamanan Data

- **Pemrosesan Gambar Lokal**: Seluruh *frame* video kamera yang digunakan untuk deteksi isyarat BiPINTAR dan deteksi rintangan BiJALAN diproses langsung di peramban pengguna. Tidak ada data citra kamera yang ditransmisikan ke server eksternal demi menjaga privasi pengguna secara mutlak.
- **Kepatuhan Standar Aksesibilitas**: Arsitektur antarmuka dibangun dengan memperhatikan rasio kontras, semantik HTML5, aksesibilitas keyboard (fokus visual), dan dukungan *screen reader*.

---

<div align="center">

**diBISAlitas - Mewujudkan Kesetaraan Akses dan Kemandirian Inklusif Berbasis Kecerdasan Buatan**

</div>
