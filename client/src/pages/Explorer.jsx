import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  QrCode, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Zap,
  User,
  Shield,
  Award,
  Eye,
  Copy,
  ExternalLink,
  Download
} from 'lucide-react';

const Explorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Sample credit data with lifecycle
  const sampleCredit = {
    id: 'HC-2024-001',
    status: 'retired',
    producer: 'GreenTech Industries',
    amount: 1250,
    productionDate: '2024-01-15',
    facility: 'Solar H2 Plant Delta',
    location: 'Nevada, USA',
    source: 'Solar',
    certification: 'Gold Standard',
    co2Reduction: 2.8,
    qrCode: 'https://example.com/qr/HC-2024-001',
    lifecycle: [
      {
        step: 'minted',
        timestamp: '2024-01-16T10:00:00Z',
        actor: 'GreenTech Industries',
        txHash: '0x1234...abcd',
        details: 'Credit minted from green hydrogen production'
      },
      {
        step: 'certified',
        timestamp: '2024-01-17T14:30:00Z',
        actor: 'GreenCert Authority',
        txHash: '0x2345...bcde',
        details: 'Credit verified and certified by authority'
      },
      {
        step: 'transferred',
        timestamp: '2024-01-20T09:15:00Z',
        actor: 'EcoEnergy Corp',
        txHash: '0x3456...cdef',
        details: 'Credit transferred to buyer'
      },
      {
        step: 'retired',
        timestamp: '2024-01-25T16:45:00Z',
        actor: 'CleanPower Ltd',
        txHash: '0x4567...def0',
        details: 'Credit retired for carbon offsetting'
      }
    ]
  };

  const recentSearches = [
    'HC-2024-001',
    'HC-2024-005',
    'HC-2024-012',
    'HC-2024-018'
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      if (searchTerm === 'HC-2024-001' || searchTerm.toLowerCase().includes('sample')) {
        setSearchResult(sampleCredit);
      } else {
        setSearchResult(null);
      }
      setIsSearching(false);
    }, 1000);
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 'minted': return <Zap className="w-4 h-4 text-green-500" />;
      case 'certified': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'transferred': return <ArrowRight className="w-4 h-4 text-orange-500" />;
      case 'retired': return <Award className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStepColor = (step) => {
    switch (step) {
      case 'minted': return 'border-green-200 bg-green-50';
      case 'certified': return 'border-blue-200 bg-blue-50';
      case 'transferred': return 'border-orange-200 bg-orange-50';
      case 'retired': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateHash = (hash) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Credit Explorer
        </motion.h1>
        <p className="text-gray-600">
          Search and track the complete lifecycle of green hydrogen credits on the blockchain.
        </p>
      </div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Credit ID (e.g., HC-2024-001)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Search
              </>
            )}
          </button>
        </div>
        
        {/* Recent Searches */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Recent searches:</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => setSearchTerm(search)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Search Results */}
      {searchResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Credit Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{searchResult.id}</h2>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      searchResult.status === 'retired' 
                        ? 'bg-purple-100 text-purple-800'
                        : searchResult.status === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {searchResult.status.charAt(0).toUpperCase() + searchResult.status.slice(1)}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                      {searchResult.source}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      {searchResult.certification}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{searchResult.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">MWh</div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Producer</h3>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-900">{searchResult.producer}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Facility</h3>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-900">{searchResult.facility}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Production Date</h3>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-900">{new Date(searchResult.productionDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Location</h3>
                  <p className="text-gray-900">{searchResult.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">CO₂ Reduction</h3>
                  <p className="text-gray-900">{searchResult.co2Reduction} tonnes</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">QR Code Verification</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => copyToClipboard(searchResult.qrCode)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">QR Code for {searchResult.id}</p>
                <p className="text-xs text-gray-500 mt-1">Scan to verify authenticity</p>
              </div>
            </div>
          </div>

          {/* Lifecycle Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Credit Lifecycle</h3>
            <div className="space-y-6">
              {searchResult.lifecycle.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative pl-6 pb-6 border-l-2 ${
                    index === searchResult.lifecycle.length - 1 ? 'border-transparent' : 'border-gray-200'
                  }`}
                >
                  <div className={`absolute left-0 w-8 h-8 -ml-4 rounded-full border-2 ${getStepColor(event.step)} flex items-center justify-center`}>
                    {getStepIcon(event.step)}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-semibold text-gray-900 capitalize">
                          {event.step}
                        </h4>
                        <span className="text-sm text-gray-500">by {event.actor}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(event.timestamp)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{event.details}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Transaction:</span>
                        <code className="bg-gray-200 px-2 py-1 rounded text-xs">
                          {truncateHash(event.txHash)}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(event.txHash)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        View on Explorer
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* No Results */}
      {searchTerm && !searchResult && !isSearching && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
        >
          <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Credit Found</h3>
          <p className="text-gray-600 mb-4">
            The credit ID "{searchTerm}" was not found in our system.
          </p>
          <p className="text-sm text-gray-500">
            Please check the ID and try again, or try searching for "HC-2024-001" for a demo.
          </p>
        </motion.div>
      )}

      {/* Empty State */}
      {!searchTerm && !searchResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
        >
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Search</h3>
          <p className="text-gray-600 mb-4">
            Enter a credit ID to explore its complete lifecycle and verification details.
          </p>
          <p className="text-sm text-gray-500">
            Try searching for "HC-2024-001" to see a sample credit.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Explorer;
