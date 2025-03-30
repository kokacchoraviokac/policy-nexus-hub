
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PolicyReportFilters } from "@/utils/policies/policyReportUtils";
import { Search, RefreshCw, FileDown } from "lucide-react";

interface PolicyProductionFiltersProps {
  filters: PolicyReportFilters;
  onFiltersChange: (filters: PolicyReportFilters) => void;
  onExport: () => void;
  onRefresh: () => void;
  isExporting: boolean;
}

const PolicyProductionFilters: React.FC<PolicyProductionFiltersProps> = ({
  filters,
  onFiltersChange,
  onExport,
  onRefresh,
  isExporting
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch clients for dropdown
  const { data: clients } = useQuery({
    queryKey: ['clients-dropdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch insurers for dropdown
  const { data: insurers } = useQuery({
    queryKey: ['insurers-dropdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurers')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch agents for dropdown
  const { data: agents } = useQuery({
    queryKey: ['agents-dropdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Apply search filter to client name
    onFiltersChange({
      ...filters,
      // Add search logic here if needed
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      [field]: date
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value === "all" ? "" : value // Convert "all" to empty string for filtering
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    onFiltersChange({});
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPolicies")}
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Button type="submit">{t("search")}</Button>
        <Button type="button" variant="outline" onClick={handleClearFilters}>
          {t("clear")}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client">{t("client")}</Label>
          <Select
            value={filters.clientId || "all"}
            onValueChange={(value) => handleSelectChange("clientId", value)}
          >
            <SelectTrigger id="client">
              <SelectValue placeholder={t("allClients")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allClients")}</SelectItem>
              {clients?.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="insurer">{t("insurer")}</Label>
          <Select
            value={filters.insurerId || "all"}
            onValueChange={(value) => handleSelectChange("insurerId", value)}
          >
            <SelectTrigger id="insurer">
              <SelectValue placeholder={t("allInsurers")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allInsurers")}</SelectItem>
              {insurers?.map((insurer) => (
                <SelectItem key={insurer.id} value={insurer.id}>
                  {insurer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent">{t("agent")}</Label>
          <Select
            value={filters.agentId || "all"}
            onValueChange={(value) => handleSelectChange("agentId", value)}
          >
            <SelectTrigger id="agent">
              <SelectValue placeholder={t("allAgents")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allAgents")}</SelectItem>
              {agents?.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">{t("commissionStatus")}</Label>
          <Select
            value={filters.commissionStatus || "all"}
            onValueChange={(value) => handleSelectChange("commissionStatus", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              <SelectItem value="paid">{t("paid")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
              <SelectItem value="calculated">{t("calculated")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("startDate")}</Label>
          <DatePicker
            date={filters.startDate}
            setDate={(date) => handleDateChange("startDate", date)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t("endDate")}</Label>
          <DatePicker
            date={filters.endDate}
            setDate={(date) => handleDateChange("endDate", date)}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="mr-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            {t("refresh")}
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={isExporting}
        >
          <FileDown className="h-4 w-4 mr-1" />
          {t("exportToExcel")}
        </Button>
      </div>
    </div>
  );
};

export default PolicyProductionFilters;
