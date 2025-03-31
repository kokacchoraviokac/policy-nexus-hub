
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClientForm from "../forms/ClientForm";
import { useClients, Client } from "@/hooks/useClients";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId?: string;
}

const ClientFormDialog: React.FC<ClientFormDialogProps> = ({
  open,
  onOpenChange,
  clientId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { clients, addClient, updateClient } = useClients();
  
  const currentClient = clientId
    ? clients?.find((client) => client.id === clientId)
    : undefined;

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      if (clientId && currentClient) {
        await updateClient({
          id: clientId,
          ...values,
          company_id: user?.companyId,
        });
        toast({
          title: "Client updated",
          description: "The client has been updated successfully.",
        });
      } else {
        await addClient({
          ...values,
          company_id: user?.companyId,
        });
        toast({
          title: "Client added",
          description: "The client has been added successfully.",
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving the client.",
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
            {clientId ? "Edit Client" : "Add Client"}
          </DialogTitle>
        </DialogHeader>
        <ClientForm
          defaultValues={
            currentClient
              ? {
                  name: currentClient.name,
                  contact_person: currentClient.contact_person || "",
                  email: currentClient.email || "",
                  phone: currentClient.phone || "",
                  address: currentClient.address || "",
                  city: currentClient.city || "",
                  postal_code: currentClient.postal_code || "",
                  country: currentClient.country || "",
                  tax_id: currentClient.tax_id || "",
                  registration_number: currentClient.registration_number || "",
                  notes: currentClient.notes || "",
                  is_active: currentClient.is_active,
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

export default ClientFormDialog;
