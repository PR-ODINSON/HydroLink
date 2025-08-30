import React from 'react';
import { motion } from 'framer-motion';

const ActivityList = ({ 
  activities = [], 
  title = "Recent Activity",
  getActivityIcon,
  getActivityColor,
  showViewAll = true,
  onViewAll,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {showViewAll && (
          <button 
            onClick={onViewAll}
            className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
          >
            View All
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className={`p-2 rounded-lg ${getActivityColor ? getActivityColor(activity.type) : 'bg-gray-100 text-gray-600'}`}>
                {getActivityIcon ? getActivityIcon(activity.type) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  {activity.amount && (
                    <span className="text-sm text-gray-500">{activity.amount}</span>
                  )}
                  {activity.amount && activity.time && (
                    <span className="text-xs text-gray-400">•</span>
                  )}
                  {activity.time && (
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  )}
                </div>
              </div>
              {activity.status && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'completed' || activity.status === 'approved'
                    ? 'bg-green-100 text-green-800' 
                    : activity.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : activity.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ActivityList;
