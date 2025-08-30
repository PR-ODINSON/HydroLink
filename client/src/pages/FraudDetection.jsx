import React from 'react';
import PlaceholderPage from '../components/PlaceholderPage';
import { AlertTriangle } from 'lucide-react';

const FraudDetection = () => {
  return (
    <PlaceholderPage
      title="Fraud Detection"
      description="AI-powered fraud detection system to identify suspicious credit activities."
      icon={AlertTriangle}
    />
  );
};

export default FraudDetection;
