"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Megaphone, Plus, Trash2, Info, AlertTriangle, Siren, X, CheckCircle2 } from "lucide-react";

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
      <div className="flex items-center justify-between mb-8">
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
          className="flex items-center gap-2 bg-[#00B894] hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-2xl transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Buat Pengumuman
        </button>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold text-slate-900 text-xl">Buat Pengumuman Baru</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Kategori</label>
                <div className="flex gap-2">
                  {(Object.keys(categoryConfig) as Array<"info" | "penting" | "darurat">).map((key) => {
                    const cfg = categoryConfig[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCategory(key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border font-bold text-sm transition-all ${
                          category === key
                            ? `${cfg.bg} ${cfg.text} ${cfg.border} shadow-sm`
                            : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-[#00B894] focus:ring-1 focus:ring-[#00B894] transition-all"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-[#00B894] focus:ring-1 focus:ring-[#00B894] transition-all resize-none"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-[#00B894] focus:ring-1 focus:ring-[#00B894] transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3.5 bg-[#00B894] hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Plus className="w-5 h-5" /> Publikasikan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-3xl h-32 animate-pulse shadow-[0_4px_20px_-10px_rgba(0,0,0,0.04)]" />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.04)] border border-slate-50 p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="font-bold text-slate-700 text-lg mb-2">Belum ada pengumuman</h3>
          <p className="text-slate-400 text-sm">Klik tombol "Buat Pengumuman" untuk memulai.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {announcements.map((item) => {
            const cfg = categoryConfig[item.category] ?? categoryConfig.info;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.04)] border border-slate-50 p-6 flex items-start gap-5"
              >
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${cfg.bg} ${cfg.text}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                    {item.authorName && (
                      <span className="text-xs text-slate-400 font-medium">oleh {item.authorName}</span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{item.content}</p>
                  <p className="text-slate-400 text-xs mt-2 font-medium">{formatDate(item.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2.5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
