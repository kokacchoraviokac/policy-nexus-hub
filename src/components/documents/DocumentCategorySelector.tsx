
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentCategory } from "@/types/documents";

interface DocumentCategorySelectorProps {
  value: DocumentCategory | "";
  onValueChange: (value: DocumentCategory | "") => void;
  disabled?: boolean;
}

const DocumentCategorySelector: React.FC<DocumentCategorySelectorProps> = ({
  value,
  onValueChange,
  disabled = false
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="documentCategory">{t("documentCategory")}</Label>
      <Select
        value={value}
        onValueChange={onValueChange as (value: string) => void}
        disabled={disabled}
      >
        <SelectTrigger id="documentCategory">
          <SelectValue placeholder={t("selectCategory")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="claim_evidence">{t("claimEvidence")}</SelectItem>
          <SelectItem value="medical">{t("medical")}</SelectItem>
          <SelectItem value="legal">{t("legal")}</SelectItem>
          <SelectItem value="financial">{t("financial")}</SelectItem>
          <SelectItem value="correspondence">{t("correspondence")}</SelectItem>
          <SelectItem value="other">{t("other")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentCategorySelector;
