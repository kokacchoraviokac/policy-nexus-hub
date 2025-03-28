
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PolicyWorkflow = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("policiesWorkflow")}</h1>
          <p className="text-muted-foreground">
            {t("policiesWorkflowDescription")}
          </p>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-border">
        <EmptyState
          icon="file"
          title={t("noPoliciesInWorkflow")}
          description={t("noPoliciesInWorkflowDescription")}
          action={
            <Button onClick={() => navigate("/policies/new")}>
              <FileText className="mr-2 h-4 w-4" />
              {t("createNewPolicy")}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default PolicyWorkflow;
