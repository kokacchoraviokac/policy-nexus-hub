
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth/AuthContext";
import { User, UserRole } from "@/types/auth/user";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ProfileEditFormProps {
  user: User;
  onSubmit: (updatedUser: Partial<User>) => Promise<void>;
  isSubmitting: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  onSubmit,
  isSubmitting,
}) => {
  const { t } = useLanguage();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name || "",
    email: user.email || "",
    role: user.role || "employee" as UserRole,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit(formData);
      toast({
        title: t("profileUpdated"),
        description: t("profileUpdateSuccess"),
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("profileUpdateFailed"),
        description: t("profileUpdateError"),
        variant: "destructive",
      });
    }
  };

  // Check if the role field should be editable
  const isRoleEditable = hasRole(["superAdmin", "admin"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("editProfile")}</CardTitle>
        <CardDescription>{t("updateYourProfileInformation")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("enterYourName")}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("enterYourEmail")}
              disabled // Email should typically not be editable directly
            />
            <p className="text-sm text-muted-foreground">
              {t("emailChangeRestriction")}
            </p>
          </div>
          
          {isRoleEditable && (
            <div className="grid gap-2">
              <Label htmlFor="role">{t("role")}</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
                disabled={!isRoleEditable}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superAdmin">{t("superAdmin")}</SelectItem>
                  <SelectItem value="admin">{t("admin")}</SelectItem>
                  <SelectItem value="employee">{t("employee")}</SelectItem>
                  <SelectItem value="agent">{t("agent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("saving") : t("saveChanges")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
