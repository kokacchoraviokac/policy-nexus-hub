
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  value,
  onValueChange
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-2">
      <label htmlFor="documentType" className="text-sm font-medium">
        {t("documentType")} *
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="documentType">
          <SelectValue placeholder={t("selectDocumentType")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="policy">
            {t("policy")}
          </SelectItem>
          <SelectItem value="claim">
            {t("claim")}
          </SelectItem>
          <SelectItem value="invoice">
            {t("invoice")}
          </SelectItem>
          <SelectItem value="letter">
            {t("letter")}
          </SelectItem>
          <SelectItem value="contract">
            {t("contract")}
          </SelectItem>
          <SelectItem value="report">
            {t("report")}
          </SelectItem>
          <SelectItem value="certificate">
            {t("certificate")}
          </SelectItem>
          <SelectItem value="other">
            {t("other")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentTypeSelector;
