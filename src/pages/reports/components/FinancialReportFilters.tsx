
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
import { FinancialReportFilters } from '@/types/reports';
import { useLanguage } from '@/contexts/LanguageContext';
import { SearchIcon, FileDownIcon, RefreshCw } from 'lucide-react';

interface FinancialReportFiltersProps {
  filters: FinancialReportFilters;
  updateFilters: (newFilters: Partial<FinancialReportFilters>) => void;
  onSearch: () => void;
  onExport: () => void;
  isLoading: boolean;
  isExporting: boolean;
}

const FinancialReportFiltersComponent: React.FC<FinancialReportFiltersProps> = ({
  filters,
  updateFilters,
  onSearch,
  onExport,
  isLoading,
  isExporting
}) => {
  const { t } = useLanguage();
  
  const handleDateChange = (field: 'dateFrom' | 'dateTo') => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ [field]: e.target.value });
  };
  
  const handleStatusChange = (value: string) => {
    updateFilters({ status: value });
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom">{t("dateFrom")}</Label>
            <Input
              id="dateFrom"
              type="date"
              value={typeof filters.dateFrom === 'string' ? filters.dateFrom : ''}
              onChange={handleDateChange('dateFrom')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateTo">{t("dateTo")}</Label>
            <Input
              id="dateTo"
              type="date"
              value={typeof filters.dateTo === 'string' ? filters.dateTo : ''}
              onChange={handleDateChange('dateTo')}
            />
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
            onClick={onSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <SearchIcon className="h-4 w-4 mr-2" />
            )}
            {t("search")}
          </Button>
          
          <Button
            variant="secondary"
            onClick={onExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileDownIcon className="h-4 w-4 mr-2" />
            )}
            {t("export")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialReportFiltersComponent;
