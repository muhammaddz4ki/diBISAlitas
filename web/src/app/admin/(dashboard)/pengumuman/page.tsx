"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Megaphone, Plus, Trash2, Info, AlertTriangle, Siren, X, CheckCircle2, Search } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "info" | "penting" | "darurat";
  authorName?: string;
  createdAt: any;
}

const categoryConfig = {
  info: { label: "Info", icon: <Info className="w-4 h-4" />, bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" },
  penting: { label: "Penting", icon: <AlertTriangle className="w-4 h-4" />, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  darurat: { label: "Darurat", icon: <Siren className="w-4 h-4" />, bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
};

import { INITIAL_DEMO_ANNOUNCEMENTS, isAdminDemoMode, safeFormatDate } from "@/lib/adminDemoData";

export default function PengumumanPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_DEMO_ANNOUNCEMENTS as any);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<"semua" | "info" | "penting" | "darurat">("semua");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"info" | "penting" | "darurat">("info");
  const [authorName, setAuthorName] = useState("Admin");

  useEffect(() => {
    if (isAdminDemoMode()) {
      setAnnouncements(INITIAL_DEMO_ANNOUNCEMENTS as any);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: Announcement[] = [];
        snap.forEach((d) => data.push({ id: d.id, ...d.data() } as Announcement));
        setAnnouncements(data);
        setLoading(false);
      },
      (err) => {
        console.warn("Using demo announcements dataset:", err.message);
        setAnnouncements(INITIAL_DEMO_ANNOUNCEMENTS as any);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "announcements"), {
        title: title.trim(),
        content: content.trim(),
        category,
        authorName: authorName.trim() || "Admin",
        createdAt: serverTimestamp(),
      });
      setTitle(""); setContent(""); setCategory("info"); setAuthorName("Admin");
      setShowForm(false);
      showToast("Pengumuman berhasil dipublikasikan!");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengumuman ini?")) return;
    await deleteDoc(doc(db, "announcements", id));
    showToast("Pengumuman dihapus.");
  };

  const formatDate = (ts: any) => {
    return safeFormatDate(ts, {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const filteredAnnouncements = announcements.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q);
    const matchesCategory = filterCategory === "semua" || a.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100">
          <CheckCircle2 className="w-5 h-5 text-[#00B894]" />
          <span className="font-semibold text-slate-800 text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <div className="p-2.5 bg-[#00B894]/10 rounded-xl text-[#00B894]">
              <Megaphone className="w-6 h-6" />
            </div>
            Kelola Pengumuman
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Buat dan kelola pengumuman yang akan ditampilkan di halaman Komunitas.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center sm:justify-start gap-2 neo-flat-primary animate-pulse-glow px-5 py-3.5 rounded-2xl transition-all shadow-sm w-full sm:w-auto font-extrabold text-sm border-none"
        >
          <Plus className="w-5 h-5" />
          Buat Pengumuman
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari pengumuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-4 rounded-2xl neo-pressed border-none text-slate-700 font-extrabold focus:outline-none placeholder:text-slate-400 transition-all"
          />
        </div>
        <div className="flex w-full md:w-auto gap-5 overflow-x-auto p-5 -m-5 hide-scrollbar">
          <button
            onClick={() => setFilterCategory("semua")}
            className={`shrink-0 px-6 py-4 rounded-2xl font-extrabold text-sm transition-all border-none ${
              filterCategory === "semua" ? "neo-pressed text-slate-700" : "neo-flat text-slate-400 hover:-translate-y-[2px]"
            }`}
          >
            Semua
          </button>
          {(Object.keys(categoryConfig) as Array<"info" | "penting" | "darurat">).map((key) => {
            const cfg = categoryConfig[key];
            return (
              <button
                key={key}
                onClick={() => setFilterCategory(key)}
                className={`shrink-0 flex items-center gap-2 px-6 py-4 rounded-2xl font-extrabold text-sm transition-all border-none ${
                  filterCategory === key ? `neo-pressed ${cfg.text}` : "neo-flat text-slate-400 hover:-translate-y-[2px]"
                }`}
              >
                {cfg.icon} <span className="capitalize">{key}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-[#E8F4F1] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 w-full max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto overscroll-contain hide-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">Buat Pengumuman Baru</h2>
              <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full flex items-center justify-center neo-flat hover:-translate-y-[2px] transition-all shrink-0 border-none">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Kategori</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(categoryConfig) as Array<"info" | "penting" | "darurat">).map((key) => {
                    const cfg = categoryConfig[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCategory(key)}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all flex-1 sm:flex-none border-none ${
                          category === key
                            ? `neo-pressed ${cfg.text}`
                            : "neo-flat text-slate-400 hover:-translate-y-[2px]"
                        }`}
                      >
                        {cfg.icon} {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Judul</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Judul pengumuman..."
                  className="w-full neo-pressed border-none rounded-2xl px-5 py-4 text-slate-900 font-extrabold focus:outline-none transition-all"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Isi Pengumuman</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis isi pengumuman di sini..."
                  rows={5}
                  className="w-full neo-pressed border-none rounded-2xl px-5 py-4 text-slate-900 font-bold focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Author */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Nama Penulis</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Admin"
                  className="w-full neo-pressed border-none rounded-2xl px-5 py-4 text-slate-900 font-extrabold focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 neo-flat text-slate-600 font-extrabold rounded-2xl hover:-translate-y-[2px] transition-all border-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-4 neo-flat-primary disabled:opacity-50 text-white font-extrabold rounded-2xl transition-all flex items-center justify-center border-none"
                >
                  <AnimatePresence mode="wait">
                    {saving ? (
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
                        <Plus className="w-5 h-5" /> Publikasikan
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-5">
          {[1, 2, 3].map((i) => <div key={i} className="neo-flat h-[140px] w-full rounded-2xl overflow-hidden shimmer" />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="neo-pressed p-16 text-center border-none mt-4">
          <div className="w-16 h-16 neo-icon-btn rounded-2xl flex items-center justify-center mx-auto mb-5 border-none animate-shake">
            <Megaphone className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-extrabold text-slate-700 text-xl mb-2">Belum ada pengumuman</h3>
          <p className="text-slate-500 text-sm font-bold">Klik tombol "Buat Pengumuman" untuk memulai.</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="neo-pressed p-16 text-center border-none mt-4">
          <div className="w-16 h-16 neo-icon-btn rounded-2xl flex items-center justify-center mx-auto mb-5 border-none animate-shake">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-extrabold text-slate-700 text-xl mb-2">Pencarian Tidak Ditemukan</h3>
          <p className="text-slate-500 text-sm font-bold">Tidak ada pengumuman yang sesuai dengan kata kunci atau filter.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5"
        >
          {filteredAnnouncements.map((item) => {
            const cfg = categoryConfig[item.category] ?? categoryConfig.info;
            return (
              <motion.div
                variants={itemVariants}
                key={item.id}
                className="neo-flat transition-all duration-300 hover:-translate-y-1 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 relative group border-none"
              >
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-5 right-5 sm:static w-11 h-11 rounded-xl flex items-center justify-center neo-icon-btn text-rose-500 border-none transition-all hover:-translate-y-[2px] shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center neo-pressed ${cfg.text}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0 pr-10 sm:pr-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg border-none neo-pressed ${cfg.text}`}>
                      {cfg.label}
                    </span>
                    {item.authorName && (
                      <span className="text-xs text-slate-400 font-medium truncate">oleh {item.authorName}</span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-1 line-clamp-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3 sm:line-clamp-2 leading-relaxed">{item.content}</p>
                  <p className="text-slate-400 text-xs mt-2 font-medium">{formatDate(item.createdAt)}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
