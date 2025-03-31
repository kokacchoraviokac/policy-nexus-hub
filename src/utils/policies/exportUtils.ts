
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { Policy } from '@/types/policies';

export const exportWorkflowTemplate = async (): Promise<Blob> => {
  // Create a template worksheet
  const templateData = [
    {
      policy_number: 'POL-001',
      policy_type: 'Standard',
      insurer_name: 'Example Insurance',
      product_name: 'Auto Insurance',
      product_code: 'AUTO-001',
      policyholder_name: 'John Doe',
      insured_name: 'John Doe',
      start_date: '2023-01-01',
      expiry_date: '2024-01-01',
      premium: '1000',
      currency: 'EUR',
      payment_frequency: 'annual',
      commission_percentage: '10',
      commission_type: 'automatic',
      notes: 'Example policy'
    }
  ];
  
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert the template data to a worksheet
  const ws = XLSX.utils.json_to_sheet(templateData);
  
  // Add instructions at the top of the worksheet
  XLSX.utils.sheet_add_aoa(ws, [
    ['POLICY IMPORT TEMPLATE'],
    ['Instructions:'],
    ['1. Fill in the required information for each policy you want to import.'],
    ['2. Required fields: policy_number, insurer_name, policyholder_name, start_date, expiry_date, premium, currency'],
    ['3. Date format must be YYYY-MM-DD'],
    ['4. Currency options: EUR, USD, GBP, RSD, MKD'],
    ['5. Payment frequency options: annual, semi-annual, quarterly, monthly, one-time'],
    ['6. Commission type options: automatic, manual, none'],
    [''],
  ], { origin: 'A1' });
  
  // Set column widths for better readability
  const wscols = [
    {wch: 15}, // A
    {wch: 12}, // B
    {wch: 20}, // C
    {wch: 20}, // D
    {wch: 15}, // E
    {wch: 20}, // F
    {wch: 20}, // G
    {wch: 12}, // H
    {wch: 12}, // I
    {wch: 10}, // J
    {wch: 10}, // K
    {wch: 15}, // L
    {wch: 20}, // M
    {wch: 15}, // N
    {wch: 30}, // O
  ];
  ws['!cols'] = wscols;
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Policy Import Template');
  
  // Generate a binary string from the workbook
  const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
  
  // Convert binary string to Blob
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  
  return blob;
};

// Convert string to ArrayBuffer
function s2ab(s: string): ArrayBuffer {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

export const exportPolicies = async (filters?: any): Promise<Blob> => {
  // Fetch policies data from the database
  let query = supabase
    .from('policies')
    .select('*');
  
  // Apply filters if provided
  if (filters) {
    if (filters.search) {
      query = query.ilike('policy_number', `%${filters.search}%`);
    }
    
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.workflow_status && filters.workflow_status !== 'all') {
      query = query.eq('workflow_status', filters.workflow_status);
    }
    
    if (filters.dateFrom) {
      query = query.gte('start_date', filters.dateFrom.toISOString().split('T')[0]);
    }
    
    if (filters.dateTo) {
      query = query.lte('expiry_date', filters.dateTo.toISOString().split('T')[0]);
    }
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error exporting policies:', error);
    throw error;
  }
  
  const policies = data as Policy[];
  
  // Format the data for export
  const exportData = policies.map(policy => ({
    policy_number: policy.policy_number,
    policy_type: policy.policy_type,
    insurer_name: policy.insurer_name,
    product_name: policy.product_name || '',
    product_code: policy.product_code || '',
    policyholder_name: policy.policyholder_name,
    insured_name: policy.insured_name || policy.policyholder_name,
    start_date: policy.start_date,
    expiry_date: policy.expiry_date,
    premium: policy.premium,
    currency: policy.currency,
    payment_frequency: policy.payment_frequency || '',
    commission_percentage: policy.commission_percentage || '',
    commission_type: policy.commission_type || '',
    status: policy.status,
    workflow_status: policy.workflow_status,
    created_at: policy.created_at,
    updated_at: policy.updated_at,
  }));
  
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert the data to a worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);
  
  // Set column widths for better readability
  const wscols = [
    {wch: 15}, // A
    {wch: 12}, // B
    {wch: 20}, // C
    {wch: 20}, // D
    {wch: 15}, // E
    {wch: 20}, // F
    {wch: 20}, // G
    {wch: 12}, // H
    {wch: 12}, // I
    {wch: 10}, // J
    {wch: 10}, // K
    {wch: 15}, // L
    {wch: 10}, // M
    {wch: 12}, // N
    {wch: 10}, // O
    {wch: 12}, // P
    {wch: 20}, // Q
    {wch: 20}, // R
  ];
  ws['!cols'] = wscols;
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Policies');
  
  // Generate a binary string from the workbook
  const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
  
  // Convert binary string to Blob
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  
  return blob;
};
