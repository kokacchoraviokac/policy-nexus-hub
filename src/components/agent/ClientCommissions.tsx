
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useAgentClientCommissions } from "@/hooks/agent/useAgentClientCommissions";
import ClientCommissionDialog from "./dialogs/ClientCommissionDialog";

const ClientCommissions = () => {
  const { t } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<any>(null);
  
  const { 
    clientCommissions,
    isLoading,
    pagination,
    totalCount,
    addClientCommission,
    updateClientCommission,
    deleteClientCommission,
    isSubmitting
  } = useAgentClientCommissions();

  // Define columns for the DataTable
  const columns = [
    {
      header: t("agent"),
      accessorKey: "agent_name", 
    },
    {
      header: t("client"),
      accessorKey: "client_name", 
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
        <h2 className="text-xl font-semibold">{t("clientCommissionsList")}</h2>
        <Button onClick={() => {
          setSelectedCommission(null);
          setShowDialog(true);
        }}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("addClientCommission")}
        </Button>
      </div>
      
      <Card className="p-4">
        <DataTable
          data={clientCommissions}
          columns={columns}
          keyField="id"
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
            title: t("noClientCommissionsFound"),
            description: t("noClientCommissionsDescription"),
            action: (
              <Button onClick={() => setShowDialog(true)}>
                {t("createClientCommission")}
              </Button>
            )
          }}
        />
      </Card>
      
      {showDialog && (
        <ClientCommissionDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onSubmit={(data) => {
            if (selectedCommission) {
              updateClientCommission({ id: selectedCommission.id, ...data });
            } else {
              addClientCommission(data);
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

export default ClientCommissions;
