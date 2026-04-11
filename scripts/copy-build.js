const fs = require('fs');
const path = require('path');

// Recursive copy function
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

try {
  // Copy .next/static to .next/standalone/.next/
  console.log('Copying .next/static...');
  copyDir('.next/static', '.next/standalone/.next/static');
  
  // Copy public to .next/standalone/
  console.log('Copying public folder...');
  copyDir('public', '.next/standalone/public');
  
  console.log('✅ Build files copied successfully!');
} catch (error) {
  console.error('❌ Error copying files:', error.message);
  process.exit(1);
}
