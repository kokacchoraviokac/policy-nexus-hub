
import { useState, useEffect } from "react";
import { InsuranceProduct, CodebookFilterState } from "@/types/codebook";

export function useProductCodesFiltering(products: InsuranceProduct[] | undefined) {
  const [filters, setFilters] = useState<CodebookFilterState>({
    status: 'all',
    category: '',
    insurer: ''
  });
  
  const [filteredProducts, setFilteredProducts] = useState<InsuranceProduct[]>([]);

  useEffect(() => {
    if (!products) return;
    
    let filtered = [...products];
    
    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      filtered = filtered.filter(product => product.is_active === isActive);
    }
    
    if (filters.category && filters.category.trim() !== '') {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }
    
    if (filters.insurer && filters.insurer.trim() !== '') {
      filtered = filtered.filter(product => 
        product.insurer_name && product.insurer_name.toLowerCase().includes(filters.insurer!.toLowerCase())
      );
    }
    
    if (filters.createdAfter) {
      filtered = filtered.filter(product => {
        const createdAt = new Date(product.created_at);
        return createdAt >= filters.createdAfter!;
      });
    }
    
    if (filters.createdBefore) {
      filtered = filtered.filter(product => {
        const createdAt = new Date(product.created_at);
        return createdAt <= filters.createdBefore!;
      });
    }
    
    setFilteredProducts(filtered);
  }, [products, filters]);

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
      category: '',
      insurer: ''
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.category && filters.category.trim() !== '') count++;
    if (filters.insurer && filters.insurer.trim() !== '') count++;
    if (filters.createdAfter) count++;
    if (filters.createdBefore) count++;
    return count;
  };

  return {
    filters,
    filteredProducts,
    handleFilterChange,
    handleClearFilter,
    resetFilters,
    getActiveFilterCount
  };
}
