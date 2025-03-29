
import { Policy } from "@/types/policies";
import { formatDate } from "@/utils/format";

/**
 * Converts policy data to CSV format and triggers a download
 */
export const exportPoliciesToCSV = (policies: Policy[], filename = "policies-export.csv") => {
  // Define CSV headers
  const headers = [
    "Policy Number",
    "Policy Type",
    "Insurer",
    "Product",
    "Policyholder",
    "Insured",
    "Start Date",
    "Expiry Date",
    "Premium",
    "Currency",
    "Payment Frequency",
    "Commission %",
    "Status",
    "Notes"
  ];
  
  // Map policy data to CSV rows
  const rows = policies.map(policy => [
    policy.policy_number,
    policy.policy_type || "",
    policy.insurer_name || "",
    policy.product_name || "",
    policy.policyholder_name || "",
    policy.insured_name || "",
    formatDate(policy.start_date),
    formatDate(policy.expiry_date),
    policy.premium.toString(),
    policy.currency,
    policy.payment_frequency || "",
    policy.commission_percentage ? policy.commission_percentage.toString() : "",
    policy.status,
    policy.notes || ""
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

/**
 * Exports filtered policies based on search criteria
 */
export const exportFilteredPolicies = async (
  searchTerm?: string, 
  statusFilter?: string, 
  dateRange?: { from: Date | undefined; to: Date | undefined; }
) => {
  // This function could fetch filtered policies from the database
  // For now, we'll implement a simpler version that relies on the UI to pass policies
  // In a future iteration, this could directly query Supabase
  
  console.log("Export with filters:", { searchTerm, statusFilter, dateRange });
  // Implementation would go here in a future iteration
};
