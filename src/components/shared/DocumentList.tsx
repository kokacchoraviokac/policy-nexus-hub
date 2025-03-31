
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, FileX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/documents";
import DocumentListItem from "@/components/documents/DocumentListItem";

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  refetch: () => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  isError,
  error,
  refetch,
  onDelete,
  isDeleting
}) => {
  const { t } = useLanguage();

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
            <Button onClick={refetch} className="mt-4" variant="outline">
              {t("retry")}
            </Button>
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
          onDelete={() => onDelete(document.id)}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default DocumentList;
