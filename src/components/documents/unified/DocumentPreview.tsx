import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BaseService } from "@/services/BaseService";
import { Document } from "@/types/documents";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { t } = useLanguage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");
  
  useEffect(() => {
    const loadPreview = async () => {
      if (!document) {
        setError(t("noDocumentSelected"));
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // If the document already has a URL, use it
        if (document.file_url) {
          setPreviewUrl(document.file_url);
          return;
        }
        
        // Otherwise, get the URL from the file path
        if (document.file_path) {
          const service = new BaseService();
          const supabaseClient = service.getClient();
          
          const { data } = supabaseClient
            .storage
            .from('documents')
            .getPublicUrl(document.file_path);
            
          if (data?.publicUrl) {
            setPreviewUrl(data.publicUrl);
          } else {
            setError(t("errorLoadingPreview"));
          }
        } else {
          setError(t("documentPathMissing"));
        }
      } catch (err) {
        setError(t("errorLoadingPreview"));
        console.error("Error loading preview:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (open && document) {
      loadPreview();
    }
  }, [document, open, t]);
  
  const handleDownload = () => {
    if (!previewUrl) return;
    
    // Create a temporary link and trigger download
    const downloadLink = window.document.createElement('a');
    downloadLink.href = previewUrl;
    downloadLink.download = document?.document_name || 'document';
    window.document.body.appendChild(downloadLink);
    downloadLink.click();
    window.document.body.removeChild(downloadLink);
  };
  
  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={handleDownload} disabled={!previewUrl}>
            <Download className="mr-2 h-4 w-4" />
            {t("downloadToView")}
          </Button>
        </div>
      );
    }
    
    if (!previewUrl) {
      return (
        <div className="flex justify-center items-center p-12">
          <p>{t("noPreviewAvailable")}</p>
        </div>
      );
    }
    
    // Check file type to determine preview method
    const fileType = document?.mime_type || "";
    
    if (fileType.startsWith('image/')) {
      return (
        <div className="flex justify-center p-4">
          <img 
            src={previewUrl} 
            alt={document?.document_name || 'Document preview'} 
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      );
    }
    
    if (fileType === 'application/pdf') {
      return (
        <iframe 
          src={`${previewUrl}#toolbar=0`}
          className="w-full h-[70vh] border-0" 
          title={document?.document_name || 'PDF preview'}
        />
      );
    }
    
    // For other file types, show download button
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="mb-4">{t("fileTypeNotPreviewable")}</p>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          {t("download")}
        </Button>
      </div>
    );
  };
  
  const renderDetails = () => {
    if (!document) return null;
    
    return (
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("documentName")}</h4>
            <p>{document.document_name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("documentType")}</h4>
            <p>{document.document_type}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("uploadedOn")}</h4>
            <p>{new Date(document.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("fileType")}</h4>
            <p>{document.mime_type || t("unknown")}</p>
          </div>
          {document.version && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("version")}</h4>
              <p>{document.version}</p>
            </div>
          )}
          {document.category && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("category")}</h4>
              <p>{document.category}</p>
            </div>
          )}
        </div>
        
        <div className="pt-4">
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {t("download")}
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">
            {document?.document_name || t("documentPreview")}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
            <TabsTrigger value="details">{t("details")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="flex-1 overflow-auto">
            {renderPreview()}
          </TabsContent>
          
          <TabsContent value="details">
            {renderDetails()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
