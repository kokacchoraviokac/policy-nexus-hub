
import React from "react";
import { Download, Trash2, Loader2, Eye, MoreVertical, History, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Document } from "@/types/documents";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";

interface DocumentActionsProps {
  document: Document;
  onDelete: () => void;
  isDeleting?: boolean;
  onView?: () => void;
  onUploadVersion?: (document: Document) => void;
  hideDelete?: boolean;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  onDelete,
  isDeleting = false,
  onView,
  onUploadVersion,
  hideDelete = false
}) => {
  const { t } = useLanguage();
  const { isDownloading, downloadDocument } = useDocumentDownload();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">{t("openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            {t("view")}
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={() => downloadDocument(document)} 
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
        
        {!hideDelete && (
          <>
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
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DocumentActions;
