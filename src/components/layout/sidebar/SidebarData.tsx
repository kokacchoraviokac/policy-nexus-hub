import {
  Home,
  FileText,
  Users,
  ClipboardList,
  TrendingUp,
  UserCheck,
  Briefcase,
  BarChart4,
  Settings,
  File,
  FilePlus2,
  FolderArchive,
  DollarSign,
  Calculator,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  BookOpen,
  Building2,
  BuildingStore,
  Tag,
  UserCog,
  PieChart,
  UserPlus,
  MessageSquare,
  Mail
} from "lucide-react";

export const sidebarItems = [
  {
    title: "main",
    items: [
      {
        label: "dashboard",
        path: "/",
        icon: Home,
        requiredPrivilege: "view:dashboard"
      }
    ]
  },

  // Sales section
  {
    title: "sales",
    items: [
      {
        label: "pipelineOverview",
        path: "/sales/pipeline",
        icon: TrendingUp,
        requiredPrivilege: "view:sales"
      },
      {
        label: "leads",
        path: "/sales/leads",
        icon: Users,
        requiredPrivilege: "view:leads"
      },
      {
        label: "salesProcesses",
        path: "/sales/processes",
        icon: ClipboardList,
        requiredPrivilege: "view:sales_processes"
      },
      {
        label: "emailTemplates",
        path: "/sales/email-templates",
        icon: Mail,
        requiredPrivilege: "view:email_templates"
      },
      {
        label: "activities",
        path: "/sales/activities",
        icon: MessageSquare,
        requiredPrivilege: "view:activities"
      },
      {
        label: "responsiblePersons",
        path: "/sales/responsible-persons",
        icon: UserCheck,
        requiredPrivilege: "view:responsible_persons"
      }
    ]
  },

  // Policies section
  {
    title: "policies",
    items: [
      {
        label: "allPolicies",
        path: "/policies/all",
        icon: FileText,
        requiredPrivilege: "view:policies"
      },
      {
        label: "policyTypes",
        path: "/policies/types",
        icon: File,
        requiredPrivilege: "view:policy_types"
      },
      {
        label: "policyAddendums",
        path: "/policies/addendums",
        icon: FilePlus2,
        requiredPrivilege: "view:policy_addendums"
      },
      {
        label: "unlinkedPayments",
        path: "/policies/unlinked-payments",
        icon: CreditCard,
        requiredPrivilege: "view:unlinked_payments"
      }
    ]
  },

  // Claims section
  {
    title: "claims",
    items: [
      {
        label: "allClaims",
        path: "/claims/all",
        icon: FolderArchive,
        requiredPrivilege: "view:claims"
      }
    ]
  },

  // Finance section
  {
    title: "finance",
    items: [
      {
        label: "invoices",
        path: "/finance/invoices",
        icon: Receipt,
        requiredPrivilege: "view:invoices"
      },
      {
        label: "commissions",
        path: "/finance/commissions",
        icon: DollarSign,
        requiredPrivilege: "view:commissions"
      },
      {
        label: "agentPayouts",
        path: "/finance/agent-payouts",
        icon: Calculator,
        requiredPrivilege: "view:agent_payouts"
      },
      {
        label: "bankStatements",
        path: "/finance/bank-statements",
        icon: FileSpreadsheet,
        requiredPrivilege: "view:bank_statements"
      }
    ]
  },

  // Reports section
  {
    title: "reports",
    items: [
      {
        label: "allReports",
        path: "/reports/all",
        icon: BarChart4,
        requiredPrivilege: "view:reports"
      }
    ]
  },

  // Library section
  {
    title: "library",
    items: [
      {
        label: "instructions",
        path: "/library/instructions",
        icon: BookOpen,
        requiredPrivilege: "view:instructions"
      }
    ]
  },

  // Administration section
  {
    title: "administration",
    items: [
      {
        label: "companies",
        path: "/admin/companies",
        icon: Building2,
        requiredPrivilege: "manage:companies",
      },
      {
        label: "insurers",
        path: "/admin/insurers",
        icon: BuildingStore,
        requiredPrivilege: "manage:insurers"
      },
      {
        label: "insuranceProducts",
        path: "/admin/insurance-products",
        icon: Tag,
        requiredPrivilege: "manage:insurance_products"
      },
      {
        label: "agents",
        path: "/admin/agents",
        icon: UserCog,
        requiredPrivilege: "manage:agents"
      },
      {
        label: "users",
        path: "/admin/users",
        icon: Users,
        requiredPrivilege: "manage:users"
      },
      {
        label: "invitations",
        path: "/admin/invitations",
        icon: UserPlus,
        requiredPrivilege: "manage:invitations"
      },
      {
        label: "settings",
        path: "/admin/settings",
        icon: Settings,
        requiredPrivilege: "manage:settings"
      }
    ]
  }
];

export default sidebarItems;
