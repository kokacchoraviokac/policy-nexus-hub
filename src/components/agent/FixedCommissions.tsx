
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useAgentFixedCommissions } from "@/hooks/agent/useAgentFixedCommissions";
import FixedCommissionDialog from "./dialogs/FixedCommissionDialog";

const FixedCommissions = () => {
  const { t } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<any>(null);
  
  const { 
    fixedCommissions,
    isLoading,
    pagination,
    totalCount,
    addFixedCommission,
    updateFixedCommission,
    deleteFixedCommission,
    isSubmitting
  } = useAgentFixedCommissions();

  // Define columns for the DataTable
  const columns = [
    {
      header: t("agent"),
      accessorKey: "agent_name", 
    },
    {
      header: t("commissionRate"),
      accessorKey: "rate",
      cell: (row: any) => `${row.rate}%`
    },
    {
      header: t("effectiveFrom"),
      accessorKey: "effective_from",
      cell: (row: any) => new Date(row.effective_from).toLocaleDateString()
    },
    {
      header: t("effectiveTo"),
      accessorKey: "effective_to",
      cell: (row: any) => row.effective_to ? new Date(row.effective_to).toLocaleDateString() : t("indefinite")
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
        <h2 className="text-xl font-semibold">{t("fixedCommissionsList")}</h2>
        <Button onClick={() => {
          setSelectedCommission(null);
          setShowDialog(true);
        }}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("addFixedCommission")}
        </Button>
      </div>
      
      <Card className="p-4">
        <DataTable
          data={fixedCommissions}
          columns={columns}
          keyField="id"
          isLoading={isLoading}
          pagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            totalPages: Math.ceil(totalCount / pagination.pageSize),
            totalCount: totalCount,
            onPageChange: (page) => pagination.onPageChange(page),
            onPageSizeChange: (size) => pagination.onPageSizeChange(size)
          }}
          emptyState={{
            title: t("noFixedCommissionsFound"),
            description: t("noFixedCommissionsDescription"),
            action: (
              <Button onClick={() => setShowDialog(true)}>
                {t("createFixedCommission")}
              </Button>
            )
          }}
        />
      </Card>
      
      {showDialog && (
        <FixedCommissionDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onSubmit={(data) => {
            if (selectedCommission) {
              updateFixedCommission({ id: selectedCommission.id, ...data });
            } else {
              addFixedCommission(data);
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

export default FixedCommissions;
