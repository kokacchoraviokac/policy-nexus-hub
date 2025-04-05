
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useSalesProcessDocuments } from '@/hooks/sales/useSalesProcessDocuments';
import DocumentList from '@/components/documents/DocumentList';
import DocumentUploadDialog from '@/components/documents/unified/DocumentUploadDialog';
import { Document } from '@/types/documents';
import { useDocumentManager } from '@/hooks/useDocumentManager';

interface SalesProcessDocumentsProps {
  salesProcessId: string;
  salesStage?: string;
  title?: string;
  showUploadButton?: boolean;
}

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({ 
  salesProcessId,
  salesStage,
  title = "Documents",
  showUploadButton = true
}) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const { 
    documents, 
    isLoading,
    error,
    documentsCount
  } = useSalesProcessDocuments(salesProcessId);
  
  const {
    deleteDocument,
    isDeletingDocument,
    updateDocumentApproval,
    isApprovingDocument
  } = useDocumentManager();
  
  const handleDocumentApproval = async (document: Document, status: string, notes: string) => {
    await updateDocumentApproval(document.id, status as any, notes);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {showUploadButton && (
          <Button
            onClick={() => setUploadDialogOpen(true)}
            variant="outline"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("uploadDocument")}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <DocumentList
          entityType="sales_process"
          entityId={salesProcessId}
          documents={documents}
          isLoading={isLoading}
          isError={!!error}
          error={error || undefined}
          onDelete={deleteDocument}
          isDeleting={isDeletingDocument}
          showUploadButton={false}
        />
        
        <DocumentUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          entityType="sales_process"
          entityId={salesProcessId}
          onUploadComplete={() => {}}
          salesStage={salesStage}
        />
      </CardContent>
    </Card>
  );
};

export default SalesProcessDocuments;
