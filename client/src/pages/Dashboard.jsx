import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

// Correctly import the components from their new locations
import RequestCreditModal from '../components/RequestCreditModal';
import CreditsHistoryTable from '../components/CreditsHistoryTable';
import ProfileCard from '../components/ProfileCard';

// --- Mock Data ---
// This data would typically come from a global state (Context API) or be fetched via a custom hook.
const initialCredits = [
  {
    id: 'CR-2025-08-30A',
    productionDate: '2025-08-30',
    energyAmountMWh: 150,
    status: 'Certified',
    txHash: '0x123abcde1234567890abcdef1234567890abcde123',
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

const userProfile = {
    name: 'GreenTech Industries',
    email: 'contact@greentech.com',
    walletAddress: '0xAbCdEf1234567890AbCdEf1234567890aBcDeF12',
};


// --- Main Producer Dashboard Component ---
const ProducerDashboard = () => {
  const [credits, setCredits] = useState(initialCredits);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestSubmit = (newCreditData) => {
    console.log('New Credit Request Submitted:', newCreditData);
    // In a real app, this would be an API call to your backend.
    const newCredit = {
      id: `CR-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}D`,
      productionDate: newCreditData.productionDate,
      energyAmountMWh: parseFloat(newCreditData.energyAmountMWh),
      status: 'Pending',
      txHash: null,
    };
    setCredits([newCredit, ...credits]);
    setIsModalOpen(false); // Close modal on submit
  };
  
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
            className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Request New Credit
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <CreditsHistoryTable credits={credits} />
          </div>

          <div className="lg:col-span-1">
            <ProfileCard userProfile={userProfile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;