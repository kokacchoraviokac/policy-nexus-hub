
import React from "react";
import { Download, Trash2, Loader2, MoreVertical } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Document } from "@/hooks/useDocuments";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";

interface DocumentActionsProps {
  document: Document;
  onDelete: () => void;
  isDeleting?: boolean;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  onDelete,
  isDeleting = false
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
        <DropdownMenuItem 
          onClick={() => downloadDocument(document)} 
          disabled={isDownloading}
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? t("downloading") : t("download")}
        </DropdownMenuItem>
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
  );
};

export default DocumentActions;
