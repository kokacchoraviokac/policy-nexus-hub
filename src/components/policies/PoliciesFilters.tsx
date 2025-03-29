
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCw, FileDown } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import { exportPoliciesToCSV } from "@/utils/policies/policyExportUtils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Policy } from "@/types/policies";
import { useToast } from "@/hooks/use-toast";

interface PoliciesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
}

const PoliciesFilters: React.FC<PoliciesFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleExportPolicies = async () => {
    toast({
      title: t("exportStarted"),
      description: t("preparingPolicyExport"),
    });

    try {
      // Fetch policies to export
      const query = supabase
        .from('policies')
        .select('*');
      
      // Apply search filter if provided
      if (searchTerm) {
        query.or(
          `policy_number.ilike.%${searchTerm}%,` +
          `policyholder_name.ilike.%${searchTerm}%,` +
          `insurer_name.ilike.%${searchTerm}%,` +
          `product_name.ilike.%${searchTerm}%`
        );
      }
      
      // Apply status filter if provided
      if (statusFilter && statusFilter !== 'all') {
        query.eq('status', statusFilter);
      }
      
      // Fetch the data
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        toast({
          title: t("noDataToExport"),
          description: t("noPoliciesFoundForExport"),
          variant: "destructive",
        });
        return;
      }
      
      // Generate filename with current date
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const filename = `policies-export-${dateStr}.csv`;
      
      // Export the data to CSV
      exportPoliciesToCSV(data as Policy[], filename);
      
      toast({
        title: t("exportComplete"),
        description: t("policiesExportedSuccessfully"),
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: t("exportFailed"),
        description: t("errorExportingPolicies"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={t("searchPolicies")}
          className="w-full"
        />
      </div>
      
      <div className="flex flex-row gap-2">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatuses")}</SelectItem>
            <SelectItem value="active">{t("active")}</SelectItem>
            <SelectItem value="expired">{t("expired")}</SelectItem>
            <SelectItem value="pending">{t("pending")}</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={onRefresh} title={t("refresh")}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleExportPolicies}
          title={t("exportPolicies")}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          <span className="hidden md:inline">{t("export")}</span>
        </Button>
      </div>
    </div>
  );
};

export default PoliciesFilters;
