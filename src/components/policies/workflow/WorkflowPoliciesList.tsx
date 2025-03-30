
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Policy } from "@/types/policies";
import { Loader2, FileEdit, Eye, Clock, CheckCircle2, FileSpreadsheet } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";

interface WorkflowPoliciesListProps {
  policies: Policy[];
  isLoading: boolean;
  onReviewPolicy: (policyId: string) => void;
}

const WorkflowPoliciesList: React.FC<WorkflowPoliciesListProps> = ({
  policies,
  isLoading,
  onReviewPolicy,
}) => {
  const { t, formatDate } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!policies.length) {
    return (
      <EmptyState
        title={t("noPoliciesFound")}
        description={t("noPoliciesInWorkflowDescription")}
        icon="file-search"
      />
    );
  }

  const getWorkflowStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileSpreadsheet className="h-4 w-4 text-blue-500" />;
      case 'in_review':
        return <FileEdit className="h-4 w-4 text-orange-500" />;
      case 'ready':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getWorkflowStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status) {
      case 'draft':
        variant = "outline";
        break;
      case 'in_review':
        variant = "secondary";
        break;
      case 'ready':
        variant = "default";
        break;
      case 'complete':
        variant = "default";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getWorkflowStatusIcon(status)}
        <span>{t(status.replace('_', ''))}</span>
      </Badge>
    );
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("policyNumber")}</TableHead>
            <TableHead>{t("policyholder")}</TableHead>
            <TableHead>{t("insurer")}</TableHead>
            <TableHead>{t("workflowStatus")}</TableHead>
            <TableHead>{t("lastUpdated")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell className="font-medium">{policy.policy_number}</TableCell>
              <TableCell>{policy.policyholder_name}</TableCell>
              <TableCell>{policy.insurer_name}</TableCell>
              <TableCell>{getWorkflowStatusBadge(policy.workflow_status)}</TableCell>
              <TableCell>{formatDate(policy.updated_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant={policy.workflow_status === 'complete' ? 'outline' : 'default'}
                    onClick={() => onReviewPolicy(policy.id)}
                  >
                    {policy.workflow_status === 'complete' ? (
                      <>
                        <Eye className="mr-1 h-4 w-4" />
                        {t("view")}
                      </>
                    ) : (
                      <>
                        <FileEdit className="mr-1 h-4 w-4" />
                        {t("review")}
                      </>
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkflowPoliciesList;
