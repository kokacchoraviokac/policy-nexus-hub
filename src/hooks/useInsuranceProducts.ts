
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { InsuranceProduct } from '@/types/codebook';
import { useToast } from '@/hooks/use-toast';

export function useInsuranceProducts(insurerId?: string) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['insurance_products', searchTerm, insurerId],
    queryFn: async () => {
      let query = supabase
        .from('insurance_products')
        .select(`
          *,
          insurers!inner(name)
        `);
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
      }
      
      if (insurerId) {
        query = query.eq('insurer_id', insurerId);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) {
        console.error('Error fetching insurance products:', error);
        toast({
          title: 'Error fetching insurance products',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      // Transform the data to match our interface
      return data.map(item => ({
        ...item,
        insurer_name: item.insurers.name
      })) as InsuranceProduct[];
    }
  });

  const addProduct = async (product: Omit<InsuranceProduct, 'id' | 'created_at' | 'updated_at' | 'insurer_name'>) => {
    try {
      const { data, error } = await supabase
        .from('insurance_products')
        .insert(product)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Insurance product added',
        description: `Successfully added product: ${product.name}`,
      });
      
      refetch();
      return data;
    } catch (error: any) {
      console.error('Error adding insurance product:', error);
      toast({
        title: 'Error adding insurance product',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Omit<InsuranceProduct, 'insurer_name'>>) => {
    try {
      const { error } = await supabase
        .from('insurance_products')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Insurance product updated',
        description: 'Product information has been updated successfully.',
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error updating insurance product:', error);
      toast({
        title: 'Error updating insurance product',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('insurance_products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Insurance product deleted',
        description: 'Product has been deleted successfully.',
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error deleting insurance product:', error);
      toast({
        title: 'Error deleting insurance product',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    products,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch
  };
}
