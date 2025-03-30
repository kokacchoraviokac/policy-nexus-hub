
import {
  Book,
  DollarSign,
  FileText,
  LayoutDashboard,
  Briefcase,
  CircleDollarSign,
  Settings,
  Users,
  Building2,
  ClipboardList,
  Tag,
  FileBox,
  Workflow,
  FileArchive,
  CreditCard,
  FileImage
} from "lucide-react";

export const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: "dashboard",
    path: "/",
    requiredPrivilege: "dashboard:view"
  },
  {
    icon: FileText,
    label: "policies",
    path: "/policies",
    requiredPrivilege: "policies:view",
    subItems: [
      {
        label: "allPolicies",
        path: "/policies",
        requiredPrivilege: "policies:view",
        icon: FileBox
      },
      {
        label: "policiesWorkflow",
        path: "/policies/workflow",
        requiredPrivilege: "policies:view",
        icon: Workflow
      },
      {
        label: "policyAddendums",
        path: "/policies/addendums",
        requiredPrivilege: "policies:view",
        icon: FileArchive
      },
      {
        label: "documents",
        path: "/policies/documents",
        requiredPrivilege: "policies:view",
        icon: FileImage
      }
    ]
  },
  {
    icon: Briefcase,
    label: "sales",
    path: "/sales",
    requiredPrivilege: "sales:view"
  },
  {
    icon: ClipboardList,
    label: "claims",
    path: "/claims",
    requiredPrivilege: "claims:view"
  },
  {
    icon: DollarSign,
    label: "finances",
    path: "/finances",
    requiredPrivilege: "finances:view",
    subItems: [
      {
        label: "commissions",
        path: "/finances/commissions",
        requiredPrivilege: "finances.commissions:view",
        icon: CircleDollarSign
      },
      {
        label: "invoicing",
        path: "/finances/invoicing",
        requiredPrivilege: "finances.invoicing:view",
        icon: FileText
      },
      {
        label: "statementProcessing",
        path: "/finances/statements",
        requiredPrivilege: "finances.statements:view",
        icon: FileArchive
      },
      {
        label: "unlinkedPayments",
        path: "/finances/unlinked-payments",
        requiredPrivilege: "finances.payments:view",
        icon: CreditCard
      }
    ]
  },
  {
    icon: Book,
    label: "codebook",
    path: "/codebook",
    requiredPrivilege: "codebook:view",
    subItems: [
      {
        label: "clients",
        path: "/codebook/clients",
        requiredPrivilege: "codebook.clients:view",
        icon: Users
      },
      {
        label: "insuranceCompanies",
        path: "/codebook/companies",
        requiredPrivilege: "codebook.companies:view",
        icon: Building2
      },
      {
        label: "insuranceProducts",
        path: "/codebook/products",
        requiredPrivilege: "codebook.codes:view",
        icon: Tag
      }
    ]
  },
  {
    icon: CircleDollarSign,
    label: "agent",
    path: "/agent",
    requiredPrivilege: "agent:view"
  },
  {
    icon: FileText,
    label: "reports",
    path: "/reports",
    requiredPrivilege: "reports:view"
  },
  {
    icon: Settings,
    label: "settings",
    path: "/settings",
    requiredPrivilege: "settings:view"
  }
];
