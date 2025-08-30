import React, { useState } from 'react';
import { PlusCircle, FileUp, X } from 'lucide-react';

const RequestCreditModal = ({ isOpen, onClose, onSubmit }) => {
  // Move hooks outside of conditional to fix lint error
  const [formData, setFormData] = useState({ productionDate: '', energyAmountMWh: '' });
  const [proofDocument, setProofDocument] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setProofDocument(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productionDate || !formData.energyAmountMWh || !proofDocument) {
      alert('Please fill in all fields and upload a proof document.');
      return;
    }
    onSubmit({ ...formData, proofDocument });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
        </button>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <PlusCircle className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Request New Credit Minting</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">Submit details of your latest production batch for certification.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="productionDate" className="block text-sm font-medium text-gray-700 mb-1">Production Date</label>
              <input type="date" id="productionDate" name="productionDate" value={formData.productionDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div>
              <label htmlFor="energyAmountMWh" className="block text-sm font-medium text-gray-700 mb-1">Energy Amount (MWh)</label>
              <input type="number" id="energyAmountMWh" name="energyAmountMWh" placeholder="e.g., 150" value={formData.energyAmountMWh} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" required />
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
            <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">Submit Request</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestCreditModal;