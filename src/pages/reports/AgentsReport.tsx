
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AgentsReport = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleBackToReports = () => {
    navigate("/reports");
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={handleBackToReports}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {t("backToReports")}
      </Button>
      
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{t("agentsReport")}</h1>
        <p className="text-muted-foreground">
          {t("agentsReportDescription")}
        </p>
      </div>
      
      <Card className="p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-2">{t("comingSoon")}</h2>
        <p className="text-muted-foreground max-w-md">
          {t("featureUnderDevelopment")}
        </p>
      </Card>
    </div>
  );
};

export default AgentsReport;
