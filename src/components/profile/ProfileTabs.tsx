
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileEditForm from "./ProfileEditForm";
import UserSecuritySettings from "@/components/auth/UserSecuritySettings";
import CustomPrivilegeManager from "@/components/auth/CustomPrivilegeManager";
import { User } from "@/types/auth";

interface ProfileTabsProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  canViewPrivileges: boolean;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  user,
  activeTab,
  setActiveTab,
  canViewPrivileges,
  updateUser,
}) => {
  // Determine number of tabs (2 or 3 based on privileges)
  const gridCols = canViewPrivileges ? "grid-cols-3" : "grid-cols-2";

  return (
    <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className={`grid w-full ${gridCols}`}>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        {canViewPrivileges && <TabsTrigger value="privileges">Privileges</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="profile" className="mt-6">
        <ProfileEditForm user={user} updateUser={updateUser} />
      </TabsContent>
      
      <TabsContent value="security" className="mt-6">
        <UserSecuritySettings />
      </TabsContent>
      
      {canViewPrivileges && (
        <TabsContent value="privileges" className="mt-6">
          <CustomPrivilegeManager 
            userId={user.id}
            isAdmin={user.role === "admin" || user.role === "superAdmin"}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ProfileTabs;
