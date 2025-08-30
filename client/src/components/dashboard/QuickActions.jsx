import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const QuickActions = ({ actions = [], title = "Quick Actions", className = "" }) => {
  const getActionColor = (color) => {
    const colors = {
      green: "from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700",
      blue: "from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700",
      purple: "from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700",
      orange: "from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700",
      red: "from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700",
    };
    return colors[color] || colors.green;
  };

  const getIconColor = (color) => {
    const colors = {
      green: "text-green-600",
      blue: "text-blue-600", 
      purple: "text-purple-600",
      orange: "text-orange-600",
      red: "text-red-600",
    };
    return colors[color] || colors.green;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <motion.button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-between p-3 bg-gradient-to-r ${getActionColor(action.color)} rounded-lg transition-all group disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center">
                <IconComponent className={`w-5 h-5 ${getIconColor(action.color)} mr-3`} />
                <span className="font-medium">{action.label}</span>
              </div>
              <ArrowRight className={`w-4 h-4 ${getIconColor(action.color)} group-hover:translate-x-1 transition-transform`} />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuickActions;
