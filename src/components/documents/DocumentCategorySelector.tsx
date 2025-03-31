
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentCategory } from "@/types/documents";

interface DocumentCategorySelectorProps {
  value: DocumentCategory | string;
  onValueChange: (value: DocumentCategory | string) => void;
}

const DocumentCategorySelector: React.FC<DocumentCategorySelectorProps> = ({
  value,
  onValueChange
}) => {
  const { t } = useLanguage();
  
  // Fixed: Ensure value is always a valid string for the Select component
  const safeValue = value || "none";
  
  return (
    <div className="grid gap-2">
      <label htmlFor="documentCategory" className="text-sm font-medium">
        {t("documentCategory")}
      </label>
      <Select value={safeValue} onValueChange={onValueChange}>
        <SelectTrigger id="documentCategory" className="w-full">
          <SelectValue placeholder={t("selectCategory")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            {t("none")}
          </SelectItem>
          <SelectItem value="claim_evidence">
            {t("claimEvidence")}
          </SelectItem>
          <SelectItem value="medical">
            {t("medical")}
          </SelectItem>
          <SelectItem value="legal">
            {t("legal")}
          </SelectItem>
          <SelectItem value="financial">
            {t("financial")}
          </SelectItem>
          <SelectItem value="policy">
            {t("policy")}
          </SelectItem>
          <SelectItem value="invoice">
            {t("invoice")}
          </SelectItem>
          <SelectItem value="lien">
            {t("lien")}
          </SelectItem>
          <SelectItem value="notification">
            {t("notification")}
          </SelectItem>
          <SelectItem value="correspondence">
            {t("correspondence")}
          </SelectItem>
          <SelectItem value="other">
            {t("other")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentCategorySelector;
