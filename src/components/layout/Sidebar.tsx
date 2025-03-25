
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
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

interface SubItem {
  label: string;
  path: string;
  requiredPrivilege: string;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  collapsed: boolean;
  active: boolean;
  requiredPrivilege: string;
  subItems?: SubItem[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  path, 
  collapsed, 
  active,
  requiredPrivilege,
  subItems 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { hasPrivilege } = useAuth();
  const showSubItems = active && subItems && subItems.length > 0;
  
  // Filter subItems based on user privileges
  const authorizedSubItems = subItems?.filter(item => 
    hasPrivilege(item.requiredPrivilege)
  );
  
  // If no subItems are authorized, don't show any
  const hasAuthorizedSubItems = authorizedSubItems && authorizedSubItems.length > 0;
  
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
          if (hasAuthorizedSubItems) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <Icon size={20} />
        {!collapsed && (
          <span className="text-sm font-medium transition-opacity duration-200">{label}</span>
        )}
        {!collapsed && hasAuthorizedSubItems && (
          <ChevronRight 
            size={16} 
            className={cn(
              "ml-auto transition-transform", 
              isOpen && "transform rotate-90"
            )} 
          />
        )}
        {collapsed && hasAuthorizedSubItems && (
          <div className="absolute left-full ml-2 top-0 w-48 p-2 rounded-md bg-sidebar-accent border border-sidebar-border shadow-glass-md scale-90 origin-left opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-10">
            <div className="font-medium text-sm mb-1 text-sidebar-accent-foreground">{label}</div>
            {authorizedSubItems.map((item, index) => (
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
      
      {!collapsed && showSubItems && isOpen && hasAuthorizedSubItems && (
        <div className="ml-8 mt-1 mb-2 border-l border-sidebar-border pl-2 space-y-1">
          {authorizedSubItems.map((item, index) => (
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
  const { user, hasPrivilege } = useAuth();
  const currentPath = location.pathname;
  
  const sidebarItems = [
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
        { label: "Insurance Codes", path: "/codebook/codes", requiredPrivilege: "codebook.codes:view" },
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

  // Filter sidebar items based on user privileges
  const authorizedSidebarItems = sidebarItems.filter(item => 
    hasPrivilege(item.requiredPrivilege)
  );

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
          {authorizedSidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              path={item.path}
              collapsed={collapsed}
              active={currentPath === item.path || currentPath.startsWith(`${item.path}/`)}
              requiredPrivilege={item.requiredPrivilege}
              subItems={item.subItems}
            />
          ))}
        </nav>
      </div>
      
      {user && (
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn(
            "flex items-center gap-3",
            collapsed ? "justify-center" : "px-2"
          )}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              {user.name.charAt(0)}
            </div>
            {!collapsed && (
              <div>
                <div className="text-xs font-medium text-sidebar-foreground">{user.name}</div>
                <div className="text-xs text-sidebar-foreground/70">{user.email}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
