
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInsurers } from "@/hooks/useInsurers";
import { useLanguage } from "@/contexts/LanguageContext";
import AdvancedFilterDialog from "./filters/AdvancedFilterDialog";
import InsurersTable from "./insurers/InsurersTable";
import InsurersFilters from "./insurers/InsurersFilters";
import InsurersActionButtons from "./insurers/InsurersActionButtons";
import InsurerFormManager from "./insurers/InsurerFormManager";

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
  
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const handleDelete = async (insurerId: string) => {
    try {
      await deleteInsurer(insurerId);
    } catch (error) {
      console.error("Failed to delete insurer:", error);
    }
  };

  const handleImport = async (importedInsurers: Partial<any>[]) => {
    try {
      let created = 0;
      let updated = 0;
      
      for (const insurerData of importedInsurers) {
        const existingInsurer = allInsurers?.find(c => c.name === insurerData.name);
        
        if (existingInsurer) {
          await updateInsurer(existingInsurer.id, insurerData);
          updated++;
        } else {
          await addInsurer(insurerData);
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
        <InsurerFormManager>
          {({ openAddForm }) => (
            <InsurersActionButtons
              onImport={handleImport}
              getExportData={getExportData}
              onAddInsurer={openAddForm}
            />
          )}
        </InsurerFormManager>
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
        
        <InsurerFormManager>
          {({ openEditForm }) => (
            <InsurersTable
              insurers={insurers}
              isLoading={isLoading}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          )}
        </InsurerFormManager>
      </CardContent>

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
