
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesFunnelProps {
  processesByStage: Record<string, number>;
  isLoading?: boolean;
}

const SalesFunnel: React.FC<SalesFunnelProps> = ({ processesByStage, isLoading = false }) => {
  const { t } = useLanguage();
  
  const stages = [
    { id: "initial_contact", label: t("initialContact") },
    { id: "needs_analysis", label: t("needsAnalysis") },
    { id: "quote_preparation", label: t("quotePreparation") },
    { id: "quote_sent", label: t("quoteSent") },
    { id: "negotiation", label: t("negotiation") },
    { id: "closing", label: t("closing") },
  ];
  
  // Calculate max value for scaling
  const maxValue = Math.max(...Object.values(processesByStage), 1);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("salesFunnel")}</CardTitle>
        <CardDescription>{t("salesProcessesByStage")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {stages.map((stage) => {
              const count = processesByStage[stage.id] || 0;
              const width = `${Math.max(count / maxValue * 100, 5)}%`;
              
              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{stage.label}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesFunnel;
