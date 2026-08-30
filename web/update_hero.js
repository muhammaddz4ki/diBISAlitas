const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add MagneticButton component before HeroSection
const magneticButtonCode = `
/* ============================================
   MAGNETIC BUTTON COMPONENT
============================================ */
function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   HERO SECTION
============================================ */`;

content = content.replace('/* ============================================\n   HERO SECTION\n============================================ */', magneticButtonCode);

// 2. Refactor HeroSection
// Find the old HeroSection block and replace it
const heroRegex = /function HeroSection\(\) \{[\s\S]*?\}\n\n\/\* ============================================\n   ABOUT PROJECT SECTION/m;

const newHeroSection = `function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * 40);
    mouseY.set((clientY / innerHeight - 0.5) * 40);
  };

  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  
  const bgX = useTransform(springX, (v) => v * 1.5);
  const bgY = useTransform(springY, (v) => v * 1.5);
  const imgX = useTransform(springX, (v) => v * -1.5);
  const imgY = useTransform(springY, (v) => v * -1.5);

  // 3D Tilt properties based on mouse
  const rotateX = useTransform(springY, [-20, 20], [8, -8]);
  const rotateY = useTransform(springX, [-20, 20], [-8, 8]);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-32 flex flex-col items-center justify-start md:justify-center overflow-hidden text-slate-900 dark:text-white transition-colors duration-300 perspective-[1000px]"
    >
      {/* Background Glow Elements */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute top-[50%] md:top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[900px] md:h-[900px] bg-[#1B9981]/20 dark:bg-[#1B9981]/30 blur-[120px] md:blur-[180px] rounded-full pointer-events-none" />
      <motion.div style={{ x: bgX, y: bgY }} className="absolute top-[50%] md:top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[#00D4AA]/30 dark:bg-[#00D4AA]/40 blur-[90px] md:blur-[140px] rounded-full pointer-events-none" />
      
      {/* Interactive Floating Particles */}
      <motion.div style={{ x: useTransform(springX, v => v * 2), y: useTransform(springY, v => v * 3) }} className="absolute top-[30%] left-[20%] w-4 h-4 rounded-full bg-[#00D4AA]/40 blur-[2px] pointer-events-none" />
      <motion.div style={{ x: useTransform(springX, v => v * -3), y: useTransform(springY, v => v * -2) }} className="absolute top-[60%] right-[25%] w-6 h-6 rounded-full bg-[#1B9981]/50 blur-[3px] pointer-events-none" />
      <motion.div style={{ x: useTransform(springX, v => v * 4), y: useTransform(springY, v => v * -4) }} className="absolute bottom-[20%] left-[30%] w-3 h-3 rounded-full bg-teal-300/40 blur-[1px] pointer-events-none" />

      {/* Giant faint background text */}
      <div className="absolute top-[40%] md:top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03] dark:opacity-[0.05] flex flex-col justify-center items-center z-0">
         <span className="text-[12rem] md:text-[22rem] font-black leading-none tracking-tighter text-[#1B9981] dark:text-[#00D4AA]">diBISA</span>
         <span className="text-[12rem] md:text-[22rem] font-black leading-none tracking-tighter text-[#1B9981] dark:text-[#00D4AA]">litas</span>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center mt-12 md:mt-0">
        {/* Top Logo / Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center justify-center font-bold tracking-[0.3em] text-xs sm:text-sm text-slate-500 dark:text-white/80 uppercase"
        >
          di<span className="text-[#1B9981] dark:text-[#00D4AA] mx-1">BISA</span>litas
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.1] tracking-tight max-w-5xl mx-auto mb-6"
        >
          Aksesibilitas <span className="text-[#1B9981] dark:text-[#00D4AA]">Cerdas</span>, Kemandirian Tanpa Batas.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="text-slate-600 dark:text-white/60 text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-8 leading-relaxed font-normal"
        >
          Satu ekosistem berbasis kecerdasan buatan on-device dan integrasi Cloud untuk menghadirkan kemandirian penuh bagi Tunanetra, Tunarungu, dan Tunadaksa di Indonesia.
        </motion.p>

        {/* Action Buttons with Magnetic Effect */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6, duration: 0.6 }}
           className="flex flex-wrap items-center justify-center gap-4 mb-4 md:mb-8 relative z-20 pointer-events-auto"
        >
           <MagneticButton>
             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
               <Link
                 href="/demo"
                 className="px-8 py-4 rounded-full bg-[#1B9981] text-white font-bold text-sm hover:bg-[#168C74] transition-colors shadow-[0_0_20px_rgba(27,153,129,0.3)] hover:shadow-[0_0_30px_rgba(27,153,129,0.5)] flex items-center gap-2"
               >
                 <Zap className="w-4 h-4 fill-current text-white" />
                 Coba Demo Gratis
               </Link>
             </motion.div>
           </MagneticButton>
           <MagneticButton>
             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
               <Link
                 href="#fitur"
                 className="px-8 py-4 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-colors backdrop-blur-md flex items-center gap-2"
               >
                 Jelajahi Fitur
               </Link>
             </motion.div>
           </MagneticButton>
        </motion.div>

        {/* Hero Image Group with 3D Parallax Tilt */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
           className="relative w-full max-w-7xl mx-auto flex justify-center mt-[-3rem] md:mt-[-5rem] lg:mt-[-8rem] z-30 pointer-events-none px-2 sm:px-6"
           style={{ perspective: 1200 }}
        >
          {/* Faux Fabric effects behind image */}
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-gradient-to-r from-[#1B9981] to-[#00D4AA] blur-[80px] opacity-10 dark:opacity-20 transform -rotate-12 rounded-[100%]" />
          <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-gradient-to-l from-[#1B9981] to-[#00D4AA] blur-[80px] opacity-10 dark:opacity-20 transform rotate-12 rounded-[100%]" />
          
          <motion.div
            style={{ x: imgX, y: imgY, rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative z-10 w-full flex justify-center"
          >
            <motion.img 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              src="/images/hero-transparent.png" 
              alt="diBISAlitas Users" 
              className="w-full h-auto object-contain max-h-[65vh] md:max-h-[80vh] lg:max-h-[90vh] xl:max-h-none xl:max-w-[115%] drop-shadow-[0_30px_60px_rgba(27,153,129,0.2)] dark:drop-shadow-[0_30px_60px_rgba(27,153,129,0.3)]"
            />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Overlay gradient at bottom to fade into next section and hide image crop */}
      <div className="absolute bottom-[-2px] left-0 w-full h-48 md:h-72 lg:h-[24rem] bg-gradient-to-t from-[#FDFEFE] via-[#FDFEFE]/90 dark:from-black dark:via-black/90 to-transparent z-30 pointer-events-none transition-colors duration-300" />
    </section>
  );
}

/* ============================================
   ABOUT PROJECT SECTION`;

content = content.replace(heroRegex, newHeroSection);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated HeroSection with interactive animations.');
