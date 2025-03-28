
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DocumentTypeSelector from "./DocumentTypeSelector";
import FileUploadField from "./FileUploadField";
import TagsInputField from "./TagsInputField";

interface DocumentUploadFormProps {
  documentName: string;
  setDocumentName: (name: string) => void;
  documentType: string;
  setDocumentType: (type: string) => void;
  file: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isVersionUpdate?: boolean;
  currentVersion?: number;
  withTags?: boolean;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  documentName,
  setDocumentName,
  documentType,
  setDocumentType,
  file,
  handleFileChange,
  isVersionUpdate = false,
  currentVersion = 0,
  withTags = false
}) => {
  const { t } = useLanguage();
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };
  
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="documentName">{t("documentName")} *</Label>
        <Input
          id="documentName"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder={t("enterDocumentName")}
        />
      </div>
      
      <DocumentTypeSelector 
        value={documentType} 
        onValueChange={setDocumentType} 
      />
      
      <FileUploadField 
        onChange={handleFileChange}
        file={file}
      />
      
      {withTags && (
        <TagsInputField
          tags={tags}
          tagInput={tagInput}
          setTagInput={setTagInput}
          addTag={addTag}
          removeTag={removeTag}
          onKeyDown={handleKeyDown}
        />
      )}
      
      {isVersionUpdate && (
        <div className="bg-muted/50 p-2 rounded text-sm">
          {t("uploadingNewVersion", { version: currentVersion + 1 })}
        </div>
      )}
    </div>
  );
};

export default DocumentUploadForm;
