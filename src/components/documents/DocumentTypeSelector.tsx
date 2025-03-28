
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  documentTypes?: Array<{value: string, label: string}>;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  value,
  onValueChange,
  documentTypes
}) => {
  const { t } = useLanguage();
  
  const defaultDocumentTypes = [
    { value: "document", label: t("document") },
    { value: "contract", label: t("contract") },
    { value: "other", label: t("other") }
  ];
  
  const types = documentTypes || defaultDocumentTypes;
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="documentType">{t("documentType")} *</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("selectDocumentType")} />
        </SelectTrigger>
        <SelectContent>
          {types.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentTypeSelector;
