
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const InvoicingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/finances")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("backToFinances")}
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("invoicing")}</h1>
          <p className="text-muted-foreground">
            {t("invoicingModuleDescription")}
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("moduleUnderDevelopment")}</CardTitle>
          <CardDescription>
            This module is currently being implemented. More features will be available soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            The Invoicing module will allow you to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Create invoices manually or automatically from commissions</li>
            <li>Manage invoice statuses (draft, issued, paid, cancelled)</li>
            <li>Generate and customize invoice templates</li>
            <li>Track payment status and due dates</li>
            <li>Export invoices in various formats</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicingPage;
