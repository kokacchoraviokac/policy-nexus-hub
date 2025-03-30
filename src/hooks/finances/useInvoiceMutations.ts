
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";

interface InvoiceItem {
  description: string;
  amount: number;
  policy_id?: string;
  commission_id?: string;
}

interface CreateInvoiceParams {
  invoice_number: string;
  entity_type: string;
  entity_name: string;
  entity_id?: string;
  issue_date: string;
  due_date: string;
  currency: string;
  total_amount: number;
  notes?: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  invoice_items: InvoiceItem[];
}

interface UpdateInvoiceStatusParams {
  invoiceId: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
}

// Function to create an invoice
export const createInvoice = async (params: CreateInvoiceParams) => {
  try {
    // Get user from auth context
    const { user } = useContext(AuthContext);
    const companyId = user?.companyId;

    if (!companyId) {
      throw new Error("Company ID not found");
    }

    // First, create the invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        invoice_number: params.invoice_number,
        entity_type: params.entity_type,
        entity_name: params.entity_name,
        entity_id: params.entity_id,
        issue_date: params.issue_date,
        due_date: params.due_date,
        currency: params.currency,
        total_amount: params.total_amount,
        notes: params.notes,
        status: params.status,
        company_id: companyId,
      })
      .select('id')
      .single();

    if (invoiceError) throw invoiceError;

    // Then, create invoice items
    const invoiceId = invoice.id;
    
    const invoiceItems = params.invoice_items.map(item => ({
      invoice_id: invoiceId,
      description: item.description,
      amount: item.amount,
      policy_id: item.policy_id,
      commission_id: item.commission_id,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) throw itemsError;

    return { id: invoiceId };
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// Hook for invoice mutations
export const useInvoiceMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);
  const companyId = user?.companyId;

  // Mutation to create an invoice
  const createInvoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: t("invoiceCreated"),
        description: t("invoiceCreatedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error creating invoice:", error);
      toast({
        title: t("errorCreatingInvoice"),
        description: t("errorCreatingInvoiceDescription"),
        variant: "destructive",
      });
    },
  });

  // Mutation to update invoice status
  const updateInvoiceStatusMutation = useMutation({
    mutationFn: async ({ invoiceId, status }: UpdateInvoiceStatusParams) => {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', invoiceId)
        .eq('company_id', companyId);

      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: t("invoiceUpdated"),
        description: t("invoiceUpdatedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error updating invoice status:", error);
      toast({
        title: t("errorUpdatingInvoice"),
        description: t("errorUpdatingInvoiceDescription"),
        variant: "destructive",
      });
    },
  });

  return {
    createInvoice: createInvoiceMutation.mutate,
    updateInvoiceStatus: updateInvoiceStatusMutation.mutate,
    isCreating: createInvoiceMutation.isPending,
    isUpdating: updateInvoiceStatusMutation.isPending,
  };
};
