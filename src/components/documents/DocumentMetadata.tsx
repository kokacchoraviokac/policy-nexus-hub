
import React from "react";
import { Document } from "@/hooks/useDocuments";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface DocumentMetadataProps {
  document: Document;
}

const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ document }) => {
  const { formatDate } = useLanguage();
  
  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
        <h4 className="font-medium truncate">{document.document_name}</h4>
        <Badge variant="outline" className="w-fit">
          {document.document_type}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        {formatDate(document.created_at)}
      </p>
    </div>
  );
};

export default DocumentMetadata;
