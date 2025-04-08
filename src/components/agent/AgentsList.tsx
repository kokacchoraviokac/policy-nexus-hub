
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useAgentManagement } from "@/hooks/agent/useAgentManagement";
import AgentFormDialog from "./dialogs/AgentFormDialog";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { Agent } from "@/hooks/agents/useAgents";
import AgentFilters from "./AgentFilters";

const AgentsList = () => {
  const { t } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { 
    agents,
    isLoading,
    pagination,
    totalCount,
    addAgent,
    updateAgent,
    deleteAgent,
    isSubmitting,
    filters,
    setFilters
  } = useAgentManagement();

  // Define columns for the DataTable
  const columns = [
    {
      header: t("name"),
      accessorKey: "name", 
    },
    {
      header: t("email"),
      accessorKey: "email",
    },
    {
      header: t("phone"),
      accessorKey: "phone",
    },
    {
      header: t("taxId"),
      accessorKey: "tax_id",
    },
    {
      header: t("bankAccount"),
      accessorKey: "bank_account",
    },
    {
      header: t("status"),
      accessorKey: "status",
      cell: (row: any) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          row.status === 'active' ? 'bg-green-100 text-green-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {t(row.status)}
        </span>
      )
    },
    {
      header: t("actions"),
      id: "actions",
      accessorKey: "id",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setSelectedAgent(row as Agent);
              setShowDialog(true);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            {t("edit")}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSelectedAgent(row as Agent);
              setShowDeleteDialog(true);
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t("deactivate")}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("agentsList")}</h2>
        <Button onClick={() => {
          setSelectedAgent(null);
          setShowDialog(true);
        }}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("addAgent")}
        </Button>
      </div>
      
      <AgentFilters filters={filters} setFilters={setFilters} />
      
      <Card className="p-4">
        <DataTable
          data={agents}
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
            title: t("noAgentsFound"),
            description: t("noAgentsDescription"),
            action: (
              <Button onClick={() => setShowDialog(true)}>
                {t("createAgent")}
              </Button>
            )
          }}
        />
      </Card>
      
      {showDialog && (
        <AgentFormDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onSubmit={(data) => {
            if (selectedAgent) {
              updateAgent({ id: selectedAgent.id, ...data });
            } else {
              addAgent(data);
            }
            setShowDialog(false);
          }}
          isSubmitting={isSubmitting}
          initialData={selectedAgent}
        />
      )}
      
      {showDeleteDialog && selectedAgent && (
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => {
            deleteAgent(selectedAgent.id);
            setShowDeleteDialog(false);
          }}
          title={t("deactivateAgent")}
          description={t("deactivateAgentConfirmation", { name: selectedAgent.name })}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default AgentsList;
