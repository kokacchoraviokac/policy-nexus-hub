
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
    { value: "policy", label: t("policyDocument") },
    { value: "invoice", label: t("invoice") },
    { value: "certificate", label: t("certificate") },
    { value: "endorsement", label: t("endorsement") },
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
            <SelectItem 
              key={type.value} 
              value={type.value || "undefined_item"} // Ensure we never have an empty string
            >
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentTypeSelector;
