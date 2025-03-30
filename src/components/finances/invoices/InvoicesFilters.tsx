
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface InvoiceFilterOptionsType {
  search?: string;
  status?: 'draft' | 'issued' | 'paid' | 'cancelled' | '';
  dateFrom?: Date;
  dateTo?: Date;
  invoiceType?: 'domestic' | 'foreign' | '';
  invoiceCategory?: 'automatic' | 'manual' | '';
}

interface InvoicesFiltersProps {
  filters: InvoiceFilterOptionsType;
  onFilterChange: (filters: InvoiceFilterOptionsType) => void;
  onClearFilters: () => void;
}

const InvoicesFilters = ({
  filters,
  onFilterChange,
  onClearFilters
}: InvoicesFiltersProps) => {
  const { t } = useLanguage();

  const handleFilterChange = (key: keyof InvoiceFilterOptionsType, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  // Count active filters excluding empty strings
  const activeFiltersCount = Object.values(filters).filter(val => 
    val !== undefined && val !== '' && val !== null
  ).length;

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchInvoices")}
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-8"
              />
              {filters.search && (
                <button
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => handleFilterChange('search', '')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="draft">{t("draft")}</SelectItem>
                <SelectItem value="issued">{t("issued")}</SelectItem>
                <SelectItem value="paid">{t("paid")}</SelectItem>
                <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filters.invoiceType || ''}
              onValueChange={(value) => handleFilterChange('invoiceType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("invoiceType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="domestic">{t("domestic")}</SelectItem>
                <SelectItem value="foreign">{t("foreign")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filters.invoiceCategory || ''}
              onValueChange={(value) => handleFilterChange('invoiceCategory', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("invoiceCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="automatic">{t("automatic")}</SelectItem>
                <SelectItem value="manual">{t("manual")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  {filters.dateFrom ? (
                    format(filters.dateFrom, "PPP")
                  ) : (
                    <span>{t("from")}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => handleFilterChange('dateFrom', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  {filters.dateTo ? (
                    format(filters.dateTo, "PPP")
                  ) : (
                    <span>{t("to")}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => handleFilterChange('dateTo', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>

      {activeFiltersCount > 0 && (
        <CardFooter className="px-4 py-3 border-t flex justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("activeFilters")}:</span>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {t("search")}: {filters.search}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('search', '')} 
                  />
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {t("status")}: {t(filters.status)}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('status', '')} 
                  />
                </Badge>
              )}
              {filters.dateFrom && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {t("from")}: {format(filters.dateFrom, "P")}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('dateFrom', undefined)} 
                  />
                </Badge>
              )}
              {filters.dateTo && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {t("to")}: {format(filters.dateTo, "P")}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('dateTo', undefined)} 
                  />
                </Badge>
              )}
              {filters.invoiceType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {t("invoiceType")}: {t(filters.invoiceType)}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('invoiceType', '')} 
                  />
                </Badge>
              )}
              {filters.invoiceCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {t("invoiceCategory")}: {t(filters.invoiceCategory)}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('invoiceCategory', '')} 
                  />
                </Badge>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClearFilters}
          >
            {t("clearFilters")}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default InvoicesFilters;
