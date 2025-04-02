
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import { FilePlus, X } from "lucide-react";

interface DocumentUploadFormProps {
  documentName: string;
  setDocumentName: (name: string) => void;
  documentType: string;
  setDocumentType: (type: string) => void;
  documentCategory: string;
  setDocumentCategory: (category: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  documentName,
  setDocumentName,
  documentType,
  setDocumentType,
  documentCategory,
  setDocumentCategory,
  file,
  setFile
}) => {
  const { t } = useLanguage();
  
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="documentName" className="text-right">
          {t("documentName")}
        </Label>
        <Input
          id="documentName"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder={t("enterDocumentName")}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="documentType" className="text-right">
          {t("documentType")}
        </Label>
        <Select value={documentType} onValueChange={setDocumentType}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder={t("selectDocumentType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="policy">{t("policy")}</SelectItem>
            <SelectItem value="invoice">{t("invoice")}</SelectItem>
            <SelectItem value="contract">{t("contract")}</SelectItem>
            <SelectItem value="claim">{t("claim")}</SelectItem>
            <SelectItem value="authorization">{t("authorization")}</SelectItem>
            <SelectItem value="other">{t("other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="documentCategory" className="text-right">
          {t("documentCategory")}
        </Label>
        <Select value={documentCategory} onValueChange={setDocumentCategory}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder={t("selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="legal">{t("legal")}</SelectItem>
            <SelectItem value="financial">{t("financial")}</SelectItem>
            <SelectItem value="personal">{t("personal")}</SelectItem>
            <SelectItem value="correspondence">{t("correspondence")}</SelectItem>
            <SelectItem value="other">{t("other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">{t("uploadFile")}</Label>
        <div
          {...getRootProps()}
          className="col-span-3 flex flex-col items-center justify-center border-dashed border-2 border-gray-300 bg-gray-50 rounded-lg cursor-pointer p-4"
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-gray-700">{file.name}</span>
              <button
                type="button"
                className="p-1 rounded-full hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <FilePlus className="h-6 w-6 text-gray-500 mb-2" />
              <p className="text-sm text-gray-500">{t("dragAndDropFilesHere")}</p>
              <p className="text-xs text-gray-500 mt-1">{t("or")} {t("clickToSelectFiles")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
