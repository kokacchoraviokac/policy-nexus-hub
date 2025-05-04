
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { LucideIcon } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import SidebarData from "./SidebarData";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";

interface ModernSidebarNavProps {
  collapsed: boolean;
}

const ModernSidebarNav: React.FC<ModernSidebarNavProps> = ({ collapsed }) => {
  const { t } = useLanguage();
  const location = useLocation();
  
  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const renderSubItems = (items: any[], parentPath: string) => {
    if (!items || items.length === 0) return null;
    
    return (
      <SidebarMenuSub>
        {items.map((item, index) => {
          const path = item.path || `${parentPath}/${item.id}`;
          
          return (
            <SidebarMenuSubItem key={`${item.label}-${index}`}>
              <SidebarMenuSubButton
                asChild
                isActive={isActive(path)}
              >
                <Link to={path}>
                  <span>{t(item.label)}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          );
        })}
      </SidebarMenuSub>
    );
  };

  return (
    <SidebarContent className="p-2">
      <SidebarMenu>
        {SidebarData.map((item, index) => {
          const Icon = item.icon as LucideIcon;
          const path = item.path || `/${item.id}`;
          
          return (
            <SidebarMenuItem key={`${item.label}-${index}`}>
              <SidebarMenuButton
                asChild
                isActive={isActive(path)}
              >
                <Link to={path} className="flex items-center">
                  {Icon && <Icon className="mr-2 h-5 w-5" />}
                  <span>{t(item.label)}</span>
                </Link>
              </SidebarMenuButton>
              
              {!collapsed && renderSubItems(item.items, path)}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarContent>
  );
};

export default ModernSidebarNav;
