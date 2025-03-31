
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./SidebarData";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarNavProps {
  collapsed: boolean;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Auto-expand items based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find which parent menu items need to be expanded based on current path
    const itemsToExpand = sidebarItems
      .filter(item => 
        item.subItems?.some(subItem => 
          currentPath === subItem.path || currentPath.startsWith(`${subItem.path}/`)
        )
      )
      .map(item => item.label);
    
    if (itemsToExpand.length > 0) {
      setExpandedItems(prev => {
        // Only add items that aren't already expanded
        const newItems = itemsToExpand.filter(item => !prev.includes(item));
        if (newItems.length > 0) {
          return [...prev, ...newItems];
        }
        return prev;
      });
    }
  }, [location.pathname]);
  
  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    );
  };
  
  if (!user) return null;
  
  // Filter sidebarItems based on user role if needed
  const filteredItems = sidebarItems;
  
  // Find the most specific active path
  const currentPath = location.pathname;
  
  return (
    <nav className="px-2 py-4">
      <ul className="space-y-1">
        {filteredItems.map((item, index) => {
          // Check if this item has an active sub-item
          const hasActiveSubItem = item.subItems?.some(
            subItem => 
              subItem.path && 
              (currentPath === subItem.path || 
               currentPath.startsWith(`${subItem.path}/`))
          );
          
          // An item is active if:
          // 1. It has no sub-items and its path matches the current path
          // 2. It has no exact path match AND none of its sub-items are active
          const isActive = item.path 
            ? (currentPath === item.path || currentPath.startsWith(`${item.path}/`)) && !hasActiveSubItem
            : false;
            
          return (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={isActive}
              collapsed={collapsed}
              requiredPrivilege={item.requiredPrivilege}
              subItems={item.subItems}
              isExpanded={expandedItems.includes(item.label)}
              onToggleExpand={() => toggleExpand(item.label)}
              currentPath={currentPath}
            />
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarNav;
