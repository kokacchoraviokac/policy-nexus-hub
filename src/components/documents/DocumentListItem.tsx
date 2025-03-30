
import React, { useState } from "react";
import { Document } from "@/types/documents";
import { Card, CardContent } from "@/components/ui/card";
import { getDocumentIcon } from "@/utils/documentIconUtils";
import DocumentMetadata from "./DocumentMetadata";
import DocumentActions from "./DocumentActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldX, Clock, FileHistory, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import DocumentVersionHistory from "./DocumentVersionHistory";
import DocumentApprovalPanel from "./DocumentApprovalPanel";

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
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  
  const getApprovalBadge = () => {
    if (!document.approval_status) return null;
    
    switch (document.approval_status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            {t("approved")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <ShieldX className="h-3 w-3" />
            {t("rejected")}
          </Badge>
        );
      case "needs_review":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {t("needsReview")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t("pending")}
          </Badge>
        );
    }
  };
  
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center gap-4">
            {getDocumentIcon(document.file_path, document.mime_type)}
            
            <DocumentMetadata document={document} />
            
            <div className="ml-auto flex items-center gap-2">
              {document.category && (
                <Badge variant="outline" className="bg-gray-100">
                  {t(document.category)}
                </Badge>
              )}
              
              {document.approval_status && getApprovalBadge()}
              
              {document.version && document.version > 1 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileHistory className="h-3 w-3" />
                  {t("version")} {document.version}
                </Badge>
              )}
              
              <DocumentActions 
                document={document}
                onDelete={onDelete}
                isDeleting={isDeleting}
                onUploadVersion={onUploadVersion}
              />
            </div>
          </div>
          
          {showApproval && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 h-8 text-xs"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  {t("hideDetails")}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  {t("showDetails")}
                </>
              )}
            </Button>
          )}
        </div>
        
        {expanded && (
          <div className="border-t p-4 bg-muted/20">
            <div className="grid gap-4 md:grid-cols-2">
              {(document.original_document_id || document.version && document.version > 1) && (
                <DocumentVersionHistory 
                  documentId={document.id}
                  originalDocumentId={document.original_document_id}
                />
              )}
              
              {showApproval && (
                <DocumentApprovalPanel document={document} />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentListItem;
