import React from 'react';
import PlaceholderPage from '../components/PlaceholderPage';
import { CreditCard } from 'lucide-react';

const Credits = () => {
  return (
    <PlaceholderPage
      title="My Credits"
      description="View and manage your hydrogen credit portfolio and history."
      icon={CreditCard}
    />
  );
};

export default Credits;
