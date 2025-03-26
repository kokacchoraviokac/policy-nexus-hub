import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash, Filter } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import DataTable from "@/components/ui/data-table";
import { useClients } from "@/hooks/useClients";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/auth/AuthContext";
import ClientFormDialog from "./dialogs/ClientFormDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Client } from "@/types/codebook";
import ImportExportButtons from "./ImportExportButtons";

const ClientsDirectory = () => {
  const { user } = useAuth();
  const { clients, isLoading, searchTerm, setSearchTerm, deleteClient, addClient, updateClient } = useClients();
  const { toast } = useToast();
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  
  // New state for filters
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("");

  useEffect(() => {
    if (!clients) return;
    
    let filtered = [...clients];
    
    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter(client => client.is_active === isActive);
    }
    
    // Apply city filter if specified
    if (cityFilter) {
      filtered = filtered.filter(client => 
        client.city && client.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }
    
    setFilteredClients(filtered);
  }, [clients, statusFilter, cityFilter, searchTerm]);

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

  const resetFilters = () => {
    setStatusFilter("all");
    setCityFilter("");
  };

  // Data Import function
  const handleImport = async (importedClients: Partial<Client>[]) => {
    try {
      // Track how many were created and updated
      let created = 0;
      let updated = 0;
      
      for (const clientData of importedClients) {
        // Check if client with same name exists (replace with better unique identifier if available)
        const existingClient = clients?.find(c => c.name === clientData.name);
        
        if (existingClient) {
          // Update existing client
          await updateClient(existingClient.id, clientData as Partial<Client>);
          updated++;
        } else {
          // Add new client
          await addClient(clientData as Omit<Client, 'id' | 'created_at' | 'updated_at'>);
          created++;
        }
      }
      
      toast({
        title: "Import completed",
        description: `Created ${created} new clients and updated ${updated} existing clients.`,
      });
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: "Import failed",
        description: "There was an error processing the imported data.",
        variant: "destructive"
      });
    }
  };

  // Data Export function
  const getExportData = () => {
    // Return data to export - can be filtered or all clients
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
      is_active: client.is_active ? 'Yes' : 'No',
      notes: client.notes || ''
    }));
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Client,
      sortable: true
    },
    {
      header: "Contact Person",
      accessorKey: "contact_person" as keyof Client,
      cell: (row: Client) => row.contact_person || "-",
      sortable: true
    },
    {
      header: "Email",
      accessorKey: "email" as keyof Client,
      cell: (row: Client) => row.email || "-",
      sortable: true
    },
    {
      header: "Phone",
      accessorKey: "phone" as keyof Client,
      cell: (row: Client) => row.phone || "-",
    },
    {
      header: "City",
      accessorKey: "city" as keyof Client,
      cell: (row: Client) => row.city || "-",
      sortable: true
    },
    {
      header: "Status",
      accessorKey: "is_active" as keyof Client,
      cell: (row: Client) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
      sortable: true
    },
    {
      header: "Actions",
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
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the client "{row.name}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setClientToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
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
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>
            Manage client records including contact details and tax information
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <ImportExportButtons
            onImport={handleImport}
            getData={getExportData}
            entityName="Clients"
          />
          <Button className="flex items-center gap-1" onClick={handleAddClient}>
            <Plus className="h-4 w-4" /> Add Client
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search clients..."
            className="w-full sm:max-w-xs"
          />
          
          <div className="flex gap-2 items-center">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Clients</h4>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      placeholder="Filter by city"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <Button size="sm">Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <DataTable
          data={filteredClients || []}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            title: "No clients found",
            description: "Try adjusting your search or add a new client.",
            action: null
          }}
        />
      </CardContent>

      <ClientFormDialog 
        open={isClientFormOpen}
        onOpenChange={setIsClientFormOpen}
        clientId={selectedClientId}
      />
    </Card>
  );
};

export default ClientsDirectory;
