
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDocumentIcon } from "@/utils/documentUtils";
import { Download, Trash2, Loader2, MoreVertical, History } from "lucide-react";
import { Document } from "@/types/documents";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface DocumentListItemProps {
  document: Document;
  onDelete: () => void;
  isDeleting: boolean;
  onDownload: () => void;
  isDownloading: boolean;
  onUploadVersion?: (document: Document) => void;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDelete,
  isDeleting,
  onDownload,
  isDownloading,
  onUploadVersion
}) => {
  const { t, formatDateTime } = useLanguage();
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="mt-1">
              {getDocumentIcon(document)}
            </div>
            
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
                {document.approval_status && (
                  <Badge 
                    variant={document.approval_status === 'approved' ? 'success' : 
                           document.approval_status === 'rejected' ? 'destructive' : 'outline'}
                    className="text-xs"
                  >
                    {t(document.approval_status)}
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {t(document.document_type)} {document.category && `• ${t(document.category)}`}
              </div>
              
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <span>{formatDateTime(document.created_at)}</span>
                {document.uploaded_by_name && (
                  <span className="ml-2">
                    {t("uploadedBy")}: {document.uploaded_by_name}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">{t("actions")}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={onDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {isDownloading ? t("downloading") : t("download")}
              </DropdownMenuItem>
              
              {onUploadVersion && (
                <DropdownMenuItem onClick={() => onUploadVersion(document)}>
                  <History className="mr-2 h-4 w-4" />
                  {t("uploadNewVersion")}
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={onDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentListItem;
