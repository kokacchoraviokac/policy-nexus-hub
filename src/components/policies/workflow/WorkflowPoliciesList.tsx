
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import DataTable, { Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/utils/format";
import { CheckCircle, Clock, FileInput, Edit, Eye, RefreshCw } from "lucide-react";
import { Policy } from "@/types/policies";

interface WorkflowPoliciesListProps {
  statusFilter?: string;
  searchTerm?: string;
}

const WorkflowPoliciesList: React.FC<WorkflowPoliciesListProps> = ({
  statusFilter = "all",
  searchTerm = "",
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['policies-workflow', statusFilter, searchTerm, currentPage, pageSize],
    queryFn: async () => {
      // Calculate pagination parameters
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Start building the query - only get policies that require review/action
      let query = supabase
        .from('policies')
        .select('id, policy_number, insurer_name, product_name, policyholder_name, start_date, expiry_date, premium, currency, status, workflow_status', 
          { count: 'exact' });
      
      // Always filter policies that are in the workflow process (not completed)
      if (statusFilter === 'all') {
        query = query.not('workflow_status', 'eq', 'complete');
      } else {
        query = query.eq('workflow_status', statusFilter);
      }
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(
          `policy_number.ilike.%${searchTerm}%,` +
          `policyholder_name.ilike.%${searchTerm}%,` +
          `insurer_name.ilike.%${searchTerm}%,` +
          `product_name.ilike.%${searchTerm}%`
        );
      }
      
      // Apply pagination
      query = query.range(from, to).order('updated_at', { ascending: false });
      
      // Execute the query
      const { data, error, count } = await query;
      
      if (error) {
        console.error("Error fetching workflow policies:", error);
        throw error;
      }
      
      return {
        policies: data as Policy[],
        totalCount: count || 0
      };
    }
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t("draft")}</Badge>;
      case 'in_review':
        return <Badge variant="secondary" className="flex items-center gap-1"><FileInput className="h-3 w-3" /> {t("inReview")}</Badge>;
      case 'ready':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {t("ready")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewPolicy = (id: string) => {
    navigate(`/policies/${id}`);
  };

  const handleReviewPolicy = (id: string) => {
    navigate(`/policies/${id}/review`);
  };

  const columns: Column<Policy>[] = [
    {
      header: t("policyNumber"),
      accessorKey: "policy_number",
      sortable: true,
    },
    {
      header: t("client"),
      accessorKey: "policyholder_name",
      sortable: true,
    },
    {
      header: t("insurer"),
      accessorKey: "insurer_name",
      sortable: true,
    },
    {
      header: t("product"),
      accessorKey: "product_name",
      sortable: true,
    },
    {
      header: t("premium"),
      accessorKey: "premium",
      cell: (row) => formatCurrency(row.premium, row.currency),
      sortable: true,
    },
    {
      header: t("expiryDate"),
      accessorKey: "expiry_date",
      cell: (row) => formatDate(row.expiry_date),
      sortable: true,
    },
    {
      header: t("workflowStatus"),
      accessorKey: "workflow_status",
      cell: (row) => getStatusBadge(row.workflow_status),
      sortable: true,
    },
    {
      header: t("actions"),
      accessorKey: "id",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleViewPolicy(row.id)}
          >
            <span className="sr-only">{t("view")}</span>
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-8"
            onClick={() => handleReviewPolicy(row.id)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {t("review")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data?.policies || []}
      columns={columns}
      isLoading={isLoading}
      emptyState={{
        title: t("noPoliciesInWorkflow"),
        description: t("noPoliciesInWorkflowDescription"),
        action: (
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("refresh")}
          </Button>
        ),
      }}
      pagination={{
        pageSize,
        currentPage,
        totalItems: data?.totalCount || 0,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
        pageSizeOptions: [10, 25, 50, 100],
      }}
    />
  );
};

export default WorkflowPoliciesList;
