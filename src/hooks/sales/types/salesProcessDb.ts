
import { SalesProcess, SalesStage, SalesStatus } from "@/types/sales/salesProcesses";

// Define the database row type to make type checking more accurate
export interface DbSalesProcess {
  id: string;
  sales_number: string;
  lead_id?: string;
  company_id: string;
  assigned_to?: string;
  current_step: string;
  status: string;
  estimated_value?: number;
  expected_close_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Helper function to map database response to our SalesProcess type
export const mapDbToSalesProcess = (row: DbSalesProcess): SalesProcess => {
  return {
    id: row.id,
    title: row.sales_number || "", // Map sales_number to title 
    client_name: "Client", // Default placeholder for client name
    company: undefined, // Default undefined for company
    stage: (row.current_step || "quote") as SalesStage, // Map current_step to stage
    status: (row.status || "active") as SalesStatus,
    insurance_type: "Unknown", // Default value for insurance_type
    estimated_value: row.estimated_value || undefined,
    expected_close_date: row.expected_close_date || undefined,
    lead_id: row.lead_id || undefined,
    assigned_to: row.assigned_to || undefined,
    notes: row.notes || undefined, // Using optional chaining for notes
    company_id: row.company_id,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};
