
import React from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Insurer } from "@/types/documents";

interface InsurerFormProps {
  insurer?: Insurer;
  onSubmit: (data: Partial<Insurer>) => Promise<void>;
  isSubmitting: boolean;
}

const InsurerForm: React.FC<InsurerFormProps> = ({
  insurer,
  onSubmit,
  isSubmitting
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Insurer>>({
    defaultValues: insurer || {
      name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postal_code: "",
      country: "",
      registration_number: "",
      is_active: true
    }
  });

  return (
    <form 
      id="insurer-form" 
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")} *</Label>
          <Input
            id="name"
            {...register("name", { required: true })}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{t("nameRequired")}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact_person">{t("contactPerson")}</Label>
          <Input
            id="contact_person"
            {...register("contact_person")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            {...register("phone")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">{t("address")}</Label>
          <Textarea
            id="address"
            {...register("address")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">{t("city")}</Label>
          <Input
            id="city"
            {...register("city")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postal_code">{t("postalCode")}</Label>
          <Input
            id="postal_code"
            {...register("postal_code")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">{t("country")}</Label>
          <Input
            id="country"
            {...register("country")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registration_number">{t("registrationNumber")}</Label>
          <Input
            id="registration_number"
            {...register("registration_number")}
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="is_active"
            {...register("is_active")}
            defaultChecked={insurer?.is_active ?? true}
          />
          <Label htmlFor="is_active">{t("active")}</Label>
        </div>
      </div>
      
      {isSubmitting && (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </form>
  );
};

export default InsurerForm;
