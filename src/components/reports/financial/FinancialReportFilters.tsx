
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { FinancialReportFilters as FiltersType } from "@/utils/reports/financialReportUtils";
import { Filter, RefreshCw, Download } from "lucide-react";

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
    const emptyFilters: FiltersType = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
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
            value={localFilters.transactionType || ""}
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
            value={localFilters.category || ""}
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
      
      <div className="flex justify-between">
        <div className="space-x-2">
          <Button onClick={applyFilters} variant="default" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            {t("applyFilters")}
          </Button>
          <Button onClick={resetFilters} variant="outline">
            {t("clearFilters")}
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
