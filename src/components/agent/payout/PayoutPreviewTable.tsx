
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";

interface PayoutItem {
  policy_id: string;
  policy_number: string;
  policyholder_name: string;
  amount: number;
}

interface PayoutPreviewTableProps {
  items: PayoutItem[];
  isLoading: boolean;
}

const PayoutPreviewTable: React.FC<PayoutPreviewTableProps> = ({
  items,
  isLoading,
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("noPayoutItemsFound")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("policyNumber")}</TableHead>
            <TableHead>{t("policyholder")}</TableHead>
            <TableHead className="text-right">{t("amount")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.policy_id}>
              <TableCell>{item.policy_number}</TableCell>
              <TableCell>{item.policyholder_name}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(item.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayoutPreviewTable;
