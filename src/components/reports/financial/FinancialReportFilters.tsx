
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Filter, RefreshCw, Download, X } from "lucide-react";
import { FinancialReportFilters as FiltersType } from "@/utils/reports/financialReportUtils";
import { Badge } from "@/components/ui/badge";

interface FinancialReportFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  onExport: () => void;
  onRefresh: () => void;
  isExporting: boolean;
}

const FinancialReportFilters: React.FC<FinancialReportFiltersProps> = ({
  filters,
  onFiltersChange,
  onExport,
  onRefresh,
  isExporting
}) => {
  const { t } = useLanguage();
  const [localFilters, setLocalFilters] = useState<FiltersType>(filters);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  useEffect(() => {
    // Calculate active filters for display
    const active: string[] = [];
    if (localFilters.searchTerm) active.push('search');
    if (localFilters.transactionType && localFilters.transactionType !== 'all') active.push('type');
    if (localFilters.category && localFilters.category !== 'all') active.push('category');
    if (localFilters.startDate || localFilters.endDate) active.push('dateRange');
    
    setActiveFilters(active);
  }, [localFilters]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (name: string, date: Date | undefined) => {
    setLocalFilters(prev => ({ ...prev, [name]: date }));
  };
  
  const applyFilters = () => {
    onFiltersChange(localFilters);
  };
  
  const resetFilters = () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const emptyFilters: FiltersType = {
      startDate: firstDayOfMonth,
      endDate: currentDate
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };
  
  const removeFilter = (filterName: string) => {
    const updatedFilters = { ...localFilters };
    if (filterName === 'search') updatedFilters.searchTerm = '';
    if (filterName === 'type') updatedFilters.transactionType = 'all';
    if (filterName === 'category') updatedFilters.category = 'all';
    if (filterName === 'dateRange') {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      updatedFilters.startDate = firstDayOfMonth;
      updatedFilters.endDate = currentDate;
    }
    
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("search")}</label>
          <Input 
            placeholder={t("searchByDescriptionOrReference")}
            name="searchTerm"
            value={localFilters.searchTerm || ""}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("transactionType")}</label>
          <Select
            value={localFilters.transactionType || "all"}
            onValueChange={(value) => handleSelectChange("transactionType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("allTransactionTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allTransactionTypes")}</SelectItem>
              <SelectItem value="income">{t("income")}</SelectItem>
              <SelectItem value="expense">{t("expense")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("category")}</label>
          <Select
            value={localFilters.category || "all"}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              <SelectItem value="commission">{t("commission")}</SelectItem>
              <SelectItem value="invoice">{t("invoice")}</SelectItem>
              <SelectItem value="office">{t("office")}</SelectItem>
              <SelectItem value="software">{t("software")}</SelectItem>
              <SelectItem value="rent">{t("rent")}</SelectItem>
              <SelectItem value="marketing">{t("marketing")}</SelectItem>
              <SelectItem value="salary">{t("salary")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("dateRange")}</label>
          <div className="flex space-x-2">
            <DatePicker
              date={localFilters.startDate}
              setDate={(date) => handleDateChange("startDate", date)}
              placeholder={t("from")}
            />
            <DatePicker
              date={localFilters.endDate}
              setDate={(date) => handleDateChange("endDate", date)}
              placeholder={t("to")}
            />
          </div>
        </div>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {activeFilters.includes('search') && (
            <Badge variant="outline" className="flex items-center gap-1">
              {t("search")}: {localFilters.searchTerm}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => removeFilter('search')}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {activeFilters.includes('type') && (
            <Badge variant="outline" className="flex items-center gap-1">
              {t("type")}: {t(localFilters.transactionType || '')}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => removeFilter('type')}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {activeFilters.includes('category') && (
            <Badge variant="outline" className="flex items-center gap-1">
              {t("category")}: {t(localFilters.category || '')}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => removeFilter('category')}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {activeFilters.includes('dateRange') && (
            <Badge variant="outline" className="flex items-center gap-1">
              {t("dateRange")}: {localFilters.startDate?.toLocaleDateString()} - {localFilters.endDate?.toLocaleDateString()}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => removeFilter('dateRange')}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {activeFilters.length > 1 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetFilters}>
              {t("clearAll")}
            </Button>
          )}
        </div>
      )}
      
      <div className="flex justify-between pt-2">
        <div className="space-x-2">
          <Button onClick={applyFilters} variant="default" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            {t("applyFilters")}
          </Button>
          <Button onClick={resetFilters} variant="outline">
            {t("resetFilters")}
          </Button>
        </div>
        
        <div className="space-x-2">
          <Button onClick={onRefresh} variant="outline" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("refresh")}
          </Button>
          <Button 
            onClick={onExport} 
            variant="outline" 
            className="flex items-center"
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? t("exporting") : t("exportToExcel")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportFilters;
