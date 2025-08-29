# HydroLink - Blockchain-Based Green Hydrogen Credit System

A beautiful, production-ready frontend for the Blockchain-Based Green Hydrogen Credit System (BGHCS) built with React + TailwindCSS.

## 🌟 Features

### Multi-Page Application
- **Landing Page**: Hero section with CTA, features showcase, and company information
- **Dashboard**: Overview with stats cards, charts, and recent activity
- **Producer Portal**: Mint new credits, track production, and view leaderboard rank
- **Authority Dashboard**: Review and certify credits from producers
- **Buyer Marketplace**: Purchase and retire credits for sustainability goals
- **Credit Explorer**: Search and track complete credit lifecycle with QR verification
- **Leaderboard**: Gamification with rankings, achievements, and challenges

### Modern Design Features
- 🎨 **Beautiful UI**: Glassmorphism, neumorphism, and gradient backgrounds
- 📱 **Responsive Design**: Mobile-first approach with perfect tablet/desktop scaling
- ⚡ **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- 🎯 **Accessible**: WCAG compliant with proper contrast and screen reader support
- 🔄 **Interactive**: Hover states, loading animations, and form validations

### Technical Stack
- **React 19.1.1**: Latest React with modern hooks and concurrent features
- **TailwindCSS 4.1.12**: Utility-first CSS framework for rapid development
- **React Router Dom**: Client-side routing for SPA navigation
- **Lucide React**: Beautiful, customizable icons
- **Framer Motion**: Production-ready motion library
- **Recharts**: Composable charting library for data visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
client/src/
├── pages/
│   ├── Landing.jsx       # Landing page with hero and features
│   ├── Dashboard.jsx     # Main dashboard with analytics
│   ├── Producer.jsx      # Producer portal for minting credits
│   ├── Authority.jsx     # Authority dashboard for verification
│   ├── Buyer.jsx         # Marketplace for buying/retiring credits
│   ├── Explorer.jsx      # Credit search and lifecycle tracking
│   └── Leaderboard.jsx   # Gamification and rankings
├── components/
│   ├── Navbar.jsx        # Top navigation with responsive menu
│   ├── Sidebar.jsx       # Role-based sidebar navigation
│   ├── Footer.jsx        # Footer with links and company info
│   ├── DashboardCard.jsx # Reusable stats card component
│   └── Chart.jsx         # Configurable chart component
├── App.jsx               # Main app with routing
└── main.jsx             # App entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Green (#10b981) - Represents sustainability and growth
- **Secondary**: Blue (#3b82f6) - Trust and reliability
- **Accent**: Purple (#8b5cf6) - Innovation and technology
- **Warning**: Orange (#f59e0b) - Attention and energy
- **Success**: Emerald (#059669) - Completion and success

### Typography
- **Font**: System font stack (SF Pro, Segoe UI, etc.)
- **Scale**: TailwindCSS default type scale
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Components
- **Cards**: Rounded corners (2xl), subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, hover animations, icon support
- **Forms**: Focus rings, validation states, clean inputs
- **Charts**: Custom styled with consistent color scheme

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:3000
VITE_BLOCKCHAIN_RPC=https://rpc.example.com
VITE_APP_NAME=HydroLink
```

### Tailwind Configuration
The project uses TailwindCSS v4 with default configuration. Custom utilities can be added to `index.css`.

## 📱 Responsive Breakpoints

- **Mobile**: 0px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

All components are designed mobile-first and scale beautifully across all screen sizes.

## 🎯 User Roles & Permissions

### Producer
- Mint new hydrogen credits
- Track production history
- View leaderboard ranking
- Manage facility information

### Authority
- Review pending credits
- Approve/reject submissions
- Track verification history
- Generate compliance reports

### Buyer
- Browse available credits
- Purchase credit packages
- Retire credits for offsetting
- View carbon impact analytics

### Explorer (Public)
- Search any credit by ID
- View complete lifecycle
- Verify authenticity via QR
- Access public statistics

## 🔮 Future Enhancements

### Authentication
- Web3 wallet integration
- Role-based access control
- Multi-factor authentication
- Session management

### Advanced Features
- Real-time notifications
- Advanced analytics
- Export/reporting tools
- Mobile app (React Native)

### Blockchain Integration
- Smart contract interactions
- Transaction history
- Gas optimization
- Multi-chain support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from modern sustainability platforms
- Icons by Lucide React
- Charts powered by Recharts
- Animations by Framer Motion

---

Built with ❤️ for a sustainable future 🌱
