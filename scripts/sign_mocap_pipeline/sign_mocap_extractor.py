#!/usr/bin/env python3
"""
diBISAlitas AI 3D Sign Language Motion Capture & Kinematics Extractor
────────────────────────────────────────────────────────────────────
Mengekstrak gerakan bahasa isyarat 3D dari video kamera biasa (monocular)
menggunakan Google MediaPipe Holistic (543 titik landmark):
- 33 Titik Pose Tubuh
- 21 Titik Sendi Tangan Kanan (World Coordinates 3D)
- 21 Titik Sendi Tangan Kiri (World Coordinates 3D)
- 468 Titik Face Mesh (Ekspresi & Orientasi Kepala)

Output:
- motion_data.json: Berisi rotasi lokal sendi tulang yang siap diretarge ke Blender / Three.js
- (Opsional) preview_mocap.mp4: Video side-by-side kerangka skeleton neon

Penggunaan:
  python sign_mocap_extractor.py --input video_peraga.mp4 --output motion_data.json --preview
"""

import os
import sys
import json
import argparse
import math
import numpy as np
import cv2

try:
    import mediapipe as mp
    from tqdm import tqdm
except ImportError:
    print("[ERROR] Dependensi belum terinstal. Jalankan: pip install -r requirements.txt")
    sys.exit(1)


def calculate_angle_3d(a, b, c):
    """
    Menghitung sudut 3D antara tiga titik: vektor BA dan BC.
    Titik b adalah vertex / sendi (misal: siku, atau knuckle jari).
    """
    ba = np.array(a) - np.array(b)
    bc = np.array(c) - np.array(b)

    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)

    if norm_ba == 0 or norm_bc == 0:
        return 0.0

    cosine = np.dot(ba, bc) / (norm_ba * norm_bc)
    cosine = np.clip(cosine, -1.0, 1.0)
    angle_rad = np.arccos(cosine)
    return float(np.degrees(angle_rad))


def extract_hand_finger_rotations(hand_landmarks_3d):
    """
    Menghitung rotasi fleksi setiap ruas jari (CMC, MCP, PIP, DIP)
    dari 21 koordinat 3D tangan standar MediaPipe.
    0: Wrist
    1-4: Thumb (CMC, MCP, IP, Tip)
    5-8: Index (MCP, PIP, DIP, Tip)
    9-12: Middle (MCP, PIP, DIP, Tip)
    13-16: Ring (MCP, PIP, DIP, Tip)
    17-20: Pinky (MCP, PIP, DIP, Tip)
    """
    pts = [np.array([lm.x, lm.y, lm.z]) for lm in hand_landmarks_3d]

    wrist = pts[0]

    # Helper untuk menghitung fleksi rantai 4 titik
    def get_finger_flexions(j0, j1, j2, j3):
        # Sudut ruas 1 (MCP)
        ang_mcp = 180.0 - calculate_angle_3d(wrist, pts[j0], pts[j1])
        # Sudut ruas 2 (PIP)
        ang_pip = 180.0 - calculate_angle_3d(pts[j0], pts[j1], pts[j2])
        # Sudut ruas 3 (DIP)
        ang_dip = 180.0 - calculate_angle_3d(pts[j1], pts[j2], pts[j3])
        return [round(ang_mcp, 2), round(ang_pip, 2), round(ang_dip, 2)]

    return {
        "wrist_position": [round(float(wrist[0]), 4), round(float(wrist[1]), 4), round(float(wrist[2]), 4)],
        "thumb": get_finger_flexions(1, 2, 3, 4),
        "index": get_finger_flexions(5, 6, 7, 8),
        "middle": get_finger_flexions(9, 10, 11, 12),
        "ring": get_finger_flexions(13, 14, 15, 16),
        "pinky": get_finger_flexions(17, 18, 19, 20),
    }


