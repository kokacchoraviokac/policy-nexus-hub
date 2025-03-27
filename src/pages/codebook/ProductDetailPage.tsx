
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Book, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EntityDetailsCard } from "@/components/codebook/details/EntityDetailsCard";
import { InsuranceProduct } from "@/types/codebook";
import { exportToCSV } from "@/utils/csv";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationDialog from "@/components/codebook/dialogs/DeleteConfirmationDialog";
import EditProductDialog from "@/components/codebook/dialogs/EditProductDialog";
import EntityNotFound from "@/components/codebook/details/EntityNotFound";
import EntityLoadError from "@/components/codebook/details/EntityLoadError";
import ProductDetailTabs from "@/components/codebook/products/ProductDetailTabs";

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

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('insurance_products')
        .delete()
        .eq('id', product!.id);
      
      if (error) throw error;
      
      toast({
        title: 'Product deleted',
        description: `${product!.name} has been removed from the system`,
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
      if (!product) return;
      
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

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading product details...</div>;
  }

  if (error) {
    return <EntityLoadError entityType="Product" error={error as Error} />;
  }

  if (!product) {
    return <EntityNotFound entityType="Product" backPath="/codebook/products" backLabel="Products Directory" />;
  }

  const tabs = ProductDetailTabs({ product, activityData });

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
        tabs={tabs}
      />

      <EditProductDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        product={product}
        onSubmit={() => handleEditSuccess()}
        isSubmitting={false}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        entityName="Insurance Product"
        entityTitle={product.name}
      />
    </div>
  );
}
