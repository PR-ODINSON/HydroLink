#!/usr/bin/env node

/**
 * Script to create placeholder images for HydroLink documentation
 * This generates simple SVG placeholders that can be replaced with actual screenshots
 */

const fs = require('fs');
const path = require('path');

// Define image specifications
const images = {
  screenshots: [
    { name: 'landing-page.png', title: 'HydroLink Landing Page', width: 1920, height: 1080 },
    { name: 'producer-dashboard.png', title: 'Producer Dashboard', width: 1920, height: 1080 },
    { name: 'certifier-dashboard.png', title: 'Certifier Dashboard', width: 1920, height: 1080 },
    { name: 'buyer-dashboard.png', title: 'Buyer Dashboard', width: 1920, height: 1080 },
    { name: 'marketplace.png', title: 'Credit Marketplace', width: 1920, height: 1080 },
    { name: 'analytics.png', title: 'Analytics Dashboard', width: 1920, height: 1080 },
    { name: 'producer-workflow.png', title: 'Producer Workflow', width: 1920, height: 1080 },
    { name: 'verification-process.png', title: 'Verification Process', width: 1920, height: 1080 },
    { name: 'trading-interface.png', title: 'Trading Interface', width: 1920, height: 1080 }
  ],
  features: [
    { name: 'blockchain-integration.png', title: 'Blockchain Integration', width: 800, height: 600 },
    { name: 'ai-fraud-detection.png', title: 'AI Fraud Detection', width: 800, height: 600 },
    { name: 'gamification.png', title: 'Gamification System', width: 800, height: 600 },
    { name: 'mobile-responsive.png', title: 'Mobile Responsive', width: 800, height: 600 },
    { name: 'real-time.png', title: 'Real-time Processing', width: 800, height: 600 }
  ],
  diagrams: [
    { name: 'system-architecture.png', title: 'System Architecture', width: 1200, height: 800 },
    { name: 'blockchain-flow.png', title: 'Blockchain Flow', width: 1200, height: 800 },
    { name: 'security-model.png', title: 'Security Model', width: 1200, height: 800 },
    { name: 'credit-lifecycle.png', title: 'Credit Lifecycle', width: 1200, height: 800 }
  ],
  logos: [
    { name: 'hydrolink-logo.png', title: 'HydroLink Logo', width: 512, height: 512 },
    { name: 'hydrolink-icon.png', title: 'HydroLink Icon', width: 512, height: 512 }
  ]
};

// Color palette
const colors = {
  primary: '#10b981',
  secondary: '#3b82f6',
  accent: '#9f7aea',
  background: '#f8fafc',
  text: '#1f2937'
};

/**
 * Generate SVG placeholder
 */
function generateSVGPlaceholder(config) {
  const { name, title, width, height } = config;
  
  // Choose color based on category
  let bgColor = colors.background;
  let textColor = colors.text;
  let accentColor = colors.primary;
  
  if (name.includes('dashboard')) {
    accentColor = colors.secondary;
  } else if (name.includes('verification') || name.includes('security')) {
    accentColor = colors.accent;
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  
  <!-- Header bar -->
  <rect width="${width}" height="80" fill="${accentColor}"/>
  
  <!-- Content area -->
  <rect x="40" y="120" width="${width - 80}" height="${height - 200}" fill="white" rx="8" stroke="#e5e7eb"/>
  
  <!-- Title -->
  <text x="${width / 2}" y="50" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">${title}</text>
  
  <!-- Placeholder text -->
  <text x="${width / 2}" y="${height / 2}" font-family="Arial, sans-serif" font-size="18" fill="${textColor}" text-anchor="middle">Screenshot Placeholder</text>
  <text x="${width / 2}" y="${height / 2 + 30}" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">Replace with actual ${title.toLowerCase()}</text>
  
  <!-- Decorative elements -->
  <circle cx="80" cy="160" r="4" fill="${accentColor}"/>
  <circle cx="100" cy="160" r="4" fill="#e5e7eb"/>
  <circle cx="120" cy="160" r="4" fill="#e5e7eb"/>
  
  <!-- Mock content boxes -->
  <rect x="80" y="200" width="200" height="60" fill="#f3f4f6" rx="4"/>
  <rect x="300" y="200" width="200" height="60" fill="#f3f4f6" rx="4"/>
  <rect x="520" y="200" width="200" height="60" fill="#f3f4f6" rx="4"/>
</svg>`;

  return svg;
}

/**
 * Create placeholder files
 */
function createPlaceholders() {
  const baseDir = path.join(__dirname, '..', 'assets', 'images');
  
  // Ensure directories exist
  Object.keys(images).forEach(category => {
    const dir = path.join(baseDir, category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Generate placeholder SVGs
  Object.entries(images).forEach(([category, imageList]) => {
    imageList.forEach(config => {
      const svgContent = generateSVGPlaceholder(config);
      const svgPath = path.join(baseDir, category, config.name.replace('.png', '.svg'));
      
      fs.writeFileSync(svgPath, svgContent);
      console.log(`✅ Created placeholder: ${category}/${config.name.replace('.png', '.svg')}`);
    });
  });

  console.log('\n🎉 All placeholder images created successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Take actual screenshots of your application');
  console.log('2. Replace SVG placeholders with PNG screenshots');
  console.log('3. Update image paths in README.md if needed');
  console.log('4. Optimize images for web (compress to <500KB)');
}

/**
 * Create a simple markdown overview
 */
function createImageIndex() {
  const indexPath = path.join(__dirname, '..', 'assets', 'images', 'INDEX.md');
  
  let content = `# 📷 HydroLink Image Index\n\nGenerated on: ${new Date().toISOString()}\n\n`;
  
  Object.entries(images).forEach(([category, imageList]) => {
    content += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
    imageList.forEach(config => {
      content += `- [ ] \`${config.name}\` - ${config.title} (${config.width}x${config.height})\n`;
    });
    content += '\n';
  });
  
  content += `## 📋 Checklist\n\n`;
  content += `- [ ] All screenshots captured\n`;
  content += `- [ ] Images optimized for web\n`;
  content += `- [ ] README.md updated\n`;
  content += `- [ ] Links tested\n`;
  
  fs.writeFileSync(indexPath, content);
  console.log('📋 Created image index at assets/images/INDEX.md');
}

// Run the script
if (require.main === module) {
  console.log('🖼️  Creating HydroLink image placeholders...\n');
  createPlaceholders();
  createImageIndex();
}

module.exports = { generateSVGPlaceholder, createPlaceholders };
