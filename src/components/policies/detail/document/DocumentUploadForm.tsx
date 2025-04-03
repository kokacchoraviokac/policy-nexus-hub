
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
    setFile(acceptedFiles[0]);
  }, [setFile]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          {t("documentName")}
        </Label>
        <Input
          id="name"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          {t("documentType")}
        </Label>
        <Input
          id="type"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          {t("documentCategory")}
        </Label>
        <Select value={documentCategory || "other"} onValueChange={setDocumentCategory}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder={t("selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contract">{t("contract")}</SelectItem>
            <SelectItem value="invoice">{t("invoice")}</SelectItem>
            <SelectItem value="claim">{t("claim")}</SelectItem>
            <SelectItem value="other">{t("other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">{t("uploadFile")}</Label>
        <div
          {...getRootProps()}
          className="dropzone col-span-3 flex flex-col items-center justify-center border-dashed border-2 border-gray-400 bg-gray-50 rounded-lg cursor-pointer"
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-between w-full p-4">
              <span className="text-sm text-gray-500">{file.name}</span>
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
            <div className="flex flex-col items-center justify-center py-6">
              <FilePlus className="h-6 w-6 text-gray-500 mb-2" />
              <p className="text-sm text-gray-500">
                {t("dragAndDropFilesHere")}
              </p>
              <p className="text-xs text-gray-500">
                {t("or")} {t("clickToSelectFiles")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
