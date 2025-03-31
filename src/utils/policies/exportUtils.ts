
/**
 * Export policy workflow template for bulk imports
 */
export const exportWorkflowTemplate = async (): Promise<Blob> => {
  // In a real app, this would generate an Excel/CSV template
  // For now, return a simple text file
  const headers = [
    'policy_number',
    'policyholder_name',
    'insurer_name',
    'product_name',
    'start_date',
    'expiry_date',
    'premium',
    'currency',
    'commission_percentage',
    'status'
  ].join(',');
  
  const sampleData = [
    'POL123456,John Doe,Insurance Co Ltd,Auto Insurance,2023-01-01,2024-01-01,1000,EUR,10,draft'
  ].join('\n');
  
  const template = `${headers}\n${sampleData}`;
  
  // Create a blob with the template data
  return new Blob([template], { type: 'text/csv;charset=utf-8' });
};
