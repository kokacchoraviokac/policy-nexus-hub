
import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
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
      {/* Sidebar - independently scrollable */}
      <div className={cn(
        "h-screen overflow-y-auto transition-all duration-300",
        sidebarCollapsed ? "w-0 opacity-0" : "w-64 opacity-100"
      )}>
        <Sidebar />
      </div>
      
      {/* Main content + fixed footer */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar 
          sidebarCollapsed={sidebarCollapsed} 
          setSidebarCollapsed={setSidebarCollapsed} 
        />
        
        <div className="px-6 py-2">
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
