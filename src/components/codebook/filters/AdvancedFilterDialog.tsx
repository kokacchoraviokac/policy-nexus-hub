
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CodebookFilterState } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface AdvancedFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: CodebookFilterState;
  onApplyFilters: (filters: CodebookFilterState) => void;
  onResetFilters: () => void;
  filterOptions: {
    showStatus?: boolean;
    showCity?: boolean;
    showCountry?: boolean;
    showCategory?: boolean;
    showInsurer?: boolean;
    showCreatedDates?: boolean;
  };
}

const AdvancedFilterDialog: React.FC<AdvancedFilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onResetFilters,
  filterOptions,
}) => {
  const { t } = useLanguage();
  const [localFilters, setLocalFilters] = React.useState<CodebookFilterState>(filters);

  // Reset local filters when dialog opens with current filters
  React.useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  const handleChange = (key: keyof CodebookFilterState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    onResetFilters();
    onOpenChange(false);
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.city && filters.city.trim() !== '') count++;
    if (filters.country && filters.country.trim() !== '') count++;
    if (filters.category && filters.category.trim() !== '') count++;
    if (filters.insurer && filters.insurer.trim() !== '') count++;
    if (filters.createdAfter) count++;
    if (filters.createdBefore) count++;
    return count;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {t("advancedFilters")}
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {filterOptions.showStatus && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                {t("status")}
              </Label>
              <Select 
                value={localFilters.status || 'all'} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatus")}</SelectItem>
                  <SelectItem value="active">{t("active")}</SelectItem>
                  <SelectItem value="inactive">{t("inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {filterOptions.showCity && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                {t("city")}
              </Label>
              <Input
                id="city"
                value={localFilters.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="col-span-3"
                placeholder={t("filterByCity")}
              />
            </div>
          )}

          {filterOptions.showCountry && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                {t("country")}
              </Label>
              <Input
                id="country"
                value={localFilters.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                className="col-span-3"
                placeholder={t("filterByCountry")}
              />
            </div>
          )}

          {filterOptions.showCategory && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                {t("category")}
              </Label>
              <Input
                id="category"
                value={localFilters.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="col-span-3"
                placeholder={t("filterByCategory")}
              />
            </div>
          )}

          {filterOptions.showInsurer && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="insurer" className="text-right">
                {t("insurer")}
              </Label>
              <Input
                id="insurer"
                value={localFilters.insurer || ''}
                onChange={(e) => handleChange('insurer', e.target.value)}
                className="col-span-3"
                placeholder={t("filterByInsurer")}
              />
            </div>
          )}

          {filterOptions.showCreatedDates && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createdAfter" className="text-right">
                  {t("createdAfter")}
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !localFilters.createdAfter && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.createdAfter ? (
                          format(localFilters.createdAfter, "PPP")
                        ) : (
                          <span>{t("pickDate")}</span>
                        )}
                        {localFilters.createdAfter && (
                          <X
                            className="ml-auto h-4 w-4 hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChange('createdAfter', null);
                            }}
                          />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={localFilters.createdAfter || undefined}
                        onSelect={(date) => handleChange('createdAfter', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createdBefore" className="text-right">
                  {t("createdBefore")}
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !localFilters.createdBefore && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.createdBefore ? (
                          format(localFilters.createdBefore, "PPP")
                        ) : (
                          <span>{t("pickDate")}</span>
                        )}
                        {localFilters.createdBefore && (
                          <X
                            className="ml-auto h-4 w-4 hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChange('createdBefore', null);
                            }}
                          />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={localFilters.createdBefore || undefined}
                        onSelect={(date) => handleChange('createdBefore', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            {t("resetFilters")}
          </Button>
          <Button onClick={handleApply}>
            {t("applyFilters")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFilterDialog;
