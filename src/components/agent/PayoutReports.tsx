
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { usePayoutReports } from "@/hooks/agent/usePayoutReports";
import PayoutDetailsDialog from "./dialogs/PayoutDetailsDialog";

const PayoutReports = () => {
  const { t } = useLanguage();
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const { 
    payouts,
    isLoading,
    pagination,
    totalCount,
    exportPayoutReport
  } = usePayoutReports();

  // Define columns for the DataTable
  const columns = [
    {
      header: t("agent"),
      accessorKey: "agent_name", 
    },
    {
      header: t("period"),
      accessorKey: "period",
      cell: (row: any) => `${new Date(row.period_start).toLocaleDateString()} - ${new Date(row.period_end).toLocaleDateString()}`
    },
    {
      header: t("totalAmount"),
      accessorKey: "total_amount",
      cell: (row: any) => `${row.total_amount.toFixed(2)}`
    },
    {
      header: t("status"),
      accessorKey: "status",
      cell: (row: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          row.status === 'paid' ? 'bg-green-100 text-green-800' : 
          row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {t(row.status)}
        </span>
      )
    },
    {
      header: t("paymentDate"),
      accessorKey: "payment_date",
      cell: (row: any) => row.payment_date ? new Date(row.payment_date).toLocaleDateString() : '-'
    },
    {
      header: t("actions"),
      accessorKey: "id",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setSelectedPayout(row);
              setShowDetailsDialog(true);
            }}
          >
            {t("viewDetails")}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("payoutHistory")}</h2>
        <Button onClick={() => exportPayoutReport()}>
          <Download className="h-4 w-4 mr-2" />
          {t("exportPayouts")}
        </Button>
      </div>
      
      <Card className="p-4">
        <DataTable
          data={payouts}
          columns={columns}
          isLoading={isLoading}
          pagination={{
            currentPage: pagination.pageIndex,
            totalPages: Math.ceil(totalCount / pagination.pageSize),
            itemsPerPage: pagination.pageSize,
            totalItems: totalCount,
            onPageChange: (page) => pagination.onPageChange(page),
            onPageSizeChange: (size) => pagination.onPageSizeChange(size)
          }}
          emptyState={{
            title: t("noPayoutsFound"),
            description: t("noPayoutsDescription")
          }}
        />
      </Card>
      
      {showDetailsDialog && selectedPayout && (
        <PayoutDetailsDialog
          open={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
          payoutId={selectedPayout.id}
        />
      )}
    </div>
  );
};

export default PayoutReports;
