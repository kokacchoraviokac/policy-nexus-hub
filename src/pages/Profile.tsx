
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "@/types/auth/user";

const Profile = () => {
  const { user, updateUser, hasPrivilege } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");
  
  const canViewPrivileges = hasPrivilege("settings:view");

  // Create a wrapper function that ensures we return a Promise
  const handleUpdateUser = async (userData: Partial<User>): Promise<void> => {
    return updateUser(userData);
  };

  if (!user) {
    return <div className="p-8 text-center">{t("pleaseLoginToViewProfile")}</div>;
  }

  // Import components dynamically to avoid circular dependencies
  const ProfileHeader = React.lazy(() => import("@/components/profile/ProfileHeader"));
  const ProfileTabs = React.lazy(() => import("@/components/profile/ProfileTabs"));

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-6">{t("myProfile")}</h1>
      </div>
      
      <React.Suspense fallback={<div className="text-center p-4">{t("loading")}</div>}>
        <ProfileHeader user={user} />
        
        <ProfileTabs 
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          canViewPrivileges={canViewPrivileges}
          updateUser={handleUpdateUser}
        />
      </React.Suspense>
    </div>
  );
};

export default Profile;
