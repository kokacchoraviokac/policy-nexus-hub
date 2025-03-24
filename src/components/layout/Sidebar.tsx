
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  ClipboardCheck, 
  DollarSign, 
  Book, 
  Users, 
  FileBarChart, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  collapsed: boolean;
  active: boolean;
  subItems?: { label: string; path: string }[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  path, 
  collapsed, 
  active,
  subItems 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const showSubItems = active && subItems && subItems.length > 0;
  
  return (
    <div>
      <Link 
        to={path} 
        className={cn(
          "sidebar-item group relative",
          active && !showSubItems ? "active" : "",
          "mb-1"
        )}
        onClick={(e) => {
          if (subItems && subItems.length > 0) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <Icon size={20} />
        {!collapsed && (
          <span className="text-sm font-medium transition-opacity duration-200">{label}</span>
        )}
        {!collapsed && subItems && subItems.length > 0 && (
          <ChevronRight 
            size={16} 
            className={cn(
              "ml-auto transition-transform", 
              isOpen && "transform rotate-90"
            )} 
          />
        )}
        {collapsed && (
          <div className="absolute left-full ml-2 top-0 w-48 p-2 rounded-md bg-sidebar-accent border border-sidebar-border shadow-glass-md scale-90 origin-left opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-10">
            <div className="font-medium text-sm mb-1 text-sidebar-accent-foreground">{label}</div>
            {subItems && subItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="block text-xs text-sidebar-foreground hover:text-sidebar-accent-foreground py-1 px-2 rounded hover:bg-sidebar-primary/10 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </Link>
      
      {!collapsed && showSubItems && isOpen && (
        <div className="ml-8 mt-1 mb-2 border-l border-sidebar-border pl-2 space-y-1">
          {subItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="block text-xs text-sidebar-foreground hover:text-sidebar-accent-foreground py-1 px-2 rounded hover:bg-sidebar-primary/10 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const sidebarItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: FileText,
      label: "Policies",
      path: "/policies",
      subItems: [
        { label: "All Policies", path: "/policies/all" },
        { label: "Policies Workflow", path: "/policies/workflow" },
        { label: "Policy Addendums", path: "/policies/addendums" },
        { label: "Unlinked Payments", path: "/policies/unlinked" },
        { label: "Documents", path: "/policies/documents" },
      ]
    },
    {
      icon: TrendingUp,
      label: "Sales",
      path: "/sales",
      subItems: [
        { label: "Pipeline Overview", path: "/sales/pipeline" },
        { label: "Leads", path: "/sales/leads" },
        { label: "Sales Processes", path: "/sales/processes" },
        { label: "Responsible Persons", path: "/sales/persons" },
      ]
    },
    {
      icon: ClipboardCheck,
      label: "Claims",
      path: "/claims",
    },
    {
      icon: DollarSign,
      label: "Finances",
      path: "/finances",
      subItems: [
        { label: "Commissions", path: "/finances/commissions" },
        { label: "Invoicing", path: "/finances/invoicing" },
        { label: "Statement Processing", path: "/finances/statements" },
      ]
    },
    {
      icon: Book,
      label: "Codebook",
      path: "/codebook",
      subItems: [
        { label: "Clients", path: "/codebook/clients" },
        { label: "Insurance Companies", path: "/codebook/companies" },
        { label: "Insurance Codes", path: "/codebook/codes" },
      ]
    },
    {
      icon: Users,
      label: "Agent",
      path: "/agent",
      subItems: [
        { label: "Fixed Commissions", path: "/agent/fixed-commissions" },
        { label: "Client Commissions", path: "/agent/client-commissions" },
        { label: "Manual Commissions", path: "/agent/manual-commissions" },
        { label: "Calculate Payouts", path: "/agent/calculate-payouts" },
        { label: "Payout Reports", path: "/agent/payout-reports" },
      ]
    },
    {
      icon: FileBarChart,
      label: "Reports",
      path: "/reports",
      subItems: [
        { label: "Production Report", path: "/reports/production" },
        { label: "Clients Report", path: "/reports/clients" },
        { label: "Agents Report", path: "/reports/agents" },
        { label: "Claims Report", path: "/reports/claims" },
      ]
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <aside 
      className={cn(
        "bg-sidebar h-full flex flex-col border-r border-sidebar-border transition-all duration-300 z-10",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-sidebar-foreground font-medium text-xl">
            Policy<span className="text-primary">Hub</span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center text-sidebar-foreground font-medium text-xl">
            P<span className="text-primary">H</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground p-1 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <div className="flex-1 py-4 px-2 overflow-y-auto no-scrollbar">
        <nav className="space-y-1">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              path={item.path}
              collapsed={collapsed}
              active={currentPath === item.path || currentPath.startsWith(`${item.path}/`)}
              subItems={item.subItems}
            />
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed ? "justify-center" : "px-2"
        )}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            A
          </div>
          {!collapsed && (
            <div>
              <div className="text-xs font-medium text-sidebar-foreground">Admin User</div>
              <div className="text-xs text-sidebar-foreground/70">admin@example.com</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
