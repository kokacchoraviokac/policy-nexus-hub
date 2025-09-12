import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Code, 
  Eye, 
  Save, 
  X, 
  Plus,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import { toast } from "sonner";
import {
  EmailTemplateWithVariables,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
  EMAIL_TEMPLATE_CATEGORIES,
  getVariablesForCategory,
  validateTemplateVariables,
  renderTemplate
} from "@/types/email-templates";

interface EmailTemplateEditorProps {
  template?: EmailTemplateWithVariables | null;
  onSave: (templateData: CreateEmailTemplateRequest | UpdateEmailTemplateRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subject: "",
    content: "",
    is_default: false
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<Record<string, string>>({});

  // Initialize form data
  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        category: template.category,
        subject: template.subject,
        content: template.content,
        is_default: template.is_default
      });
    } else {
      setFormData({
        name: "",
        category: "",
        subject: "",
        content: "",
        is_default: false
      });
    }
  }, [template]);

  // Validate template when content or category changes
  useEffect(() => {
    if (formData.content && formData.category) {
      const errors = validateTemplateVariables(formData.content, getVariablesForCategory(formData.category));
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);
    }
  }, [formData.content, formData.category]);

  // Generate sample preview data when category changes
  useEffect(() => {
    if (formData.category) {
      const variables = getVariablesForCategory(formData.category);
      const sampleData: Record<string, string> = {};
      
      variables.forEach(variable => {
        sampleData[variable.name] = variable.example || `[${variable.name}]`;
      });
      
      setPreviewData(sampleData);
    }
  }, [formData.category]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error(t("templateNameRequired"));
      return;
    }
    
    if (!formData.category) {
      toast.error(t("templateCategoryRequired"));
      return;
    }
    
    if (!formData.subject.trim()) {
      toast.error(t("templateSubjectRequired"));
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error(t("templateContentRequired"));
      return;
    }

    if (validationErrors.length > 0) {
      toast.error(t("templateValidationErrors"));
      return;
    }

    onSave(formData);
  };

  const insertVariable = (variableName: string) => {
    const variable = `{{${variableName}}}`;
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = formData.content.substring(0, start) + variable + formData.content.substring(end);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const getPreviewContent = () => {
    try {
      return {
        subject: renderTemplate(formData.subject, previewData),
        content: renderTemplate(formData.content, previewData)
      };
    } catch (error) {
      return {
        subject: formData.subject,
        content: formData.content
      };
    }
  };

  const availableVariables = formData.category ? getVariablesForCategory(formData.category) : [];
  const preview = getPreviewContent();

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">{t("templateName")} *</Label>
          <Input
            id="template-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t("enterTemplateName")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="template-category">{t("category")} *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {EMAIL_TEMPLATE_CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-subject">{t("subject")} *</Label>
        <Input
          id="template-subject"
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          placeholder={t("enterTemplateSubject")}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is-default"
          checked={formData.is_default}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
        />
        <Label htmlFor="is-default">{t("setAsDefaultTemplate")}</Label>
      </div>

      {/* Content Editor with Variables */}
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            {t("editor")}
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {t("preview")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Content Editor */}
            <div className="lg:col-span-2 space-y-2">
              <Label htmlFor="template-content">{t("templateContent")} *</Label>
              <Textarea
                id="template-content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder={t("enterTemplateContent")}
                className="min-h-[300px] font-mono text-sm"
              />
              
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Card className="border-destructive">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {t("validationErrors")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="text-sm space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-destructive">• {error}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Variables Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{t("availableVariables")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {formData.category ? (
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {availableVariables.map((variable) => (
                          <div
                            key={variable.name}
                            className="p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => insertVariable(variable.name)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <code className="text-xs font-mono bg-muted px-1 rounded">
                                {`{{${variable.name}}}`}
                              </code>
                              {variable.required && (
                                <Badge variant="destructive" className="text-xs">
                                  {t("required")}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {variable.description}
                            </p>
                            {variable.example && (
                              <p className="text-xs text-muted-foreground italic">
                                {t("example")}: {variable.example}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-4">
                      <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {t("selectCategoryToSeeVariables")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{t("emailPreview")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("subject")}
                  </Label>
                  <div className="p-3 bg-muted/50 rounded-md border">
                    <p className="text-sm font-medium">{preview.subject || t("noSubject")}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("content")}
                  </Label>
                  <div className="p-4 bg-muted/50 rounded-md border min-h-[200px]">
                    <div 
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: preview.content.replace(/\n/g, '<br>') || t("noContent")
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          <X className="mr-2 h-4 w-4" />
          {t("cancel")}
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isLoading || validationErrors.length > 0}
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? t("saving") : (template ? t("updateTemplate") : t("createTemplate"))}
        </Button>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;