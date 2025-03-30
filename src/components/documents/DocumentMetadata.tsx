
import React from "react";
import { formatDate } from "@/utils/format";
import { Document } from "@/types/documents";
import { useLanguage } from "@/contexts/LanguageContext";

interface DocumentMetadataProps {
  document: Document;
}

const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ document }) => {
  const { t } = useLanguage();
  
  // Calculate file size in KB or MB
  const getFileSize = () => {
    if (!document.file_size) return "";
    
    if (document.file_size < 1024 * 1024) {
      return `${(document.file_size / 1024).toFixed(1)} KB`;
    } else {
      return `${(document.file_size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  return (
    <div className="flex-1 min-w-0">
      <div className="font-medium truncate">{document.document_name}</div>
      <div className="text-sm text-muted-foreground">
        <span>{document.document_type}</span>
        {document.file_size && (
          <>
            <span className="mx-1">•</span>
            <span>{getFileSize()}</span>
          </>
        )}
        <span className="mx-1">•</span>
        <span>{formatDate(document.created_at)}</span>
        {document.uploaded_by_name && (
          <>
            <span className="mx-1">•</span>
            <span>{t("uploadedBy")}: {document.uploaded_by_name}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentMetadata;
