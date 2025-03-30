
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileBarChart, Users, UserCog, FileText, DollarSign } from "lucide-react";

const Reports = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const reportModules = [
    {
      title: "policyProductionReport",
      description: "policyProductionReportDescription",
      path: "/reports/policies",
      icon: FileBarChart,
      enabled: true
    },
    {
      title: "clientsReport",
      description: "clientsReportDescription",
      path: "/reports/clients",
      icon: Users,
      enabled: false
    },
    {
      title: "agentsReport",
      description: "agentsReportDescription",
      path: "/reports/agents",
      icon: UserCog,
      enabled: false
    },
    {
      title: "claimsReport",
      description: "claimsReportDescription",
      path: "/reports/claims",
      icon: FileText,
      enabled: false
    },
    {
      title: "financialReport",
      description: "financialReportDescription",
      path: "/reports/financial",
      icon: DollarSign,
      enabled: true
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{t("reports")}</h1>
        <p className="text-muted-foreground">
          {t("reportsAndAnalytics")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportModules.map((module, index) => (
          <Card key={index} className={`overflow-hidden transition-all duration-200 ${!module.enabled ? 'opacity-70' : 'hover:shadow-md'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <module.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t(module.title)}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="pb-4">{t(module.description)}</CardDescription>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(module.path)}
                disabled={!module.enabled}
              >
                {t("viewReport")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 bg-muted/50 p-4 rounded-lg border">
        <h2 className="font-semibold mb-2">{t("comingSoon")}</h2>
        <p className="text-muted-foreground">
          {t("additionalReportsBeingDeveloped")}
        </p>
      </div>
    </div>
  );
};

export default Reports;
