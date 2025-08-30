import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

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
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {!isAuthPage && (
        <>
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          {!isLandingPage && (
            <div className="flex">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <main className="flex-1 overflow-y-auto h-screen pt-16">
                {children}
              </main>
            </div>
          )}
          {isLandingPage && (
            <main className="min-h-screen">
              {children}
            </main>
          )}
        </>
      )}
      {isAuthPage && (
        <>
          {children}
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
