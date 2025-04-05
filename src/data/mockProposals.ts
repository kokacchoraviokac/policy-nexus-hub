
import { Proposal } from "@/types/sales";

// Mock proposals data for development and testing
const mockProposals: Proposal[] = [
  {
    id: "proposal-1",
    title: "Auto Insurance Coverage Proposal",
    client_name: "John Smith",
    sales_process_id: "sales-1",
    created_at: "2023-05-10T14:30:00Z",
    status: "accepted",
    insurer_name: "ABC Insurance Co.",
    coverage_details: "Comprehensive auto insurance covering collision, theft, and third-party liability. Includes roadside assistance and rental car coverage.",
    premium: "$120/month",
    notes: "Customized plan based on client's driving history and vehicle value.",
    document_ids: ["doc-1", "doc-2"],
    sent_at: "2023-05-11T09:15:00Z",
    viewed_at: "2023-05-11T14:22:00Z",
    accepted_at: "2023-05-12T11:30:00Z"
  },
  {
    id: "proposal-2",
    title: "Home Insurance Proposal",
    client_name: "Emily Johnson",
    sales_process_id: "sales-2",
    created_at: "2023-05-15T10:45:00Z",
    status: "sent",
    insurer_name: "XYZ Insurance",
    coverage_details: "Property coverage for $500,000, personal belongings for $100,000, and liability protection. Includes flood and earthquake coverage.",
    premium: "$85/month",
    document_ids: ["doc-3"],
    sent_at: "2023-05-16T08:30:00Z"
  },
  {
    id: "proposal-3",
    title: "Life Insurance Policy",
    client_name: "Michael Brown",
    sales_process_id: "sales-3",
    created_at: "2023-05-18T16:20:00Z",
    status: "draft",
    insurer_name: "Life Secure Insurance",
    coverage_details: "Term life insurance for 20 years with a death benefit of $500,000. Includes accelerated death benefit and conversion option.",
    premium: "$45/month"
  },
  {
    id: "proposal-4",
    title: "Commercial Property Insurance",
    client_name: "Business Solutions Inc.",
    sales_process_id: "sales-4",
    created_at: "2023-05-20T11:10:00Z",
    status: "rejected",
    insurer_name: "Commercial Shield Insurance",
    coverage_details: "Coverage for building ($1M), contents ($500K), business interruption, and liability. Includes coverage for equipment breakdown and employee dishonesty.",
    premium: "$750/month",
    notes: "Customized for retail business with high-value inventory",
    document_ids: ["doc-4", "doc-5", "doc-6"],
    sent_at: "2023-05-21T09:45:00Z",
    viewed_at: "2023-05-21T15:30:00Z",
    rejected_at: "2023-05-22T14:15:00Z"
  },
  {
    id: "proposal-5",
    title: "Health Insurance Plan",
    client_name: "Sarah Wilson",
    sales_process_id: "sales-5",
    created_at: "2023-05-25T13:40:00Z",
    status: "viewed",
    insurer_name: "Health First Insurance",
    coverage_details: "Comprehensive health coverage including hospital stays, outpatient care, prescription drugs, and preventive services. $1,000 deductible with 80/20 coinsurance.",
    premium: "$320/month",
    document_ids: ["doc-7"],
    sent_at: "2023-05-26T10:20:00Z",
    viewed_at: "2023-05-26T16:45:00Z"
  }
];

export default mockProposals;
