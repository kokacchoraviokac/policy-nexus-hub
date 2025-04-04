import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/documents";
import { FileIcon, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Extend Document type for file_url and file_type support
interface ExtendedDocument extends Document {
  file_url?: string;
  file_type?: string;
}

interface DocumentPreviewProps {
  document: ExtendedDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  open,
  onOpenChange,
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentUrl = async () => {
      if (!document) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if document already has a file_url
        if (document.file_url) {
          setDocumentUrl(document.file_url);
          return;
        }
        
        // Otherwise, use the file_path to get the URL
        if (!document.file_path) {
          throw new Error("Document has no file path");
        }
        
        const { data, error } = await supabase
          .storage
          .from('documents')
          .createSignedUrl(document.file_path, 3600); // 1 hour expiry
        
        if (error) throw error;
        
        setDocumentUrl(data.signedUrl);
      } catch (err) {
        console.error("Error fetching document URL:", err);
        setError(t("errorFetchingDocument"));
      } finally {
        setIsLoading(false);
      }
    };
    
    if (open && document) {
      fetchDocumentUrl();
    } else {
      setDocumentUrl(null);
    }
  }, [document, open, t]);
  
  const renderPreview = () => {
    if (!document || !documentUrl) return null;
    
    // Extract file extension from path or file_type
    const fileExtension = document.file_path 
      ? document.file_path.split('.').pop()?.toLowerCase()
      : document.file_type 
        ? document.file_type.split('/').pop()?.toLowerCase()
        : null;
        
    // Determine if the document is an image
    const isImage = fileExtension && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
    
    // Determine if the document is a PDF
    const isPdf = fileExtension === 'pdf';
    
    if (isImage) {
      return (
        <img 
          src={documentUrl} 
          alt={document.document_name} 
          className="max-w-full max-h-[600px] object-contain mx-auto"
        />
      );
    }
    
    if (isPdf) {
      return (
        <iframe 
          src={`${documentUrl}#toolbar=0`} 
          className="w-full h-[600px] border-0"
          title={document.document_name}
        />
      );
    }
    
    // Fallback for other document types
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <FileIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{document.document_name}</h3>
        <p className="text-sm text-muted-foreground mb-6">
          {t("fileTypeNotPreviewable", { type: fileExtension || t("unknown") })}
        </p>
        <Button asChild>
          <a href={documentUrl} download={document.document_name} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" />
            {t("download")}
          </a>
        </Button>
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <div className="min-h-[200px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">{t("loadingDocument")}</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-sm text-destructive mb-2">{error}</p>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t("close")}
              </Button>
            </div>
          ) : (
            renderPreview()
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
