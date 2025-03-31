
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { KanbanSquare, UserPlus, Clipboard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Sales = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("sales")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("salesDescription")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pipeline Overview */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-start mb-2">
              <KanbanSquare className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>{t("pipelineOverview")}</CardTitle>
            <CardDescription>{t("pipelineDescription")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/sales/pipeline">{t("viewPipeline")}</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Leads */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-start mb-2">
              <UserPlus className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>{t("leads")}</CardTitle>
            <CardDescription>{t("leadsDescription")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/sales/leads">{t("manageLeads")}</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Sales Processes */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-start mb-2">
              <Clipboard className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>{t("salesProcesses")}</CardTitle>
            <CardDescription>{t("salesProcessesDescription")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/sales/processes">{t("manageSalesProcesses")}</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Responsible Persons */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-start mb-2">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>{t("responsiblePersons")}</CardTitle>
            <CardDescription>{t("responsiblePersonsDescription")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/sales/responsible">{t("manageAssignments")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Sales;
