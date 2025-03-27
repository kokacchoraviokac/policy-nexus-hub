
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Book, Building2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EntityDetailsCard } from "@/components/codebook/details/EntityDetailsCard";
import { InfoGrid, InfoItem } from "@/components/codebook/details/InfoItem";
import { ActivityLog } from "@/components/codebook/details/ActivityLog";
import { Insurer } from "@/types/codebook";
import { exportToCSV } from "@/utils/csv";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InsurerForm from "@/components/codebook/forms/InsurerForm";

export default function InsurerDetailPage() {
  const { insurerId } = useParams<{ insurerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: insurer, isLoading, error, refetch } = useQuery({
    queryKey: ['insurer', insurerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurers')
        .select('*')
        .eq('id', insurerId)
        .single();
      
      if (error) throw error;
      return data as Insurer;
    }
  });

  // Mock activity data - in a real app, this would be fetched from the database
  const activityData = [
    {
      id: '1',
      action: 'Updated insurer details',
      timestamp: new Date().toISOString(),
      user: 'Jane Smith',
      details: 'Changed contact person and updated address'
    },
    {
      id: '2',
      action: 'Created insurer record',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'John Doe'
    }
  ];

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading insurer details...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <h3 className="text-lg font-semibold">Error loading insurer details</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!insurer) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-8 w-8 mb-2" />
        <h3 className="text-lg font-semibold">Insurer not found</h3>
        <p>The insurance company you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/codebook/companies')}>
          Return to Insurance Companies Directory
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('insurers')
        .delete()
        .eq('id', insurer.id);
      
      if (error) throw error;
      
      toast({
        title: 'Insurance company deleted',
        description: `${insurer.name} has been removed from the system`,
      });
      
      navigate('/codebook/companies');
    } catch (err: any) {
      toast({
        title: 'Error deleting insurance company',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    try {
      exportToCSV([insurer], `insurer_${insurer.id}_${new Date().toISOString().split('T')[0]}.csv`);
      
      toast({
        title: 'Export successful',
        description: `Insurer data exported to CSV`,
      });
    } catch (error: any) {
      toast({
        title: 'Export failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    refetch();
    toast({
      title: 'Insurance company updated',
      description: 'Company information has been updated successfully',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Book className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Codebook</h1>
        <span className="text-muted-foreground">/</span>
        <div className="flex items-center space-x-1">
          <Building2 className="h-5 w-5" />
          <span className="font-medium">Insurance Company Details</span>
        </div>
      </div>
      
      <EntityDetailsCard
        title={insurer.name}
        subtitle={insurer.contact_person ? `Contact: ${insurer.contact_person}` : undefined}
        backLink="/codebook/companies"
        backLinkLabel="Insurance Companies Directory"
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onExport={handleExport}
        tabs={[
          {
            id: 'details',
            label: 'Details',
            content: (
              <InfoGrid>
                <InfoItem label="Name" value={insurer.name} />
                <InfoItem label="Contact Person" value={insurer.contact_person} />
                <InfoItem label="Email" value={insurer.email} />
                <InfoItem label="Phone" value={insurer.phone} />
                <InfoItem label="Address" value={insurer.address} />
                <InfoItem label="City" value={insurer.city} />
                <InfoItem label="Postal Code" value={insurer.postal_code} />
                <InfoItem label="Country" value={insurer.country} />
                <InfoItem label="Registration Number" value={insurer.registration_number} />
                <InfoItem label="Active" value={insurer.is_active} />
              </InfoGrid>
            )
          },
          {
            id: 'activity',
            label: 'Activity History',
            content: <ActivityLog items={activityData} />
          }
        ]}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Insurance Company</DialogTitle>
            <DialogDescription>
              Make changes to the insurance company information below.
            </DialogDescription>
          </DialogHeader>
          {insurer && (
            <InsurerForm 
              defaultValues={{
                name: insurer.name,
                contact_person: insurer.contact_person || "",
                email: insurer.email || "",
                phone: insurer.phone || "",
                address: insurer.address || "",
                city: insurer.city || "",
                postal_code: insurer.postal_code || "",
                country: insurer.country || "",
                registration_number: insurer.registration_number || "",
                is_active: insurer.is_active,
              }} 
              onSubmit={(values) => {
                // In a real app, this would update the insurer data
                console.log("Updated insurer values:", values);
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
            <DialogTitle>Delete Insurance Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-medium">{insurer.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
