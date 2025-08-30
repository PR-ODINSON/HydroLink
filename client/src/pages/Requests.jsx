import React from 'react';
import PlaceholderPage from '../components/PlaceholderPage';
import { FileText } from 'lucide-react';

const Requests = () => {
  return (
    <PlaceholderPage
      title="Pending Requests"
      description="Manage pending verification requests and approval workflows."
      icon={FileText}
    />
  );
};

export default Requests;
