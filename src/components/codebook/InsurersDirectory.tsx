
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInsurers } from "@/hooks/useInsurers";
import { useToast } from "@/hooks/use-toast";
import { Insurer, CodebookFilterState } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";
import AdvancedFilterDialog from "./filters/AdvancedFilterDialog";
import InsurerFormDialog from "./dialogs/InsurerFormDialog";
import InsurersTable from "./insurers/InsurersTable";
import InsurersFilters from "./insurers/InsurersFilters";
import InsurersActionButtons from "./insurers/InsurersActionButtons";

const InsurersDirectory = () => {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("insuranceCompaniesDirectory")}</CardTitle>
          <CardDescription>
            {t("insuranceCompaniesDirectoryDescription")}
          </CardDescription>
        </div>
        <InsurersActionButtons
          onImport={handleImport}
          getExportData={getExportData}
          onAddInsurer={handleAddInsurer}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <InsurersFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilter={handleClearFilter}
          onOpenFilterDialog={() => setIsFilterDialogOpen(true)}
          activeFilterCount={getActiveFilterCount()}
        />
        
        <InsurersTable
          insurers={filteredInsurers}
          isLoading={isLoading}
          onEdit={handleEditInsurer}
          onDelete={(id) => {
            setInsurerToDelete(id);
            handleDelete();
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
