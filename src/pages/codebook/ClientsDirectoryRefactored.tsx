
import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Edit, Trash2, UserPlus, FileText } from "lucide-react";
import { useClients } from "@/hooks/codebook/useClients";
import { 
  DataTable,
  Column,
  PageHeader,
  ActionButtons,
  FilterBar,
  ActiveFilter,
  FilterGroup
} from "@/components/ui/common";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
}

const ClientsDirectoryRefactored = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  
  // Using the hook (placeholder - actual implementation would use the real hook)
  const { 
    clients, 
    isLoading, 
    error, 
    deleteClient,
    refresh 
  } = useClients(searchQuery);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (filters: ActiveFilter[]) => {
    setActiveFilters(filters);
    // In a real implementation, we would update our filter state accordingly
  };
  
  const filterGroups: FilterGroup[] = [
    {
      id: "status",
      label: t("status"),
      options: [
        { id: "active", label: t("active"), value: "active" },
        { id: "inactive", label: t("inactive"), value: "inactive" },
      ]
    }
  ];

  const columns: Column<Client>[] = [
    {
      key: "name",
      header: t("clientName"),
      render: (client) => (
        <div>
          <span className="font-medium">{client.name}</span>
          {!client.is_active && (
            <Badge variant="outline" className="ml-2 bg-muted text-muted-foreground">
              {t("inactive")}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: "contact_person",
      header: t("contactPerson")
    },
    {
      key: "email",
      header: t("email")
    },
    {
      key: "phone",
      header: t("phone")
    },
    {
      key: "actions",
      header: t("actions"),
      className: "w-[120px]",
      render: (client) => (
        <div className="flex items-center gap-2">
          <ActionButtons
            primaryAction={{
              label: t("edit"),
              onClick: () => console.log("Edit client", client.id),
              icon: <Edit className="h-4 w-4" />
            }}
            secondaryActions={[
              {
                id: "view",
                label: t("view"),
                onClick: () => console.log("View client", client.id),
                icon: <FileText className="h-4 w-4" />
              },
              {
                id: "delete",
                label: t("delete"),
                onClick: () => console.log("Delete client", client.id),
                variant: "destructive",
                icon: <Trash2 className="h-4 w-4" />
              }
            ]}
          />
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader 
        title={t("clientsDirectory")}
        description={t("clientsDirectoryDescription")}
        actions={
          <ActionButtons 
            primaryAction={{
              label: t("addClient"),
              onClick: () => console.log("Add client"),
              icon: <UserPlus className="h-4 w-4 mr-2" />
            }}
          />
        }
      />
      
      <FilterBar 
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={() => setActiveFilters([])}
      />
      
      <DataTable<Client>
        data={clients || []}
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        error={error}
        onRefresh={refresh}
        onSearch={handleSearch}
        searchPlaceholder={t("searchClients")}
        emptyMessage={t("noClientsFound")}
      />
    </div>
  );
};

export default ClientsDirectoryRefactored;
