
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InsurerForm from "../forms/InsurerForm";
import { useInsurers } from "@/hooks/useInsurers";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface InsurerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insurerId?: string;
}

const InsurerFormDialog: React.FC<InsurerFormDialogProps> = ({
  open,
  onOpenChange,
  insurerId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { insurers, addInsurer, updateInsurer } = useInsurers();
  
  const currentInsurer = insurerId
    ? insurers?.find((insurer) => insurer.id === insurerId)
    : undefined;

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      if (insurerId && currentInsurer) {
        await updateInsurer(insurerId, {
          ...values,
          company_id: user?.companyId,
        });
        toast({
          title: "Insurance company updated",
          description: "The insurance company has been updated successfully.",
        });
      } else {
        await addInsurer({
          ...values,
          company_id: user?.companyId,
        });
        toast({
          title: "Insurance company added",
          description: "The insurance company has been added successfully.",
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving the insurance company.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {insurerId ? "Edit Insurance Company" : "Add Insurance Company"}
          </DialogTitle>
        </DialogHeader>
        <InsurerForm
          defaultValues={
            currentInsurer
              ? {
                  name: currentInsurer.name,
                  contact_person: currentInsurer.contact_person || "",
                  email: currentInsurer.email || "",
                  phone: currentInsurer.phone || "",
                  address: currentInsurer.address || "",
                  city: currentInsurer.city || "",
                  postal_code: currentInsurer.postal_code || "",
                  country: currentInsurer.country || "",
                  registration_number: currentInsurer.registration_number || "",
                  is_active: currentInsurer.is_active,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InsurerFormDialog;
