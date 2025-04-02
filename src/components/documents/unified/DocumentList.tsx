
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FilePlus, Loader2, AlertCircle } from "lucide-react";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import DocumentListItem from "./DocumentListItem";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import DocumentUploadDialog from "./DocumentUploadDialog";

interface DocumentListProps {
  entityType: EntityType;
  entityId: string;
  showUploadButton?: boolean;
  onUploadClick?: () => void;
  filterCategory?: DocumentCategory | string;
  filterSalesStage?: string;
  title?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  entityType, 
  entityId,
  showUploadButton = true,
  onUploadClick,
  filterCategory,
  filterSalesStage,
  title
}) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>(undefined);
  
  const { 
    documents, 
    isLoading, 
    isError, 
    error,
    refetch,
    deleteDocument,
    isDeletingDocument,
    downloadDocument,
    isDownloading
  } = useDocumentManager(entityType, entityId);
  
  // Filter documents by category and/or sales stage
  const filteredDocuments = React.useMemo(() => {
    let result = documents;
    
    if (filterCategory) {
      result = result.filter(doc => doc.category === filterCategory);
    }
    
    if (filterSalesStage && entityType === 'sales_process') {
      result = result.filter(doc => 'step' in doc && doc.step === filterSalesStage);
    }
    
    return result;
  }, [documents, filterCategory, filterSalesStage, entityType]);

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

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-2" />
            <h3 className="text-lg font-medium">{t("errorLoadingDocuments")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error ? error.message : t("pleaseTryAgainLater")}
            </p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              {t("retry")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!filteredDocuments || filteredDocuments.length === 0) {
    return (
      <>
        {title && <h3 className="font-medium mb-4">{title}</h3>}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">{t("noDocuments")}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filterCategory 
                  ? t("noDocumentsInCategory", { category: filterCategory }) 
                  : t("noDocumentsUploaded")}
              </p>
              {showUploadButton && (
                <Button onClick={handleUploadClick} className="mt-4">
                  <FilePlus className="mr-2 h-4 w-4" />
                  {t("uploadDocument")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{title}</h3>
          {showUploadButton && (
            <Button size="sm" onClick={handleUploadClick}>
              <FilePlus className="mr-2 h-4 w-4" />
              {t("uploadDocument")}
            </Button>
          )}
        </div>
      )}
      
      {filteredDocuments.map(document => (
        <DocumentListItem 
          key={document.id} 
          document={document}
          onDelete={() => deleteDocument(document.id)}
          isDeleting={isDeletingDocument}
          onDownload={() => downloadDocument(document)}
          isDownloading={isDownloading}
          onUploadVersion={handleUploadVersion}
        />
      ))}
      
      {showUploadButton && !title && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleUploadClick}>
            <FilePlus className="mr-2 h-4 w-4" />
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
        defaultCategory={filterCategory as string}
        salesStage={filterSalesStage}
      />
    </div>
  );
};

export default DocumentList;
