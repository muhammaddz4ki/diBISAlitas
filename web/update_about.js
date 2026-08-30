const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const aboutRegex = /function AboutProjectSection\(\) \{[\s\S]*?\}\n\n\/\* ============================================\n   BENTO FEATURES SECTION/m;

const newAboutSection = `function AboutProjectSection() {
  const { theme } = useTheme();
  
  // Spotlight effect state
  const containerRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setMousePosition({ x, y });
    
    // Also use for laptop tilt
    mouseX.set((x / width - 0.5) * 40);
    mouseY.set((y / height - 0.5) * 40);
  };

  // Laptop Tilt logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  
  // The base transform is rotateY(18deg) rotateX(5deg) rotateZ(-2deg)
  const rotateX = useTransform(springY, [-20, 20], [15, -5]);
  const rotateY = useTransform(springX, [-20, 20], [8, 28]);

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative py-0 overflow-visible bg-transparent text-slate-900 dark:text-white transition-colors duration-300 -mt-10 md:-mt-16 lg:-mt-20 z-40"
    >
      
      {/* Tall soft gradient to seamlessly blend hero into this section */}
      <div className="absolute top-[-6rem] md:top-[-10rem] left-0 w-full h-40 md:h-56 lg:h-72 bg-gradient-to-b from-transparent via-[#FDFEFE]/60 dark:via-black/60 to-[#FDFEFE] dark:to-black z-0 pointer-events-none transition-colors duration-300" />
      
      {/* Container */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-4 items-center min-h-[80vh]">
        
        {/* Left: 3D Laptop Mockup (Interactive) */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center lg:justify-start group"
          style={{ perspective: "1200px" }}
        >
          {/* Faint Glow Behind Laptop */}
          <div className="absolute w-[90%] h-[90%] bg-[#1B9981]/10 dark:bg-[#00D4AA]/15 blur-[100px] rounded-full top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
          
          {/* The 3D Laptop Frame */}
          <motion.div 
            className="relative w-full max-w-[720px]"
            style={{
              rotateX,
              rotateY,
              rotateZ: -2,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Screen Inner */}
            <div className="relative w-[92%] h-[85%] mx-auto mt-[4%] rounded-xl md:rounded-2xl lg:rounded-3xl bg-slate-900 border-[8px] md:border-[16px] border-slate-200 dark:border-[#2a2a2a] overflow-hidden shadow-2xl">
               {/* Reflection Glare */}
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none z-30" />
               <video
                 autoPlay
                 loop
                 muted
                 playsInline
                 className="w-full h-full object-cover rounded-md md:rounded-lg"
                 src="/video/dashboard.mp4"
               />
            </div>
            
            {/* Base / Keyboard part of the laptop */}
            <div className="w-full h-[10px] md:h-[20px] bg-slate-300 dark:bg-[#333] rounded-b-xl shadow-[-10px_20px_30px_rgba(0,0,0,0.3)] mt-[-1px] transform origin-top translate-y-1 relative">
               {/* Trackpad indentation */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[20%] h-full bg-slate-400/50 dark:bg-black/20 rounded-b-md" />
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Text Content with Spotlight Effect */}
        <motion.div 
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative max-w-xl mx-auto lg:mx-0 xl:ml-auto space-y-6 md:space-y-8"
        >
          {/* Spotlight Card */}
          <div className="relative p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-white/40 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden group">
            {/* Mouse Spotlight */}
            <div 
              className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100"
              style={{
                background: \`radial-gradient(400px circle at \${mousePosition.x - 500}px \${mousePosition.y}px, rgba(27,153,129,0.15), transparent 40%)\`
              }}
            />

            <div className="relative z-10 space-y-4">
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B9981]/10 text-[#1B9981] dark:text-[#00D4AA] font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-2">
                 <Cpu className="w-3.5 h-3.5" /> Misi Kami
               </span>
               <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] md:leading-[1.1] tracking-tight">
                 Teknologi Inklusif untuk Semua
               </h2>
               <div className="w-16 h-1.5 bg-[#1B9981] dark:bg-[#00D4AA] rounded-full my-6" />
               <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                 Membawa kemandirian harian dengan kecerdasan buatan, dirancang secara partisipatif bersama teman-teman disabilitas.
               </p>
               <p className="text-sm sm:text-base text-slate-500 dark:text-slate-500 leading-relaxed">
                 Sistem kami memadukan kemampuan AI On-Device untuk respons instan dalam situasi darurat, serta komputasi awan yang terpusat untuk analisis data berkesinambungan. Menciptakan ekosistem aman, mandiri, dan suportif.
               </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/* ============================================
   BENTO FEATURES SECTION`;

content = content.replace(aboutRegex, newAboutSection);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated AboutProjectSection with interactive animations.');
