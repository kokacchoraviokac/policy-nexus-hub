
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, X, Star, Info } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";
import LeadsTable from "@/components/sales/leads/LeadsTable";
import NewLeadDialog from "@/components/sales/leads/NewLeadDialog";
import { useLeadsData } from "@/hooks/sales/useLeadsData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BANTCriteriaList from "@/components/sales/leads/BANTCriteriaList";

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Leads = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewLeadDialog, setShowNewLeadDialog] = useState(false);
  const [showBantInfo, setShowBantInfo] = useState(false);
  
  // Get leads data from hook
  const { 
    leads, 
    isLoading, 
    error, 
    refresh,
    totalLeads,
    leadsByStatus 
  } = useLeadsData(searchQuery, statusFilter);
  
  // Handle open/close dialog
  const handleOpenNewLeadDialog = () => setShowNewLeadDialog(true);
  const handleCloseNewLeadDialog = () => setShowNewLeadDialog(false);
  
  // Handle lead creation
  const handleLeadCreated = () => {
    refresh();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || statusFilter !== "all";
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("leads")}</h1>
          <p className="text-muted-foreground mt-1">{t("leadsDescription")}</p>
        </div>
        <Button onClick={handleOpenNewLeadDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("newLead")}
        </Button>
      </div>
      
      {/* BANT Criteria Info Card */}
      <Card className="border shadow-sm bg-muted/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Star className="h-4 w-4 mr-1" />
              {t("leadQualificationCriteria")}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">{t("information")}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{t("bantFrameworkDescription")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <BANTCriteriaList orientation="horizontal" size="sm" />
        </CardContent>
      </Card>
      
      {/* Status summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("totalLeads")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalLeads}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("newLeads")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leadsByStatus.new || 0}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("qualifiedLeads")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leadsByStatus.qualified || 0}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("convertedLeads")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leadsByStatus.converted || 0}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          placeholder={t("searchLeads")}
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:w-72"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allLeads")}</SelectItem>
            <SelectItem value="new">{t("newLeads")}</SelectItem>
            <SelectItem value="qualified">{t("qualifiedLeads")}</SelectItem>
            <SelectItem value="converted">{t("convertedLeads")}</SelectItem>
            <SelectItem value="lost">{t("lostLeads")}</SelectItem>
          </SelectContent>
        </Select>
        
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="icon">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("activeFilters")}:</span>
          {searchQuery && (
            <Badge variant="outline" className="flex items-center gap-1">
              {t("search")}: {searchQuery}
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              {t("status")}: {t(statusFilter + "Leads")}
            </Badge>
          )}
        </div>
      )}
      
      {/* Table or empty state */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>{t("allLeads")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : leads && leads.length > 0 ? (
            <LeadsTable leads={leads} onRefresh={refresh} />
          ) : (
            <EmptyState
              title={t("noLeadsFound")}
              description={hasActiveFilters ? t("tryAdjustingFilters") : t("createYourFirstLead")}
              icon={<UserPlus className="h-6 w-6 text-muted-foreground" />}
              action={
                hasActiveFilters ? (
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    {t("clearFilters")}
                  </Button>
                ) : (
                  <Button className="mt-4" onClick={handleOpenNewLeadDialog}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("newLead")}
                  </Button>
                )
              }
            />
          )}
        </CardContent>
      </Card>
      
      {/* New Lead Dialog */}
      <NewLeadDialog 
        open={showNewLeadDialog} 
        onOpenChange={setShowNewLeadDialog}
        onLeadCreated={handleLeadCreated}
      />
    </div>
  );
};

export default Leads;
