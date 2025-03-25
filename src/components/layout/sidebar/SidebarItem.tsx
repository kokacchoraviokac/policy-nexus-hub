
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

export default SidebarItem;
