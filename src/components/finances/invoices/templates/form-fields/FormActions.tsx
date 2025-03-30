
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({ onCancel, isEditing }) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        {t("cancel")}
      </Button>
      <Button type="submit">
        {isEditing ? t("updateTemplate") : t("createTemplate")}
      </Button>
    </div>
  );
};
