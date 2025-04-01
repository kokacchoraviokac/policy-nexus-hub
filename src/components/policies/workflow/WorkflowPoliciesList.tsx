
import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  AlertTriangle,
  FileSpreadsheet,
  Loader2,
  ClipboardCheck,
  ArrowRightCircle
} from "lucide-react";
import { Policy } from "@/types/policies";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface WorkflowPoliciesListProps {
  policies: Policy[];
  isLoading: boolean;
  isError?: boolean;
  onReviewPolicy: (policyId: string) => void;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  workflowStatus?: string;
  onPageChange?: (page: number) => void;
  onStatusChange?: (status: string) => void;
}

const WorkflowPoliciesList: React.FC<WorkflowPoliciesListProps> = ({ 
  policies, 
  isLoading, 
  isError = false,
  onReviewPolicy,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  workflowStatus = "all",
  onPageChange,
  onStatusChange,
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  
  const totalPages = Math.ceil(totalCount / pageSize);

  // Page numbering logic for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const getWorkflowStatusBadge = (status: string) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline">{t("draft")}</Badge>;
      case 'in_review':
        return <Badge variant="secondary">{t("inReview")}</Badge>;
      case 'ready':
        return <Badge variant="success">{t("ready")}</Badge>;
      case 'complete':
        return <Badge variant="default">{t("complete")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
        <p className="font-medium mb-2">{t("errorLoadingPolicies")}</p>
        <p className="text-muted-foreground mb-4">{t("unknownError")}</p>
        <Button onClick={() => window.location.reload()}>{t("retry")}</Button>
      </div>
    );
  }
  
  if (policies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="font-medium mb-2">{t("noPoliciesInWorkflow")}</p>
        <p className="text-muted-foreground mb-6 max-w-md">{t("noPoliciesInWorkflowDescription")}</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => window.location.href = "/policies/import"}>
            {t("importPolicies")}
          </Button>
          
          {workflowStatus !== "all" && onStatusChange && (
            <Button variant="outline" onClick={() => onStatusChange("all")}>
              {t("showAllWorkflowStatuses")}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.policy_number}</TableCell>
                <TableCell>{policy.policyholder_name}</TableCell>
                <TableCell>{policy.insurer_name}</TableCell>
                <TableCell>{formatDate(policy.start_date)}</TableCell>
                <TableCell>{formatDate(policy.expiry_date)}</TableCell>
                <TableCell>{formatCurrency(policy.premium, policy.currency)}</TableCell>
                <TableCell>{getWorkflowStatusBadge(policy.workflow_status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/policies/${policy.id}`}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">{t("view")}</span>
                    </Button>
                    
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onReviewPolicy(policy.id)}
                    >
                      {policy.workflow_status === 'draft' && (
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                      )}
                      {policy.workflow_status === 'in_review' && (
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                      )}
                      {policy.workflow_status === 'ready' && (
                        <ArrowRightCircle className="h-4 w-4 mr-2" />
                      )}
                      {policy.workflow_status === 'draft' && t("review")}
                      {policy.workflow_status === 'in_review' && t("review")}
                      {policy.workflow_status === 'ready' && t("finalizePolicy")}
                      {policy.workflow_status === 'complete' && t("view")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t("showing")} {Math.min((currentPage - 1) * pageSize + 1, totalCount)}-
            {Math.min(currentPage * pageSize, totalCount)} {t("of")} {totalCount} {t("policies")}
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {onStatusChange && (
        <div className="flex mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t("workflowStatus")}:</span>
            <Select 
              value={workflowStatus} 
              onValueChange={onStatusChange}
            >
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder={t("allWorkflowStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allWorkflowStatuses")}</SelectItem>
                <SelectItem value="draft">{t("draft")}</SelectItem>
                <SelectItem value="in_review">{t("inReview")}</SelectItem>
                <SelectItem value="ready">{t("ready")}</SelectItem>
                <SelectItem value="complete">{t("complete")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowPoliciesList;
