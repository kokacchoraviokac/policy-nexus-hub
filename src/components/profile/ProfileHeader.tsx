
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Shield, Building } from "lucide-react";
import { User } from "@/types/auth/userTypes";

interface ProfileHeaderProps {
  user: User;
  onAvatarChange?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onAvatarChange }) => {
  const { t } = useLanguage();
  const { role } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const getRoleBadge = () => {
    switch (role) {
      case "superAdmin":
        return (
          <div className="flex items-center text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs font-medium">
            <Shield className="w-3 h-3 mr-1" />
            {t("superAdmin")}
          </div>
        );
      case "admin":
        return (
          <div className="flex items-center text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs font-medium">
            <Shield className="w-3 h-3 mr-1" />
            {t("admin")}
          </div>
        );
      case "employee":
        return (
          <div className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-medium">
            <Building className="w-3 h-3 mr-1" />
            {t("employee")}
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-medium">
            {t("user")}
          </div>
        );
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-primary/10">
              <AvatarImage src={user.avatar_url} alt={user.name} />
              <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            
            {onAvatarChange && (
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
                onClick={onAvatarChange}
              >
                <Upload className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            
            <div className="flex gap-2 mt-2">
              {getRoleBadge()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
