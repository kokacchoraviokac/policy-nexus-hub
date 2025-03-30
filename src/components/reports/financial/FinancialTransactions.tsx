
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import FinancialReportTable from "./FinancialReportTable";
import { FinancialTransaction } from "@/utils/reports/financialReportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FinancialTransactionsProps {
  data: FinancialTransaction[];
  isLoading: boolean;
  onExport: () => void;
  isExporting: boolean;
}

const FinancialTransactions: React.FC<FinancialTransactionsProps> = ({
  data,
  isLoading,
  onExport,
  isExporting,
}) => {
  const { t } = useLanguage();
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "date",
    "description",
    "type",
    "category",
    "reference",
    "status",
    "amount",
  ]);

  const toggleColumn = (column: string) => {
    setVisibleColumns((current) =>
      current.includes(column)
        ? current.filter((c) => c !== column)
        : [...current, column]
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("transactionHistory")}</CardTitle>
          <CardDescription>
            {t("viewAllFinancialTransactions")}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t("columns")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("date")}
                onCheckedChange={() => toggleColumn("date")}
              >
                {t("date")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("description")}
                onCheckedChange={() => toggleColumn("description")}
              >
                {t("description")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("type")}
                onCheckedChange={() => toggleColumn("type")}
              >
                {t("type")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("category")}
                onCheckedChange={() => toggleColumn("category")}
              >
                {t("category")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("reference")}
                onCheckedChange={() => toggleColumn("reference")}
              >
                {t("reference")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("status")}
                onCheckedChange={() => toggleColumn("status")}
              >
                {t("status")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.includes("amount")}
                onCheckedChange={() => toggleColumn("amount")}
              >
                {t("amount")}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={isExporting || data.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? t("exporting") : t("exportTransactions")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <FinancialReportTable
          data={data}
          isLoading={isLoading}
          visibleColumns={visibleColumns}
        />
      </CardContent>
    </Card>
  );
};

export default FinancialTransactions;
