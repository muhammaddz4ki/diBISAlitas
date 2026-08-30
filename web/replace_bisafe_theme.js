const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/fitur/bisafe/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\brose-/g, 'red-');
content = content.replace(/\bblue-/g, 'red-');
content = content.replace(/\bemerald-/g, 'red-');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated bisafe theme to pure red.');
