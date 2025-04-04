
import { Quote } from "@/types/quotes";

// Mock data for quotes
export const mockQuotes: Quote[] = [
  {
    id: "quote-1",
    salesProcessId: "sp-1",
    insurerName: "Alpha Insurance",
    amount: "€12,500",
    currency: "EUR",
    coverageDetails: "Full coverage with additional cyber protection",
    status: "received",
    createdAt: "2023-09-03T14:30:00Z",
    sentAt: "2023-09-03T15:20:00Z",
    responseReceivedAt: "2023-09-05T09:15:00Z",
    expiresAt: "2023-10-05T00:00:00Z",
    notes: "Client requested cyber protection and extended liability coverage"
  },
  {
    id: "quote-2",
    salesProcessId: "sp-1",
    insurerName: "Omega Assurance",
    amount: "€10,800",
    currency: "EUR",
    coverageDetails: "Standard business package",
    status: "received",
    createdAt: "2023-09-03T14:35:00Z",
    sentAt: "2023-09-03T15:20:00Z",
    responseReceivedAt: "2023-09-06T11:30:00Z",
    expiresAt: "2023-10-06T00:00:00Z",
    notes: "Basic coverage without optional add-ons"
  },
  {
    id: "quote-3",
    salesProcessId: "sp-1",
    insurerName: "Security First",
    amount: "€13,200",
    currency: "EUR",
    coverageDetails: "Premium coverage with extended liability",
    status: "pending",
    createdAt: "2023-09-03T14:40:00Z",
    sentAt: "2023-09-03T15:20:00Z",
    expiresAt: "2023-10-03T00:00:00Z",
    notes: "Premium package with all available options"
  },
  {
    id: "quote-4",
    salesProcessId: "sp-2",
    insurerName: "Health Plus",
    amount: "€8,500",
    currency: "EUR",
    coverageDetails: "Family health insurance with dental coverage",
    status: "selected",
    createdAt: "2023-08-15T10:20:00Z",
    sentAt: "2023-08-15T11:30:00Z",
    responseReceivedAt: "2023-08-18T09:45:00Z",
    selectedAt: "2023-08-25T14:20:00Z",
    expiresAt: "2023-09-18T00:00:00Z",
    notes: "Client selected this plan for comprehensive family coverage"
  },
  {
    id: "quote-5",
    salesProcessId: "sp-2",
    insurerName: "MedGuard",
    amount: "€9,200",
    currency: "EUR",
    coverageDetails: "Premium health plan with international coverage",
    status: "rejected",
    createdAt: "2023-08-15T10:25:00Z",
    sentAt: "2023-08-15T11:30:00Z",
    responseReceivedAt: "2023-08-17T14:10:00Z",
    rejectedAt: "2023-08-25T14:20:00Z",
    expiresAt: "2023-09-17T00:00:00Z",
    notes: "Client felt the premium was too high"
  },
  {
    id: "quote-6",
    salesProcessId: "sp-3",
    insurerName: "Corporate Shield",
    amount: "€75,200",
    currency: "EUR",
    coverageDetails: "Comprehensive liability insurance for law firms",
    status: "received",
    createdAt: "2023-07-20T09:15:00Z",
    sentAt: "2023-07-20T10:00:00Z",
    responseReceivedAt: "2023-07-24T15:30:00Z",
    expiresAt: "2023-08-24T00:00:00Z",
    notes: "Specialized coverage for legal practice"
  },
  {
    id: "quote-7",
    salesProcessId: "sp-4",
    insurerName: "AutoGuard",
    amount: "€28,750",
    currency: "EUR",
    coverageDetails: "Fleet insurance for 12 delivery vehicles",
    status: "selected",
    createdAt: "2023-06-05T11:20:00Z",
    sentAt: "2023-06-05T13:45:00Z",
    responseReceivedAt: "2023-06-08T09:10:00Z",
    selectedAt: "2023-06-15T14:30:00Z",
    expiresAt: "2023-07-08T00:00:00Z",
    notes: "Full coverage with roadside assistance",
    isPolicyImported: true
  }
];
