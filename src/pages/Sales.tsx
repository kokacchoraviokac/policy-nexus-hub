
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { KanbanSquare, UserPlus, Clipboard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Sales = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("sales")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("salesDescription")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pipeline Overview */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <KanbanSquare className="h-10 w-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold">{t("pipelineOverview")}</h2>
              <p className="text-muted-foreground mt-2">{t("pipelineDescription")}</p>
            </div>
          </div>
          <div className="mt-6">
            <Button asChild>
              <Link to="/sales/pipeline">{t("viewPipeline")}</Link>
            </Button>
          </div>
        </div>
        
        {/* Leads */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <UserPlus className="h-10 w-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold">{t("leads")}</h2>
              <p className="text-muted-foreground mt-2">{t("leadsDescription")}</p>
            </div>
          </div>
          <div className="mt-6">
            <Button asChild>
              <Link to="/sales/leads">{t("manageLeads")}</Link>
            </Button>
          </div>
        </div>
        
        {/* Sales Processes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <Clipboard className="h-10 w-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold">{t("salesProcesses")}</h2>
              <p className="text-muted-foreground mt-2">{t("salesProcessesDescription")}</p>
            </div>
          </div>
          <div className="mt-6">
            <Button asChild>
              <Link to="/sales/processes">{t("manageSalesProcesses")}</Link>
            </Button>
          </div>
        </div>
        
        {/* Responsible Persons */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <Users className="h-10 w-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold">{t("responsiblePersons")}</h2>
              <p className="text-muted-foreground mt-2">{t("responsiblePersonsDescription")}</p>
            </div>
          </div>
          <div className="mt-6">
            <Button asChild>
              <Link to="/sales/responsible">{t("manageAssignments")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
