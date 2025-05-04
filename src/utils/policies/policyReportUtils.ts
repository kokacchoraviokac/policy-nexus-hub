
import { formatCurrency, formatDate } from "@/utils/format";

export interface PolicyReportFilters {
  clientId?: string;
  insurerId?: string;
  productId?: string;
  agentId?: string;
  startDate?: Date;
  endDate?: Date;
  commissionStatus?: string;
}

export interface PolicyReportData {
  id: string;
  policy_number: string;
  policyholder_name: string;
  insurer_name: string;
  product_name: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  commission_percentage?: number;
  commission_amount?: number;
  status: string;
}

export interface PolicyReportSummary {
  totalPolicies: number;
  totalPremium: number;
  totalCommission: number;
  avgCommissionRate: number;
  expiringPolicies: number;
  newPolicies: number;
  insurerDistribution: { name: string; value: number }[];
  productDistribution: { name: string; value: number }[];
  monthlyTrends: { name: string; policies: number; premium: number; commission: number }[];
}

/**
 * Calculates summary metrics from policy data
 */
export const calculatePolicyReportSummary = (data: PolicyReportData[]): PolicyReportSummary => {
  const totalPolicies = data.length;
  const totalPremium = data.reduce((sum, policy) => sum + policy.premium, 0);
  const totalCommission = data.reduce((sum, policy) => sum + (policy.commission_amount || 0), 0);
  const avgCommissionRate = totalPremium > 0 
    ? (totalCommission / totalPremium) * 100 
    : 0;
  
  // Count policies expiring within 30 days
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  
  const expiringPolicies = data.filter(policy => {
    const expiryDate = new Date(policy.expiry_date);
    return expiryDate >= now && expiryDate <= thirtyDaysFromNow;
  }).length;
  
  // Count policies created in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const newPolicies = data.filter(policy => {
    const startDate = new Date(policy.start_date);
    return startDate >= thirtyDaysAgo;
  }).length;
  
  // Calculate insurer distribution
  const insurerCounts = new Map<string, number>();
  data.forEach(policy => {
    const count = insurerCounts.get(policy.insurer_name) || 0;
    insurerCounts.set(policy.insurer_name, count + 1);
  });
  
  const insurerDistribution = Array.from(insurerCounts).map(([name, value]) => ({ name, value }));
  
  // Calculate product distribution
  const productCounts = new Map<string, number>();
  data.forEach(policy => {
    if (!policy.product_name) return;
    const count = productCounts.get(policy.product_name) || 0;
    productCounts.set(policy.product_name, count + 1);
  });
  
  const productDistribution = Array.from(productCounts).map(([name, value]) => ({ name, value }));
  
  // Calculate monthly trends (for the past 6 months)
  const monthlyData = new Map<string, { policies: number; premium: number; commission: number }>();
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    monthlyData.set(monthKey, { policies: 0, premium: 0, commission: 0 });
  }
  
  // Fill in policy data
  data.forEach(policy => {
    const startDate = new Date(policy.start_date);
    const monthKey = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    
    if (monthlyData.has(monthKey)) {
      const current = monthlyData.get(monthKey)!;
      monthlyData.set(monthKey, {
        policies: current.policies + 1,
        premium: current.premium + policy.premium,
        commission: current.commission + (policy.commission_amount || 0)
      });
    }
  });
  
  const monthlyTrends = Array.from(monthlyData).map(([name, data]) => ({
    name,
    ...data
  }));
  
  return {
    totalPolicies,
    totalPremium,
    totalCommission,
    avgCommissionRate,
    expiringPolicies,
    newPolicies,
    insurerDistribution,
    productDistribution,
    monthlyTrends
  };
};

/**
 * Generate an Excel-compatible CSV file from policy report data
 */
export const exportPolicyReportToCsv = (data: PolicyReportData[], filename = "policy-production-report.csv") => {
  // Define CSV headers
  const headers = [
    "Policy Number",
    "Client",
    "Insurer",
    "Product",
    "Start Date",
    "Expiry Date",
    "Premium",
    "Commission %",
    "Commission Amount",
    "Status"
  ];
  
  // Map policy data to CSV rows
  const rows = data.map(policy => [
    policy.policy_number,
    policy.policyholder_name,
    policy.insurer_name,
    policy.product_name,
    formatDate(new Date(policy.start_date)),
    formatDate(new Date(policy.expiry_date)),
    policy.premium.toString(),
    policy.commission_percentage ? policy.commission_percentage.toString() + "%" : "",
    policy.commission_amount ? formatCurrency(policy.commission_amount, policy.currency) : "",
    policy.status
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => 
      // Escape special characters and wrap in quotes if needed
      cell.includes(",") || cell.includes("\"") || cell.includes("\n") 
        ? `"${cell.replace(/"/g, '""')}"` 
        : cell
    ).join(","))
  ].join("\n");
  
  // Create a blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  // Create a link element and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
