import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProducerDashboard from './ProducerDashboard';
import CertifierDashboard from './CertifierDashboard';
import BuyerDashboard from './BuyerDashboard';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

const RoleBasedDashboard = () => {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // No user state (shouldn't happen with ProtectedRoute, but good fallback)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl shadow-xl border border-red-200 p-8"
        >
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Error</h2>
          <p className="text-gray-600 mb-4">Unable to determine user role. Please try logging in again.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Return to Login
          </button>
        </motion.div>
      </div>
    );
  }

  // Role-based dashboard routing
  const renderDashboard = () => {
    switch (user.role?.toLowerCase()) {
      case 'producer':
        return <ProducerDashboard />;
      
      case 'certifier':
      case 'authority': // Handle both 'Certifier' and 'Authority' role names
        return <CertifierDashboard />;
      
      case 'buyer':
        return <BuyerDashboard />;
      
      default:
        // Unknown role fallback
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md"
            >
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Unknown Role</h2>
              <p className="text-gray-600 mb-4">
                Your role "{user.role}" is not recognized. Please contact support.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">User: {user.name}</p>
                <p className="text-sm text-gray-500">Email: {user.email}</p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
              </div>
              <button 
                onClick={() => window.location.href = '/'}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Return to Home
              </button>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50"
    >
      {renderDashboard()}
    </motion.div>
  );
};

export default RoleBasedDashboard;
