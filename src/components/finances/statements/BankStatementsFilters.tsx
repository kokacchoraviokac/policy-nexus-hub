
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, X } from "lucide-react";

interface BankStatementsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  bankFilter: string;
  onBankChange: (value: string) => void;
  dateFrom: Date | null;
  onDateFromChange: (date: Date | null) => void;
  dateTo: Date | null;
  onDateToChange: (date: Date | null) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const BankStatementsFilters: React.FC<BankStatementsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  bankFilter,
  onBankChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters,
  isLoading = false
}) => {
  const { t } = useLanguage();
  
  // Mock bank options for now - in a real app, fetch from the database
  const bankOptions = [
    { label: t("allBanks"), value: "all" }, // Changed empty string to "all"
    { label: "UniCredit", value: "UniCredit" },
    { label: "Raiffeisen", value: "Raiffeisen" },
    { label: "Komercijalna", value: "Komercijalna" }
  ];
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("search")}</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("status")}</label>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="in_progress">{t("in_progress")}</SelectItem>
                <SelectItem value="processed">{t("processed")}</SelectItem>
                <SelectItem value="confirmed">{t("confirmed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("bank")}</label>
            <Select value={bankFilter} onValueChange={onBankChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectBank")} />
              </SelectTrigger>
              <SelectContent>
                {bankOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("dateFrom")}</label>
            <DatePicker 
              date={dateFrom} 
              setDate={onDateFromChange}
              placeholder={t("fromDate")}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("dateTo")}</label>
            <DatePicker 
              date={dateTo} 
              setDate={onDateToChange}
              placeholder={t("toDate")}
            />
          </div>
          
          <div className="flex items-end col-span-1 md:col-span-5 justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              size="sm"
            >
              <X className="mr-2 h-4 w-4" />
              {t("clearFilters")}
            </Button>
            
            {isLoading && (
              <Button disabled size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loading")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankStatementsFilters;
