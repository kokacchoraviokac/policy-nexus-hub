import { Json } from '@/integrations/supabase/types';

export interface SavedReport {
  id: string;
  name: string;
  description?: string;
  report_type: string;
  filters: Json;
  columns: Json;
  sorting: Json;
  is_public: boolean;
  company_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SavedReportWithDetails extends Omit<SavedReport, 'filters' | 'columns' | 'sorting'> {
  filters: ReportFilters;
  columns: ReportColumn[];
  sorting: ReportSorting[];
}

export interface ReportColumn {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'boolean';
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  visible: boolean;
  order: number;
}

export interface ReportFilters {
  [key: string]: ReportFilter;
}

export interface ReportFilter {
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean' | 'daterange';
  value: any;
  operator?: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';
  options?: { label: string; value: any }[];
}

export interface ReportSorting {
  column: string;
  direction: 'asc' | 'desc';
  order: number;
}

export interface ReportDataSource {
  id: string;
  name: string;
  description: string;
  table: string;
  joins?: ReportJoin[];
  available_columns: ReportColumn[];
  available_filters: ReportFilterDefinition[];
}

export interface ReportJoin {
  table: string;
  type: 'inner' | 'left' | 'right' | 'full';
  on: string;
  alias?: string;
}

export interface ReportFilterDefinition {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean' | 'daterange';
  column: string;
  options?: { label: string; value: any }[];
  required?: boolean;
  default_value?: any;
}

export interface CreateSavedReportRequest {
  name: string;
  description?: string;
  report_type: string;
  filters: ReportFilters;
  columns: ReportColumn[];
  sorting: ReportSorting[];
  is_public?: boolean;
}

export interface UpdateSavedReportRequest {
  name?: string;
  description?: string;
  filters?: ReportFilters;
  columns?: ReportColumn[];
  sorting?: ReportSorting[];
  is_public?: boolean;
}

export interface ReportExecutionRequest {
  report_id: string;
  format: 'json' | 'csv' | 'excel' | 'pdf';
  filters?: ReportFilters;
  limit?: number;
  offset?: number;
}

export interface ReportExecutionResult {
  data: any[];
  total_count: number;
  execution_time: number;
  generated_at: string;
  format: string;
}

export interface ReportSchedule {
  id: string;
  report_id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  cron_expression?: string;
  email_recipients: string[];
  format: 'csv' | 'excel' | 'pdf';
  status: 'active' | 'paused' | 'disabled';
  next_run_date: string;
  last_run_date?: string;
  last_run_status?: 'success' | 'failed' | 'running';
  company_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Predefined report types with their data sources
export const REPORT_TYPES: ReportDataSource[] = [
  {
    id: 'policies',
    name: 'Policies Report',
    description: 'Comprehensive policy data with client and insurer information',
    table: 'policies',
    joins: [
      { table: 'clients', type: 'left', on: 'policies.client_id = clients.id', alias: 'client' },
      { table: 'insurers', type: 'left', on: 'policies.insurer_id = insurers.id', alias: 'insurer' },
      { table: 'commissions', type: 'left', on: 'policies.id = commissions.policy_id', alias: 'commission' }
    ],
    available_columns: [
      { id: 'policy_number', name: 'policy_number', label: 'Policy Number', type: 'text', sortable: true, filterable: true, visible: true, order: 1 },
      { id: 'policyholder_name', name: 'policyholder_name', label: 'Policyholder', type: 'text', sortable: true, filterable: true, visible: true, order: 2 },
      { id: 'insurer_name', name: 'insurer_name', label: 'Insurer', type: 'text', sortable: true, filterable: true, visible: true, order: 3 },
      { id: 'policy_type', name: 'policy_type', label: 'Policy Type', type: 'text', sortable: true, filterable: true, visible: true, order: 4 },
      { id: 'premium', name: 'premium', label: 'Premium', type: 'currency', sortable: true, filterable: true, visible: true, order: 5 },
      { id: 'currency', name: 'currency', label: 'Currency', type: 'text', sortable: true, filterable: true, visible: true, order: 6 },
      { id: 'start_date', name: 'start_date', label: 'Start Date', type: 'date', sortable: true, filterable: true, visible: true, order: 7 },
      { id: 'expiry_date', name: 'expiry_date', label: 'Expiry Date', type: 'date', sortable: true, filterable: true, visible: true, order: 8 },
      { id: 'status', name: 'status', label: 'Status', type: 'text', sortable: true, filterable: true, visible: true, order: 9 },
      { id: 'commission_amount', name: 'commission.calculated_amount', label: 'Commission Amount', type: 'currency', sortable: true, filterable: false, visible: false, order: 10 }
    ],
    available_filters: [
      { id: 'policy_number', name: 'policy_number', label: 'Policy Number', type: 'text', column: 'policy_number' },
      { id: 'insurer', name: 'insurer_id', label: 'Insurer', type: 'select', column: 'insurer_id' },
      { id: 'policy_type', name: 'policy_type', label: 'Policy Type', type: 'select', column: 'policy_type' },
      { id: 'status', name: 'status', label: 'Status', type: 'select', column: 'status' },
      { id: 'date_range', name: 'date_range', label: 'Date Range', type: 'daterange', column: 'start_date' },
      { id: 'premium_range', name: 'premium_range', label: 'Premium Range', type: 'number', column: 'premium' }
    ]
  },
  {
    id: 'claims',
    name: 'Claims Report',
    description: 'Claims data with policy and client information',
    table: 'claims',
    joins: [
      { table: 'policies', type: 'left', on: 'claims.policy_id = policies.id', alias: 'policy' },
      { table: 'clients', type: 'left', on: 'policies.client_id = clients.id', alias: 'client' }
    ],
    available_columns: [
      { id: 'claim_number', name: 'claim_number', label: 'Claim Number', type: 'text', sortable: true, filterable: true, visible: true, order: 1 },
      { id: 'policy_number', name: 'policy.policy_number', label: 'Policy Number', type: 'text', sortable: true, filterable: true, visible: true, order: 2 },
      { id: 'claimant', name: 'client.name', label: 'Claimant', type: 'text', sortable: true, filterable: true, visible: true, order: 3 },
      { id: 'incident_date', name: 'incident_date', label: 'Incident Date', type: 'date', sortable: true, filterable: true, visible: true, order: 4 },
      { id: 'claimed_amount', name: 'claimed_amount', label: 'Claimed Amount', type: 'currency', sortable: true, filterable: true, visible: true, order: 5 },
      { id: 'approved_amount', name: 'approved_amount', label: 'Approved Amount', type: 'currency', sortable: true, filterable: true, visible: true, order: 6 },
      { id: 'status', name: 'status', label: 'Status', type: 'text', sortable: true, filterable: true, visible: true, order: 7 },
      { id: 'damage_description', name: 'damage_description', label: 'Description', type: 'text', sortable: false, filterable: true, visible: false, order: 8 }
    ],
    available_filters: [
      { id: 'claim_number', name: 'claim_number', label: 'Claim Number', type: 'text', column: 'claim_number' },
      { id: 'policy_number', name: 'policy_number', label: 'Policy Number', type: 'text', column: 'policy.policy_number' },
      { id: 'status', name: 'status', label: 'Status', type: 'select', column: 'status' },
      { id: 'incident_date_range', name: 'incident_date_range', label: 'Incident Date Range', type: 'daterange', column: 'incident_date' },
      { id: 'amount_range', name: 'amount_range', label: 'Amount Range', type: 'number', column: 'claimed_amount' }
    ]
  },
  {
    id: 'commissions',
    name: 'Commissions Report',
    description: 'Commission data with policy and agent information',
    table: 'commissions',
    joins: [
      { table: 'policies', type: 'left', on: 'commissions.policy_id = policies.id', alias: 'policy' },
      { table: 'agents', type: 'left', on: 'policies.assigned_to = agents.id', alias: 'agent' }
    ],
    available_columns: [
      { id: 'policy_number', name: 'policy.policy_number', label: 'Policy Number', type: 'text', sortable: true, filterable: true, visible: true, order: 1 },
      { id: 'agent_name', name: 'agent.name', label: 'Agent', type: 'text', sortable: true, filterable: true, visible: true, order: 2 },
      { id: 'base_amount', name: 'base_amount', label: 'Base Amount', type: 'currency', sortable: true, filterable: true, visible: true, order: 3 },
      { id: 'rate', name: 'rate', label: 'Rate (%)', type: 'number', sortable: true, filterable: true, visible: true, order: 4 },
      { id: 'calculated_amount', name: 'calculated_amount', label: 'Commission Amount', type: 'currency', sortable: true, filterable: true, visible: true, order: 5 },
      { id: 'status', name: 'status', label: 'Status', type: 'text', sortable: true, filterable: true, visible: true, order: 6 },
      { id: 'payment_date', name: 'payment_date', label: 'Payment Date', type: 'date', sortable: true, filterable: true, visible: false, order: 7 }
    ],
    available_filters: [
      { id: 'agent', name: 'agent_id', label: 'Agent', type: 'select', column: 'agent.id' },
      { id: 'status', name: 'status', label: 'Status', type: 'select', column: 'status' },
      { id: 'date_range', name: 'date_range', label: 'Date Range', type: 'daterange', column: 'created_at' },
      { id: 'amount_range', name: 'amount_range', label: 'Amount Range', type: 'number', column: 'calculated_amount' }
    ]
  },
  {
    id: 'clients',
    name: 'Clients Report',
    description: 'Client data with policy and activity information',
    table: 'clients',
    joins: [
      { table: 'policies', type: 'left', on: 'clients.id = policies.client_id', alias: 'policies_count' }
    ],
    available_columns: [
      { id: 'name', name: 'name', label: 'Client Name', type: 'text', sortable: true, filterable: true, visible: true, order: 1 },
      { id: 'contact_person', name: 'contact_person', label: 'Contact Person', type: 'text', sortable: true, filterable: true, visible: true, order: 2 },
      { id: 'email', name: 'email', label: 'Email', type: 'text', sortable: true, filterable: true, visible: true, order: 3 },
      { id: 'phone', name: 'phone', label: 'Phone', type: 'text', sortable: true, filterable: true, visible: true, order: 4 },
      { id: 'city', name: 'city', label: 'City', type: 'text', sortable: true, filterable: true, visible: true, order: 5 },
      { id: 'is_active', name: 'is_active', label: 'Active', type: 'boolean', sortable: true, filterable: true, visible: true, order: 6 },
      { id: 'created_at', name: 'created_at', label: 'Created Date', type: 'date', sortable: true, filterable: true, visible: false, order: 7 }
    ],
    available_filters: [
      { id: 'name', name: 'name', label: 'Client Name', type: 'text', column: 'name' },
      { id: 'city', name: 'city', label: 'City', type: 'select', column: 'city' },
      { id: 'is_active', name: 'is_active', label: 'Status', type: 'select', column: 'is_active', options: [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
      ]},
      { id: 'created_date', name: 'created_date', label: 'Created Date', type: 'daterange', column: 'created_at' }
    ]
  },
  {
    id: 'agents',
    name: 'Agents Report',
    description: 'Agent performance data with commission and payout information',
    table: 'agents',
    joins: [
      { table: 'commissions', type: 'left', on: 'agents.id = commissions.policy_id', alias: 'commission' },
      { table: 'agent_payouts', type: 'left', on: 'agents.id = agent_payouts.agent_id', alias: 'payout' }
    ],
    available_columns: [
      { id: 'name', name: 'name', label: 'Agent Name', type: 'text', sortable: true, filterable: true, visible: true, order: 1 },
      { id: 'email', name: 'email', label: 'Email', type: 'text', sortable: true, filterable: true, visible: true, order: 2 },
      { id: 'phone', name: 'phone', label: 'Phone', type: 'text', sortable: true, filterable: true, visible: true, order: 3 },
      { id: 'status', name: 'status', label: 'Status', type: 'text', sortable: true, filterable: true, visible: true, order: 4 },
      { id: 'total_commissions', name: 'SUM(commission.calculated_amount)', label: 'Total Commissions', type: 'currency', sortable: true, filterable: false, visible: true, order: 5 },
      { id: 'total_payouts', name: 'SUM(payout.total_amount)', label: 'Total Payouts', type: 'currency', sortable: true, filterable: false, visible: true, order: 6 }
    ],
    available_filters: [
      { id: 'name', name: 'name', label: 'Agent Name', type: 'text', column: 'name' },
      { id: 'status', name: 'status', label: 'Status', type: 'select', column: 'status' },
      { id: 'date_range', name: 'date_range', label: 'Date Range', type: 'daterange', column: 'created_at' }
    ]
  }
];

// Helper functions
export const getReportTypeById = (id: string): ReportDataSource | undefined => {
  return REPORT_TYPES.find(type => type.id === id);
};

export const getDefaultColumns = (reportType: string): ReportColumn[] => {
  const type = getReportTypeById(reportType);
  return type ? type.available_columns.filter(col => col.visible) : [];
};

export const getAvailableFilters = (reportType: string): ReportFilterDefinition[] => {
  const type = getReportTypeById(reportType);
  return type ? type.available_filters : [];
};

export const validateReportDefinition = (report: CreateSavedReportRequest): string[] => {
  const errors: string[] = [];
  
  if (!report.name.trim()) {
    errors.push('Report name is required');
  }
  
  if (!report.report_type) {
    errors.push('Report type is required');
  }
  
  if (!report.columns || report.columns.length === 0) {
    errors.push('At least one column must be selected');
  }
  
  // Validate that selected columns exist in the report type
  const reportType = getReportTypeById(report.report_type);
  if (reportType) {
    const availableColumnIds = reportType.available_columns.map(col => col.id);
    const invalidColumns = report.columns.filter(col => !availableColumnIds.includes(col.id));
    
    if (invalidColumns.length > 0) {
      errors.push(`Invalid columns: ${invalidColumns.map(col => col.name).join(', ')}`);
    }
  }
  
  return errors;
};

export const generateReportQuery = (report: SavedReportWithDetails): string => {
  const reportType = getReportTypeById(report.report_type);
  if (!reportType) return '';
  
  const selectedColumns = report.columns
    .sort((a, b) => a.order - b.order)
    .map(col => `${col.name} as "${col.label}"`)
    .join(', ');
  
  let query = `SELECT ${selectedColumns} FROM ${reportType.table}`;
  
  // Add joins
  if (reportType.joins) {
    reportType.joins.forEach(join => {
      query += ` ${join.type.toUpperCase()} JOIN ${join.table}${join.alias ? ` AS ${join.alias}` : ''} ON ${join.on}`;
    });
  }
  
  // Add filters (simplified - in real implementation this would be more complex)
  const whereConditions: string[] = [];
  Object.entries(report.filters).forEach(([key, filter]) => {
    if (filter.value !== null && filter.value !== undefined && filter.value !== '') {
      switch (filter.operator) {
        case 'equals':
          whereConditions.push(`${key} = '${filter.value}'`);
          break;
        case 'contains':
          whereConditions.push(`${key} ILIKE '%${filter.value}%'`);
          break;
        // Add more operators as needed
      }
    }
  });
  
  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }
  
  // Add sorting
  if (report.sorting && report.sorting.length > 0) {
    const orderBy = report.sorting
      .sort((a, b) => a.order - b.order)
      .map(sort => `${sort.column} ${sort.direction.toUpperCase()}`)
      .join(', ');
    query += ` ORDER BY ${orderBy}`;
  }
  
  return query;
};