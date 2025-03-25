
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import DataTable from "@/components/ui/data-table";
import { useClients } from "@/hooks/useClients";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuthSession } from "@/hooks/useAuthSession";

const ClientsDirectory = () => {
  const { authState } = useAuthSession();
  const { clients, isLoading, searchTerm, setSearchTerm, deleteClient } = useClients();
  const { toast } = useToast();
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      await deleteClient(clientToDelete);
      setClientToDelete(null);
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Contact Person",
      accessorKey: "contact_person",
      cell: (row) => row.contact_person || "-",
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (row) => row.email || "-",
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (row) => row.phone || "-",
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: (row) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: (row) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
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
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Client
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search clients..."
          className="w-full md:max-w-xs"
        />
        
        <DataTable
          data={clients || []}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            title: "No clients found",
            description: "Try adjusting your search or add a new client.",
            action: (
              <Button className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Client
              </Button>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ClientsDirectory;
