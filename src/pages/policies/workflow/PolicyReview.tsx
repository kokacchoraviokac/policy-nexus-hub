
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const PolicyReview = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const handleBackToWorkflow = () => {
    navigate("/policies/workflow");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleBackToWorkflow}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToWorkflow")}
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{t("reviewPolicy")}</h1>
        </div>
      </div>
      
      <Card className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">{t("policyReview")}</h3>
          <p className="text-muted-foreground mb-4">
            {t("policyReviewDescription")}
          </p>
          <p>Policy ID: {id}</p>
        </div>
      </Card>
    </div>
  );
};

export default PolicyReview;
