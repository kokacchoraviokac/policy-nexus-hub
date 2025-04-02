
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, AlertCircle, Plus } from "lucide-react";
import { Document, EntityType } from "@/types/documents";
import DocumentListItem from "./DocumentListItem";

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onDelete: (document: Document) => void;
  isDeleting?: boolean;
  onUploadClick?: () => void;
  showUploadButton?: boolean;
  showApproval?: boolean;
  filterCategory?: string;
  onUploadVersion?: (document: Document) => void;
  emptyMessage?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  isError,
  error,
  onDelete,
  isDeleting = false,
  onUploadClick,
  showUploadButton = true,
  showApproval = true,
  filterCategory,
  onUploadVersion,
  emptyMessage
}) => {
  const { t } = useLanguage();
  
  // Filter documents by category if filterCategory is provided
  const filteredDocuments = React.useMemo(() => {
    if (!filterCategory) return documents;
    return documents.filter(doc => doc.category === filterCategory);
  }, [documents, filterCategory]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">{t("loadingDocuments")}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-2" />
            <h3 className="text-lg font-medium">{t("errorLoadingDocuments")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error?.message || t("pleaseTryAgainLater")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!filteredDocuments || filteredDocuments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">{t("noDocuments")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {emptyMessage || 
               (filterCategory 
                ? t("noDocumentsInCategory", { category: filterCategory }) 
                : t("noDocumentsUploaded"))}
            </p>
            {showUploadButton && onUploadClick && (
              <Button onClick={onUploadClick} className="mt-4">
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
          isDeleting={isDeleting}
          showApproval={showApproval}
          onUploadVersion={onUploadVersion ? 
            () => onUploadVersion(document) : undefined}
        />
      ))}
      
      {showUploadButton && onUploadClick && (
        <div className="mt-4 flex justify-end">
          <Button onClick={onUploadClick}>
            <Plus className="mr-2 h-4 w-4" />
            {t("uploadDocument")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
