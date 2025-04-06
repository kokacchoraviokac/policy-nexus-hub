
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "@/types/auth/user";

export interface ProfileEditFormProps {
  user: User;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user, updateUser }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    }
  });

  const onSubmit = async (data: { name: string; email: string }) => {
    try {
      await updateUser({
        name: data.name,
        email: data.email,
      });
      
      toast({
        title: t("profileUpdated"),
        description: t("profileUpdatedSuccessfully"),
      });
    } catch (error) {
      toast({
        title: t("errorUpdatingProfile"),
        description: (error as Error)?.message || t("unknownError"),
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("fullName")}</Label>
        <Input
          id="name"
          {...register("name", { required: t("nameRequired") })}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">{t("emailAddress")}</Label>
        <Input
          id="email"
          type="email"
          {...register("email", { 
            required: t("emailRequired"),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t("invalidEmail"),
            }
          })}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>
      
      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : t("saveChanges")}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
