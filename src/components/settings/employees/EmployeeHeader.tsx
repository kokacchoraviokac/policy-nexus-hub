
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

interface EmployeeHeaderProps {
  onAddEmployee: () => void;
}

export const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  onAddEmployee,
}) => {
  const { t } = useLanguage();

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>{t("employees")}</CardTitle>
        <CardDescription>{t("manageEmployees")}</CardDescription>
      </div>
      <Button onClick={onAddEmployee}>
        <Plus className="mr-2 h-4 w-4" />
        {t("addEmployee")}
      </Button>
    </CardHeader>
  );
};
