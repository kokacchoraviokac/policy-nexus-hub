
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DataTable from "@/components/ui/data-table";
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
import { Link, useNavigate } from "react-router-dom";

export interface Invoice {
  id: string;
  invoice_number: string;
  entity_name: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  currency: string;
  status: string;
}

export type InvoiceType = Invoice;

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

  const columns = [
    {
      accessorKey: "invoice_number",
      header: t("invoiceNumber"),
    },
    {
      accessorKey: "entity_name",
      header: t("entityName"),
    },
    {
      accessorKey: "issue_date",
      header: t("issueDate"),
      cell: (props: { row: { original: InvoiceType } }) => formatDate(new Date(props.row.original.issue_date)),
    },
    {
      accessorKey: "due_date",
      header: t("dueDate"),
      cell: (props: { row: { original: InvoiceType } }) => formatDate(new Date(props.row.original.due_date)),
    },
    {
      accessorKey: "total_amount",
      header: t("amount"),
      cell: (props: { row: { original: InvoiceType } }) => formatCurrency(props.row.original.total_amount, props.row.original.currency),
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: (props: { row: { original: InvoiceType } }) => getStatusBadge(props.row.original.status),
    },
    {
      id: "actions",
      header: t("actions"),
      cell: (props: { row: { original: InvoiceType } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("openMenu")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewInvoice(props.row.original.id)}>
              <Eye className="mr-2 h-4 w-4" />
              {t("view")}
            </DropdownMenuItem>
            {props.row.original.status === 'draft' && (
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
            {props.row.original.status === 'issued' && (
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
        pageIndex: pagination.page,
        pageSize: pagination.pageSize,
        totalItems: pagination.totalCount,
        totalPages: pagination.totalPages,
        onPageChange: pagination.setPage,
        onPageSizeChange: pagination.setPageSize,
        pageSizeOptions: [10, 25, 50, 100],
      }}
      keyField="id"
    />
  );
};

export default InvoicesTable;
