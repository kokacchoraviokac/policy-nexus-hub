
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { WorkflowPolicy } from "@/utils/policies/policyMappers";
import { FileSearch, AlertCircle } from "lucide-react";

interface WorkflowPoliciesListProps {
  policies: WorkflowPolicy[];
  isLoading: boolean;
  onReviewPolicy: (id: string) => void;
}

const WorkflowPoliciesList: React.FC<WorkflowPoliciesListProps> = ({
  policies,
  isLoading,
  onReviewPolicy,
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t("noPoliciesInWorkflowDescription")}
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">{t("draft")}</Badge>;
      case "in_review":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">{t("inReview")}</Badge>;
      case "ready":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">{t("ready")}</Badge>;
      case "complete":
        return <Badge variant="outline" className="bg-green-50 text-green-700">{t("complete")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("policyNumber")}</TableHead>
            <TableHead>{t("policyholder")}</TableHead>
            <TableHead>{t("insurer")}</TableHead>
            <TableHead>{t("startDate")}</TableHead>
            <TableHead>{t("expiryDate")}</TableHead>
            <TableHead>{t("premium")}</TableHead>
            <TableHead>{t("workflowStatus")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell className="font-medium">{policy.policyNumber}</TableCell>
              <TableCell>{policy.policyholderName}</TableCell>
              <TableCell>{policy.insurerName}</TableCell>
              <TableCell>{formatDate(policy.startDate)}</TableCell>
              <TableCell>{formatDate(policy.expiryDate)}</TableCell>
              <TableCell>{formatCurrency(policy.premium, policy.currency)}</TableCell>
              <TableCell>{getStatusBadge(policy.workflowStatus)}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onReviewPolicy(policy.id)}
                >
                  <FileSearch className="mr-1 h-4 w-4" />
                  {t("review")}
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
