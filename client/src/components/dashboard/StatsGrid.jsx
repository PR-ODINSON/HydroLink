import React from 'react';
import { motion } from 'framer-motion';
import DashboardCard from '../DashboardCard';

const StatsGrid = ({ stats = [], className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <DashboardCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
