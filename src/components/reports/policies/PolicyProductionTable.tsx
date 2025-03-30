
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PolicyReportData } from "@/utils/policies/policyReportUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";

interface PolicyProductionTableProps {
  data: PolicyReportData[];
  isLoading: boolean;
}

const PolicyProductionTable: React.FC<PolicyProductionTableProps> = ({ data, isLoading }) => {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status.toLowerCase()) {
      case 'active':
        variant = "default";
        break;
      case 'expired':
        variant = "destructive";
        break;
      case 'pending':
        variant = "secondary";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <p className="text-muted-foreground">{t("noDataFound")}</p>
        <p className="text-sm text-muted-foreground">{t("tryAdjustingYourFilters")}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("policyNumber")}</TableHead>
            <TableHead>{t("client")}</TableHead>
            <TableHead>{t("insurer")}</TableHead>
            <TableHead>{t("product")}</TableHead>
            <TableHead>{t("startDate")}</TableHead>
            <TableHead>{t("expiryDate")}</TableHead>
            <TableHead>{t("premium")}</TableHead>
            <TableHead>{t("commission")}</TableHead>
            <TableHead>{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell className="font-medium">{policy.policy_number}</TableCell>
              <TableCell>{policy.policyholder_name}</TableCell>
              <TableCell>{policy.insurer_name}</TableCell>
              <TableCell>{policy.product_name}</TableCell>
              <TableCell>{formatDate(new Date(policy.start_date))}</TableCell>
              <TableCell>{formatDate(new Date(policy.expiry_date))}</TableCell>
              <TableCell>{formatCurrency(policy.premium, policy.currency)}</TableCell>
              <TableCell>
                {policy.commission_percentage && (
                  <span>{policy.commission_percentage}%</span>
                )}
                {policy.commission_amount && (
                  <span className="block text-xs text-muted-foreground">
                    {formatCurrency(policy.commission_amount, policy.currency)}
                  </span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(policy.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PolicyProductionTable;
