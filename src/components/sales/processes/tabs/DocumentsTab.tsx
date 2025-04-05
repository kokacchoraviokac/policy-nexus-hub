
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SalesProcessDocuments from '@/components/sales/documents/SalesProcessDocuments';
import { SalesProcess } from '@/types/sales';

export interface DocumentsTabProps {
  salesProcess: SalesProcess;
  salesStage: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ salesProcess, salesStage }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <SalesProcessDocuments 
          salesProcess={salesProcess}
          salesStage={salesStage}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
