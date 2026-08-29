"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, AlertTriangle, GraduationCap, LogOut, ShieldAlert, Bell, Clock, History, Map, Megaphone, Settings, Menu, X } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Notification State
  const [notifications, setNotifications] = useState<{id:string, type:string, message:string, time:Date}[]>([]);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    // 1. Cek apakah pengguna berada dalam mode demo (via query param ?demo=true atau sessionStorage)
    const isDemo =
      typeof window !== "undefined" &&
      (new URLSearchParams(window.location.search).get("demo") === "true" ||
        window.sessionStorage.getItem("dibisalitas_admin_demo_mode") === "true");

    if (isDemo) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("dibisalitas_admin_demo_mode", "true");
      }
      setUserEmail("admin.demo@dibisalitas.id");
      setIsChecking(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      // Verifikasi OTORISASI: hanya akun dengan role "admin" yang boleh masuk panel.
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.data();
        // Terima dua skema: `isAdmin: true` (dari mobile) ATAU `role: "admin"` (dari web).
        const isAdminUser = data?.isAdmin === true || data?.role === "admin";
        if (isAdminUser) {
          setUserEmail(user.email);
          setIsChecking(false);
        } else {
          await signOut(auth);
          router.replace("/admin/login?error=forbidden");
        }
      } catch (e) {
        // Error transien (mis. jaringan / rules) — JANGAN paksa logout; beri opsi muat ulang.
        console.error("Gagal memverifikasi akses admin:", e);
        setAuthError("Gagal memverifikasi akses admin. Periksa koneksi internet lalu muat ulang halaman.");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Voice Announcer
  const speakNotif = (type: 'emergency' | 'obstacle') => {
    try {
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance();
        msg.lang = 'id-ID';
        msg.rate = 0.95;
        msg.pitch = 1.1;
        msg.text = type === 'emergency' 
          ? 'Perhatian, ada laporan darurat baru masuk.' 
          : 'Informasi, data rintangan baru telah ditambahkan.';
        
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
      }
    } catch(e) {}
  };

  // Global Notification Listener
  useEffect(() => {
    if (isChecking) return; // Wait until authenticated

    let initialLoadEmergency = true;
    let initialLoadObstacle = true;

    // Listen to Emergency Reports
    const qEmergency = query(
      collection(db, "emergency_reports"),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const unsubEmergency = onSnapshot(qEmergency, (snapshot) => {
      if (initialLoadEmergency) {
        initialLoadEmergency = false;
        return;
      }
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          speakNotif('emergency');
          
          setNotifications(prev => [{
            id: change.doc.id,
            type: 'emergency',
            message: 'Laporan Darurat Baru Masuk!',
            time: new Date()
          }, ...prev]);

          toast("Laporan Darurat Baru Masuk!", {
            duration: 6000,
            icon: '🚨',
            style: {
              background: '#fff',
              color: '#ef4444',
              fontWeight: '600',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
            },
          });
        }
      });
    }, (err) => console.log(err));

    // Listen to Obstacle Reports
    const qObstacle = query(
      collection(db, "obstacle_reports"),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const unsubObstacle = onSnapshot(qObstacle, (snapshot) => {
      if (initialLoadObstacle) {
        initialLoadObstacle = false;
        return;
      }
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          speakNotif('obstacle');
          
          setNotifications(prev => [{
            id: change.doc.id,
            type: 'obstacle',
            message: 'Data Rintangan Baru Ditambahkan',
            time: new Date()
          }, ...prev]);

          toast("Data Rintangan Baru Ditambahkan!", {
            duration: 5000,
            icon: '🚧',
            style: {
              background: '#fff',
              color: '#f59e0b',
              fontWeight: '600',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
            },
          });
        }
      });
    }, (err) => console.log(err));

    return () => {
      unsubEmergency();
      unsubObstacle();
    };
  }, [isChecking]);

  const handleLogout = async () => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("dibisalitas_admin_demo_mode");
      }
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen neo-page flex flex-col items-center justify-center gap-4 px-6 text-center">
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
      href: "/admin/dashboard",
      icon: <Activity className="w-5 h-5" />
    },
    {
      title: "Laporan Rintangan",
      href: "/admin/rintangan",
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      title: "Riwayat Darurat",
      href: "/admin/history",
      icon: <History className="w-5 h-5" />
    },
    {
      title: "Peta Hotspot",
      href: "/admin/maps",
      icon: <Map className="w-5 h-5" />
    },
    {
      title: "Pengumuman",
      href: "/admin/pengumuman",
      icon: <Megaphone className="w-5 h-5" />
    },
    {
      title: "BiKELOLA",
      href: "/admin/bikelola",
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      title: "Pengaturan Profil",
      href: "/admin/profile",
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <div className="h-[100dvh] w-full neo-page flex font-sans text-slate-800 selection:bg-[#00B894]/20 selection:text-[#00B894] overflow-hidden">
      <Toaster position="top-right" />
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`peer group bg-[#F4FBF9] border-r-2 border-white/60 flex flex-col fixed inset-y-0 left-0 z-50 transition-[width,transform] duration-300 lg:translate-x-0 shadow-[8px_0_24px_rgba(163,177,198,0.15)] overflow-y-auto overflow-x-hidden h-full overscroll-contain ${
        isMobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full w-72 lg:w-[5.5rem] lg:hover:w-72"
      }`}>
        <div className="p-5 flex items-center gap-4 relative whitespace-nowrap">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center neo-flat text-slate-400 rounded-full hover:-translate-y-[2px] hover:text-slate-600 lg:hidden border-none"
          >
            <X className="w-4 h-4" />
          </button>
          <img src="/logo/logo.png" alt="Logo" className="w-12 h-12 object-cover rounded-xl shadow-[4px_4px_10px_#cedcd8,-4px_-4px_10px_#ffffff] shrink-0" />
          <div className="transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
            <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">diBISAlitas</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4 relative">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 whitespace-nowrap border-none ${
                  isActive 
                    ? "text-white font-extrabold" 
                    : "text-slate-500 hover:neo-flat hover:-translate-y-[2px] hover:text-[#00B894] font-extrabold"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeAdminNavTab"
                    className="!absolute inset-0 neo-flat-primary rounded-2xl"
                    transition={{ type: "spring", stiffness: 60, damping: 12 }}
                  />
                )}
                <div className="shrink-0 relative z-10">{item.icon}</div>
                <span className="text-sm transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 relative z-10">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-2 border-white/50 space-y-3 whitespace-nowrap">
          {/* Notifikasi Button */}
          <button
            onClick={() => {
              setShowNotif(true);
              if (window.innerWidth < 1024) {
                setIsMobileMenuOpen(false);
              }
            }}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 font-extrabold hover:neo-flat hover:-translate-y-[2px] hover:text-[#00B894] transition-all border-none"
          >
            <div className="relative shrink-0">
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#F4FBF9] animate-pulse"></span>
              )}
            </div>
            <div className="flex flex-1 items-center justify-between transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
              <span className="text-sm">Notifikasi</span>
              {notifications.length > 0 && (
                <span className="text-[10px] font-extrabold neo-pressed text-[#00B894] px-2 py-0.5 rounded-lg border-none">
                  {notifications.length} Baru
                </span>
              )}
            </div>
          </button>

          {/* Kartu identitas admin */}
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 px-3 py-3 rounded-2xl neo-pressed hover:-translate-y-[1px] transition-all group/profile border-none"
          >
            <div className="w-10 h-10 rounded-xl neo-flat flex items-center justify-center text-[#00B894] font-extrabold text-lg shrink-0 mx-auto lg:mx-0 border-none">
              {(userEmail?.[0] || "A").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
              <p className="text-sm font-extrabold text-slate-800 truncate">Administrator</p>
              <p className="text-xs text-slate-500 font-bold truncate mt-0.5">{userEmail || "admin"}</p>
            </div>
            <Settings className="w-4 h-4 text-slate-400 group-hover/profile:text-[#00B894] transition-colors shrink-0 lg:opacity-0 lg:group-hover:opacity-100" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 font-extrabold hover:neo-flat hover:-translate-y-[2px] hover:text-rose-500 transition-all border-none"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-sm transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative min-w-0 lg:ml-[5.5rem] peer-hover:lg:ml-72 transition-all duration-300">
        {/* Mobile Hamburger Button */}
        <div className="lg:hidden p-4 sticky top-0 z-20 neo-page/80 backdrop-blur-sm">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 w-12 h-12 flex items-center justify-center neo-flat text-slate-500 border-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="min-h-full w-full p-4 sm:p-6 lg:p-8 lg:pt-8">
          {children}
        </div>
      </main>

      {/* Backdrop for Notification Popup */}
      {showNotif && (
        <div 
          className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none transition-all cursor-default" 
          onClick={() => setShowNotif(false)} 
        />
      )}

      {/* Notification Popout (Outside Sidebar to avoid clipping) */}
      {showNotif && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-6 sm:left-[6.5rem] sm:translate-x-0 sm:translate-y-0 z-[100] w-[calc(100vw-2rem)] sm:w-96 neo-flat border-none overflow-hidden animate-in fade-in zoom-in-95 sm:slide-in-from-bottom-6 duration-300">
          <div className="px-5 py-5 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800">Notifikasi</h3>
            <button onClick={() => setShowNotif(false)} className="sm:hidden w-8 h-8 flex items-center justify-center rounded-full neo-flat hover:-translate-y-[2px] transition-all border-none">
              <X className="w-4 h-4 text-slate-500" />
            </button>
            <span className="hidden sm:inline-flex items-center text-[10px] font-extrabold neo-pressed text-[#00B894] px-3 py-1.5 rounded-lg border-none uppercase tracking-wider">
              {notifications.length} Baru
            </span>
          </div>
          <div className="max-h-[60vh] overflow-y-auto px-4 pb-4 flex flex-col gap-3">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm font-bold neo-pressed rounded-2xl border-none">Belum ada notifikasi baru</div>
            ) : (
              notifications.map((n, idx) => (
                <div key={`${n.id}-${idx}`} className="p-4 neo-pressed rounded-2xl border-none flex gap-3.5 whitespace-normal transition-all">
                  <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 neo-flat border-none ${
                    n.type === 'emergency' ? 'text-rose-500' : 'text-amber-500'
                  }`}>
                    {n.type === 'emergency' ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-800 leading-snug">{n.message}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {n.time.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
