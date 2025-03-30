
import { Policy } from "@/types/policies";
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
