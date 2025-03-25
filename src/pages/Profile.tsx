
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { User } from "@/types/auth";

const Profile = () => {
  const { user, updateUser, hasPrivilege } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  const canViewPrivileges = hasPrivilege("settings:view");

  // Create a wrapper function that ensures we return a Promise
  const handleUpdateUser = async (userData: Partial<User>): Promise<void> => {
    return updateUser(userData);
  };

  if (!user) {
    return <div className="p-8 text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-6">My Profile</h1>
      </div>
      
      <ProfileHeader user={user} />
      
      <ProfileTabs 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        canViewPrivileges={canViewPrivileges}
        updateUser={handleUpdateUser}
      />
    </div>
  );
};

export default Profile;
