# 📸 HydroLink Screenshot Capture Guide

This guide provides step-by-step instructions for capturing high-quality screenshots of the HydroLink platform for documentation purposes.

## 🚀 Prerequisites

Before capturing screenshots:

1. **✅ Setup Development Environment**
   ```bash
   # Start all services
   cd server && npm run dev    # Terminal 1
   cd client && npm run dev    # Terminal 2
   cd blockchain && npx hardhat node  # Terminal 3 (optional)
   ```

2. **✅ Prepare Test Data**
   - Create test accounts for each role (Producer, Certifier, Buyer)
   - Generate sample credits and transactions
   - Ensure realistic data is displayed

3. **✅ Browser Setup**
   - Use Chrome or Firefox
   - Set viewport to 1920x1080 (Full HD)
   - Clear browser cache and disable extensions
   - Use Incognito/Private mode for clean screenshots

## 📱 Screenshot Specifications

| Category | Dimensions | Format | Quality |
|----------|------------|---------|---------|
| Screenshots | 1920x1080px | PNG | High (80-90%) |
| Features | 800x600px | PNG | High (80-90%) |
| Diagrams | 1200x800px | PNG/SVG | High (90%+) |
| Mobile | 390x844px | PNG | High (80-90%) |

## 📋 Screenshot Checklist

### 🌐 Landing Page (`landing-page.png`)

**URL**: `http://localhost:5173/`

**Steps**:
1. Navigate to landing page
2. Scroll to top to show hero section
3. Ensure all animations have loaded
4. Capture full viewport (hero + features visible)

**Key Elements to Include**:
- [ ] Hero section with title and CTA buttons
- [ ] Navigation bar with logo
- [ ] Key features preview
- [ ] Statistics counters
- [ ] Beautiful gradient background

---

### 🏭 Producer Dashboard (`producer-dashboard.png`)

**URL**: `http://localhost:5173/dashboard` (logged in as Producer)

**Preparation**:
1. Login as a Producer account
2. Ensure you have created some credits
3. Have some pending and approved credits

**Key Elements to Include**:
- [ ] Dashboard header with user info
- [ ] Statistics cards (total credits, pending, approved)
- [ ] Charts showing production trends
- [ ] Recent activity list
- [ ] Quick action buttons
- [ ] Navigation sidebar

---

### 🛡️ Certifier Dashboard (`certifier-dashboard.png`)

**URL**: `http://localhost:5173/dashboard` (logged in as Certifier)

**Preparation**:
1. Login as a Certifier account
2. Have pending verification requests
3. Show verification statistics

**Key Elements to Include**:
- [ ] Pending requests list
- [ ] Verification statistics
- [ ] AI fraud detection indicators
- [ ] Recent approvals/rejections
- [ ] Workload distribution charts

---

### 💼 Buyer Dashboard (`buyer-dashboard.png`)

**URL**: `http://localhost:5173/dashboard` (logged in as Buyer)

**Preparation**:
1. Login as a Buyer account
2. Have purchased some credits
3. Show portfolio performance

**Key Elements to Include**:
- [ ] Portfolio overview
- [ ] Owned credits summary
- [ ] Sustainability goals progress
- [ ] Market trends
- [ ] Recent purchases
- [ ] Environmental impact metrics

---

### 🏪 Marketplace (`marketplace.png`)

**URL**: `http://localhost:5173/marketplace`

**Preparation**:
1. Ensure there are available credits for sale
2. Show diverse credit types and sources
3. Include filtering and search options

**Key Elements to Include**:
- [ ] Credit grid/list view
- [ ] Filter sidebar
- [ ] Search functionality
- [ ] Price and details for each credit
- [ ] Sort options
- [ ] Pagination

---

### 📊 Analytics Dashboard (`analytics.png`)

**URL**: `http://localhost:5173/analytics`

**Key Elements to Include**:
- [ ] Multiple chart types (line, bar, pie)
- [ ] Date range selectors
- [ ] Key performance indicators
- [ ] Export options
- [ ] Interactive chart elements

---

### 🔄 Producer Workflow (`producer-workflow.png`)

**URL**: `http://localhost:5173/credits` → Create new credit flow

**Capture**:
- Multi-step credit creation form
- Progress indicators
- Form validation
- File upload interface

---

### ✅ Verification Process (`verification-process.png`)

**URL**: `http://localhost:5173/verification` (Certifier view)

