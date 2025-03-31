
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Home,
  FileText,
  Workflow,
  FileUp,
  ClipboardList,
  FileSearch,
  SquareStack,
  Wallet,
  Users,
  BarChart3,
  Settings,
  CreditCard
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar = ({ className }: SidebarProps) => {
  const { t } = useLanguage();
  const location = useLocation();
  
  const routes = [
    {
      label: t("dashboard"),
      icon: <Home className="h-5 w-5" />,
      href: "/",
      active: location.pathname === "/",
    },
    {
      label: t("policies"),
      icon: <FileText className="h-5 w-5" />,
      href: "/policies",
      active: location.pathname.startsWith("/policies") && 
              !location.pathname.includes("/workflow") &&
              !location.pathname.includes("/import") &&
              !location.pathname.includes("/documents"),
    },
    {
      label: t("policyWorkflow"),
      icon: <Workflow className="h-5 w-5" />,
      href: "/policies/workflow",
      active: location.pathname.startsWith("/policies/workflow"),
    },
    {
      label: t("importPolicies"),
      icon: <FileUp className="h-5 w-5" />,
      href: "/policies/import",
      active: location.pathname.startsWith("/policies/import"),
    },
    {
      label: t("policyDocuments"),
      icon: <FileSearch className="h-5 w-5" />,
      href: "/policies/documents",
      active: location.pathname.startsWith("/policies/documents"),
    },
    {
      label: t("claims"),
      icon: <ClipboardList className="h-5 w-5" />,
      href: "/claims",
      active: location.pathname.startsWith("/claims"),
    },
    {
      label: t("sales"),
      icon: <SquareStack className="h-5 w-5" />,
      href: "/sales",
      active: location.pathname.startsWith("/sales"),
    },
    {
      label: t("finances"),
      icon: <Wallet className="h-5 w-5" />,
      href: "/finances",
      active: location.pathname.startsWith("/finances"),
    },
    {
      label: t("agents"),
      icon: <Users className="h-5 w-5" />,
      href: "/agents",
      active: location.pathname.startsWith("/agents"),
    },
    {
      label: t("reports"),
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/reports",
      active: location.pathname.startsWith("/reports"),
    },
    {
      label: t("payments"),
      icon: <CreditCard className="h-5 w-5" />,
      href: "/payments",
      active: location.pathname.startsWith("/payments"),
    },
    {
      label: t("settings"),
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
      active: location.pathname.startsWith("/settings"),
    },
  ];
  
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  route.active ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                {route.icon}
                <span className="ml-3">{route.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
