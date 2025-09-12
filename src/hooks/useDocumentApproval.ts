import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DocumentApproval,
  ApprovalWorkflow,
  CreateApprovalRequest,
  UpdateApprovalRequest,
  ApprovalActionRequest,
  ApprovalFilters,
  ApprovalHistory,
  ApprovalStatus,
  validateApprovalWorkflow
} from '@/types/document-approval';

export const useDocumentApproval = (filters: ApprovalFilters = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Fetch document approvals with filters
  const {
    data: approvals = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['document-approvals', filters],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // For now, we'll create mock data since the approval tables don't exist yet
      // In production, this would query the actual approval tables
      const mockApprovals: DocumentApproval[] = [
        {
          id: 'approval-1',
          document_id: 'doc-1',
          document_name: 'Policy Contract - ABC Insurance',
          document_type: 'policy',
          entity_type: 'policy',
          entity_id: 'policy-1',
          status: 'pending',
          approval_level: 'basic',
          required_approvals: 1,
          current_approvals: 0,
          priority: 'high',
          due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          company_id: 'company-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'approval-2',
          document_id: 'doc-2',
          document_name: 'Claim Evidence - Vehicle Damage',
          document_type: 'claim_evidence',
          entity_type: 'claim',
          entity_id: 'claim-1',
          status: 'under_review',
          reviewer_id: user.id,
          reviewer_name: 'Current User',
          approval_level: 'basic',
          required_approvals: 1,
          current_approvals: 0,
          priority: 'medium',
          due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          company_id: 'company-1',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'approval-3',
          document_id: 'doc-3',
          document_name: 'Sales Proposal - XYZ Corp',
          document_type: 'proposal',
          entity_type: 'sales_process',
          entity_id: 'sales-1',
          status: 'approved',
          reviewer_id: 'reviewer-1',
          reviewer_name: 'John Reviewer',
          reviewed_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          comments: 'Approved after review. All requirements met.',
          approval_level: 'final',
          required_approvals: 1,
          current_approvals: 1,
          priority: 'low',
          company_id: 'company-1',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Apply filters to mock data
      let filteredApprovals = mockApprovals;

      if (filters.status) {
        filteredApprovals = filteredApprovals.filter(approval => approval.status === filters.status);
      }

      if (filters.reviewer_id) {
        filteredApprovals = filteredApprovals.filter(approval => approval.reviewer_id === filters.reviewer_id);
      }

      if (filters.entity_type) {
        filteredApprovals = filteredApprovals.filter(approval => approval.entity_type === filters.entity_type);
      }

      if (filters.priority) {
        filteredApprovals = filteredApprovals.filter(approval => approval.priority === filters.priority);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredApprovals = filteredApprovals.filter(approval => 
          approval.document_name.toLowerCase().includes(searchLower) ||
          approval.document_type.toLowerCase().includes(searchLower) ||
          approval.comments?.toLowerCase().includes(searchLower)
        );
      }

      return filteredApprovals;
    },
    enabled: !!user?.id
  });

  // Create document approval
  const createApproval = useMutation({
    mutationFn: async (approvalData: CreateApprovalRequest) => {
      if (!user?.id) throw new Error('User not authenticated');

      // In production, this would create an actual approval record
      const newApproval: DocumentApproval = {
        id: `approval-${Date.now()}`,
        document_id: approvalData.document_id,
        document_name: 'New Document',
        document_type: 'policy',
        entity_type: 'policy',
        entity_id: 'entity-1',
        status: 'pending',
        approval_level: 'basic',
        required_approvals: 1,
        current_approvals: 0,
        priority: approvalData.priority || 'medium',
        due_date: approvalData.due_date,
        comments: approvalData.comments,
        company_id: 'company-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return newApproval;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-approvals'] });
      toast({
        title: t('approvalCreated'),
        description: t('documentApprovalCreatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error creating document approval:', error);
      toast({
        title: t('errorCreatingApproval'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Update document approval
  const updateApproval = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateApprovalRequest }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-approvals'] });
      toast({
        title: t('approvalUpdated'),
        description: t('documentApprovalUpdatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error updating document approval:', error);
      toast({
        title: t('errorUpdatingApproval'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Perform approval action (approve, reject, etc.)
  const performApprovalAction = useMutation({
    mutationFn: async (actionData: ApprovalActionRequest) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Simulate approval action processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      let newStatus: ApprovalStatus;
      switch (actionData.action) {
        case 'approve':
          newStatus = 'approved';
          break;
        case 'reject':
          newStatus = 'rejected';
          break;
        case 'request_changes':
          newStatus = 'needs_review';
          break;
        case 'escalate':
          newStatus = 'under_review';
          break;
        default:
          newStatus = 'pending';
      }

      return {
        approval_id: actionData.approval_id,
        action: actionData.action,
        new_status: newStatus,
        comments: actionData.comments,
        reviewer_id: user.id,
        reviewed_at: new Date().toISOString()
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['document-approvals'] });
      
      const actionMessages = {
        approve: t('documentApproved'),
        reject: t('documentRejected'),
        request_changes: t('changesRequested'),
        escalate: t('approvalEscalated')
      };
      
      toast({
        title: actionMessages[data.action] || t('approvalActionCompleted'),
        description: t('approvalStatusUpdatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error performing approval action:', error);
      toast({
        title: t('errorPerformingApprovalAction'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Assign reviewer to approval
  const assignReviewer = useMutation({
    mutationFn: async ({ approvalId, reviewerId }: { approvalId: string; reviewerId: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Simulate reviewer assignment
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { approvalId, reviewerId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-approvals'] });
      toast({
        title: t('reviewerAssigned'),
        description: t('reviewerAssignedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error assigning reviewer:', error);
      toast({
        title: t('errorAssigningReviewer'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  // Get approval history for a document
  const useApprovalHistory = (documentId: string) => {
    return useQuery({
      queryKey: ['approval-history', documentId],
      queryFn: async () => {
        if (!documentId) return [];

        // Mock approval history data
        const mockHistory: ApprovalHistory[] = [
          {
            id: 'history-1',
            document_id: documentId,
            approval_id: 'approval-1',
            action: 'approve',
            reviewer_id: 'reviewer-1',
            reviewer_name: 'John Reviewer',
            comments: 'Document meets all requirements',
            previous_status: 'pending',
            new_status: 'approved',
            created_at: new Date().toISOString()
          }
        ];

        return mockHistory;
      },
      enabled: !!documentId
    });
  };

  // Get pending approvals for current user
  const getPendingApprovals = useCallback(() => {
    return approvals.filter(approval => 
      approval.status === 'pending' && 
      (!approval.reviewer_id || approval.reviewer_id === user?.id)
    );
  }, [approvals, user?.id]);

  // Get approvals by status
  const getApprovalsByStatus = useCallback((status: ApprovalStatus) => {
    return approvals.filter(approval => approval.status === status);
  }, [approvals]);

  // Get overdue approvals
  const getOverdueApprovals = useCallback(() => {
    const now = new Date();
    return approvals.filter(approval => 
      approval.due_date && 
      new Date(approval.due_date) < now &&
      approval.status === 'pending'
    );
  }, [approvals]);

  return {
    // Data
    approvals,
    isLoading,
    error,

    // Mutations
    createApproval: createApproval.mutate,
    updateApproval: updateApproval.mutate,
    performApprovalAction: performApprovalAction.mutate,
    assignReviewer: assignReviewer.mutate,

    // Mutation states
    isCreating: createApproval.isPending,
    isUpdating: updateApproval.isPending,
    isPerformingAction: performApprovalAction.isPending,
    isAssigning: assignReviewer.isPending,

    // Utility functions
    useApprovalHistory,
    getPendingApprovals,
    getApprovalsByStatus,
    getOverdueApprovals,
    refetch
  };
};

// Hook for approval workflows management
export const useApprovalWorkflows = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Fetch approval workflows
  const {
    data: workflows = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['approval-workflows'],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Mock workflows data - in production this would come from database
      const mockWorkflows: ApprovalWorkflow[] = [
        {
          id: 'workflow-1',
          name: 'Standard Policy Approval',
          description: 'Standard approval process for policy documents',
          entity_type: 'policy',
          document_category: 'policy',
          is_active: true,
          auto_assign: true,
          approval_levels: [
            {
              level: 'basic',
              order: 1,
              required_approvers: 1,
              approver_roles: ['employee', 'admin'],
              escalation_hours: 24
            }
          ],
          escalation_rules: [
            {
              trigger: 'timeout',
              action: 'escalate_to_manager',
              hours_delay: 24,
              notification_message: 'Document approval is overdue'
            }
          ],
          company_id: 'company-1',
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      return mockWorkflows;
    },
    enabled: !!user?.id
  });

  // Create approval workflow
  const createWorkflow = useMutation({
    mutationFn: async (workflowData: Omit<ApprovalWorkflow, 'id' | 'company_id' | 'created_by' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Validate workflow
      const validationErrors = validateApprovalWorkflow(workflowData);
      if (validationErrors.length > 0) {
        throw new Error(`Workflow validation failed: ${validationErrors.join(', ')}`);
      }

      // Simulate workflow creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newWorkflow: ApprovalWorkflow = {
        ...workflowData,
        id: `workflow-${Date.now()}`,
        company_id: 'company-1',
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return newWorkflow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval-workflows'] });
      toast({
        title: t('workflowCreated'),
        description: t('approvalWorkflowCreatedSuccessfully')
      });
    },
    onError: (error) => {
      console.error('Error creating approval workflow:', error);
      toast({
        title: t('errorCreatingWorkflow'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  });

  return {
    workflows,
    isLoading,
    error,
    createWorkflow: createWorkflow.mutate,
    isCreating: createWorkflow.isPending
  };
};

// Hook for getting approval statistics
export const useApprovalStats = () => {
  const { user } = useAuth();
  const { approvals } = useDocumentApproval();

  const stats = useCallback(() => {
    const total = approvals.length;
    const pending = approvals.filter(a => a.status === 'pending').length;
    const approved = approvals.filter(a => a.status === 'approved').length;
    const rejected = approvals.filter(a => a.status === 'rejected').length;
    const overdue = approvals.filter(a => {
      if (!a.due_date || a.status !== 'pending') return false;
      return new Date(a.due_date) < new Date();
    }).length;

    const myPending = approvals.filter(a => 
      a.status === 'pending' && 
      (!a.reviewer_id || a.reviewer_id === user?.id)
    ).length;

    return {
      total,
      pending,
      approved,
      rejected,
      overdue,
      myPending,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0
    };
  }, [approvals, user?.id]);

  return stats();
};
