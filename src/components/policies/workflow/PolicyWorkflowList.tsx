
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationController } from "@/components/ui/pagination-controller";
import { Button } from "@/components/ui/button";
import { FileEdit, Loader2, Info } from "lucide-react";
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
import { Policy, PolicyWorkflowStatus } from "@/types/policies";

// Helper function to get status badge by workflow status
const getStatusBadge = (status: PolicyWorkflowStatus) => {
  switch (status) {
    case PolicyWorkflowStatus.PENDING:
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
    case PolicyWorkflowStatus.PROCESSING:
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
    case PolicyWorkflowStatus.FINALIZED:
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Finalized</Badge>;
    case PolicyWorkflowStatus.NEEDS_REVIEW:
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Needs Review</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

interface PolicyWorkflowListProps {
  policies: Policy[];
  isLoading: boolean;
  onEditPolicy: (policy: Policy) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions: number[];
}

const PolicyWorkflowList: React.FC<PolicyWorkflowListProps> = ({
  policies,
  isLoading,
  onEditPolicy,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
}) => {
  const { t } = useLanguage();

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
                <TableHead>{t("policyType")}</TableHead>
                <TableHead>{t("insurer")}</TableHead>
                <TableHead>{t("client")}</TableHead>
                <TableHead>{t("premium")}</TableHead>
                <TableHead>{t("startDate")}</TableHead>
                <TableHead>{t("expiryDate")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Info className="h-10 w-10 mb-2" />
                      <p>{t("noPoliciesFound")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                policies.map((policy) => (
                  <TableRow
                    key={policy.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{policy.policy_number}</TableCell>
                    <TableCell>{policy.policy_type}</TableCell>
                    <TableCell>{policy.insurer_name}</TableCell>
                    <TableCell>{policy.policyholder_name}</TableCell>
                    <TableCell>{formatCurrency(policy.premium, policy.currency)}</TableCell>
                    <TableCell>{formatDate(policy.start_date)}</TableCell>
                    <TableCell>{formatDate(policy.expiry_date)}</TableCell>
                    <TableCell>{getStatusBadge(policy.workflow_status as PolicyWorkflowStatus)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => onEditPolicy(policy)}>
                        <FileEdit className="h-4 w-4 mr-2" />
                        {t("edit")}
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
            itemsCount={policies.length}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyWorkflowList;
