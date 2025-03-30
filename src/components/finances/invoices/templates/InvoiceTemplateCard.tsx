
import React from "react";
import { InvoiceTemplateSettings } from "@/types/finances";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Crown, Trash2 } from "lucide-react";

interface InvoiceTemplateCardProps {
  template: InvoiceTemplateSettings;
  onEdit: (template: InvoiceTemplateSettings) => void;
  onDelete: (templateId: string) => void;
  onSetDefault: (templateId: string) => void;
}

export const InvoiceTemplateCard = ({ 
  template, 
  onEdit, 
  onDelete, 
  onSetDefault 
}: InvoiceTemplateCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className="relative">
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
          <div 
            className="w-8 h-8 rounded" 
            style={{ backgroundColor: template.primary_color || '#3b82f6' }} 
          />
          <div 
            className="w-8 h-8 rounded" 
            style={{ backgroundColor: template.secondary_color || '#f3f4f6' }} 
          />
        </div>
        
        <p className="text-sm text-muted-foreground">
          {t("logoPosition")}: {template.logo_position || "Left"}
        </p>
        
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
          onClick={() => onEdit(template)}
        >
          {t("edit")}
        </Button>
        <div className="flex gap-2">
          {!template.is_default && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSetDefault(template.id)}
            >
              {t("setDefault")}
            </Button>
          )}
          {!template.is_default && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(template.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
