
import { useState, useEffect } from 'react';
import type { Insurer, CodebookFilterState } from '@/types/codebook';

export function useInsurersFilter(insurers: Insurer[] | undefined) {
  const [filters, setFilters] = useState<CodebookFilterState>({
    status: 'all',
    country: ''
  });
  const [filteredInsurers, setFilteredInsurers] = useState<Insurer[]>([]);

  // Apply filters to insurers
  useEffect(() => {
    if (!insurers) return;
    
    let filtered = [...insurers];
    
    // Filter by status
    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      filtered = filtered.filter(insurer => insurer.is_active === isActive);
    }
    
    // Filter by country
    if (filters.country && filters.country.trim() !== '') {
      filtered = filtered.filter(insurer => 
        insurer.country && insurer.country.toLowerCase().includes(filters.country!.toLowerCase())
      );
    }
    
    // Filter by city
    if (filters.city && filters.city.trim() !== '') {
      filtered = filtered.filter(insurer => 
        insurer.city && insurer.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    
    // Filter by date created (after)
    if (filters.createdAfter) {
      filtered = filtered.filter(insurer => {
        const createdAt = new Date(insurer.created_at);
        return createdAt >= filters.createdAfter!;
      });
    }
    
    // Filter by date created (before)
    if (filters.createdBefore) {
      filtered = filtered.filter(insurer => {
        const createdAt = new Date(insurer.created_at);
        return createdAt <= filters.createdBefore!;
      });
    }
    
    setFilteredInsurers(filtered);
  }, [insurers, filters]);

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

  return {
    filteredInsurers,
    filters,
    handleFilterChange,
    handleClearFilter,
    resetFilters,
    getActiveFilterCount
  };
}
