
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFileInput = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState<string>("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill document name with file name if not already set
      if (!documentName) {
        // Remove extension from file name
        const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
        setDocumentName(fileName);
      }
    }
  };
  
  return {
    file,
    setFile,
    documentName,
    setDocumentName,
    handleFileChange
  };
};

export const validateUploadFields = (
  file: File | null, 
  documentName: string, 
  documentType: string
) => {
  if (!file) {
    return { isValid: false, missingField: "file" };
  }
  
  if (!documentName.trim()) {
    return { isValid: false, missingField: "documentName" };
  }
  
  if (!documentType) {
    return { isValid: false, missingField: "documentType" };
  }
  
  return { isValid: true, missingField: null };
};

export const downloadDocument = async (filePath: string, fileName: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filePath);
      
    if (error) throw error;
    
    // Create a URL for the blob
    const url = URL.createObjectURL(data);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Free up the URL
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error downloading document:", error);
    return false;
  }
};

export const useFileDownload = () => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const downloadFile = async (filePath: string, fileName: string, t: (key: string) => string) => {
    if (!filePath) {
      toast({
        title: t("downloadFailed"),
        description: t("documentPathMissing"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsDownloading(true);
      const success = await downloadDocument(filePath, fileName);
      
      if (success) {
        toast({
          title: t("downloadStarted"),
          description: t("documentDownloadStarted"),
        });
      } else {
        throw new Error("Download failed");
      }
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
    downloadFile,
    isDownloading
  };
};
