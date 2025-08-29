import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Producer from './pages/Producer';
import Authority from './pages/Authority';
import Buyer from './pages/Buyer';
import Explorer from './pages/Explorer';
import Leaderboard from './pages/Leaderboard';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {!isLandingPage && (
        <>
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 md:ml-0 min-h-screen">
              {children}
            </main>
          </div>
        </>
      )}
      {isLandingPage && (
        <>
          {children}
          <Footer />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/producer" element={<Producer />} />
          <Route path="/authority" element={<Authority />} />
          <Route path="/buyer" element={<Buyer />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;