"""
diBISAlitas Blender Headless Retargeting Script
───────────────────────────────────────────────
Skrip Python ini dijalankan langsung di dalam Blender (Headless/CLI)
untuk memetakan file motion_data.json ke Armature/Skeleton karakter Rian 3D:

Cara Menjalankan:
  blender character_rian.blend --background --python blender_retarget.py -- motion_data.json output_anim.glb

Argumen setelah '--':
  [1] Path ke motion_data.json
  [2] Path output (.glb untuk 3D Web, atau .mp4 untuk video hasil render)
"""

import sys
import os
import json
import math

try:
    import bpy  # type: ignore
    import mathutils  # type: ignore
except ImportError:
    print("[ERROR] Skrip ini harus dijalankan di dalam Blender: blender --background --python blender_retarget.py -- ...")
    sys.exit(1)


# Standard Bone Mapping Dictionary (Mixamo / Rigify / Humanoid)
BONE_MAP_MIXAMO = {
    # Tangan Kanan
    "right_wrist": "mixamorig:RightHand",
    "right_thumb_1": "mixamorig:RightHandThumb1",
    "right_thumb_2": "mixamorig:RightHandThumb2",
    "right_thumb_3": "mixamorig:RightHandThumb3",
    "right_index_1": "mixamorig:RightHandIndex1",
    "right_index_2": "mixamorig:RightHandIndex2",
    "right_index_3": "mixamorig:RightHandIndex3",
    "right_middle_1": "mixamorig:RightHandMiddle1",
    "right_middle_2": "mixamorig:RightHandMiddle2",
    "right_middle_3": "mixamorig:RightHandMiddle3",
    "right_ring_1": "mixamorig:RightHandRing1",
    "right_ring_2": "mixamorig:RightHandRing2",
    "right_ring_3": "mixamorig:RightHandRing3",
    "right_pinky_1": "mixamorig:RightHandPinky1",
    "right_pinky_2": "mixamorig:RightHandPinky2",
    "right_pinky_3": "mixamorig:RightHandPinky3",
    "right_forearm": "mixamorig:RightForeArm",
    "right_arm": "mixamorig:RightArm",
    # Tubuh Atas & Kepala
    "head": "mixamorig:Head",
    "neck": "mixamorig:Neck",
    "spine": "mixamorig:Spine1",
}

# Alias alternatif jika menggunakan Rigify / MANO naming convention
BONE_MAP_RIGIFY = {
    "right_wrist": "hand.R",
    "right_thumb_1": "thumb.01.R",
    "right_thumb_2": "thumb.02.R",
    "right_thumb_3": "thumb.03.R",
    "right_index_1": "f_index.01.R",
    "right_index_2": "f_index.02.R",
    "right_index_3": "f_index.03.R",
    "right_middle_1": "f_middle.01.R",
    "right_middle_2": "f_middle.02.R",
    "right_middle_3": "f_middle.03.R",
    "right_ring_1": "f_ring.01.R",
    "right_ring_2": "f_ring.02.R",
    "right_ring_3": "f_ring.03.R",
    "right_pinky_1": "f_pinky.01.R",
    "right_pinky_2": "f_pinky.02.R",
    "right_pinky_3": "f_pinky.03.R",
    "right_forearm": "forearm.R",
    "right_arm": "upper_arm.R",
    "head": "head",
}


def find_armature():
    """Mencari objek Armature pada scene Blender"""
    for obj in bpy.context.scene.objects:
        if obj.type == "ARMATURE":
            return obj
    return None


def resolve_bone_name(armature, standard_name):
    """Mencari nama tulang yang cocok di armature berdasarkan Mixamo atau Rigify"""
    mixamo_name = BONE_MAP_MIXAMO.get(standard_name)
    if mixamo_name and mixamo_name in armature.pose.bones:
        return mixamo_name

    rigify_name = BONE_MAP_RIGIFY.get(standard_name)
    if rigify_name and rigify_name in armature.pose.bones:
        return rigify_name

    # Coba pencarian fleksibel (case-insensitive substring)
    clean_target = standard_name.replace("_", "").lower()
    for b in armature.pose.bones:
        clean_b = b.name.replace(":", "").replace("_", "").replace(".", "").lower()
        if clean_target in clean_b:
            return b.name

    return None


