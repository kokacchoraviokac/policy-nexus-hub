
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import DocumentUploadDialog from "@/components/documents/unified/DocumentUploadDialog";
import DocumentList from "@/components/documents/unified/DocumentList";
import { SalesProcess } from "@/types/sales";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { DocumentCategory } from "@/types/documents";

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
  
  // Fetch documents using our document manager hook
  const { 
    documents, 
    isLoading, 
    error, 
    documentsCount, 
    refreshDocuments
  } = useDocumentManager({
    entityType: "sales_process",
    entityId: salesProcess.id
  });

  // Add any missing properties to ensure the interface is complete
  const isError = !!error;
  const refetch = refreshDocuments;
  const deleteDocument = (docId: string) => {
    // Implement document deletion if needed
    console.log("Delete document:", docId);
  };
  const updateDocumentApproval = (docId: string, status: string, notes?: string) => {
    // Implement document approval if needed
    console.log("Update document approval:", docId, status, notes);
  };

  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadComplete = () => {
    // Refresh documents after upload
    refreshDocuments();
  };

  const defaultCategory: DocumentCategory = "other";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("processDocuments")}</h3>
        <Button onClick={handleOpenUploadDialog}>
          {t("uploadDocument")}
        </Button>
      </div>
      
      <DocumentList
        documents={documents}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        deleteDocument={deleteDocument}
        updateDocumentApproval={updateDocumentApproval}
        entityType="sales_process"
        entityId={salesProcess.id}
      />
      
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        entityType="sales_process"
        entityId={salesProcess.id}
        onUploadComplete={handleUploadComplete}
        defaultCategory={defaultCategory}
        salesStage={salesStage}
      />
    </div>
  );
};

export default SalesProcessDocuments;
