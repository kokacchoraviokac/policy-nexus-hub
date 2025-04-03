
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CreateInvitationForm from './CreateInvitationForm';
import * as z from 'zod';
import { createInviteFormSchema } from './CreateInvitationForm';

interface CreateInvitationDialogProps {
  companies: Company[];
  isSuperAdmin: boolean;
  defaultCompanyId?: string;
  isSubmitting: boolean;
  onSubmit: (values: z.infer<ReturnType<typeof createInviteFormSchema>>) => Promise<void>;
}

const CreateInvitationDialog: React.FC<CreateInvitationDialogProps> = ({
  companies,
  isSuperAdmin,
  defaultCompanyId,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a new user</DialogTitle>
          <DialogDescription>
            Send an invitation email to a new user to join your organization.
          </DialogDescription>
        </DialogHeader>
        
        <CreateInvitationForm
          companies={companies}
          isSuperAdmin={isSuperAdmin}
          defaultCompanyId={defaultCompanyId}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvitationDialog;
