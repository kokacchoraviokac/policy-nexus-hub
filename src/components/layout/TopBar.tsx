
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import UserProfileMenu from "@/components/auth/UserProfileMenu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import LanguageSelector from "@/components/language/LanguageSelector";
import NotificationsDropdown from "@/components/notifications/NotificationsDropdown";

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
    <header className="h-16 border-b border-border flex items-center px-6 bg-white shadow-sm z-10">
      <div className="flex-1">
        {companyName && (
          <h2 className="text-lg font-semibold text-primary">
            {companyName}
          </h2>
        )}
      </div>
      
      <div className="flex items-center space-x-5">
        <LanguageSelector />
        <NotificationsDropdown />
        <UserProfileMenu />
      </div>
    </header>
  );
};

export default TopBar;
