
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  value,
  onValueChange,
  disabled = false
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="documentType">{t("documentType")} *</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger id="documentType">
          <SelectValue placeholder={t("selectDocumentType")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="policy">{t("policyDocument")}</SelectItem>
          <SelectItem value="invoice">{t("invoice")}</SelectItem>
          <SelectItem value="certificate">{t("certificate")}</SelectItem>
          <SelectItem value="endorsement">{t("endorsement")}</SelectItem>
          <SelectItem value="lien">{t("lien")}</SelectItem>
          <SelectItem value="other">{t("other")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentTypeSelector;
