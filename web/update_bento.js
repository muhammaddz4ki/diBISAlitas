const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const bentoRegex = /function BentoFeaturesSection\(\) \{[\s\S]*?\}\n\n\/\* ============================================\n   CTA \& STATS SECTION/m;

const newBentoSection = `function BentoFeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const activePillar = pillars[activeIndex];
  const ActiveIcon = activePillar.icon;

  // 3D Tilt for Main Card
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    mouseX.set((x / width - 0.5) * 20); // Tilt amount
    mouseY.set((y / height - 0.5) * 20);
  };
  
  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-10, 10], [5, -5]);
  const rotateY = useTransform(springX, [-10, 10], [-5, 5]);

  // Mouse Position for Spotlights on Buttons
  const [buttonMousePos, setButtonMousePos] = useState({ x: 0, y: 0 });
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  
  const handleButtonsMouseMove = (e: React.MouseEvent) => {
    if (!buttonsContainerRef.current) return;
    const { left, top } = buttonsContainerRef.current.getBoundingClientRect();
    setButtonMousePos({ x: e.clientX - left, y: e.clientY - top });
  };

  // Bulletproof step sizes based on Tailwind classes
  const desktopStep = 142;
  const mobileStep = 108;

  const targetX = -activeIndex * desktopStep + 229;
  const clampedX = Math.min(0, targetX);

  const targetY = -activeIndex * mobileStep + 96;
  const clampedY = Math.min(0, targetY);

  const handleDragEndDesktop = (e: any, info: any) => {
    if (info.offset.x < -50 || info.velocity.x < -500) {
      setActiveIndex(Math.min(activeIndex + 1, pillars.length - 1));
    } else if (info.offset.x > 50 || info.velocity.x > 500) {
      setActiveIndex(Math.max(activeIndex - 1, 0));
    }
  };

  const handleDragEndMobile = (e: any, info: any) => {
    if (info.offset.y < -50 || info.velocity.y < -500) {
      setActiveIndex(Math.min(activeIndex + 1, pillars.length - 1));
    } else if (info.offset.y > 50 || info.velocity.y > 500) {
      setActiveIndex(Math.max(activeIndex - 1, 0));
    }
  };

  return (
    <section id="fitur" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center max-w-2xl mx-auto space-y-4 mb-10"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1B9981]/10 text-[#1B9981] dark:text-[#00D4AA] font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" /> 6 Pilar Ekosistem
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.15] md:leading-[1.1] tracking-tight text-slate-900 dark:text-white">
            Fitur Cerdas Tanpa Batas
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Menghadirkan teknologi kecerdasan buatan terdepan yang dirancang khusus untuk memfasilitasi kemandirian penyandang disabilitas dalam kehidupan sehari-hari.
          </p>
        </motion.div>

        {/* === MAIN BENTO GRID === */}
        <LayoutGroup>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-8 lg:gap-10 perspective-[2000px]">

          {/* ──── MOBILE TOP ROW: Big Card + Vertical Selector ──── */}
          <div className="flex flex-row gap-2 sm:gap-4 w-full h-[280px] sm:h-[340px] lg:h-auto perspective-[1200px]">
            
            {/* ──── LEFT: Large Gradient Card (Interactive 3D Hover) ──── */}
            <motion.div 
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative flex-1 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)] h-full lg:min-h-[480px] group transition-transform duration-200"
            >
              {/* Shared layout gradient background */}
              <motion.div
                layoutId="pillarGradient"
                className={\`absolute inset-0 bg-gradient-to-br \${activePillar.gradient}\`}
                transition={{ type: "spring", stiffness: 200, damping: 28, mass: 0.8 }}
              />

              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full pointer-events-none" />

              {/* Label top-left */}
              <motion.div style={{ transform: "translateZ(30px)" }} className="absolute top-5 left-5 md:top-7 md:left-7 z-20">
                <span className={\`text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] \${activePillar.accent}\`}>
                  Pilar {activePillar.number} / 06
                </span>
              </motion.div>

              {/* 3D Phone and Glass Cards Container */}
              <div className="absolute inset-0 z-10 flex flex-row items-center justify-between gap-2 sm:gap-6 px-3 pr-4 sm:px-8 md:px-12 pointer-events-none">
                
                {/* 3D Tilted Phone Video Mockup */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePillar.key + "-video"}
                    initial={{ opacity: 0, x: -30, rotateY: 25, rotateX: 10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, rotateY: 12, rotateX: 4, scale: 1 }}
                    exit={{ opacity: 0, x: -20, rotateY: -10, rotateX: 15, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    className="relative shrink-0 w-[135px] h-[310px] sm:w-[200px] sm:h-[450px] md:w-[250px] md:h-[520px] lg:w-[240px] lg:h-[490px] rounded-[1rem] sm:rounded-[1.75rem] bg-black border-[4px] md:border-[10px] border-[#1f2022] shadow-[25px_25px_50px_rgba(0,0,0,0.5),-10px_-10px_30px_rgba(255,255,255,0.1)_inset,0_0_0_1px_rgba(255,255,255,0.15)] overflow-hidden ring-1 ring-black/50 translate-y-16 sm:translate-y-32 md:translate-y-36 lg:translate-y-32 -translate-x-1 sm:translate-x-0"
                    style={{ transformPerspective: 1200, transform: "translateZ(50px)" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.25] pointer-events-none z-30 mix-blend-overlay" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[12px] md:h-[24px] bg-[#1f2022] rounded-b-xl md:rounded-b-[18px] z-20 flex justify-center items-center">
                      <div className="w-[30%] h-[2px] md:h-[4px] bg-black/50 rounded-full mt-1" />
                    </div>
                    
                    <video
                      key={activePillar.video}
                      src={\`/video/\${activePillar.video}\`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover rounded-[1.2rem] md:rounded-[2rem]"
                    />
                    
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="absolute -right-2 sm:-right-3 md:-right-6 bottom-4 md:bottom-10 w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center z-30"
                    >
                      <ActiveIcon className="w-4 h-4 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* 2 Glass Cards stacked */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePillar.key + "-glass"}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                    className="relative flex-1 flex flex-col gap-1.5 sm:gap-4 max-w-[110px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[260px]"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {/* Glass card 1 */}
                    <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-6 flex flex-col justify-center">
                      <h4 className="text-white font-black text-[10px] sm:text-[13px] md:text-xl lg:text-2xl leading-tight line-clamp-2">{activePillar.glass1Title}</h4>
                      <p className="text-white/70 text-[8px] sm:text-[9px] md:text-[13px] leading-relaxed mt-1 md:mt-2 line-clamp-3 md:line-clamp-4">
                        {activePillar.glass1Subtitle}
                      </p>
                    </div>

                    {/* Glass card 2 */}
                    <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-6 flex flex-col justify-center">
                      <h4 className="text-white font-black text-[10px] sm:text-[13px] md:text-xl lg:text-2xl leading-tight line-clamp-2">{activePillar.glass2Title}</h4>
                      <p className="text-white/70 text-[8px] sm:text-[9px] md:text-[13px] leading-relaxed mt-1 md:mt-2 line-clamp-3 md:line-clamp-4">
                        {activePillar.glass2Subtitle}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ──── MOBILE VERTICAL SELECTOR (< LG) ──── */}
            <div className="flex lg:hidden flex-col w-[110px] sm:w-[130px] shrink-0 overflow-hidden pb-4 relative">
              <motion.div 
                ref={mobileTrackRef}
                className="flex flex-col gap-2 cursor-grab active:cursor-grabbing w-full"
                drag="y"
                dragConstraints={{ top: -mobileStep * pillars.length, bottom: 0 }}
                onDragEnd={handleDragEndMobile}
                animate={{ y: clampedY }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {pillars.map((p, i) => {
                  const PIcon = p.icon;
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={p.key + "-mobile"}
                      onClick={() => setActiveIndex(i)}
                      className={\`relative flex-shrink-0 min-h-[90px] sm:min-h-[100px] w-full rounded-xl transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col items-center justify-center gap-2 \${
                        isActive
                          ? \`bg-gradient-to-br \${p.gradient} shadow-lg scale-[1.02] z-10 ring-1 ring-white/30\`
                          : \`bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] \${p.hoverBorder}\`
                      }\`}
                    >
                      <PIcon
                        className={\`w-7 h-7 sm:w-8 sm:h-8 transition-colors \${isActive ? "text-white" : \`text-slate-400 dark:text-white/40 \${p.hoverText}\`}\`}
                        strokeWidth={1.5}
                      />
                      <span className={\`text-[10px] sm:text-xs font-bold uppercase tracking-wide leading-tight \${isActive ? "text-white/90" : "text-slate-500 dark:text-white/40"} text-center px-2 w-full break-words\`}>
                        {p.title}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* ──── RIGHT COLUMN ──── */}
          <div className="flex flex-col gap-4 md:gap-5 h-full">

            {/* RIGHT TOP: Title + Description */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.key + "-desc"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4 md:space-y-6 pt-1"
              >
                <h3 className="text-3xl sm:text-4xl md:text-[2.8rem] font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white line-clamp-3">
                  {activePillar.title}
                  <br />
                  <em className={\`font-black italic bg-clip-text text-transparent bg-gradient-to-r \${activePillar.gradient}\`}>
                    {activePillar.tagline}
                  </em>
                </h3>

                <p className="text-slate-500 dark:text-white/60 text-xs md:text-sm leading-relaxed max-w-sm line-clamp-3">
                  {activePillar.description}
                </p>

                <Link
                  href={activePillar.href}
                  className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm group hover:text-[#1B9981] dark:hover:text-[#00D4AA] transition-colors"
                >
                  Lihat Detail
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* RIGHT BOTTOM: DESKTOP HORIZONTAL SELECTOR (>= LG) WITH SPOTLIGHT */}
            <div 
              ref={buttonsContainerRef}
              onMouseMove={handleButtonsMouseMove}
              className="hidden lg:flex relative overflow-hidden mt-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 group"
            >
              {/* Desktop Mouse Spotlight that moves over buttons */}
              <div 
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                style={{
                  background: \`radial-gradient(150px circle at \${buttonMousePos.x}px \${buttonMousePos.y}px, rgba(255,255,255,0.08), transparent 40%)\`
                }}
              />
              
              <motion.div 
                ref={desktopTrackRef}
                className="flex gap-2 md:gap-3 min-w-max cursor-grab active:cursor-grabbing z-20"
                drag="x"
                dragConstraints={{ right: 0, left: -desktopStep * pillars.length }}
                onDragEnd={handleDragEndDesktop}
                animate={{ x: clampedX }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {pillars.map((p, i) => {
                  const PIcon = p.icon;
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={p.key}
                      onClick={() => setActiveIndex(i)}
                      className={\`relative flex-shrink-0 w-[110px] md:w-[130px] aspect-square rounded-xl md:rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-1.5 \${
                        isActive
                          ? \`bg-gradient-to-br \${p.gradient} shadow-lg scale-105\`
                          : \`bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] \${p.hoverBorder}\`
                      }\`}
                    >
                      <PIcon
                        className={\`w-6 h-6 md:w-8 md:h-8 transition-colors \${isActive ? "text-white" : \`text-slate-400 dark:text-white/40 \${p.hoverText}\`}\`}
                        strokeWidth={1.5}
                      />
                      <span className={\`text-xs md:text-sm font-bold uppercase tracking-wider mt-1 \${isActive ? "text-white/90" : "text-slate-500 dark:text-white/40"}\`}>
                        {p.title}
                      </span>
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </div>

          </div>
        </div>
        </LayoutGroup>
      </div>
    </section>
  );
}

/* ============================================
   CTA & STATS SECTION`;

content = content.replace(bentoRegex, newBentoSection);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated BentoFeaturesSection with interactive animations.');
