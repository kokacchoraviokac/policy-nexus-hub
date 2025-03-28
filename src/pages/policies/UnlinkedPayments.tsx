
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreditCard } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";

const UnlinkedPayments = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("unlinkedPayments")}</h1>
          <p className="text-muted-foreground">
            {t("unlinkedPaymentsDescription")}
          </p>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-border">
        <EmptyState
          icon="alert"
          title={t("noUnlinkedPayments")}
          description={t("allPaymentsLinked")}
        />
      </div>
    </div>
  );
};

export default UnlinkedPayments;
