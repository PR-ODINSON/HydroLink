import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Factory, 
  Shield, 
  ShoppingCart, 
  Search, 
  Trophy,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  FileText,
  AlertTriangle,
  Target,
  Zap,
  Award
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path) => location.pathname === path;
  
  // Role-based menu items
  const getMenuItems = (userRole) => {
    const commonItems = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'blue' },
      { path: '/explorer', icon: Search, label: 'Explorer', color: 'cyan' },
      { path: '/leaderboard', icon: Trophy, label: 'Leaderboard', color: 'yellow' },
    ];

    switch (userRole?.toLowerCase()) {
      case 'producer':
        return [
          ...commonItems,
          { path: '/production', icon: Factory, label: 'Production', color: 'green' },
          { path: '/credits', icon: CreditCard, label: 'My Credits', color: 'green' },
          { path: '/analytics', icon: BarChart3, label: 'Analytics', color: 'blue' },
          { path: '/achievements', icon: Award, label: 'Achievements', color: 'orange' },
        ];
      
      case 'certifier':
      case 'authority':
        return [
          ...commonItems,
          { path: '/verification', icon: Shield, label: 'Verification', color: 'purple' },
          { path: '/requests', icon: FileText, label: 'Pending Requests', color: 'orange' },
          { path: '/fraud-detection', icon: AlertTriangle, label: 'Fraud Detection', color: 'red' },
          { path: '/reports', icon: BarChart3, label: 'Reports', color: 'blue' },
        ];
      
      case 'buyer':
        return [
          ...commonItems,
          { path: '/marketplace', icon: ShoppingCart, label: 'Marketplace', color: 'green' },
          { path: '/portfolio', icon: Target, label: 'Portfolio', color: 'blue' },
          { path: '/transactions', icon: CreditCard, label: 'Transactions', color: 'purple' },
          { path: '/sustainability', icon: Zap, label: 'Impact Tracker', color: 'green' },
        ];
      
      default:
        // Fallback for unknown roles or guests
        return commonItems;
    }
  };

  const menuItems = getMenuItems(user?.role);

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700',
      green: isActive ? 'bg-green-50 text-green-700 border-r-2 border-green-700' : 'text-gray-600 hover:bg-green-50 hover:text-green-700',
      purple: isActive ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700',
      orange: isActive ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-700' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700',
      cyan: isActive ? 'bg-cyan-50 text-cyan-700 border-r-2 border-cyan-700' : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-700',
      yellow: isActive ? 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-700' : 'text-gray-600 hover:bg-yellow-50 hover:text-yellow-700',
      red: isActive ? 'bg-red-50 text-red-700 border-r-2 border-red-700' : 'text-gray-600 hover:bg-red-50 hover:text-red-700',
    };
    return colors[color];
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 pt-16 h-screen w-64 bg-white/95 backdrop-blur-lg border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative md:top-0 md:h-screen md:border-r-0
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Role Header */}
          {user && (
            <div className="px-3 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role} Portal
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Menu Items */}
          <nav className="flex-1 py-6 min-h-0">
            <div className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                      ${getColorClasses(item.color, active)}
                    `}
                  >
                    <Icon size={20} className="mr-3 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
