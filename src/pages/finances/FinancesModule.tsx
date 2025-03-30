
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FinancesModuleProps {
  title: string;
}

const FinancesModule: React.FC<FinancesModuleProps> = ({ title }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t(title)}</h1>
        <Button onClick={() => navigate("/finances")} variant="outline">
          {t("backToFinances")}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t(title)}</CardTitle>
          <CardDescription>{t(`${title}Description`)}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10 text-muted-foreground">
            {t("moduleUnderDevelopment")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancesModule;
