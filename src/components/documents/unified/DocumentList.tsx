
import React, { useState, useMemo } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { Loader2, FileX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import DocumentListItem from "./DocumentListItem";
import DocumentUploadDialog from "./DocumentUploadDialog";
import { PolicyDocument, DocumentCategory } from "@/types/documents";
import { EntityType } from "@/types/common";

interface DocumentListProps {
  entityType: EntityType;
  entityId: string;
  onUploadClick?: () => void;
  showUploadButton?: boolean;
  showApproval?: boolean;
  filterCategory?: string;
  documents?: PolicyDocument[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onDelete?: (documentId: string | PolicyDocument) => void;
  isDeleting?: boolean;
  onUploadVersion?: (document: PolicyDocument) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  entityType, 
  entityId,
  onUploadClick,
  showUploadButton = true,
  showApproval = true,
  filterCategory,
  documents: providedDocuments,
  isLoading: providedIsLoading,
  isError: providedIsError,
  error: providedError,
  onDelete: providedOnDelete,
  isDeleting: providedIsDeleting,
  onUploadVersion
}) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PolicyDocument | undefined>(undefined);
  
  // Use provided props if available, otherwise fetch documents using the hook
  const { 
    documents: fetchedDocuments, 
    isLoading: isLoadingFetched, 
    error: errorFetched, 
    deleteDocument: deleteDocumentFetched, 
    isDeletingDocument: isDeletingFetched,
    refresh: refreshDocuments
  } = useDocuments(entityType, entityId);
  
  const documents = providedDocuments || fetchedDocuments;
  const isLoading = providedIsLoading !== undefined ? providedIsLoading : isLoadingFetched;
  const isError = providedIsError !== undefined ? providedIsError : !!errorFetched;
  const error = providedError || errorFetched;
  const isDeleting = providedIsDeleting !== undefined ? providedIsDeleting : isDeletingFetched;

  // Custom delete document handler that manages both string IDs and Document objects
  const handleDeleteDocument = (documentIdOrObject: string | PolicyDocument) => {
    if (providedOnDelete) {
      providedOnDelete(documentIdOrObject);
    } else if (deleteDocumentFetched) {
      // Extract document ID if a Document object was passed
      const documentId = typeof documentIdOrObject === 'string' 
        ? documentIdOrObject 
        : documentIdOrObject.id;
      
      deleteDocumentFetched(documentId);
    }
  };

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
  
  const handleUploadVersion = (document: PolicyDocument) => {
    if (onUploadVersion) {
      onUploadVersion(document);
    } else {
      setSelectedDocument(document);
      setUploadDialogOpen(true);
    }
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
          onDelete={() => handleDeleteDocument(document)}
          isDeleting={isDeleting}
          showApproval={showApproval}
          onUploadVersion={() => handleUploadVersion(document)}
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
        onUploadComplete={refreshDocuments}
      />
    </div>
  );
};

export default DocumentList;
