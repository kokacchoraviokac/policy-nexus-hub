
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, CreditCard, BanknoteIcon, Coins } from "lucide-react";

const FinancesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const modules = [
    {
      id: "commissions",
      title: t("commissions"),
      description: t("commissionsModuleDescription"),
      icon: <Coins className="h-8 w-8 text-primary" />,
      path: "/finances/commissions",
    },
    {
      id: "invoicing",
      title: t("invoicing"),
      description: t("invoicingModuleDescription"),
      icon: <Receipt className="h-8 w-8 text-primary" />,
      path: "/finances/invoicing",
    },
    {
      id: "statement-processing",
      title: t("statementProcessing"),
      description: t("statementProcessingModuleDescription"),
      icon: <BanknoteIcon className="h-8 w-8 text-primary" />,
      path: "/finances/statement-processing",
    },
    {
      id: "unlinked-payments",
      title: t("unlinkedPayments"),
      description: t("unlinkedPaymentsModuleDescription"),
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      path: "/finances/unlinked-payments",
    },
  ];
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("finances")}</h1>
        <p className="text-muted-foreground">
          {t("financesDescription")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <div className="p-2 rounded-full bg-primary/10">{module.icon}</div>
              </div>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1"></CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate(module.path)}
              >
                {t("view")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancesPage;
