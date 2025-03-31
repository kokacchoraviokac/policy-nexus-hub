
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, FileText, Calculator, PieChart } from "lucide-react";

const AgentPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Agent module options
  const modules = [
    {
      id: "fixed-commissions",
      title: t("fixedCommissions"),
      description: t("fixedCommissionsDescription"),
      icon: <DollarSign className="h-6 w-6" />,
      path: "/agent/fixed-commissions"
    },
    {
      id: "client-commissions",
      title: t("clientCommissions"),
      description: t("clientCommissionsDescription"),
      icon: <Users className="h-6 w-6" />,
      path: "/agent/client-commissions"
    },
    {
      id: "manual-commissions",
      title: t("manualCommissions"),
      description: t("manualCommissionsDescription"),
      icon: <FileText className="h-6 w-6" />,
      path: "/agent/manual-commissions"
    },
    {
      id: "calculate-payouts",
      title: t("calculatePayouts"),
      description: t("calculatePayoutsDescription"),
      icon: <Calculator className="h-6 w-6" />,
      path: "/agent/calculate-payouts"
    },
    {
      id: "payout-reports",
      title: t("payoutReports"),
      description: t("payoutReportsDescription"),
      icon: <PieChart className="h-6 w-6" />,
      path: "/agent/payout-reports"
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{t("agent")}</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {t("agentDescription")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {module.description}
                  </CardDescription>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  {module.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                {t(`${module.id}ModuleDescription`)}
              </p>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 py-3">
              <Button 
                onClick={() => navigate(module.path)} 
                variant="outline" 
                className="w-full"
              >
                {t("goTo")} {module.title}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentPage;
