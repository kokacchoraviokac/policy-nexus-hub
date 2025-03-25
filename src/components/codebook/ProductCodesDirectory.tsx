
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ProductCodesDirectory = () => {
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
      <CardContent>
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground text-center py-6">
            Insurance products and codes will be displayed here. You'll be able to define and categorize insurance products.
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Each product record includes code, name, category, and can be linked to specific insurers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCodesDirectory;
