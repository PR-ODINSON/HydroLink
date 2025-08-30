import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Bell, User, Menu, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('user');
      navigate('/');
      setShowUserMenu(false);
      window.location.reload(); // Simple page refresh to reset state
    } catch (error) {
      console.error('Logout failed:', error);
      // Still logout locally even if server call fails
      localStorage.removeItem('user');
      navigate('/');
      setShowUserMenu(false);
      window.location.reload();
    }
  };
  
  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-green-100 shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-md text-green-600 hover:bg-green-50 transition-colors"
            >
              <Menu size={20} />
            </button>
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 ml-2 md:ml-0">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                HydroLink
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Home
            </Link>
            {/* Landing page navigation links - only show on home page */}
            {isActive('/') && (
              <>
                <button
                  onClick={() => {
                    const element = document.getElementById('features');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('about');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors cursor-pointer"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </>
            )}
            {/* Dashboard navigation links - only show when authenticated AND NOT on landing page */}
            {isAuthenticated && !isActive('/') && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'text-green-600 border-b-2 border-green-600' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/explorer"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/explorer') 
                      ? 'text-green-600 border-b-2 border-green-600' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Explorer
                </Link>
                <Link
                  to="/leaderboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/leaderboard') 
                      ? 'text-green-600 border-b-2 border-green-600' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Leaderboard
                </Link>
              </>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                    <ChevronDown size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {user?.role}
                        </span>
                      </div>
                      
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} className="mr-3" />
                        Account Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Login/Register buttons for non-authenticated users */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
