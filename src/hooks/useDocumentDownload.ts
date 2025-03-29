
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document } from "@/hooks/useDocuments";
import { useActivityLogger } from "@/utils/activityLogger";

export const useDocumentDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { logActivity } = useActivityLogger();
  
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
      
      // Create a download link and click it
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.document_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      
      // Log activity if entity information is available
      if (document.entity_type && document.entity_id) {
        logActivity({
          entityType: document.entity_type,
          entityId: document.entity_id,
          action: "document_download", // Changed from "download" to "document_download"
          details: {
            document_id: document.id,
            document_name: document.document_name
          }
        });
      }
      
      toast({
        title: t("downloadStarted"),
        description: t("documentDownloadStarted")
      });
      
    } catch (error) {
      console.error("Document download error:", error);
      toast({
        title: t("downloadFailed"),
        description: error instanceof Error ? error.message : t("errorOccurred"),
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
