
import React, { useState, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useDocumentManager } from "@/hooks/useDocumentManager";

// Lazy load the document components
const DocumentList = React.lazy(() => import("@/components/documents/unified/DocumentList"));
const DocumentUploadDialog = React.lazy(() => import("@/components/documents/unified/DocumentUploadDialog"));

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
    isDeleting
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
        <Suspense fallback={
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <DocumentList 
            documents={documents}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onDelete={deleteDocument}
            isDeleting={isDeleting}
            showUploadButton={false}
            onUploadVersion={handleUploadVersion}
          />
        </Suspense>
        
        <Suspense fallback={null}>
          {uploadDialogOpen && (
            <DocumentUploadDialog
              open={uploadDialogOpen}
              onOpenChange={setUploadDialogOpen}
              entityType="policy"
              entityId={policyId}
              selectedDocument={selectedDocument}
            />
          )}
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default PolicyDocumentsTab;
