import React, { useState } from 'react';
import { PlusCircle, FileUp, X, Loader2, AlertCircle } from 'lucide-react';

const RequestCreditModal = ({ isOpen, onClose, onSubmit }) => {
  // Move hooks outside of conditional to fix lint error
  const [formData, setFormData] = useState({ 
    productionDate: '', 
    energyAmountMWh: '',
    facilityName: '',
    facilityLocation: '',
    energySource: 'Solar',
    proofDocumentUrl: ''
  });
  const [proofDocument, setProofDocument] = useState(null);
  const [additionalDocuments, setAdditionalDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setProofDocument(file);
      // For now, we'll use a placeholder URL. In production, you'd upload to a file service
      setFormData(prev => ({ ...prev, proofDocumentUrl: `https://example.com/uploads/${file.name}` }));
    }
  };

  const handleAdditionalFileChange = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newDocs = files.map(file => ({
        name: file.name,
        url: `https://example.com/uploads/${file.name}`,
        type: 'Other',
        uploadedAt: new Date()
      }));
      setAdditionalDocuments(prev => [...prev, ...newDocs]);
    }
  };

  const removeAdditionalDocument = (index) => {
    setAdditionalDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.productionDate || !formData.energyAmountMWh || !formData.facilityName || !formData.facilityLocation || !proofDocument) {
      setError('Please fill in all required fields and upload a proof document.');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        additionalDocuments
      };
      
      await onSubmit(requestData);
      
      // Reset form
      setFormData({ 
        productionDate: '', 
        energyAmountMWh: '',
        facilityName: '',
        facilityLocation: '',
        energySource: 'Solar',
        proofDocumentUrl: ''
      });
      setProofDocument(null);
      setAdditionalDocuments([]);
    } catch (err) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10">
          <X className="w-5 h-5" />
        </button>
        <div className="p-4">
          <div className="flex items-center mb-3">
            <PlusCircle className="w-5 h-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Request Credit</h2>
          </div>
          <p className="text-xs text-gray-500 mb-3">Submit production details for certification.</p>
          
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-xs text-red-800">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Row 1: Date and Energy */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="productionDate" className="block text-xs font-medium text-gray-700 mb-1">Production Date *</label>
                <input type="date" id="productionDate" name="productionDate" value={formData.productionDate} onChange={handleInputChange} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" required />
              </div>
              
              <div>
                <label htmlFor="energyAmountMWh" className="block text-xs font-medium text-gray-700 mb-1">Energy (MWh) *</label>
                <input type="number" id="energyAmountMWh" name="energyAmountMWh" value={formData.energyAmountMWh} onChange={handleInputChange} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" min="0" step="0.01" required />
              </div>
            </div>

            {/* Energy Source */}
            <div>
              <label htmlFor="energySource" className="block text-xs font-medium text-gray-700 mb-1">Energy Source *</label>
              <select id="energySource" name="energySource" value={formData.energySource} onChange={handleInputChange} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" required>
                <option value="Solar">Solar</option>
                <option value="Wind">Wind</option>
                <option value="Hydro">Hydro</option>
                <option value="Geothermal">Geothermal</option>
                <option value="Biomass">Biomass</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            {/* Facility Name */}
            <div>
              <label htmlFor="facilityName" className="block text-xs font-medium text-gray-700 mb-1">Facility Name *</label>
              <input type="text" id="facilityName" name="facilityName" placeholder="e.g., Solar H2 Plant A" value={formData.facilityName} onChange={handleInputChange} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" required />
            </div>
            
            {/* Facility Location */}
            <div>
              <label htmlFor="facilityLocation" className="block text-xs font-medium text-gray-700 mb-1">Location *</label>
              <input type="text" id="facilityLocation" name="facilityLocation" placeholder="e.g., California, USA" value={formData.facilityLocation} onChange={handleInputChange} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" required />
            </div>

            {/* Proof Document - Compact */}
            <div>
              <label htmlFor="proofDocument" className="block text-xs font-medium text-gray-700 mb-1">Proof Document *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-3">
                <div className="text-center">
                  <FileUp className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-1">
                    <label htmlFor="proofDocument" className="cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500">
                      <span className="text-xs">Upload file</span>
                      <input id="proofDocument" name="proofDocument" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                  {proofDocument && (
                    <p className="text-xs text-green-600 mt-1">✓ {proofDocument.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Documents - Optional and Compact */}
            <div>
              <label htmlFor="additionalDocuments" className="block text-xs font-medium text-gray-700 mb-1">Additional Documents (Optional)</label>
              <input
                id="additionalDocuments"
                name="additionalDocuments"
                type="file"
                multiple
                onChange={handleAdditionalFileChange}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              {additionalDocuments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {additionalDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-xs">
                      <span className="truncate">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAdditionalDocument(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestCreditModal;