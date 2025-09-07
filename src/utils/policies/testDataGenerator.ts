import * as XLSX from 'xlsx';

/**
 * Generate sample policy data for testing
 */
export const generateSamplePolicyData = () => {
  return [
    {
      'Policy Number': 'POL-001',
      'Policy Type': 'Standard',
      'Insurer Name': 'Example Insurance Co',
      'Product Name': 'Auto Insurance',
      'Product Code': 'AUTO-001',
      'Policyholder Name': 'John Doe',
      'Insured Name': 'John Doe',
      'Start Date': '2023-01-01',
      'Expiry Date': '2024-01-01',
      'Premium': '1000',
      'Currency': 'EUR',
      'Payment Frequency': 'annual',
      'Commission Percentage': '10',
      'Commission Type': 'automatic',
      'Notes': 'Sample policy for testing'
    },
    {
      'Policy Number': 'POL-002',
      'Policy Type': 'Premium',
      'Insurer Name': 'Best Insurance Ltd',
      'Product Name': 'Home Insurance',
      'Product Code': 'HOME-001',
      'Policyholder Name': 'Jane Smith',
      'Insured Name': 'Jane Smith',
      'Start Date': '2023-02-01',
      'Expiry Date': '2024-02-01',
      'Premium': '1500',
      'Currency': 'EUR',
      'Payment Frequency': 'monthly',
      'Commission Percentage': '12',
      'Commission Type': 'automatic',
      'Notes': 'Another sample policy'
    },
    {
      'Policy Number': 'POL-003',
      'Policy Type': 'Basic',
      'Insurer Name': 'Secure Insurance',
      'Product Name': 'Life Insurance',
      'Product Code': 'LIFE-001',
      'Policyholder Name': 'Bob Johnson',
      'Insured Name': 'Bob Johnson',
      'Start Date': '2023-03-01',
      'Expiry Date': '2024-03-01',
      'Premium': '800',
      'Currency': 'EUR',
      'Payment Frequency': 'annual',
      'Commission Percentage': '8',
      'Commission Type': 'automatic',
      'Notes': 'Life insurance policy'
    }
  ];
};

/**
 * Create a sample Excel file for testing
 */
export const createSampleExcelFile = (): Blob => {
  const data = generateSamplePolicyData();

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Policies');

  // Generate Excel file as buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Convert to Blob
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
};

/**
 * Download sample Excel file for testing
 */
export const downloadSampleExcelFile = () => {
  const blob = createSampleExcelFile();
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'sample_policies.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * Create a File object from sample data for testing
 */
export const createSampleFile = (): File => {
  const blob = createSampleExcelFile();
  return new File([blob], 'sample_policies.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
};