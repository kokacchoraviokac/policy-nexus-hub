
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
          currentPath === subItem.path || 
          currentPath.startsWith(`${subItem.path}/`)
        );
        
        // Also check if the path starts with the parent path directly
        const isParentPath = 
          currentPath === item.path || 
          currentPath.startsWith(`${item.path}/`);
        
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
          // Extract the base path for comparison (e.g., "policies" from "/policies/workflow")
          const baseCurrentPath = currentPath.split("/").filter(Boolean)[0] || "";
          const baseItemPath = item.path.split("/").filter(Boolean)[0] || "";
          
          // Check if the current path matches this item's base path
          const isMatchingBase = baseCurrentPath === baseItemPath;
          
          // Check if the current path matches this item's path exactly
          const isExactMatch = currentPath === item.path;
          
          // Check if any subitem path matches the current path exactly
          const hasExactSubMatch = item.subItems?.some(
            subItem => currentPath === subItem.path
          );
          
          // Check if current path starts with this item's path (for parent paths)
          const isParentPath = !isExactMatch && currentPath.startsWith(`${item.path}/`);
          
          // Check if current path starts with any subitem's path
          const hasSubItemParentPath = item.subItems?.some(
            subItem => !hasExactSubMatch && currentPath.startsWith(`${subItem.path}/`)
          );
          
          // Active state is when the path is an exact match, parent path, or has an active subitem
          const isActive = isExactMatch || isParentPath || hasExactSubMatch || hasSubItemParentPath;
          
          // Check if this item is expanded - this should be controlled by the expand/collapse state
          const isExpanded = expandedItems.includes(item.path);
          
          return (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              path={item.path}
              collapsed={collapsed}
              active={isActive}
              requiredPrivilege={item.requiredPrivilege}
              subItems={item.subItems}
              isExpanded={isExpanded}
              onToggleExpand={() => toggleExpand(item.path)}
            />
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarNav;
