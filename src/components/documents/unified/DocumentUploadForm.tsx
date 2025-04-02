
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import { FilePlus, X } from "lucide-react";
import { documentCategories, supportedDocumentTypes } from "@/utils/documentUtils";
import { DocumentCategory } from "@/types/documents";

interface DocumentUploadFormProps {
  documentName: string;
  setDocumentName: (name: string) => void;
  documentType: string;
  setDocumentType: (type: string) => void;
  documentCategory: string | DocumentCategory;
  setDocumentCategory: (category: string | DocumentCategory) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  isSalesProcess?: boolean;
  salesStage?: string;
  setSalesStage?: (stage: string) => void;
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
  setFile,
  isSalesProcess = false,
  salesStage,
  setSalesStage,
  isNewVersion = false
}) => {
  const { t } = useLanguage();

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      
      // Auto-fill document name if it's empty
      if (!documentName) {
        // Remove file extension from name
        const nameWithoutExt = acceptedFiles[0].name.split('.').slice(0, -1).join('.');
        setDocumentName(nameWithoutExt);
      }
    }
  }, [setFile, documentName, setDocumentName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  // Sales process stages for document categorization
  const salesStages = [
    { value: "discovery", label: t("discovery") },
    { value: "quote", label: t("quoteManagement") },
    { value: "proposal", label: t("proposals") },
    { value: "contract", label: t("contracts") },
    { value: "closeout", label: t("closeout") }
  ];

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="documentName">
          {t("documentName")} *
        </Label>
        <Input
          id="documentName"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder={t("enterDocumentName")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="documentType">
          {t("documentType")} *
        </Label>
        <Select 
          value={documentType} 
          onValueChange={setDocumentType}
        >
          <SelectTrigger id="documentType">
            <SelectValue placeholder={t("selectDocumentType")} />
          </SelectTrigger>
          <SelectContent>
            {supportedDocumentTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {t(type.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="documentCategory">
          {t("documentCategory")} *
        </Label>
        <Select 
          value={documentCategory.toString()} 
          onValueChange={setDocumentCategory}
        >
          <SelectTrigger id="documentCategory">
            <SelectValue placeholder={t("selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            {documentCategories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {t(category.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isSalesProcess && setSalesStage && (
        <div className="grid gap-2">
          <Label htmlFor="salesStage">
            {t("salesStage")}
          </Label>
          <Select 
            value={salesStage} 
            onValueChange={setSalesStage}
          >
            <SelectTrigger id="salesStage">
              <SelectValue placeholder={t("selectSalesStage")} />
            </SelectTrigger>
            <SelectContent>
              {salesStages.map(stage => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="uploadFile">
          {t("selectFile")} *
        </Label>
        <div 
          {...getRootProps({ className: "cursor-pointer" })}
          className={`border-2 ${isDragActive ? 'border-primary' : 'border-dashed border-gray-300'} 
                      rounded-md p-4 transition-colors hover:border-primary/50 ${file ? '' : 'h-32'}`}
        >
          <input {...getInputProps({ id: "uploadFile" })} />
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FilePlus className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <FilePlus className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-center text-muted-foreground">
                {isDragActive
                  ? t("dropFileHere")
                  : t("dragAndDropFilesHere")}
              </p>
              <p className="text-xs text-center text-muted-foreground">
                {t("or")} <span className="text-primary underline">{t("browseFiles")}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
