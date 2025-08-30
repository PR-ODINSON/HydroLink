import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Loader2, AlertCircle, Eye, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CertifierDashboard = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingRequest, setProcessingRequest] = useState(null);

  // Fetch pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/certifier/requests/pending', {
          credentials: 'include'
        });
        
        if (response.ok) {
        const data = await response.json();
        if (data.success) {
            setPendingRequests(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        setError('Failed to load pending requests');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPendingRequests();
    }
  }, [user]);

  const handleApprove = async (requestId) => {
    try {
      setProcessingRequest(requestId);
      
      const response = await fetch(`/api/certifier/requests/${requestId}/approve`, {
        method: 'POST',
        credentials: 'include'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove the approved request from the list
        setPendingRequests(prev => prev.filter(req => req._id !== requestId));
        alert('Request approved successfully! Blockchain credit has been minted.');
      } else {
        throw new Error(result.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request: ' + error.message);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessingRequest(requestId);
      
      const response = await fetch(`/api/certifier/requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rejectionReason: 'Did not meet certification requirements'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove the rejected request from the list
        setPendingRequests(prev => prev.filter(req => req._id !== requestId));
        alert('Request rejected successfully. Producer has been notified.');
      } else {
        throw new Error(result.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request: ' + error.message);
    } finally {
      setProcessingRequest(null);
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
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Certifier Dashboard</h1>
          <p className="text-gray-600 mt-1">Review and approve green hydrogen credit requests.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Producers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(pendingRequests.map(req => req.producer)).size}
                </p>
              </div>
            </div>
          </div>
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
            <span className="ml-2 text-gray-600">Loading pending requests...</span>
          </div>
        )}

        {/* Pending Requests Section */}
        {!loading && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Pending Credit Requests</h2>
          </div>
            <div className="p-6">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                  <p className="text-gray-600">All credit requests have been processed.</p>
        </div>
              ) : (
                <div className="space-y-6">
          {pendingRequests.map((request) => (
                    <div key={request._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Request Header */}
                          <div className="flex items-center mb-3">
                            <span className="text-lg font-medium text-gray-900 mr-3">
                              {request.requestId}
                  </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              {request.status}
                  </span>
                </div>

                          {/* Request Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Energy Amount</p>
                              <p className="text-lg font-semibold text-gray-900">{request.energyAmountMWh} MWh</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Production Date</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {new Date(request.productionDate).toLocaleDateString()}
                              </p>
              </div>
                <div>
                              <p className="text-sm text-gray-600">Facility</p>
                              <p className="text-lg font-semibold text-gray-900">{request.facilityName}</p>
                </div>
                <div>
                              <p className="text-sm text-gray-600">Energy Source</p>
                              <p className="text-lg font-semibold text-gray-900">{request.energySource}</p>
                </div>
                <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="text-lg font-semibold text-gray-900">{request.facilityLocation}</p>
                </div>
                <div>
                              <p className="text-sm text-gray-600">Submitted</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {new Date(request.audit.submittedAt).toLocaleDateString()}
                              </p>
                </div>
              </div>

                          {/* Proof Document */}
                          {request.proofDocumentUrl && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 mb-2">Proof Document</p>
                              <a
                                href={request.proofDocumentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700"
                              >
                  <Eye className="w-4 h-4 mr-1" />
                                View Document
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 ml-6">
                  <button
                            onClick={() => handleApprove(request._id)}
                            disabled={processingRequest === request._id}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingRequest === request._id ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            Approve
                  </button>
                  <button
                            onClick={() => handleReject(request._id)}
                            disabled={processingRequest === request._id}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingRequest === request._id ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-1" />
                            )}
                            Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertifierDashboard;