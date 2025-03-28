
import React from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { Loader2, FileX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import DocumentListItem from "./DocumentListItem";

interface DocumentListProps {
  entityType: "policy" | "claim" | "client" | "insurer" | "sales_process" | "agent";
  entityId: string;
  onUploadClick?: () => void;
  showUploadButton?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  entityType, 
  entityId,
  onUploadClick,
  showUploadButton = true
}) => {
  const { t } = useLanguage();
  const { 
    documents, 
    isLoading, 
    error, 
    deleteDocument, 
    isDeletingDocument 
  } = useDocuments({
    entityType,
    entityId
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <FileX className="h-10 w-10 text-destructive mb-2" />
            <h3 className="text-lg font-medium">{t("errorLoadingDocuments")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("pleaseTryAgainLater")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium">{t("noDocuments")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("noDocumentsUploaded")}
            </p>
            {showUploadButton && onUploadClick && (
              <Button onClick={onUploadClick} className="mt-4">
                {t("uploadDocument")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map(document => (
        <DocumentListItem 
          key={document.id} 
          document={document}
          onDelete={() => deleteDocument(document.id)}
          isDeleting={isDeletingDocument}
        />
      ))}
      {showUploadButton && onUploadClick && (
        <div className="mt-4 flex justify-end">
          <Button onClick={onUploadClick}>
            {t("uploadDocument")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
