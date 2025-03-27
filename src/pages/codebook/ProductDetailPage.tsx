
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Book, Tag, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EntityDetailsCard } from "@/components/codebook/details/EntityDetailsCard";
import { InfoGrid, InfoItem } from "@/components/codebook/details/InfoItem";
import { ActivityLog } from "@/components/codebook/details/ActivityLog";
import { InsuranceProduct } from "@/types/codebook";
import { exportToCSV } from "@/utils/csv";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/codebook/forms/ProductForm";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_products')
        .select(`
          *,
          insurers!inner(name)
        `)
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        insurer_name: data.insurers.name
      } as InsuranceProduct;
    }
  });

  // Mock activity data - in a real app, this would be fetched from the database
  const activityData = [
    {
      id: '1',
      action: 'Updated product details',
      timestamp: new Date().toISOString(),
      user: 'Jane Smith',
      details: 'Updated description and category'
    },
    {
      id: '2',
      action: 'Created product record',
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'John Doe'
    }
  ];

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading product details...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <h3 className="text-lg font-semibold">Error loading product details</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-8 w-8 mb-2" />
        <h3 className="text-lg font-semibold">Product not found</h3>
        <p>The insurance product you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/codebook/products')}>
          Return to Products Directory
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('insurance_products')
        .delete()
        .eq('id', product.id);
      
      if (error) throw error;
      
      toast({
        title: 'Product deleted',
        description: `${product.name} has been removed from the system`,
      });
      
      navigate('/codebook/products');
    } catch (err: any) {
      toast({
        title: 'Error deleting product',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    try {
      // Create a version without the joined insurer_name for export
      const exportData = {
        ...product,
        insurer_name: undefined
      };
      
      exportToCSV([exportData], `product_${product.id}_${new Date().toISOString().split('T')[0]}.csv`);
      
      toast({
        title: 'Export successful',
        description: `Product data exported to CSV`,
      });
    } catch (error: any) {
      toast({
        title: 'Export failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    refetch();
    toast({
      title: 'Product updated',
      description: 'Product information has been updated successfully',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Book className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Codebook</h1>
        <span className="text-muted-foreground">/</span>
        <div className="flex items-center space-x-1">
          <Tag className="h-5 w-5" />
          <span className="font-medium">Insurance Product Details</span>
        </div>
      </div>
      
      <EntityDetailsCard
        title={product.name}
        subtitle={`Code: ${product.code}`}
        backLink="/codebook/products"
        backLinkLabel="Products Directory"
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onExport={handleExport}
        tabs={[
          {
            id: 'details',
            label: 'Details',
            content: (
              <InfoGrid>
                <InfoItem label="Code" value={product.code} />
                <InfoItem label="Name" value={product.name} />
                <InfoItem label="Category" value={product.category} />
                <InfoItem label="Insurance Company" value={product.insurer_name} />
                <InfoItem label="Active" value={product.is_active} />
                {product.description && (
                  <div className="col-span-full mt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                    <div className="p-3 bg-muted rounded-md">
                      {product.description}
                    </div>
                  </div>
                )}
              </InfoGrid>
            )
          },
          {
            id: 'activity',
            label: 'Activity History',
            content: <ActivityLog items={activityData} />
          }
        ]}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Insurance Product</DialogTitle>
            <DialogDescription>
              Make changes to the product information below.
            </DialogDescription>
          </DialogHeader>
          {product && (
            <ProductForm 
              defaultValues={{
                code: product.code,
                name: product.name,
                category: product.category || "",
                description: product.description || "",
                is_active: product.is_active,
                insurer_id: product.insurer_id,
              }}
              onSubmit={(values) => {
                // In a real app, this would update the product data
                console.log("Updated product values:", values);
                handleEditSuccess();
              }}
              onCancel={() => setIsEditDialogOpen(false)}
              isSubmitting={false}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Insurance Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-medium">{product.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
