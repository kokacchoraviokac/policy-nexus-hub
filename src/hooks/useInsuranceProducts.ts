
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { InsuranceProduct } from '@/types/codebook';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export function useInsuranceProducts(insurerId?: string) {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['insurance_products', searchTerm, insurerId, language],
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
      
      // Transform the data to match our interface and apply translations
      return data.map(item => {
        const product = {
          ...item,
          insurer_name: item.insurers.name
        } as InsuranceProduct;
        
        // Apply translations if available for the current language
        if (language !== 'en' && product.name_translations && product.name_translations[language]) {
          product.name = product.name_translations[language];
        }
        
        if (language !== 'en' && product.category_translations && product.category_translations[language]) {
          product.category = product.category_translations[language];
        }
        
        if (language !== 'en' && product.description_translations && product.description_translations[language]) {
          product.description = product.description_translations[language];
        }
        
        return product;
      });
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
