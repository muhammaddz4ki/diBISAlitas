"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Users,
  History,
  Plus,
  X,
  Trash2,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "darurat" | "kontak" | "riwayat";

const RELATIONS = [
  { value: "keluarga", label: "Keluarga" },
  { value: "teman", label: "Teman" },
  { value: "relawan", label: "Relawan" },
];

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: "Menunggu", cls: "bg-amber-50 text-amber-600 border-amber-100" },
  responding: { label: "Ditangani", cls: "bg-sky-50 text-sky-600 border-sky-100" },
  resolved: { label: "Selesai", cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  cancelled: { label: "Dibatalkan", cls: "bg-slate-100 text-slate-500 border-slate-200" },
};

export default function BiSafePage() {
  const [tab, setTab] = useState<Tab>("darurat");
  const [me, setMe] = useState<{ uid: string; name: string; email: string } | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setMe(u ? { uid: u.uid, name: u.displayName || u.email?.split("@")[0] || "Pengguna", email: u.email || "" } : null);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-full bg-white selection:bg-[#1B9981]/20 flex flex-col pb-12">
      {/* Header — Minimal White */}
      <div className="px-6 pt-14 pb-4 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-rose-500" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-slate-500 text-[12px] font-semibold uppercase tracking-widest">diBISAlitas</p>
            <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-tight">BiSAFE</h1>
            <p className="text-slate-500 text-[13px] leading-snug line-clamp-2 max-w-[240px] mt-0.5">
              Layanan darurat terpusat — tombol panik, kontak, dan riwayat.
            </p>
          </div>
        </div>

        {/* Segmented Tabs */}
        <div className="mt-4 flex gap-1 bg-slate-100 rounded-2xl p-1">
          <TabButton active={tab === "darurat"} onClick={() => setTab("darurat")} icon={<ShieldAlert className="w-4 h-4" />} label="Darurat" />
          <TabButton active={tab === "kontak"} onClick={() => setTab("kontak")} icon={<Users className="w-4 h-4" />} label="Kontak" />
          <TabButton active={tab === "riwayat"} onClick={() => setTab("riwayat")} icon={<History className="w-4 h-4" />} label="Riwayat" />
        </div>
      </div>

      {tab === "darurat" && <DaruratTab />}
      {tab === "kontak" && <KontakTab me={me} />}
      {tab === "riwayat" && <RiwayatTab me={me} />}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
        active ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─────────────────────────  DARURAT  ───────────────────────── */
function DaruratTab() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handlePanic = () => {
    if (status === "loading") return;
    setStatus("loading");
    setMessage("Mendapatkan lokasi...");

    if (!navigator.geolocation) {
      setStatus("error");
      setMessage("Geolokasi tidak didukung oleh browser Anda.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setMessage("Mengirim laporan darurat...");
          const user = auth.currentUser;
          let reporterName = user?.displayName || "Pengguna Web";
          let userPhone = "";
          let disabilityType = "";
          if (user) {
            try {
              const snap = await getDoc(doc(db, "users", user.uid));
              const d = snap.data();
              if (d) {
                reporterName = d.name || d.fullName || reporterName;
                userPhone = d.phone || "";
                disabilityType = d.disabilityType || "";
              }
            } catch {
              /* fallback ke displayName */
            }
          }

          await addDoc(collection(db, "emergency_reports"), {
            userId: user?.uid ?? null,
            userName: reporterName,
            reporterName: reporterName,
            email: user?.email || "",
            reporterEmail: user?.email || "anonim",
            userPhone: userPhone,
            disabilityType: disabilityType,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            status: "pending",
            triggerType: "button",
            source: "web_portal",
            createdAt: serverTimestamp(),
          });

          setStatus("success");
          setMessage("Laporan Darurat Berhasil Terkirim!");
          setTimeout(() => {
            setStatus("idle");
            setMessage("");
          }, 3000);
        } catch {
          setStatus("error");
          setMessage("Gagal mengirim laporan. Coba lagi.");
        }
      },
      () => {
        setStatus("error");
        setMessage("Akses lokasi ditolak atau gagal. Izinkan akses lokasi.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full relative px-6 mt-4 min-h-[440px]">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            className="absolute w-40 h-40 bg-rose-500 rounded-full"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.3 }}
            className="absolute w-40 h-40 bg-rose-500 rounded-full"
          />
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handlePanic}
        className={`relative z-10 w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center transition-all duration-500 ease-out border-[6px] outline-none
          ${status === "success"
            ? "bg-[#1B9981] border-[#1B9981]/30 shadow-[0_20px_60px_-15px_rgba(27,153,129,0.6)]"
            : "bg-rose-500 border-rose-500/30 hover:bg-rose-600 shadow-[0_20px_60px_-15px_rgba(225,29,72,0.6)]"
          }`}
      >
        <div className="absolute inset-0 rounded-full bg-white/10" style={{ boxShadow: "inset 0 10px 20px rgba(255,255,255,0.25)" }} />
        {status === "success" ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="flex flex-col items-center">
            <CheckCircle2 className="w-24 h-24 text-white mb-2" strokeWidth={2} />
            <span className="text-white font-extrabold tracking-widest text-lg drop-shadow-md">TERKIRIM</span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
            {status === "loading" ? (
              <Navigation className="w-24 h-24 text-white mb-2 animate-bounce" strokeWidth={2} />
            ) : (
              <ShieldAlert className="w-24 h-24 text-white mb-2" strokeWidth={2} />
            )}
            <span className="text-white font-extrabold tracking-widest text-lg drop-shadow-md">
              {status === "loading" ? "MENGIRIM..." : "DARURAT"}
            </span>
          </div>
        )}
      </motion.button>

      <p className="text-slate-500 font-medium text-sm mt-12 text-center max-w-[280px]">
        Tekan tombol untuk mengirimkan koordinat lokasi Anda saat ini ke pusat kendali.
      </p>

      <div className="absolute bottom-6 left-0 w-full flex items-center justify-center pointer-events-none px-6 z-50" aria-live="assertive" role="alert">
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-[20px] font-bold text-[13px] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)] border
                ${status === "error" ? "bg-rose-50 text-rose-600 border-rose-100" : ""}
                ${status === "loading" ? "bg-white text-slate-700 border-slate-100" : ""}
                ${status === "success" ? "bg-[#1B9981]/10 text-[#1B9981] border-[#1B9981]/20" : ""}`}
            >
              {status === "error" && <AlertCircle className="w-5 h-5 shrink-0" strokeWidth={2.5} />}
              {status === "loading" && <div className="w-5 h-5 border-[3px] border-slate-200 border-t-slate-700 rounded-full animate-spin shrink-0" />}
              {status === "success" && <CheckCircle2 className="w-5 h-5 shrink-0" strokeWidth={2.5} />}
              <span className="tracking-wide">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────  KONTAK  ───────────────────────── */
function KontakTab({ me }: { me: { uid: string; name: string; email: string } | null }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [contacts, setContacts] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("keluarga");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!me) return;
    const q = query(collection(db, "emergency_contacts"), where("userId", "==", me.uid));
    const unsub = onSnapshot(q, (snap) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setContacts(data);
    });
    return () => unsub();
  }, [me]);

  const addContact = async () => {
    if (!me || !name.trim() || !phone.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "emergency_contacts"), {
        userId: me.uid,
        name: name.trim(),
        phone: phone.trim(),
        relation,
        isPrimary: false,
        createdAt: serverTimestamp(),
      });
      setName("");
      setPhone("");
      setRelation("keluarga");
      setShowAdd(false);
    } catch {
      /* abaikan */
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!window.confirm("Hapus kontak darurat ini?")) return;
    try {
      await deleteDoc(doc(db, "emergency_contacts", id));
    } catch {
      /* abaikan */
    }
  };

  const relIcon = (r: string) =>
    r === "keluarga" ? "👪" : r === "teman" ? "🧑‍🤝‍🧑" : "🤝";

  return (
    <div className="flex-1 px-6 pt-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-black text-slate-800">Kontak Darurat</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-[#00B894] text-white text-[13px] font-bold rounded-full pl-3 pr-4 py-2 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" strokeWidth={3} /> Tambah
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="w-14 h-14 text-slate-200 mb-3" />
          <p className="font-bold text-slate-700">Belum ada kontak darurat</p>
          <p className="text-[13px] text-slate-500 mt-1 max-w-[240px]">Tambahkan kontak yang bisa dihubungi saat darurat.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-3.5 bg-white border border-slate-100 rounded-[20px] p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <div className="w-11 h-11 rounded-2xl bg-[#00B894]/10 flex items-center justify-center text-[20px] shrink-0">{relIcon(c.relation)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-[15px] truncate">{c.name}</h3>
                <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-[12px] font-medium">{c.phone}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[12px] font-medium capitalize">{c.relation}</span>
                </div>
              </div>
              <button onClick={() => del(c.id)} aria-label="Hapus kontak" className="w-12 h-12 rounded-xl flex items-center justify-center text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[700] bg-black/40 flex items-end sm:items-center justify-center" onClick={() => setShowAdd(false)}>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="w-full sm:w-[360px] bg-white rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[17px] font-black text-slate-800">Tambah Kontak</h3>
                <button onClick={() => setShowAdd(false)} aria-label="Tutup" className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama"
                className="w-full mb-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-[#00B894]/50" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="No. Telepon" inputMode="tel"
                className="w-full mb-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-[#00B894]/50" />
              <div className="flex gap-2 mb-5">
                {RELATIONS.map((r) => (
                  <button key={r.value} onClick={() => setRelation(r.value)}
                    className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold border transition-all ${relation === r.value ? "bg-[#00B894] text-white border-[#00B894]" : "bg-slate-50 text-slate-600 border-slate-100"}`}>
                    {r.label}
                  </button>
                ))}
              </div>
              <button onClick={addContact} disabled={saving || !name.trim() || !phone.trim()}
                className="w-full py-3.5 rounded-2xl bg-[#00B894] text-white font-bold text-[15px] active:scale-95 transition-transform disabled:opacity-50">
                {saving ? "Menyimpan..." : "Simpan Kontak"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────  RIWAYAT  ───────────────────────── */
function RiwayatTab({ me }: { me: { uid: string; name: string; email: string } | null }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!me) return;
    const q = query(collection(db, "emergency_reports"), where("userId", "==", me.uid));
    const unsub = onSnapshot(q, (snap) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const toMs = (ts: any) => (ts?.toMillis ? ts.toMillis() : ts?.seconds ? ts.seconds * 1000 : 0);
      data.sort((a, b) => toMs(b.createdAt) - toMs(a.createdAt));
      setReports(data);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [me]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fmt = (ts: any) => {
    if (!ts) return "-";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(d);
  };

  const del = async (id: string) => {
    if (!window.confirm("Hapus riwayat laporan ini?")) return;
    try {
      await deleteDoc(doc(db, "emergency_reports", id));
    } catch {
      /* abaikan */
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#00B894] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 pt-5">
      <h2 className="text-[16px] font-black text-slate-800 mb-4">Riwayat Laporan</h2>
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <History className="w-14 h-14 text-slate-200 mb-3" />
          <p className="font-bold text-slate-700">Belum ada riwayat laporan</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => {
            const st = STATUS_LABEL[r.status] || { label: r.status || "-", cls: "bg-slate-100 text-slate-500 border-slate-200" };
            return (
              <div key={r.id} className="bg-white border border-slate-100 rounded-[20px] p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide ${st.cls}`}>{st.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5" /> {fmt(r.createdAt)}
                    </span>
                    <button onClick={() => del(r.id)} className="text-rose-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[12px] font-mono">
                    {typeof r.latitude === "number" ? r.latitude.toFixed(5) : "-"}, {typeof r.longitude === "number" ? r.longitude.toFixed(5) : "-"}
                  </span>
                </div>
                {r.aiDescription && (
                  <div className="mt-2 bg-sky-50 rounded-xl px-3 py-2 text-[12px] text-slate-600 leading-relaxed">{r.aiDescription}</div>
                )}
                <div className="mt-2 text-[11px] text-slate-400 font-medium">Trigger: {r.triggerType || "button"}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
