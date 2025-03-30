
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import CommissionStatusBadge from "@/components/finances/commissions/CommissionStatusBadge";
import UpdateCommissionStatusDialog from "@/components/finances/commissions/UpdateCommissionStatusDialog";
import { CommissionType } from "@/types/finances";
import EmptyState from "@/components/ui/empty-state";
import PaginationController from "@/components/ui/pagination-controller";

interface CommissionsTableProps {
  commissions: (CommissionType & {
    policy_number?: string;
    policyholder_name?: string;
    insurer_name?: string;
    product_name?: string;
    agent_name?: string;
    currency?: string;
  })[];
  isLoading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  updateCommissionStatus: (params: { 
    commissionId: string; 
    status: string; 
    paymentDate?: string; 
    paidAmount?: number 
  }) => void;
  isUpdating: boolean;
}

const CommissionsTable: React.FC<CommissionsTableProps> = ({
  commissions,
  isLoading,
  pagination,
  updateCommissionStatus,
  isUpdating
}) => {
  const { t, formatCurrency } = useLanguage();
  const [selectedCommission, setSelectedCommission] = useState<(CommissionType & { currency?: string }) | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const handleOpenStatusDialog = (commission: CommissionType & { currency?: string }) => {
    setSelectedCommission(commission);
    setStatusDialogOpen(true);
  };

  const columns = [
    {
      header: t("policyNumber"),
      accessorKey: "policy_number",
    },
    {
      header: t("policyholder"),
      accessorKey: "policyholder_name",
    },
    {
      header: t("insurer"),
      accessorKey: "insurer_name",
    },
    {
      header: t("agent"),
      accessorKey: "agent_name",
      cell: (row: any) => row.agent_name || "-",
    },
    {
      header: t("baseAmount"),
      accessorKey: "base_amount",
      cell: (row: any) => formatCurrency(row.base_amount, row.currency || "EUR"),
    },
    {
      header: t("rate"),
      accessorKey: "rate",
      cell: (row: any) => `${row.rate}%`,
    },
    {
      header: t("commission"),
      accessorKey: "calculated_amount",
      cell: (row: any) => formatCurrency(row.calculated_amount, row.currency || "EUR"),
    },
    {
      header: t("status"),
      accessorKey: "status",
      cell: (row: any) => <CommissionStatusBadge status={row.status} />,
    },
    {
      header: t("actions"),
      accessorKey: "id",
      cell: (row: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleOpenStatusDialog(row)}
        >
          <Edit className="h-4 w-4 mr-2" />
          {t("updateStatus")}
        </Button>
      ),
    },
  ];

  const emptyState = {
    title: t("noCommissionsFound"),
    description: t("adjustFiltersForCommissions"),
  };

  return (
    <div>
      <DataTable
        data={commissions}
        columns={columns}
        isLoading={isLoading}
        emptyState={emptyState}
        pagination={{
          itemsPerPage: pagination.itemsPerPage,
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalItems,
          onPageChange: pagination.onPageChange,
          onPageSizeChange: pagination.onPageSizeChange,
          pageSizeOptions: [10, 25, 50, 100]
        }}
      />
      
      {selectedCommission && (
        <UpdateCommissionStatusDialog
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          commission={selectedCommission}
          onUpdateStatus={updateCommissionStatus}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default CommissionsTable;
