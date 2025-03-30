
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DataTable, { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/utils/format";
import { Eye, MoreHorizontal, Receipt, FileText, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoiceType } from "@/types/finances";
import { Link, useNavigate } from "react-router-dom";

interface InvoicesTableProps {
  invoices: InvoiceType[];
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
  };
  totalCount: number;
  onRefresh: () => void;
}

const InvoicesTable = ({
  invoices,
  isLoading,
  pagination,
  onRefresh,
}: InvoicesTableProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const getStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status) {
      case 'draft':
        variant = "secondary";
        break;
      case 'issued':
        variant = "default";
        break;
      case 'paid':
        variant = "outline";
        break;
      case 'cancelled':
        variant = "destructive";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant}>
        {t(status)}
      </Badge>
    );
  };

  const handleViewInvoice = (id: string) => {
    navigate(`/finances/invoicing/${id}`);
  };

  const columns: Column<InvoiceType>[] = [
    {
      header: t("invoiceNumber"),
      accessorKey: "invoice_number",
      sortable: true,
    },
    {
      header: t("entityName"),
      accessorKey: "entity_name",
      sortable: true,
    },
    {
      header: t("issueDate"),
      accessorKey: "issue_date",
      cell: (row) => formatDate(new Date(row.issue_date)),
      sortable: true,
    },
    {
      header: t("dueDate"),
      accessorKey: "due_date",
      cell: (row) => formatDate(new Date(row.due_date)),
      sortable: true,
    },
    {
      header: t("amount"),
      accessorKey: "total_amount",
      cell: (row) => formatCurrency(row.total_amount, row.currency),
      sortable: true,
    },
    {
      header: t("status"),
      accessorKey: "status",
      cell: (row) => getStatusBadge(row.status),
      sortable: true,
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
            <DropdownMenuItem onClick={() => handleViewInvoice(row.id)}>
              <Eye className="mr-2 h-4 w-4" />
              {t("view")}
            </DropdownMenuItem>
            {row.status === 'draft' && (
              <>
                <DropdownMenuItem>
                  <Receipt className="mr-2 h-4 w-4" />
                  {t("issueInvoice")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Ban className="mr-2 h-4 w-4" />
                  {t("cancelInvoice")}
                </DropdownMenuItem>
              </>
            )}
            {row.status === 'issued' && (
              <DropdownMenuItem>
                <Receipt className="mr-2 h-4 w-4" />
                {t("markAsPaid")}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              {t("downloadInvoice")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={invoices}
      columns={columns}
      isLoading={isLoading}
      emptyState={{
        title: t("noInvoicesFound"),
        description: t("tryAdjustingYourSearch"),
        action: (
          <Button variant="outline" onClick={onRefresh}>
            {t("refresh")}
          </Button>
        ),
      }}
      pagination={{
        currentPage: pagination.page,
        itemsPerPage: pagination.pageSize,
        totalItems: pagination.totalCount,
        totalPages: pagination.totalPages,
        onPageChange: pagination.setPage,
        onPageSizeChange: pagination.setPageSize,
        pageSizeOptions: [10, 25, 50, 100],
      }}
    />
  );
};

export default InvoicesTable;
