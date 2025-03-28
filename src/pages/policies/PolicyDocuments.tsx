
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PolicyDocuments = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("documents")}</h1>
          <p className="text-muted-foreground">
            {t("policyDocumentsDescription")}
          </p>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-border">
        <EmptyState
          icon="file-search"
          title={t("noPolicyDocuments")}
          description={t("noPolicyDocumentsDescription")}
          action={
            <Button onClick={() => navigate("/policies")}>
              <FileText className="mr-2 h-4 w-4" />
              {t("viewPolicies")}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default PolicyDocuments;
