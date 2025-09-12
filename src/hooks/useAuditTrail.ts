import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface AuditLogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  company_id: string;
  details: Json;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface AuditTrailFilters {
  entity_type?: string;
  entity_id?: string;
  user_id?: string;
  action?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export const useAuditTrail = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch audit logs with filters
  const useAuditLogs = (filters: AuditTrailFilters = {}) => {
    return useQuery({
      queryKey: ['audit-logs', filters],
      queryFn: async () => {
        let query = supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (filters.entity_type) {
          query = query.eq('entity_type', filters.entity_type);
        }

        if (filters.entity_id) {
          query = query.eq('entity_id', filters.entity_id);
        }

        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id);
        }

        if (filters.action) {
          query = query.eq('action', filters.action);
        }

        if (filters.date_from) {
          query = query.gte('created_at', filters.date_from);
        }

        if (filters.date_to) {
          query = query.lte('created_at', filters.date_to);
        }

        if (filters.limit) {
          query = query.limit(filters.limit);
        }

        if (filters.offset) {
          query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as AuditLogEntry[];
      }
    });
  };

  // Create audit log entry
  const createAuditLog = useMutation({
    mutationFn: async ({
      action,
      entity_type,
      entity_id,
      company_id,
      details = {},
      ip_address,
      user_agent
    }: {
      action: string;
      entity_type: string;
      entity_id: string;
      company_id: string;
      details?: Json;
      ip_address?: string;
      user_agent?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('activity_logs')
        .insert({
          action,
          entity_type,
          entity_id,
          user_id: user.id,
          company_id,
          details,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch audit logs
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
    onError: (error) => {
      console.error('Failed to create audit log:', error);
      toast({
        title: "Audit Log Error",
        description: "Failed to record audit entry",
        variant: "destructive",
      });
    }
  });

  // Helper functions for common audit actions
  const logPolicyAction = (action: string, policyId: string, companyId: string, details: Json = {}) => {
    return createAuditLog.mutate({
      action,
      entity_type: 'policy',
      entity_id: policyId,
      company_id: companyId,
      details
    });
  };

  const logSalesAction = (action: string, salesProcessId: string, companyId: string, details: Json = {}) => {
    return createAuditLog.mutate({
      action,
      entity_type: 'sales_process',
      entity_id: salesProcessId,
      company_id: companyId,
      details
    });
  };

  const logQuoteAction = (action: string, quoteId: string, companyId: string, details: Json = {}) => {
    return createAuditLog.mutate({
      action,
      entity_type: 'sales_quote',
      entity_id: quoteId,
      company_id: companyId,
      details
    });
  };

  const logDocumentAction = (action: string, documentId: string, companyId: string, details: Json = {}) => {
    return createAuditLog.mutate({
      action,
      entity_type: 'document',
      entity_id: documentId,
      company_id: companyId,
      details
    });
  };

  const logSignatureAction = (action: string, policyId: string, companyId: string, details: Json = {}) => {
    return createAuditLog.mutate({
      action: `signature_${action}`,
      entity_type: 'policy_signature',
      entity_id: policyId,
      company_id: companyId,
      details
    });
  };

  return {
    useAuditLogs,
    createAuditLog,
    logPolicyAction,
    logSalesAction,
    logQuoteAction,
    logDocumentAction,
    logSignatureAction
  };
};