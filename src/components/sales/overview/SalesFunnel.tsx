
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface SalesFunnelProps {
  processesByStage: Record<string, number>;
  isLoading: boolean;
}

const SalesFunnel: React.FC<SalesFunnelProps> = ({ 
  processesByStage,
  isLoading 
}) => {
  const { t } = useLanguage();
  
  const stages = [
    { id: "discovery", label: t("discovery") },
    { id: "qualification", label: t("qualification") },
    { id: "quote", label: t("quote") },
    { id: "negotiation", label: t("negotiation") },
    { id: "closing", label: t("closing") }
  ];
  
  const totalCount = Object.values(processesByStage).reduce((sum, count) => sum + count, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("salesFunnel")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 min-h-[300px] items-center justify-center">
            <div className="animate-pulse flex flex-col w-full space-y-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex flex-col space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div 
                    className="h-8 bg-slate-200 rounded" 
                    style={{ width: `${100 - index * 15}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("salesFunnel")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const count = processesByStage[stage.id] || 0;
            const percentage = totalCount ? Math.round((count / totalCount) * 100) : 0;
            
            return (
              <div key={stage.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{stage.label}</span>
                  <span className="text-muted-foreground">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesFunnel;
