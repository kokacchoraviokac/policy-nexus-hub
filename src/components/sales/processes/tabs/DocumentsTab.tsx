
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EntityType } from '@/types/common';
import { SalesProcess } from '@/types/salesProcess';
import DocumentList from '@/components/documents/unified/DocumentList';
import DocumentUploadDialog from '@/components/documents/unified/DocumentUploadDialog';
import { useSalesProcessDocuments } from '@/hooks/sales/useSalesProcessDocuments';

export interface DocumentsTabProps {
  salesProcess: SalesProcess;
  salesStage?: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ salesProcess, salesStage }) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const {
    documents,
    isLoading,
    error,
    documentsCount,
    refetch,
    deleteDocument,
    isDeletingDocument,
    isError
  } = useSalesProcessDocuments(salesProcess.id);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{t("documents")}</CardTitle>
          <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
            {t("uploadDocument")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DocumentList
          entityType={EntityType.SALES_PROCESS}
          entityId={salesProcess.id}
          documents={documents}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onDelete={deleteDocument}
          isDeleting={isDeletingDocument}
          showUploadButton={false}
        />
        
        <DocumentUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          entityType={EntityType.SALES_PROCESS}
          entityId={salesProcess.id}
          salesStage={salesStage}
          onUploadComplete={refetch}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
