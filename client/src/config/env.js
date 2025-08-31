// Environment configuration for HydroLink client
export const config = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || '/api',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // Blockchain Configuration
  BLOCKCHAIN_NETWORK: import.meta.env.VITE_BLOCKCHAIN_NETWORK || 'polygon',
  CHAIN_ID: import.meta.env.VITE_CHAIN_ID || '80002',
  
  // Application Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'HydroLink',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  
  // Features
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true' || false,
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || false,
  
  // External Services
  ENABLE_WALLET_CONNECT: import.meta.env.VITE_ENABLE_WALLET_CONNECT !== 'false',
  
  // Development vs Production
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Helper functions
  getApiUrl: (endpoint = '') => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://hydrolink.onrender.com';
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
    
    if (import.meta.env.PROD) {
      // In production, use the deployed backend URL
      return `${baseUrl}${apiBase}${endpoint}`;
    }
    
    // In development, use local backend
    return `/api${endpoint}`;
  }
};

export default config;
