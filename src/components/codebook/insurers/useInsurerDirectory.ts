
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInsurers } from "@/hooks/useInsurers";
import { usePrivilegeCheck } from "@/hooks/usePrivilegeCheck";
import { useSimpleSavedFilters } from "@/hooks/useSimpleSavedFilters";
import { useAuth } from "@/contexts/AuthContext";
import { Insurer } from "@/types/codebook";

export function useInsurerDirectory() {
  const navigate = useNavigate();
  const { hasPrivilege } = usePrivilegeCheck();
  const { user } = useAuth();
  
  // UI state
  const [formOpen, setFormOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  // Fetch and filter insurers
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
  
  // Saved filters
  const {
    savedFilters,
    saveFilter,
    deleteFilter,
    parseFilterData,
    isSaving,
    isDeleting
  } = useSimpleSavedFilters('insurers', user?.id || '', user?.companyId || '');

  // Navigate to insurer details
  const handleViewDetails = (id: string) => {
    navigate(`/codebook/companies/${id}`);
  };

  // Add new insurer
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

  // Check privileges
  const canAddInsurer = hasPrivilege('codebook.insurers.create');
  const canImportExport = hasPrivilege('codebook.insurers.import') || hasPrivilege('codebook.insurers.export');

  // Prepare data for export
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

  return {
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
  };
}
