import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Factory, 
  Plus, 
  MapPin, 
  Zap, 
  Settings, 
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Production = () => {
  const { user } = useAuth();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFacility, setNewFacility] = useState({
    name: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: ''
    },
    energySource: 'Solar',
    capacity: '',
    specifications: {
      technology: '',
      manufacturer: '',
      model: '',
      yearInstalled: new Date().getFullYear()
    }
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await fetch('/api/producer/facilities', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setFacilities(data.data);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
      // For demo purposes, set some mock data
      setFacilities([
        {
          _id: '1',
          name: 'Solar Plant Alpha',
          energySource: 'Solar',
          capacity: 150.5,
          efficiency: 94.2,
          status: 'Active',
          location: { city: 'San Francisco', state: 'CA' },
          operationalMetrics: { totalEnergyProduced: 2340 }
        },
        {
          _id: '2',
          name: 'Wind Farm Beta',
          energySource: 'Wind',
          capacity: 200.0,
          efficiency: 89.7,
          status: 'Active',
          location: { city: 'Austin', state: 'TX' },
          operationalMetrics: { totalEnergyProduced: 1850 }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFacility = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/producer/facilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newFacility),
      });
      
      const data = await response.json();
      if (data.success) {
        setFacilities([...facilities, data.data]);
        setShowAddModal(false);
        setNewFacility({
          name: '',
          location: { address: '', city: '', state: '', country: '' },
          energySource: 'Solar',
          capacity: '',
          specifications: { technology: '', manufacturer: '', model: '', yearInstalled: new Date().getFullYear() }
        });
      }
    } catch (error) {
      console.error('Error adding facility:', error);
      // For demo purposes, add to local state
      const mockFacility = {
        _id: Date.now().toString(),
        ...newFacility,
        capacity: parseFloat(newFacility.capacity),
        efficiency: 0,
        status: 'Active',
        operationalMetrics: { totalEnergyProduced: 0 }
      };
      setFacilities([...facilities, mockFacility]);
      setShowAddModal(false);
      setNewFacility({
        name: '',
        location: { address: '', city: '', state: '', country: '' },
        energySource: 'Solar',
        capacity: '',
        specifications: { technology: '', manufacturer: '', model: '', yearInstalled: new Date().getFullYear() }
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'Solar': return '☀️';
      case 'Wind': return '💨';
      case 'Hydro': return '💧';
      case 'Nuclear': return '⚛️';
      default: return '⚡';
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-300 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Production Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage your hydrogen production facilities.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Facility
        </button>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Facilities</h3>
            <Factory className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{facilities.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Capacity</h3>
            <Zap className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {facilities.reduce((sum, f) => sum + (f.capacity || 0), 0).toFixed(1)} MW
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Facilities</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {facilities.filter(f => f.status === 'Active').length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Avg Efficiency</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {facilities.length > 0 
              ? (facilities.reduce((sum, f) => sum + (f.efficiency || 0), 0) / facilities.length).toFixed(1)
              : 0
            }%
          </p>
        </motion.div>
      </div>

      {/* Facilities Grid */}
      {facilities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200"
        >
          <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Facilities Yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first production facility.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Your First Facility
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Facility Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{getSourceIcon(facility.energySource)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                    <p className="text-sm text-gray-600">{facility.energySource}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(facility.status || 'Active')}`}>
                  {facility.status || 'Active'}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{facility.location?.city || 'Location not set'}, {facility.location?.state || ''}</span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Capacity</p>
                  <p className="text-lg font-semibold text-gray-900">{facility.capacity || 0} MW</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Efficiency</p>
                  <p className="text-lg font-semibold text-gray-900">{facility.efficiency || 0}%</p>
                </div>
              </div>

              {/* Production Stats */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Production</span>
                  <span className="font-medium">{facility.operationalMetrics?.totalEnergyProduced || 0} MWh</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Analytics
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  <Settings className="w-4 h-4 mr-1" />
                  Settings
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Facility Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Facility</h2>
              
              <form onSubmit={handleAddFacility} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facility Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newFacility.name}
                      onChange={(e) => setNewFacility({...newFacility, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Solar Plant Alpha"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Energy Source
                    </label>
                    <select
                      value={newFacility.energySource}
                      onChange={(e) => setNewFacility({...newFacility, energySource: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Solar">Solar</option>
                      <option value="Wind">Wind</option>
                      <option value="Hydro">Hydro</option>
                      <option value="Nuclear">Nuclear</option>
                      <option value="Geothermal">Geothermal</option>
                      <option value="Biomass">Biomass</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={newFacility.location.city}
                      onChange={(e) => setNewFacility({
                        ...newFacility, 
                        location: {...newFacility.location, city: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="San Francisco"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={newFacility.location.state}
                      onChange={(e) => setNewFacility({
                        ...newFacility, 
                        location: {...newFacility.location, state: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="California"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity (MW)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={newFacility.capacity}
                    onChange={(e) => setNewFacility({...newFacility, capacity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="100.5"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Facility
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Production;