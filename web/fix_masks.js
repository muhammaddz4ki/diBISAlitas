const fs = require('fs');
const path = require('path');

const files = [
  'bisafe/page.tsx',
  'bipantau/page.tsx',
  'bisapa/page.tsx',
  'bibaca/page.tsx',
  'bipintar/page.tsx',
  'bijalan/page.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, 'src/app/fitur', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // We need to apply the mask logic to any phone that doesn't have it yet, 
  // and fix the direction for ones that do.
  
  // First, let's remove ALL existing mask styles to start fresh and avoid duplicates
  content = content.replace(/,\s*WebkitMaskImage: "linear-gradient[^"]+",\s*WebkitMaskComposite: "destination-in",\s*maskImage: "linear-gradient[^"]+",\s*maskComposite: "intersect"/g, '');
  
  // Also remove it from BiJALAN where it's not preceded by a comma on the same line if formatting differs
  content = content.replace(/WebkitMaskImage: "linear-gradient[^"]+",\s*WebkitMaskComposite: "destination-in",\s*maskImage: "linear-gradient[^"]+",\s*maskComposite: "intersect",?\s*/g, '');

  // Now, find all transform: "rotateY..." blocks that look like mobile phones.
  // We'll use a replacer function.
  content = content.replace(/(transform:\s*"(rotateY\(([-\d]+)deg\).*?)",\s*boxShadow:\s*"([^"]+)")/g, (match, p1, p2, p3, p4) => {
    const angle = parseInt(p3);
    if (isNaN(angle)) return match;
    
    // Determine fade direction
    const direction = angle < 0 ? 'to left' : 'to right';
    
    const mask = `WebkitMaskImage: "linear-gradient(${direction}, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  WebkitMaskComposite: "destination-in",
                  maskImage: "linear-gradient(${direction}, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)",
                  maskComposite: "intersect"`;
                  
    return `${p1},\n                  ${mask}`;
  });

  // Now, fix the glow positioning.
  // Glows are typically: `<div className="absolute w-[90%] h-[90%] bg-rose-500/10 blur-[100px] rounded-full top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2" />`
  // We need to shift left-[40%] to left-[20%] or left-[80%] depending on the phone's rotation.
  // But wait, the glow is in the parent div, while the phone is a sibling.
  // It's easier to just make all glows much smaller and less wide, so they don't leak into the edges.
  // Let's replace `w-[90%] h-[90%]` with `w-[50%] h-[50%]` and `blur-[100px]` with `blur-[80px]`
  content = content.replace(/w-\[90%\]\s+h-\[90%\]([^>]+)blur-\[100px\]/g, 'w-[40%] h-[60%] $1 blur-[70px]');
  // Also for hero glows: `w-[600px] h-[300px] ... blur-3xl` -> make them smaller or shift them up so they don't bleed down to the bottom faded edge.
  content = content.replace(/w-\[600px\] h-\[300px\]([^>]+)blur-3xl/g, 'w-[400px] h-[200px] $1 blur-3xl');

  // One exception: in BiPINTAR, there are multiple phones overlapping (DualMockup).
  // We shouldn't mask them if it looks weird, but the prompt says "sesmoaa mobilee", so let's just let the script apply to all rotateY transforms.
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
});
