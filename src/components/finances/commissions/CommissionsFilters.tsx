
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { Search, CalendarIcon, Filter, X } from "lucide-react";
import { CommissionFilterOptions } from "@/hooks/useCommissions";

interface CommissionsFiltersProps {
  filters: CommissionFilterOptions;
  onFilterChange: (filters: CommissionFilterOptions) => void;
  showFilterButton?: boolean;
}

const CommissionsFilters: React.FC<CommissionsFiltersProps> = ({
  filters,
  onFilterChange,
  showFilterButton = true,
}) => {
  const { t } = useLanguage();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<CommissionFilterOptions>(filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value });
  };

  const handleTempFilterChange = (key: keyof CommissionFilterOptions, value: any) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFilterChange(tempFilters);
    setIsSheetOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      searchTerm: "",
      startDate: null,
      endDate: null,
      status: "all",
      insurerId: undefined,
      agentId: undefined
    };
    setTempFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.insurerId) count++;
    if (filters.agentId) count++;
    if (filters.status && filters.status !== "all") count++;
    return count;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
      <div className="relative w-full sm:w-96 flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchCommissions")}
          value={filters.searchTerm || ""}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCommissions")}</SelectItem>
            <SelectItem value="due">{t("dueCommissions")}</SelectItem>
            <SelectItem value="paid">{t("paidCommissions")}</SelectItem>
            <SelectItem value="calculating">{t("calculatingCommissions")}</SelectItem>
          </SelectContent>
        </Select>

        {showFilterButton && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                title={t("advancedFilters")}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{t("filters")}</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>{t("advancedFilters")}</SheetTitle>
                <SheetDescription>
                  {t("adjustFiltersForCommissions")}
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">{t("dateRange")}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        {t("startDate")}
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {tempFilters.startDate ? (
                              format(tempFilters.startDate, "PP")
                            ) : (
                              <span>{t("select")}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={tempFilters.startDate || undefined}
                            onSelect={(date) => handleTempFilterChange("startDate", date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        {t("endDate")}
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {tempFilters.endDate ? (
                              format(tempFilters.endDate, "PP")
                            ) : (
                              <span>{t("select")}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={tempFilters.endDate || undefined}
                            onSelect={(date) => handleTempFilterChange("endDate", date)}
                            disabled={(date) =>
                              tempFilters.startDate
                                ? date < tempFilters.startDate
                                : false
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Additional filters for Insurer and Agent would go here */}
                {/* These would require additional data fetching from the insurers and agents tables */}
              </div>
              <SheetFooter className="flex gap-2 sm:justify-between">
                <SheetClose asChild>
                  <Button variant="outline" onClick={clearFilters} className="flex-1">
                    <X className="mr-2 h-4 w-4" />
                    {t("clearFilters")}
                  </Button>
                </SheetClose>
                <Button onClick={applyFilters} className="flex-1">
                  {t("applyFilters")}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default CommissionsFilters;
