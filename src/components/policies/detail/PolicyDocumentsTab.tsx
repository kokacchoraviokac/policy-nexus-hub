
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import DocumentList from "@/components/documents/unified/DocumentList";
import DocumentUploadDialog from "@/components/documents/unified/DocumentUploadDialog";

interface PolicyDocumentsTabProps {
  policyId: string;
}

const PolicyDocumentsTab: React.FC<PolicyDocumentsTabProps> = ({ policyId }) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  
  const {
    documents,
    isLoading,
    isError,
    error,
    deleteDocument,
    isDeleting,
    approveDocument
  } = useDocumentManager({ 
    entityType: "policy",
    entityId: policyId
  });
  
  const handleUploadClick = () => {
    setSelectedDocument(null);
    setUploadDialogOpen(true);
  };
  
  const handleUploadVersion = (document: any) => {
    setSelectedDocument(document);
    setUploadDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("policyDocuments")}</CardTitle>
            <CardDescription>{t("documentsAttachedToPolicy")}</CardDescription>
          </div>
          <Button onClick={handleUploadClick}>
            <Upload className="h-4 w-4 mr-2" />
            {t("uploadDocument")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DocumentList 
          documents={documents}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onDelete={(documentId) => deleteDocument(documentId)}
          isDeleting={isDeleting}
          showUploadButton={false}
          onUploadVersion={handleUploadVersion}
          onApprove={approveDocument}
        />
        
        {uploadDialogOpen && (
          <DocumentUploadDialog
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            entityType="policy"
            entityId={policyId}
            selectedDocument={selectedDocument}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyDocumentsTab;
