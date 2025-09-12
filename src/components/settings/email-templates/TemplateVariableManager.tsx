import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Code, 
  Info, 
  Star,
  Copy,
  CheckCircle
} from "lucide-react";
import { 
  TemplateVariable, 
  getVariablesForCategory,
  COMMON_TEMPLATE_VARIABLES 
} from "@/types/email-templates";
import { toast } from "sonner";

interface TemplateVariableManagerProps {
  category: string;
  onVariableInsert: (variableName: string) => void;
  className?: string;
}

const TemplateVariableManager: React.FC<TemplateVariableManagerProps> = ({
  category,
  onVariableInsert,
  className = ""
}) => {
  const { t } = useLanguage();

  const categoryVariables = category ? getVariablesForCategory(category) : [];
  const commonVariables = COMMON_TEMPLATE_VARIABLES;
  const specificVariables = categoryVariables.filter(
    v => !commonVariables.some(cv => cv.name === v.name)
  );

  const handleVariableClick = (variableName: string) => {
    onVariableInsert(variableName);
    toast.success(t("variableInserted"), {
      description: `{{${variableName}}} ${t("addedToTemplate")}`
    });
  };

  const copyVariableToClipboard = (variableName: string) => {
    const variable = `{{${variableName}}}`;
    navigator.clipboard.writeText(variable).then(() => {
      toast.success(t("copiedToClipboard"), {
        description: variable
      });
    });
  };

  const VariableCard: React.FC<{ variable: TemplateVariable; isCommon?: boolean }> = ({ 
    variable, 
    isCommon = false 
  }) => (
    <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
            {`{{${variable.name}}}`}
          </code>
          {variable.required && (
            <Badge variant="destructive" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              {t("required")}
            </Badge>
          )}
          {isCommon && (
            <Badge variant="outline" className="text-xs">
              {t("common")}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => handleVariableClick(variable.name)}
            title={t("insertVariable")}
          >
            <CheckCircle className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyVariableToClipboard(variable.name)}
            title={t("copyToClipboard")}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mb-1">
        {variable.description}
      </p>
      
      {variable.example && (
        <div className="text-xs">
          <span className="text-muted-foreground">{t("example")}: </span>
          <code className="bg-muted/50 px-1 rounded">{variable.example}</code>
        </div>
      )}
      
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="outline" className="text-xs">
          {variable.type}
        </Badge>
      </div>
    </div>
  );

  if (!category) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Info className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {t("selectCategoryToSeeVariables")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Code className="h-4 w-4" />
          {t("availableVariables")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {/* Category-specific variables */}
            {specificVariables.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  {t("categorySpecific")}
                </h4>
                <div className="space-y-2">
                  {specificVariables.map((variable) => (
                    <VariableCard key={variable.name} variable={variable} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Common variables */}
            {specificVariables.length > 0 && <Separator />}
            
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                {t("commonVariables")}
              </h4>
              <div className="space-y-2">
                {commonVariables.map((variable) => (
                  <VariableCard key={variable.name} variable={variable} isCommon />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <Separator className="my-4" />
        
        <div className="text-xs text-muted-foreground">
          <p className="mb-1">
            <strong>{t("usage")}:</strong> {t("clickToInsertVariable")}
          </p>
          <p>
            <strong>{t("format")}:</strong> {t("variableFormatDescription")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateVariableManager;