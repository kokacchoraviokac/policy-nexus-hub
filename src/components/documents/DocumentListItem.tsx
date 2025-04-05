
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, FileBox, Clock } from "lucide-react";
import { Document } from "@/types/documents";
import DocumentActions from "./DocumentActions";

interface DocumentListItemProps {
  document: Document;
  onDelete: () => void;
  isDeleting?: boolean;
  showApproval?: boolean;
  onUploadVersion?: (document: Document) => void;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDelete,
  isDeleting = false,
  showApproval = true,
  onUploadVersion
}) => {
  const { t, formatDateTime } = useLanguage();
  
  // Helper to get icon based on mime type or document type
  const getDocumentIcon = () => {
    if (document.mime_type?.includes('pdf')) {
      return <FileText className="h-8 w-8 text-destructive" />;
    } else if (document.mime_type?.includes('image')) {
      return <FileBox className="h-8 w-8 text-blue-500" />;
    } else {
      return <FileText className="h-8 w-8 text-primary" />;
    }
  };
  
  // Helper to get approval status badge
  const getApprovalStatusBadge = () => {
    if (!showApproval || !document.approval_status) return null;
    
    const variantMap: Record<string, any> = {
      approved: "success",
      rejected: "destructive",
      pending: "outline",
      needs_review: "warning"
    };
    
    return (
      <Badge variant={variantMap[document.approval_status] || "default"}>
        {t(document.approval_status)}
      </Badge>
    );
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {getDocumentIcon()}
            
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">
                  {document.document_name}
                </h4>
                {document.is_latest_version && document.version && document.version > 1 && (
                  <Badge variant="outline" className="text-xs">
                    v{document.version}
                  </Badge>
                )}
                {getApprovalStatusBadge()}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {t(document.document_type)} {document.category && `• ${t(document.category)}`}
              </div>
              
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {formatDateTime(document.created_at)}
                {document.uploaded_by && (
                  <span className="ml-2">
                    {t("uploadedBy")}: {document.uploaded_by_name || document.uploaded_by}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <DocumentActions
            document={document}
            onDelete={onDelete}
            isDeleting={isDeleting}
            onUploadVersion={onUploadVersion ? 
              () => onUploadVersion(document) : undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentListItem;
