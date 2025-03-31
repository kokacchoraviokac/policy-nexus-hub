
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PayoutReports from "@/components/agent/PayoutReports";

const PayoutReportsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate("/agent")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("backToAgent")}
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("payoutReports")}</h1>
          <p className="text-muted-foreground">{t("payoutReportsDescription")}</p>
        </div>
      </div>
      
      <PayoutReports />
    </div>
  );
};

export default PayoutReportsPage;
