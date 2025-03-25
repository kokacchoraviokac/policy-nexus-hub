
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import DataTable from "@/components/ui/data-table";
import { useInsuranceProducts } from "@/hooks/useInsuranceProducts";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuthSession } from "@/hooks/useAuthSession";

const ProductCodesDirectory = () => {
  const { user } = useAuthSession();
  const { products, isLoading, searchTerm, setSearchTerm, deleteProduct } = useInsuranceProducts();
  const { toast } = useToast();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete);
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const columns = [
    {
      header: "Code",
      accessorKey: "code",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (row) => row.category || "-",
    },
    {
      header: "Insurer",
      accessorKey: "insurer_name",
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: (row) => (
        <Badge variant={row.is_active ? "default" : "secondary"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: (row) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
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
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search products..."
          className="w-full md:max-w-xs"
        />
        
        <DataTable
          data={products || []}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            title: "No insurance products found",
            description: "Try adjusting your search or add a new product.",
            action: (
              <Button className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ProductCodesDirectory;
