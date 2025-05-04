
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Employee } from "@/types/employees";
import EmployeeEditForm from "./forms/EmployeeEditForm";
import EmployeeInvitationForm from "./forms/EmployeeInvitationForm";
import EmployeeManualEntryForm from "./forms/EmployeeManualEntryForm";

interface EmployeeFormProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onInvite: (email: string, role: string) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  employee, 
  isOpen, 
  onClose, 
  onSave,
  onInvite
}) => {
  const { t } = useLanguage();
  const { hasPrivilege } = useAuth();
  const isEditing = !!employee;
  
  // Check if user can assign admin roles
  const canAssignAdmin = hasPrivilege('users:assign-admin');
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("editEmployee") : t("addEmployee")}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? t("updateEmployeeInformation") 
              : t("addNewEmployeeOrSendInvitation")}
          </DialogDescription>
        </DialogHeader>
        
        {isEditing ? (
          // Edit existing employee form
          <EmployeeEditForm 
            employee={employee}
            onSave={onSave}
            onClose={onClose}
            canAssignAdmin={canAssignAdmin}
          />
        ) : (
          // Adding new employee - with tabs for invitation or manual entry
          <Tabs defaultValue="invite">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="invite">{t("sendInvitation")}</TabsTrigger>
              <TabsTrigger value="manual">{t("manualEntry")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="invite" className="mt-4">
              <EmployeeInvitationForm 
                onInvite={onInvite}
                onClose={onClose}
                canAssignAdmin={canAssignAdmin}
              />
            </TabsContent>
            
            <TabsContent value="manual" className="mt-4">
              <EmployeeManualEntryForm 
                onSave={onSave}
                onClose={onClose}
                canAssignAdmin={canAssignAdmin}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
