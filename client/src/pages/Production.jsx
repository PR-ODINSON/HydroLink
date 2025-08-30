import React from 'react';
import PlaceholderPage from '../components/PlaceholderPage';
import { Factory } from 'lucide-react';

const Production = () => {
  return (
    <PlaceholderPage
      title="Production Management"
      description="Monitor and manage your hydrogen production facilities and processes."
      icon={Factory}
    />
  );
};

export default Production;
