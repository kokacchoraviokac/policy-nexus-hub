
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useDocumentDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const downloadDocument = async (document: Document) => {
    try {
      setIsDownloading(true);
      
      // Get document download URL
      const { data, error } = await supabase
        .storage
        .from('documents')
        .download(document.file_path);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.document_name;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: t("downloadComplete"),
        description: t("documentDownloadedSuccess"),
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: t("downloadError"),
        description: t("documentDownloadErrorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  return { isDownloading, downloadDocument };
};
