
import { SalesProcess } from "@/types/salesProcess";

// Mock data for sales processes
export const mockSalesProcesses: SalesProcess[] = [
  {
    id: "sp-1",
    title: "New Business Insurance",
    company: "Alpha Technologies",
    client_name: "John Smith",
    stage: "quote",
    created_at: "2023-08-05T10:00:00Z",
    expected_close_date: "2023-10-15T00:00:00Z",
    insurance_type: "business",
    responsible_person: "Sarah Johnson",
    status: "active",
    estimated_value: "€45,000",
    notes: "Client is expanding their business and needs comprehensive coverage."
  },
  {
    id: "sp-2",
    title: "Family Health Plan",
    client_name: "Emily Davis",
    stage: "authorization",
    created_at: "2023-07-22T14:15:00Z",
    expected_close_date: "2023-09-30T00:00:00Z",
    insurance_type: "health",
    responsible_person: "Michael Brown",
    status: "active",
    estimated_value: "€8,500",
    notes: "Family of four looking for comprehensive health coverage."
  },
  {
    id: "sp-3",
    title: "Corporate Liability",
    company: "Johnson & Associates",
    client_name: "Robert Johnson",
    stage: "proposal",
    created_at: "2023-07-10T09:45:00Z",
    insurance_type: "nonLife",
    responsible_person: "Sarah Johnson",
    status: "active",
    estimated_value: "€75,200"
  },
  {
    id: "sp-4",
    title: "Vehicle Fleet Insurance",
    company: "Garcia Delivery",
    client_name: "Maria Garcia",
    stage: "signed",
    created_at: "2023-06-15T16:20:00Z",
    insurance_type: "auto",
    responsible_person: "David Wilson",
    status: "active",
    estimated_value: "€28,750",
    notes: "Fleet of 12 delivery vehicles needing comprehensive coverage."
  },
  {
    id: "sp-5",
    title: "Tech Startup Package",
    company: "Lee Technologies",
    client_name: "David Lee",
    stage: "concluded",
    created_at: "2023-05-18T11:00:00Z",
    insurance_type: "business",
    responsible_person: "Michael Brown",
    status: "completed",
    estimated_value: "€120,000",
    notes: "Successfully implemented comprehensive business insurance package."
  }
];
