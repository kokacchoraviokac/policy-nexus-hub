
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, FilterX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FinancialReportFilters, FinancialReportFiltersProps } from "@/types/reports";
import { DatePicker } from "@/components/ui/date-picker";

const FinancialReportFilters: React.FC<FinancialReportFiltersProps> = ({
  filters,
  setFilters,
  onApply,
  onChange
}) => {
  const { t } = useLanguage();

  const handleChange = (key: keyof FinancialReportFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onChange) {
      onChange(newFilters);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(),
      type: '',
      category: '',
      minAmount: undefined,
      maxAmount: undefined,
      searchTerm: '',
      status: ''
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>{t("startDate")}</Label>
            <DatePicker 
              selected={new Date(filters.startDate)} 
              onSelect={(date) => handleChange('startDate', date)} 
              initialFocus={true}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t("endDate")}</Label>
            <DatePicker 
              selected={new Date(filters.endDate)} 
              onSelect={(date) => handleChange('endDate', date)} 
              initialFocus={true}
            />
          </div>
          
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>{t("transactionType")}</Label>
            <Select
              value={filters.transactionType || ''}
              onValueChange={(value) => handleChange('transactionType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allTypes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allTypes")}</SelectItem>
                <SelectItem value="income">{t("income")}</SelectItem>
                <SelectItem value="expense">{t("expense")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Search Term */}
          <div className="space-y-2">
            <Label>{t("search")}</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchTransactions")}
                value={filters.searchTerm || ''}
                onChange={(e) => handleChange('searchTerm', e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <Label>{t("category")}</Label>
            <Select
              value={filters.category || ''}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allCategories")}</SelectItem>
                <SelectItem value="commission">{t("commission")}</SelectItem>
                <SelectItem value="service">{t("service")}</SelectItem>
                <SelectItem value="insurance">{t("insurance")}</SelectItem>
                <SelectItem value="tax">{t("tax")}</SelectItem>
                <SelectItem value="other">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Amount Range */}
          <div className="space-y-2">
            <Label>{t("minAmount")}</Label>
            <Input
              type="number"
              placeholder={t("minAmount")}
              value={filters.minAmount || ''}
              onChange={(e) => handleChange('minAmount', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t("maxAmount")}</Label>
            <Input
              type="number"
              placeholder={t("maxAmount")}
              value={filters.maxAmount || ''}
              onChange={(e) => handleChange('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          
          {/* Status */}
          <div className="space-y-2">
            <Label>{t("status")}</Label>
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allStatuses")}</SelectItem>
                <SelectItem value="completed">{t("completed")}</SelectItem>
                <SelectItem value="pending">{t("pending")}</SelectItem>
                <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="gap-1"
          >
            <FilterX className="h-4 w-4" />
            {t("reset")}
          </Button>
          <Button onClick={onApply} className="gap-1">
            <Search className="h-4 w-4" />
            {t("apply")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialReportFilters;
