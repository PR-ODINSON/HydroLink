import React from 'react';
import { motion } from 'framer-motion';
import Chart from '../Chart';

const ChartsSection = ({ charts = [], className = "" }) => {
  const getGridCols = (count) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 lg:grid-cols-2';
    if (count === 3) return 'grid-cols-1 lg:grid-cols-3';
    return 'grid-cols-1 lg:grid-cols-2';
  };

  return (
    <div className={`grid ${getGridCols(charts.length)} gap-6 ${className}`}>
      {charts.map((chart, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.2 }}
        >
          <Chart {...chart} />
        </motion.div>
      ))}
    </div>
  );
};

export default ChartsSection;
