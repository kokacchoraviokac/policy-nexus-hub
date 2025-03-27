
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import DataTable from "@/components/ui/data-table";
import { useInsurers } from "@/hooks/useInsurers";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/auth/AuthContext";
import InsurerFormDialog from "./dialogs/InsurerFormDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Insurer, CodebookFilterState } from "@/types/codebook";
import ImportExportButtons from "./ImportExportButtons";
import { useLanguage } from "@/contexts/LanguageContext";
import FilterButton from "./filters/FilterButton";
import AdvancedFilterDialog from "./filters/AdvancedFilterDialog";
import ActiveFilters from "./filters/ActiveFilters";

const InsurersDirectory = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { insurers, isLoading, searchTerm, setSearchTerm, deleteInsurer, addInsurer, updateInsurer } = useInsurers();
  const { toast } = useToast();
  const [insurerToDelete, setInsurerToDelete] = useState<string | null>(null);
  const [isInsurerFormOpen, setIsInsurerFormOpen] = useState(false);
  const [selectedInsurerId, setSelectedInsurerId] = useState<string | undefined>(undefined);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  const [filters, setFilters] = useState<CodebookFilterState>({
    status: 'all',
    country: ''
  });
  
  const [filteredInsurers, setFilteredInsurers] = useState<Insurer[]>([]);

  useEffect(() => {
    if (!insurers) return;
    
    let filtered = [...insurers];
    
    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      filtered = filtered.filter(insurer => insurer.is_active === isActive);
    }
    
    if (filters.country && filters.country.trim() !== '') {
      filtered = filtered.filter(insurer => 
        insurer.country && insurer.country.toLowerCase().includes(filters.country!.toLowerCase())
      );
    }
    
    if (filters.city && filters.city.trim() !== '') {
      filtered = filtered.filter(insurer => 
        insurer.city && insurer.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    
    if (filters.createdAfter) {
      filtered = filtered.filter(insurer => {
        const createdAt = new Date(insurer.created_at);
        return createdAt >= filters.createdAfter!;
      });
    }
    
    if (filters.createdBefore) {
      filtered = filtered.filter(insurer => {
        const createdAt = new Date(insurer.created_at);
        return createdAt <= filters.createdBefore!;
      });
    }
    
    setFilteredInsurers(filtered);
  }, [insurers, filters, searchTerm]);

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
      country: ''
    });
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.country && filters.country.trim() !== '') count++;
    if (filters.city && filters.city.trim() !== '') count++;
    if (filters.createdAfter) count++;
    if (filters.createdBefore) count++;
    return count;
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
        title: t("importCompleted"),
        description: t("createdNewInsurers").replace("{0}", created.toString()).replace("{1}", updated.toString()),
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
      header: t("name"),
      accessorKey: "name" as keyof Insurer,
      sortable: true
    },
    {
      header: t("contactPerson"),
      accessorKey: "contact_person" as keyof Insurer,
      cell: (row: Insurer) => row.contact_person || "-",
      sortable: true
    },
    {
      header: t("email"),
      accessorKey: "email" as keyof Insurer,
      cell: (row: Insurer) => row.email || "-",
      sortable: true
    },
    {
      header: t("phone"),
      accessorKey: "phone" as keyof Insurer,
      cell: (row: Insurer) => row.phone || "-",
    },
    {
      header: t("country"),
      accessorKey: "country" as keyof Insurer,
      cell: (row: Insurer) => row.country || "-",
      sortable: true
    },
    {
      header: t("status"),
      accessorKey: "is_active" as keyof Insurer,
      cell: (row: Insurer) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? t("active") : t("inactive")}
        </Badge>
      ),
      sortable: true
    },
    {
      header: t("actions"),
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
                <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteInsurerConfirmation").replace("{0}", row.name)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setInsurerToDelete(null)}>{t("cancel")}</AlertDialogCancel>
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
          <CardTitle>{t("insuranceCompaniesDirectory")}</CardTitle>
          <CardDescription>
            {t("insuranceCompaniesDirectoryDescription")}
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <ImportExportButtons
            onImport={handleImport}
            getData={getExportData}
            entityName={t("insuranceCompanies")}
          />
          <Button className="flex items-center gap-1" onClick={handleAddInsurer}>
            <Plus className="h-4 w-4" /> {t("addInsurer")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("searchInsuranceCompanies")}
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
          data={filteredInsurers || []}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            title: t("noInsuranceCompaniesFound"),
            description: t("noInsuranceCompaniesFound"),
            action: null
          }}
        />
      </CardContent>

      <InsurerFormDialog 
        open={isInsurerFormOpen}
        onOpenChange={setIsInsurerFormOpen}
        insurerId={selectedInsurerId}
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

export default InsurersDirectory;
