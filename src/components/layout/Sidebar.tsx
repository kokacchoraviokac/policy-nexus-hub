
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Home,
  FileText,
  Workflow,
  FileUp,
  FileSearch,
  ClipboardList,
  SquareStack,
  Wallet,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface SidebarItemType {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
  subItems?: {
    label: string;
    href: string;
  }[];
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar = ({ className }: SidebarProps) => {
  const { t } = useLanguage();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    );
  };
  
  const routes: SidebarItemType[] = [
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
      active: location.pathname.startsWith("/policies"),
      subItems: [
        { label: t("allPolicies"), href: "/policies" },
        { label: t("policiesWorkflow"), href: "/policies/workflow" },
        { label: t("importPolicies"), href: "/policies/import" },
        { label: t("policyDocuments"), href: "/policies/documents" }
      ]
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
      subItems: [
        { label: t("pipelineOverview"), href: "/sales/pipeline" },
        { label: t("leads"), href: "/sales/leads" },
        { label: t("salesProcesses"), href: "/sales/processes" },
        { label: t("responsiblePersons"), href: "/sales/responsible" }
      ]
    },
    {
      label: t("finances"),
      icon: <Wallet className="h-5 w-5" />,
      href: "/finances",
      active: location.pathname.startsWith("/finances"),
      subItems: [
        { label: t("commissions"), href: "/finances/commissions" },
        { label: t("invoicing"), href: "/finances/invoicing" },
        { label: t("statementProcessing"), href: "/finances/statements" }
      ]
    },
    {
      label: t("agents"),
      icon: <Users className="h-5 w-5" />,
      href: "/agents",
      active: location.pathname.startsWith("/agents"),
      subItems: [
        { label: t("fixedCommissions"), href: "/agents/fixed-commissions" },
        { label: t("clientCommissions"), href: "/agents/client-commissions" },
        { label: t("manualCommissions"), href: "/agents/manual-commissions" },
        { label: t("calculatePayouts"), href: "/agents/calculate-payouts" },
        { label: t("payoutReports"), href: "/agents/payout-reports" }
      ]
    },
    {
      label: t("reports"),
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/reports",
      active: location.pathname.startsWith("/reports"),
      subItems: [
        { label: t("productionReport"), href: "/reports/production" },
        { label: t("clientsReport"), href: "/reports/clients" },
        { label: t("agentsReport"), href: "/reports/agents" },
        { label: t("claimsReport"), href: "/reports/claims" }
      ]
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
      subItems: [
        { label: t("employees"), href: "/settings/employees" },
        { label: t("privileges"), href: "/settings/privileges" },
        { label: t("companyData"), href: "/settings/company" },
        { label: t("instructions"), href: "/settings/instructions" }
      ]
    },
  ];
  
  return (
    <div className={cn("pb-12 bg-sidebar text-sidebar-foreground", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <div key={route.href} className="mb-1">
                {route.subItems && route.subItems.length > 0 ? (
                  <div>
                    <button 
                      onClick={() => toggleExpand(route.label)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                        route.active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "transparent"
                      )}
                    >
                      <div className="flex items-center">
                        {route.icon}
                        <span className="ml-3">{route.label}</span>
                      </div>
                      {expandedItems.includes(route.label) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {expandedItems.includes(route.label) && (
                      <div className="pl-9 mt-1 space-y-1">
                        {route.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                              location.pathname === subItem.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "transparent"
                            )}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={route.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                      route.active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "transparent"
                    )}
                  >
                    {route.icon}
                    <span className="ml-3">{route.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
