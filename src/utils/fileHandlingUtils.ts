
import { useState } from "react";

// Check if all required fields are present
export const validateUploadFields = (
  file: File | null, 
  documentName: string, 
  documentType: string
): { isValid: boolean; missingField?: string } => {
  if (!file) {
    return { isValid: false, missingField: "file" };
  }
  
  if (!documentName) {
    return { isValid: false, missingField: "documentName" };
  }
  
  if (!documentType) {
    return { isValid: false, missingField: "documentType" };
  }
  
  return { isValid: true };
};

// Hook for handling file input
export const useFileInput = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // If no document name is set yet, use the file name
      if (!documentName) {
        setDocumentName(selectedFile.name.split('.')[0]);
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
