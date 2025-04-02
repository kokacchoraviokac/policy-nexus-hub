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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  } = useSalesProcessData({
    searchQuery, 
    stageFilter
  });

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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchSalesProcesses")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
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
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("totalProcesses")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{salesProcesses.length}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("quoteStage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{processesByStage.quote || 0}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("authorizationStage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{processesByStage.authorization || 0}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("proposalStage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{processesByStage.proposal || 0}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("signedStage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{processesByStage.signed || 0}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales processes table */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>{t("allSalesProcesses")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("salesProcessesTableDescription")}</p>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      
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
