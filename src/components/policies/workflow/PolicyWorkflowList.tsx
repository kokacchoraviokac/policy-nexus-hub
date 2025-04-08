
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WorkflowPolicy } from "@/hooks/useWorkflowPolicies";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import WorkflowStatusBadge from "./WorkflowStatusBadge";
import { formatCurrency, formatDate } from "@/utils/format";
import PaginationController from "@/components/ui/pagination-controller";

interface PolicyWorkflowListProps {
  policies: WorkflowPolicy[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PolicyWorkflowList: React.FC<PolicyWorkflowListProps> = ({
  policies,
  isLoading,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const { t } = useLanguage();
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return (
      <div className="py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="py-8 text-center">
        <h3 className="font-medium text-lg">{t("noPoliciesFound")}</h3>
        <p className="text-muted-foreground">{t("tryAdjustingYourFilters")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
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
              <TableHead>{t("status")}</TableHead>
              <TableHead className="w-[100px]">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.policyNumber}</TableCell>
                <TableCell>{policy.client}</TableCell>
                <TableCell>{policy.insurer}</TableCell>
                <TableCell>{policy.product}</TableCell>
                <TableCell>{formatDate(policy.startDate)}</TableCell>
                <TableCell>{formatDate(policy.endDate)}</TableCell>
                <TableCell>{formatCurrency(policy.premium, policy.currency)}</TableCell>
                <TableCell>
                  <WorkflowStatusBadge status={policy.status} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      // We would typically navigate to the review page here
                      window.location.href = `/policies/workflow/review/${policy.id}`;
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">{t("review")}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalCount > 0 && (
        <PaginationController
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      )}
    </div>
  );
};

export default PolicyWorkflowList;
