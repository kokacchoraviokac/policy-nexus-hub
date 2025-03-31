
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { useInsurers } from "@/hooks/useInsurers";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSimpleSavedFilters } from "@/hooks/useSimpleSavedFilters";
import DataTable from "@/components/ui/data-table";
import getInsurerColumns from "@/components/codebook/insurers/InsurersColumns";
import InsurersFilters from "@/components/codebook/insurers/InsurersFilters";
import InsurersActionButtons from "@/components/codebook/insurers/InsurersActionButtons";
import InsurerFormDialog from "@/components/codebook/dialogs/InsurerFormDialog";
import AdvancedFilterDialog from "@/components/codebook/filters/AdvancedFilterDialog";

const InsurersDirectory: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { hasPrivilege, user } = useAuth();
  
  const [formOpen, setFormOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  const {
    insurers,
    isLoading,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    handleClearFilter,
    getActiveFilterCount,
    addInsurer,
    resetFilters,
    pagination
  } = useInsurers();
  
  const {
    savedFilters,
    saveFilter,
    deleteFilter,
    parseFilterData,
    isSaving,
    isDeleting
  } = useSimpleSavedFilters('insurers', user?.id, user?.companyId);

  const handleViewDetails = (id: string) => {
    navigate(`/codebook/companies/${id}`);
  };

  const handleAddInsurer = () => {
    setFormOpen(true);
  };

  const handleImportInsurers = async (importedInsurers: Partial<import('@/types/codebook').Insurer>[]) => {
    try {
      let created = 0;
      let updated = 0;
      
      // Process each imported insurer
      for (const insurer of importedInsurers) {
        // In a real implementation, this would add or update insurers in the database
        // For now, we'll just increment our counters
        if (insurer.id) {
          // Update existing insurer
          updated++;
        } else {
          // Create new insurer
          created++;
        }
      }
      
      return { created, updated };
    } catch (error) {
      console.error("Error importing insurers:", error);
      throw error;
    }
  };

  const canAddInsurer = hasPrivilege('codebook.insurers.create');
  const canImportExport = hasPrivilege('codebook.insurers.import') || hasPrivilege('codebook.insurers.export');

  const getExportData = () => {
    return insurers.map(insurer => ({
      name: insurer.name,
      contact_person: insurer.contact_person || '',
      email: insurer.email || '',
      phone: insurer.phone || '',
      address: insurer.address || '',
      city: insurer.city || '',
      country: insurer.country || '',
      is_active: insurer.is_active ? 'Active' : 'Inactive'
    }));
  };

  const handleSaveFilter = (name: string) => {
    saveFilter(name);
  };

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("insuranceCompanies")}</h2>
          <p className="text-muted-foreground">
            {t("insuranceCompaniesDescription")}
          </p>
        </div>
        
        {/* Action Buttons */}
        <InsurersActionButtons
          onImport={handleImportInsurers}
          getExportData={getExportData}
          onAddInsurer={handleAddInsurer}
        />
      </div>

      <InsurersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilter={handleClearFilter}
        onOpenFilterDialog={() => setFilterDialogOpen(true)}
        activeFilterCount={getActiveFilterCount()}
        savedFilters={savedFilters}
        onSaveFilter={handleSaveFilter}
        onDeleteFilter={deleteFilter}
        isSaving={isSaving}
        isDeleting={isDeleting}
        parseFilterData={parseFilterData}
        showSavedFilters={true}
      />
      
      <DataTable
        data={insurers}
        columns={getInsurerColumns((id) => handleViewDetails(id))}
        isLoading={isLoading}
        emptyState={{
          title: t("noInsurersFound"),
          description: t("noInsurersFoundDescription"),
          action: canAddInsurer ? (
            <button
              onClick={handleAddInsurer}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {t("addInsurer")}
            </button>
          ) : undefined
        }}
        pagination={{
          currentPage: pagination.page,
          itemsPerPage: pagination.pageSize,
          totalItems: pagination.totalCount,
          totalPages: totalPages,
          onPageChange: pagination.setPage,
          onPageSizeChange: pagination.setPageSize,
          pageSizeOptions: [10, 25, 50, 100]
        }}
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
      
      {!canAddInsurer && !canImportExport && (
        <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg mt-4">
          <Info className="h-5 w-5 mr-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("noInsurersPrivileges")}</p>
        </div>
      )}
    </div>
  );
};

export default InsurersDirectory;
