const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const impactRegex = /function ImpactSection\(\) \{[\s\S]*?\}\n\n\/\* ============================================\n   SHOWCASE \/ LAPTOP MOCKUP SECTION/m;

const newImpactSection = `function ImpactSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = impactGalleryData[activeIndex];

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax for giant IMPACT text
  const textX = useTransform(scrollYProgress, [0, 1], ["-30%", "-70%"]);

  // Interactive Hover tilt for center card
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    mouseX.set((x / width - 0.5) * 30);
    mouseY.set((y / height - 0.5) * 30);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-15, 15], [10, -10]);
  const rotateY = useTransform(springX, [-15, 15], [-10, 10]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % impactGalleryData.length);
  };

  return (
    <section ref={sectionRef} id="dampak" className="scroll-mt-20 py-20 md:py-32 w-full bg-slate-50 dark:bg-black relative overflow-hidden flex flex-col items-center transition-colors duration-300">
      
      {/* Background Giant Text with Scroll Parallax */}
      <motion.div 
        style={{ x: textX }}
        className="absolute top-[30%] left-1/2 text-[15rem] md:text-[25rem] font-black text-slate-900/[0.03] dark:text-white/[0.02] tracking-tighter pointer-events-none select-none z-0 whitespace-nowrap transition-colors duration-300"
      >
        IMPACT IMPACT IMPACT
      </motion.div>
      
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-center leading-[1.15] md:leading-[1.1] tracking-tight text-slate-900 dark:text-white drop-shadow-md mb-4 md:mb-8 transition-colors duration-300">
          Dampak <span className={activeItem.accent}>Sosial</span> <br />
          & Inklusivitas
        </h2>

        {/* Carousel Area */}
        <div className="relative w-full h-[360px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex justify-center items-center px-4 md:px-0">
          
          <div 
            className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full"
            style={{ perspective: "2000px", transformStyle: "preserve-3d" }}
          >
            <AnimatePresence mode="wait">
              {/* Card -2 */}
              <motion.div 
                key={\`c-2-\${activeIndex}\`}
                initial={{ opacity: 0, rotateY: 0, z: -300, x: "300%" }}
                animate={{ opacity: 1, rotateY: 25, z: -150, x: 20 }}
                exit={{ opacity: 0, rotateY: 0, z: -300, x: "300%" }}
                transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
                className="order-1 hidden md:block w-[100px] lg:w-[140px] xl:w-[180px] h-[220px] lg:h-[300px] xl:h-[380px] rounded-xl lg:rounded-2xl overflow-hidden grayscale brightness-50 flex-shrink-0 relative"
              >
                <img src={activeItem.sideImgs[0]} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
              </motion.div>

              {/* Card -1 */}
              <motion.div 
                key={\`c-1-\${activeIndex}\`}
                initial={{ opacity: 0, rotateY: 0, z: -200, x: "150%" }}
                animate={{ opacity: 1, rotateY: 15, z: -80, x: 10 }}
                exit={{ opacity: 0, rotateY: 0, z: -200, x: "150%" }}
                transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
                className="order-2 w-[80px] sm:w-[120px] md:w-[150px] lg:w-[180px] xl:w-[240px] h-[220px] sm:h-[280px] md:h-[320px] lg:h-[400px] xl:h-[480px] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden grayscale brightness-75 flex-shrink-0 relative"
              >
                <img src={activeItem.sideImgs[1]} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
              </motion.div>

              {/* Card +1 */}
              <motion.div 
                key={\`c1-\${activeIndex}\`}
                initial={{ opacity: 0, rotateY: 0, z: -200, x: "-150%" }}
                animate={{ opacity: 1, rotateY: -15, z: -80, x: -10 }}
                exit={{ opacity: 0, rotateY: 0, z: -200, x: "-150%" }}
                transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
                className="order-4 w-[80px] sm:w-[120px] md:w-[150px] lg:w-[180px] xl:w-[240px] h-[220px] sm:h-[280px] md:h-[320px] lg:h-[400px] xl:h-[480px] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden grayscale brightness-75 flex-shrink-0 relative"
              >
                <img src={activeItem.sideImgs[2]} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
              </motion.div>

              {/* Card +2 */}
              <motion.div 
                key={\`c2-\${activeIndex}\`}
                initial={{ opacity: 0, rotateY: 0, z: -300, x: "-300%" }}
                animate={{ opacity: 1, rotateY: -25, z: -150, x: -20 }}
                exit={{ opacity: 0, rotateY: 0, z: -300, x: "-300%" }}
                transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
                className="order-5 hidden md:block w-[100px] lg:w-[140px] xl:w-[180px] h-[220px] lg:h-[300px] xl:h-[380px] rounded-xl lg:rounded-2xl overflow-hidden grayscale brightness-50 flex-shrink-0 relative"
              >
                <img src={activeItem.sideImgs[3]} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
              </motion.div>
            </AnimatePresence>

            {/* Center Card 0 (Interactive Hover Tilt) */}
            <motion.div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className={\`order-3 relative w-[240px] sm:w-[280px] md:w-[350px] lg:w-[400px] h-[340px] sm:h-[380px] md:h-[480px] lg:h-[550px] rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[3rem] p-3 md:p-5 flex flex-col \${activeItem.color} shadow-2xl z-20 flex-shrink-0 transform transition-colors duration-700\`}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={\`center-content-\${activeIndex}\`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex flex-col"
                  style={{ transform: "translateZ(30px)" }}
                >
                  {/* Image Top Half */}
                  <div className="w-full h-[50%] md:h-[55%] rounded-[1.25rem] md:rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden bg-black/20 relative group">
                    <motion.img 
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      src={activeItem.mainImg} alt={activeItem.title} className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>
                  
                  {/* Text Bottom Half */}
                  <div className="flex-1 mt-3 sm:mt-4 md:mt-6 px-1 sm:px-2 md:px-4 flex flex-col pointer-events-none">
                    <h3 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-1 sm:mb-2 md:mb-4">{activeItem.title}</h3>
                    <p className="text-white/90 text-[10px] sm:text-xs md:text-sm lg:text-[15px] leading-relaxed font-medium whitespace-pre-line line-clamp-3 sm:line-clamp-none">
                      {activeItem.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Next Button */}
              <button 
                onClick={nextSlide} 
                style={{ transform: "translateZ(60px)" }}
                className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 md:-bottom-8 md:-left-8 w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-30 group"
              >
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center items-center gap-3 mt-16 md:mt-24 z-20">
          {impactGalleryData.map((_, i) => (
            <button 
              key={i}
              onClick={() => setActiveIndex(i)}
              className={\`h-2 md:h-2.5 rounded-full transition-all duration-500 \${i === activeIndex ? \`w-10 md:w-16 \${activeItem.color}\` : 'w-2 md:w-2.5 bg-black/20 hover:bg-black/40 dark:bg-white/20 dark:hover:bg-white/40'}\`}
              aria-label={\`Go to slide \${i + 1}\`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   SHOWCASE / LAPTOP MOCKUP SECTION`;

