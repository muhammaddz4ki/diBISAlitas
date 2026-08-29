"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MobileMockupSection() {
  return (
    <section className="relative w-full h-[120vh] md:h-[150vh] bg-[#FDFEFE] dark:bg-[#050505] overflow-hidden flex flex-col justify-center transition-colors duration-300">
      
      {/* Text Content */}
      <div className="absolute top-16 md:top-32 right-6 md:right-16 lg:right-24 z-30 max-w-xs sm:max-w-sm lg:max-w-md pointer-events-none">
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] md:text-xs font-bold text-slate-500 tracking-[0.2em] uppercase mb-2 md:mb-4">
            Aksesibilitas dalam Genggaman
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1]">
            Pengalaman <span className="text-[#1B9981] dark:text-[#00D4AA] block mt-1 md:mt-2">Mobile</span>
          </h2>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-[0.65] sm:scale-75 md:scale-100 lg:scale-100 translate-y-12 md:translate-y-0" style={{ perspective: "1500px" }}>
        
        {/* Tilted Plane */}
        <div 
          className="relative flex gap-6 md:gap-12"
          style={{
            transform: "rotateX(55deg) rotateZ(-35deg)",
            transformStyle: "preserve-3d",
          }}
        >
          
          {/* Track 1 (Scrolling Up) */}
          <motion.div 
            className="flex flex-col gap-6 md:gap-12 pb-6 md:pb-12"
            animate={{ y: [0, "-50%"] }}
            transition={{ duration: 75, ease: "linear", repeat: Infinity }}
            style={{ marginTop: "-20%" }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, idx) => (
              <PhoneMockup key={`t1-${idx}`} id={item.toString()} />
            ))}
          </motion.div>

          {/* Track 2 (Scrolling Up, different speed) */}
          <motion.div 
            className="flex flex-col gap-6 md:gap-12 pb-6 md:pb-12"
            animate={{ y: [0, "-50%"] }}
            transition={{ duration: 90, ease: "linear", repeat: Infinity }}
            style={{ marginTop: "10%" }}
          >
            {[9, 8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((item, idx) => (
              <PhoneMockup key={`t2-${idx}`} id={item.toString()} />
            ))}
          </motion.div>

          {/* Track 3 (Scrolling Up) */}
          <motion.div 
            className="flex flex-col gap-6 md:gap-12 pb-6 md:pb-12"
            animate={{ y: [0, "-50%"] }}
            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            style={{ marginTop: "-30%" }}
          >
            {[4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3].map((item, idx) => (
              <PhoneMockup key={`t3-${idx}`} id={item.toString()} />
            ))}
          </motion.div>

        </div>
      </div>

      {/* Gradients to fade out the top and bottom of the scrolling section */}
      <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-[#FDFEFE] to-transparent dark:from-[#050505] pointer-events-none z-40 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-[#FDFEFE] to-transparent dark:from-[#050505] pointer-events-none z-40 transition-colors duration-300" />
    </section>
  );
}

function PhoneMockup({ id }: { id: string }) {
  return (
    <div className="relative w-[200px] h-[430px] md:w-[260px] md:h-[560px] bg-white dark:bg-[#111111] rounded-[2.5rem] md:rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex-shrink-0 overflow-hidden border-[8px] md:border-[12px] border-slate-200 dark:border-[#222]">
      
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] md:w-[120px] h-[20px] md:h-[28px] bg-slate-200 dark:bg-[#222] rounded-b-[12px] md:rounded-b-[16px] z-20" />
      
      {/* Screen Content Placeholder */}
      <div className="relative w-full h-full bg-slate-100 dark:bg-[#0a0a0a] overflow-hidden rounded-[1.8rem] md:rounded-[2.2rem]">
        {/* Placeholder Glow */}
        <div className="absolute top-[20%] left-[20%] w-[100px] h-[100px] bg-[#1B9981]/20 blur-3xl rounded-full" />
        
        {/* Replace this img src with actual screenshot paths later */}
        <img 
          src={`/images/mobile-mockup-${id}.png`} 
          alt={`Mobile Mockup ${id}`}
          className="w-full h-full object-cover relative z-10"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Fallback text if image not found */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-600 font-bold text-xl z-0">
          Mobile {id}
        </div>
      </div>
    </div>
  );
}
