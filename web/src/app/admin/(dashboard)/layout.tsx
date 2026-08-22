"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, AlertTriangle, GraduationCap, LogOut, ShieldAlert, Bell, Clock, History, Map, Megaphone, Settings } from "lucide-react";
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
  const [notifications, setNotifications] = useState<{id:string, type:string, message:string, time:Date}[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

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
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
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
    <div className="min-h-screen bg-[#FBFBFD] flex font-sans text-slate-800 selection:bg-[#00B894]/20 selection:text-[#00B894]">
      <Toaster position="top-right" />
      {/* ── Sidebar ── */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col fixed inset-y-0 left-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shadow-[#00B894]/20 shrink-0">
              <img src="/logo/logo-lingkaran.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900 tracking-tight">diBISAlitas</h1>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
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
          {/* Kartu identitas admin */}
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-slate-50 hover:bg-[#00B894]/10 transition-all group"
          >
            <div className="w-9 h-9 rounded-full bg-[#00B894] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {(userEmail?.[0] || "A").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 truncate">Administrator</p>
              <p className="text-xs text-slate-400 truncate">{userEmail || "admin"}</p>
            </div>
            <Settings className="w-4 h-4 text-slate-300 group-hover:text-[#00B894] transition-colors shrink-0" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all font-semibold"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 ml-72 relative">
        {/* Topbar Notifications */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 flex items-center justify-end px-10 sticky top-0 z-20">
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
            
            {/* Dropdown Panel */}
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
                          <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            n.type === 'emergency' ? 'bg-red-100 text-red-500' : 'bg-amber-100 text-amber-500'
                          }`}>
                            {n.type === 'emergency' ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{n.message}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400 font-medium">
                              <Clock className="w-3 h-3" />
                              {n.time.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
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

        <div className="h-full max-w-7xl mx-auto p-8 sm:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
