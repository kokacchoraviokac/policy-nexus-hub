
import React, { useState, useEffect } from "react";
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
  
  // State to track expanded items
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Check if current path matches any submenu item to auto-expand parent
  useEffect(() => {
    const parentPathsToExpand: string[] = [];
    
    sidebarItems.forEach(item => {
      if (item.subItems) {
        // Check if the current path matches any submenu's path or starts with it
        const hasActiveSubItem = item.subItems.some(subItem => 
          currentPath === subItem.path || currentPath.startsWith(`${subItem.path}/`)
        );
        
        // Also check if the path starts with the parent path directly
        const isParentPath = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
        
        if (hasActiveSubItem || isParentPath) {
          parentPathsToExpand.push(item.path);
        }
      }
    });
    
    if (parentPathsToExpand.length > 0) {
      setExpandedItems(prev => {
        // Create a new array with unique values
        const combined = [...prev, ...parentPathsToExpand];
        return [...new Set(combined)];
      });
    }
  }, [currentPath]);

  // Toggle expand/collapse of an item
  const toggleExpand = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };
  
  // Filter sidebar items based on user privileges
  const authorizedSidebarItems = sidebarItems.filter(item => 
    hasPrivilege(item.requiredPrivilege)
  );

  return (
    <div className="py-4 px-2">
      <nav className="space-y-1">
        {authorizedSidebarItems.map((item, index) => {
          // Check if the current path matches this item's path or starts with it
          const isActiveParent = currentPath === item.path || 
                              currentPath.startsWith(`${item.path}/`);
          
          // Also check if any subitem path matches the current path
          const hasActiveChild = item.subItems?.some(
            subItem => currentPath === subItem.path || currentPath.startsWith(`${subItem.path}/`)
          );
          
          // Check if this item is expanded
          const isExpanded = expandedItems.includes(item.path);
          
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
              isExpanded={isExpanded || isActiveParent || !!hasActiveChild}
              onToggleExpand={() => toggleExpand(item.path)}
            />
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarNav;
