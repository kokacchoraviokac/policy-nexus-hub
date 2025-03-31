
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

const Claims = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleNewClaim = () => {
    navigate("/claims/new");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("claims")}</h1>
          <p className="text-muted-foreground">
            {t("claimsManagement")}
          </p>
        </div>
        
        <Button onClick={handleNewClaim}>
          <Plus className="mr-2 h-4 w-4" />
          {t("newClaim")}
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">{t("claimsManagement")}</h3>
          <p className="text-muted-foreground mb-4">
            {t("noClaimsFound")}
          </p>
          <Button onClick={handleNewClaim}>
            <Plus className="mr-2 h-4 w-4" />
            {t("registerNewClaim")}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Claims;
