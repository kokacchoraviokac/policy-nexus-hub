import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInvitations } from '@/hooks/useInvitations';
import { useCompanies } from '@/hooks/useCompanies';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import InvitationList from './invitations/InvitationList';
import CompanyFilter from './invitations/CompanyFilter';
import CreateInvitationDialog from './invitations/CreateInvitationDialog';
import { createInviteFormSchema } from './invitations/CreateInvitationForm';
import * as z from 'zod';

const InvitationManagement = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { loading, invitations, getInvitations, createInvitation, deleteInvitation } = useInvitations();
  const { companies } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isSuperAdmin = user?.role === 'superAdmin';
  
  // Load invitations on component mount
  useEffect(() => {
    if (user) {
      if (isSuperAdmin) {
        // Super admin initially sees all invitations
        getInvitations();
      } else if (user.companyId) {
        // Company admin sees only their company invitations
        getInvitations(user.companyId);
        setSelectedCompanyId(user.companyId);
      }
    }
  }, [user]);
  
  // Set company_id when super admin selects a company
  useEffect(() => {
    if (isSuperAdmin && selectedCompanyId) {
      getInvitations(selectedCompanyId);
    } else if (isSuperAdmin && !selectedCompanyId) {
      getInvitations();
    }
  }, [selectedCompanyId]);
  
  const handleCreateInvitation = async (values: z.infer<ReturnType<typeof createInviteFormSchema>>) => {
    setIsSubmitting(true);
    
    try {
      await createInvitation({
        email: values.email,
        role: values.role,
        company_id: values.company_id,
        expiry_days: 7 // Default expiry time: 7 days
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteInvitation = async (id: string) => {
    if (window.confirm(t('areYouSure'))) {
      await deleteInvitation(id);
    }
  };
  
  const refreshInvitations = () => {
    if (isSuperAdmin && selectedCompanyId) {
      getInvitations(selectedCompanyId);
    } else if (isSuperAdmin) {
      getInvitations();
    } else if (user?.companyId) {
      getInvitations(user.companyId);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('invitationManagementTitle')}</CardTitle>
            <CardDescription>
              {t('invitationManagementDescription')}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={refreshInvitations}
            disabled={loading}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isSuperAdmin && (
          <CompanyFilter 
            companies={companies} 
            onValueChange={(value) => setSelectedCompanyId(value || null)} 
          />
        )}
        
        <InvitationList 
          invitations={invitations} 
          loading={loading} 
          onDeleteInvitation={handleDeleteInvitation} 
        />
      </CardContent>
      <CardFooter>
        <CreateInvitationDialog 
          companies={companies}
          isSuperAdmin={isSuperAdmin}
          defaultCompanyId={user?.companyId || ''}
          isSubmitting={isSubmitting}
          onSubmit={handleCreateInvitation}
        />
      </CardFooter>
    </Card>
  );
};

export default InvitationManagement;
