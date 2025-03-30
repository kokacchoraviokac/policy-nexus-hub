
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, RefreshCw, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface BankStatementsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  bankFilter: string;
  onBankFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  onRefresh: () => void;
}

const BankStatementsFilters: React.FC<BankStatementsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  bankFilter,
  onBankFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  onRefresh
}) => {
  const { t } = useLanguage();
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const banks = [
    { value: "all", label: t("allBanks") },
    { value: "unicredit", label: "UniCredit" },
    { value: "kombank", label: "Komercijalna Banka" },
    { value: "intesa", label: "Banca Intesa" }
  ];

  const statuses = [
    { value: "all", label: t("allStatuses") },
    { value: "in_progress", label: t("inProgress") },
    { value: "processed", label: t("processed") },
    { value: "confirmed", label: t("confirmed") }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleClearDateRange = () => {
    onDateRangeChange({ from: null, to: null });
    setDatePickerOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchStatements")}
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          title={t("refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Select
          value={bankFilter}
          onValueChange={onBankFilterChange}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder={t("filterByBank")} />
          </SelectTrigger>
          <SelectContent>
            {banks.map(bank => (
              <SelectItem key={bank.value} value={bank.value}>
                {bank.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={statusFilter}
          onValueChange={onStatusFilterChange}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder={t("filterByStatus")} />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-auto justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                t("selectDateRange")
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: dateRange.from || undefined,
                to: dateRange.to || undefined,
              }}
              onSelect={(range) => {
                onDateRangeChange({
                  from: range?.from || null,
                  to: range?.to || null,
                });
              }}
              initialFocus
            />
            <div className="flex items-center justify-between p-3 border-t">
              <Button variant="ghost" size="sm" onClick={handleClearDateRange}>
                <X className="w-4 h-4 mr-2" />
                {t("clearDates")}
              </Button>
              <Button size="sm" onClick={() => setDatePickerOpen(false)}>
                {t("apply")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BankStatementsFilters;
