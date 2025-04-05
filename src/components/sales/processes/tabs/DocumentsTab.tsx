
import React from 'react';
import SalesProcessDocuments from '../../documents/SalesProcessDocuments';
import { SalesProcess } from '@/types/sales';

interface DocumentsTabProps {
  process: SalesProcess;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ process }) => {
  return (
    <div className="mt-4">
      <SalesProcessDocuments 
        salesProcessId={process.id} 
        salesStage={process.current_step}
      />
    </div>
  );
};

export default DocumentsTab;
