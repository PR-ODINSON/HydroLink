import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DashboardCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'blue',
  subtitle,
  loading = false 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      icon: 'bg-blue-500',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      icon: 'bg-green-500',
      text: 'text-green-600',
      border: 'border-green-200'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      icon: 'bg-purple-500',
      text: 'text-purple-600',
      border: 'border-purple-200'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      icon: 'bg-orange-500',
      text: 'text-orange-600',
      border: 'border-orange-200'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      icon: 'bg-red-500',
      text: 'text-red-600',
      border: 'border-red-200'
    }
  };

  const colors = colorClasses[color];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className={`
      ${colors.bg} rounded-2xl shadow-sm border ${colors.border} p-6 
      hover:shadow-lg transition-all duration-300 hover:scale-105
      backdrop-blur-sm
    `}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`${colors.icon} p-2.5 rounded-lg shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      
      {trend && trendValue && (
        <div className="flex items-center space-x-1">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trendValue}
          </span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
