
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileUp, FileDown } from "lucide-react";
import PolicyImportDialog from "@/components/policies/import/PolicyImportDialog";

const PolicyImportPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const handleBackToWorkflow = () => {
    navigate("/policies/workflow");
  };
  
  const handleImportSuccess = () => {
    toast({
      title: t("importSuccess"),
      description: t("policiesImportedSuccessfully"),
    });
    navigate("/policies/workflow");
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={handleBackToWorkflow}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToPoliciesWorkflow")}
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("importPolicies")}</h1>
          <p className="text-muted-foreground">
            {t("importPoliciesDescription")}
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="import" className="max-w-4xl">
        <TabsList className="mb-4">
          <TabsTrigger value="import">{t("importPolicies")}</TabsTrigger>
          <TabsTrigger value="export">{t("exportPolicies")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>{t("importPolicies")}</CardTitle>
              <CardDescription>
                {t("importPoliciesFromInsuranceCompanies")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("importPoliciesDescription")}
              </p>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                onClick={() => setIsImportDialogOpen(true)}
              >
                <div className="rounded-full p-3 bg-slate-100">
                  <FileUp className="h-6 w-6 text-slate-400" />
                </div>
                <p className="font-medium mt-4">{t("clickToImportPolicies")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("importPoliciesFromCSV")}
                </p>
                <Button 
                  className="mt-4" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImportDialogOpen(true);
                  }}
                >
                  {t("importPolicies")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>{t("exportPolicies")}</CardTitle>
              <CardDescription>
                {t("exportPoliciesDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("exportPoliciesDescription")}
              </p>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                <div className="rounded-full p-3 bg-slate-100">
                  <FileDown className="h-6 w-6 text-slate-400" />
                </div>
                <p className="font-medium mt-4">{t("clickToExportPolicies")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("exportPoliciesAsCSV")}
                </p>
                <Button className="mt-4">
                  {t("exportPolicies")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <PolicyImportDialog 
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default PolicyImportPage;
