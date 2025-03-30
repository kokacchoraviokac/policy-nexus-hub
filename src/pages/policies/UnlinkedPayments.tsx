
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UnlinkedPayments = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("unlinkedPayments")}</h1>
        <p className="text-muted-foreground">
          {t("unlinkedPaymentsDescription")}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("manageUnlinkedPayments")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("unlinkedPaymentsContent")}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnlinkedPayments;
