
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { DocumentUploadDialog } from '@/components/documents/DocumentUploadDialog';
import { Document, DocumentApprovalStatus } from '@/types/documents';
import { useDocumentManager } from '@/hooks/useDocumentManager';
import DocumentList from '@/components/documents/unified/DocumentList';

interface SalesProcessDocumentsProps {
  salesProcessId: string;
  currentStage?: string;
}

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({ 
  salesProcessId,
  currentStage 
}) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const { 
    documents,
    isLoading,
    isError,
    error,
    deleteDocument,
    approveDocument,
    isDeleting 
  } = useDocumentManager({
    entityType: 'sales_process',
    entityId: salesProcessId
  });
  
  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };
  
  const handleUploadSuccess = () => {
    setUploadDialogOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{t('documents')}</CardTitle>
        <Button onClick={handleUploadClick} size="sm">
          <Upload className="h-4 w-4 mr-2" />
          {t('uploadDocument')}
        </Button>
      </CardHeader>
      <CardContent>
        <DocumentList 
          documents={documents || []}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onDelete={(documentId) => deleteDocument(documentId)} // Pass string instead of Document
          isDeleting={isDeleting}
          onApprove={(document, status, notes) => approveDocument(document, status, notes)}
        />
        
        <DocumentUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          entityType="sales_process"
          entityId={salesProcessId}
          onSuccess={handleUploadSuccess}
          additionalData={{ step: currentStage || '' }}
        />
      </CardContent>
    </Card>
  );
};

export default SalesProcessDocuments;
