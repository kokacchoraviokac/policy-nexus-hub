import { Json } from '@/integrations/supabase/types';

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: Json;
  is_default: boolean;
  company_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplateWithVariables extends Omit<EmailTemplate, 'variables'> {
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'currency';
  description: string;
  required: boolean;
  default_value?: string;
  example?: string;
}

export interface EmailTemplateCategory {
  id: string;
  name: string;
  description: string;
  variables: TemplateVariable[];
}

export interface CreateEmailTemplateRequest {
  name: string;
  category: string;
  subject: string;
  content: string;
  variables?: TemplateVariable[];
  is_default?: boolean;
}

export interface UpdateEmailTemplateRequest {
  name?: string;
  category?: string;
  subject?: string;
  content?: string;
  variables?: TemplateVariable[];
  is_default?: boolean;
}

export interface EmailTemplatePreviewData {
  [key: string]: string | number | boolean | Date;
}

export interface EmailTemplateFilters {
  category?: string;
  search?: string;
  is_default?: boolean;
  created_by?: string;
  date_from?: string;
  date_to?: string;
}

// Predefined template categories with their available variables
export const EMAIL_TEMPLATE_CATEGORIES: EmailTemplateCategory[] = [
  {
    id: 'policy',
    name: 'Policy Templates',
    description: 'Templates for policy-related communications',
    variables: [
      {
        name: 'policy_number',
        type: 'text',
        description: 'Policy number',
        required: true,
        example: 'POL-2024-001'
      },
      {
        name: 'policyholder_name',
        type: 'text',
        description: 'Name of the policyholder',
        required: true,
        example: 'John Doe'
      },
      {
        name: 'insurer_name',
        type: 'text',
        description: 'Name of the insurance company',
        required: true,
        example: 'ABC Insurance'
      },
      {
        name: 'premium_amount',
        type: 'currency',
        description: 'Policy premium amount',
        required: false,
        example: '1500.00'
      },
      {
        name: 'start_date',
        type: 'date',
        description: 'Policy start date',
        required: false,
        example: '2024-01-15'
      },
      {
        name: 'expiry_date',
        type: 'date',
        description: 'Policy expiry date',
        required: false,
        example: '2025-01-15'
      }
    ]
  },
  {
    id: 'claims',
    name: 'Claims Templates',
    description: 'Templates for claims-related communications',
    variables: [
      {
        name: 'claim_number',
        type: 'text',
        description: 'Claim number',
        required: true,
        example: 'CLM-2024-001'
      },
      {
        name: 'policy_number',
        type: 'text',
        description: 'Related policy number',
        required: true,
        example: 'POL-2024-001'
      },
      {
        name: 'claimant_name',
        type: 'text',
        description: 'Name of the claimant',
        required: true,
        example: 'Jane Smith'
      },
      {
        name: 'incident_date',
        type: 'date',
        description: 'Date of the incident',
        required: false,
        example: '2024-01-10'
      },
      {
        name: 'claimed_amount',
        type: 'currency',
        description: 'Amount claimed',
        required: false,
        example: '5000.00'
      },
      {
        name: 'claim_status',
        type: 'text',
        description: 'Current status of the claim',
        required: false,
        example: 'Under Review'
      }
    ]
  },
  {
    id: 'sales',
    name: 'Sales Templates',
    description: 'Templates for sales and lead communications',
    variables: [
      {
        name: 'lead_name',
        type: 'text',
        description: 'Name of the lead/prospect',
        required: true,
        example: 'Michael Johnson'
      },
      {
        name: 'company_name',
        type: 'text',
        description: 'Lead company name',
        required: false,
        example: 'Johnson Enterprises'
      },
      {
        name: 'quote_number',
        type: 'text',
        description: 'Quote reference number',
        required: false,
        example: 'QUO-2024-001'
      },
      {
        name: 'quote_amount',
        type: 'currency',
        description: 'Quote amount',
        required: false,
        example: '2500.00'
      },
      {
        name: 'sales_rep_name',
        type: 'text',
        description: 'Name of the sales representative',
        required: false,
        example: 'Sarah Wilson'
      },
      {
        name: 'follow_up_date',
        type: 'date',
        description: 'Next follow-up date',
        required: false,
        example: '2024-01-20'
      }
    ]
  },
  {
    id: 'system',
    name: 'System Templates',
    description: 'Templates for system notifications and alerts',
    variables: [
      {
        name: 'user_name',
        type: 'text',
        description: 'Name of the user',
        required: true,
        example: 'Admin User'
      },
      {
        name: 'company_name',
        type: 'text',
        description: 'Company name',
        required: true,
        example: 'PolicyHub Insurance'
      },
      {
        name: 'notification_type',
        type: 'text',
        description: 'Type of notification',
        required: false,
        example: 'System Maintenance'
      },
      {
        name: 'action_required',
        type: 'boolean',
        description: 'Whether action is required',
        required: false,
        example: 'true'
      },
      {
        name: 'due_date',
        type: 'date',
        description: 'Due date for action',
        required: false,
        example: '2024-01-25'
      }
    ]
  },
  {
    id: 'invitations',
    name: 'Invitation Templates',
    description: 'Templates for user invitations and onboarding',
    variables: [
      {
        name: 'invitee_name',
        type: 'text',
        description: 'Name of the person being invited',
        required: false,
        example: 'New Employee'
      },
      {
        name: 'inviter_name',
        type: 'text',
        description: 'Name of the person sending the invitation',
        required: true,
        example: 'HR Manager'
      },
      {
        name: 'company_name',
        type: 'text',
        description: 'Company name',
        required: true,
        example: 'PolicyHub Insurance'
      },
      {
        name: 'role',
        type: 'text',
        description: 'Role being assigned',
        required: false,
        example: 'Employee'
      },
      {
        name: 'invitation_link',
        type: 'text',
        description: 'Invitation acceptance link',
        required: true,
        example: 'https://app.policyhub.com/accept-invitation?token=...'
      },
      {
        name: 'expiry_date',
        type: 'date',
        description: 'Invitation expiry date',
        required: false,
        example: '2024-01-30'
      }
    ]
  }
];

