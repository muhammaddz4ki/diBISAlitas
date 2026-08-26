"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { GraduationCap, PlusCircle, Trash2, Video, BookOpen, Link as LinkIcon, Activity, Edit2, XCircle, Image as ImageIcon, Upload, Plus, X, Search, Filter } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

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
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Keterampilan Digital");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

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
    setShowForm(true);
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
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-[#00B894] neo-pressed">
        {cat}
      </span>
    );
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 10 } }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="flex gap-4 sm:gap-5">
          <div className="p-3.5 sm:p-4 neo-icon-btn rounded-2xl text-[#00B894] h-fit shrink-0">
            <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <div className="pt-1 sm:pt-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen Kelas
            </h1>
            <p className="text-slate-500 mt-1.5 font-medium text-sm sm:text-base leading-relaxed">
              Kelola modul dan materi kelas untuk platform e-learning BiKELOLA.
            </p>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center justify-center sm:justify-start gap-2 neo-flat-primary animate-pulse-glow px-5 py-3 font-bold w-full sm:w-auto border-none"
        >
          <Plus className="w-5 h-5" />
          Tambah Kelas
        </button>
      </header>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-[#E8F4F1] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto overscroll-contain hide-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                {editingId ? "Edit Kelas" : "Tambah Kelas Baru"}
              </h2>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="p-2 rounded-full neo-icon-btn text-slate-500 transition-all shrink-0 border-none">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Judul Kelas</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full neo-pressed-input text-slate-900 font-bold px-4 w-full border-none"
                  placeholder="Contoh: Dasar Komputer..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Kategori</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full neo-pressed-input text-slate-900 font-bold appearance-none px-4 py-3 border-none"
                  >
                    <option value="Keterampilan Digital">Keterampilan Digital</option>
                    <option value="Bahasa Isyarat">Bahasa Isyarat</option>
                    <option value="Kemandirian">Kemandirian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Deskripsi / Ringkasan</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full neo-pressed-input text-slate-900 font-bold px-4 py-3 resize-none border-none"
                  placeholder="Tulis deskripsi kelas..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">URL Video Pembelajaran (Opsional)</label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full neo-pressed-input text-slate-900 font-bold px-4 py-3 flex-1 border-none"
                    placeholder="https://youtube.com/..."
                  />
                  <button 
                    type="button" 
                    onClick={generateYoutubeThumbnail}
                    className="neo-flat px-4 py-3 font-bold text-[#00B894] rounded-xl whitespace-nowrap hover:-translate-y-[2px] transition-all border-none"
                  >
                    Generate Thumbnail
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Thumbnail (URL atau Upload)</label>
                <div className="flex gap-3 mb-3">
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full neo-pressed-input text-slate-900 font-bold px-4 py-3 flex-1 border-none"
                    placeholder="https://..."
                  />
                  <label className="neo-flat px-4 py-3 font-bold text-[#00B894] rounded-xl cursor-pointer flex items-center gap-2 hover:-translate-y-[2px] transition-all border-none">
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
                {isUploading && (
                  <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4 dark:bg-slate-700">
                    <div className="bg-[#00B894] h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
                {thumbnailUrl && (
                  <div className="w-full max-w-[200px] aspect-video rounded-xl overflow-hidden neo-pressed p-1.5 border-none mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover rounded-lg" />
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-white/40">
                <button
                  type="button"
                  onClick={() => { resetForm(); setShowForm(false); }}
                  className="px-6 py-3.5 neo-flat font-bold text-slate-600 rounded-xl hover:-translate-y-[2px] transition-all w-full sm:w-auto border-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-3.5 neo-flat-primary font-bold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-[2px] transition-all w-full sm:w-auto border-none"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                      />
                    ) : (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2"
                      >
                        Simpan Kelas
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Cari kelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-5 py-4 rounded-2xl neo-pressed border-none text-slate-700 font-extrabold focus:outline-none placeholder:text-slate-400 transition-all"
          />
        </div>
        <div className="relative w-full md:w-auto shrink-0">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full md:w-auto appearance-none pl-5 pr-12 py-4 rounded-2xl neo-pressed border-none text-sm font-extrabold text-slate-700 focus:outline-none bg-transparent cursor-pointer min-w-[200px]"
          >
            <option value="">Semua Kategori</option>
            <option value="Keterampilan Digital">Keterampilan Digital</option>
            <option value="Bahasa Isyarat">Bahasa Isyarat</option>
            <option value="Kemandirian">Kemandirian</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-5">
          {[1, 2, 3].map((i) => <div key={i} className="neo-flat h-[180px] w-full rounded-2xl overflow-hidden shimmer" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="neo-pressed p-16 text-center border-none">
          <div className="w-20 h-20 neo-icon-btn rounded-full flex items-center justify-center mx-auto mb-5 border-none animate-shake">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-extrabold text-slate-700 text-xl mb-2">Belum Ada Kelas</h3>
          <p className="text-slate-500 font-bold text-sm">Klik tombol "Tambah Kelas" untuk memulai.</p>
        </div>
      ) : courses.filter((c) => {
          const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesFilter = filterCategory ? c.category === filterCategory : true;
          return matchesSearch && matchesFilter;
        }).length === 0 ? (
        <div className="neo-pressed p-16 text-center border-none">
          <div className="w-16 h-16 neo-flat rounded-2xl flex items-center justify-center mx-auto mb-5 border-none animate-shake">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-extrabold text-slate-700 text-xl mb-2">Pencarian Tidak Ditemukan</h3>
          <p className="text-slate-500 text-sm font-bold">Tidak ada kelas yang sesuai dengan kata kunci atau filter.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          {courses.filter((c) => {
            const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterCategory ? c.category === filterCategory : true;
            return matchesSearch && matchesFilter;
          }).map((course) => (
            <motion.div
              variants={itemVariants}
              key={course.id}
              className="neo-flat p-5 sm:p-7 flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-7 relative group transition-all duration-300 hover:-translate-y-1 border-none"
            >
              {/* Actions */}
              <div className="absolute top-5 right-5 sm:static flex items-center gap-3 shrink-0 sm:order-last">
                <button 
                  onClick={() => handleEdit(course)}
                  className="p-3 rounded-2xl text-amber-500 neo-icon-btn border-none"
                  title="Edit Kelas"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(course.id)}
                  className="p-3 rounded-2xl text-rose-500 neo-icon-btn border-none"
                  title="Hapus Kelas"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl shrink-0 neo-pressed flex items-center justify-center overflow-hidden p-1.5 border-none">
                {course.thumbnailUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover rounded-xl shadow-sm" />
                  </>
                ) : (
                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 drop-shadow-sm" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-28 sm:pr-0 mt-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {getCategoryBadge(course.category)}
                  <span className="text-xs text-slate-400 font-bold tracking-wide uppercase">
                    {course.createdAt?.toDate ? course.createdAt.toDate().toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    }) : 'Baru saja'}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 text-xl sm:text-2xl mb-2">{course.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-3 sm:line-clamp-2 leading-relaxed mb-4 font-medium">{course.description}</p>
                
                {course.videoUrl && (
                  <a href={course.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#00B894] px-4 py-2 rounded-xl shadow-[4px_4px_10px_rgba(0,184,148,0.3)] hover:-translate-y-[2px] transition-all w-fit">
                    <Video className="w-4 h-4" />
                    Tonton Materi
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
