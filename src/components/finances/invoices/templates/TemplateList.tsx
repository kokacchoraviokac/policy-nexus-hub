
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InvoiceTemplateSettings } from "@/types/finances";
import { InvoiceTemplateCard } from "./InvoiceTemplateCard";
import { EmptyTemplatesList } from "./EmptyTemplatesList";

interface TemplateListProps {
  templates: InvoiceTemplateSettings[];
  onEdit: (template: InvoiceTemplateSettings) => void;
  onDelete: (templateId: string) => void;
  onSetDefault: (templateId: string) => void;
  onAddTemplate: () => void;
}

export const TemplateList = ({ 
  templates, 
  onEdit, 
  onDelete, 
  onSetDefault, 
  onAddTemplate 
}: TemplateListProps) => {
  const { t } = useLanguage();
  
  if (templates.length === 0) {
    return <EmptyTemplatesList onAddTemplate={onAddTemplate} />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <InvoiceTemplateCard
          key={template.id}
          template={template}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  );
};
