import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleBasedDashboard from './pages/dashboard/RoleBasedDashboard';
import Producer from './pages/Producer';
import Authority from './pages/Authority';
import Buyer from './pages/Buyer';
import Explorer from './pages/Explorer';

// Producer-specific pages
import Production from './pages/Production';
import Credits from './pages/Credits';
import ProducerRequests from './pages/ProducerRequests';
import Analytics from './pages/Analytics';
import Achievements from './pages/Achievements';

// Certifier-specific pages
import Verification from './pages/Verification';
import Requests from './pages/Requests';
import FraudDetection from './pages/FraudDetection';
import Reports from './pages/Reports';

// Buyer-specific pages
import Marketplace from './pages/Marketplace';
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import Sustainability from './pages/Sustainability';

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
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleBasedDashboard />
              </ProtectedRoute>
            } />
            <Route path="/producer" element={
              <ProtectedRoute>
                <Producer />
              </ProtectedRoute>
            } />
            <Route path="/authority" element={
              <ProtectedRoute>
                <Authority />
              </ProtectedRoute>
            } />
            <Route path="/buyer" element={
              <ProtectedRoute>
                <Buyer />
              </ProtectedRoute>
            } />
            <Route path="/explorer" element={
              <ProtectedRoute>
                <Explorer />
              </ProtectedRoute>
            } />
            
            {/* Producer-specific routes */}
            <Route path="/production" element={
              <ProtectedRoute>
                <Production />
              </ProtectedRoute>
            } />
            <Route path="/credits" element={
              <ProtectedRoute>
                <Credits />
              </ProtectedRoute>
            } />
            <Route path="/producer/requests" element={
              <ProtectedRoute>
                <ProducerRequests />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/achievements" element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            } />
            
            {/* Certifier-specific routes */}
            <Route path="/verification" element={
              <ProtectedRoute>
                <Verification />
              </ProtectedRoute>
            } />
            <Route path="/requests" element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            } />
            <Route path="/fraud-detection" element={
              <ProtectedRoute>
                <FraudDetection />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            
            {/* Buyer-specific routes */}
            <Route path="/marketplace" element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            } />
            <Route path="/portfolio" element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } />
            <Route path="/sustainability" element={
              <ProtectedRoute>
                <Sustainability />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
