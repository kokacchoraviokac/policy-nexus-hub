
import { Proposal } from "@/types/sales";

const mockProposals: Proposal[] = [
  {
    id: "1",
    title: "Auto Insurance Premium Package",
    client_name: "John Smith",
    sales_process_id: "sp-001",
    created_at: "2023-07-01T10:00:00Z",
    status: "accepted",
    insurer_name: "Allianz Insurance",
    coverage_details: "Full coverage for vehicle with additional driver protection. Includes roadside assistance and rental car coverage. Deductible: €250.",
    premium: "€1,250/year",
    notes: "Client requested additional coverage for teenage driver.",
    document_ids: ["doc-001", "doc-002"],
    sent_at: "2023-07-02T14:30:00Z",
    viewed_at: "2023-07-03T09:15:00Z",
    accepted_at: "2023-07-05T11:20:00Z"
  },
  {
    id: "2",
    title: "Home Insurance Package",
    client_name: "Sarah Johnson",
    sales_process_id: "sp-002",
    created_at: "2023-07-03T09:00:00Z",
    status: "rejected",
    insurer_name: "AXA Insurance",
    coverage_details: "Buildings and contents insurance with flood and earthquake protection. Additional coverage for high-value items. Liability coverage up to €1M.",
    premium: "€850/year",
    notes: "Client found better rate with another provider.",
    document_ids: ["doc-003"],
    sent_at: "2023-07-04T13:45:00Z",
    viewed_at: "2023-07-05T10:30:00Z",
    rejected_at: "2023-07-07T16:00:00Z"
  },
  {
    id: "3",
    title: "Life Insurance Plan",
    client_name: "Michael Brown",
    sales_process_id: "sp-003",
    created_at: "2023-07-05T14:00:00Z",
    status: "sent",
    insurer_name: "MetLife Insurance",
    coverage_details: "Term life insurance for 30 years with €500,000 coverage. Includes critical illness rider and disability benefit.",
    premium: "€75/month",
    document_ids: ["doc-004", "doc-005"],
    sent_at: "2023-07-06T11:20:00Z"
  },
  {
    id: "4",
    title: "Commercial Property Insurance",
    client_name: "ABC Corporation",
    sales_process_id: "sp-004",
    created_at: "2023-07-07T15:30:00Z",
    status: "viewed",
    insurer_name: "Zurich Insurance",
    coverage_details: "Full coverage for commercial property including liability, business interruption, and equipment protection. Specialized coverage for specific business risks.",
    premium: "€3,500/year",
    notes: "Client requested extension for coverage of new warehouse facility.",
    document_ids: ["doc-006"],
    sent_at: "2023-07-08T10:15:00Z",
    viewed_at: "2023-07-09T14:00:00Z"
  },
  {
    id: "5",
    title: "Travel Insurance Package",
    client_name: "Emily Wilson",
    sales_process_id: "sp-005",
    created_at: "2023-07-10T09:45:00Z",
    status: "draft",
    insurer_name: "Generali Insurance",
    coverage_details: "Comprehensive travel insurance covering trip cancellation, medical expenses, lost luggage, and emergency evacuation for worldwide travel.",
    premium: "€120/trip",
    document_ids: []
  }
];

export default mockProposals;
