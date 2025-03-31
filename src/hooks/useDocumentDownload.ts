
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Document } from "@/types/documents";

export const useDocumentDownload = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadDocument = async (document: Document) => {
    if (!document.file_path) {
      toast({
        title: t("downloadFailed"),
        description: t("documentPathMissing"),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDownloading(true);
      
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);
        
      if (error) throw error;
      
      // Create a URL for the blob
      const url = URL.createObjectURL(data);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = document.document_name || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Free up the URL
      URL.revokeObjectURL(url);
      
      toast({
        title: t("downloadStarted"),
        description: t("documentDownloadStarted"),
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: t("downloadFailed"),
        description: t("errorOccurred"),
        variant: "destructive",
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
