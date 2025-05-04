
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
    
    // Find which section items need to be expanded based on current path
    const itemsToExpand = sidebarItems
      .filter(section => 
        section.items.some(item => 
          currentPath === item.path || currentPath.startsWith(`${item.path}/`)
        )
      )
      .map(section => section.title);
    
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
  
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title) 
        : [...prev, title]
    );
  };
  
  if (!user) return null;
  
  // Find the most specific active path
  const currentPath = location.pathname;
  
  return (
    <nav className="px-2 py-4 h-full overflow-y-auto sidebar-scrollbar">
      <ul className="space-y-1">
        {sidebarItems.map((section, index) => {
          const isExpanded = expandedItems.includes(section.title);
          
          return (
            <li key={index} className="mb-2">
              {/* Section title */}
              <div 
                className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                onClick={() => toggleExpand(section.title)}
              >
                {t(section.title)}
              </div>
              
              {/* Section items */}
              {(collapsed || isExpanded) && (
                <ul className="mt-1">
                  {section.items.map((item, itemIndex) => {
                    const isActive = currentPath === item.path || 
                                   currentPath.startsWith(`${item.path}/`);
                                    
                    return (
                      <SidebarItem
                        key={itemIndex}
                        icon={item.icon}
                        label={item.label}
                        path={item.path}
                        active={isActive}
                        collapsed={collapsed}
                        requiredPrivilege={item.requiredPrivilege}
                        currentPath={currentPath}
                      />
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarNav;
