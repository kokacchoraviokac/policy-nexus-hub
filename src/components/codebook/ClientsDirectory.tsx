
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import DataTable from "@/components/ui/data-table";
import { useClients } from "@/hooks/useClients";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/auth/AuthContext";
import ClientFormDialog from "./dialogs/ClientFormDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client, CodebookFilterState } from "@/types/codebook";
import ImportExportButtons from "./ImportExportButtons";
import { useLanguage } from "@/contexts/LanguageContext";
import FilterButton from "./filters/FilterButton";
import AdvancedFilterDialog from "./filters/AdvancedFilterDialog";
import ActiveFilters from "./filters/ActiveFilters";
import { parseISO } from "date-fns";

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
          await updateClient(existingClient.id, clientData as Partial<Client>);
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

  const columns = [
    {
      header: t("name"),
      accessorKey: "name" as keyof Client,
      sortable: true
    },
    {
      header: t("contactPerson"),
      accessorKey: "contact_person" as keyof Client,
      cell: (row: Client) => row.contact_person || "-",
      sortable: true
    },
    {
      header: t("email"),
      accessorKey: "email" as keyof Client,
      cell: (row: Client) => row.email || "-",
      sortable: true
    },
    {
      header: t("phone"),
      accessorKey: "phone" as keyof Client,
      cell: (row: Client) => row.phone || "-",
    },
    {
      header: t("city"),
      accessorKey: "city" as keyof Client,
      cell: (row: Client) => row.city || "-",
      sortable: true
    },
    {
      header: t("status"),
      accessorKey: "is_active" as keyof Client,
      cell: (row: Client) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? t("active") : t("inactive")}
        </Badge>
      ),
      sortable: true
    },
    {
      header: t("actions"),
      accessorKey: (row: Client) => (
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleEditClient(row.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-destructive"
                onClick={() => setClientToDelete(row.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteClientConfirmation").replace("{0}", row.name)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setClientToDelete(null)}>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("clientDirectory")}</CardTitle>
          <CardDescription>
            {t("clientDirectoryDescription")}
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <ImportExportButtons
            onImport={handleImport}
            getData={getExportData}
            entityName={t("clients")}
          />
          <Button className="flex items-center gap-1" onClick={handleAddClient}>
            <Plus className="h-4 w-4" /> {t("addClient")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("searchClients")}
            className="w-full sm:max-w-xs"
          />
          
          <div className="flex gap-2 items-center">
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange({ ...filters, status: value as 'all' | 'active' | 'inactive' })}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatus")}</SelectItem>
                <SelectItem value="active">{t("active")}</SelectItem>
                <SelectItem value="inactive">{t("inactive")}</SelectItem>
              </SelectContent>
            </Select>
            
            <FilterButton
              activeFilterCount={getActiveFilterCount()}
              onClick={() => setIsFilterDialogOpen(true)}
            />
          </div>
        </div>
        
        <ActiveFilters 
          filters={filters} 
          onClearFilter={handleClearFilter}
        />
        
        <DataTable
          data={filteredClients || []}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            title: t("noClientsFound"),
            description: t("noClientsFound"),
            action: null
          }}
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
