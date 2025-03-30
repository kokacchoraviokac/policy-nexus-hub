
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { FilterOptions } from "@/hooks/unlinked-payments";

interface UnlinkedPaymentsFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const UnlinkedPaymentsFilters: React.FC<UnlinkedPaymentsFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const { t } = useLanguage();
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  
  const handleInputChange = (key: keyof FilterOptions, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };
  
  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Input
            placeholder={t("searchPlaceholder")}
            value={localFilters.searchTerm || ""}
            onChange={(e) => handleInputChange("searchTerm", e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <Select
            value={localFilters.status || ""}
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("all")}</SelectItem>
              <SelectItem value="unlinked">{t("unlinked")}</SelectItem>
              <SelectItem value="linked">{t("linked")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <DatePicker
            placeholder={t("from")}
            date={localFilters.dateFrom}
            setDate={(date) => handleInputChange("dateFrom", date)}
            className="w-full"
          />
        </div>
        
        <div>
          <DatePicker
            placeholder={t("to")}
            date={localFilters.dateTo}
            setDate={(date) => handleInputChange("dateTo", date)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={!Object.values(localFilters).some(Boolean)}
        >
          <X className="h-4 w-4 mr-1" />
          {t("clearFilters")}
        </Button>
        
        <Button type="submit">
          <Search className="h-4 w-4 mr-1" />
          {t("search")}
        </Button>
      </div>
    </form>
  );
};

export default UnlinkedPaymentsFilters;
