
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
  const [isOpen, setIsOpen] = React.useState(active);
  const { hasPrivilege } = useAuth();
  
  // Filter subItems based on user privileges
  const authorizedSubItems = subItems?.filter(item => 
    hasPrivilege(item.requiredPrivilege)
  );
  
  // If no subItems are authorized, don't show any
  const hasAuthorizedSubItems = authorizedSubItems && authorizedSubItems.length > 0;
  
  React.useEffect(() => {
    // When the active state changes, update the isOpen state accordingly
    if (active) {
      setIsOpen(true);
    }
  }, [active]);

  const mainItemContent = (
    <>
      <Icon size={20} />
      {!collapsed && (
        <span className="text-sm font-medium transition-opacity duration-200 ml-2">{label}</span>
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
    </>
  );
  
  return (
    <div>
      {/* Parent item */}
      <div 
        className={cn(
          "sidebar-item group relative",
          active ? "active" : "",
          "mb-1 cursor-pointer"
        )}
        onClick={(e) => {
          if (hasAuthorizedSubItems) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  to={path} 
                  className="flex items-center w-full h-full"
                  onClick={(e) => {
                    if (hasAuthorizedSubItems) {
                      e.preventDefault();
                    }
                  }}
                >
                  {mainItemContent}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Link 
            to={path} 
            className="flex items-center w-full h-full"
            onClick={(e) => {
              if (hasAuthorizedSubItems) {
                e.preventDefault();
              }
            }}
          >
            {mainItemContent}
          </Link>
        )}
        
        {collapsed && hasAuthorizedSubItems && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="absolute inset-0 cursor-pointer" />
            </HoverCardTrigger>
            <HoverCardContent 
              side="right" 
              align="start" 
              className="w-48 p-2 rounded-md bg-sidebar-accent border border-sidebar-border shadow-glass-md z-50"
            >
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
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
      
      {/* Sub-items for expanded view */}
      {!collapsed && hasAuthorizedSubItems && isOpen && (
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
