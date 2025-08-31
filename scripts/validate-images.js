#!/usr/bin/env node

/**
 * Script to validate all image references in README.md
 * Checks if all referenced images exist and reports missing ones
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating HydroLink README.md image references...\n');

// Read README.md
const readmePath = path.join(__dirname, '..', 'README.md');
const readmeContent = fs.readFileSync(readmePath, 'utf8');

// Extract all image references
const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
const images = [];
let match;

while ((match = imageRegex.exec(readmeContent)) !== null) {
  images.push({
    alt: match[1],
    path: match[2],
    line: readmeContent.substring(0, match.index).split('\n').length
  });
}

console.log(`📊 Found ${images.length} image references in README.md\n`);

// Check each image
let existingImages = 0;
let missingImages = 0;
const missingList = [];

images.forEach((img, index) => {
  // Convert relative path to absolute
  const fullPath = path.join(__dirname, '..', img.path);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${img.alt || 'Image'} - ${img.path}`);
    existingImages++;
  } else {
    console.log(`❌ MISSING: ${img.alt || 'Image'} - ${img.path} (line ${img.line})`);
    missingImages++;
    missingList.push(img);
  }
});

console.log('\n📈 Summary:');
console.log(`✅ Existing images: ${existingImages}`);
console.log(`❌ Missing images: ${missingImages}`);
console.log(`📊 Total references: ${images.length}`);

if (missingImages > 0) {
  console.log('\n🚨 Missing Images Details:');
  missingList.forEach(img => {
    console.log(`   • ${img.path} (${img.alt || 'No alt text'}) - Line ${img.line}`);
  });
  
  console.log('\n💡 Suggestions:');
  console.log('1. Check if image files exist in the correct directories');
  console.log('2. Verify file names match exactly (case-sensitive)');
  console.log('3. Ensure file extensions are correct (.png, .jpg, .svg)');
  console.log('4. Run screenshot capture if images are missing');
} else {
  console.log('\n🎉 All images are properly referenced and exist!');
}

// Check for actual image files that aren't referenced
console.log('\n🔍 Checking for unreferenced images...');

const imagesDirs = [
  'assets/images/screenshots',
  'assets/images/features', 
  'assets/images/diagrams',
  'assets/images/logos'
];

const referencedPaths = images.map(img => img.path);
let unreferencedCount = 0;

imagesDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      if (file.match(/\.(png|jpg|jpeg|svg|gif)$/i)) {
        const relativePath = `./${dir}/${file}`;
        if (!referencedPaths.includes(relativePath)) {
          console.log(`📷 Unreferenced: ${relativePath}`);
          unreferencedCount++;
        }
      }
    });
  }
});

if (unreferencedCount === 0) {
  console.log('✅ No unreferenced images found');
} else {
  console.log(`\n📊 Found ${unreferencedCount} unreferenced image files`);
}

console.log('\n🏁 Image validation complete!');

// Exit with error code if missing images
process.exit(missingImages > 0 ? 1 : 0);
