
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import InvoiceTemplateManager from "@/components/finances/invoices/InvoiceTemplateManager";

const InvoiceTemplatesPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link 
              to="/finances/invoicing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{t("invoiceTemplates")}</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            {t("editTemplateDescription")}
          </p>
        </div>
      </div>
      
      <InvoiceTemplateManager />
    </div>
  );
};

export default InvoiceTemplatesPage;
