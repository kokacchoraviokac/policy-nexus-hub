import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  X, 
  Mail,
  RefreshCw,
  Download,
  Send
} from "lucide-react";
import {
  EmailTemplateWithVariables,
  getVariablesForCategory,
  renderTemplate,
  EMAIL_TEMPLATE_CATEGORIES
} from "@/types/email-templates";

interface EmailTemplatePreviewProps {
  template: EmailTemplateWithVariables;
  onClose: () => void;
  onEdit: () => void;
}

const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({
  template,
  onClose,
  onEdit
}) => {
  const { t } = useLanguage();
  const [previewData, setPreviewData] = useState<Record<string, string>>({});
  const [isCustomData, setIsCustomData] = useState(false);

  // Initialize preview data with sample values
  useEffect(() => {
    const variables = getVariablesForCategory(template.category);
    const sampleData: Record<string, string> = {};
    
    variables.forEach(variable => {
      sampleData[variable.name] = variable.example || `[${variable.name}]`;
    });
    
    setPreviewData(sampleData);
  }, [template.category]);

  const handleVariableChange = (variableName: string, value: string) => {
    setPreviewData(prev => ({
      ...prev,
      [variableName]: value
    }));
    setIsCustomData(true);
  };

  const resetToSampleData = () => {
    const variables = getVariablesForCategory(template.category);
    const sampleData: Record<string, string> = {};
    
    variables.forEach(variable => {
      sampleData[variable.name] = variable.example || `[${variable.name}]`;
    });
    
    setPreviewData(sampleData);
    setIsCustomData(false);
  };

  const getRenderedTemplate = () => {
    try {
      return {
        subject: renderTemplate(template.subject, previewData),
        content: renderTemplate(template.content, previewData),
        isValid: true
      };
    } catch (error) {
      return {
        subject: template.subject,
        content: template.content,
        isValid: false,
        error: error instanceof Error ? error.message : 'Rendering failed'
      };
    }
  };

  const getCategoryInfo = () => {
    return EMAIL_TEMPLATE_CATEGORIES.find(cat => cat.id === template.category);
  };

  const availableVariables = getVariablesForCategory(template.category);
  const rendered = getRenderedTemplate();
  const categoryInfo = getCategoryInfo();

  return (
    <div className="space-y-6">
      {/* Template Information */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {template.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              {template.is_default && (
                <Badge variant="default">{t("defaultTemplate")}</Badge>
              )}
              <Badge variant="outline">{categoryInfo?.name || template.category}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{t("category")}:</span>
              <p className="text-muted-foreground">{categoryInfo?.name || template.category}</p>
            </div>
            <div>
              <span className="font-medium">{t("createdAt")}:</span>
              <p className="text-muted-foreground">
                {new Date(template.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Variable Values */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{t("previewData")}</CardTitle>
                {isCustomData && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetToSampleData}
                    className="text-xs"
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    {t("resetToSample")}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {availableVariables.map((variable) => (
                    <div key={variable.name} className="space-y-1">
                      <Label className="text-xs font-medium">
                        {variable.name}
                        {variable.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      <Input
                        value={previewData[variable.name] || ""}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                        placeholder={variable.example || `Enter ${variable.name}`}
                        className="text-xs"
                      />
                      <p className="text-xs text-muted-foreground">
                        {variable.description}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Email Preview */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t("emailPreview")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Subject Line */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("subject")}
                  </Label>
                  <div className="p-3 bg-muted/30 rounded-md border">
                    <p className="text-sm font-medium">
                      {rendered.subject || t("noSubject")}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Email Content */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("emailBody")}
                  </Label>
                  <div className="p-4 bg-white rounded-md border min-h-[250px] shadow-sm">
                    <div 
                      className="text-sm whitespace-pre-wrap leading-relaxed"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                      dangerouslySetInnerHTML={{ 
                        __html: rendered.content.replace(/\n/g, '<br>') || t("noContent")
                      }}
                    />
                  </div>
                </div>

                {/* Rendering Status */}
                {!rendered.isValid && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive">
                      {t("templateRenderingError")}: {rendered.error}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview Actions */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                {t("downloadPreview")}
              </Button>
              <Button variant="outline" size="sm">
                <Send className="mr-2 h-4 w-4" />
                {t("sendTestEmail")}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                {t("close")}
              </Button>
              <Button onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                {t("editTemplate")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatePreview;