
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { FinancialReportFilters } from '@/types/reports';
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchIcon, FileDownIcon, RefreshCw } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  setFilters: (filters: Partial<FinancialReportFilters>) => void;
  onApply: () => void;
  onChange?: (filters: Partial<FinancialReportFilters>) => void;
}

const FinancialReportFiltersComponent: React.FC<FinancialReportFiltersProps> = ({
  filters,
  setFilters,
  onApply,
  onChange
}) => {
  const { t } = useLanguage();
  
  const handleDateChange = (field: 'dateFrom' | 'dateTo') => (date: Date | undefined) => {
    if (date) {
      setFilters({ [field]: date });
      if (onChange) onChange({ [field]: date });
    }
  };
  
  const handleStatusChange = (value: string) => {
    setFilters({ status: value });
    if (onChange) onChange({ status: value });
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom">{t("dateFrom")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? (
                    format(new Date(filters.dateFrom), "PPP")
                  ) : (
                    <span>{t("pickADate")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  defaultMonth={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                  selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                  onSelect={handleDateChange('dateFrom')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateTo">{t("dateTo")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? (
                    format(new Date(filters.dateTo), "PPP")
                  ) : (
                    <span>{t("pickADate")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  defaultMonth={filters.dateTo ? new Date(filters.dateTo) : undefined}
                  selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
                  onSelect={handleDateChange('dateTo')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">{t("status")}</Label>
            <Select 
              value={filters.status || ''} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder={t("allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allStatuses")}</SelectItem>
                <SelectItem value="pending">{t("pending")}</SelectItem>
                <SelectItem value="completed">{t("completed")}</SelectItem>
                <SelectItem value="canceled">{t("canceled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            variant="outline"
            onClick={onApply}
          >
            <SearchIcon className="h-4 w-4 mr-2" />
            {t("search")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialReportFiltersComponent;
