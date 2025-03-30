
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document } from "@/hooks/useDocuments";
import { Badge } from "@/components/ui/badge";

interface DocumentMetadataProps {
  document: Document;
}

const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ document }) => {
  const { t, formatDate } = useLanguage();
  
  return (
    <div className="flex-1">
      <div className="flex flex-col">
        <h3 className="font-medium">{document.document_name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline">{document.document_type}</Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(document.created_at)}
          </span>
        </div>
        {document.uploaded_by_name && (
          <span className="text-xs text-muted-foreground mt-1">
            {t("uploadedBy")}: {document.uploaded_by_name}
          </span>
        )}
      </div>
    </div>
  );
};

export default DocumentMetadata;
