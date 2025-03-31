
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useClients, Client } from "@/hooks/useClients";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/AuthContext";
import ClientFormDialog from "./dialogs/ClientFormDialog";
import { CodebookFilterState } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";
import AdvancedFilterDialog from "./filters/AdvancedFilterDialog";
import ClientsTable from "./clients/ClientsTable";
import ClientsFilters from "./clients/ClientsFilters";
import ClientsActionButtons from "./clients/ClientsActionButtons";

const ClientsDirectory = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { clients, isLoading, searchTerm, setSearchTerm, deleteClient, addClient, updateClient } = useClients();
  const { toast } = useToast();
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  const [filters, setFilters] = useState<CodebookFilterState>({
    status: 'all',
    city: '',
    country: ''
  });
  
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  useEffect(() => {
    if (!clients) return;
    
    let filtered = [...clients];
    
    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      filtered = filtered.filter(client => client.is_active === isActive);
    }
    
    if (filters.city && filters.city.trim() !== '') {
      filtered = filtered.filter(client => 
        client.city && client.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    
    if (filters.country && filters.country.trim() !== '') {
      filtered = filtered.filter(client => 
        client.country && client.country.toLowerCase().includes(filters.country!.toLowerCase())
      );
    }
    
    if (filters.createdAfter) {
      filtered = filtered.filter(client => {
        const createdAt = new Date(client.created_at);
        return createdAt >= filters.createdAfter!;
      });
    }
    
    if (filters.createdBefore) {
      filtered = filtered.filter(client => {
        const createdAt = new Date(client.created_at);
        return createdAt <= filters.createdBefore!;
      });
    }
    
    setFilteredClients(filtered);
  }, [clients, filters, searchTerm]);

  const handleDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      await deleteClient(clientToDelete);
      setClientToDelete(null);
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  const handleAddClient = () => {
    setSelectedClientId(undefined);
    setIsClientFormOpen(true);
  };

  const handleEditClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setIsClientFormOpen(true);
  };

  const handleFilterChange = (newFilters: CodebookFilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilter = (key: keyof CodebookFilterState) => {
    setFilters(prev => {
      const updatedFilters = { ...prev };
      if (key === 'status') {
        updatedFilters.status = 'all';
      } else {
        updatedFilters[key] = undefined;
      }
      return updatedFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      city: '',
      country: ''
    });
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.city && filters.city.trim() !== '') count++;
    if (filters.country && filters.country.trim() !== '') count++;
    if (filters.createdAfter) count++;
    if (filters.createdBefore) count++;
    return count;
  };

  const handleImport = async (importedClients: Partial<Client>[]) => {
    try {
      let created = 0;
      let updated = 0;
      
      for (const clientData of importedClients) {
        const existingClient = clients?.find(c => c.name === clientData.name);
        
        if (existingClient) {
          await updateClient({ id: existingClient.id, ...clientData });
          updated++;
        } else {
          await addClient(clientData as Omit<Client, 'id' | 'created_at' | 'updated_at'>);
          created++;
        }
      }
      
      toast({
        title: t("importCompleted"),
        description: t("createdNewClients").replace("{0}", created.toString()).replace("{1}", updated.toString()),
      });
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: t("importFailed"),
        description: t("importFailedDescription"),
        variant: "destructive"
      });
    }
  };

  const getExportData = () => {
    return filteredClients.map(client => ({
      name: client.name,
      contact_person: client.contact_person || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      city: client.city || '',
      postal_code: client.postal_code || '',
      country: client.country || '',
      tax_id: client.tax_id || '',
      registration_number: client.registration_number || '',
      is_active: client.is_active,
      notes: client.notes || ''
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("clientDirectory")}</CardTitle>
          <CardDescription>
            {t("clientDirectoryDescription")}
          </CardDescription>
        </div>
        <ClientsActionButtons
          onImport={handleImport}
          getExportData={getExportData}
          onAddClient={handleAddClient}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <ClientsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilter={handleClearFilter}
          onOpenFilterDialog={() => setIsFilterDialogOpen(true)}
          activeFilterCount={getActiveFilterCount()}
        />
        
        <ClientsTable
          clients={filteredClients}
          isLoading={isLoading}
          onEdit={handleEditClient}
          onDelete={setClientToDelete}
        />
      </CardContent>

      <ClientFormDialog 
        open={isClientFormOpen}
        onOpenChange={setIsClientFormOpen}
        clientId={selectedClientId}
      />
      
      <AdvancedFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={filters}
        onApplyFilters={handleFilterChange}
        onResetFilters={resetFilters}
        entityType="clients"
        filterOptions={{
          showStatus: true,
          showCity: true,
          showCountry: true,
          showCreatedDates: true
        }}
      />
    </Card>
  );
};

export default ClientsDirectory;
