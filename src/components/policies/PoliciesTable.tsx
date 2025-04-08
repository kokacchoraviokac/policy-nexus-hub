
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency, formatDate } from "@/utils/format";
import DataTable, { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export interface Policy {
  id: string;
  policy_number: string;
  insurer_name: string;
  product_name: string;
  policyholder_name: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  status: string;
}

interface PoliciesTableProps {
  searchTerm: string;
  statusFilter?: string;
  onViewPolicy: (policyId: string) => void;
  onEditPolicy: (policyId: string) => void;
}

const PoliciesTable = ({
  searchTerm,
  statusFilter,
  onViewPolicy,
  onEditPolicy,
}: PoliciesTableProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['policies', searchTerm, statusFilter, currentPage, pageSize],
    queryFn: async () => {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      let query = supabase
        .from('policies')
        .select('id, policy_number, insurer_name, product_name, policyholder_name, start_date, expiry_date, premium, currency, status', 
          { count: 'exact' });
      
      if (searchTerm) {
        query = query.or(
          `policy_number.ilike.%${searchTerm}%,` +
          `policyholder_name.ilike.%${searchTerm}%,` +
          `insurer_name.ilike.%${searchTerm}%,` +
          `product_name.ilike.%${searchTerm}%`
        );
      }
      
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      query = query.range(from, to).order('expiry_date');
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error("Error fetching policies:", error);
        throw error;
      }
      
      return {
        policies: data as Policy[],
        totalCount: count || 0
      };
    }
  });
  
  const getStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status.toLowerCase()) {
      case 'active':
        variant = "default";
        break;
      case 'expired':
        variant = "destructive";
        break;
      case 'pending':
        variant = "secondary";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant}>
        {status}
      </Badge>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const columns: Column<Policy>[] = [
    {
      header: t("policyNumber"),
      accessorKey: "policy_number",
    },
    {
      header: t("client"),
      accessorKey: "policyholder_name",
    },
    {
      header: t("insurer"),
      accessorKey: "insurer_name",
    },
    {
      header: t("product"),
      accessorKey: "product_name",
    },
    {
      header: t("expiryDate"),
      accessorKey: "expiry_date",
      cell: (row) => row.expiry_date ? formatDate(new Date(row.expiry_date)) : "-",
    },
    {
      header: t("premium"),
      accessorKey: "premium",
      cell: (row) => formatCurrency(row.premium, row.currency),
    },
    {
      header: t("status"),
      accessorKey: "status",
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: t("actions"),
      accessorKey: "id",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("openMenu")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewPolicy(row.id)}>
              <Eye className="mr-2 h-4 w-4" />
              {t("view")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditPolicy(row.id)}>
              <Edit className="mr-2 h-4 w-4" />
              {t("edit")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Calculate totalPages from totalCount and pageSize
  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);

  return (
    <DataTable
      data={data?.policies || []}
      columns={columns}
      isLoading={isLoading}
      emptyState={{
        title: t("noPoliciesFound"),
        description: t("tryAdjustingYourSearch"),
        action: (
          <Button variant="outline" onClick={() => refetch()}>
            {t("refresh")}
          </Button>
        ),
      }}
      pagination={{
        pageIndex: currentPage,
        pageSize: pageSize,
        totalItems: data?.totalCount || 0,
        totalPages: totalPages,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
        pageSizeOptions: [10, 25, 50, 100],
      }}
      keyField="id"
    />
  );
};

export default PoliciesTable;
