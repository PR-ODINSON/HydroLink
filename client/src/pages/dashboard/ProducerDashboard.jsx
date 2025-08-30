import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, Clock, CheckCircle, XCircle, Loader2, AlertCircle, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import RequestCreditModal from '../../components/RequestCreditModal';

const ProducerDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [credits, setCredits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch both requests and credits on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch requests
        const requestsResponse = await fetch('/api/producer/requests', {
          credentials: 'include'
        });
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          if (requestsData.success) {
            setRequests(requestsData.data || []);
          }
        }

        // Fetch actual credits
        const creditsResponse = await fetch('/api/producer/credits', {
          method: 'GET',
          credentials: 'include'
        });
        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json();
          if (creditsData.success) {
            setCredits(creditsData.data || []);
          }
        }


      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleRequestSubmit = async (newRequestData) => {
    try {
      console.log('New Credit Request Submitted:', newRequestData);
      
      const response = await fetch('/api/producer/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newRequestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit request');
      }

      if (result.success) {
        // Add the new request to the requests list (NOT credits)
        const newRequest = {
          _id: result.data._id,
          requestId: result.data.requestId,
          productionDate: newRequestData.productionDate,
          energyAmountMWh: parseFloat(newRequestData.energyAmountMWh),
          status: 'Pending',
          facilityName: newRequestData.facilityName,
          facilityLocation: newRequestData.facilityLocation,
          energySource: newRequestData.energySource,
          audit: { submittedAt: new Date() }
        };
        setRequests([newRequest, ...requests]);
        setIsModalOpen(false);
        
        // Show success message
        alert('Credit request submitted successfully! 🎉\n\nCertifiers have been notified and you will receive an in-app notification once your request is reviewed.');
      } else {
        throw new Error(result.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      throw error; // Re-throw to let the modal handle the error display
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Under Review': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'Approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please Login</h3>
          <p className="text-gray-600">You need to login to access the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <RequestCreditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleRequestSubmit} 
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Producer Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your green hydrogen production and credit requests.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-green-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Request Credit Minting
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading dashboard data...</span>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {requests.filter(r => r.status === 'Pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved Credits</p>
                    <p className="text-2xl font-bold text-gray-900">{credits.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rejected Requests</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {requests.filter(r => r.status === 'Rejected').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                  </div>
                </div>
              </div>


            </div>

            {/* Recent Requests Section */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Requests</h2>
              </div>
              <div className="p-6">
                {requests.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                    <p className="text-gray-600 mb-4">Submit your first credit request to get started</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Submit Request
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.slice(0, 5).map((request) => (
                      <div key={request._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-900 mr-2">
                              {request.requestId}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1">{request.status}</span>
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {request.energyAmountMWh} MWh • {request.facilityName} • {new Date(request.productionDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(request.audit.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Approved Credits Section */}
            {credits.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">My Credits (Blockchain Approved)</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {credits.map((credit) => (
                      <div key={credit._id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-900 mr-2">
                              {credit.creditId || credit._id}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Certified
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {credit.energyAmountMWh} MWh • {credit.facilityName} • {new Date(credit.productionDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Token: {credit.tokenId || 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProducerDashboard;