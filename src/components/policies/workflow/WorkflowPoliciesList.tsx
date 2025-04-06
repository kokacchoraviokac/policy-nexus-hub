import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
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
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { formatDateToLocal } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatters";
import { Loader2, Search, Filter, CheckCircle, AlertCircle, Clock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkflowPoliciesListProps {
  policies: Policy[];
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

const WorkflowPoliciesList: React.FC<WorkflowPoliciesListProps> = ({
  policies,
  isLoading,
  error,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);
  
  const canReviewPolicies = hasRole(["admin", "superAdmin", "super_admin"]);
  
  // Filter policies based on search term and status
  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      searchTerm === "" ||
      policy.policy_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policyholder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (policy.client_name && policy.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus =
      statusFilter === "all" || policy.workflow_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Paginate the filtered policies
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPolicies = filteredPolicies.slice(indexOfFirstItem, indexOfLastItem);
  
  const handleViewPolicy = (policyId: string) => {
    navigate(`/policies/review/${policyId}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case WorkflowStatus.DRAFT:
        return (
          <Badge variant="outline" className="bg-slate-100">
            <Clock className="h-3 w-3 mr-1" />
            {t("draft")}
          </Badge>
        );
      case WorkflowStatus.REVIEW:
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            {t("review")}
          </Badge>
        );
      case WorkflowStatus.READY:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t("ready")}
          </Badge>
        );
      case WorkflowStatus.COMPLETE:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t("complete")}
          </Badge>
        );
      case WorkflowStatus.REJECTED:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
            <X className="h-3 w-3 mr-1" />
            {t("rejected")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  if (error) {
    return (
      <div className="rounded-md border p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <h3 className="text-lg font-medium">{t("errorLoadingPolicies")}</h3>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        <Button onClick={onRefresh} variant="outline" className="mt-4">
          {t("tryAgain")}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPolicies")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="w-full sm:w-[180px]">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              <SelectItem value={WorkflowStatus.DRAFT}>{t("draft")}</SelectItem>
              <SelectItem value={WorkflowStatus.REVIEW}>{t("review")}</SelectItem>
              <SelectItem value={WorkflowStatus.READY}>{t("ready")}</SelectItem>
              <SelectItem value={WorkflowStatus.COMPLETE}>{t("complete")}</SelectItem>
              <SelectItem value={WorkflowStatus.REJECTED}>{t("rejected")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPolicies.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <h3 className="text-lg font-medium">{t("noPoliciesFound")}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm || statusFilter !== "all"
              ? t("tryAdjustingFilters")
              : t("noPoliciesInWorkflow")}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("policyNumber")}</TableHead>
                  <TableHead>{t("policyholder")}</TableHead>
                  <TableHead>{t("insurer")}</TableHead>
                  <TableHead>{t("startDate")}</TableHead>
                  <TableHead>{t("premium")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">
                      {policy.policy_number}
                    </TableCell>
                    <TableCell>
                      {policy.policyholder_name}
                      {policy.client_name && policy.client_name !== policy.policyholder_name && (
                        <div className="text-xs text-muted-foreground">
                          {policy.client_name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{policy.insurer_name}</TableCell>
                    <TableCell>{formatDateToLocal(policy.start_date)}</TableCell>
                    <TableCell>
                      {formatCurrency(policy.premium, policy.currency)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(policy.workflow_status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPolicy(policy.id)}
                        disabled={!canReviewPolicies && policy.workflow_status !== WorkflowStatus.DRAFT}
                      >
                        {policy.workflow_status === WorkflowStatus.REVIEW
                          ? t("review")
                          : t("view")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Pagination
            itemsCount={filteredPolicies.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          >
            <div className="text-sm text-muted-foreground">
              {t("showing")} {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredPolicies.length)} {t("of")}{" "}
              {filteredPolicies.length} {t("policies")}
            </div>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default WorkflowPoliciesList;
