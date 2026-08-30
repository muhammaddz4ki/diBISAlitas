const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, 'src/app/fitur');
const features = ['bisafe', 'bipantau', 'bisapa', 'bibaca', 'bipintar', 'bijalan'];

features.forEach(feature => {
  const filePath = path.join(featuresDir, feature, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace dark:bg-[#050103] with dark:bg-[#090e17]
    content = content.replace(/dark:bg-\[#050103\]/g, 'dark:bg-[#090e17]');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${feature}`);
  }
});

console.log('Successfully updated all feature page backgrounds to standard black (#090e17).');
