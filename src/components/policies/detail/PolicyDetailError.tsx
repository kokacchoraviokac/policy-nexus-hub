
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface PolicyDetailErrorProps {
  error?: Error;
  onBackToList: () => void;
}

const PolicyDetailError: React.FC<PolicyDetailErrorProps> = ({ error, onBackToList }) => {
  const { t } = useLanguage();

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">{t("policyNotFound")}</h3>
          <p className="text-muted-foreground mt-2">
            {error instanceof Error ? error.message : t("errorLoadingPolicy")}
          </p>
          <Button className="mt-4" onClick={onBackToList}>
            {t("backToPolicies")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyDetailError;
