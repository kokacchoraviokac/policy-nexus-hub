
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FileBarChart, 
  Users, 
  UserRound, 
  PieChart, 
  BanknoteIcon,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Reports = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const reports = [
    {
      title: t("productionReport"),
      description: t("productionReportDescription"),
      icon: <FileBarChart className="h-5 w-5" />,
      path: "/reports/production"
    },
    {
      title: t("clientsReport"),
      description: t("clientsReportDescription"),
      icon: <Users className="h-5 w-5" />,
      path: "/reports/clients"
    },
    {
      title: t("agentsReport"),
      description: t("agentsReportDescription"),
      icon: <UserRound className="h-5 w-5" />,
      path: "/reports/agents"
    },
    {
      title: t("claimsReport"),
      description: t("claimsReportDescription"),
      icon: <PieChart className="h-5 w-5" />,
      path: "/reports/claims"
    },
    {
      title: t("financialReport"),
      description: t("financialReportDescription"),
      icon: <BanknoteIcon className="h-5 w-5" />,
      path: "/reports/financial"
    }
  ];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{t("reports")}</h1>
        <p className="text-muted-foreground">
          {t("reportsPageDescription")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-md">
                  {report.icon}
                </div>
                <CardTitle className="text-xl">{report.title}</CardTitle>
              </div>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate(report.path)}
              >
                {t("viewReport")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