// Common variables available in all templates
export const COMMON_TEMPLATE_VARIABLES: TemplateVariable[] = [
  {
    name: 'current_date',
    type: 'date',
    description: 'Current date',
    required: false,
    example: '2024-01-15'
  },
  {
    name: 'current_year',
    type: 'number',
    description: 'Current year',
    required: false,
    example: '2024'
  },
  {
    name: 'company_name',
    type: 'text',
    description: 'Company name',
    required: false,
    example: 'PolicyHub Insurance'
  },
  {
    name: 'company_address',
    type: 'text',
    description: 'Company address',
    required: false,
    example: '123 Business St, City, Country'
  },
  {
    name: 'company_phone',
    type: 'text',
    description: 'Company phone number',
    required: false,
    example: '+1 (555) 123-4567'
  },
  {
    name: 'company_email',
    type: 'text',
    description: 'Company email address',
    required: false,
    example: 'info@policyhub.com'
  },
  {
    name: 'support_email',
    type: 'text',
    description: 'Support email address',
    required: false,
    example: 'support@policyhub.com'
  },
  {
    name: 'website_url',
    type: 'text',
    description: 'Company website URL',
    required: false,
    example: 'https://www.policyhub.com'
  }
];

// Helper function to get variables for a specific category
export const getVariablesForCategory = (categoryId: string): TemplateVariable[] => {
  const category = EMAIL_TEMPLATE_CATEGORIES.find(cat => cat.id === categoryId);
  const categoryVariables = category ? category.variables : [];
  return [...COMMON_TEMPLATE_VARIABLES, ...categoryVariables];
};

// Helper function to validate template variables
export const validateTemplateVariables = (content: string, variables: TemplateVariable[]): string[] => {
  const errors: string[] = [];
  const variableNames = variables.map(v => v.name);
  
  // Find all variables used in the template (format: {{variable_name}})
  const usedVariables = content.match(/\{\{([^}]+)\}\}/g) || [];
  
  for (const usedVar of usedVariables) {
    const varName = usedVar.replace(/[{}]/g, '').trim();
    if (!variableNames.includes(varName)) {
      errors.push(`Unknown variable: ${varName}`);
    }
  }
  
  // Check for required variables
  const requiredVariables = variables.filter(v => v.required);
  for (const reqVar of requiredVariables) {
    if (!content.includes(`{{${reqVar.name}}}`)) {
      errors.push(`Required variable missing: ${reqVar.name}`);
    }
  }
  
  return errors;
};

// Helper function to render template with data
export const renderTemplate = (template: string, data: EmailTemplatePreviewData): string => {
  let rendered = template;
  
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    let formattedValue = String(value);
    
    // Format based on value type
    if (value instanceof Date) {
      formattedValue = value.toLocaleDateString();
    } else if (typeof value === 'number' && key.includes('amount')) {
      formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }
    
    rendered = rendered.replace(new RegExp(placeholder, 'g'), formattedValue);
  });
  
  return rendered;
};