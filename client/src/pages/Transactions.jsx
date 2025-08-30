import React from 'react';
import PlaceholderPage from '../components/PlaceholderPage';
import { CreditCard } from 'lucide-react';

const Transactions = () => {
  return (
    <PlaceholderPage
      title="Transactions"
      description="View your transaction history, purchases, transfers and retirements."
      icon={CreditCard}
    />
  );
};

export default Transactions;
