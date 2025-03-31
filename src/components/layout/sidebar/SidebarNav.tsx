
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./SidebarData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface SidebarNavProps {
  collapsed: boolean;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
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
  
  return (
    <nav className="px-2 py-4">
      <ul className="space-y-1">
        {filteredItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={
              item.path
                ? location.pathname === item.path ||
                  location.pathname.startsWith(`${item.path}/`)
                : item.subItems?.some(
                    (subItem) =>
                      subItem.path &&
                      (location.pathname === subItem.path ||
                        location.pathname.startsWith(`${subItem.path}/`))
                  ) || false
            }
            collapsed={collapsed}
            requiredPrivilege={item.requiredPrivilege}
            subItems={item.subItems}
            isExpanded={expandedItems.includes(item.label)}
            onToggleExpand={() => toggleExpand(item.label)}
          />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNav;
