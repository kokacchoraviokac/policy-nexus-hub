import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FilterOptions } from "@/hooks/unlinked-payments/useUnlinkedPaymentsFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, RefreshCw, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { RefetchOptions } from "@tanstack/react-query";

export interface UnlinkedPaymentsFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onRefresh: (options?: RefetchOptions) => Promise<any>;
  isLoading: boolean;
}

const UnlinkedPaymentsFilters: React.FC<UnlinkedPaymentsFiltersProps> = ({ 
  filters, 
  onFilterChange,
  onRefresh,
  isLoading
}) => {
  const { t } = useLanguage();
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    if (filters.dateFrom) {
      setDate(filters.dateFrom);
    }
  }, [filters.dateFrom]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value === "all" ? undefined : value });
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    onFilterChange({ ...filters, dateFrom: date || null });
  };

  const handleClearFilters = () => {
    onFilterChange({});
    setDate(undefined);
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4 items-end">
      <div>
        <Label htmlFor="searchTerm">{t("search")}</Label>
        <Input
          id="searchTerm"
          placeholder={t("searchPlaceholder")}
          value={filters.searchTerm || ""}
          onChange={handleSearchChange}
        />
      </div>
      
      <div>
        <Label htmlFor="status">{t("status")}</Label>
        <Select onValueChange={handleStatusChange} defaultValue={filters.status || "all"}>
          <SelectTrigger id="status">
            <SelectValue placeholder={t("select")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="unlinked">{t("unlinked")}</SelectItem>
            <SelectItem value="linked">{t("linked")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>{t("paymentDate")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>{t("pickDate")}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="rounded-md border shadow-sm"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handleClearFilters}
        >
          <X className="h-4 w-4" />
          {t("clearFilters")}
        </Button>
        <Button
          type="button"
          size="sm"
          className="gap-1"
          onClick={() => onRefresh()}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4" />
          {t("refresh")}
        </Button>
      </div>
    </div>
  );
};

export default UnlinkedPaymentsFilters;
