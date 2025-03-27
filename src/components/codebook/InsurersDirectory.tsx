import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Info } from "lucide-react";
import { useInsurers } from "@/hooks/useInsurers";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrivilegeCheck } from "@/hooks/usePrivilegeCheck";
import { useSavedFilters } from "@/hooks/useSavedFilters";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { getInsurerColumns } from "@/components/codebook/insurers/InsurersTable";
import InsurersFilters from "@/components/codebook/insurers/InsurersFilters";
import ImportExportButtons from "@/components/codebook/ImportExportButtons";
import InsurerFormDialog from "@/components/codebook/dialogs/InsurerFormDialog";
import AdvancedFilterDialog from "@/components/codebook/filters/AdvancedFilterDialog";
import SaveFilterDialog from "@/components/codebook/filters/SaveFilterDialog";
import { CodebookFilterState, Insurer } from "@/types/codebook";

const InsurersDirectory: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { hasPrivilege } = usePrivilegeCheck();
  
  const [formOpen, setFormOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [saveFilterDialogOpen, setSaveFilterDialogOpen] = useState(false);
  
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
    deleteFilter
  } = useSavedFilters('insurers');

  const handleViewDetails = (id: string) => {
    navigate(`/codebook/companies/${id}`);
  };

  const handleAddInsurer = async (formData: any) => {
    try {
      const result = await addInsurer({
        name: formData.name,
        contact_person: formData.contactPerson || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        postal_code: formData.postalCode || null,
        country: formData.country || null,
        registration_number: formData.registrationNumber || null,
        is_active: formData.isActive,
        company_id: formData.companyId
      });
      
      if (result?.id) {
        setFormOpen(false);
      }
    } catch (error) {
      console.error("Error adding insurer:", error);
    }
  };
  
  const handleSaveFilter = async (name: string) => {
    await saveFilter(name, filters);
    setSaveFilterDialogOpen(false);
  };
  
  const handleDeleteFilter = async (filterId: string) => {
    await deleteFilter(filterId);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("insuranceCompanies")}</h2>
          <p className="text-muted-foreground">
            {t("insuranceCompaniesDescription")}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {canImportExport && (
            <ImportExportButtons
              getData={getExportData}
              entityName={t('insuranceCompanies')}
            />
          )}
          
          {canAddInsurer && (
            <Button onClick={() => setFormOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("addInsurer")}
            </Button>
          )}
        </div>
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
        onOpenSaveFilterDialog={() => setSaveFilterDialogOpen(true)}
        onDeleteFilter={handleDeleteFilter}
      />
      
      <DataTable
        data={insurers}
        columns={getInsurerColumns((id) => handleViewDetails(id))}
        isLoading={isLoading}
        emptyState={{
          title: t("noInsurersFound"),
          description: t("noInsurersFoundDescription"),
          action: canAddInsurer ? (
            <Button onClick={() => setFormOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("addInsurer")}
            </Button>
          ) : undefined
        }}
        pagination={{
          currentPage: pagination.page,
          pageSize: pagination.pageSize,
          totalItems: pagination.totalCount,
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
      
      <SaveFilterDialog
        open={saveFilterDialogOpen}
        onOpenChange={setSaveFilterDialogOpen}
        onSave={handleSaveFilter}
        filters={filters}
        entityType="insurers"
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
