
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInsurers } from "@/hooks/useInsurers";
import { Insurer } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";
import AdvancedFilterDialog from "./filters/AdvancedFilterDialog";
import InsurerFormDialog from "./dialogs/InsurerFormDialog";
import InsurersTable from "./insurers/InsurersTable";
import InsurersFilters from "./insurers/InsurersFilters";
import InsurersActionButtons from "./insurers/InsurersActionButtons";

const InsurersDirectory = () => {
  const { t } = useLanguage();
  const { 
    insurers, 
    allInsurers,
    isLoading, 
    searchTerm, 
    setSearchTerm, 
    deleteInsurer, 
    addInsurer, 
    updateInsurer,
    filters,
    handleFilterChange,
    handleClearFilter,
    resetFilters,
    getActiveFilterCount
  } = useInsurers();
  
  const [insurerToDelete, setInsurerToDelete] = useState<string | null>(null);
  const [isInsurerFormOpen, setIsInsurerFormOpen] = useState(false);
  const [selectedInsurerId, setSelectedInsurerId] = useState<string | undefined>(undefined);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

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

  const handleImport = async (importedInsurers: Partial<Insurer>[]) => {
    try {
      let created = 0;
      let updated = 0;
      
      for (const insurerData of importedInsurers) {
        const existingInsurer = allInsurers?.find(c => c.name === insurerData.name);
        
        if (existingInsurer) {
          await updateInsurer(existingInsurer.id, insurerData as Partial<Insurer>);
          updated++;
        } else {
          await addInsurer(insurerData as Omit<Insurer, 'id' | 'created_at' | 'updated_at'>);
          created++;
        }
      }
      
      return { created, updated };
    } catch (error) {
      console.error("Error during import:", error);
      throw error;
    }
  };

  const getExportData = () => {
    return insurers.map(insurer => ({
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
          insurers={insurers}
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
