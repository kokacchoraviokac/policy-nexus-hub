
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { FinancialReportFilters, FinancialReportFiltersProps } from '@/types/reports';
import { DatePicker } from '@/components/ui/date-picker';
import { Filter, X, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

const FinancialReportFiltersComponent: React.FC<FinancialReportFiltersProps> = ({
  filters,
  setFilters,
  onApply,
  onChange
}) => {
  const { t } = useLanguage();
  const [localFilters, setLocalFilters] = useState<FinancialReportFilters>({
    ...filters
  });
  
  const handleChange = (field: keyof FinancialReportFilters, value: any) => {
    const updatedFilters = {
      ...localFilters,
      [field]: value
    };
    setLocalFilters(updatedFilters);
    
    if (onChange) {
      onChange(updatedFilters);
    }
  };
  
  const handleReset = () => {
    const resetFilters: FinancialReportFilters = {
      startDate: new Date(new Date().setDate(1)),
      endDate: new Date()
    };
    
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };
  
  const handleApply = () => {
    setFilters(localFilters);
    onApply();
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label>{t('startDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {localFilters.startDate instanceof Date 
                    ? format(localFilters.startDate, 'PPP')
                    : t('selectDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <DatePicker
                  mode="single"
                  selected={localFilters.startDate instanceof Date ? localFilters.startDate : new Date()}
                  onSelect={(date) => handleChange('startDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>{t('endDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {localFilters.endDate instanceof Date 
                    ? format(localFilters.endDate, 'PPP')
                    : t('selectDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <DatePicker
                  mode="single"
                  selected={localFilters.endDate instanceof Date ? localFilters.endDate : new Date()}
                  onSelect={(date) => handleChange('endDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>{t('search')}</Label>
            <Input 
              placeholder={t('searchTransactions')}
              value={localFilters.searchTerm || ''}
              onChange={(e) => handleChange('searchTerm', e.target.value)}
            />
          </div>
          
          <div className="space-y-2 self-end">
            <Button 
              className="w-full"
              onClick={handleApply}
            >
              {t('applyFilters')}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>{t('transactionType')}</Label>
            <Select 
              value={localFilters.transactionType || 'all'}
              onValueChange={(value) => handleChange('transactionType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('allTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allTypes')}</SelectItem>
                <SelectItem value="income">{t('income')}</SelectItem>
                <SelectItem value="expense">{t('expense')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>{t('minAmount')}</Label>
            <Input
              type="number"
              placeholder={t('minAmount')}
              value={localFilters.minAmount || ''}
              onChange={(e) => handleChange('minAmount', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t('maxAmount')}</Label>
            <Input
              type="number"
              placeholder={t('maxAmount')}
              value={localFilters.maxAmount || ''}
              onChange={(e) => handleChange('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t('status')}</Label>
            <Select 
              value={localFilters.status || 'all'}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="completed">{t('completed')}</SelectItem>
                <SelectItem value="pending">{t('pending')}</SelectItem>
                <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>{t('category')}</Label>
            <Select 
              value={localFilters.category || 'all'}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                <SelectItem value="sales">{t('sales')}</SelectItem>
                <SelectItem value="commissions">{t('commissions')}</SelectItem>
                <SelectItem value="operational">{t('operational')}</SelectItem>
                <SelectItem value="taxes">{t('taxes')}</SelectItem>
                <SelectItem value="other">{t('other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 flex items-end">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleReset}
            >
              <X className="mr-2 h-4 w-4" />
              {t('resetFilters')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialReportFiltersComponent;
