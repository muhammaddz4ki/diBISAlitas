"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit, doc } from "firebase/firestore";
import Link from "next/link";
import { ShieldAlert, MessageCircle, BookOpen, Navigation, Bell, ChevronRight, PlayCircle, Clock, Users, Calendar, ArrowRight, Glasses, Info, Siren, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useAccessibility } from "@/lib/AccessibilityContext";

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
  const [userUid, setUserUid] = useState<string | null>(null);
  const [myScore, setMyScore] = useState<number>(0);
  const [topScore, setTopScore] = useState<number>(10000);
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
        setUserUid(user.uid);
      } else {
        router.push("/app/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!userEmail || !userUid) return;

    const qNotif = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(10));
    const unsubNotif = onSnapshot(qNotif, (snap) => {
      const data: any[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setNotifs(data);
    }, (error) => {
      console.error("Notif fetch error:", error);
    });

    const qCourses = query(collection(db, "bipintar_courses"), limit(3));
    const unsubCourses = onSnapshot(qCourses, (snap) => {
      const data: any[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setCourses(data);
    }, (error) => {
      console.error("Courses fetch error:", error);
    });

    const qAnnouncements = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(2));
    const unsubAnnouncements = onSnapshot(qAnnouncements, (snap) => {
      const data: any[] = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setAnnouncements(data);
    }, (error) => {
      console.error("Announcements fetch error:", error);
    });

    const docRef = doc(db, "quiz_scores", `${userUid}_hijaiyah`);
    const unsubScore = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setMyScore(docSnap.data().score || 0);
      } else {
        setMyScore(0);
      }
    });

    const qTopScore = query(collection(db, "quiz_scores"), orderBy("score", "desc"), limit(1));
    const unsubTopScore = onSnapshot(qTopScore, (snap) => {
      if (!snap.empty) {
        const highest = snap.docs[0].data().score;
        setTopScore(highest > 0 ? highest : 10000);
      }
    });

    return () => {
      unsubNotif();
      unsubCourses();
      unsubAnnouncements();
      unsubScore();
      unsubTopScore();
    };
  }, [userEmail, userUid]);

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
      className="relative min-h-full bg-[#f4f6fc] selection:bg-[#1B9981]/20 pb-24"
    >
      {/* Header — Sticky 3D Neumorphism */}
      <div className="sticky top-0 z-50 px-6 pt-14 pb-6 bg-[#f4f6fc]/95 backdrop-blur-xl border-b border-white shadow-3d rounded-b-[2rem] shrink-0 mb-4">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            {/* Avatar */}
            <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#00B894] to-[#00D4AA] flex items-center justify-center bubble-3d text-white">
              <span className="text-[20px] font-black text-white drop-shadow-md">{userEmail ? userEmail.charAt(0).toUpperCase() : "U"}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-500 text-[13px] font-semibold text-3d truncate">Selamat datang,</p>
              <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-tight truncate text-3d">
                {userEmail?.split('@')[0] || "Pengguna"}
              </h1>
              <div className="mt-3 flex flex-col gap-1.5 relative z-0 w-full max-w-[180px]">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 w-full">
                  <span className="uppercase tracking-wider truncate mr-2">Poin Tantangan</span>
                  <span className="text-[#1B9981] shrink-0">{myScore} <span className="text-slate-400">/ {topScore >= 1000 ? (topScore/1000).toFixed(1).replace('.0','') + 'k' : topScore}</span></span>
                </div>
                <div className="w-full h-[12px] bg-white rounded-full overflow-visible shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)] relative border border-slate-100">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00D4AA] to-[#1B9981] rounded-full shadow-[0_2px_5px_rgba(27,153,129,0.4)] transition-all duration-1000 ease-out min-w-[12px]" 
                    style={{ width: `${Math.min(100, Math.max(0, (myScore / topScore) * 100))}%` }} 
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white border-[3px] border-[#1B9981] rounded-full shadow-md transform translate-x-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Button */}
          <button
            onClick={openNotif}
            aria-label="Notifikasi"
            className="relative w-12 h-12 rounded-[20px] bg-transparent flex items-center justify-center shadow-3d shadow-3d-hover shadow-3d-active"
          >
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center shadow-[0_4px_10px_rgba(244,63,94,0.5)]">
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
              role="dialog"
              aria-label="Panel notifikasi"
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                <span className="font-bold text-[14px]">Notifikasi</span>
                <Link href="/app/komunitas" onClick={() => setShowNotif(false)} className="text-[12px] font-bold text-[#1B9981]">
                  Lihat semua
                </Link>
              </div>
              {notifs.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-[13px] font-medium">Belum ada notifikasi</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifs.map((n) => (
                    <Link
                      key={n.id}
                      href="/app/komunitas"
                      onClick={() => setShowNotif(false)}
                      className="flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <span className="mt-1 shrink-0 text-[12px]" aria-hidden="true">
                        {n.category === "darurat" ? "🔴" : n.category === "penting" ? "⚠️" : "ℹ️"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-800 line-clamp-1">{n.title || "Pengumuman"}</p>
                        <p className="text-[12px] text-slate-500 line-clamp-2 leading-snug">{n.content}</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">{formatNotifTime(n.createdAt)}</p>
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
            <h2 className="text-[17px] font-bold text-slate-800 tracking-tight text-3d">Layanan Utama</h2>
            <span className="text-[11px] font-bold text-[#1B9981] bg-transparent shadow-3d px-3 py-1.5 rounded-full tracking-wide">5 LAYANAN</span>
          </div>

          <FeatureCard
            href="/app/bisafe"
            title="BiSAFE"
            desc="Panic Button & Darurat"
            icon={<ShieldAlert className="w-[26px] h-[26px] text-white drop-shadow-md" strokeWidth={2.5} />}
            bg="bg-gradient-to-br from-rose-400 to-rose-600"
            buttonColor="text-rose-600 bg-rose-50 shadow-inner"
          />
          <FeatureCard
            href="/app/bisapa"
            title="BiSAPA"
            desc="Layanan Tatap Muka"
            icon={<MessageCircle className="w-[26px] h-[26px] text-white drop-shadow-md" strokeWidth={2.5} />}
            bg="bg-gradient-to-br from-sky-400 to-sky-600"
            buttonColor="text-sky-600 bg-sky-50 shadow-inner"
          />
          <FeatureCard
            href="/app/bipintar"
            title="BiPINTAR"
            desc="Platform E-Learning"
            icon={<BookOpen className="w-[26px] h-[26px] text-white drop-shadow-md" strokeWidth={2.5} />}
            bg="bg-gradient-to-br from-amber-400 to-amber-500"
            buttonColor="text-amber-600 bg-amber-50 shadow-inner"
          />
          <FeatureCard
            href="/app/bijalan"
            title="BiJALAN"
            desc="Navigasi Arah Jalan"
            icon={<Navigation className="w-[26px] h-[26px] text-white drop-shadow-md" strokeWidth={2.5} />}
            bg="bg-gradient-to-br from-[#1B9981] to-[#00D4AA]"
            buttonColor="text-[#1B9981] bg-[#1B9981]/10 shadow-inner"
          />
          <FeatureCard
            href="/app/bibaca"
            title="BiBACA"
            desc="Pemindai & Pembaca Teks"
            icon={<Glasses className="w-[26px] h-[26px] text-white drop-shadow-md" strokeWidth={2.5} />}
            bg="bg-gradient-to-br from-purple-400 to-purple-600"
            buttonColor="text-purple-600 bg-purple-50 shadow-inner"
          />
        </motion.div>

        {/* BiPINTAR - Materi Terbaru */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 mb-2"
        >
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-[17px] font-bold text-slate-800 tracking-tight text-3d">Materi BiPINTAR</h2>
            <Link href="/app/bipintar" className="text-[13px] font-bold text-[#1B9981] flex items-center gap-1 hover:gap-1.5 transition-all text-3d shadow-3d px-3 py-1 rounded-full">
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
              <p className="text-sm text-slate-500 px-1">Belum ada materi terbaru.</p>
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
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-[17px] font-bold text-slate-800 tracking-tight text-3d">Info Komunitas</h2>
            <Link href="/app/komunitas" className="text-[13px] font-bold text-[#1B9981] flex items-center gap-1 hover:gap-1.5 transition-all text-3d shadow-3d px-3 py-1 rounded-full">
              Lihat Semua Forum <Users className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3.5">
            {announcements.length > 0 ? (
              announcements.map(ann => (
                <CommunityCard
                  key={ann.id}
                  title={ann.title}
                  date={ann.createdAt ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(ann.createdAt.toDate ? ann.createdAt.toDate() : new Date(ann.createdAt)) : "-"}
                  category={ann.category === "darurat" ? "Darurat" : ann.category === "penting" ? "Penting" : "Info"}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500 px-1">Belum ada info komunitas.</p>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

function FeatureCard({ href, title, desc, icon, bg, buttonColor }: { href: string; title: string; desc: string; icon: React.ReactNode; bg: string; buttonColor: string }) {
  const colorfulMode = false;

  if (colorfulMode) {
    return (
      <motion.div variants={itemVariants}>
        <Link
          href={href}
          className="block group -webkit-tap-highlight-color-transparent"
        >
          <div className={`${bg} p-5 rounded-[28px] rounded-tr-[52px] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.3)] flex items-center gap-4 relative overflow-hidden group-hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.4)] group-active:scale-[0.98] transition-all duration-300`}>

            {/* Decorative glass shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="w-[54px] h-[54px] bg-white/20 backdrop-blur-md rounded-[20px] flex items-center justify-center shrink-0 border border-white/30 shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)] z-10 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50"></div>
              {icon}
            </div>

            <div className="flex-1 z-10">
              <h3 className="font-extrabold text-white text-[19px] mb-0.5 tracking-tight drop-shadow-md">
                {title}
              </h3>
              <div className="flex items-center gap-2 opacity-95">
                <p className="text-white/90 text-[13px] font-medium tracking-wide drop-shadow-sm">
                  {desc}
                </p>
              </div>
            </div>

            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-active:scale-90 border border-white/30 z-10 shrink-0 shadow-[inset_0_2px_8px_rgba(255,255,255,0.2)] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50"></div>
              <ChevronRight className="w-5 h-5 text-white drop-shadow-sm" strokeWidth={2.5} />
            </div>

          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants}>
      <Link
        href={href}
        className="block group -webkit-tap-highlight-color-transparent"
      >
        <div className="bg-transparent p-4 rounded-[24px] shadow-3d shadow-3d-hover shadow-3d-active flex items-center gap-4 relative overflow-hidden">

          <div className={`w-14 h-14 ${bg} rounded-[18px] flex items-center justify-center shrink-0 icon-3d`}>
            {icon}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-[16px] mb-0.5 tracking-tight group-active:text-slate-600 transition-colors truncate">
              {title}
            </h3>
            <div className="flex items-center gap-2 opacity-80">
              <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
              <p className="text-slate-500 text-[12px] font-medium tracking-wide truncate">
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
      <div className="bg-transparent rounded-[20px] p-2.5 shadow-3d shadow-3d-hover shadow-3d-active">
        <div className="w-full h-[120px] rounded-[14px] mb-3 relative overflow-hidden icon-3d">
          <div className="absolute inset-0 bg-slate-200" style={{ backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="w-12 h-12 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
        <div className="px-1 mb-2">
          <span className="inline-block px-2 py-0.5 bg-[#f4f6fc] border border-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),_inset_-2px_-2px_4px_rgba(255,255,255,1)] text-[#1B9981] text-[9px] font-extrabold rounded-md uppercase tracking-wider">
            {category}
          </span>
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

function CommunityCard({ title, date, category }: { title: string; date: string; category: string }) {
  let icon = <Info className="w-5 h-5 text-white drop-shadow-md" />;
  let bgGradient = "bg-gradient-to-br from-sky-400 to-sky-600";
  
  if (category === "Darurat") {
    icon = <Siren className="w-5 h-5 text-white drop-shadow-md" />;
    bgGradient = "bg-gradient-to-br from-rose-400 to-rose-600";
  } else if (category === "Penting") {
    icon = <AlertTriangle className="w-5 h-5 text-white drop-shadow-md" />;
    bgGradient = "bg-gradient-to-br from-amber-400 to-amber-600";
  }

  return (
    <Link href="/app/komunitas" className="block group -webkit-tap-highlight-color-transparent">
      <div className="bg-transparent p-4 rounded-[24px] shadow-3d shadow-3d-hover shadow-3d-active border border-white flex items-center gap-4 transition-all">
        <div className={`w-14 h-14 ${bgGradient} rounded-[16px] flex items-center justify-center shrink-0 bubble-3d border-none text-white`}>
          {icon}
        </div>
        <div className="flex-1 py-0.5 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider text-3d ${category === "Darurat" ? "text-rose-500" : category === "Penting" ? "text-amber-500" : "text-sky-500"}`}>
              {category}
            </span>
          </div>
          <h3 className="font-bold text-slate-800 text-[15px] mb-1.5 leading-tight line-clamp-1 group-active:text-slate-600 transition-colors text-3d">{title}</h3>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold text-3d">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="w-8 h-8 rounded-full shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),_inset_-2px_-2px_6px_rgba(255,255,255,1)] flex items-center justify-center group-hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),_-2px_-2px_6px_rgba(255,255,255,1)] transition-all">
            <ChevronRight className="w-4 h-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
}