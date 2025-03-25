
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { UserPlus, Trash, RefreshCcw } from 'lucide-react';
import { formatDistance, parseISO } from 'date-fns';

const InvitationManagement = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { loading, invitations, getInvitations, createInvitation, deleteInvitation } = useInvitations();
  const { companies } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inviteFormSchema = z.object({
    email: z.string().email(t('invalidEmail')),
    role: z.enum(['admin', 'employee']),
    company_id: z.string().uuid(),
  });
  
  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      role: 'employee',
      company_id: '',
    }
  });
  
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
      form.setValue('company_id', selectedCompanyId);
      getInvitations(selectedCompanyId);
    } else if (isSuperAdmin && !selectedCompanyId) {
      getInvitations();
    }
  }, [selectedCompanyId]);
  
  // Set company_id for non-super-admin users
  useEffect(() => {
    if (!isSuperAdmin && user?.companyId) {
      form.setValue('company_id', user.companyId);
    }
  }, [user, isSuperAdmin]);
  
  const handleCreateInvitation = async (values: z.infer<typeof inviteFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      await createInvitation({
        email: values.email,
        role: values.role,
        company_id: values.company_id,
        expiry_days: 7 // Default expiry time: 7 days
      });
      
      form.reset({
        email: '',
        role: 'employee',
        company_id: values.company_id,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteInvitation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invitation?')) {
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
            <CardTitle>Invitation Management</CardTitle>
            <CardDescription>
              Invite new users to join your organization
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
          <div className="mb-4">
            <Select onValueChange={(value) => setSelectedCompanyId(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading invitations...
                </TableCell>
              </TableRow>
            ) : invitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No invitations found
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell className="capitalize">{invitation.role}</TableCell>
                  <TableCell className="capitalize">{invitation.status}</TableCell>
                  <TableCell>
                    {formatDistance(parseISO(invitation.expires_at), new Date(), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteInvitation(invitation.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateInvitation)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {isSuperAdmin && (
                  <FormField
                    control={form.control}
                    name="company_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">Cancel</Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default InvitationManagement;
