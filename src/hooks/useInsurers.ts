
import { useInsurersFetch } from './insurers/useInsurersFetch';
import { useInsurersFilter } from './insurers/useInsurersFilter';
import { useInsurersCrud } from './insurers/useInsurersCrud';

type UseInsurersOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
};

export function useInsurers(options: UseInsurersOptions = {}) {
  const { 
    insurers, 
    isLoading, 
    isError, 
    error, 
    searchTerm, 
    setSearchTerm, 
    refetch,
    pagination
  } = useInsurersFetch(options);

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
    insurers: filteredInsurers || [],
    allInsurers: insurers || [],
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
    createInsurer: addInsurer,
    updateInsurer,
    deleteInsurer,
    refreshInsurers: refetch,
    pagination,
    totalItems: pagination.totalCount,
    totalPages: Math.ceil(pagination.totalCount / pagination.pageSize)
  };
}
