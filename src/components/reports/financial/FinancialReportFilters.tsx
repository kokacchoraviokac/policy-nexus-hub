import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { FilterX, Search } from 'lucide-react';
import { 
  defaultFinancialFilters 
} from '@/utils/reports/financialReportUtils';
import type { FinancialReportFilters, FinancialReportFiltersProps } from '@/types/reports';

const FinancialReportFilters: React.FC<FinancialReportFiltersProps> = ({ 
  filters, 
  onApply, 
  onChange,
  setFilters
}) => {
  const { t } = useLanguage();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  
  const handleChange = (field: keyof FinancialReportFilters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };
  
  const handleDateChange = (field: 'dateFrom' | 'dateTo', date: Date) => {
    setFilters({
      ...filters,
      [field]: format(date, 'yyyy-MM-dd')
    });
  };
  
  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Date Range Selection */}
          <div>
            <label className="text-sm font-medium mb-1 block">{t("startDate")}</label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom
                    ? format(new Date(filters.dateFrom), 'PPP')
                    : t("selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(filters.dateFrom)}
                  onSelect={(date) => {
                    if (date) {
                      handleDateChange('dateFrom', date);
                      setStartDateOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">{t("endDate")}</label>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo
                    ? format(new Date(filters.dateTo), 'PPP')
                    : t("selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(filters.dateTo)}
                  onSelect={(date) => {
                    if (date) {
                      handleDateChange('dateTo', date);
                      setEndDateOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Transaction Type Filter */}
          <div>
            <label className="text-sm font-medium mb-1 block">{t("transactionType")}</label>
            <Select
              value={filters.transactionType}
              onValueChange={(value) => handleChange('transactionType', value)}
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
          
          {/* Entity Type Filter */}
          <div>
            <label className="text-sm font-medium mb-1 block">{t("entityType")}</label>
            <Select
              value={filters.entityType}
              onValueChange={(value) => handleChange('entityType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allTypes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allEntities")}</SelectItem>
                <SelectItem value="policy">{t("policies")}</SelectItem>
                <SelectItem value="invoice">{t("invoices")}</SelectItem>
                <SelectItem value="claim">{t("claims")}</SelectItem>
                <SelectItem value="commission">{t("commissions")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium mb-1 block">{t("status")}</label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="completed">{t("completed")}</SelectItem>
                <SelectItem value="pending">{t("pending")}</SelectItem>
                <SelectItem value="canceled">{t("canceled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Search Field */}
          <div>
            <label className="text-sm font-medium mb-1 block">{t("search")}</label>
            <Input
              value={filters.searchTerm}
              onChange={(e) => handleChange('searchTerm', e.target.value)}
              placeholder={t("searchTransactions")}
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            {t("resetFilters")}
          </Button>
          
          <Button
            onClick={onApply}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            {t("applyFilters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialReportFilters;
