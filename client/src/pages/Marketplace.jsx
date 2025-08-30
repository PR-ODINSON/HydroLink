import React from 'react';
import PlaceholderPage from '../components/PlaceholderPage';
import { ShoppingCart } from 'lucide-react';

const Marketplace = () => {
  return (
    <PlaceholderPage
      title="Marketplace"
      description="Browse and purchase verified hydrogen credits from certified producers."
      icon={ShoppingCart}
    />
  );
};

export default Marketplace;
