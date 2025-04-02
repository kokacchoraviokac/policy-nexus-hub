
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  FileBox, 
  Clock, 
  Download, 
  Trash2, 
  Loader2, 
  MoreHorizontal,
  FileUp
} from "lucide-react";
import { Document } from "@/types/documents";
import { DocumentService } from "@/services/DocumentService";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface DocumentListItemProps {
  document: Document;
  onDelete: () => void;
  isDeleting?: boolean;
  showApproval?: boolean;
  onUploadVersion?: () => void;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDelete,
  isDeleting = false,
  showApproval = true,
  onUploadVersion
}) => {
  const { t, formatDateTime } = useLanguage();
  const [isDownloading, setIsDownloading] = React.useState(false);
  
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

  // Function to download document
  const handleDownload = async () => {
    if (!document.file_path) {
      toast.error(t("documentPathMissing"));
      return;
    }

    try {
      setIsDownloading(true);
      const downloadUrl = await DocumentService.getDownloadUrl(document.file_path);
      
      // Create an invisible anchor element
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = document.document_name;
      a.style.display = 'none';
      document.body.appendChild(a);
      
      // Trigger the download
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      
      toast.success(t("downloadStarted"), {
        description: t("documentDownloadStarted")
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error(t("downloadFailed"), {
        description: t("errorOccurred")
      });
    } finally {
      setIsDownloading(false);
    }
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
                {document.uploaded_by_name && (
                  <span className="ml-2">
                    {t("uploadedBy")}: {document.uploaded_by_name}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onUploadVersion && (
                  <DropdownMenuItem onClick={onUploadVersion}>
                    <FileUp className="mr-2 h-4 w-4" />
                    {t("uploadNewVersion")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="text-destructive"
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
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentListItem;
