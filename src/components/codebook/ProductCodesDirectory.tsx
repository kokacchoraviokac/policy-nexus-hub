
import React, { useState } from "react";
import { useInsuranceProducts } from "@/hooks/useInsuranceProducts";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/AuthContext";
import ProductFormDialog from "./dialogs/ProductFormDialog";
import AdvancedFilterDialog from "./filters/AdvancedFilterDialog";
import ActiveFilters from "./filters/ActiveFilters";
import ProductsTable from "./products/ProductsTable";
import ProductsActionBar from "./products/ProductsActionBar";
import ProductsFilterBar from "./products/ProductsFilterBar";
import { useProductCodesFiltering } from "./products/useProductCodesFiltering";
import { useLanguage } from "@/contexts/LanguageContext";

const ProductCodesDirectory = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { products, isLoading, searchTerm, setSearchTerm, deleteProduct, addProduct, updateProduct } = useInsuranceProducts();
  const { toast } = useToast();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  const {
    filters,
    filteredProducts,
    handleFilterChange,
    handleClearFilter,
    resetFilters,
    getActiveFilterCount
  } = useProductCodesFiltering(products);

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

  const handleImport = async (importedProducts: any[]) => {
    try {
      let created = 0;
      let updated = 0;
      
      for (const productData of importedProducts) {
        const existingProduct = products?.find(p => p.code === productData.code);
        
        if (existingProduct) {
          await updateProduct(existingProduct.id, productData);
          updated++;
        } else {
          await addProduct(productData);
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

  return (
    <div className="space-y-6">
      <ProductsActionBar 
        onAddProduct={handleAddProduct}
        onImport={handleImport}
        getExportData={getExportData}
      />
      
      <ProductsFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        activeFilterCount={getActiveFilterCount()}
        onOpenFilterDialog={() => setIsFilterDialogOpen(true)}
      />
      
      <ActiveFilters 
        filters={filters} 
        onClearFilter={handleClearFilter}
        filterLabels={{
          category: t("category"),
          insurer: t("insurer")
        }}
      />
      
      <ProductsTable 
        products={filteredProducts}
        isLoading={isLoading}
        onEdit={handleEditProduct}
        onDelete={(id) => setProductToDelete(id)}
        setProductToDelete={setProductToDelete}
        productToDelete={productToDelete}
        handleDelete={handleDelete}
      />

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
        entityType="products"
        filterOptions={{
          showStatus: true,
          showCategory: true,
          showInsurer: true,
          showCreatedDates: true
        }}
      />
    </div>
  );
};

export default ProductCodesDirectory;
