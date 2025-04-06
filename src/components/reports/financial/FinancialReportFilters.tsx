
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { FinancialReportFiltersProps } from '@/types/reports';

const FinancialReportFilters: React.FC<FinancialReportFiltersProps> = ({
  filters,
  onApply,
  onChange,
  setFilters,
}) => {
  const { t } = useLanguage();
  const [fromDate, setFromDate] = useState<Date | undefined>(filters.dateFrom ? new Date(filters.dateFrom) : undefined);
  const [toDate, setToDate] = useState<Date | undefined>(filters.dateTo ? new Date(filters.dateTo) : undefined);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    if (onChange) {
      onChange({ ...filters, [key]: value });
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  // Handle date changes
  const handleDateChange = (type: 'from' | 'to', date?: Date) => {
    if (type === 'from') {
      setFromDate(date);
      if (date) {
        handleFilterChange('dateFrom', format(date, 'yyyy-MM-dd'));
      }
    } else {
      setToDate(date);
      if (date) {
        handleFilterChange('dateTo', format(date, 'yyyy-MM-dd'));
      }
    }
  };

  // Reset filters
  const handleReset = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setFilters({
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      transactionType: '',
      category: '',
      status: '',
      entityType: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('search')}</label>
              <Input
                placeholder={t('searchTransactions')}
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('fromDate')}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, 'PPP') : t('selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => handleDateChange('from', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('toDate')}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, 'PPP') : t('selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => handleDateChange('to', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('transactionType')}</label>
              <Select
                value={filters.transactionType}
                onValueChange={(value) => handleFilterChange('transactionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('allTransactionTypes')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('allTransactionTypes')}</SelectItem>
                  <SelectItem value="income">{t('income')}</SelectItem>
                  <SelectItem value="expense">{t('expense')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('category')}</label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('allCategories')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('allCategories')}</SelectItem>
                  <SelectItem value="commission">{t('commission')}</SelectItem>
                  <SelectItem value="premium">{t('premium')}</SelectItem>
                  <SelectItem value="claim">{t('claim')}</SelectItem>
                  <SelectItem value="operational">{t('operational')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('status')}</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('allStatuses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('allStatuses')}</SelectItem>
                  <SelectItem value="pending">{t('pending')}</SelectItem>
                  <SelectItem value="completed">{t('completed')}</SelectItem>
                  <SelectItem value="failed">{t('failed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-1.5"
            >
              <X className="h-4 w-4" />
              {t('resetFilters')}
            </Button>

            <Button
              size="sm"
              onClick={onApply}
              className="gap-1.5"
            >
              <Filter className="h-4 w-4" />
              {t('applyFilters')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialReportFilters;
