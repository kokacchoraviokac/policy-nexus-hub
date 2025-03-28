import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePolicyDocuments, PolicyDocument } from "@/hooks/usePolicyDocuments";
import DocumentListItem from "./document/DocumentListItem";
import EmptyDocumentList from "./document/EmptyDocumentList";
import DocumentsLoadError from "./document/DocumentsLoadError";
import DeleteDocumentDialog from "./document/DeleteDocumentDialog";
import DocumentUploadDialog from "./document/DocumentUploadDialog";

interface PolicyDocumentsTabProps {
  policyId: string;
}

const PolicyDocumentsTab: React.FC<PolicyDocumentsTabProps> = ({ policyId }) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<PolicyDocument | null>(null);
  
  const {
    documents,
    isLoading,
    isError,
    refetch,
    deleteDocument,
    downloadDocument
  } = usePolicyDocuments(policyId);

  const handleUploadDocument = () => {
    setUploadDialogOpen(true);
  };

  const handleDownloadDocument = (document: PolicyDocument) => {
    downloadDocument(document);
  };

  const handleDeleteDocument = (document: PolicyDocument) => {
    setDocumentToDelete(document);
  };
  
  const confirmDeleteDocument = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete);
      setDocumentToDelete(null);
    }
  };

  if (isError) {
    return <DocumentsLoadError onRetry={refetch} />;
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">{t("policyDocuments")}</h3>
            <Button onClick={handleUploadDocument}>
              <FileUp className="mr-2 h-4 w-4" />
              {t("uploadDocument")}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="divide-y">
              {documents.map((document) => (
                <DocumentListItem
                  key={document.id}
                  document={document}
                  onDownload={handleDownloadDocument}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          ) : (
            <EmptyDocumentList onUpload={handleUploadDocument} />
          )}
        </CardContent>
      </Card>
      
      <DocumentUploadDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen} 
        policyId={policyId}
      />
      
      <DeleteDocumentDialog
        document={documentToDelete}
        open={!!documentToDelete}
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
        onConfirm={confirmDeleteDocument}
      />
    </>
  );
};

export default PolicyDocumentsTab;
