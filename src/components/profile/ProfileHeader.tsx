
import React from "react";
import { User, UserRole } from "@/types/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { t } = useLanguage();
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "superAdmin":
        return t("superAdmin");
      case "admin":
        return t("brokerAdmin");
      case "employee":
        return t("employee");
      default:
        return "User";
    }
  };

  return (
    <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
      <Avatar className="h-24 w-24 mb-4 sm:mb-0">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-muted-foreground">{user.email}</p>
        <div className="mt-1">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {getRoleLabel(user.role)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
