
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import DocumentUploadDialog from "@/components/documents/unified/DocumentUploadDialog";
import DocumentList from "@/components/documents/unified/DocumentList";
import { EntityType } from "@/types/common";

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
    refreshDocuments,
    deleteDocument,
    isDeleting,
    updateDocumentApproval
  } = useDocumentManager({ 
    entityType: EntityType.POLICY,
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

  // Adapter function to make deleteDocument compatible with DocumentList
  const handleDeleteDocument = (document: any) => {
    const documentId = typeof document === 'string' ? document : document.id;
    deleteDocument(documentId);
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
          error={error as Error}
          onDelete={handleDeleteDocument}
          isDeleting={isDeleting}
          showUploadButton={false}
          onUploadVersion={handleUploadVersion}
          entityType={EntityType.POLICY}
          entityId={policyId}
        />
        
        <DocumentUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          entityType={EntityType.POLICY}
          entityId={policyId}
          selectedDocument={selectedDocument}
          onUploadComplete={refreshDocuments}
        />
      </CardContent>
    </Card>
  );
};

export default PolicyDocumentsTab;
