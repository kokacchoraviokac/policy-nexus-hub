
import React from 'react';
import SalesProcessDocuments from '../../documents/SalesProcessDocuments';
import { SalesProcessStage } from '@/types/sales';

interface DocumentsTabProps {
  salesProcessId: string;
  currentStage: SalesProcessStage;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ salesProcessId, currentStage }) => {
  return (
    <div className="mt-4">
      <SalesProcessDocuments 
        salesProcessId={salesProcessId} 
        currentStage={currentStage} 
      />
    </div>
  );
};

export default DocumentsTab;
