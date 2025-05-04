
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Template } from '@/types/sales/templates';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RichTextEditor from '../editor/RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface EditTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onSave: (template: Partial<Template>) => void;
  isLoading?: boolean;
}

const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({
  open,
  onOpenChange,
  template,
  onSave,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('content');
  const [variables, setVariables] = useState<string[]>([]);
  const [variableInput, setVariableInput] = useState('');

  // Define the form schema
  const FormSchema = z.object({
    name: z.string().min(1, { message: t("templateNameRequired") }),
    subject: z.string().min(1, { message: t("subjectRequired") }),
    content: z.string().min(1, { message: t("contentRequired") }),
    category: z.string().default('general')
  });

  // Initialize the form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: template?.name || '',
      subject: template?.subject || '',
      content: template?.content || '',
      category: template?.category || 'general'
    }
  });

  // Update form values when template changes
  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        subject: template.subject,
        content: template.content,
        category: template.category
      });
      
      // Update variables if available
      if (Array.isArray(template.variables)) {
        setVariables(template.variables);
      } else {
        setVariables([]);
      }
    }
  }, [template, form]);

  const handleAddVariable = () => {
    if (!variableInput.trim() || variables.includes(variableInput)) {
      return;
    }
    
    setVariables([...variables, variableInput]);
    setVariableInput('');
  };

  const handleRemoveVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    onSave({
      ...data,
      variables,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template?.id ? t("editTemplate") : t("createTemplate")}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("templateName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterTemplateName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="content">{t("content")}</TabsTrigger>
                <TabsTrigger value="variables">{t("variables")}</TabsTrigger>
                <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("emailSubject")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("enterSubject")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("emailContent")}</FormLabel>
                      <FormControl>
                        <RichTextEditor 
                          value={field.value} 
                          onChange={field.onChange}
                          placeholder={t("composeEmail")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("category")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("enterCategory")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="variables" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>{t("availableVariables")}</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("variablesDescription")}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {variables.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {t("noVariables")}
                        </p>
                      ) : (
                        variables.map((variable, idx) => (
                          <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                            {`{{${variable}}}`}
                            <button 
                              type="button" 
                              className="ml-1"
                              onClick={() => handleRemoveVariable(variable)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">{t("removeVariable")}</span>
                            </button>
                          </Badge>
                        ))
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder={t("addVariable")}
                        value={variableInput}
                        onChange={(e) => setVariableInput(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={handleAddVariable}
                        disabled={!variableInput.trim()}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {t("add")}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>{t("commonVariables")}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        "company_name",
                        "lead_name",
                        "user_name",
                        "contact_email",
                        "current_date",
                        "product_name"
                      ].map((variable) => (
                        <Button 
                          key={variable}
                          type="button"
                          variant="outline" 
                          className="justify-start"
                          onClick={() => {
                            if (!variables.includes(variable)) {
                              setVariables([...variables, variable]);
                            } else {
                              toast.info(t("variableAlreadyAdded"));
                            }
                          }}
                        >
                          {`{{${variable}}}`}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-semibold text-lg">
                    {form.watch("subject")}
                  </h3>
                  
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: form.watch("content") }}
                  ></div>
                  
                  {variables.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-sm mb-2">{t("usedVariables")}</h4>
                      <div className="flex flex-wrap gap-2">
                        {variables.map((v, idx) => (
                          <div key={idx}>
                            <Badge variant="outline">
                              {`{{${v}}}`}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("saving") : t("saveTemplate")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateDialog;
