
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MoreHorizontal,
  Mail,
  UserCog,
  CheckCircle, 
  XCircle
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/employees";

interface EmployeeActionsProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onResendInvitation: (email: string) => void;
  onToggleStatus: (employee: Employee) => void;
}

export const EmployeeActions: React.FC<EmployeeActionsProps> = ({
  employee,
  onEdit,
  onResendInvitation,
  onToggleStatus,
}) => {
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title={t("actions")}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(employee)}>
          <UserCog className="mr-2 h-4 w-4" />
          {t("editEmployee")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onResendInvitation(employee.email || '')}>
          <Mail className="mr-2 h-4 w-4" />
          {t("resendInvitation")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleStatus(employee)}>
          {employee.is_active ? (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              {t("deactivate")}
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              {t("activate")}
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
