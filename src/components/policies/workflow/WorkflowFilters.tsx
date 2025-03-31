
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";

interface WorkflowFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

const WorkflowFilters: React.FC<WorkflowFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
}) => {
  const { t } = useLanguage();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-1 flex relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchPolicies")}
          className="pl-8"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <Button variant="outline" size="icon" onClick={onRefresh} title={t("refresh")}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WorkflowFilters;
