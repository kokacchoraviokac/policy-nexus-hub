
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import UserProfileMenu from "@/components/auth/UserProfileMenu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface TopBarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const TopBar: React.FC<TopBarProps> = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const fetchCompanyName = async () => {
      if (user?.companyId) {
        try {
          const { data, error } = await supabase
            .from('companies')
            .select('name')
            .eq('id', user.companyId)
            .single();
          
          if (error) {
            console.error("Error fetching company name:", error);
            return;
          }
          
          if (data) {
            setCompanyName(data.name);
          }
        } catch (error) {
          console.error("Failed to fetch company name:", error);
        }
      }
    };
    
    fetchCompanyName();
  }, [user]);

  return (
    <header className="h-16 border-b border-border flex items-center px-4 bg-white/80 backdrop-blur-sm">
      <div className="flex-1">
        {companyName && (
          <h2 className="text-lg font-semibold text-primary">
            {companyName}
          </h2>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-secondary transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
        </button>
        
        <UserProfileMenu />
      </div>
    </header>
  );
};

export default TopBar;
