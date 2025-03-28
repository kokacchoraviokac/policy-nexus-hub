
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface DocumentsLoadErrorProps {
  onRetry: () => void;
}

const DocumentsLoadError: React.FC<DocumentsLoadErrorProps> = ({ onRetry }) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardContent className="py-6">
        <div className="text-center py-6">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
          <h3 className="text-lg font-medium text-destructive">{t("errorLoadingDocuments")}</h3>
          <p className="text-muted-foreground mt-2">{t("tryRefreshingPage")}</p>
          <Button className="mt-4" onClick={onRetry}>
            {t("refresh")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsLoadError;
