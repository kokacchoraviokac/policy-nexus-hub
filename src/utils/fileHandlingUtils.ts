
import { useState } from "react";

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
