
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { getFeatureFlags, toggleFeatureFlag } from "@/utils/featureFlags";

const FeatureFlagsSettings: React.FC = () => {
  const { t } = useLanguage();
  const featureFlags = getFeatureFlags();
  
  const handleToggleFeature = (featureName: keyof typeof featureFlags, enabled: boolean) => {
    toggleFeatureFlag(featureName, enabled);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("advancedFeatures")}</CardTitle>
        <CardDescription>
          {t("manageAdvancedFeatures")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{t("enhancedDocumentExtraction")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("enhancedDocumentExtractionDescription")}
              </p>
            </div>
            <Switch
              checked={featureFlags.enhancedDocumentExtraction}
              onCheckedChange={(checked) => 
                handleToggleFeature("enhancedDocumentExtraction", checked)
              }
            />
          </div>
          
          {featureFlags.enhancedDocumentExtraction && (
            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
              {t("enhancedExtractionEnabled")}
            </div>
          )}
          
          {!featureFlags.enhancedDocumentExtraction && (
            <div className="text-sm text-muted-foreground italic">
              {t("featureFlagChangeRequiresCodeUpdate")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureFlagsSettings;
