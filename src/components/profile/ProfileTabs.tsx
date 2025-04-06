
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileEditForm from "./ProfileEditForm";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "@/types/auth/user";

interface ProfileTabsProps {
  user: User;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  canViewPrivileges: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

/**
 * Profile Tabs component for user profile settings
 */
const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  user, 
  activeTab, 
  setActiveTab, 
  canViewPrivileges, 
  updateUser 
}) => {
  const { t } = useLanguage();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <Card className="w-full shadow-sm">
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="border-b w-full rounded-none justify-start">
          <TabsTrigger value="profile" className="rounded-none">
            {t("generalInfo")}
          </TabsTrigger>
          <TabsTrigger value="password" className="rounded-none">
            {t("password")}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-none">
            {t("notifications")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="p-6">
          <ProfileEditForm user={user} updateUser={updateUser} />
        </TabsContent>
        
        <TabsContent value="password" className="p-6">
          <div>{t("passwordChangeFeatureComingSoon")}</div>
        </TabsContent>
        
        <TabsContent value="notifications" className="p-6">
          <div>{t("notificationsFeatureComingSoon")}</div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProfileTabs;
