import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "diBISAlitas – Ekosistem Aksesibilitas Cerdas Berbasis AI",
  description:
    "Platform revolusioner yang mengintegrasikan kecerdasan buatan untuk memberikan kemandirian penuh bagi penyandang disabilitas di Indonesia.",
  keywords:
    "diBISAlitas, aksesibilitas, disabilitas, AI, tunanetra, tunarungu, tunadaksa, Indonesia",
  openGraph: {
    title: "diBISAlitas – Ekosistem Aksesibilitas Cerdas",
    description:
      "Menghancurkan Batasan, Membangun Kesetaraan. Platform AI untuk aksesibilitas Indonesia.",
    type: "website",
  },
};

import { ThemeProvider } from "@/lib/ThemeContext";
import FloatingAccessibility from "@/components/FloatingAccessibility";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${jakarta.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#ffffff] dark:bg-black text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider>
          <div className="a11y-content-wrapper flex-1 flex flex-col">
            {children}
          </div>
          <FloatingAccessibility />
        </ThemeProvider>
      </body>
    </html>
  );
}
