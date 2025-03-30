
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { PlusCircle, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SalesProcessesTable from "@/components/sales/processes/SalesProcessesTable";
import CreateSalesProcessDialog from "@/components/sales/processes/CreateSalesProcessDialog";
import { useSalesProcessData } from "@/hooks/sales/useSalesProcessData";

const SalesProcesses = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const { 
    salesProcesses, 
    isLoading, 
    processesByStage, 
    refresh: refreshSalesProcesses 
  } = useSalesProcessData(searchQuery, stageFilter);

  const handleCreateSalesProcess = () => {
    toast.success(t("processCreated"), {
      description: t("processCreatedDescription"),
    });
    refreshSalesProcesses();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with action button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("salesProcesses")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("salesProcessesDescription")}
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("newSalesProcess")}
        </Button>
      </div>
      
      {/* Filter and search controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchSalesProcesses")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t("stage")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStages")}</SelectItem>
            <SelectItem value="quote">{t("quoteManagement")}</SelectItem>
            <SelectItem value="authorization">{t("clientAuthorization")}</SelectItem>
            <SelectItem value="proposal">{t("policyProposal")}</SelectItem>
            <SelectItem value="signed">{t("signedPolicies")}</SelectItem>
            <SelectItem value="concluded">{t("concluded")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card rounded-lg p-4 border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">{t("totalProcesses")}</div>
          <div className="text-2xl font-bold mt-1">{salesProcesses.length}</div>
        </div>
        <div className="bg-card rounded-lg p-4 border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">{t("quoteStage")}</div>
          <div className="text-2xl font-bold mt-1">{processesByStage.quote || 0}</div>
        </div>
        <div className="bg-card rounded-lg p-4 border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">{t("authorizationStage")}</div>
          <div className="text-2xl font-bold mt-1">{processesByStage.authorization || 0}</div>
        </div>
        <div className="bg-card rounded-lg p-4 border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">{t("proposalStage")}</div>
          <div className="text-2xl font-bold mt-1">{processesByStage.proposal || 0}</div>
        </div>
        <div className="bg-card rounded-lg p-4 border shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">{t("signedStage")}</div>
          <div className="text-2xl font-bold mt-1">{processesByStage.signed || 0}</div>
        </div>
      </div>
      
      {/* Sales processes table */}
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium">{t("allSalesProcesses")}</h2>
          <p className="text-sm text-muted-foreground">{t("salesProcessesTableDescription")}</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <SalesProcessesTable 
            salesProcesses={salesProcesses} 
            onRefresh={refreshSalesProcesses} 
          />
        )}
      </div>
      
      {/* Create sales process dialog */}
      <CreateSalesProcessDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onSalesProcessCreated={handleCreateSalesProcess} 
      />
    </div>
  );
};

export default SalesProcesses;
