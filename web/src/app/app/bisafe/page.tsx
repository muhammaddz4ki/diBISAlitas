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
import { useAccessibility } from "@/lib/AccessibilityContext";

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
  const colorfulMode = false;
  const [tab, setTab] = useState<Tab>("darurat");
  const [me, setMe] = useState<{ uid: string; name: string; email: string } | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setMe(u ? { uid: u.uid, name: u.displayName || u.email?.split("@")[0] || "Pengguna", email: u.email || "" } : null);
    });
    return () => unsub();
  }, []);

  return (
    <div className={`min-h-full bg-[#f4f6fc] ${colorfulMode ? "selection:bg-rose-500/20" : "selection:bg-[#1B9981]/20"} flex flex-col pb-24`}>
      {/* Header — Sticky 3D Neumorphism */}
      <div className="sticky top-0 z-50 px-6 pt-14 pb-6 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shrink-0 bubble-3d text-white">
            <ShieldAlert className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2.5} />
          </div>
          <div>

            <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-tight text-3d">BiSAFE</h1>
            <p className="text-slate-500 text-[13px] leading-snug line-clamp-2 max-w-[240px] mt-0.5 text-3d">
              Layanan darurat terpusat — tombol panik, kontak, dan riwayat.
            </p>
          </div>
        </div>

        {/* Segmented Tabs */}
        <div className="mt-5 flex gap-1.5 bg-[#f4f6fc] rounded-[16px] p-1.5 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)] border border-white">
          <TabButton active={tab === "darurat"} onClick={() => setTab("darurat")} icon={<ShieldAlert className="w-4 h-4" strokeWidth={2.5} />} label="Darurat" />
          <TabButton active={tab === "kontak"} onClick={() => setTab("kontak")} icon={<Users className="w-4 h-4" strokeWidth={2.5} />} label="Kontak" />
          <TabButton active={tab === "riwayat"} onClick={() => setTab("riwayat")} icon={<History className="w-4 h-4" strokeWidth={2.5} />} label="Riwayat" />
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
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] text-[13px] transition-all -webkit-tap-highlight-color-transparent outline-none ${
        active ? "bg-[#f4f6fc] text-slate-800 shadow-3d border border-white font-black" : "text-slate-500 hover:text-slate-700 font-bold"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─────────────────────────  DARURAT  ───────────────────────── */
function DaruratTab() {
  const { reduceMotion } = useAccessibility();
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
      {status === "loading" && !reduceMotion && (
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

      <div className="relative">
        {/* Glow Element */}
        <div 
          className={`absolute inset-0 rounded-full blur-2xl opacity-60 transition-colors duration-500 ${
            status === "success" ? "bg-[#1B9981]" : "bg-rose-500"
          }`} 
        />
        
        <motion.button
          whileTap={{ scale: reduceMotion ? 1 : 0.92 }}
          onClick={handlePanic}
          className={`relative z-10 w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center transition-all duration-500 ease-out outline-none shadow-3d shadow-3d-active
            ${status === "success"
              ? "bg-gradient-to-br from-[#1B9981] to-[#00D4AA]"
              : "bg-gradient-to-br from-rose-500 to-rose-700"
            }`}
        >
          <div className="absolute inset-0 rounded-full bg-white/10" style={{ boxShadow: "inset 0 10px 20px rgba(255,255,255,0.4)" }} />
        {status === "success" ? (
          <motion.div initial={{ scale: reduceMotion ? 1 : 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20, duration: reduceMotion ? 0 : undefined }} className="flex flex-col items-center">
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
      </div>


      <p className="text-slate-500 font-semibold text-[13px] mt-12 text-center max-w-[280px] text-3d leading-relaxed">
        Tekan tombol untuk mengirimkan koordinat lokasi Anda saat ini ke pusat kendali.
      </p>

      <div className="absolute bottom-6 left-0 w-full flex items-center justify-center pointer-events-none px-6 z-50" aria-live="assertive" role="alert">
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20, scale: reduceMotion ? 1 : 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : 10, scale: reduceMotion ? 1 : 0.95 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-[20px] font-bold text-[13px] shadow-3d border border-white
                ${status === "error" ? "bg-rose-50 text-rose-600" : ""}
                ${status === "loading" ? "bg-[#f4f6fc] text-slate-700" : ""}
                ${status === "success" ? "bg-emerald-50 text-emerald-600" : ""}`}
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
  const { reduceMotion } = useAccessibility();
  const colorfulMode = false;
  const themeGrad = "from-rose-500 to-rose-700";
  const themeRing = "focus:ring-rose-500/30";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [contacts, setContacts] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("keluarga");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: reduceMotion ? 0 : 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.4 } }
  };

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
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[17px] font-black text-slate-800 text-3d">Kontak Darurat</h2>
        <button
          onClick={() => setShowAdd(true)}
          className={`flex items-center gap-1.5 bg-gradient-to-br ${themeGrad} text-white text-[13px] font-bold rounded-full pl-3 pr-4 py-2 transition-transform shadow-3d shadow-3d-active border border-white icon-3d`}
        >
          <Plus className="w-4 h-4 drop-shadow-sm" strokeWidth={3} /> <span className="drop-shadow-sm">Tambah</span>
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)]">
            <Users className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
          </div>
          <p className="font-bold text-slate-700 text-[16px] text-3d">Belum ada kontak darurat</p>
          <p className="text-[13px] text-slate-500 mt-1 max-w-[240px] text-3d leading-relaxed">Tambahkan kontak yang bisa dihubungi saat darurat.</p>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-3">
          {contacts.map((c) => (
            <motion.div variants={itemVariants} key={c.id} className="flex flex-row items-center gap-3 sm:gap-4 bg-transparent border border-white rounded-[24px] p-4 shadow-3d shadow-3d-hover transition-all group">
              <div className="w-12 h-12 rounded-[16px] bg-transparent shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] flex items-center justify-center text-[22px] shrink-0 border border-white">
                {relIcon(c.relation)}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-slate-800 text-[16px] truncate text-3d leading-snug">{c.name}</h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500 mt-1 min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0 min-w-0">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[13px] font-semibold text-3d truncate">{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] shrink-0" />
                    <span className="text-[12px] font-bold capitalize text-3d truncate">{c.relation}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setConfirmDelete(c.id)} aria-label="Hapus kontak" className="w-12 h-12 rounded-[16px] flex items-center justify-center text-rose-500 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] hover:bg-rose-50 border border-white transition-all shrink-0 ml-auto">
                <Trash2 className="w-5 h-5 shrink-0" strokeWidth={2.5} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal Tambah */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[700] bg-black/40 flex items-end sm:items-center justify-center" onClick={() => setShowAdd(false)}>
            <motion.div
              initial={{ y: reduceMotion ? 0 : 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reduceMotion ? 0 : 40, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
              className="w-full sm:w-[360px] bg-[#f4f6fc] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 pb-8 shadow-[0_-20px_40px_rgba(0,0,0,0.15)] border-t border-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-black text-slate-800 text-3d">Tambah Kontak</h3>
                <button onClick={() => setShowAdd(false)} aria-label="Tutup" className="w-12 h-12 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] flex items-center justify-center border border-white">
                  <X className="w-5 h-5 text-slate-500" strokeWidth={2.5} />
                </button>
              </div>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama"
                className={`w-full mb-3.5 bg-[#f4f6fc] border border-white rounded-[16px] px-4 py-3.5 text-[14px] font-semibold text-slate-800 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)] focus:outline-none focus:ring-2 ${themeRing} placeholder:text-slate-400 placeholder:font-medium transition-all`} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="No. Telepon" inputMode="tel"
                className={`w-full mb-4 bg-[#f4f6fc] border border-white rounded-[16px] px-4 py-3.5 text-[14px] font-semibold text-slate-800 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)] focus:outline-none focus:ring-2 ${themeRing} placeholder:text-slate-400 placeholder:font-medium transition-all`} />
              <div className="flex gap-2 mb-6">
                {RELATIONS.map((r) => (
                  <button key={r.value} onClick={() => setRelation(r.value)}
                    className={`flex-1 py-3 rounded-[14px] text-[13px] font-bold border transition-all shadow-3d-active ${relation === r.value ? `bg-gradient-to-br ${themeGrad} text-white border-white shadow-3d icon-3d` : "bg-transparent text-slate-500 border-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)]"}`}>
                    {r.label}
                  </button>
                ))}
              </div>
              <button onClick={addContact} disabled={saving || !name.trim() || !phone.trim()}
                className={`w-full py-4 rounded-[16px] bg-gradient-to-br ${themeGrad} text-white font-bold text-[15px] shadow-3d shadow-3d-active border-2 border-white icon-3d transition-all disabled:opacity-50 disabled:shadow-none`}>
                {saving ? "Menyimpan..." : "Simpan Kontak"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Konfirmasi Hapus */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[800] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
            <motion.div
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9, y: reduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.9, y: reduceMotion ? 0 : 20 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="w-full max-w-[320px] bg-[#f4f6fc] rounded-[28px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)]">
                <Trash2 className="w-8 h-8 text-rose-500" strokeWidth={2} />
              </div>
              <h3 className="text-[18px] font-black text-slate-800 mb-2 text-3d">Hapus Kontak?</h3>
              <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">Apakah Anda yakin ingin menghapus kontak darurat ini? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 rounded-[16px] text-[14px] font-bold text-slate-600 bg-transparent border border-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] active:scale-95 transition-all">Batal</button>
                <button onClick={() => { del(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-3 rounded-[16px] text-[14px] font-bold text-white bg-gradient-to-br from-rose-500 to-rose-700 shadow-3d shadow-3d-active active:scale-95 transition-all border border-rose-400">Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────  RIWAYAT  ───────────────────────── */
function RiwayatTab({ me }: { me: { uid: string; name: string; email: string } | null }) {
  const { reduceMotion } = useAccessibility();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: reduceMotion ? 0 : 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.4 } }
  };

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
    try {
      await deleteDoc(doc(db, "emergency_reports", id));
    } catch {
      /* abaikan */
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 pt-5">
      <h2 className="text-[17px] font-black text-slate-800 mb-5 text-3d">Riwayat Laporan</h2>
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-[inset_3px_3px_8px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)] border border-white">
            <History className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
          </div>
          <p className="font-bold text-slate-700 text-[16px] text-3d">Belum ada riwayat laporan</p>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-3">
          {reports.map((r) => {
            const st = STATUS_LABEL[r.status] || { label: r.status || "-", cls: "bg-slate-100 text-slate-500 border-slate-200" };
            return (
              <motion.div variants={itemVariants} key={r.id} className="bg-transparent border border-white rounded-[24px] p-5 shadow-3d shadow-3d-hover transition-all">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 min-w-0">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-widest shrink-0 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),_inset_-2px_-2px_4px_rgba(255,255,255,1)] ${st.cls}`}>{st.label}</span>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0 ml-auto">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold text-3d shrink-0">
                      <Clock className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{fmt(r.createdAt)}</span>
                    </span>
                    <button onClick={() => setConfirmDelete(r.id)} className="w-8 h-8 rounded-full shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05),_inset_-2px_-2px_4px_rgba(255,255,255,1)] flex items-center justify-center text-rose-400 hover:text-rose-600 transition-colors border border-white shrink-0 ml-auto">
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-slate-600 min-w-0">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-[13px] font-bold text-3d font-mono break-all">
                    {typeof r.latitude === "number" ? r.latitude.toFixed(5) : "-"}, {typeof r.longitude === "number" ? r.longitude.toFixed(5) : "-"}
                  </span>
                </div>
                {r.aiDescription && (
                  <div className="mt-3.5 bg-[#f4f6fc] border border-white rounded-[16px] px-4 py-3 text-[13px] text-slate-600 font-medium leading-relaxed shadow-[inset_3px_3px_8px_rgba(0,0,0,0.05),_inset_-4px_-4px_10px_rgba(255,255,255,1)]">
                    {r.aiDescription}
                  </div>
                )}
                <div className="mt-3 text-[11px] text-slate-400 font-bold tracking-wide uppercase text-3d">Trigger: {r.triggerType || "button"}</div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Modal Konfirmasi Hapus Riwayat */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[800] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
            <motion.div
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9, y: reduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.9, y: reduceMotion ? 0 : 20 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="w-full max-w-[320px] bg-[#f4f6fc] rounded-[28px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)]">
                <History className="w-8 h-8 text-rose-500" strokeWidth={2} />
              </div>
              <h3 className="text-[18px] font-black text-slate-800 mb-2 text-3d">Hapus Riwayat?</h3>
              <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">Apakah Anda yakin ingin menghapus riwayat laporan ini? Data akan hilang permanen.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 rounded-[16px] text-[14px] font-bold text-slate-600 bg-transparent border border-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-3px_-3px_7px_rgba(255,255,255,1)] active:scale-95 transition-all">Batal</button>
                <button onClick={() => { del(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-3 rounded-[16px] text-[14px] font-bold text-white bg-gradient-to-br from-rose-500 to-rose-700 shadow-3d shadow-3d-active active:scale-95 transition-all border border-rose-400">Hapus</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