content = content.replace(impactRegex, newImpactSection);

// Update ShowcaseSection
const showcaseRegex = /function ShowcaseSection\(\) \{[\s\S]*?\}\n\n\/\* ============================================\n   FOOTER/m;
const newShowcaseSection = `function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Scroll Parallax for Giant Text
  const textY1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const textY2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  // Interactive Parallax inside laptop screen based on mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const screenX = useTransform(mouseX, [-20, 20], [-15, 15]);
  const screenY = useTransform(mouseY, [-20, 20], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    mouseX.set((e.clientX / innerWidth - 0.5) * 40);
    mouseY.set((e.clientY / innerHeight - 0.5) * 40);
  };

  return (
    <section 
      ref={sectionRef} 
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-x-clip overflow-y-visible flex flex-col items-center justify-center pt-0 transition-colors duration-300"
    >
      
      {/* === BACKGROUND GIANT TEXT === */}
      {/* Right side vertical text */}
      <motion.div style={{ y: textY1 }} className="absolute top-1/2 right-[-2%] md:right-[2%] -translate-y-1/2 z-0 pointer-events-none select-none">
        <div className="flex flex-col items-end leading-[0.82] text-right">
          <span className="text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[18rem] font-black text-[#1B9981]/[0.05] dark:text-[#1B9981]/[0.12] tracking-tighter transition-colors duration-300" style={{ WebkitTextStroke: "1px rgba(27,153,129,0.08)" }}>di</span>
          <span className="text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[18rem] font-black text-[#1B9981]/[0.05] dark:text-[#1B9981]/[0.12] tracking-tighter transition-colors duration-300" style={{ WebkitTextStroke: "1px rgba(27,153,129,0.08)" }}>BI</span>
          <span className="text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[18rem] font-black text-[#1B9981]/[0.05] dark:text-[#1B9981]/[0.12] tracking-tighter transition-colors duration-300" style={{ WebkitTextStroke: "1px rgba(27,153,129,0.08)" }}>SA</span>
          <span className="text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[18rem] font-black text-[#1B9981]/[0.05] dark:text-[#1B9981]/[0.12] tracking-tighter transition-colors duration-300" style={{ WebkitTextStroke: "1px rgba(27,153,129,0.08)" }}>li</span>
          <span className="text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[18rem] font-black text-[#1B9981]/[0.05] dark:text-[#1B9981]/[0.12] tracking-tighter transition-colors duration-300" style={{ WebkitTextStroke: "1px rgba(27,153,129,0.08)" }}>tas</span>
        </div>
      </motion.div>

      {/* Left side vertical text */}
      <motion.div style={{ y: textY2 }} className="absolute top-[40%] left-[-2%] md:left-[2%] -translate-y-1/2 z-0 pointer-events-none select-none">
        <div className="flex flex-col items-start leading-[0.82] text-left">
          <span className="text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[18rem] font-black text-transparent tracking-tighter" style={{ WebkitTextStroke: "2px rgba(0,212,170,0.15)" }}>di</span>
          <span className="text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[18rem] font-black text-transparent tracking-tighter" style={{ WebkitTextStroke: "2px rgba(0,212,170,0.15)" }}>BI</span>
          <span className="text-[6rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[18rem] font-black text-transparent tracking-tighter" style={{ WebkitTextStroke: "2px rgba(0,212,170,0.15)" }}>SA</span>
        </div>
      </motion.div>
      
      {/* The Giant Mockup container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-0 flex flex-col items-center overflow-visible">
        
        {/* Glow behind laptop */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-[#1B9981]/20 dark:bg-[#00D4AA]/25 blur-[120px] rounded-full z-0 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 150, scale: 0.9, rotateX: 25 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[95%] sm:w-[90%] md:w-[85%] lg:w-[100%] mx-auto z-10 perspective-[1500px]"
          style={{ transformOrigin: "bottom center" }}
        >
          {/* Mockup Frame (MacBook style) */}
          <div className="relative w-full aspect-[16/10] bg-slate-900 border-[8px] sm:border-[12px] md:border-[20px] border-slate-200 dark:border-[#262626] rounded-t-2xl sm:rounded-t-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5 dark:ring-white/5 relative z-20">
            {/* Screen Inner Bezel */}
            <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center relative">
              {/* Webcam */}
              <div className="absolute top-2 md:top-3 left-1/2 -translate-x-1/2 w-2 h-2 md:w-3 md:h-3 rounded-full bg-slate-900 flex justify-center items-center z-40">
                <div className="w-[30%] h-[30%] rounded-full bg-blue-900/50" />
              </div>
              
              {/* Screen Content (Screenshot) with Interactive Parallax */}
              <motion.img 
                style={{ x: screenX, y: screenY, scale: 1.05 }} // scale up slightly so parallax doesn't show black edges
                src="/images/desktop-mockup.png" 
                alt="diBISAlitas Desktop Interface" 
                className="w-full h-full object-cover relative z-10"
              />

              {/* Screen Glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-30" />
            </div>
          </div>
          
          {/* Laptop Base */}
          <div className="w-[110%] -ml-[5%] h-[12px] sm:h-[18px] md:h-[28px] bg-gradient-to-b from-slate-300 to-slate-400 dark:from-[#3a3a3a] dark:to-[#1a1a1a] rounded-b-xl sm:rounded-b-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative z-30 flex justify-center">
            {/* Thumb indentation */}
            <div className="w-[15%] h-[40%] bg-black/10 dark:bg-black/40 rounded-b-md mt-0 shadow-inner" />
          </div>

          <div className="w-[100%] h-8 bg-black/20 dark:bg-black/60 blur-xl rounded-full absolute -bottom-4 z-10" />
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER`;

content = content.replace(showcaseRegex, newShowcaseSection);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated ImpactSection and ShowcaseSection with interactive animations.');
