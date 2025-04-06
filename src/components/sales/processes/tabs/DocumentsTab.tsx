
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SalesProcessDocuments, { SalesProcessDocumentsProps } from '@/components/sales/documents/SalesProcessDocuments';
import { SalesProcess } from '@/types/sales';

export interface DocumentsTabProps {
  salesProcess: SalesProcess;
  process?: SalesProcess; // Alias for compatibility
  salesStage?: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ salesProcess, process, salesStage = 'default' }) => {
  // Use the salesProcess prop, but fall back to process if provided
  const effectiveProcess = salesProcess || process;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <SalesProcessDocuments 
          process={effectiveProcess}
          salesStage={salesStage}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
