import React from 'react';
import { Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

const StatusIndicator = ({ status }) => {
  const styles = {
    Certified: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Rejected: 'bg-red-100 text-red-800',
  };
  const icons = {
    Certified: <CheckCircle className="w-4 h-4" />,
    Pending: <Clock className="w-4 h-4" />,
    Rejected: <XCircle className="w-4 h-4" />,
  };
  return (
    <div className={`inline-flex items-center gap-x-2 px-3 py-1 text-sm font-medium rounded-full ${styles[status]}`}>
      {icons[status]}
      {status}
    </div>
  );
};

const CreditsHistoryTable = ({ credits }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Credits History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (MWh)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {credits.map((credit) => (
              <tr key={credit.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{credit.id}</div>
                    <div className="text-sm text-gray-500">{credit.productionDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{credit.energyAmountMWh}</td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusIndicator status={credit.status} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {credit.txHash ? (
                    <a href={`https://mumbai.polygonscan.com/tx/${credit.txHash}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 inline-flex items-center">
                      View on Explorer <ExternalLink className="w-4 h-4 ml-1.5" />
                    </a>
                  ) : ( <span className="text-gray-400">N/A</span> )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreditsHistoryTable;