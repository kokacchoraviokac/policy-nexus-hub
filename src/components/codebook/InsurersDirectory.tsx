
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import DataTable from "@/components/ui/data-table";
import { useInsurers } from "@/hooks/useInsurers";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuthSession } from "@/hooks/useAuthSession";
import InsurerFormDialog from "./dialogs/InsurerFormDialog";

const InsurersDirectory = () => {
  const { authState } = useAuthSession();
  const { insurers, isLoading, searchTerm, setSearchTerm, deleteInsurer } = useInsurers();
  const { toast } = useToast();
  const [insurerToDelete, setInsurerToDelete] = useState<string | null>(null);
  const [isInsurerFormOpen, setIsInsurerFormOpen] = useState(false);
  const [selectedInsurerId, setSelectedInsurerId] = useState<string | undefined>(undefined);

  const handleDelete = async () => {
    if (!insurerToDelete) return;
    
    try {
      await deleteInsurer(insurerToDelete);
      setInsurerToDelete(null);
    } catch (error) {
      console.error("Failed to delete insurer:", error);
    }
  };

  const handleAddInsurer = () => {
    setSelectedInsurerId(undefined);
    setIsInsurerFormOpen(true);
  };

  const handleEditInsurer = (insurerId: string) => {
    setSelectedInsurerId(insurerId);
    setIsInsurerFormOpen(true);
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
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleEditInsurer(row.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-destructive"
                onClick={() => setInsurerToDelete(row.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the insurance company "{row.name}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setInsurerToDelete(null)}>Cancel</AlertDialogCancel>
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
          <CardTitle>Insurance Companies</CardTitle>
          <CardDescription>
            Manage insurance company records including branch and parent company details
          </CardDescription>
        </div>
        <Button className="flex items-center gap-1" onClick={handleAddInsurer}>
          <Plus className="h-4 w-4" /> Add Insurer
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search insurance companies..."
          className="w-full md:max-w-xs"
        />
        
        <DataTable
          data={insurers || []}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            title: "No insurance companies found",
            description: "Try adjusting your search or add a new insurance company.",
            action: null // Removed duplicate button from empty state
          }}
        />
      </CardContent>

      <InsurerFormDialog 
        open={isInsurerFormOpen}
        onOpenChange={setIsInsurerFormOpen}
        insurerId={selectedInsurerId}
      />
    </Card>
  );
};

export default InsurersDirectory;
