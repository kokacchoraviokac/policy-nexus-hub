
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { WorkflowPolicy } from "@/hooks/useWorkflowPolicies";
import WorkflowStatusBadge from "./WorkflowStatusBadge";

interface WorkflowPoliciesListProps {
  policies: WorkflowPolicy[];
  isLoading: boolean;
  onReviewPolicy: (policyId: string) => void;
}

const WorkflowPoliciesList: React.FC<WorkflowPoliciesListProps> = ({
  policies,
  isLoading,
  onReviewPolicy,
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-2">{t("noPoliciesFound")}</p>
        <p className="text-sm text-muted-foreground">{t("tryDifferentFilters")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("policyNumber")}</TableHead>
            <TableHead>{t("insurer")}</TableHead>
            <TableHead>{t("client")}</TableHead>
            <TableHead>{t("product")}</TableHead>
            <TableHead>{t("startDate")}</TableHead>
            <TableHead>{t("endDate")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("premium")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell className="font-medium">{policy.policyNumber}</TableCell>
              <TableCell>{policy.insurer}</TableCell>
              <TableCell>{policy.client}</TableCell>
              <TableCell>{policy.product}</TableCell>
              <TableCell>{format(policy.startDate, "PP")}</TableCell>
              <TableCell>{format(policy.endDate, "PP")}</TableCell>
              <TableCell>
                <WorkflowStatusBadge status={policy.status} />
              </TableCell>
              <TableCell>
                {policy.premium.toLocaleString()} {policy.currency}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReviewPolicy(policy.id)}
                >
                  {policy.status === "draft" || policy.status === "review"
                    ? t("review")
                    : t("view")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkflowPoliciesList;
