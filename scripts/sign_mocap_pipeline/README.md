# 🖐️ diBISAlitas 3D Sign Language Mocap & Retargeting Pipeline

Modul ini adalah implementasi **Fase 2** dari arsitektur rekonstruksi bahasa isyarat 3D diBISAlitas. Modul ini menjembatani video peraga bahasa isyarat manusia nyata (*monocular*) menjadi data gerak tulang 3D yang dapat langsung menggerakkan karakter Rian di Blender dan diekspor ke format 3D Web (`.glb`).

---

## 📁 Struktur Berkas

```
scripts/sign_mocap_pipeline/
├── requirements.txt            # Dependensi Python (MediaPipe, OpenCV, NumPy)
├── sign_mocap_extractor.py     # Ekstraktor 543 landmark MediaPipe ➔ motion_data.json
├── blender_retarget.py         # Skrip headless Blender Python (bpy) ➔ .glb / .mp4
└── README.md                   # Dokumentasi panduan penggunaan
```

---

## ⚡ Langkah 1: Persiapan Lingkungan Python (Python 3.10)

> [!IMPORTANT]
> **Catatan Kompatibilitas:** Skrip ekstraksi menggunakan `mp.solutions.holistic` yang memerlukan **Python 3.9 - 3.11** (disarankan **Python 3.10**) dan `numpy < 2.0.0`. MediaPipe pada Python 3.13 tidak lagi menyediakan modul legacy `solutions`.

Buka terminal di direktori ini, buat virtual environment berbasis Python 3.10, dan install dependensi:

```powershell
# Berpindah ke direktori pipeline
cd scripts/sign_mocap_pipeline

# Membuat virtual environment menggunakan Python 3.10
py -3.10 -m venv .venv

# Mengaktifkan virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Install dependensi yang telah disesuaikan
pip install -r requirements.txt
```

> **Tips VS Code / IDE:** 
> - Jika muncul peringatan *Cannot find module mediapipe*, tekan `Ctrl + Shift + P` -> pilih **Python: Select Interpreter** -> pilih `.venv` yang baru dibuat (`scripts/sign_mocap_pipeline/.venv/Scripts/python.exe`).
> - Skrip `blender_retarget.py` menggunakan modul internal Blender (`bpy` dan `mathutils`). Untuk menghilangkan garis merah di IDE dan mengaktifkan autocomplete, paket stub `fake-bpy-module-latest` sudah disertakan di `requirements.txt`.

---

## 🎥 Langkah 2: Ekstraksi Mocap dari Video Peraga

Jalankan ekstraksi gerakan dari file video peraga (MP4/MOV):

```bash
python sign_mocap_extractor.py --input contoh_salam.mp4 --output motion_salam.json --preview
```

* `--input` / `-i`: Path ke video peraga.
* `--output` / `-o`: Path output file `motion_data.json` berisi sudut fleksi 21 jari tangan dan sendi siku/kepala.
* `--preview` / `-p`: *(Opsional)* Menghasilkan video perbandingan side-by-side (`preview_mocap.mp4`) antara video asli dan overlay kerangka skeleton neon.

---

## 🤖 Langkah 3: Retargeting ke Karakter Rian di Blender (Headless)

Setelah file `motion_salam.json` siap, Anda dapat langsung menggerakkan karakter Rian tanpa perlu membuka software Blender:

### A. Ekspor ke Model 3D Web Interaktif (`.glb`):
```bash
blender character_rian.blend --background --python blender_retarget.py -- motion_salam.json rian_salam_anim.glb
```

### B. Me-render Langsung Menjadi Video Animasi (`.mp4`):
```bash
blender character_rian.blend --background --python blender_retarget.py -- motion_salam.json rian_salam_render.mp4
```

---

## 🦴 Standar Hirarki Tulang (Bone Hierarchy) Karakter Rian

Skrip `blender_retarget.py` secara otomatis mendeteksi konvensi penamaan tulang standar berikut:

| Bagian Tubuh | Mixamo Naming | Rigify Naming |
| :--- | :--- | :--- |
| Pergelangan Tangan Kanan | `mixamorig:RightHand` | `hand.R` |
| Ibu Jari Ruas 1, 2, 3 | `mixamorig:RightHandThumb1..3` | `thumb.01.R..03.R` |
| Telunjuk Ruas 1, 2, 3 | `mixamorig:RightHandIndex1..3` | `f_index.01.R..03.R` |
| Jari Tengah Ruas 1, 2, 3 | `mixamorig:RightHandMiddle1..3`| `f_middle.01.R..03.R` |
| Jari Manis Ruas 1, 2, 3 | `mixamorig:RightHandRing1..3` | `f_ring.01.R..03.R` |
| Kelingking Ruas 1, 2, 3 | `mixamorig:RightHandPinky1..3` | `f_pinky.01.R..03.R` |
| Lengan Bawah / Siku | `mixamorig:RightForeArm` | `forearm.R` |
| Kepala | `mixamorig:Head` | `head` |
