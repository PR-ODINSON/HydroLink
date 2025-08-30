import React, { useState } from 'react';
import { PlusCircle, FileUp, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

// --- Mock Data ---
// In a real application, this data would come from your backend API.
const initialCredits = [
  {
    id: 'CR-2025-08-30A',
    productionDate: '2025-08-30',
    energyAmountMWh: 150,
    status: 'Certified',
    txHash: '0x123...abc',
  },
  {
    id: 'CR-2025-08-28B',
    productionDate: '2025-08-28',
    energyAmountMWh: 125,
    status: 'Pending',
    txHash: null,
  },
  {
    id: 'CR-2025-08-25C',
    productionDate: '2025-08-25',
    energyAmountMWh: 200,
    status: 'Rejected',
    txHash: null,
  },
];

// --- Helper Component for Status Badges ---
const StatusIndicator = ({ status }) => {
  const statusConfig = {
    Certified: {
      icon: <CheckCircle className="w-4 h-4" />,
      text: 'Certified',
      className: 'bg-green-100 text-green-800',
    },
    Pending: {
      icon: <Clock className="w-4 h-4" />,
      text: 'Pending',
      className: 'bg-yellow-100 text-yellow-800',
    },
    Rejected: {
      icon: <XCircle className="w-4 h-4" />,
      text: 'Rejected',
      className: 'bg-red-100 text-red-800',
    },
  };

  const config = statusConfig[status] || {};

  return (
    <div className={`inline-flex items-center gap-x-2 px-3 py-1 text-sm font-medium rounded-full ${config.className}`}>
      {config.icon}
      {config.text}
    </div>
  );
};


// --- Main Producer Dashboard Component ---
const ProducerDashboard = () => {
  const [credits, setCredits] = useState(initialCredits);
  const [formData, setFormData] = useState({
    productionDate: '',
    energyAmountMWh: '',
  });
  const [proofDocument, setProofDocument] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setProofDocument(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productionDate || !formData.energyAmountMWh || !proofDocument) {
      alert('Please fill in all fields and upload a proof document.');
      return;
    }

    // In a real app, you would send this data to your backend API.
    // Here, we'll just simulate the request by adding a new credit to our local state.
    const newCredit = {
      id: `CR-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}D`,
      productionDate: formData.productionDate,
      energyAmountMWh: parseFloat(formData.energyAmountMWh),
      status: 'Pending',
      txHash: null,
    };
    
    setCredits([newCredit, ...credits]);

    // Reset form
    setFormData({ productionDate: '', energyAmountMWh: '' });
    setProofDocument(null);
    document.getElementById('proofDocument').value = null; // Clear file input

    console.log('New Credit Request Submitted:', { ...newCredit, proofDocumentName: proofDocument.name });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Producer Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome! Manage your green hydrogen production and credit requests here.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Column: Request Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <PlusCircle className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Request New Credit Minting</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">Submit details of your latest production batch for certification.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="productionDate" className="block text-sm font-medium text-gray-700 mb-1">Production Date</label>
                  <input
                    type="date"
                    id="productionDate"
                    name="productionDate"
                    value={formData.productionDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="energyAmountMWh" className="block text-sm font-medium text-gray-700 mb-1">Energy Amount (in MWh)</label>
                  <input
                    type="number"
                    id="energyAmountMWh"
                    name="energyAmountMWh"
                    placeholder="e.g., 150"
                    value={formData.energyAmountMWh}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="proofDocument" className="block text-sm font-medium text-gray-700 mb-1">Proof Document</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="proofDocument" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="proofDocument" name="proofDocument" type="file" className="sr-only" onChange={handleFileChange} required />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                      {proofDocument && <p className="text-sm text-green-700 mt-2">Selected: {proofDocument.name}</p>}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Credits List */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">My Credits History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (MWh)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {credits.map((credit) => (
                      <tr key={credit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{credit.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{credit.productionDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{credit.energyAmountMWh}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusIndicator status={credit.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {credit.txHash ? (
                            <a href={`https://mumbai.polygonscan.com/tx/${credit.txHash}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 inline-flex items-center">
                              View on Explorer <ExternalLink className="w-4 h-4 ml-1.5" />
                            </a>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;