
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy, WorkflowStatus } from "@/types/policies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Edit,
  Loader2,
  Search,
  AlertTriangle,
  Filter,
  ChevronRight,
  ClipboardList,
  FileCheck,
  Calendar,
  Building,
  FileArchive,
  Users,
  MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { mapPolicyStatusToBadgeVariant } from "@/utils/policies/policyMappers";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

interface WorkflowPoliciesListProps {
  policies: Policy[];
  isLoading: boolean;
  onReviewPolicy?: (policyId: string) => void;
  error?: Error | null;
  isError?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  workflowStatus?: string;
  onStatusChange?: (status: string) => void;
}

const WorkflowPoliciesList: React.FC<WorkflowPoliciesListProps> = ({
  policies,
  isLoading,
  onReviewPolicy,
  error,
  isError,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  workflowStatus,
  onStatusChange
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>(policies);
  
  // Status options
  const statusOptions = [
    { id: "all", label: t("allStatuses"), value: "all" },
    { id: "draft", label: t("draft"), value: WorkflowStatus.DRAFT },
    { id: "in_review", label: t("inReview"), value: WorkflowStatus.IN_REVIEW },
    { id: "ready", label: t("ready"), value: WorkflowStatus.READY },
    { id: "complete", label: t("complete"), value: WorkflowStatus.COMPLETE },
    { id: "review", label: t("review"), value: WorkflowStatus.REVIEW },
    { id: "rejected", label: t("rejected"), value: WorkflowStatus.REJECTED },
  ];
  
  // Filter policies based on search query
  React.useEffect(() => {
    if (!searchQuery) {
      setFilteredPolicies(policies);
      return;
    }
    
    const results = policies.filter((policy) => {
      const searchableFields = [
        policy.policy_number,
        policy.policyholder_name,
        policy.insurer_name,
        policy.client_name || policy.policyholder_name,
      ];
      
      return searchableFields.some((field) =>
        field?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    
    setFilteredPolicies(results);
  }, [policies, searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic is applied in useEffect
  };
  
  const renderWorkflowStatusBadge = (status?: string) => {
    const statusMap: Record<string, { label: string; variant: string }> = {
      [WorkflowStatus.DRAFT]: { label: t("draft"), variant: "secondary" },
      [WorkflowStatus.IN_REVIEW]: { label: t("inReview"), variant: "warning" },
      [WorkflowStatus.READY]: { label: t("ready"), variant: "info" },
      [WorkflowStatus.COMPLETE]: { label: t("complete"), variant: "success" },
      [WorkflowStatus.REVIEW]: { label: t("review"), variant: "warning" },
      [WorkflowStatus.REJECTED]: { label: t("rejected"), variant: "destructive" },
    };
    
    const { label, variant } = statusMap[status || ""] || { label: status || t("unknown"), variant: "default" };
    
    return <Badge variant={variant as any}>{label}</Badge>;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h3 className="text-lg font-medium">{t("errorLoadingPolicies")}</h3>
        <p className="text-sm text-muted-foreground">{error?.message || t("unknownError")}</p>
      </div>
    );
  }
  
  if (filteredPolicies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <FileArchive className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">{t("noPoliciesFound")}</h3>
        <p className="text-sm text-muted-foreground">{t("tryAdjustingYourSearch")}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPolicies")}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">{t("search")}</span>
          </Button>
        </form>
        
        {onStatusChange && (
          <Select
            value={workflowStatus || "all"}
            onValueChange={onStatusChange}
          >
            <SelectTrigger className="w-auto">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("policyNumber")}</TableHead>
                <TableHead>{t("client")}</TableHead>
                <TableHead>{t("insurer")}</TableHead>
                <TableHead>{t("startDate")}</TableHead>
                <TableHead>{t("expiryDate")}</TableHead>
                <TableHead>{t("premium")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.policy_number}</TableCell>
                  <TableCell>
                    {policy.client_name || policy.policyholder_name}
                  </TableCell>
                  <TableCell>{policy.insurer_name}</TableCell>
                  <TableCell>{formatDate(policy.start_date)}</TableCell>
                  <TableCell>{formatDate(policy.expiry_date)}</TableCell>
                  <TableCell>
                    {formatCurrency(policy.premium, policy.currency || "EUR")}
                  </TableCell>
                  <TableCell>
                    {renderWorkflowStatusBadge(policy.workflow_status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReviewPolicy && onReviewPolicy(policy.id)}
                    >
                      <Edit className="h-4 w-4 mr-1.5" />
                      {t("review")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {totalCount > pageSize && onPageChange && (
        <div className="mt-4">
          <Pagination
            totalPages={Math.ceil(totalCount / pageSize)}
            currentPage={currentPage}
            onPageChange={onPageChange}
            itemsCount={totalCount}
            itemsPerPage={pageSize}
          >
            <div className="text-sm text-muted-foreground">
              {t("showing")} {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} {t("of")} {totalCount} {t("policies")}
            </div>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default WorkflowPoliciesList;
