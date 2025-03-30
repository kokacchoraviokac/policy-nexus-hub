
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PolicyImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PolicyImportDialog: React.FC<PolicyImportDialogProps> = ({ 
  isOpen, 
  onClose,
  onSuccess 
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleGotoImportPage = () => {
    navigate("/policies/import");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("importPolicies")}</DialogTitle>
          <DialogDescription>
            {t("importPoliciesDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            {t("policyImportPrompter")}
          </p>
          
          <div className="flex justify-center">
            <Button onClick={handleGotoImportPage} className="w-full">
              {t("goToImportPage")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyImportDialog;
