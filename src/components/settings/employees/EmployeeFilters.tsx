
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchInput from "@/components/ui/search-input";

interface EmployeeFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("searchEmployees")}
        />
      </div>
      
      <Tabs
        defaultValue="all" 
        value={statusFilter}
        onValueChange={onStatusFilterChange}
        className="w-full md:w-auto"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all">{t("allEmployees")}</TabsTrigger>
          <TabsTrigger value="active">{t("activeEmployees")}</TabsTrigger>
          <TabsTrigger value="inactive">{t("inactiveEmployees")}</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
