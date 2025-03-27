
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import DataTable from "@/components/ui/data-table";
import { useInsuranceProducts } from "@/hooks/useInsuranceProducts";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/auth/AuthContext";
import ProductFormDialog from "./dialogs/ProductFormDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsuranceProduct, CodebookFilterState } from "@/types/codebook";
import ImportExportButtons from "./ImportExportButtons";
import { useLanguage } from "@/contexts/LanguageContext";
import FilterButton from "./filters/FilterButton";
import AdvancedFilterDialog from "./filters/AdvancedFilterDialog";
import ActiveFilters from "./filters/ActiveFilters";

const ProductCodesDirectory = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { products, isLoading, searchTerm, setSearchTerm, deleteProduct, addProduct, updateProduct } = useInsuranceProducts();
  const { toast } = useToast();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
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
  }, [products, filters, searchTerm]);

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete);
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleAddProduct = () => {
    setSelectedProductId(undefined);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsProductFormOpen(true);
  };

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

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.category && filters.category.trim() !== '') count++;
    if (filters.insurer && filters.insurer.trim() !== '') count++;
    if (filters.createdAfter) count++;
    if (filters.createdBefore) count++;
    return count;
  };

  const handleImport = async (importedProducts: Partial<Omit<InsuranceProduct, 'insurer_name'>>[]) => {
    try {
      let created = 0;
      let updated = 0;
      
      for (const productData of importedProducts) {
        const existingProduct = products?.find(p => p.code === productData.code);
        
        if (existingProduct) {
          await updateProduct(existingProduct.id, productData as Partial<Omit<InsuranceProduct, 'insurer_name'>>);
          updated++;
        } else {
          await addProduct(productData as Omit<InsuranceProduct, 'id' | 'created_at' | 'updated_at' | 'insurer_name'>);
          created++;
        }
      }
      
      toast({
        title: t("importCompleted"),
        description: t("createdNewProducts").replace("{0}", created.toString()).replace("{1}", updated.toString()),
      });
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: t("importFailed"),
        description: t("importFailedDescription"),
        variant: "destructive"
      });
    }
  };

  const getExportData = () => {
    return filteredProducts.map(product => ({
      code: product.code,
      name: product.name,
      category: product.category || '',
      description: product.description || '',
      insurer_id: product.insurer_id,
      is_active: product.is_active,
    }));
  };

  const columns = [
    {
      header: t("code"),
      accessorKey: "code" as keyof InsuranceProduct,
      sortable: true
    },
    {
      header: t("name"),
      accessorKey: "name" as keyof InsuranceProduct,
      sortable: true
    },
    {
      header: t("category"),
      accessorKey: "category" as keyof InsuranceProduct,
      cell: (row: InsuranceProduct) => row.category || "-",
      sortable: true
    },
    {
      header: t("insurer"),
      accessorKey: "insurer_name" as keyof InsuranceProduct,
      sortable: true
    },
    {
      header: t("status"),
      accessorKey: "is_active" as keyof InsuranceProduct,
      cell: (row: InsuranceProduct) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? t("active") : t("inactive")}
        </Badge>
      ),
      sortable: true
    },
    {
      header: t("actions"),
      accessorKey: (row: InsuranceProduct) => (
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleEditProduct(row.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-destructive"
                onClick={() => setProductToDelete(row.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteProductConfirmation").replace("{0}", row.name)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProductToDelete(null)}>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("insuranceProductsDirectory")}</CardTitle>
          <CardDescription>
            {t("insuranceProductsDirectoryDescription")}
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <ImportExportButtons
            onImport={handleImport}
            getData={getExportData}
            entityName={t("insuranceProducts")}
          />
          <Button className="flex items-center gap-1" onClick={handleAddProduct}>
            <Plus className="h-4 w-4" /> {t("addProduct")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("searchProducts")}
            className="w-full sm:max-w-xs"
          />
          
          <div className="flex gap-2 items-center">
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange({ ...filters, status: value as 'all' | 'active' | 'inactive' })}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatus")}</SelectItem>
                <SelectItem value="active">{t("active")}</SelectItem>
                <SelectItem value="inactive">{t("inactive")}</SelectItem>
              </SelectContent>
            </Select>
            
            <FilterButton
              activeFilterCount={getActiveFilterCount()}
              onClick={() => setIsFilterDialogOpen(true)}
            />
          </div>
        </div>
        
        <ActiveFilters 
          filters={filters} 
          onClearFilter={handleClearFilter}
          filterLabels={{
            category: t("category"),
            insurer: t("insurer")
          }}
        />
        
        <DataTable
          data={filteredProducts || []}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            title: t("noProductsFound"),
            description: t("noProductsFound"),
            action: null
          }}
        />
      </CardContent>

      <ProductFormDialog 
        open={isProductFormOpen}
        onOpenChange={setIsProductFormOpen}
        productId={selectedProductId}
      />
      
      <AdvancedFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={filters}
        onApplyFilters={handleFilterChange}
        onResetFilters={resetFilters}
        filterOptions={{
          showStatus: true,
          showCategory: true,
          showInsurer: true,
          showCreatedDates: true
        }}
      />
    </Card>
  );
};

export default ProductCodesDirectory;
