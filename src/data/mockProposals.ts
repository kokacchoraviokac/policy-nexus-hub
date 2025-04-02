
import { Proposal } from "@/types/sales";

// Mock data for proposals
export const mockProposals: Proposal[] = [
  {
    id: "prop-1",
    title: "Premium Business Insurance Package",
    clientName: "Alpha Technologies",
    salesProcessId: "sp-1",
    createdAt: "2023-08-01T10:30:00Z",
    sentAt: "2023-08-02T14:15:00Z",
    status: "sent",
    insurerName: "SafeGuard Insurance",
    coverageDetails: "Comprehensive business liability coverage including cyber protection, property damage, and business interruption.",
    premium: "€12,500 annually",
    notes: "Customized package for tech companies",
    documents: ["Business_Coverage_Details.pdf", "Terms_and_Conditions.pdf"]
  },
  {
    id: "prop-2",
    title: "Family Health Insurance Plan",
    clientName: "Emily Davis",
    salesProcessId: "sp-2",
    createdAt: "2023-07-25T09:45:00Z",
    sentAt: "2023-07-26T11:20:00Z",
    viewedAt: "2023-07-26T15:30:00Z",
    status: "viewed",
    insurerName: "MediSure Health",
    coverageDetails: "Full family health coverage with dental and vision options.",
    premium: "€750 monthly",
    documents: ["Health_Plan_Options.pdf"]
  },
  {
    id: "prop-3",
    title: "Corporate Liability Policy",
    clientName: "Johnson & Associates",
    salesProcessId: "sp-3",
    createdAt: "2023-07-15T13:00:00Z",
    sentAt: "2023-07-16T10:00:00Z",
    viewedAt: "2023-07-16T14:25:00Z",
    expiresAt: "2023-08-16T00:00:00Z",
    status: "accepted",
    insurerName: "Corporate Shield Insurance",
    coverageDetails: "Directors and officers liability insurance with extended coverage options.",
    premium: "€45,000 annually",
    notes: "Special terms for legal firms"
  },
  {
    id: "prop-4",
    title: "Vehicle Fleet Insurance",
    clientName: "Garcia Delivery",
    salesProcessId: "sp-4",
    createdAt: "2023-07-10T16:30:00Z",
    status: "draft",
    insurerName: "AutoSafe Insurance",
    coverageDetails: "Comprehensive coverage for a fleet of 12 delivery vehicles.",
    premium: "€28,750 annually",
    notes: "Coverage includes GPS tracking and roadside assistance"
  },
  {
    id: "prop-5",
    title: "Property Insurance Renewal",
    clientName: "Lee Technologies",
    salesProcessId: "sp-5",
    createdAt: "2023-06-20T11:15:00Z",
    sentAt: "2023-06-21T09:30:00Z",
    viewedAt: "2023-06-21T14:00:00Z",
    expiresAt: "2023-07-21T00:00:00Z",
    status: "rejected",
    insurerName: "PropertyGuard Insurance",
    coverageDetails: "Commercial property insurance covering the main office and warehouse.",
    premium: "€18,500 annually",
    notes: "Client requested lower premiums or additional coverage options"
  }
];
