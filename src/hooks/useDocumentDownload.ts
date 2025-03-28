
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/hooks/useDocuments";

export const useDocumentDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const downloadDocument = async (document: Document) => {
    setIsDownloading(true);
    
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);
        
      if (error) {
        throw error;
      }
      
      // Create a local URL for the downloaded file
      const url = URL.createObjectURL(data);
      
      // Create a link and trigger the download
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.document_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  return {
    isDownloading,
    downloadDocument
  };
};
