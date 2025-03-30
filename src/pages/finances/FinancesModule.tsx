
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { CircleDollarSign, Calculator, Receipt, FileText } from "lucide-react";

const FinancesModule = () => {
  const { t } = useLanguage();
  const location = useLocation();
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("finances")}</h1>
        <p className="text-muted-foreground">
          {t("financesDescription")}
        </p>
      </div>
      
      <Tabs defaultValue="commissions" className="w-full">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger 
            value="commissions" 
            className="flex items-center gap-2"
            asChild
          >
            <Link to="/finances/commissions">
              <Calculator className="h-4 w-4" />
              {t("commissions")}
            </Link>
          </TabsTrigger>
          <TabsTrigger 
            value="invoicing" 
            className="flex items-center gap-2"
            asChild
          >
            <Link to="/finances/invoicing">
              <Receipt className="h-4 w-4" />
              {t("invoicing")}
            </Link>
          </TabsTrigger>
          <TabsTrigger 
            value="statements" 
            className="flex items-center gap-2"
            asChild
          >
            <Link to="/finances/statements">
              <FileText className="h-4 w-4" />
              {t("statementProcessing")}
            </Link>
          </TabsTrigger>
          <TabsTrigger 
            value="unlinked-payments" 
            className="flex items-center gap-2"
            asChild
          >
            <Link to="/finances/unlinked-payments">
              <CircleDollarSign className="h-4 w-4" />
              {t("unlinkedPayments")}
            </Link>
          </TabsTrigger>
        </TabsList>
        
        <Routes>
          <Route path="*" element={
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg border border-border text-center">
              <CircleDollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">{t("selectFinancialModule")}</p>
              <p className="text-muted-foreground mt-2">{t("selectModuleDescription")}</p>
            </div>
          } />
        </Routes>
      </Tabs>
    </div>
  );
};

export default FinancesModule;
