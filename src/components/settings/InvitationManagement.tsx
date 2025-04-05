import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useInvitations } from '@/hooks/useInvitations';
import { useCreateInvitation } from '@/hooks/useCreateInvitation';
import DataTable from '@/components/ui/data-table';
import { columns } from './invitations/InvitationColumns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { createInviteFormSchema } from './invitations/CreateInvitationForm';
import CreateInvitationForm from './invitations/CreateInvitationForm';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Pagination } from '@/components/ui/pagination';

const InvitationManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const { user } = useAuth();
  const authContext = useAuth();
  const isSuperAdmin = authContext.role === 'superAdmin' || authContext.role === 'super_admin';
  
  const { companies, loading: isLoadingCompanies } = useCompanies();
  const { 
    invitations, 
    loading: isLoadingInvitations,
    getInvitations
  } = useInvitations();
  
  const totalInvitations = invitations.length;
  
  const { createInvitation, isSubmitting } = useCreateInvitation();
  
  const handleCreateInvitation = async (data: any) => {
    try {
      await createInvitation({
        email: data.email,
        role: data.role,
        company_id: data.company_id
      });
      
      setDialogOpen(false);
      getInvitations();
      
      toast({
        title: t('invitationSent'),
        description: t('invitationSentToEmail', { email: data.email }),
      });
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: t('errorSendingInvitation'),
        description: typeof error === 'string' ? error : t('unknownError'),
        variant: 'destructive',
      });
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{t('managePendingInvitations')}</CardTitle>
          <CardDescription>{t('managePendingInvitationsDescription')}</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">{t('inviteNewUser')}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('inviteNewUser')}</DialogTitle>
            </DialogHeader>
            <CreateInvitationForm
              companies={companies || []}
              isSuperAdmin={isSuperAdmin}
              defaultCompanyId={user?.companyId}
              isSubmitting={isSubmitting}
              onSubmit={handleCreateInvitation}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={invitations || []} 
          isLoading={isLoadingInvitations}
        />
        {totalInvitations > 0 && (
          <div className="mt-4 flex items-center justify-end space-x-2">
            <Pagination
              itemsCount={totalInvitations}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationManagement;
