
import React from "react";

interface ModernSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({ 
  collapsed, 
  onCollapsedChange 
}) => {
  // This is just a placeholder that accepts the proper props
  // Replace with your actual sidebar implementation
  
  return (
    <div className={`bg-card border-r shrink-0 ${collapsed ? 'w-16' : 'w-64'} transition-width duration-300 ease-in-out overflow-hidden`}>
      {/* Sidebar header */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <div className={`overflow-hidden ${collapsed ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          <span className="font-semibold text-lg">PolicyHub</span>
        </div>
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20"
        >
          {collapsed ? '>' : '<'}
        </button>
      </div>

      {/* Sidebar content - replace with your actual navigation */}
      <div className="py-4">
        {/* Your sidebar items would go here */}
      </div>
    </div>
  );
};

export default ModernSidebar;
