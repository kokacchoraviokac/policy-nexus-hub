
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
}) => {
  const { t } = useLanguage();
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Input
              placeholder={t("searchByAccountOrBank")}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="in_progress">{t("in_progress")}</SelectItem>
                <SelectItem value="processed">{t("processed")}</SelectItem>
                <SelectItem value="confirmed">{t("confirmed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={bankFilter} onValueChange={onBankChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("bank")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="UNICREDIT">UniCredit</SelectItem>
                <SelectItem value="KOMBANK">Komercijalna Banka</SelectItem>
                <SelectItem value="RAIFFEISEN">Raiffeisen Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? (
                    format(dateFrom, "PPP")
                  ) : (
                    <span>{t("from")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={onDateFromChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? (
                    format(dateTo, "PPP")
                  ) : (
                    <span>{t("to")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={onDateToChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            {t("clearFilters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankStatementsFilters;
