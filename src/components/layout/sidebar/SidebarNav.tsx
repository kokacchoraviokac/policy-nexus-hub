
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./SidebarData";

interface SidebarNavProps {
  collapsed: boolean;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed }) => {
  const location = useLocation();
  const { hasPrivilege } = useAuth();
  const currentPath = location.pathname;
  
  // Filter sidebar items based on user privileges
  const authorizedSidebarItems = sidebarItems.filter(item => 
    hasPrivilege(item.requiredPrivilege)
  );

  return (
    <div className="py-4 px-2">
      <nav className="space-y-1">
        {authorizedSidebarItems.map((item, index) => {
          const isActiveParent = currentPath === item.path || 
                              currentPath.startsWith(`${item.path}/`);
          
          // Also check if any subitem path matches the current path
          const hasActiveChild = item.subItems?.some(
            subItem => currentPath === subItem.path
          );
          
          return (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              path={item.path}
              collapsed={collapsed}
              active={isActiveParent || !!hasActiveChild}
              requiredPrivilege={item.requiredPrivilege}
              subItems={item.subItems}
            />
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarNav;
