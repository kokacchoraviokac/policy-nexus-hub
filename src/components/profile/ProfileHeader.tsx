
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/auth/userTypes";
import { Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

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
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar_url || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
            <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center mt-1 text-sm">
              <Shield className="w-4 h-4 mr-1 text-primary" />
              <span>
                {t(`roles.${user.role.toLowerCase()}`)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
