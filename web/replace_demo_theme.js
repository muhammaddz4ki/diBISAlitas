const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/demo/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\bblue-/g, 'emerald-');
content = content.replace(/\bpurple-/g, 'emerald-');
content = content.replace(/\bred-/g, 'emerald-');
content = content.replace(/rgba\(37,99,235/g, 'rgba(16,185,129'); 

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated demo theme to green.');
