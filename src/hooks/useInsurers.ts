
import { useInsurersFetch } from './insurers/useInsurersFetch';
import { useInsurersFilter } from './insurers/useInsurersFilter';
import { useInsurersCrud } from './insurers/useInsurersCrud';

export function useInsurers() {
  const { 
    insurers, 
    isLoading, 
    isError, 
    error, 
    searchTerm, 
    setSearchTerm, 
    refetch,
    pagination
  } = useInsurersFetch();

  const {
    filteredInsurers,
    filters,
    handleFilterChange,
    handleClearFilter,
    resetFilters,
    getActiveFilterCount
  } = useInsurersFilter(insurers);

  const {
    addInsurer,
    updateInsurer,
    deleteInsurer
  } = useInsurersCrud(refetch);

  return {
    insurers: filteredInsurers,
    allInsurers: insurers,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    handleClearFilter,
    resetFilters,
    getActiveFilterCount,
    addInsurer,
    updateInsurer,
    deleteInsurer,
    refetch,
    pagination
  };
}
