
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useAgentManualCommissions } from "@/hooks/agent/useAgentManualCommissions";
import ManualCommissionDialog from "./dialogs/ManualCommissionDialog";

const ManualCommissions = () => {
  const { t } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<any>(null);
  
  const { 
    manualCommissions,
    isLoading,
    pagination,
    totalCount,
    addManualCommission,
    updateManualCommission,
    deleteManualCommission,
    isSubmitting
  } = useAgentManualCommissions();

  // Define columns for the DataTable
  const columns = [
    {
      header: t("agent"),
      accessorKey: "agent_name", 
    },
    {
      header: t("policy"),
      accessorKey: "policy_number", 
    },
    {
      header: t("commissionRate"),
      accessorKey: "rate",
      cell: (row: any) => `${row.rate}%`
    },
    {
      header: t("justification"),
      accessorKey: "justification",
    },
    {
      header: t("createdAt"),
      accessorKey: "created_at",
      cell: (row: any) => new Date(row.created_at).toLocaleDateString()
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
              setSelectedCommission(row);
              setShowDialog(true);
            }}
          >
            {t("edit")}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("manualCommissionsList")}</h2>
        <Button onClick={() => {
          setSelectedCommission(null);
          setShowDialog(true);
        }}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("addManualCommission")}
        </Button>
      </div>
      
      <Card className="p-4">
        <DataTable
          data={manualCommissions}
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
            title: t("noManualCommissionsFound"),
            description: t("noManualCommissionsDescription"),
            action: (
              <Button onClick={() => setShowDialog(true)}>
                {t("createManualCommission")}
              </Button>
            )
          }}
        />
      </Card>
      
      {showDialog && (
        <ManualCommissionDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onSubmit={(data) => {
            if (selectedCommission) {
              updateManualCommission({ id: selectedCommission.id, ...data });
            } else {
              addManualCommission(data);
            }
            setShowDialog(false);
          }}
          isSubmitting={isSubmitting}
          initialData={selectedCommission}
        />
      )}
    </div>
  );
};

export default ManualCommissions;
