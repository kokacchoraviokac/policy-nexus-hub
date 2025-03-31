
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

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

const PayoutPreviewTable = ({ items, isLoading }: PayoutPreviewTableProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/30">
        <p className="text-muted-foreground">{t("noPayoutItemsFound")}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("policyNumber")}</TableHead>
            <TableHead>{t("policyholder")}</TableHead>
            <TableHead className="text-right">{t("amount")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.policy_number}</TableCell>
              <TableCell>{item.policyholder_name}</TableCell>
              <TableCell className="text-right">{item.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayoutPreviewTable;
