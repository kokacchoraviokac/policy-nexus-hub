
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Calendar } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useLanguage } from "@/contexts/LanguageContext";
import { FinancialReportFilters } from "@/utils/reports/financialReportUtils";

export interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  updateFilters: (newFilters: Partial<FinancialReportFilters>) => void;
  onApply: () => Promise<void>;
}

const FinancialReportFilters: React.FC<FinancialReportFiltersProps> = ({
  filters,
  updateFilters,
  onApply
}) => {
  const { t } = useLanguage();
  const [localFilters, setLocalFilters] = useState<FinancialReportFilters>({
    ...filters,
    // Set these values to match the existing fields to avoid undefined values
    searchTerm: filters.searchTerm || '',
    startDate: filters.dateFrom,
    endDate: filters.dateTo
  });
  const [isApplying, setIsApplying] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (field: keyof FinancialReportFilters, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      setLocalFilters((prev) => ({
        ...prev,
        [field]: date.toISOString().split('T')[0]
      }));
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      // Map the filter values correctly
      updateFilters({
        searchTerm: localFilters.searchTerm,
        dateFrom: localFilters.startDate,
        dateTo: localFilters.endDate,
        transactionType: localFilters.transactionType,
        category: localFilters.category,
        status: localFilters.status
      });
      await onApply();
    } finally {
      setIsApplying(false);
    }
  };

  const handleReset = () => {
    const defaultFilters: FinancialReportFilters = {
      dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      dateTo: new Date().toISOString().split('T')[0],
      transactionType: 'all',
      category: 'all',
      status: 'all',
      searchTerm: '',
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    };
    
    setLocalFilters(defaultFilters);
    updateFilters(defaultFilters);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="searchTerm"
              placeholder={t("searchByDescriptionOrRef")}
              className="pl-8"
              value={localFilters.searchTerm}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="w-full sm:w-1/3 space-y-2">
          <Label className="text-xs">{t("dateRange")}</Label>
          <div className="flex gap-2 items-center">
            <DatePicker
              date={localFilters.startDate ? new Date(localFilters.startDate) : undefined}
              onSelect={(date) => handleDateChange('startDate', date)}
              placeholder={t("from")}
            />
            <span>-</span>
            <DatePicker
              date={localFilters.endDate ? new Date(localFilters.endDate) : undefined}
              onSelect={(date) => handleDateChange('endDate', date)}
              placeholder={t("to")}
            />
          </div>
        </div>
        
        <div className="w-full sm:w-1/3 flex items-end gap-2">
          <Button 
            onClick={handleApply} 
            className="flex-1"
            disabled={isApplying}
          >
            {isApplying ? t("applying") : t("applyFilters")}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex-1"
          >
            {t("reset")}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="transactionType" className="text-xs">
            {t("transactionType")}
          </Label>
          <Select
            value={localFilters.transactionType}
            onValueChange={(value) => handleSelectChange('transactionType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("allTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allTypes")}</SelectItem>
              <SelectItem value="income">{t("income")}</SelectItem>
              <SelectItem value="expense">{t("expense")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-1/3">
          <Label htmlFor="category" className="text-xs">
            {t("category")}
          </Label>
          <Select
            value={localFilters.category}
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              <SelectItem value="premium">{t("premium")}</SelectItem>
              <SelectItem value="commission">{t("commission")}</SelectItem>
              <SelectItem value="fee">{t("fee")}</SelectItem>
              <SelectItem value="claim">{t("claim")}</SelectItem>
              <SelectItem value="other">{t("other")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-1/3">
          <Label htmlFor="status" className="text-xs">
            {t("status")}
          </Label>
          <Select
            value={localFilters.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
              <SelectItem value="completed">{t("completed")}</SelectItem>
              <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportFilters;
