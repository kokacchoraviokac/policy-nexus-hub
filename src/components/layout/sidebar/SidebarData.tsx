import React from "react";
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  ClipboardCheck, 
  DollarSign, 
  Book, 
  Users, 
  FileBarChart, 
  Settings
} from "lucide-react";

interface SubItem {
  label: string;
  path: string;
  requiredPrivilege: string;
}

interface SidebarItemData {
  icon: React.ElementType;
  label: string;
  path: string;
  requiredPrivilege: string;
  subItems?: SubItem[];
}

export const sidebarItems: SidebarItemData[] = [
  {
    icon: BarChart3,
    label: "Dashboard",
    path: "/",
    requiredPrivilege: "dashboard:view"
  },
  {
    icon: FileText,
    label: "Policies",
    path: "/policies",
    requiredPrivilege: "policies:view",
    subItems: [
      { label: "All Policies", path: "/policies/all", requiredPrivilege: "policies.all:view" },
      { label: "Policies Workflow", path: "/policies/workflow", requiredPrivilege: "policies.workflow:view" },
      { label: "Policy Addendums", path: "/policies/addendums", requiredPrivilege: "policies.addendums:view" },
      { label: "Unlinked Payments", path: "/policies/unlinked", requiredPrivilege: "policies.unlinked:view" },
      { label: "Documents", path: "/policies/documents", requiredPrivilege: "policies.documents:view" },
    ]
  },
  {
    icon: TrendingUp,
    label: "Sales",
    path: "/sales",
    requiredPrivilege: "sales:view",
    subItems: [
      { label: "Pipeline Overview", path: "/sales/pipeline", requiredPrivilege: "sales.pipeline:view" },
      { label: "Leads", path: "/sales/leads", requiredPrivilege: "sales.leads:view" },
      { label: "Sales Processes", path: "/sales/processes", requiredPrivilege: "sales.processes:view" },
      { label: "Responsible Persons", path: "/sales/persons", requiredPrivilege: "sales.persons:view" },
    ]
  },
  {
    icon: ClipboardCheck,
    label: "Claims",
    path: "/claims",
    requiredPrivilege: "claims:view",
  },
  {
    icon: DollarSign,
    label: "Finances",
    path: "/finances",
    requiredPrivilege: "finances:view",
    subItems: [
      { label: "Commissions", path: "/finances/commissions", requiredPrivilege: "finances.commissions:view" },
      { label: "Invoicing", path: "/finances/invoicing", requiredPrivilege: "finances.invoicing:view" },
      { label: "Statement Processing", path: "/finances/statements", requiredPrivilege: "finances.statements:view" },
    ]
  },
  {
    icon: Book,
    label: "Codebook",
    path: "/codebook",
    requiredPrivilege: "codebook:view",
    subItems: [
      { label: "Clients", path: "/codebook/clients", requiredPrivilege: "codebook.clients:view" },
      { label: "Insurance Companies", path: "/codebook/companies", requiredPrivilege: "codebook.companies:view" },
      { label: "Insurance Products", path: "/codebook/products", requiredPrivilege: "codebook.codes:view" },
    ]
  },
  {
    icon: Users,
    label: "Agent",
    path: "/agent",
    requiredPrivilege: "agent:view",
    subItems: [
      { label: "Fixed Commissions", path: "/agent/fixed-commissions", requiredPrivilege: "agent.fixed-commissions:view" },
      { label: "Client Commissions", path: "/agent/client-commissions", requiredPrivilege: "agent.client-commissions:view" },
      { label: "Manual Commissions", path: "/agent/manual-commissions", requiredPrivilege: "agent.manual-commissions:view" },
      { label: "Calculate Payouts", path: "/agent/calculate-payouts", requiredPrivilege: "agent.calculate-payouts:view" },
      { label: "Payout Reports", path: "/agent/payout-reports", requiredPrivilege: "agent.payout-reports:view" },
    ]
  },
  {
    icon: FileBarChart,
    label: "Reports",
    path: "/reports",
    requiredPrivilege: "reports:view",
    subItems: [
      { label: "Production Report", path: "/reports/production", requiredPrivilege: "reports.production:view" },
      { label: "Clients Report", path: "/reports/clients", requiredPrivilege: "reports.clients:view" },
      { label: "Agents Report", path: "/reports/agents", requiredPrivilege: "reports.agents:view" },
      { label: "Claims Report", path: "/reports/claims", requiredPrivilege: "reports.claims:view" },
    ]
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    requiredPrivilege: "settings:view",
  },
];
