
import React, { useState } from 'react';
import { useSalesProcessDocuments } from '@/hooks/sales/useSalesProcessDocuments';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import DocumentList from '@/components/documents/unified/DocumentList';
import DocumentUploadDialog from '@/components/documents/unified/DocumentUploadDialog';
import { Document, DocumentApprovalStatus, DocumentCategory } from '@/types/documents';
import { SalesProcess } from '@/types/sales';

export interface SalesProcessDocumentsProps {
  salesProcess: SalesProcess;
  salesStage: string;
}

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({ 
  salesProcess,
  salesStage 
}) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const {
    documents,
    isLoading,
    error,
    documentsCount,
    refetch,
    deleteDocument,
    updateDocumentApproval
  } = useSalesProcessDocuments(salesProcess.id);
  
  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };
  
  const handleUploadComplete = () => {
    refetch();
  };
  
  const isError = !!error;
  
  const handleUpdateApproval = async (docId: string, status: DocumentApprovalStatus, notes?: string) => {
    if (updateDocumentApproval) {
      return updateDocumentApproval(docId, status, notes);
    }
    return Promise.resolve();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{t("documents")}</h3>
          <p className="text-sm text-muted-foreground">
            {documentsCount === 0 
              ? t("noDocumentsUploaded") 
              : t("documentsCount", { count: documentsCount })}
          </p>
        </div>
        <Button size="sm" onClick={handleUploadClick}>
          <Upload className="h-4 w-4 mr-2" />
          {t("uploadDocument")}
        </Button>
      </div>
      
      <DocumentList 
        documents={documents}
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        refetch={refetch}
        deleteDocument={(docId: string) => deleteDocument(docId)}
        updateDocumentApproval={handleUpdateApproval}
        entityType="sales_process"
        entityId={salesProcess.id}
      />
      
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        entityType="sales_process"
        entityId={salesProcess.id}
        onUploadComplete={handleUploadComplete}
        defaultCategory={"other" as DocumentCategory}
        salesStage={salesStage}
      />
    </div>
  );
};

export default SalesProcessDocuments;
