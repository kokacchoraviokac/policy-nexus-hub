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
  FileImage,
  PieChart,
  UserSquare,
  ReceiptText,
  KanbanSquare,
  UserCircle,
  UserPlus,
  Calculator,
  LineChart,
  BarChart3,
  ClipboardList as ClipboardListIcon,
  UserCog,
  Shield,
  Building,
  HelpCircle
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
      },
      {
        label: "unlinkedPayments",
        path: "/policies/unlinked-payments",
        requiredPrivilege: "policies:view",
        icon: CreditCard
      }
    ]
  },
  {
    icon: Briefcase,
    label: "sales",
    path: "/sales",
    requiredPrivilege: "sales:view",
    subItems: [
      {
        label: "pipelineOverview",
        path: "/sales/pipeline",
        requiredPrivilege: "sales:view",
        icon: KanbanSquare
      },
      {
        label: "leads",
        path: "/sales/leads",
        requiredPrivilege: "sales:view",
        icon: UserPlus
      },
      {
        label: "salesProcesses",
        path: "/sales/processes",
        requiredPrivilege: "sales:view",
        icon: Workflow
      },
      {
        label: "responsiblePersons",
        path: "/sales/responsible",
        requiredPrivilege: "sales:view",
        icon: UserCircle
      }
    ]
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
        requiredPrivilege: "finances:view",
        icon: CircleDollarSign
      },
      {
        label: "invoicing",
        path: "/finances/invoicing",
        requiredPrivilege: "finances:view",
        icon: ReceiptText
      },
      {
        label: "statementProcessing",
        path: "/finances/statements",
        requiredPrivilege: "finances:view",
        icon: FileArchive
      },
      {
        label: "unlinkedPayments",
        path: "/finances/unlinked-payments",
        requiredPrivilege: "finances:view",
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
    requiredPrivilege: "agent:view",
    subItems: [
      {
        label: "agents",
        path: "/agent/agents",
        requiredPrivilege: "agent:view",
        icon: Users
      },
      {
        label: "fixedCommissions",
        path: "/agent/fixed-commissions",
        requiredPrivilege: "agent:view",
        icon: DollarSign
      },
      {
        label: "clientCommissions",
        path: "/agent/client-commissions",
        requiredPrivilege: "agent:view",
        icon: UserCircle
      },
      {
        label: "manualCommissions",
        path: "/agent/manual-commissions",
        requiredPrivilege: "agent:view",
        icon: FileText
      },
      {
        label: "calculatePayouts",
        path: "/agent/calculate-payouts",
        requiredPrivilege: "agent:view",
        icon: Calculator
      },
      {
        label: "payoutReports",
        path: "/agent/payout-reports",
        requiredPrivilege: "agent:view",
        icon: PieChart
      }
    ]
  },
  {
    icon: FileText,
    label: "reports",
    path: "/reports",
    requiredPrivilege: "reports:view",
    subItems: [
      {
        label: "productionReport",
        path: "/reports/policies",
        requiredPrivilege: "reports:view",
        icon: LineChart
      },
      {
        label: "financialReport",
        path: "/reports/financial",
        requiredPrivilege: "reports:view",
        icon: DollarSign
      },
      {
        label: "clientsReport",
        path: "/reports/clients",
        requiredPrivilege: "reports:view",
        icon: UserSquare
      },
      {
        label: "agentsReport",
        path: "/reports/agents",
        requiredPrivilege: "reports:view",
        icon: UserCog
      },
      {
        label: "claimsReport",
        path: "/reports/claims",
        requiredPrivilege: "reports:view",
        icon: ClipboardListIcon
      }
    ]
  },
  {
    icon: Settings,
    label: "settings",
    path: "/settings",
    requiredPrivilege: "settings:view",
    subItems: [
      {
        label: "employees",
        path: "/settings/employees",
        requiredPrivilege: "settings:view",
        icon: Users
      },
      {
        label: "privileges",
        path: "/settings/privileges",
        requiredPrivilege: "settings:view",
        icon: Shield
      },
      {
        label: "companyData",
        path: "/settings/company",
        requiredPrivilege: "settings:view",
        icon: Building
      },
      {
        label: "instructions",
        path: "/settings/instructions",
        requiredPrivilege: "settings:view",
        icon: HelpCircle
      },
      {
        label: "userManagement",
        path: "/settings/users",
        requiredPrivilege: "users:manage",
        icon: UserCog
      },
      {
        label: "privilegeTesting",
        path: "/settings/privileges/test",
        requiredPrivilege: "settings:view",
        icon: Shield
      }
    ]
  }
];
