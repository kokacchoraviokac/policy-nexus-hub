
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { TemplateForm } from "./templates/TemplateForm";
import { TemplateList } from "./templates/TemplateList";
import { useInvoiceTemplates, defaultTemplateValues, TemplateFormValues } from "@/hooks/useInvoiceTemplates";

const InvoiceTemplateManager = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("list");
  
  const form = useForm<TemplateFormValues>({
    defaultValues: defaultTemplateValues
  });
  
  const { 
    templates, 
    selectedTemplate, 
    setSelectedTemplate,
    deleteTemplate,
    setDefaultTemplate,
    saveTemplate 
  } = useInvoiceTemplates();
  
  const handleAddTemplate = () => {
    form.reset(defaultTemplateValues);
    form.setValue("name", `Template ${templates.length + 1}`);
    form.setValue("is_default", false);
    setSelectedTemplate(null);
    setActiveTab("edit");
  };
  
  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    
    // Set form values
    form.reset({
      name: template.name,
      primary_color: template.primary_color || defaultTemplateValues.primary_color,
      secondary_color: template.secondary_color || defaultTemplateValues.secondary_color,
      font_family: template.font_family || defaultTemplateValues.font_family,
      font_weight: template.font_weight || defaultTemplateValues.font_weight,
      font_style: template.font_style || defaultTemplateValues.font_style,
      logo_position: (template.logo_position as 'left' | 'center' | 'right') || defaultTemplateValues.logo_position,
      header_text: template.header_text || '',
      footer_text: template.footer_text || '',
      show_payment_instructions: template.show_payment_instructions || false,
      payment_instructions: template.payment_instructions || '',
      is_default: template.is_default || false
    });
    
    setActiveTab("edit");
  };
  
  const onSubmit = async (values: TemplateFormValues) => {
    const success = await saveTemplate(values, selectedTemplate || undefined);
    if (success) {
      setActiveTab("list");
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="list">{t("templatesList")}</TabsTrigger>
            <TabsTrigger value="edit">{selectedTemplate ? t("editTemplate") : t("newTemplate")}</TabsTrigger>
          </TabsList>
          
          {activeTab === "list" && (
            <Button onClick={handleAddTemplate}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("newTemplate")}
            </Button>
          )}
        </div>
        
        <TabsContent value="list" className="space-y-4">
          <TemplateList 
            templates={templates}
            onEdit={handleEditTemplate}
            onDelete={deleteTemplate}
            onSetDefault={setDefaultTemplate}
            onAddTemplate={handleAddTemplate}
          />
        </TabsContent>
        
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>{selectedTemplate ? t("editTemplate") : t("newTemplate")}</CardTitle>
              <CardDescription>{t("customizeInvoiceTemplate")}</CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateForm 
                form={form}
                onSubmit={onSubmit}
                onCancel={() => setActiveTab("list")}
                isEditing={!!selectedTemplate}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceTemplateManager;
