
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ClientCommissions from "@/components/agent/ClientCommissions";

const ClientCommissionsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/agent")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToAgent")}
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("clientCommissions")}</h1>
          <p className="text-muted-foreground">{t("clientCommissionsDescription")}</p>
        </div>
      </div>
      
      <ClientCommissions />
    </div>
  );
};

export default ClientCommissionsPage;
