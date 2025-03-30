
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface FinancesModuleProps {
  title: string;
}

const FinancesModule: React.FC<FinancesModuleProps> = ({ title }) => {
  const { t } = useLanguage();
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center mb-6">
        <Link 
          to="/finances"
          className="text-muted-foreground hover:text-foreground mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-2xl font-bold">{t(title)}</h2>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-12 text-center">
        <p className="text-lg text-muted-foreground">
          {t("moduleUnderDevelopment")}
        </p>
        
        {title === "invoicing" && (
          <p className="mt-4">
            <Link 
              to="/finances/invoicing"
              className="text-primary hover:underline"
            >
              {t("goToInvoicing")}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default FinancesModule;
