"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ShieldAlert, MapPin, User } from "lucide-react";
import { TalkbackProvider } from "@/lib/TalkbackContext";
import { AccessibilityProvider } from "@/lib/AccessibilityContext";
import VoiceCommand from "@/components/VoiceCommand";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide bottom navigation on login, register, and onboarding (panduan) pages
  const isAuthPage = pathname === "/app/login" || pathname === "/app/register" || pathname === "/app/panduan";

  return (
    <TalkbackProvider>
      <AccessibilityProvider>
      <div className="min-h-screen bg-[#F9FAFB] sm:py-8 flex items-center justify-center font-sans text-slate-800 selection:bg-[#00B894]/20">
        <div className="w-full max-w-[450px] h-[100dvh] sm:h-[850px] bg-[#f4f6fc] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative flex flex-col">

          {/* Skip to content — hanya tampil saat di-focus via keyboard */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#1B9981] focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-bold focus:text-sm focus:shadow-lg"
          >
            Loncat ke konten utama
          </a>

          {/* Wrapper for Z-Axis Push Back Animation */}
          <div id="app-wrapper" className="w-full h-full flex flex-col relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top bg-inherit">
            {/* Main Content Area */}
            <main id="main-content" className={`flex-1 overflow-y-auto relative scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${isAuthPage ? "bg-white" : "bg-[#f4f6fc] pb-28"}`}>
              {children}
            </main>

          {/* Bottom Navigation Bar */}
          {!isAuthPage && (() => {
            // Tentukan active index untuk posisi bola melayang
            const getActiveIndex = () => {
              if (pathname.includes("/dashboard")) return 0;
              if (pathname.includes("/komunitas")) return 1;
              if (pathname.includes("/bisafe")) return 2;
              if (pathname.includes("/peta")) return 3;
              if (pathname.includes("/profile")) return 4;
              return -1; // -1 jika di halaman lain yang bukan bagian dari menu bawah
            };
            const activeIndex = getActiveIndex();
            // Posisi visual lubang dan bola (jika -1, sembunyikan di posisi tengah / BiSAFE)
            const visualIndex = activeIndex === -1 ? 2 : activeIndex;

            return (
              <nav className="absolute bottom-0 w-full pt-3 pb-7 sm:pb-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]" role="navigation" aria-label="Menu utama">
                
                {/* Latar Putih Navbar & Lubang Transparan Asli (The flawless geometry trick) */}
                <div className="absolute inset-0 overflow-hidden z-[-1] pointer-events-none rounded-t-[0px]">
                  <div 
                    className="absolute top-[-34px] w-[68px] h-[68px] bg-transparent rounded-full z-0"
                    style={{ 
                      left: `calc(10% + 20% * ${visualIndex})`, 
                      transform: 'translateX(-50%)',
                      transition: 'left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      boxShadow: '0 34px 0 2000px #ffffff' /* Menggambar latar navbar putih dengan presisi Y=0 */
                    }}
                  >
                    {/* Sayap Lengkung Kiri */}
                    <div 
                      className="absolute top-[34px] left-[-24px] w-[24px] h-[24px] bg-transparent"
                      style={{ background: 'radial-gradient(circle at top right, transparent 23.5px, #ffffff 24px)' }}
                    />
                    {/* Sayap Lengkung Kanan */}
                    <div 
                      className="absolute top-[34px] right-[-24px] w-[24px] h-[24px] bg-transparent"
                      style={{ background: 'radial-gradient(circle at top left, transparent 23.5px, #ffffff 24px)' }}
                    />
                  </div>
                </div>

                {/* Bola Hijau Melayang */}
                <div 
                  className="absolute top-[-26px] w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#1B9981] to-[#00D4AA] shadow-[0_4px_12px_rgba(0,184,148,0.4)] z-0 pointer-events-none"
                  style={{ 
                    left: `calc(10% + 20% * ${visualIndex})`, 
                    transform: 'translateX(-50%)',
                    transition: 'left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s',
                    opacity: (activeIndex === 2 || activeIndex === -1) ? 0 : 1 /* Sembunyikan bola hijau saat di BiSAFE atau di luar menu */
                  }}
                />

                {/* Kontainer Menu (Grid) */}
                <div className="relative z-10 w-full grid grid-cols-5 items-end justify-items-center">
                  <NavItem href="/app/dashboard" icon={<Home className="w-6 h-6" />} label="Beranda" isActive={activeIndex === 0} />
                  <NavItem href="/app/komunitas" icon={<Users className="w-6 h-6" />} label="Komunitas" isActive={activeIndex === 1} />
                  <FABItem href="/app/bisafe" isActive={activeIndex === 2} />
                  <NavItem href="/app/peta" icon={<MapPin className="w-6 h-6" />} label="Peta" isActive={activeIndex === 3} />
                  <NavItem href="/app/profile" icon={<User className="w-6 h-6" />} label="Profil" isActive={activeIndex === 4} />
                </div>
              </nav>
            );
          })()}
          </div>

          {/* Perintah suara global (Tunanetra) */}
          <VoiceCommand />
        </div>
      </div>
      </AccessibilityProvider>
    </TalkbackProvider>
  );
}

/** Regular bottom nav tab */
function NavItem({ href, icon, label, isActive }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex flex-col items-center gap-1.5 w-14 group relative cursor-pointer"
    >
      <div className={`
        relative flex items-center justify-center z-20 h-6 w-full
        ${isActive ? "-translate-y-[26px]" : "text-slate-500 group-active:scale-90 group-hover:text-slate-600"}
      `} style={{ 
        transition: isActive 
          ? 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s, color 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s' 
          : 'transform 0.25s ease-out 0s, color 0.25s ease-out 0s' 
      }}>
        {isActive ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-[22px] h-[22px] text-white drop-shadow-md transition-all duration-300", strokeWidth: 2.5 }) : React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6 transition-all duration-300", strokeWidth: 2 })}
      </div>
      <span className={`
        text-[10px] tracking-tight z-20 mt-0.5
        ${isActive ? "font-bold text-[#1B9981]" : "font-medium text-slate-500"}
      `} style={{
        transition: isActive 
          ? 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s' 
          : 'all 0.25s ease-out 0s'
      }}>
        {label}
      </span>
    </Link>
  );
}

/** BiSAFE Floating Action Button — red, raised, pulsing ring */
function FABItem({ href, isActive }: { href: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      aria-label="BiSAFE - Panic Button Darurat"
      className="relative flex flex-col items-center justify-end h-full w-14 group pt-2"
    >
      <div className="absolute bottom-[20px] flex flex-col items-center group-active:scale-95 transition-transform">
        {/* Pulsing ring animation */}
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-rose-400/30 animate-ping" />

        {/* The FAB button */}
        <div className={`
          relative w-14 h-14 rounded-full flex items-center justify-center icon-3d shadow-3d shadow-3d-active transition-all duration-200
          ${isActive ? "bg-gradient-to-br from-rose-500 to-rose-700" : "bg-gradient-to-br from-rose-400 to-rose-600"}
        `}>
          <ShieldAlert className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2.5} />
        </div>
      </div>

      {/* Label */}
      <span className={`
        text-[10px] font-bold tracking-tight transition-all duration-300 z-20 mt-0.5
        ${isActive ? "text-rose-600" : "text-rose-400"}
      `}>
        BiSAFE
      </span>
    </Link>
  );
}