
import React from "react";
import { useNavigate } from "react-router-dom";
import { useInsuranceProducts } from "@/hooks/useInsuranceProducts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface InsurerProductsListProps {
  insurerId: string;
  onAddProduct?: () => void;
}

export const InsurerProductsList: React.FC<InsurerProductsListProps> = ({ 
  insurerId,
  onAddProduct
}) => {
  const navigate = useNavigate();
  const { products, isLoading, isError } = useInsuranceProducts(insurerId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        Failed to load products. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Insurance Products</h3>
        {onAddProduct && (
          <Button size="sm" onClick={onAddProduct}>
            <Plus className="h-4 w-4 mr-1" />
            Add Product
          </Button>
        )}
      </div>
      
      {products && products.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category || "-"}</TableCell>
                <TableCell>
                  <Badge variant={product.is_active ? "default" : "outline"}>
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/codebook/products/${product.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="p-8 text-center border rounded-md bg-muted/50">
          <p className="text-muted-foreground">No products associated with this insurer.</p>
          {onAddProduct && (
            <Button variant="outline" className="mt-4" onClick={onAddProduct}>
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Product
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
