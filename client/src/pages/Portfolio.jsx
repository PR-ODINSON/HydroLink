import React from 'react';
import PlaceholderPage from '../components/PlaceholderPage';
import { Target } from 'lucide-react';

const Portfolio = () => {
  return (
    <PlaceholderPage
      title="Portfolio"
      description="Manage your credit portfolio, track investments and monitor performance."
      icon={Target}
    />
  );
};

export default Portfolio;
