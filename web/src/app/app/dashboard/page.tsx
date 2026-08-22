"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";
import { ShieldAlert, MessageCircle, BookOpen, Navigation, Bell, ChevronRight, PlayCircle, Clock, Users, Calendar, ArrowRight, Glasses } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [lastSeen, setLastSeen] = useState<number>(0);

  useEffect(() => {
    // Baca waktu terakhir notifikasi dibuka (penanda "sudah dibaca")
    if (typeof window !== "undefined") {
      setLastSeen(Number(window.localStorage.getItem("dibisalitas_notif_last_seen") || 0));
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push("/app/login");
      }
      setIsLoading(false);
    });

    const qNotif = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(10));
    const unsubNotif = onSnapshot(qNotif, (snap) => {
      const data: any[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setNotifs(data);
    }, () => {});

    const qCourses = query(collection(db, "bipintar_courses"), limit(3));
    const unsubCourses = onSnapshot(qCourses, (snap) => {
      const data: any[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setCourses(data);
    });

    const qAnnouncements = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(2));
    const unsubAnnouncements = onSnapshot(qAnnouncements, (snap) => {
      const data: any[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setAnnouncements(data);
    });

    return () => {
      unsubscribe();
      unsubCourses();
      unsubAnnouncements();
      unsubNotif();
    };
  }, [router]);

  const toMillis = (ts: any): number =>
    ts?.toMillis ? ts.toMillis() : ts?.seconds ? ts.seconds * 1000 : 0;
  const unreadCount = notifs.filter((n) => toMillis(n.createdAt) > lastSeen).length;
  const notifColor: Record<string, string> = {
    info: "bg-sky-400",
    penting: "bg-amber-400",
    darurat: "bg-rose-500",
  };
  const formatNotifTime = (ts: any) => {
    const ms = toMillis(ts);
    if (!ms) return "";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    }).format(new Date(ms));
  };
  const openNotif = () => {
    const wasClosed = !showNotif;
    setShowNotif(wasClosed);
    if (wasClosed) {
      const now = Date.now();
      setLastSeen(now);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("dibisalitas_notif_last_seen", String(now));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1B9981]/30 border-t-[#1B9981] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-full bg-white selection:bg-[#1B9981]/20 pb-12"
    >
      {/* Header — Minimal White */}
      <div className="px-6 pt-14 pb-5 bg-white border-b border-slate-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <div className="w-[52px] h-[52px] rounded-2xl bg-[#00B894]/10 flex items-center justify-center">
              <span className="text-[20px] font-black text-[#00B894]">{userEmail ? userEmail.charAt(0).toUpperCase() : "U"}</span>
            </div>
            <div>
              <p className="text-slate-400 text-[12px] font-semibold">Selamat datang,</p>
              <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-tight truncate max-w-[200px]">
                {userEmail?.split('@')[0] || "Pengguna"}
              </h1>
            </div>
          </div>

          {/* Notification Button */}
          <button
            onClick={openNotif}
            aria-label="Notifikasi"
            className="relative w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotif && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-6 top-[84px] w-[300px] max-h-[380px] overflow-y-auto bg-white rounded-2xl shadow-[0_20px_48px_rgba(0,0,0,0.25)] z-50 text-slate-800 border border-slate-100"
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                <span className="font-bold text-[14px]">Notifikasi</span>
                <Link href="/app/komunitas" onClick={() => setShowNotif(false)} className="text-[12px] font-bold text-[#1B9981]">
                  Lihat semua
                </Link>
              </div>
              {notifs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-[13px] font-medium">Belum ada notifikasi</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifs.map((n) => (
                    <Link
                      key={n.id}
                      href="/app/komunitas"
                      onClick={() => setShowNotif(false)}
                      className="flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notifColor[n.category] ?? "bg-slate-300"}`} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-800 line-clamp-1">{n.title || "Pengumuman"}</p>
                        <p className="text-[12px] text-slate-500 line-clamp-2 leading-snug">{n.content}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">{formatNotifTime(n.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="px-6 py-4 relative z-20">
        {/* Quick Access List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3.5"
        >
          <div className="flex items-center justify-between px-1 mb-2 mt-2">
            <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">Layanan Utama</h2>
            <span className="text-[11px] font-bold text-[#1B9981] bg-[#1B9981]/10 px-3 py-1.5 rounded-full tracking-wide">5 LAYANAN</span>
          </div>

          <FeatureCard
            href="/app/bisafe"
            title="BiSAFE"
            desc="Panic Button & Darurat"
            icon={<ShieldAlert className="w-[26px] h-[26px] text-rose-500" strokeWidth={2.5} />}
            bg="bg-rose-100/50"
            buttonColor="text-rose-500 bg-rose-50"
          />
          <FeatureCard
            href="/app/bisapa"
            title="BiSAPA"
            desc="Layanan Tatap Muka"
            icon={<MessageCircle className="w-[26px] h-[26px] text-sky-500" strokeWidth={2.5} />}
            bg="bg-sky-100/50"
            buttonColor="text-sky-500 bg-sky-50"
          />
          <FeatureCard
            href="/app/bipintar"
            title="BiPINTAR"
            desc="Platform E-Learning"
            icon={<BookOpen className="w-[26px] h-[26px] text-amber-500" strokeWidth={2.5} />}
            bg="bg-amber-100/50"
            buttonColor="text-amber-500 bg-amber-50"
          />
          <FeatureCard
            href="/app/bijalan"
            title="BiJALAN"
            desc="Navigasi Arah Jalan"
            icon={<Navigation className="w-[26px] h-[26px] text-[#1B9981]" strokeWidth={2.5} />}
            bg="bg-[#1B9981]/15"
            buttonColor="text-[#1B9981] bg-[#1B9981]/10"
          />
          <FeatureCard
            href="/app/bibaca"
            title="BiBACA"
            desc="Pemindai & Pembaca Teks"
            icon={<Glasses className="w-[26px] h-[26px] text-purple-500" strokeWidth={2.5} />}
            bg="bg-purple-100/50"
            buttonColor="text-purple-500 bg-purple-50"
          />
        </motion.div>

        {/* BiPINTAR - Materi Terbaru */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 mb-2"
        >
          <div className="flex items-center justify-between px-1 mb-4">
            <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">Materi BiPINTAR</h2>
            <Link href="/app/bipintar" className="text-[12px] font-semibold text-[#1B9981] flex items-center gap-1 active:opacity-70">
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div
            className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {courses.length > 0 ? (
              courses.map(course => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  category={course.category || "Umum"}
                  duration={course.duration || "-"}
                  image={course.thumbnailUrl || "https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?q=80&w=500&auto=format&fit=crop"}
                />
              ))
            ) : (
              <p className="text-sm text-slate-400 px-1">Belum ada materi terbaru.</p>
            )}
          </div>
        </motion.div>

        {/* Info Komunitas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 mb-4"
        >
          <div className="flex items-center justify-between px-1 mb-4">
            <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">Info Komunitas</h2>
            <Link href="/app/komunitas" className="text-[12px] font-semibold text-[#1B9981] flex items-center gap-1 active:opacity-70">
              Lihat Semua Forum <Users className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3.5">
            {announcements.length > 0 ? (
              announcements.map(ann => (
                <CommunityCard
                  key={ann.id}
                  title={ann.title}
                  date={ann.createdAt ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(ann.createdAt.toDate ? ann.createdAt.toDate() : new Date(ann.createdAt)) : "-"}
                  participants={ann.category === "darurat" ? "Darurat" : ann.category === "penting" ? "Penting" : "Info"}
                />
              ))
            ) : (
              <p className="text-sm text-slate-400 px-1">Belum ada info komunitas.</p>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

function FeatureCard({ href, title, desc, icon, bg, buttonColor }: { href: string; title: string; desc: string; icon: React.ReactNode; bg: string; buttonColor: string }) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        href={href}
        className="block group -webkit-tap-highlight-color-transparent"
      >
        <div className="bg-white p-4 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:shadow-none hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] border border-slate-100 transition-all duration-300 ease-out active:scale-[0.98] flex items-center gap-4 relative overflow-hidden">

          <div className={`w-14 h-14 ${bg} rounded-[18px] flex items-center justify-center shrink-0`}>
            {icon}
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-[16px] mb-0.5 tracking-tight group-active:text-slate-600 transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 opacity-80">
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <p className="text-slate-500 text-[12px] font-medium tracking-wide">
                {desc}
              </p>
            </div>
          </div>

          <div className={`w-10 h-10 ${buttonColor} rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-active:scale-90`}>
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </div>

        </div>
      </Link>
    </motion.div>
  );
}

function CourseCard({ title, category, duration, image }: { title: string; category: string; duration: string; image: string }) {
  return (
    <Link href="/app/bipintar" className="snap-start shrink-0 w-[200px] block group -webkit-tap-highlight-color-transparent">
      <div className="bg-white rounded-[20px] p-2.5 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-all duration-300">
        <div className="w-full h-[120px] rounded-[14px] mb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-200" style={{ backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="w-10 h-10 text-white drop-shadow-md" />
          </div>
          <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg">
            <span className="text-[10px] font-bold text-white tracking-wider uppercase">{category}</span>
          </div>
        </div>
        <h3 className="font-bold text-slate-800 text-[14px] leading-tight mb-2 line-clamp-2 px-1">{title}</h3>
        <div className="flex items-center gap-1.5 text-slate-500 px-1 pb-1">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">{duration}</span>
        </div>
      </div>
    </Link>
  );
}

function CommunityCard({ title, date, participants }: { title: string; date: string; participants: string }) {
  return (
    <Link href="/app/komunitas" className="block group -webkit-tap-highlight-color-transparent">
      <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-all flex items-center gap-4">
        <div className="w-12 h-12 bg-sky-50 rounded-[14px] flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-sky-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-[15px] mb-1.5 leading-tight">{title}</h3>
          <div className="flex items-center gap-3 text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-medium">{date}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-[11px] font-medium">{participants}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1B9981] transition-colors" />
      </div>
    </Link>
  );
}