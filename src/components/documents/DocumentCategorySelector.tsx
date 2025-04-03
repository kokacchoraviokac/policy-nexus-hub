
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentCategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  categories?: Array<{value: string, label: string}>;
}

const DocumentCategorySelector: React.FC<DocumentCategorySelectorProps> = ({
  value,
  onValueChange,
  categories
}) => {
  const { t } = useLanguage();
  
  const defaultCategories = [
    { value: "policy", label: t("policyDocuments") },
    { value: "claim", label: t("claimDocuments") },
    { value: "invoice", label: t("invoiceDocuments") },
    { value: "client", label: t("clientDocuments") },
    { value: "other", label: t("otherDocuments") }
  ];
  
  const options = categories || defaultCategories;
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="documentCategory">{t("documentCategory")} *</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("selectDocumentCategory")} />
        </SelectTrigger>
        <SelectContent>
          {options.map((category) => (
            <SelectItem 
              key={category.value} 
              value={category.value || "undefined_category"} // Ensure no empty strings
            >
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentCategorySelector;
