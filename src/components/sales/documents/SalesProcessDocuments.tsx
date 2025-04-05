
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSalesProcessDocuments } from "@/hooks/sales/useSalesProcessDocuments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Loader2 } from "lucide-react";
import DocumentList from "@/components/documents/DocumentList";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";
import { Document, DocumentApprovalStatus } from "@/types/documents";
import { useToast } from "@/components/ui/use-toast";

interface SalesProcessDocumentsProps {
  salesProcessId: string;
}

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({ salesProcessId }) => {
  const { t } = useLanguage();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    documents,
    isLoading,
    isError,
    error,
    deleteDocument,
    isDeletingDocument,
    updateDocumentApproval
  } = useSalesProcessDocuments(salesProcessId);

  const handleDeleteDocument = async (documentId: Document | string) => {
    const id = typeof documentId === 'string' ? documentId : documentId.id;
    try {
      await deleteDocument(id);
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccessfully"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: t("errorDeletingDocument"),
        variant: "destructive",
      });
    }
  };

  const handleApproveDocument = async (document: Document, status: DocumentApprovalStatus, notes?: string) => {
    try {
      await updateDocumentApproval(document.id, status, notes);
      toast({
        title: t("documentStatusUpdated"),
        description: t("documentStatusUpdatedSuccessfully"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: t("errorUpdatingDocumentStatus"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-destructive">{t("errorLoadingDocuments")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error ? error.message : t("unknownError")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{t("documents")}</CardTitle>
        <Button
          size="sm"
          onClick={() => setUploadModalOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("uploadDocument")}
        </Button>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="py-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-2 text-lg font-semibold">{t("noDocuments")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("noDocumentsDescription")}
            </p>
          </div>
        ) : (
          <DocumentList
            documents={documents}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onDelete={handleDeleteDocument}
            isDeleting={isDeletingDocument}
            showUploadButton={false}
          />
        )}
        
        <DocumentUploadDialog
          open={uploadModalOpen}
          onOpenChange={setUploadModalOpen}
          entityType="sales_process"
          entityId={salesProcessId}
        />
      </CardContent>
    </Card>
  );
};

export default SalesProcessDocuments;
