
import React from "react";
import { useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import SidebarItemLink from "./components/SidebarItemLink";
import SidebarSubItems from "./components/SidebarSubItems";
import SidebarTooltip from "./components/SidebarTooltip";
import SidebarHoverCard from "./components/SidebarHoverCard";

interface SubItem {
  label: string;
  path: string;
  requiredPrivilege: string;
  icon?: LucideIcon;
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
  requiredPrivilege: string;
  subItems?: SubItem[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  path,
  active,
  collapsed,
  requiredPrivilege,
  subItems,
  isExpanded = false,
  onToggleExpand
}) => {
  const { hasPrivilege } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Filter sub-items based on user privileges
  const authorizedSubItems = subItems?.filter(item => 
    hasPrivilege(item.requiredPrivilege)
  );

  // Only render if user has required privilege
  if (!hasPrivilege(requiredPrivilege)) {
    return null;
  }

  // If no authorized sub-items exist for this item, render it as a simple link
  const hasSubItems = authorizedSubItems && authorizedSubItems.length > 0;
  
  // Check if any sub-item is currently active
  const hasActiveSubItem = hasSubItems && 
    authorizedSubItems.some(item => 
      currentPath === item.path || currentPath.startsWith(`${item.path}/`)
    );
  
  // Parent should only be active if it's exactly matched and has no active children
  const isParentActive = active && !hasActiveSubItem;
  
  // Handle item click - for items with sub-items, toggle expand/collapse
  const handleItemClick = (e: React.MouseEvent) => {
    if (hasSubItems && onToggleExpand) {
      e.preventDefault(); // Prevent navigation when toggling
      onToggleExpand();
    }
  };
  
  // Create the main item link
  const itemLink = (
    <SidebarItemLink
      icon={icon}
      label={label}
      path={path}
      active={isParentActive}
      collapsed={collapsed}
      hasSubItems={hasSubItems}
      isExpanded={isExpanded}
      onClick={handleItemClick}
    />
  );

  // When sidebar is collapsed and has sub-items, use HoverCard
  if (collapsed && hasSubItems) {
    return (
      <SidebarHoverCard 
        label={label} 
        subItems={authorizedSubItems} 
        currentPath={currentPath}
      >
        {itemLink}
      </SidebarHoverCard>
    );
  }

  // When sidebar is collapsed and no sub-items, show tooltip on hover
  if (collapsed && !hasSubItems) {
    return (
      <SidebarTooltip label={t(label)}>
        {itemLink}
      </SidebarTooltip>
    );
  }

  // Default case - when sidebar is expanded
  return (
    <div>
      {itemLink}
      {!collapsed && isExpanded && hasSubItems && (
        <SidebarSubItems 
          subItems={authorizedSubItems} 
          currentPath={currentPath} 
        />
      )}
    </div>
  );
};

export default SidebarItem;
