const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/FloatingAccessibility.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the modal container background
content = content.replace(
  /bg-white dark:bg-\[#0F172A\] text-slate-800 dark:text-slate-100 rounded-3xl shadow-\[0_20px_70px_rgba\(0,0,0,0\.3\)\] border border-slate-100 dark:border-slate-800/g,
  "bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl text-slate-800 dark:text-slate-100 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_70px_rgba(0,0,0,0.5)] border border-slate-200/50 dark:border-white/10"
);

// 2. Fix all the invalid dark:bg-slate-850 and poor border/hover contrast
content = content.replace(/dark:bg-slate-850/g, 'dark:bg-white/5');
content = content.replace(/dark:border-slate-700/g, 'dark:border-white/10');
content = content.replace(/dark:hover:bg-slate-800/g, 'dark:hover:bg-white/10');

// 3. Fix footer background
content = content.replace(/bg-slate-50 dark:bg-slate-900\/80/g, 'bg-slate-50/50 dark:bg-transparent');
content = content.replace(/border-slate-100 dark:border-slate-800/g, 'border-slate-100 dark:border-white/10');

// 4. Change Moon icon color from amber to sky
content = content.replace(/<Moon className="w-4 h-4 text-amber-400" \/>/g, '<Moon className="w-4 h-4 text-sky-400" />');

// 5. High Contrast active state in dark mode
content = content.replace(
  /bg-slate-900 border-slate-900 dark:bg-slate-100 dark:border-slate-100 text-white dark:text-slate-900/g,
  "bg-slate-900 border-slate-900 dark:bg-white dark:border-white text-white dark:text-black"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed accessibility modal UI/UX.');
