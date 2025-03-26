import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash, Filter } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import DataTable from "@/components/ui/data-table";
import { useInsurers } from "@/hooks/useInsurers";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/auth/AuthContext";
import InsurerFormDialog from "./dialogs/InsurerFormDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Insurer } from "@/types/codebook";
import ImportExportButtons from "./ImportExportButtons";

const InsurersDirectory = () => {
  const { user } = useAuth();
  const { insurers, isLoading, searchTerm, setSearchTerm, deleteInsurer, addInsurer, updateInsurer } = useInsurers();
  const { toast } = useToast();
  const [insurerToDelete, setInsurerToDelete] = useState<string | null>(null);
  const [isInsurerFormOpen, setIsInsurerFormOpen] = useState(false);
  const [selectedInsurerId, setSelectedInsurerId] = useState<string | undefined>(undefined);
  
  const [filteredInsurers, setFilteredInsurers] = useState<Insurer[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("");

  useEffect(() => {
    if (!insurers) return;
    
    let filtered = [...insurers];
    
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter(insurer => insurer.is_active === isActive);
    }
    
    if (countryFilter) {
      filtered = filtered.filter(insurer => 
        insurer.country && insurer.country.toLowerCase().includes(countryFilter.toLowerCase())
      );
    }
    
    setFilteredInsurers(filtered);
  }, [insurers, statusFilter, countryFilter, searchTerm]);

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

  const resetFilters = () => {
    setStatusFilter("all");
    setCountryFilter("");
  };

  const handleImport = async (importedInsurers: Partial<Insurer>[]) => {
    try {
      let created = 0;
      let updated = 0;
      
      for (const insurerData of importedInsurers) {
        const existingInsurer = insurers?.find(c => c.name === insurerData.name);
        
        if (existingInsurer) {
          await updateInsurer(existingInsurer.id, insurerData as Partial<Insurer>);
          updated++;
        } else {
          await addInsurer(insurerData as Omit<Insurer, 'id' | 'created_at' | 'updated_at'>);
          created++;
        }
      }
      
      toast({
        title: "Import completed",
        description: `Created ${created} new insurers and updated ${updated} existing insurers.`,
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

  const getExportData = () => {
    return filteredInsurers.map(insurer => ({
      name: insurer.name,
      contact_person: insurer.contact_person || '',
      email: insurer.email || '',
      phone: insurer.phone || '',
      address: insurer.address || '',
      city: insurer.city || '',
      postal_code: insurer.postal_code || '',
      country: insurer.country || '',
      registration_number: insurer.registration_number || '',
      is_active: insurer.is_active
    }));
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Insurer,
      sortable: true
    },
    {
      header: "Contact Person",
      accessorKey: "contact_person" as keyof Insurer,
      cell: (row: Insurer) => row.contact_person || "-",
      sortable: true
    },
    {
      header: "Email",
      accessorKey: "email" as keyof Insurer,
      cell: (row: Insurer) => row.email || "-",
      sortable: true
    },
    {
      header: "Phone",
      accessorKey: "phone" as keyof Insurer,
      cell: (row: Insurer) => row.phone || "-",
    },
    {
      header: "Country",
      accessorKey: "country" as keyof Insurer,
      cell: (row: Insurer) => row.country || "-",
      sortable: true
    },
    {
      header: "Status",
      accessorKey: "is_active" as keyof Insurer,
      cell: (row: Insurer) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
      sortable: true
    },
    {
      header: "Actions",
      accessorKey: (row: Insurer) => (
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
        <div className="flex flex-col sm:flex-row gap-2">
          <ImportExportButtons
            onImport={handleImport}
            getData={getExportData}
            entityName="Insurers"
          />
          <Button className="flex items-center gap-1" onClick={handleAddInsurer}>
            <Plus className="h-4 w-4" /> Add Insurer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search insurance companies..."
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
                  <h4 className="font-medium">Filter Insurance Companies</h4>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      placeholder="Filter by country"
                      value={countryFilter}
                      onChange={(e) => setCountryFilter(e.target.value)}
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
          data={filteredInsurers || []}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            title: "No insurance companies found",
            description: "Try adjusting your search or add a new insurance company.",
            action: null
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
