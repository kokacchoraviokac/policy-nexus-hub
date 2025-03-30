
import React, { useState, useEffect, useContext } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InvoiceTemplateSettings } from "@/types/finances";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { ColorPicker } from "@/components/ui/color-picker"; // Assuming you have a color picker component

interface TemplateFormValues {
  name: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  logo_position: 'left' | 'center' | 'right';
  header_text: string;
  footer_text: string;
  show_payment_instructions: boolean;
  payment_instructions: string;
  is_default: boolean;
}

const defaultTemplateValues: TemplateFormValues = {
  name: "Default Template",
  primary_color: "#3b82f6", // blue-500
  secondary_color: "#f3f4f6", // gray-100
  font_family: "helvetica",
  logo_position: "left",
  header_text: "",
  footer_text: "",
  show_payment_instructions: false,
  payment_instructions: "",
  is_default: true
};

const InvoiceTemplateManager = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const [templates, setTemplates] = useState<InvoiceTemplateSettings[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplateSettings | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const companyId = user?.companyId;
  
  const form = useForm<TemplateFormValues>({
    defaultValues: defaultTemplateValues
  });
  
  // Load templates when component mounts
  useEffect(() => {
    if (companyId) {
      loadTemplates();
    }
  }, [companyId]);
  
  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('invoice_templates')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTemplates(data as unknown as InvoiceTemplateSettings[]);
      
      // If there are no templates, create a default one
      if (data.length === 0) {
        createDefaultTemplate();
      } else {
        // Find default template
        const defaultTemplate = data.find(template => template.is_default === true);
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate as unknown as InvoiceTemplateSettings);
        } else {
          setSelectedTemplate(data[0] as unknown as InvoiceTemplateSettings);
        }
      }
    } catch (error) {
      console.error("Error loading templates:", error);
      toast({
        title: t("errorLoadingTemplates"),
        description: t("errorLoadingTemplatesDescription"),
        variant: "destructive",
      });
    }
  };
  
  const createDefaultTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('invoice_templates')
        .insert([
          {
            company_id: companyId,
            name: defaultTemplateValues.name,
            is_default: true,
            primary_color: defaultTemplateValues.primary_color,
            secondary_color: defaultTemplateValues.secondary_color,
            font_family: defaultTemplateValues.font_family,
            logo_position: defaultTemplateValues.logo_position,
            header_text: defaultTemplateValues.header_text,
            footer_text: defaultTemplateValues.footer_text,
            show_payment_instructions: defaultTemplateValues.show_payment_instructions,
            payment_instructions: defaultTemplateValues.payment_instructions
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: t("defaultTemplateCreated"),
        description: t("defaultTemplateCreatedDescription"),
      });
      
      setSelectedTemplate(data as unknown as InvoiceTemplateSettings);
      setTemplates([data] as unknown as InvoiceTemplateSettings[]);
    } catch (error) {
      console.error("Error creating default template:", error);
      toast({
        title: t("errorCreatingTemplate"),
        description: t("errorCreatingTemplateDescription"),
        variant: "destructive",
      });
    }
  };
  
  const handleAddTemplate = () => {
    form.reset(defaultTemplateValues);
    form.setValue("name", `Template ${templates.length + 1}`);
    form.setValue("is_default", false);
    setSelectedTemplate(null);
    setActiveTab("edit");
  };
  
  const handleEditTemplate = (template: InvoiceTemplateSettings) => {
    setSelectedTemplate(template);
    
    // Set form values
    form.reset({
      name: template.name,
      primary_color: template.primary_color || defaultTemplateValues.primary_color,
      secondary_color: template.secondary_color || defaultTemplateValues.secondary_color,
      font_family: template.font_family || defaultTemplateValues.font_family,
      logo_position: (template.logo_position as 'left' | 'center' | 'right') || defaultTemplateValues.logo_position,
      header_text: template.header_text || '',
      footer_text: template.footer_text || '',
      show_payment_instructions: template.show_payment_instructions || false,
      payment_instructions: template.payment_instructions || '',
      is_default: template.is_default
    });
    
    setActiveTab("edit");
  };
  
  const handleDeleteTemplate = async (templateId: string) => {
    // Don't allow deleting the default template
    const template = templates.find(t => t.id === templateId);
    if (template?.is_default) {
      toast({
        title: t("cannotDeleteDefaultTemplate"),
        description: t("cannotDeleteDefaultTemplateDescription"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('invoice_templates')
        .delete()
        .eq('id', templateId);
      
      if (error) throw error;
      
      // Reload templates
      loadTemplates();
      
      toast({
        title: t("templateDeleted"),
        description: t("templateDeletedDescription"),
      });
      
      // If the deleted template was selected, reset the form
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
        form.reset(defaultTemplateValues);
        setActiveTab("list");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: t("errorDeletingTemplate"),
        description: t("errorDeletingTemplateDescription"),
        variant: "destructive",
      });
    }
  };
  
  const handleSetDefault = async (templateId: string) => {
    try {
      // First, unset default on all templates
      const { error: updateError } = await supabase
        .from('invoice_templates')
        .update({ is_default: false })
        .eq('company_id', companyId);
      
      if (updateError) throw updateError;
      
      // Then set the selected template as default
      const { error } = await supabase
        .from('invoice_templates')
        .update({ is_default: true })
        .eq('id', templateId);
      
      if (error) throw error;
      
      // Reload templates
      loadTemplates();
      
      toast({
        title: t("defaultTemplateUpdated"),
        description: t("defaultTemplateUpdatedDescription"),
      });
    } catch (error) {
      console.error("Error setting default template:", error);
      toast({
        title: t("errorSettingDefaultTemplate"),
        description: t("errorSettingDefaultTemplateDescription"),
        variant: "destructive",
      });
    }
  };
  
  const onSubmit = async (values: TemplateFormValues) => {
    try {
      // If creating a new template
      if (!selectedTemplate) {
        // Check if this will be the default template
        if (values.is_default) {
          // Unset default on all templates
          await supabase
            .from('invoice_templates')
            .update({ is_default: false })
            .eq('company_id', companyId);
        }
        
        // Create new template
        const { data, error } = await supabase
          .from('invoice_templates')
          .insert([
            {
              company_id: companyId,
              name: values.name,
              is_default: values.is_default,
              primary_color: values.primary_color,
              secondary_color: values.secondary_color,
              font_family: values.font_family,
              logo_position: values.logo_position,
              header_text: values.header_text,
              footer_text: values.footer_text,
              show_payment_instructions: values.show_payment_instructions,
              payment_instructions: values.payment_instructions
            }
          ])
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: t("templateCreated"),
          description: t("templateCreatedDescription"),
        });
        
        setSelectedTemplate(data as unknown as InvoiceTemplateSettings);
      } else {
        // If updating an existing template
        // Check if this template is being set as default
        if (values.is_default && !selectedTemplate.is_default) {
          // Unset default on all templates
          await supabase
            .from('invoice_templates')
            .update({ is_default: false })
            .eq('company_id', companyId);
        }
        
        // Update template
        const { data, error } = await supabase
          .from('invoice_templates')
          .update({
            name: values.name,
            is_default: values.is_default,
            primary_color: values.primary_color,
            secondary_color: values.secondary_color,
            font_family: values.font_family,
            logo_position: values.logo_position,
            header_text: values.header_text,
            footer_text: values.footer_text,
            show_payment_instructions: values.show_payment_instructions,
            payment_instructions: values.payment_instructions
          })
          .eq('id', selectedTemplate.id)
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: t("templateUpdated"),
          description: t("templateUpdatedDescription"),
        });
        
        setSelectedTemplate(data as unknown as InvoiceTemplateSettings);
      }
      
      // Reload templates
      loadTemplates();
      setActiveTab("list");
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: t("errorSavingTemplate"),
        description: t("errorSavingTemplateDescription"),
        variant: "destructive",
      });
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
          {templates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">{t("noTemplatesFound")}</p>
                <Button onClick={handleAddTemplate}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t("createFirstTemplate")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="relative">
                  {template.is_default && (
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      <Crown className="h-3 w-3 mr-1" />
                      {t("default")}
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{t("fontFamily")}: {template.font_family || "Default"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: template.primary_color || '#3b82f6' }} />
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: template.secondary_color || '#f3f4f6' }} />
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{t("logoPosition")}: {template.logo_position || "Left"}</p>
                    
                    {template.header_text && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">{t("headerText")}</p>
                        <p className="text-xs text-muted-foreground truncate">{template.header_text}</p>
                      </div>
                    )}
                    
                    {template.footer_text && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">{t("footerText")}</p>
                        <p className="text-xs text-muted-foreground truncate">{template.footer_text}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      {t("edit")}
                    </Button>
                    <div className="flex gap-2">
                      {!template.is_default && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSetDefault(template.id)}
                        >
                          {t("setDefault")}
                        </Button>
                      )}
                      {!template.is_default && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>{selectedTemplate ? t("editTemplate") : t("newTemplate")}</CardTitle>
              <CardDescription>{t("customizeInvoiceTemplate")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("templateName")}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t("templateNamePlaceholder")} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="font_family"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fontFamily")}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("selectFont")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="helvetica">Helvetica</SelectItem>
                              <SelectItem value="times">Times</SelectItem>
                              <SelectItem value="courier">Courier</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="primary_color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("primaryColor")}</FormLabel>
                          <FormControl>
                            <Input 
                              type="color" 
                              {...field} 
                              className="h-10 w-full"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="secondary_color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("secondaryColor")}</FormLabel>
                          <FormControl>
                            <Input 
                              type="color" 
                              {...field} 
                              className="h-10 w-full"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="logo_position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("logoPosition")}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectLogoPosition")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="left">{t("left")}</SelectItem>
                            <SelectItem value="center">{t("center")}</SelectItem>
                            <SelectItem value="right">{t("right")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="header_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("headerText")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder={t("headerTextPlaceholder")} 
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormDescription>
                          {t("headerTextDescription")}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="footer_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("footerText")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder={t("footerTextPlaceholder")} 
                            className="min-h-[80px]"
                          />
                        </FormControl>
                        <FormDescription>
                          {t("footerTextDescription")}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="show_payment_instructions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t("showPaymentInstructions")}
                          </FormLabel>
                          <FormDescription>
                            {t("showPaymentInstructionsDescription")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("show_payment_instructions") && (
                    <FormField
                      control={form.control}
                      name="payment_instructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("paymentInstructions")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder={t("paymentInstructionsPlaceholder")} 
                              className="min-h-[100px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="is_default"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t("defaultTemplate")}
                          </FormLabel>
                          <FormDescription>
                            {t("defaultTemplateDescription")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("list")}
                    >
                      {t("cancel")}
                    </Button>
                    <Button type="submit">
                      {selectedTemplate ? t("updateTemplate") : t("createTemplate")}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceTemplateManager;
