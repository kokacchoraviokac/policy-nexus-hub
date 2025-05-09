
import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import TopBar from "./TopBar";
import ModernSidebar from "./sidebar/ModernSidebar";
import BreadcrumbNav from "./BreadcrumbNav";
import Footer from "./Footer";

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Modern Sidebar with collapsible functionality */}
      <ModernSidebar 
        collapsed={sidebarCollapsed} 
        onCollapsedChange={setSidebarCollapsed} 
      />
      
      {/* Main content + fixed footer */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        
        {/* BreadcrumbNav with improved margin/padding for better visual hierarchy */}
        <div className="px-6 py-3">
          <BreadcrumbNav />
        </div>
        
        {/* Scrollable main content */}
        <main className="flex-1 overflow-auto animate-enter">
          <div className="p-6 flex-1">
            {children || <Outlet />}
          </div>
        </main>
        
        {/* Fixed footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
