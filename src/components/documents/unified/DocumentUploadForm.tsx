
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { documentCategories, supportedDocumentTypes } from "@/utils/documentUtils";
import { DocumentCategory } from "@/types/documents";
import FileUploadField from "../FileUploadField";

interface DocumentUploadFormProps {
  documentName: string;
  setDocumentName: (name: string) => void;
  documentType: string;
  setDocumentType: (type: string) => void;
  documentCategory: DocumentCategory | string;
  setDocumentCategory: (category: string) => void;
  file: File | null;
  handleFileChange: (file: File | null) => void;
  isNewVersion?: boolean;
  isSalesProcess?: boolean;
  salesStage?: string;
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
  isNewVersion = false,
  isSalesProcess = false,
  salesStage
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor="documentName">
          {t("documentName")} {!isNewVersion && "*"}
        </Label>
        <Input
          id="documentName"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder={t("enterDocumentName")}
          disabled={isNewVersion}
          required={!isNewVersion}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="documentType">
          {t("documentType")} {!isNewVersion && "*"}
        </Label>
        <Select
          value={documentType}
          onValueChange={setDocumentType}
          disabled={isNewVersion}
        >
          <SelectTrigger id="documentType">
            <SelectValue placeholder={t("selectDocumentType")} />
          </SelectTrigger>
          <SelectContent>
            {supportedDocumentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value || "other"}>
                {t(type.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="documentCategory">
          {t("category")} {!isNewVersion && "*"}
        </Label>
        <Select
          value={documentCategory}
          onValueChange={setDocumentCategory}
          disabled={isNewVersion}
        >
          <SelectTrigger id="documentCategory">
            <SelectValue placeholder={t("selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            {documentCategories.map((category) => (
              <SelectItem key={category.value} value={category.value || "other"}>
                {t(category.label)}
              </SelectItem>
            ))}
            {isSalesProcess && salesStage && (
              <>
                <SelectItem value="discovery">{t("discovery")}</SelectItem>
                <SelectItem value="quote">{t("quoteManagement")}</SelectItem>
                <SelectItem value="proposal">{t("proposals")}</SelectItem>
                <SelectItem value="contract">{t("contracts")}</SelectItem>
                <SelectItem value="closeout">{t("closeout")}</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="file">
          {isNewVersion ? t("newVersion") : t("file")} *
        </Label>
        <FileUploadField
          onChange={handleFileChange}
          file={file}
        />
      </div>
    </div>
  );
};

export default DocumentUploadForm;
