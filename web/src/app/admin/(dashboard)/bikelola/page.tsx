"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { GraduationCap, PlusCircle, Trash2, Video, BookOpen, Link as LinkIcon, Activity, Edit2, XCircle, Image as ImageIcon, Upload } from "lucide-react";

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: any;
}

export default function BiKelolaDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Keterampilan Digital");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "bipintar_courses"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];
      setCourses(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching courses:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !description) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "bipintar_courses", editingId), {
          title,
          category,
          description,
          videoUrl,
          thumbnailUrl,
        });
        alert("Kelas berhasil diperbarui!");
      } else {
        await addDoc(collection(db, "bipintar_courses"), {
          title,
          category,
          description,
          videoUrl,
          thumbnailUrl,
          createdAt: serverTimestamp(),
        });
        alert("Kelas berhasil dipublikasikan!");
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Gagal menyimpan kelas. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("Keterampilan Digital");
    setDescription("");
    setVideoUrl("");
    setThumbnailUrl("");
    setEditingId(null);
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setTitle(course.title);
    setCategory(course.category);
    setDescription(course.description);
    setVideoUrl(course.videoUrl || "");
    setThumbnailUrl(course.thumbnailUrl || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateYoutubeThumbnail = () => {
    let videoId = "";
    try {
      if (videoUrl.includes("youtube.com/watch")) {
        const urlParams = new URL(videoUrl).searchParams;
        videoId = urlParams.get("v") || "";
      } else if (videoUrl.includes("youtu.be/")) {
        videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0] || "";
      }
      
      if (videoId) {
        setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
      } else {
        alert("URL video YouTube tidak valid. Pastikan formatnya benar.");
      }
    } catch (error) {
      alert("URL tidak valid.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const fileExt = file.name.split(".").pop();
    const fileName = `thumbnails/course_${Date.now()}.${fileExt}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        alert("Gagal mengupload gambar.");
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setThumbnailUrl(downloadURL);
        setIsUploading(false);
      }
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
      try {
        await deleteDoc(doc(db, "bipintar_courses", id));
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Gagal menghapus kelas.");
      }
    }
  };

  const getCategoryBadge = (cat: string) => {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#00B894]/10 text-[#00B894]">
        {cat}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manajemen Kelas</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">BiKELOLA E-Learning Admin</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Tambah/Edit Kelas */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden sticky top-8">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
              <h2 className="font-semibold text-lg text-slate-800 tracking-tight flex items-center gap-2">
                {editingId ? (
                  <><Edit2 className="w-5 h-5 text-amber-500" /> Edit Kelas</>
                ) : (
                  <><PlusCircle className="w-5 h-5 text-[#00B894]" /> Tambah Kelas Baru</>
                )}
              </h2>
              {editingId && (
               <button 
                  onClick={resetForm}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Batal
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Kelas</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B894]/20 focus:border-[#00B894] transition-all bg-slate-50 focus:bg-white text-sm"
                  placeholder="Contoh: Dasar Komputer..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B894]/20 focus:border-[#00B894] transition-all bg-slate-50 focus:bg-white text-sm appearance-none"
                  >
                    <option value="Keterampilan Digital">Keterampilan Digital</option>
                    <option value="Bahasa Isyarat">Bahasa Isyarat</option>
                    <option value="Kemandirian">Kemandirian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi Singkat</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B894]/20 focus:border-[#00B894] transition-all bg-slate-50 focus:bg-white text-sm resize-none"
                  placeholder="Tuliskan materi yang akan dipelajari..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tautan Materi (YouTube, Drive, dll) (Opsional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B894]/20 focus:border-[#00B894] transition-all bg-slate-50 focus:bg-white text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Gambar / Thumbnail (Opsional)</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <ImageIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B894]/20 focus:border-[#00B894] transition-all bg-slate-50 focus:bg-white text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={generateYoutubeThumbnail}
                      disabled={!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                      title="Gunakan thumbnail dari URL Video YouTube di atas"
                    >
                      Dari YouTube
                    </button>
                    <label className={`cursor-pointer px-4 py-3 bg-[#00B894]/10 hover:bg-[#00B894]/20 text-[#00B894] rounded-2xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Upload className="w-4 h-4" />
                      Upload
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
                {isUploading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>Mengupload gambar...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#00B894] h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}
                {thumbnailUrl && !isUploading && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 font-medium mb-2">Preview Thumbnail:</p>
                    <div className="w-32 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                  (isSubmitting || isUploading)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : editingId
                      ? 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md'
                      : 'bg-[#00B894] text-white hover:bg-[#00a383] hover:shadow-md'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    {editingId ? <Edit2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                    {editingId ? 'Simpan Perubahan' : 'Publikasikan Kelas'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Daftar Kelas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-semibold text-lg text-slate-800 tracking-tight">Daftar Modul Kelas</h2>
              <span className="text-xs font-semibold bg-slate-50 text-slate-500 px-3 py-1 rounded-full border border-slate-100">
                {courses.length} Kelas
              </span>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Activity className="w-8 h-8 text-[#00B894] animate-spin mb-4" />
                <p className="text-slate-400 text-sm font-medium">Memuat data kelas...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 border border-slate-100">
                  <BookOpen className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-600 font-semibold text-lg">Belum Ada Kelas</p>
                <p className="text-slate-400 text-sm mt-1.5 font-medium">Mulai tambahkan kelas melalui form di sebelah kiri.</p>
              </div>
            ) : (
              <div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/30">
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Judul & Kategori</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5 align-top">
                          <div className="font-semibold text-slate-800 tracking-tight text-base">{course.title}</div>
                          <div className="mt-2">{getCategoryBadge(course.category)}</div>
                          <div className="text-xs text-slate-400 mt-2 font-medium">
                            {course.createdAt?.toDate ? course.createdAt.toDate().toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            }) : 'Baru saja'}
                          </div>
                        </td>
                        <td className="px-8 py-5 align-top max-w-xs">
                          <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 mb-2">
                            {course.description}
                          </p>
                          {course.videoUrl && (
                            <a href={course.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B894] hover:text-[#009b7c] transition-colors">
                              <Video className="w-3.5 h-3.5" />
                              Buka Materi
                            </a>
                          )}
                        </td>
                        <td className="px-8 py-5 align-top text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(course)}
                              className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all duration-200"
                              title="Edit Kelas"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(course.id)}
                              className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                              title="Hapus Kelas"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
