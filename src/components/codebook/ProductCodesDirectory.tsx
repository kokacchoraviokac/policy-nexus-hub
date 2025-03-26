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

const ProductCodesDirectory = () => {
  const { user } = useAuth();
  const { products, isLoading, searchTerm, setSearchTerm, deleteProduct, addProduct, updateProduct } = useInsuranceProducts();
  const { toast } = useToast();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  
  // New state for filters
  const [filteredProducts, setFilteredProducts] = useState<InsuranceProduct[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [insurerFilter, setInsurerFilter] = useState<string>("");

  useEffect(() => {
    if (!products) return;
    
    let filtered = [...products];
    
    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter(product => product.is_active === isActive);
    }
    
    // Apply category filter if specified
    if (categoryFilter) {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }
    
    // Apply insurer filter if specified
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

  // Data Import function
  const handleImport = async (importedProducts: Partial<Omit<InsuranceProduct, 'insurer_name'>>[]) => {
    try {
      // Track how many were created and updated
      let created = 0;
      let updated = 0;
      
      for (const productData of importedProducts) {
        // Check if product with same code exists
        const existingProduct = products?.find(p => p.code === productData.code);
        
        if (existingProduct) {
          // Update existing product
          await updateProduct(existingProduct.id, productData as Partial<Omit<InsuranceProduct, 'insurer_name'>>);
          updated++;
        } else {
          // Add new product
          await addProduct(productData as Omit<InsuranceProduct, 'id' | 'created_at' | 'updated_at' | 'insurer_name'>);
          created++;
        }
      }
      
      toast({
        title: "Import completed",
        description: `Created ${created} new products and updated ${updated} existing products.`,
      });
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: "Import failed",
        description: "There was an error processing the imported data.",
        variant: "destructive"
      });
    }
  };

  // Data Export function
  const getExportData = () => {
    // Return data to export - can be filtered or all products
    return filteredProducts.map(product => ({
      code: product.code,
      name: product.name,
      category: product.category || '',
      description: product.description || '',
      insurer_id: product.insurer_id,
      insurer_name: product.insurer_name,
      is_active: product.is_active ? 'Yes' : 'No'
    }));
  };

  const columns = [
    {
      header: "Code",
      accessorKey: "code" as keyof InsuranceProduct,
      sortable: true
    },
    {
      header: "Name",
      accessorKey: "name" as keyof InsuranceProduct,
      sortable: true
    },
    {
      header: "Category",
      accessorKey: "category" as keyof InsuranceProduct,
      cell: (row: InsuranceProduct) => row.category || "-",
      sortable: true
    },
    {
      header: "Insurer",
      accessorKey: "insurer_name" as keyof InsuranceProduct,
      sortable: true
    },
    {
      header: "Status",
      accessorKey: "is_active" as keyof InsuranceProduct,
      cell: (row: InsuranceProduct) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
      sortable: true
    },
    {
      header: "Actions",
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
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the product "{row.name}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
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
          <CardTitle>Insurance Products</CardTitle>
          <CardDescription>
            Manage product codes for different types of insurance
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <ImportExportButtons
            onImport={handleImport}
            getData={getExportData}
            entityName="Products"
          />
          <Button className="flex items-center gap-1" onClick={handleAddProduct}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search products..."
            className="w-full sm:max-w-xs"
          />
          
          <div className="flex gap-2 items-center">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Products</h4>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category" 
                      placeholder="Filter by category"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="insurer">Insurer</Label>
                    <Input 
                      id="insurer" 
                      placeholder="Filter by insurer"
                      value={insurerFilter}
                      onChange={(e) => setInsurerFilter(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <Button size="sm">Apply</Button>
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
            title: "No insurance products found",
            description: "Try adjusting your search or add a new product.",
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
