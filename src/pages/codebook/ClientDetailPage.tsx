
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Book, Users, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EntityDetailsCard } from "@/components/codebook/details/EntityDetailsCard";
import { InfoGrid, InfoItem } from "@/components/codebook/details/InfoItem";
import { ActivityLog } from "@/components/codebook/details/ActivityLog";
import { Client } from "@/types/codebook";
import { exportToCSV } from "@/utils/csv";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClientForm from "@/components/codebook/forms/ClientForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: client, isLoading, error, refetch } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();
      
      if (error) throw error;
      return data as Client;
    }
  });

  // Mock activity data - in a real app, this would be fetched from the database
  const activityData = [
    {
      id: '1',
      action: 'Updated client details',
      timestamp: new Date().toISOString(),
      user: 'Jane Smith',
      details: 'Changed contact person and updated phone number'
    },
    {
      id: '2',
      action: 'Created client record',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'John Doe'
    }
  ];

  if (isLoading) {
    return <div className="flex justify-center p-8">{t("loadingClientDetails")}...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <h3 className="text-lg font-semibold">{t("errorLoadingClientDetails")}</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-8 w-8 mb-2" />
        <h3 className="text-lg font-semibold">{t("clientNotFound")}</h3>
        <p>{t("clientNotFoundDescription")}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/codebook/clients')}>
          {t("returnToClientsDirectory")}
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', client.id);
      
      if (error) throw error;
      
      toast({
        title: t("clientDeleted"),
        description: t("clientDeletedDescription").replace("{0}", client.name),
      });
      
      navigate('/codebook/clients');
    } catch (err: any) {
      toast({
        title: t("errorDeletingClient"),
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    try {
      exportToCSV([client], `client_${client.id}_${new Date().toISOString().split('T')[0]}.csv`);
      
      toast({
        title: t("exportSuccessful"),
        description: t("clientDataExported"),
      });
    } catch (error: any) {
      toast({
        title: t("exportFailed"),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    refetch();
    toast({
      title: t("clientUpdated"),
      description: t("clientUpdatedDescription"),
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Book className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">{t("codebook")}</h1>
        <span className="text-muted-foreground">/</span>
        <div className="flex items-center space-x-1">
          <Users className="h-5 w-5" />
          <span className="font-medium">{t("clientDetails")}</span>
        </div>
      </div>
      
      <EntityDetailsCard
        title={client.name}
        subtitle={client.contact_person ? `${t("contact")}: ${client.contact_person}` : undefined}
        backLink="/codebook/clients"
        backLinkLabel={t("clientsDirectory")}
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onExport={handleExport}
        tabs={[
          {
            id: 'details',
            label: t("details"),
            content: (
              <InfoGrid>
                <InfoItem label={t("name")} value={client.name} />
                <InfoItem label={t("contactPerson")} value={client.contact_person} />
                <InfoItem label={t("email")} value={client.email} />
                <InfoItem label={t("phone")} value={client.phone} />
                <InfoItem label={t("address")} value={client.address} />
                <InfoItem label={t("city")} value={client.city} />
                <InfoItem label={t("postalCode")} value={client.postal_code} />
                <InfoItem label={t("country")} value={client.country} />
                <InfoItem label={t("taxId")} value={client.tax_id} />
                <InfoItem label={t("registrationNumber")} value={client.registration_number} />
                <InfoItem label={t("active")} value={client.is_active} />
                {client.notes && (
                  <div className="col-span-full mt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("notes")}</h3>
                    <div className="p-3 bg-muted rounded-md">
                      {client.notes}
                    </div>
                  </div>
                )}
              </InfoGrid>
            )
          },
          {
            id: 'activity',
            label: t("activityHistory"),
            content: <ActivityLog items={activityData} />
          }
        ]}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("editClient")}</DialogTitle>
            <DialogDescription>
              {t("editClientDescription")}
            </DialogDescription>
          </DialogHeader>
          {client && (
            <ClientForm
              defaultValues={{
                name: client.name,
                contact_person: client.contact_person || "",
                email: client.email || "",
                phone: client.phone || "",
                address: client.address || "",
                city: client.city || "",
                postal_code: client.postal_code || "",
                country: client.country || "",
                tax_id: client.tax_id || "",
                registration_number: client.registration_number || "",
                notes: client.notes || "",
                is_active: client.is_active,
              }}
              onSubmit={(values) => {
                // In a real app, this would update the client data
                console.log("Updated client values:", values);
                handleEditSuccess();
              }}
              onCancel={() => setIsEditDialogOpen(false)}
              isSubmitting={false}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteClient")}</DialogTitle>
            <DialogDescription>
              {t("deleteClientConfirmationLong").replace("{0}", <span className="font-medium">{client.name}</span>)}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
