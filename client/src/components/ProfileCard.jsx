import React, { useState } from 'react';
import { User, Wallet, Copy } from 'lucide-react';

const ProfileCard = ({ userProfile }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userProfile.walletAddress).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Hide message after 2 seconds
    }, (err) => {
        setCopySuccess('Failed to copy!');
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-4">
        <User className="w-6 h-6 text-green-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">Profile & Wallet</h2>
      </div>
      <div className="space-y-3 text-sm">
        <p><strong>Company:</strong> <span className="text-gray-600">{userProfile.name}</span></p>
        <p><strong>Email:</strong> <span className="text-gray-600">{userProfile.email}</span></p>
        <div>
          <p className="font-medium">Wallet Address:</p>
          <div className="mt-1 flex items-center gap-2 p-2 bg-gray-100 rounded-md">
            <Wallet className="w-4 h-4 text-gray-500 flex-shrink-0"/>
            <span className="text-gray-700 truncate font-mono text-xs">{userProfile.walletAddress}</span>
            <button onClick={copyToClipboard} title="Copy Address" className="ml-auto p-1 text-gray-500 hover:text-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
              <Copy className="w-4 h-4" />
            </button>
          </div>
           {copySuccess && <p className="text-xs text-green-600 mt-1">{copySuccess}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;