def apply_motion_to_rig(json_path, output_path):
    print(f"\n[INFO] Membaca file motion: {json_path}")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    armature = find_armature()
    if not armature:
        print("[ERROR] Tidak ditemukan objek Armature pada file .blend ini!")
        sys.exit(1)

    print(f"[OK] Ditemukan Armature: {armature.name} (Total tulang: {len(armature.pose.bones)})")

    # Set ke Pose Mode
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode="POSE")

    # Siapkan Action Animasi baru
    action_name = "diBISAlitas_Sign_Action"
    if not armature.animation_data:
        armature.animation_data_create()

    action = bpy.data.actions.new(name=action_name)
    armature.animation_data.action = action

    frames = data.get("frames", [])
    total_frames = len(frames)
    fps = data.get("fps", 30.0)

    bpy.context.scene.render.fps = int(round(fps))
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = total_frames

    print(f"[INFO] Meretarget {total_frames} frame animasi ke tulang...")

    for frame_info in frames:
        f_idx = frame_info["frame_idx"] + 1
        bpy.context.scene.frame_set(f_idx)

        # 1. Retarget Tangan Kanan
        rh = frame_info.get("right_hand")
        if rh:
            # Jari Telunjuk
            for i, seg in enumerate(["right_index_1", "right_index_2", "right_index_3"]):
                b_name = resolve_bone_name(armature, seg)
                if b_name:
                    pbone = armature.pose.bones[b_name]
                    pbone.rotation_mode = "XYZ"
                    ang_deg = rh["index"][i]
                    pbone.rotation_euler.x = math.radians(ang_deg * 0.8)
                    pbone.keyframe_insert(data_path="rotation_euler", frame=f_idx)

            # Jari Tengah
            for i, seg in enumerate(["right_middle_1", "right_middle_2", "right_middle_3"]):
                b_name = resolve_bone_name(armature, seg)
                if b_name:
                    pbone = armature.pose.bones[b_name]
                    pbone.rotation_mode = "XYZ"
                    ang_deg = rh["middle"][i]
                    pbone.rotation_euler.x = math.radians(ang_deg * 0.8)
                    pbone.keyframe_insert(data_path="rotation_euler", frame=f_idx)

            # Jari Manis
            for i, seg in enumerate(["right_ring_1", "right_ring_2", "right_ring_3"]):
                b_name = resolve_bone_name(armature, seg)
                if b_name:
                    pbone = armature.pose.bones[b_name]
                    pbone.rotation_mode = "XYZ"
                    ang_deg = rh["ring"][i]
                    pbone.rotation_euler.x = math.radians(ang_deg * 0.8)
                    pbone.keyframe_insert(data_path="rotation_euler", frame=f_idx)

            # Jari Kelingking
            for i, seg in enumerate(["right_pinky_1", "right_pinky_2", "right_pinky_3"]):
                b_name = resolve_bone_name(armature, seg)
                if b_name:
                    pbone = armature.pose.bones[b_name]
                    pbone.rotation_mode = "XYZ"
                    ang_deg = rh["pinky"][i]
                    pbone.rotation_euler.x = math.radians(ang_deg * 0.8)
                    pbone.keyframe_insert(data_path="rotation_euler", frame=f_idx)

        # 2. Retarget Lengan / Siku Kanan
        kinematics = frame_info.get("body_kinematics", {})
        r_elbow_deg = kinematics.get("right_elbow_flexion_deg")
        if r_elbow_deg is not None:
            forearm_bone = resolve_bone_name(armature, "right_forearm")
            if forearm_bone:
                pb = armature.pose.bones[forearm_bone]
                pb.rotation_mode = "XYZ"
                pb.rotation_euler.z = math.radians(r_elbow_deg * 0.7)
                pb.keyframe_insert(data_path="rotation_euler", frame=f_idx)

        # 3. Retarget Kemiringan Kepala
        head_data = frame_info.get("head")
        if head_data:
            head_bone = resolve_bone_name(armature, "head")
            if head_bone:
                pb = armature.pose.bones[head_bone]
                pb.rotation_mode = "XYZ"
                pb.rotation_euler.x = math.radians(head_data["pitch_approx"] * 0.15)
                pb.rotation_euler.y = math.radians(head_data["roll_approx"] * 0.15)
                pb.rotation_euler.z = math.radians(head_data["yaw_approx"] * 0.15)
                pb.keyframe_insert(data_path="rotation_euler", frame=f_idx)

    # Kembali ke Object Mode
    bpy.ops.object.mode_set(mode="OBJECT")
    print(f"[OK] {total_frames} frame animasi berhasil dipetakan ke armature!")

    # Ekspor hasil
    ext = os.path.splitext(output_path)[1].lower()
    if ext in [".glb", ".gltf"]:
        print(f"[INFO] Mengekspor ke 3D Web format: {output_path}...")
        bpy.ops.export_scene.gltf(
            filepath=output_path,
            export_format="GLB",
            export_animations=True,
            export_current_frame=False,
            export_skins=True,
            export_morph=True,
        )
        print(f"[SUCCESS] File 3D GLB siap diputar di web: {output_path}")

    elif ext in [".mp4", ".mov", ".avi"]:
        print(f"[INFO] Me-render video hasil animasi ke: {output_path}...")
        bpy.context.scene.render.image_settings.file_format = "FFMPEG"
        bpy.context.scene.render.ffmpeg.format = "MPEG4"
        bpy.context.scene.render.ffmpeg.codec = "H264"
        bpy.context.scene.render.filepath = output_path
        bpy.ops.render.render(animation=True)
        print(f"[SUCCESS] Video render animasi berhasil disimpan: {output_path}")


if __name__ == "__main__":
    # Ambil argumen setelah '--'
    args = []
    if "--" in sys.argv:
        args = sys.argv[sys.argv.index("--") + 1 :]

    if len(args) < 2:
        print("[USAGE] blender character.blend --background --python blender_retarget.py -- motion_data.json output.glb")
        sys.exit(1)

    json_file = args[0]
    out_file = args[1]
    apply_motion_to_rig(json_file, out_file)
