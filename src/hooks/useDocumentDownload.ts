
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/types/documents";

export const useDocumentDownload = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const downloadDocument = async (document: Document) => {
    if (!document.file_path) {
      toast({
        title: t("downloadFailed"),
        description: t("documentPathMissing"),
        variant: "destructive"
      });
      return;
    }
    
    setIsDownloading(true);
    
    try {
      // Determine the bucket based on the document's entity type
      const bucket = 'documents';
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(document.file_path);
      
      if (error) throw error;
      
      // Create a download link using the browser's document object
      const url = URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.document_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      toast({
        title: t("downloadStarted"),
        description: t("documentDownloadStarted")
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: t("downloadFailed"),
        description: t("errorOccurred"),
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  return {
    isDownloading,
    downloadDocument
  };
};
