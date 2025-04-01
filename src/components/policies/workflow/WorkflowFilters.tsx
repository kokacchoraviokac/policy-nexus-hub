
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  RefreshCw,
  ArrowUpDown,
  Calendar,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkflowFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
  sortOrder?: string;
  onSortChange?: (value: string) => void;
  workflowStatus?: string;
  onWorkflowStatusChange?: (value: string) => void;
}

const WorkflowFilters: React.FC<WorkflowFiltersProps> = ({ 
  searchTerm, 
  onSearchChange,
  onRefresh,
  sortOrder = "newest",
  onSortChange,
  workflowStatus = "all",
  onWorkflowStatusChange,
}) => {
  const { t } = useLanguage();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("searchPolicies")}
          className="pl-8"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      <div className="flex gap-2">
        {onWorkflowStatusChange && (
          <Select
            value={workflowStatus}
            onValueChange={onWorkflowStatusChange}
          >
            <SelectTrigger className="w-[150px] gap-1.5">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder={t("workflowStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allWorkflowStatuses")}</SelectItem>
              <SelectItem value="draft">{t("draft")}</SelectItem>
              <SelectItem value="in_review">{t("inReview")}</SelectItem>
              <SelectItem value="ready">{t("ready")}</SelectItem>
              <SelectItem value="complete">{t("complete")}</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {onSortChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5">
                <ArrowUpDown className="h-4 w-4" />
                {t("sort")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>{t("sortBy")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={onSortChange}>
                <DropdownMenuRadioItem value="newest">{t("newestFirst")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">{t("oldestFirst")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="policy_asc">{t("policyNumberAsc")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="policy_desc">{t("policyNumberDesc")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="premium_high">{t("premiumHighToLow")}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="premium_low">{t("premiumLowToHigh")}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            title={t("refresh")}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkflowFilters;
