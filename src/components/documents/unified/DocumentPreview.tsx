
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, X, Download, File, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document } from "@/types/documents";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { getDocumentTypeLabel } from "@/utils/documentUtils";
import { supabase } from "@/integrations/supabase/client"; // Import supabase

interface DocumentPreviewProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  open,
  onOpenChange
}) => {
  const { t, formatDate } = useLanguage();
  const { downloadDocument, isDownloading } = useDocumentDownload();
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!document || !open) {
      setPreviewUrl(null);
      return;
    }
    
    const loadPreview = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get the file extension
        const fileExt = document.file_path.split('.').pop()?.toLowerCase();
        
        // Check if the file is previewable
        const previewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
        
        if (!fileExt || !previewableTypes.includes(fileExt)) {
          setError(t("fileTypeNotPreviewable"));
          setIsLoading(false);
          return;
        }
        
        // Get the file URL from Supabase storage
        const { data, error } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.file_path, 60); // 60 seconds expiry
          
        if (error) {
          throw error;
        }
        
        setPreviewUrl(data.signedUrl);
      } catch (err: any) {
        console.error("Error loading preview:", err);
        setError(err.message || t("errorLoadingPreview"));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreview();
  }, [document, open, t]);
  
  if (!document) return null;
  
  const handleDownload = () => {
    if (document) {
      downloadDocument(document);
    }
  };
  
  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">{t("loadingPreview")}</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <File className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">{t("previewNotAvailable")}</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button 
            variant="secondary" 
            className="mt-4"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {t("downloadToView")}
          </Button>
        </div>
      );
    }
    
    if (!previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">{t("noPreviewAvailable")}</p>
        </div>
      );
    }
    
    // Handle different file types
    const fileExt = document.file_path.split('.').pop()?.toLowerCase();
    
    if (fileExt === 'pdf') {
      return (
        <iframe 
          src={`${previewUrl}#toolbar=0`} 
          className="w-full h-[600px] border-0" 
          title={document.document_name}
        />
      );
    }
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '')) {
      return (
        <div className="flex justify-center py-4">
          <img 
            src={previewUrl} 
            alt={document.document_name} 
            className="max-w-full max-h-[600px] object-contain"
          />
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">{t("previewNotAvailable")}</p>
      </div>
    );
  };
  
  const renderDetailsContent = () => {
    return (
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {t("documentName")}
            </h4>
            <p>{document.document_name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {t("documentType")}
            </h4>
            <p>{getDocumentTypeLabel(document.document_type)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {t("uploadedOn")}
            </h4>
            <p>{formatDate(document.created_at)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {t("uploadedBy")}
            </h4>
            <p>{document.uploaded_by_name || t("unknownUser")}</p>
          </div>
          {document.version && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                {t("version")}
              </h4>
              <p>v{document.version}{document.is_latest_version ? ` (${t("latest")})` : ""}</p>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {t("fileType")}
            </h4>
            <p>{document.mime_type || t("unknown")}</p>
          </div>
        </div>
        
        {document.description && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {t("description")}
            </h4>
            <p className="text-sm">{document.description}</p>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{document.document_name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
            <TabsTrigger value="details">{t("details")}</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="min-h-[400px]">
            {renderPreviewContent()}
          </TabsContent>
          <TabsContent value="details">
            {renderDetailsContent()}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? t("downloading") : t("download")}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-2 h-4 w-4" />
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
