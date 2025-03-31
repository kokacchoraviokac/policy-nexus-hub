
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SidebarItem from "./SidebarItem";
import { SidebarData } from "./SidebarData";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarNavProps {
  collapsed: boolean;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ collapsed }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Filter SidebarData based on user role if needed
  const filteredItems = SidebarData;
  
  return (
    <nav className="px-2 py-4">
      <ul className="space-y-1">
        {filteredItems.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            isActive={
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
          />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNav;
