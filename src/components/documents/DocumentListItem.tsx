
import React from "react";
import { FileText, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document } from "@/hooks/useDocuments";

interface DocumentListItemProps {
  document: Document;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  onDownload?: (id: string) => void;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDelete,
  isDeleting,
  onDownload
}) => {
  const { t, formatDate } = useLanguage();
  
  return (
    <div className="py-4 flex justify-between items-start border-b last:border-b-0">
      <div className="flex items-start space-x-3">
        <FileText className="h-6 w-6 text-muted-foreground mt-1" />
        <div>
          <p className="font-medium">{document.document_name}</p>
          <div className="text-sm text-muted-foreground">
            <span className="mr-3">{document.document_type}</span>
            <span>{formatDate(document.created_at)}</span>
          </div>
          {document.uploaded_by_name && (
            <p className="text-xs mt-1">
              {t("uploadedBy")}: {document.uploaded_by_name}
            </p>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        {onDownload && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDownload(document.id)}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(document.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DocumentListItem;
