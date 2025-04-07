import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationController } from "@/components/ui/pagination-controller";
import { Button } from "@/components/ui/button";
import { Loader2, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Commission, CommissionStatus } from "@/types/finances";

interface CommissionsTableProps {
  commissions: Commission[];
  isLoading: boolean;
  onCommissionClick: (commission: Commission) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const CommissionsTable: React.FC<CommissionsTableProps> = ({
  commissions,
  isLoading,
  onCommissionClick,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useLanguage();

  // Status badge rendering
  const getStatusBadge = (status: CommissionStatus) => {
    switch (status) {
      case CommissionStatus.PAID:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case CommissionStatus.PENDING:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case CommissionStatus.INVOICED:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Invoiced</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("policyNumber")}</TableHead>
                <TableHead>{t("baseAmount")}</TableHead>
                <TableHead>{t("rate")}</TableHead>
                <TableHead>{t("calculatedAmount")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("createdDate")}</TableHead>
                <TableHead>{t("paymentDate")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Info className="h-10 w-10 mb-2" />
                      <p>{t("noCommissionsFound")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                commissions.map((commission) => (
                  <TableRow
                    key={commission.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onCommissionClick(commission)}
                  >
                    <TableCell className="font-medium">{commission.policy_number}</TableCell>
                    <TableCell>{formatCurrency(commission.base_amount)}</TableCell>
                    <TableCell>{commission.rate}%</TableCell>
                    <TableCell>{formatCurrency(commission.calculated_amount)}</TableCell>
                    <TableCell>{getStatusBadge(commission.status)}</TableCell>
                    <TableCell>{formatDate(commission.created_at)}</TableCell>
                    <TableCell>{commission.payment_date ? formatDate(commission.payment_date) : '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        {t("view")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t">
          <PaginationController
            currentPage={currentPage}
            totalPages={totalPages} 
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            itemsCount={commissions.length}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionsTable;
