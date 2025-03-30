
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, CircleDollarSign, Receipt, FileText } from "lucide-react";

const Finances = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Financial module options
  const modules = [
    {
      id: "commissions",
      title: t("commissions"),
      description: t("commissionsDescription"),
      icon: <Calculator className="h-6 w-6" />,
      path: "/finances/commissions"
    },
    {
      id: "invoicing",
      title: t("invoicing"),
      description: t("invoicingDescription"),
      icon: <Receipt className="h-6 w-6" />,
      path: "/finances/invoicing"
    },
    {
      id: "statements",
      title: t("statementProcessing"),
      description: t("statementProcessingDescription"),
      icon: <FileText className="h-6 w-6" />,
      path: "/finances/statements"
    },
    {
      id: "unlinked-payments",
      title: t("unlinkedPayments"),
      description: t("unlinkedPaymentsDescription"),
      icon: <CircleDollarSign className="h-6 w-6" />,
      path: "/finances/unlinked-payments"
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{t("finances")}</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {t("financesDescription")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

export default Finances;