def process_video_mocap(input_path, output_json, generate_preview=False, preview_path="preview_mocap.mp4"):
    """
    Menganalisis video peraga frame-demi-frame dan menghasilkan file motion_data.json
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Video input tidak ditemukan: {input_path}")

    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise RuntimeError(f"Gagal membuka file video: {input_path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 1
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    print(f"[INFO] Memproses video: {input_path}")
    print(f"       Resolusi: {width}x{height} | FPS: {fps:.2f} | Total Frame: {total_frames}")

    # Setup MediaPipe Holistic
    mp_holistic = mp.solutions.holistic
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles

    holistic = mp_holistic.Holistic(
        static_image_mode=False,
        model_complexity=2,
        enable_segmentation=False,
        refine_face_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    out_video = None
    if generate_preview:
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        out_video = cv2.VideoWriter(preview_path, fourcc, fps, (width * 2, height))

    frames_data = []

    pbar = tqdm(total=total_frames, desc="Ekstraksi Mocap Kinematika 3D")

    frame_idx = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        timestamp = frame_idx / fps
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False

        results = holistic.process(image_rgb)

        frame_info = {
            "frame_idx": frame_idx,
            "timestamp": round(timestamp, 4),
            "pose_detected": False,
            "right_hand": None,
            "left_hand": None,
            "head": None,
            "body_kinematics": {},
        }

        # 1. Pose Tubuh
        if results.pose_landmarks and results.pose_world_landmarks:
            frame_info["pose_detected"] = True
            wl = results.pose_world_landmarks.landmark

            # Hitung sudut siku kanan & kiri
            # 11: left_shoulder, 13: left_elbow, 15: left_wrist
            # 12: right_shoulder, 14: right_elbow, 16: right_wrist
            r_shoulder = [wl[12].x, wl[12].y, wl[12].z]
            r_elbow = [wl[14].x, wl[14].y, wl[14].z]
            r_wrist = [wl[16].x, wl[16].y, wl[16].z]
            r_elbow_flexion = 180.0 - calculate_angle_3d(r_shoulder, r_elbow, r_wrist)

            l_shoulder = [wl[11].x, wl[11].y, wl[11].z]
            l_elbow = [wl[13].x, wl[13].y, wl[13].z]
            l_wrist = [wl[15].x, wl[15].y, wl[15].z]
            l_elbow_flexion = 180.0 - calculate_angle_3d(l_shoulder, l_elbow, l_wrist)

            frame_info["body_kinematics"] = {
                "right_elbow_flexion_deg": round(r_elbow_flexion, 2),
                "left_elbow_flexion_deg": round(l_elbow_flexion, 2),
                "right_wrist_elevation_y": round(-wl[16].y, 4),
                "left_wrist_elevation_y": round(-wl[15].y, 4),
            }

        # 2. Tangan Kanan
        if results.right_hand_landmarks:
            frame_info["right_hand"] = extract_hand_finger_rotations(results.right_hand_landmarks.landmark)

        # 3. Tangan Kiri
        if results.left_hand_landmarks:
            frame_info["left_hand"] = extract_hand_finger_rotations(results.left_hand_landmarks.landmark)

        # 4. Kepala & Wajah
        if results.face_landmarks:
            fl = results.face_landmarks.landmark
            nose = fl[1]
            chin = fl[152]
            left_eye = fl[33]
            right_eye = fl[263]

            pitch = (nose.y - chin.y) * 100
            yaw = (right_eye.z - left_eye.z) * 100
            roll = (right_eye.y - left_eye.y) * 100

            frame_info["head"] = {
                "pitch_approx": round(pitch, 2),
                "yaw_approx": round(yaw, 2),
                "roll_approx": round(roll, 2),
            }

        frames_data.append(frame_info)

        # Optional Preview Video Generator
        if out_video is not None:
            canvas = frame.copy()
            # Gambar kerangka tangan & pose dengan style neon
            if results.right_hand_landmarks:
                mp_drawing.draw_landmarks(
                    canvas,
                    results.right_hand_landmarks,
                    mp_holistic.HAND_CONNECTIONS,
                    mp_drawing.DrawingSpec(color=(0, 212, 170), thickness=2, circle_radius=3),
                    mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=1),
                )
            if results.left_hand_landmarks:
                mp_drawing.draw_landmarks(
                    canvas,
                    results.left_hand_landmarks,
                    mp_holistic.HAND_CONNECTIONS,
                    mp_drawing.DrawingSpec(color=(0, 212, 170), thickness=2, circle_radius=3),
                    mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=1),
                )
            if results.pose_landmarks:
                mp_drawing.draw_landmarks(
                    canvas,
                    results.pose_landmarks,
                    mp_holistic.POSE_CONNECTIONS,
                    mp_drawing.DrawingSpec(color=(27, 153, 129), thickness=2, circle_radius=2),
                    mp_drawing.DrawingSpec(color=(233, 165, 14), thickness=1),
                )

            # Gabungkan Side-by-Side: Video Asli vs Skeleton Overlay
            combined = np.hstack((frame, canvas))
            cv2.putText(
                combined,
                f"diBISAlitas Mocap 3D - Frame {frame_idx}/{total_frames} ({fps:.1f} FPS)",
                (20, 35),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 255, 200),
                2,
            )
            out_video.write(combined)

        frame_idx += 1
        pbar.update(1)

    cap.release()
    if out_video is not None:
        out_video.release()
        print(f"[OK] Preview mocap video berhasil disimpan: {preview_path}")

    pbar.close()
    holistic.close()

    # Simpan hasil ke JSON
    mocap_document = {
        "source_file": os.path.basename(input_path),
        "fps": fps,
        "width": width,
        "height": height,
        "total_frames": len(frames_data),
        "target_character": "Rian (diBISAlitas 3D)",
        "frames": frames_data,
    }

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(mocap_document, f, indent=2)

    print(f"[SUCCESS] Motion data 3D berhasil diekstrak: {output_json}")
    print(f"          Total {len(frames_data)} frame siap di-retarget ke Blender / Three.js!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="diBISAlitas 3D Sign Language Mocap Extractor")
    parser.add_argument("--input", "-i", required=True, help="Path ke video peraga (MP4/MOV)")
    parser.add_argument("--output", "-o", default="motion_data.json", help="Path output file JSON")
    parser.add_argument("--preview", "-p", action="store_true", help="Generate video preview side-by-side MP4")
    parser.add_argument("--preview_output", default="preview_mocap.mp4", help="Path file preview MP4")

    args = parser.parse_args()
    process_video_mocap(args.input, args.output, args.preview, args.preview_output)
