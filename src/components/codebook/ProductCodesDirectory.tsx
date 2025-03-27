
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash, Filter } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import DataTable from "@/components/ui/data-table";
import { useInsuranceProducts } from "@/hooks/useInsuranceProducts";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/auth/AuthContext";
import ProductFormDialog from "./dialogs/ProductFormDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { InsuranceProduct } from "@/types/codebook";
import ImportExportButtons from "./ImportExportButtons";
import { useLanguage } from "@/contexts/LanguageContext";

const ProductCodesDirectory = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { products, isLoading, searchTerm, setSearchTerm, deleteProduct, addProduct, updateProduct } = useInsuranceProducts();
  const { toast } = useToast();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  
  const [filteredProducts, setFilteredProducts] = useState<InsuranceProduct[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [insurerFilter, setInsurerFilter] = useState<string>("");

  useEffect(() => {
    if (!products) return;
    
    let filtered = [...products];
    
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter(product => product.is_active === isActive);
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }
    
    if (insurerFilter) {
      filtered = filtered.filter(product => 
        product.insurer_name && product.insurer_name.toLowerCase().includes(insurerFilter.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, statusFilter, categoryFilter, insurerFilter, searchTerm]);

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

  const resetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("");
    setInsurerFilter("");
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
              value={statusFilter}
              onValueChange={setStatusFilter}
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
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  {t("filters")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">{t("filterProducts")}</h4>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">{t("category")}</Label>
                    <Input 
                      id="category" 
                      placeholder={t("filterByCategory")}
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="insurer">{t("insurer")}</Label>
                    <Input 
                      id="insurer" 
                      placeholder={t("filterByInsurer")}
                      value={insurerFilter}
                      onChange={(e) => setInsurerFilter(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      {t("resetFilters")}
                    </Button>
                    <Button size="sm">{t("apply")}</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
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
    </Card>
  );
};

export default ProductCodesDirectory;
