
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BankTransactionsFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const BankTransactionsFilters: React.FC<BankTransactionsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("searchTransactions")}
          className="pl-8"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      
      <Select
        value={statusFilter}
        onValueChange={onStatusFilterChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("filterByStatus")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allTransactions")}</SelectItem>
          <SelectItem value="unmatched">{t("unmatched")}</SelectItem>
          <SelectItem value="matched">{t("matched")}</SelectItem>
          <SelectItem value="ignored">{t("ignored")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BankTransactionsFilters;
