import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
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
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {!isLandingPage && !isAuthPage && (
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
      {(isLandingPage || isAuthPage) && (
        <>
          {children}
          {isLandingPage && <Footer />}
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/producer" element={<Producer />} />
            <Route path="/authority" element={<Authority />} />
            <Route path="/buyer" element={<Buyer />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
