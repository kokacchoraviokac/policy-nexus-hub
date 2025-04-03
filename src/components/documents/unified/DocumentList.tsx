
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, FileX, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/documents";
import DocumentListItem from "./DocumentListItem";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  onDelete: (document: Document) => void;
  isDeleting: boolean;
  showUploadButton?: boolean; 
  onUploadClick?: () => void;
  onUploadVersion?: (document: Document) => void;
  filterCategory?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  isError,
  error,
  onDelete,
  isDeleting,
  showUploadButton = false,
  onUploadClick,
  onUploadVersion,
  filterCategory
}) => {
  const { t } = useLanguage();
  const { downloadDocument, isDownloading } = useDocumentDownload();
  
  // Filter documents by category if specified
  const filteredDocuments = filterCategory 
    ? documents.filter(doc => doc.category === filterCategory)
    : documents;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <FileX className="h-10 w-10 text-destructive mb-2" />
            <h3 className="text-lg font-medium">{t("errorLoadingDocuments")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error?.message || t("pleaseTryAgainLater")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium">
              {filterCategory ? t("noDocumentsInCategory") : t("noDocuments")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("noDocumentsUploaded")}
            </p>
            {showUploadButton && onUploadClick && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={onUploadClick}
              >
                <Plus className="mr-2 h-4 w-4" />
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
      {filteredDocuments.map(document => (
        <DocumentListItem 
          key={document.id} 
          document={document}
          onDelete={() => onDelete(document)}
          onDownload={() => downloadDocument(document)}
          onUploadVersion={onUploadVersion ? () => onUploadVersion(document) : undefined}
          isDeleting={isDeleting}
          isDownloading={isDownloading}
        />
      ))}
    </div>
  );
};

export default DocumentList;
