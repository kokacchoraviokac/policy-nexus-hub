
import React from "react";
import { useInsurerDirectory } from "@/components/codebook/insurers/useInsurerDirectory";
import InsurersHeader from "@/components/codebook/insurers/InsurersHeader";
import InsurersFilters from "@/components/codebook/insurers/InsurersFilters";
import InsurersTable from "@/components/codebook/insurers/InsurersTable";
import InsurersPrivilegeNotice from "@/components/codebook/insurers/InsurersPrivilegeNotice";
import InsurerFormDialog from "@/components/codebook/dialogs/InsurerFormDialog";
import AdvancedFilterDialog from "@/components/codebook/filters/AdvancedFilterDialog";

const InsurersDirectory: React.FC = () => {
  const {
    // Data
    insurers,
    isLoading,
    searchTerm,
    filters,
    savedFilters,
    pagination,
    
    // UI state
    formOpen,
    setFormOpen,
    filterDialogOpen,
    setFilterDialogOpen,
    
    // Actions
    handleViewDetails,
    handleAddInsurer,
    setSearchTerm,
    handleFilterChange,
    handleClearFilter,
    resetFilters,
    getActiveFilterCount,
    saveFilter,
    deleteFilter,
    parseFilterData,
    getExportData,
    
    // Status
    isSaving,
    isDeleting,
    
    // Permissions
    canAddInsurer,
    canImportExport
  } = useInsurerDirectory();

  return (
    <div className="space-y-6">
      <InsurersHeader
        onAddInsurer={() => setFormOpen(true)}
        canAddInsurer={canAddInsurer}
        canImportExport={canImportExport}
        getExportData={getExportData}
      />

      <InsurersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
        onOpenFilterDialog={() => setFilterDialogOpen(true)}
        activeFilterCount={getActiveFilterCount()}
        savedFilters={savedFilters}
        onSaveFilter={saveFilter}
        onDeleteFilter={deleteFilter}
        isSaving={isSaving}
        isDeleting={isDeleting}
        parseFilterData={parseFilterData}
        showSavedFilters={true}
      />
      
      <InsurersTable
        insurers={insurers}
        isLoading={isLoading}
        canAddInsurer={canAddInsurer}
        onViewDetails={handleViewDetails}
        onAddInsurer={() => setFormOpen(true)}
        pagination={pagination}
      />
      
      <InsurerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
      />
      
      <AdvancedFilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onApplyFilters={handleFilterChange}
        onResetFilters={resetFilters}
        entityType="insurers"
        filterOptions={{
          showStatus: true,
          showCity: true,
          showCountry: true,
          showCreatedDates: true
        }}
      />
      
      <InsurersPrivilegeNotice 
        canAddInsurer={canAddInsurer} 
        canImportExport={canImportExport} 
      />
    </div>
  );
};

export default InsurersDirectory;
