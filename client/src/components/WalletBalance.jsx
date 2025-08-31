import React, { useState, useEffect } from 'react';
import { Wallet, Coins, TrendingUp, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const WalletBalance = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError('');

      // Determine API endpoint based on user role
      const endpoint = user?.role === 'Producer' ? '/api/producer/wallet' : '/api/buyer/wallet';

      const response = await fetch(endpoint, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBalance(data.data.hydroCoinBalance || 0);
          setLastUpdated(new Date());
        } else {
          throw new Error(data.message || 'Failed to fetch wallet data');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [user?.walletAddress]);

  const handleRefresh = () => {
    fetchBalance();
  };

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getBalanceColor = (amount) => {
    if (amount >= 1000) return 'text-green-600';
    if (amount >= 500) return 'text-blue-600';
    if (amount >= 100) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getBalanceStatus = (amount) => {
    if (amount >= 1000) return 'Excellent';
    if (amount >= 500) return 'Good';
    if (amount >= 100) return 'Fair';
    return 'Low';
  };

  if (!user?.walletAddress) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Wallet className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Demo Wallet</h3>
            <p className="text-xs text-gray-500">No wallet connected</p>
          </div>
        </div>
        <div className="text-center py-3">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-600">
              {Math.floor(Math.random() * 500) + 50}
            </span>
          </div>
          <p className="text-xs text-gray-600">Demo HydroCoins</p>
          <p className="text-xs text-gray-500 mt-1">Connect wallet for real balance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">HydroCoin Wallet</h3>
            <p className="text-xs text-gray-500">Current Balance</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50"
          title="Refresh balance"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Balance Display */}
      <div className="mb-3">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-3">
            <p className="text-sm text-red-600 mb-2">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-xs text-blue-600 hover:text-blue-700 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className={`text-2xl font-bold ${getBalanceColor(balance)}`}>
                {formatBalance(balance)}
              </span>
            </div>
            <p className="text-xs text-gray-600">HydroCoins</p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                getBalanceColor(balance).replace('text-', 'bg-').replace('-600', '-100')
              } ${getBalanceColor(balance)}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {getBalanceStatus(balance)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Wallet Address */}
      <div className="pt-3 border-t border-blue-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Wallet Address</span>
          <span className="text-xs text-gray-700 font-mono">
            {user.walletAddress ? 
              `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
              'Not set'
            }
          </span>
        </div>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Last Updated</span>
            <span className="text-xs text-gray-600">
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletBalance;
