
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInsurers } from "@/hooks/useInsurers";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import AdvancedFilterDialog from "./filters/AdvancedFilterDialog";
import InsurersTable from "./insurers/InsurersTable";
import InsurersFilters from "./insurers/InsurersFilters";
import InsurersActionButtons from "./insurers/InsurersActionButtons";
import InsurerFormManager from "./insurers/InsurerFormManager";
import { Insurer } from "@/types/codebook";

const InsurersDirectory = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
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
    getActiveFilterCount,
    pagination
  } = useInsurers();
  
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const handleDelete = async (insurerId: string) => {
    try {
      await deleteInsurer(insurerId);
    } catch (error) {
      console.error("Failed to delete insurer:", error);
    }
  };

  const handleImport = async (importedInsurers: Partial<Insurer>[]) => {
    try {
      let created = 0;
      let updated = 0;
      
      for (const insurerData of importedInsurers) {
        const existingInsurer = allInsurers?.find(c => c.name === insurerData.name);
        
        if (existingInsurer) {
          await updateInsurer(existingInsurer.id, insurerData);
          updated++;
        } else if (insurerData.name) {
          // Ensure required fields are present
          await addInsurer({
            name: insurerData.name,
            is_active: insurerData.is_active ?? true,
            company_id: user?.companyId || "",
            contact_person: insurerData.contact_person,
            email: insurerData.email,
            phone: insurerData.phone,
            address: insurerData.address,
            city: insurerData.city,
            postal_code: insurerData.postal_code,
            country: insurerData.country,
            registration_number: insurerData.registration_number
          });
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

  const handlePageChange = (page: number) => {
    pagination.setPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    pagination.setPageSize(pageSize);
    pagination.setPage(1); // Reset to first page when changing page size
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
              pagination={{
                pageSize: pagination.pageSize,
                currentPage: pagination.page,
                totalItems: pagination.totalCount,
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange,
                pageSizeOptions: [10, 25, 50, 100]
              }}
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
