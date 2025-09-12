import { Json } from '@/integrations/supabase/types';
import { DocumentCategory, EntityType } from './documents';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs_review' | 'under_review';
export type ApprovalLevel = 'basic' | 'advanced' | 'final' | 'legal' | 'compliance';
export type ApprovalAction = 'approve' | 'reject' | 'request_changes' | 'escalate';

export interface DocumentApproval {
  id: string;
  document_id: string;
  document_name: string;
  document_type: string;
  entity_type: EntityType;
  entity_id: string;
  status: ApprovalStatus;
  reviewer_id?: string;
  reviewer_name?: string;
  reviewed_at?: string;
  comments?: string;
  approval_level: ApprovalLevel;
  required_approvals: number;
  current_approvals: number;
  workflow_id?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface AutoApproveCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
  description: string;
}

export interface ApprovalWorkflowLevel {
  level: ApprovalLevel;
  order: number;
  required_approvers: number;
  approver_roles: string[];
  approver_users?: string[];
  auto_approve_conditions?: AutoApproveCondition[];
  escalation_hours?: number;
}

export interface EscalationRule {
  trigger: 'timeout' | 'rejection' | 'manual';
  action: 'escalate_to_manager' | 'notify_admin' | 'auto_approve' | 'auto_reject';
  target_role?: string;
  target_user?: string;
  hours_delay: number;
  notification_message: string;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description?: string;
  entity_type: EntityType;
  document_category: DocumentCategory;
  approval_levels: ApprovalWorkflowLevel[];
  is_active: boolean;
  auto_assign: boolean;
  escalation_rules: EscalationRule[];
  company_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ApprovalHistory {
  id: string;
  document_id: string;
  approval_id: string;
  action: ApprovalAction;
  reviewer_id: string;
  reviewer_name: string;
  comments?: string;
  previous_status: ApprovalStatus;
  new_status: ApprovalStatus;
  created_at: string;
}

export interface ApprovalNotification {
  id: string;
  approval_id: string;
  recipient_id: string;
  notification_type: 'approval_request' | 'approval_reminder' | 'approval_completed' | 'approval_escalated';
  message: string;
  sent_at?: string;
  read_at?: string;
  created_at: string;
}

export interface CreateApprovalRequest {
  document_id: string;
  workflow_id?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  comments?: string;
}

export interface UpdateApprovalRequest {
  status?: ApprovalStatus;
  reviewer_id?: string;
  comments?: string;
  approval_level?: ApprovalLevel;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ApprovalActionRequest {
  approval_id: string;
  action: ApprovalAction;
  comments?: string;
  escalate_to?: string;
}

export interface ApprovalFilters {
  status?: ApprovalStatus;
  reviewer_id?: string;
  entity_type?: EntityType;
  document_category?: DocumentCategory;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date_from?: string;
  due_date_to?: string;
  search?: string;
}

// Predefined approval workflows for different document types
export const DEFAULT_APPROVAL_WORKFLOWS: Omit<ApprovalWorkflow, 'id' | 'company_id' | 'created_by' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Policy Document Approval',
    description: 'Standard approval workflow for policy documents',
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
      },
      {
        level: 'final',
        order: 2,
        required_approvers: 1,
        approver_roles: ['admin'],
        escalation_hours: 48
      }
    ],
    escalation_rules: [
      {
        trigger: 'timeout',
        action: 'escalate_to_manager',
        hours_delay: 24,
        notification_message: 'Document approval is overdue and has been escalated'
      }
    ]
  },
  {
    name: 'Claims Document Approval',
    description: 'Approval workflow for claims-related documents',
    entity_type: 'claim',
    document_category: 'claim',
    is_active: true,
    auto_assign: true,
    approval_levels: [
      {
        level: 'basic',
        order: 1,
        required_approvers: 1,
        approver_roles: ['employee'],
        escalation_hours: 12
      },
      {
        level: 'advanced',
        order: 2,
        required_approvers: 1,
        approver_roles: ['admin'],
        escalation_hours: 24
      }
    ],
    escalation_rules: [
      {
        trigger: 'timeout',
        action: 'notify_admin',
        hours_delay: 12,
        notification_message: 'Claims document approval requires attention'
      }
    ]
  }
];

// Helper functions
export const getApprovalStatusColor = (status: ApprovalStatus): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'under_review':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'needs_review':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'pending':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPriorityColor = (priority: 'low' | 'medium' | 'high' | 'urgent'): string => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const validateApprovalWorkflow = (workflow: Partial<ApprovalWorkflow>): string[] => {
  const errors: string[] = [];
  
  if (!workflow.name?.trim()) {
    errors.push('Workflow name is required');
  }
  
  if (!workflow.entity_type) {
    errors.push('Entity type is required');
  }
  
  if (!workflow.document_category) {
    errors.push('Document category is required');
  }
  
  if (!workflow.approval_levels || workflow.approval_levels.length === 0) {
    errors.push('At least one approval level is required');
  }
  
  return errors;
};

export const calculateApprovalProgress = (approval: DocumentApproval): number => {
  if (approval.required_approvals === 0) return 0;
  return Math.round((approval.current_approvals / approval.required_approvals) * 100);
};

export const isApprovalOverdue = (approval: DocumentApproval): boolean => {
  if (!approval.due_date) return false;
  return new Date(approval.due_date) < new Date();
};

export const getApprovalTimeRemaining = (approval: DocumentApproval): string => {
  if (!approval.due_date) return '';
  
  const now = new Date();
  const dueDate = new Date(approval.due_date);
  const diffMs = dueDate.getTime() - now.getTime();
  
  if (diffMs < 0) return 'Overdue';
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} remaining`;
  }
};