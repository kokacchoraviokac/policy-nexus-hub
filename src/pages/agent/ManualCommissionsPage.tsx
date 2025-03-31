
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ManualCommissions from "@/components/agent/ManualCommissions";

const ManualCommissionsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/agent")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("backToAgent")}
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("manualCommissions")}</h1>
          <p className="text-muted-foreground">
            {t("manualCommissionsModuleDescription")}
          </p>
        </div>
      </div>
      
      <ManualCommissions />
    </div>
  );
};

export default ManualCommissionsPage;
