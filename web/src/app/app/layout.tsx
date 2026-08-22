"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ShieldAlert, MapPin, User } from "lucide-react";
import { TalkbackProvider } from "@/lib/TalkbackContext";
import { AccessibilityProvider } from "@/lib/AccessibilityContext";
import VoiceCommand from "@/components/VoiceCommand";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide bottom navigation on login and register pages
  const isAuthPage = pathname === "/app/login" || pathname === "/app/register";

  return (
    <TalkbackProvider>
      <AccessibilityProvider>
      <div className="min-h-screen bg-[#F9FAFB] sm:py-8 flex items-center justify-center font-sans text-slate-800 selection:bg-[#00B894]/20">
        <div className="w-full max-w-[450px] h-[100dvh] sm:h-[850px] bg-white sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden relative flex flex-col">

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto pb-28 relative scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {children}
          </main>

          {/* Bottom Navigation Bar */}
          {!isAuthPage && (
            <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-2xl border-t border-slate-200/60 pt-3 pb-7 sm:pb-4 px-4 flex justify-between items-end z-50">
              {/* 1. Beranda */}
              <NavItem
                href="/app/dashboard"
                icon={<Home className="w-[24px] h-[24px]" strokeWidth={pathname === "/app/dashboard" ? 2.5 : 2} />}
                label="Beranda"
                isActive={pathname === "/app/dashboard"}
              />

              {/* 2. Komunitas */}
              <NavItem
                href="/app/komunitas"
                icon={<Users className="w-[24px] h-[24px]" strokeWidth={pathname === "/app/komunitas" ? 2.5 : 2} />}
                label="Komunitas"
                isActive={pathname === "/app/komunitas"}
              />

              {/* 3. BiSAFE FAB — Center, Raised Red Button */}
              <FABItem href="/app/bisafe" isActive={pathname === "/app/bisafe"} />

              {/* 4. Peta */}
              <NavItem
                href="/app/peta"
                icon={<MapPin className="w-[24px] h-[24px]" strokeWidth={pathname === "/app/peta" ? 2.5 : 2} />}
                label="Peta"
                isActive={pathname === "/app/peta"}
              />

              {/* 5. Profil */}
              <NavItem
                href="/app/profile"
                icon={<User className="w-[24px] h-[24px]" strokeWidth={pathname === "/app/profile" ? 2.5 : 2} />}
                label="Profil"
                isActive={pathname === "/app/profile"}
              />
            </div>
          )}

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
      className="flex flex-col items-center gap-1.5 w-14 group"
    >
      <div className={`
        relative flex items-center justify-center transition-all duration-300 ease-out
        ${isActive ? "text-[#00B894] scale-110 -translate-y-0.5" : "text-slate-400 group-active:scale-90 group-hover:text-slate-500"}
      `}>
        {icon}
        {/* Active dot indicator */}
        <span className={`absolute -bottom-2.5 w-1 h-1 rounded-full bg-[#00B894] transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
      </div>
      <span className={`
        text-[10px] tracking-tight transition-all duration-300
        ${isActive ? "font-bold text-[#00B894]" : "font-medium text-slate-400"}
      `}>
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
      className="relative flex flex-col items-center -mt-8 group"
    >
      {/* Pulsing ring animation */}
      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-rose-400/30 animate-ping" />

      {/* The FAB button */}
      <div className={`
        relative w-14 h-14 rounded-full flex items-center justify-center
        shadow-[0_6px_24px_rgba(239,68,68,0.4)] transition-all duration-200 group-active:scale-90
        ${isActive ? "bg-rose-600 scale-105" : "bg-rose-500"}
      `}>
        <ShieldAlert className="w-7 h-7 text-white" strokeWidth={2} />
      </div>

      {/* Label */}
      <span className={`
        mt-1.5 text-[10px] font-bold tracking-tight transition-all duration-300
        ${isActive ? "text-rose-600" : "text-rose-400"}
      `}>
        BiSAFE
      </span>
    </Link>
  );
}