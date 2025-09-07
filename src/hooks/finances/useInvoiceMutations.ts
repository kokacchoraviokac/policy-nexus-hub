
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { updateInvoiceStatusFn } from "@/components/finances/invoices/UpdateInvoiceStatusDialog";

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
  invoice_type?: 'domestic' | 'foreign';
  invoice_category?: 'automatic' | 'manual';
  calculation_reference?: string;
}

interface UpdateInvoiceStatusParams {
  invoiceId: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
}

// Function to create an invoice
const createInvoiceFn = async (params: CreateInvoiceParams, user: any) => {
  try {
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
        invoice_type: params.invoice_type,
        invoice_category: params.invoice_category,
        calculation_reference: params.calculation_reference,
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

  // Mutation to create an invoice
  const createInvoiceMutation = useMutation({
    mutationFn: (params: CreateInvoiceParams) => createInvoiceFn(params, user),
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

  // Mutation to create an invoice from commission
  const createInvoiceFromCommissionMutation = useMutation({
    mutationFn: async ({ commissionId, policyId }: { commissionId: string, policyId: string }) => {
      try {
        // Fetch commission details
        const { data: commission, error: commissionError } = await supabase
          .from('commissions')
          .select('*')
          .eq('id', commissionId)
          .single();
        
        if (commissionError) throw commissionError;
        
        // Fetch policy details
        const { data: policy, error: policyError } = await supabase
          .from('policies')
          .select('*')
          .eq('id', policyId)
          .single();
        
        if (policyError) throw policyError;
        
        // Create invoice
        const invoiceParams: CreateInvoiceParams = {
          invoice_number: `INV-${new Date().getTime().toString().slice(-6)}`,
          entity_type: 'insurer',
          entity_name: policy.insurer_name,
          entity_id: policy.insurer_id,
          issue_date: new Date().toISOString(),
          due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
          currency: policy.currency || 'EUR',
          total_amount: commission.calculated_amount,
          notes: `Auto-generated invoice for commission on policy ${policy.policy_number}`,
          status: 'draft',
          invoice_type: 'domestic',
          invoice_category: 'automatic',
          calculation_reference: `COM-${commissionId.slice(-6)}`,
          invoice_items: [
            {
              description: `Commission for policy ${policy.policy_number} - ${policy.policyholder_name}`,
              amount: commission.calculated_amount,
              policy_id: policyId,
              commission_id: commissionId
            }
          ]
        };
        
        return await createInvoiceFn(invoiceParams, user);
      } catch (error) {
        console.error("Error creating invoice from commission:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      toast({
        title: t("invoiceCreated"),
        description: t("invoiceFromCommissionSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error creating invoice from commission:", error);
      toast({
        title: t("errorCreatingInvoice"),
        description: t("errorCreatingInvoiceFromCommissionDescription"),
        variant: "destructive",
      });
    },
  });

  // Mutation to update invoice status
  const updateInvoiceStatusMutation = useMutation({
    mutationFn: async ({ invoiceId, status }: UpdateInvoiceStatusParams) => {
      return updateInvoiceStatusFn(invoiceId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: t("invoiceUpdated"),
        description: t("invoiceStatusUpdatedSuccess"),
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
    createInvoiceFromCommission: createInvoiceFromCommissionMutation.mutate,
    updateInvoiceStatus: updateInvoiceStatusMutation.mutate,
    isCreating: createInvoiceMutation.isPending,
    isCreatingFromCommission: createInvoiceFromCommissionMutation.isPending,
    isUpdating: updateInvoiceStatusMutation.isPending,
  };
};
