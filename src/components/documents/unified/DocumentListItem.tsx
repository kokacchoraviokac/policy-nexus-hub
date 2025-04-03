
import React from "react";
import { Download, Trash2, FileText, Upload, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDocumentIcon, getDocumentTypeLabel } from "@/utils/documentUtils";
import { Document } from "@/types/documents";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentListItemProps {
  document: Document;
  onDownload: () => void;
  onDelete: () => void;
  onUploadVersion?: () => void;
  isDeleting: boolean;
  isDownloading: boolean;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDownload,
  onDelete,
  onUploadVersion,
  isDeleting,
  isDownloading
}) => {
  const { formatDate } = useLanguage();
  const { t } = useLanguage();
  
  return (
    <div className="py-4 flex justify-between items-start border-b last:border-b-0">
      <div className="flex items-start space-x-3">
        <div className="mt-1 text-muted-foreground">
          {getDocumentIcon(document)}
        </div>
        <div>
          <div className="flex items-center">
            <p className="font-medium">{document.document_name}</p>
            {document.version > 1 && (
              <span className="ml-2 text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                v{document.version}
              </span>
            )}
            {document.is_latest_version && document.version > 1 && (
              <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                {t("latest")}
              </span>
            )}
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onDownload}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("download")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {onUploadVersion && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onUploadVersion}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("uploadNewVersion")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("delete")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default DocumentListItem;
