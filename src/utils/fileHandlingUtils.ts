
import { useState } from "react";

export interface FileUploadValidation {
  isValid: boolean;
  missingField?: "file" | "documentName" | "documentType" | null;
}

export const validateUploadFields = (
  file: File | null,
  documentName: string,
  documentType: string
): FileUploadValidation => {
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

export const useFileInput = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Set document name to file name if not already set
      if (!documentName) {
        const fileName = selectedFile.name.split('.')[0];
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
