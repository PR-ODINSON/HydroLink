import React from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlaceholderPage = ({ 
  title, 
  description = "This feature is under development and will be available soon.",
  icon: Icon = Construction,
  backLink = "/dashboard"
}) => {
  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-white rounded-2xl shadow-xl border border-gray-200 p-12 max-w-md w-full"
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              🚧 This page is currently under construction. Check back soon for updates!
            </p>
          </div>
          
          <Link
            to={backLink}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PlaceholderPage;
