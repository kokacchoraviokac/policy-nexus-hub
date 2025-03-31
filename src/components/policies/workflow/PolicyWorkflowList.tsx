
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit,
  CheckCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Policy } from "@/types/policies";
import { useNavigate } from "react-router-dom";
import WorkflowStatusBadge from "./WorkflowStatusBadge";

interface PolicyWorkflowListProps {
  policies: Policy[];
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
  onPageSizeChange,
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const navigate = useNavigate();
  
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const handleRowClick = (policyId: string) => {
    navigate(`/policies/workflow/${policyId}`);
  };
  
  const handleReviewClick = (e: React.MouseEvent, policyId: string) => {
    e.stopPropagation();
    navigate(`/policies/workflow/${policyId}/review`);
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!isLoading && policies.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("policyNumber")}</TableHead>
              <TableHead>{t("insurer")}</TableHead>
              <TableHead>{t("policyholder")}</TableHead>
              <TableHead>{t("startDate")}</TableHead>
              <TableHead>{t("expiryDate")}</TableHead>
              <TableHead className="text-right">{t("premium")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow 
                key={policy.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(policy.id)}
              >
                <TableCell className="font-medium">{policy.policy_number}</TableCell>
                <TableCell>{policy.insurer_name}</TableCell>
                <TableCell>{policy.policyholder_name}</TableCell>
                <TableCell>{formatDate(policy.start_date)}</TableCell>
                <TableCell>{formatDate(policy.expiry_date)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(policy.premium, policy.currency)}
                </TableCell>
                <TableCell>
                  <WorkflowStatusBadge status={policy.workflow_status} />
                </TableCell>
                <TableCell className="text-right">
                  {policy.workflow_status === "draft" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleReviewClick(e, policy.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {t("review")}
                    </Button>
                  )}
                  {policy.workflow_status === "review" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleReviewClick(e, policy.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {t("approve")}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            {t("showing")} <span className="font-medium">{policies.length}</span> {t("of")}{" "}
            <span className="font-medium">{totalCount}</span> {t("policies")}
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">{t("rowsPerPage")}</p>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 text-sm">
                <span className="font-medium">{page}</span>
                <span className="text-muted-foreground">/ {totalPages || 1}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="space-y-3">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
    </div>
  );
};

const EmptyState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="py-12 text-center">
      <p className="text-muted-foreground">{t("noPoliciesFound")}</p>
    </div>
  );
};

export default PolicyWorkflowList;
