
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { DocumentCategory } from "@/types/documents";
import DocumentTypeSelector from "./DocumentTypeSelector";
import DocumentCategorySelector from "./DocumentCategorySelector";
import FileUploadField from "./FileUploadField";

interface DocumentUploadFormProps {
  documentName: string;
  setDocumentName: (name: string) => void;
  documentType: string;
  setDocumentType: (type: string) => void;
  documentCategory: DocumentCategory | "";
  setDocumentCategory: (category: DocumentCategory | "") => void;
  file: File | null;
  handleFileChange: (file: File | null) => void;
  isNewVersion?: boolean;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  documentName,
  setDocumentName,
  documentType,
  setDocumentType,
  documentCategory,
  setDocumentCategory,
  file,
  handleFileChange,
  isNewVersion = false
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <label htmlFor="documentName" className="text-sm font-medium">
          {t("documentName")} *
        </label>
        <Input
          id="documentName"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder={t("enterDocumentName")}
          disabled={isNewVersion}
        />
      </div>
      
      <DocumentTypeSelector 
        value={documentType} 
        onValueChange={setDocumentType}
      />
      
      <DocumentCategorySelector
        value={documentCategory}
        onValueChange={setDocumentCategory}
      />
      
      <FileUploadField 
        onChange={handleFileChange}
        file={file}
      />
    </div>
  );
};

export default DocumentUploadForm;
