
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, Filter, X } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";
import LeadsTable from "@/components/sales/leads/LeadsTable";
import NewLeadDialog from "@/components/sales/leads/NewLeadDialog";
import { useLeadsData } from "@/hooks/sales/useLeadsData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  const handleLeadCreated = (leadData: any) => {
    refresh();
    toast.success(t("leadCreated"), {
      description: t("leadCreatedDescription", { name: leadData.name })
    });
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
        <h1 className="text-2xl font-bold tracking-tight">{t("leads")}</h1>
        <Button onClick={handleOpenNewLeadDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("newLead")}
        </Button>
      </div>
      
      {/* Status summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-muted-foreground text-sm">{t("totalLeads")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{leadsByStatus.new || 0}</div>
            <p className="text-muted-foreground text-sm">{t("newLeads")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{leadsByStatus.qualified || 0}</div>
            <p className="text-muted-foreground text-sm">{t("qualifiedLeads")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{leadsByStatus.converted || 0}</div>
            <p className="text-muted-foreground text-sm">{t("convertedLeads")}</p>
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
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : leads && leads.length > 0 ? (
        <LeadsTable leads={leads} onRefresh={refresh} />
      ) : (
        <div className="bg-card rounded-lg border shadow-sm p-6">
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
        </div>
      )}
      
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
