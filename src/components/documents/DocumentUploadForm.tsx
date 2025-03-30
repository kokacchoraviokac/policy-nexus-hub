
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DocumentTypeSelector from "@/components/documents/DocumentTypeSelector";
import DocumentCategorySelector from "@/components/documents/DocumentCategorySelector";
import FileUploadField from "@/components/documents/FileUploadField";
import { DocumentCategory } from "@/types/documents";

interface DocumentUploadFormProps {
  documentName: string;
  setDocumentName: (name: string) => void;
  documentType: string;
  setDocumentType: (type: string) => void;
  documentCategory: DocumentCategory | "";
  setDocumentCategory: (category: DocumentCategory | "") => void;
  file: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isNewVersion: boolean;
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
  isNewVersion
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <label htmlFor="documentName" className="text-sm font-medium">{t("documentName")} *</label>
        <input
          id="documentName"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder={t("enterDocumentName")}
          disabled={isNewVersion}
        />
      </div>
      
      <DocumentTypeSelector 
        value={documentType} 
        onValueChange={setDocumentType}
        disabled={isNewVersion}
      />
      
      <DocumentCategorySelector
        value={documentCategory}
        onValueChange={setDocumentCategory}
        disabled={isNewVersion}
      />
      
      <FileUploadField 
        onChange={handleFileChange}
        file={file}
      />
    </div>
  );
};

export default DocumentUploadForm;
