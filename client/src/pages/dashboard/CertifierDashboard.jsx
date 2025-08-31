import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText,
  Calendar,
  MapPin,
  Zap,
  Factory,
  AlertCircle,
  Loader2,
  User,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CertifierRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ comments: '', reason: '', details: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/certifier/requests/pending', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }

        const data = await response.json();
        
        if (data.success) {
          setRequests(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch requests');
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user]);

  // Calculate stats correctly
  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const underReviewCount = requests.filter(r => r.status === 'Under Review').length;
  const totalCount = requests.length;

  // Filter requests to show only pending ones in the list
  const pendingRequests = requests.filter(r => r.status === 'Pending');

  const handleApprove = async (requestId) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/certifier/requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ comments: reviewData.comments })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to approve request');
      }

      if (result.success) {
        // Remove the approved request from the list
        setRequests(prev => prev.filter(r => r._id !== requestId));
        setShowReviewModal(false);
        setSelectedRequest(null);
        setReviewData({ comments: '', reason: '', details: '' });
        alert('Request approved successfully! Credit has been minted on the blockchain.');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/certifier/requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          reason: reviewData.reason,
          details: reviewData.details
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to reject request');
      }

      if (result.success) {
        // Remove the rejected request from the list
        setRequests(prev => prev.filter(r => r._id !== requestId));
        setShowReviewModal(false);
        setSelectedRequest(null);
        setReviewData({ comments: '', reason: '', details: '' });
        alert('Request rejected successfully.');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openReviewModal = (request) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Under Review': return <Eye className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Requests</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Request Review</h1>
          <p className="text-gray-600">Review and approve credit requests from producers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-xs text-gray-500">Awaiting initial review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">{underReviewCount}</p>
                <p className="text-xs text-gray-500">Currently being reviewed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                <p className="text-xs text-gray-500">All requests in system</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Pending Requests ({pendingCount})
            </h2>
            <p className="text-sm text-gray-600 mt-1">Requests awaiting your review and decision</p>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-600">All requests have been reviewed or are under review</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingRequests.map((request, index) => (
                <div
                  key={request._id}
                  className="p-6 hover:bg-gray-50 transition-all duration-300 ease-in-out transform hover:scale-[1.01] animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-900 mr-2">
                          {request.requestId || `REQ-${request._id.slice(-6)}`}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{request.status}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>{request.producer?.name || 'Unknown Producer'}</span>
                        </div>
                        <div className="flex items-center">
                          <Factory className="h-4 w-4 mr-2" />
                          <span>{request.facilityName || 'Unknown Facility'}</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-2" />
                          <span>{request.energyAmountMWh} MWh ({request.energySource})</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Produced: {formatDate(request.productionDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{request.facilityLocation || 'Location not specified'}</span>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() => openReviewModal(request)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </button>
                      <div className="text-right text-sm text-gray-500">
                        <p>Submitted: {formatDate(request.createdAt || request.audit?.submittedAt || new Date())}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Review Request</h2>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Request ID</label>
                      <p className="text-sm text-gray-900">{selectedRequest.requestId || `REQ-${selectedRequest._id.slice(-6)}`}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Producer</label>
                      <p className="text-sm text-gray-900">{selectedRequest.producer?.name || 'Unknown Producer'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facility</label>
                      <p className="text-sm text-gray-900">{selectedRequest.facilityName || 'Unknown Facility'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Energy Amount</label>
                      <p className="text-sm text-gray-900">{selectedRequest.energyAmountMWh} MWh ({selectedRequest.energySource})</p>
                    </div>
                  </div>

                  {selectedRequest.proofDocumentUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Proof Document</label>
                      <a
                        href={selectedRequest.proofDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comments (Optional)</label>
                    <textarea
                      value={reviewData.comments}
                      onChange={(e) => setReviewData(prev => ({ ...prev, comments: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                      rows="3"
                      placeholder="Add any comments about this request..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason (if rejecting)</label>
                    <select
                      value={reviewData.reason}
                      onChange={(e) => setReviewData(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select reason...</option>
                      <option value="Insufficient Documentation">Insufficient Documentation</option>
                      <option value="Invalid Data">Invalid Data</option>
                      <option value="Facility Not Certified">Facility Not Certified</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {reviewData.reason && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Details</label>
                      <textarea
                        value={reviewData.details}
                        onChange={(e) => setReviewData(prev => ({ ...prev, details: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        rows="2"
                        placeholder="Provide specific details about the rejection..."
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest._id)}
                    disabled={actionLoading || !reviewData.reason}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ThumbsDown className="w-4 h-4 mr-2" />}
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest._id)}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ThumbsUp className="w-4 h-4 mr-2" />}
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertifierRequests;