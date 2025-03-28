
import React from "react";
import { Download, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { PolicyDocument } from "@/hooks/usePolicyDocuments";

interface DocumentListItemProps {
  document: PolicyDocument;
  onDownload: (document: PolicyDocument) => void;
  onDelete: (document: PolicyDocument) => void;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDownload,
  onDelete
}) => {
  const { formatDate } = useLanguage();
  const { t } = useLanguage();
  
  return (
    <div className="py-4 flex justify-between items-start">
      <div className="flex items-start space-x-3">
        <FileText className="h-6 w-6 text-muted-foreground mt-1" />
        <div>
          <p className="font-medium">{document.document_name}</p>
          <div className="text-sm text-muted-foreground">
            <span className="mr-3">{document.document_type}</span>
            <span>{formatDate(document.created_at)}</span>
          </div>
          <p className="text-xs mt-1">
            {t("uploadedBy")}: {document.uploaded_by_name}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDownload(document)}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(document)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentListItem;
