"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  GraduationCap,
  LogOut,
  ShieldAlert,
  Bell,
  Clock,
  History,
  Map,
  Megaphone,
  Settings,
  Shield,
  Zap,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Notification State
  const [notifications, setNotifications] = useState<{ id: string; type: string; message: string; time: Date }[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [isDemo, setIsDemo] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const hasDemoParam = searchParams.get("demo") === "true";
    const hasDemoSession = window.sessionStorage.getItem("dibisalitas_admin_demo") === "true";
    const hasDemoLocal = window.localStorage.getItem("dibisalitas_admin_demo") === "true";

    const isDemoActive = hasDemoParam || hasDemoSession || hasDemoLocal;

    if (isDemoActive) {
      window.sessionStorage.setItem("dibisalitas_admin_demo", "true");
      window.localStorage.setItem("dibisalitas_admin_demo", "true");
      setIsDemo(true);
      setUserEmail("admin.demo@dibisalitas.id");
      setIsChecking(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.data();
        const isAdminUser = data?.isAdmin === true || data?.role === "admin";
        if (isAdminUser) {
          setUserEmail(user.email);
          setIsChecking(false);
        } else {
          await signOut(auth);
          router.replace("/admin/login?error=forbidden");
        }
      } catch (e) {
        console.error("Gagal memverifikasi akses admin:", e);
        setAuthError("Gagal memverifikasi akses admin. Periksa koneksi internet lalu muat ulang halaman.");
      }
    });
    return () => unsubscribe();
  }, [router, pathname]);

  // Voice Announcer
  const speakNotif = (type: "emergency" | "obstacle") => {
    try {
      if ("speechSynthesis" in window) {
        const msg = new SpeechSynthesisUtterance();
        msg.lang = "id-ID";
        msg.rate = 0.95;
        msg.pitch = 1.1;
        msg.text =
          type === "emergency"
            ? "Perhatian, ada laporan darurat baru masuk."
            : "Informasi, data rintangan baru telah ditambahkan.";

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
      }
    } catch {}
  };

  // Global Notification Listener
  useEffect(() => {
    if (isChecking) return;

    if (isDemo) {
      setNotifications([
        {
          id: "demo-notif-1",
          type: "obstacle",
          message: "Laporan Rintangan Baru: Guiding Block Rusak Tosari",
          time: new Date(Date.now() - 1800000),
        },
        {
          id: "demo-notif-2",
          type: "emergency",
          message: "Sinyal BiSAFE Darurat: Hendra Wijaya (Tunanetra)",
          time: new Date(Date.now() - 900000),
        },
      ]);
      return;
    }

    let initialLoadEmergency = true;
    let initialLoadObstacle = true;

    // Listen to Emergency Reports
    const qEmergency = query(collection(db, "emergency_reports"), orderBy("createdAt", "desc"), limit(20));
    const unsubEmergency = onSnapshot(
      qEmergency,
      (snapshot) => {
        if (initialLoadEmergency) {
          initialLoadEmergency = false;
          return;
        }
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            speakNotif("emergency");

            setNotifications((prev) => [
              {
                id: change.doc.id,
                type: "emergency",
                message: "Laporan Darurat Baru Masuk!",
                time: new Date(),
              },
              ...prev,
            ]);

            toast("Laporan Darurat Baru Masuk!", {
              duration: 6000,
              style: {
                background: "#fff",
                color: "#ef4444",
                fontWeight: "600",
                borderRadius: "16px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              },
            });
          }
        });
      },
      (err) => console.log("Silent fallback in demo/unauth:", err)
    );

    // Listen to Obstacle Reports
    const qObstacle = query(collection(db, "obstacle_reports"), orderBy("createdAt", "desc"), limit(20));
    const unsubObstacle = onSnapshot(
      qObstacle,
      (snapshot) => {
        if (initialLoadObstacle) {
          initialLoadObstacle = false;
          return;
        }
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            speakNotif("obstacle");

            setNotifications((prev) => [
              {
                id: change.doc.id,
                type: "obstacle",
                message: "Laporan Rintangan Baru Ditambahkan",
                time: new Date(),
              },
              ...prev,
            ]);

            toast("Laporan Rintangan Baru Masuk", {
              duration: 5000,
              style: {
                background: "#fff",
                color: "#f59e0b",
                fontWeight: "600",
                borderRadius: "16px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              },
            });
          }
        });
      },
      (err) => console.log("Silent fallback in demo/unauth:", err)
    );

    return () => {
      unsubEmergency();
      unsubObstacle();
    };
  }, [isChecking, isDemo]);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("dibisalitas_admin_demo");
      window.localStorage.removeItem("dibisalitas_admin_demo");
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.warn("Logout handler:", error);
    }
    router.push("/demo");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col items-center justify-center gap-4 px-6 text-center">
        {authError ? (
          <>
            <p className="text-slate-600 font-medium max-w-sm">{authError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#00B894] text-white rounded-xl font-semibold text-sm hover:bg-[#00a383] transition-colors"
            >
              Muat Ulang
            </button>
          </>
        ) : (
          <Activity className="w-8 h-8 text-[#00B894] animate-spin" />
        )}
      </div>
    );
  }

  const menuItems = [
    {
      title: "BiPANTAU",
      href: isDemo ? "/admin/dashboard?demo=true" : "/admin/dashboard",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      title: "Laporan Rintangan",
      href: isDemo ? "/admin/rintangan?demo=true" : "/admin/rintangan",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
      title: "Riwayat Darurat",
      href: isDemo ? "/admin/history?demo=true" : "/admin/history",
      icon: <History className="w-5 h-5" />,
    },
    {
      title: "Peta Hotspot",
      href: isDemo ? "/admin/maps?demo=true" : "/admin/maps",
      icon: <Map className="w-5 h-5" />,
    },
    {
      title: "Pengumuman",
      href: isDemo ? "/admin/pengumuman?demo=true" : "/admin/pengumuman",
      icon: <Megaphone className="w-5 h-5" />,
    },
    {
      title: "BiKELOLA",
      href: isDemo ? "/admin/bikelola?demo=true" : "/admin/bikelola",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      title: "Pengaturan Profil",
      href: isDemo ? "/admin/profile?demo=true" : "/admin/profile",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-slate-800 flex font-sans antialiased selection:bg-[#00B894]/20 selection:text-[#00B894]">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-100/80 flex flex-col justify-between fixed h-screen z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/logo.png" alt="diBISAlitas" className="w-9 h-9 object-contain" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                Bi<span className="text-[#00B894]">PANTAU</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                {isDemo ? "Demo Command Center" : "Command Center"}
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href.split("?")[0];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#00B894] text-white font-bold shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          {/* Identity card */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-slate-50 transition-all">
            <div className="w-9 h-9 rounded-full bg-[#00B894] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {isDemo ? "J" : (userEmail?.[0] || "A").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {isDemo ? "Tamu Demo (Juri)" : "Administrator"}
                </p>
                {isDemo && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-700">
                    DEMO
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">{userEmail || "admin.demo@dibisalitas.id"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all font-semibold"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">{isDemo ? "Tutup Mode Demo" : "Keluar Sistem"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 relative">
        {/* Topbar */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-20">
          {isDemo ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>
                <strong>Mode Demo Juri Aktif:</strong> Anda sedang menjelajahi simulasi Command Center BiPANTAU tanpa login. Data &amp; aksi beroperasi dalam mode interaktif.
              </span>
            </div>
          ) : (
            <div />
          )}

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="p-3 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-[#00B894] hover:bg-slate-50 transition-all relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-800">Notifikasi</h3>
                  <span className="text-xs font-semibold bg-[#00B894]/10 text-[#00B894] px-2 py-1 rounded-full">
                    {notifications.length} Baru
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm font-medium">Belum ada notifikasi baru</div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((n, idx) => (
                        <div key={`${n.id}-${idx}`} className="p-4 hover:bg-slate-50 transition-colors flex gap-3">
                          <div
                            className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              n.type === "emergency" ? "bg-red-100 text-red-500" : "bg-amber-100 text-amber-500"
                            }`}
                          >
                            {n.type === "emergency" ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{n.message}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400 font-medium">
                              <Clock className="w-3 h-3" />
                              {n.time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="h-full max-w-7xl mx-auto p-8 sm:p-12">{children}</div>
      </main>
    </div>
  );
}
