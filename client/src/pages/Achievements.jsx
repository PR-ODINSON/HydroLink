import React from 'react';
import PlaceholderPage from '../components/PlaceholderPage';
import { Award } from 'lucide-react';

const Achievements = () => {
  return (
    <PlaceholderPage
      title="Achievements"
      description="Track your production milestones, efficiency awards, and sustainability achievements."
      icon={Award}
    />
  );
};

export default Achievements;