**Capture**:
- Credit review interface
- Document viewer
- AI analysis results
- Approve/reject buttons
- Comments section

---

### 💰 Trading Interface (`trading-interface.png`)

**URL**: `http://localhost:5173/marketplace` → Purchase flow

**Capture**:
- Credit purchase modal
- Payment information
- Transaction confirmation
- Wallet integration

## 🎨 Feature Screenshots

### 🔗 Blockchain Integration (`blockchain-integration.png`)

**Show**:
- MetaMask connection
- Transaction confirmation
- Smart contract interaction
- Block explorer links

### 🤖 AI Fraud Detection (`ai-fraud-detection.png`)

**Show**:
- AI analysis dashboard
- Risk scoring interface
- Fraud indicators
- Pattern detection results

### 🏆 Gamification (`gamification.png`)

**Show**:
- Leaderboards
- Achievement badges
- Progress bars
- Point systems

### 📱 Mobile Responsive (`mobile-responsive.png`)

**Setup**: Use Chrome DevTools device emulation (iPhone 12 Pro - 390x844)

**Show**:
- Mobile navigation menu
- Responsive dashboard layout
- Touch-friendly interactions
- Optimized mobile UI

### ⚡ Real-time Processing (`real-time.png`)

**Show**:
- Real-time notifications
- Live status updates
- Processing indicators
- Instant feedback

## 🖼️ Diagram Creation

### 📊 System Architecture (`system-architecture.png`)

**Tools**: Use Figma, Draw.io, or Lucidchart

**Include**:
- Frontend (React)
- Backend (Node.js/Express)
- Database (MongoDB)
- Blockchain (Polygon)
- External services

### ⛓️ Blockchain Flow (`blockchain-flow.png`)

**Show**:
- Smart contract deployment
- NFT minting process
- Transfer mechanisms
- Retirement process

### 🔐 Security Model (`security-model.png`)

**Include**:
- Authentication layers
- Authorization levels
- Data encryption
- Audit trails

### 🔄 Credit Lifecycle (`credit-lifecycle.png`)

**Flow**:
1. Production → 2. Submission → 3. Verification → 4. Certification → 5. Trading → 6. Retirement

## 🎨 Style Guidelines

### Color Consistency
- **Primary Green**: #10b981
- **Primary Blue**: #3b82f6
- **Primary Purple**: #9f7aea
- **Background**: #f8fafc
- **Text**: #1f2937

### UI Elements
- Use consistent shadows and borders
- Maintain proper contrast ratios
- Include hover states where relevant
- Show loading states and animations

### Content Guidelines
- Use realistic but anonymized data
- Show diverse user names and companies
- Include various energy sources (Solar, Wind, Hydro)
- Display realistic numbers and metrics

## 🛠️ Technical Setup

### Browser Dev Tools Settings

**Chrome DevTools**:
1. F12 to open DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "Responsive" or specific device
4. Set dimensions: 1920x1080 for desktop

**Screenshot Capture**:
1. Right-click → "Inspect"
2. DevTools → Settings → Preferences
3. Enable "Capture screenshots"
4. Use Ctrl+Shift+P → "Capture full page screenshot"

### Image Optimization

After capturing:
1. **Compress images**: Use TinyPNG or ImageOptim
2. **Target file size**: <500KB per image
3. **Format**: PNG for screenshots, SVG for diagrams
4. **Quality**: 80-90% compression

## 📝 Final Checklist

- [ ] All screenshots captured at correct dimensions
- [ ] Images show realistic, relevant data
- [ ] UI elements are clearly visible
- [ ] No personal or sensitive information visible
- [ ] Images compressed for web use
- [ ] Files named correctly (matching README references)
- [ ] All placeholders replaced in README.md
- [ ] Links tested and working

## 🚀 Quick Commands

**Replace SVG placeholders with PNG**:
```bash
# In assets/images directory
find . -name "*.svg" -type f | while read file; do
    echo "Replace: $file with ${file%.svg}.png"
done
```

**Verify all images exist**:
```bash
# Check if all referenced images exist
grep -o "!\[.*\](./assets/images/.*\.png)" README.md | \
sed 's/.*(\(.*\))/\1/' | \
while read img; do
    if [ -f "$img" ]; then
        echo "✅ $img"
    else
        echo "❌ Missing: $img"
    fi
done
```

---

**Happy Screenshot Hunting! 📸**

*Remember: Great documentation screenshots make the difference between a good project and an amazing one.*
