
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import DocumentList from "@/components/documents/unified/DocumentList";
import DocumentUploadDialog from "@/components/documents/unified/DocumentUploadDialog";
import { Document } from "@/types/documents";

interface SalesProcessDocumentsProps {
  salesProcessId: string;
  step?: string;
}

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({
  salesProcessId,
  step
}) => {
  const { t } = useLanguage();
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const {
    documents,
    isLoading,
    isError,
    error,
    deleteDocument,
    isDeleting,
    approveDocument
  } = useDocumentManager({
    entityType: "sales_process",
    entityId: salesProcessId
  });
  
  const filteredDocuments = step
    ? documents.filter(doc => doc.step === step)
    : documents;

  const handleAddDocument = () => {
    setShowUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setShowUploadDialog(false);
  };

  return (
    <Card>
      <CardContent className="p-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{t("documents")}</h3>
          <Button size="sm" onClick={handleAddDocument}>
            <Plus className="h-4 w-4 mr-1" /> {t("addDocument")}
          </Button>
        </div>

        <DocumentList
          documents={filteredDocuments}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onDelete={(documentId) => deleteDocument(documentId)}
          isDeleting={isDeleting}
          onApprove={approveDocument}
        />

        <DocumentUploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          entityType="sales_process"
          entityId={salesProcessId}
          onSuccess={handleCloseUploadDialog}
          additionalData={{ step }}
        />
      </CardContent>
    </Card>
  );
};

export default SalesProcessDocuments;
