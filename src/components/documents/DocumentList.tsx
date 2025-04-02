
import React, { useState, useMemo } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { Loader2, FileX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import DocumentListItem from "./DocumentListItem";
import DocumentUploadDialog from "./DocumentUploadDialog";
import { Document, EntityType } from "@/types/documents";

interface DocumentListProps {
  entityType: EntityType;
  entityId: string;
  onUploadClick?: () => void;
  showUploadButton?: boolean;
  showApproval?: boolean;
  filterCategory?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  entityType, 
  entityId,
  onUploadClick,
  showUploadButton = true,
  showApproval = true,
  filterCategory
}) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>(undefined);
  
  const { 
    documents, 
    isLoading, 
    error, 
    deleteDocument, 
    isDeletingDocument 
  } = useDocuments(entityType, entityId);
  
  // Filter documents by category if filterCategory is provided
  const filteredDocuments = useMemo(() => {
    if (!filterCategory) return documents;
    return documents.filter(doc => doc.category === filterCategory);
  }, [documents, filterCategory]);

  const handleUploadClick = () => {
    if (onUploadClick) {
      onUploadClick();
    } else {
      setSelectedDocument(undefined);
      setUploadDialogOpen(true);
    }
  };
  
  const handleUploadVersion = (document: Document) => {
    setSelectedDocument(document);
    setUploadDialogOpen(true);
  };

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

  if (!filteredDocuments || filteredDocuments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium">{t("noDocuments")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filterCategory 
                ? t("noDocumentsInCategory", { category: filterCategory }) 
                : t("noDocumentsUploaded")}
            </p>
            {showUploadButton && (
              <Button onClick={handleUploadClick} className="mt-4">
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
          onDelete={() => deleteDocument(document.id)}
          isDeleting={isDeletingDocument}
          showApproval={showApproval}
          onUploadVersion={handleUploadVersion}
        />
      ))}
      {showUploadButton && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleUploadClick}>
            {t("uploadDocument")}
          </Button>
        </div>
      )}
      
      <DocumentUploadDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen} 
        entityType={entityType}
        entityId={entityId}
        selectedDocument={selectedDocument}
      />
    </div>
  );
};

export default DocumentList;
