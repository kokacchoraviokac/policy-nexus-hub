
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document } from "@/types/documents";
import { formatDistanceToNow } from "date-fns";

interface DocumentMetadataProps {
  document: Document;
}

const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ document }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-w-0">
      <h3 className="font-medium text-sm truncate">{document.document_name}</h3>
      <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
        <span className="truncate">{t(document.document_type)}</span>
        <span className="mx-1">•</span>
        <span>
          {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};

export default DocumentMetadata;
