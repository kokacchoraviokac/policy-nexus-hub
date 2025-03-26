
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
  Tag
} from "lucide-react";

export const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
    requiredPrivilege: "dashboard:view"
  },
  {
    icon: FileText,
    label: "Policies",
    path: "/policies",
    requiredPrivilege: "policies:view"
  },
  {
    icon: Briefcase,
    label: "Sales",
    path: "/sales",
    requiredPrivilege: "sales:view"
  },
  {
    icon: ClipboardList,
    label: "Claims",
    path: "/claims",
    requiredPrivilege: "claims:view"
  },
  {
    icon: DollarSign,
    label: "Finances",
    path: "/finances",
    requiredPrivilege: "finances:view"
  },
  {
    icon: Book,
    label: "Codebook",
    path: "/codebook",
    requiredPrivilege: "codebook:view",
    subItems: [
      {
        label: "Clients",
        path: "/codebook/clients",
        requiredPrivilege: "codebook.clients:view",
        icon: Users
      },
      {
        label: "Insurance Companies",
        path: "/codebook/companies",
        requiredPrivilege: "codebook.companies:view",
        icon: Building2
      },
      {
        label: "Insurance Products",
        path: "/codebook/products",
        requiredPrivilege: "codebook.codes:view",
        icon: Tag
      }
    ]
  },
  {
    icon: CircleDollarSign,
    label: "Agent",
    path: "/agent",
    requiredPrivilege: "agent:view"
  },
  {
    icon: FileText,
    label: "Reports",
    path: "/reports",
    requiredPrivilege: "reports:view"
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    requiredPrivilege: "settings:view"
  }
];
