
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Loader2, AlertCircle } from "lucide-react";
import { Document } from "@/types/documents";
import DocumentListItem from "../DocumentListItem";

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  onDelete: (document: Document) => void;
  isDeleting?: boolean;
  showUploadVersion?: boolean;
  onUploadVersion?: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  isError,
  error,
  refetch,
  onDelete,
  isDeleting,
  showUploadVersion = false,
  onUploadVersion
}) => {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t("loadingDocuments")}</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <p className="font-medium text-destructive">{t("errorLoadingDocuments")}</p>
        <p className="text-sm text-muted-foreground mt-1 mb-3">{error?.message || t("unknownError")}</p>
        <button 
          className="text-sm text-primary hover:underline" 
          onClick={() => refetch()}
        >
          {t("tryAgain")}
        </button>
      </div>
    );
  }
  
  if (documents.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="font-medium">{t("noDocuments")}</p>
          <p className="text-sm text-muted-foreground mt-1">{t("noDocumentsDescription")}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <DocumentListItem
          key={document.id}
          document={document}
          onDelete={() => onDelete(document)}
          isDeleting={isDeleting}
          onUploadVersion={showUploadVersion && onUploadVersion ? 
            () => onUploadVersion(document) : undefined}
        />
      ))}
    </div>
  );
};

export default DocumentList;
