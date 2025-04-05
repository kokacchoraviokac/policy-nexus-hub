
import React, { useState } from "react";
import { Download, Trash2, FileText, Upload, Info, CheckCircle, XCircle, AlertCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDocumentIcon, getDocumentTypeLabel } from "@/utils/documentUtils";
import { Document, DocumentApprovalStatus } from "@/types/documents";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import DocumentPreview from "./DocumentPreview";
import DocumentApprovalDialog from "./DocumentApprovalDialog";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";

interface DocumentListItemProps {
  document: Document;
  onDelete: () => void;
  onUploadVersion?: () => void;
  showApproval?: boolean;
  isDeleting?: boolean;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDelete,
  onUploadVersion,
  showApproval = true,
  isDeleting = false
}) => {
  const { formatDate, t } = useLanguage();
  const [showPreview, setShowPreview] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const { isDownloading, downloadDocument } = useDocumentDownload();
  
  const onDownload = () => {
    downloadDocument(document);
  };
  
  const getApprovalStatusIcon = (status?: DocumentApprovalStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "needs_review":
      case "pending":
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getApprovalStatusBadge = (status?: DocumentApprovalStatus) => {
    if (!status) return null;
    
    const variants: Record<string, string> = {
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      needs_review: "bg-amber-100 text-amber-800 border-amber-200",
      pending: "bg-gray-100 text-gray-800 border-gray-200"
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`ml-2 text-xs ${variants[status]}`}
      >
        {getApprovalStatusIcon(status)}
        <span className="ml-1">{t(status)}</span>
      </Badge>
    );
  };
  
  return (
    <div className="py-4 flex justify-between items-start border-b last:border-b-0">
      <div className="flex items-start space-x-3">
        <div className="mt-1 text-muted-foreground">
          {getDocumentIcon(document)}
        </div>
        <div>
          <div className="flex items-center">
            <p 
              className="font-medium cursor-pointer hover:underline"
              onClick={() => setShowPreview(true)}
            >
              {document.document_name}
            </p>
            {document.version && document.version > 1 && (
              <span className="ml-2 text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                v{document.version}
              </span>
            )}
            {document.is_latest_version && document.version && document.version > 1 && (
              <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                {t("latest")}
              </span>
            )}
            {showApproval && getApprovalStatusBadge(document.approval_status)}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="mr-3">{getDocumentTypeLabel(document.document_type)}</span>
            <span>{formatDate(document.created_at)}</span>
          </div>
          {document.description && (
            <p className="text-xs mt-1 text-muted-foreground">
              {document.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowPreview(true)}>
              <FileText className="mr-2 h-4 w-4" />
              {t("preview")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownload} disabled={isDownloading}>
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? t("downloading") : t("download")}
            </DropdownMenuItem>
            {onUploadVersion && (
              <DropdownMenuItem onClick={onUploadVersion}>
                <Upload className="mr-2 h-4 w-4" />
                {t("uploadNewVersion")}
              </DropdownMenuItem>
            )}
            {showApproval && (
              <DropdownMenuItem onClick={() => setShowApprovalDialog(true)}>
                {getApprovalStatusIcon(document.approval_status)}
                <span className="ml-2">{t("updateApprovalStatus")}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={onDelete}
              disabled={isDeleting}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? t("deleting") : t("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <DocumentPreview
        document={document}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
      
      {showApproval && (
        <DocumentApprovalDialog
          document={document}
          open={showApprovalDialog}
          onOpenChange={setShowApprovalDialog}
        />
      )}
    </div>
  );
};

export default DocumentListItem;
