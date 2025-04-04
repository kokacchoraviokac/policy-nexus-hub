
import React from 'react';
import { z } from 'zod';
import { Company } from '@/hooks/useCompanies';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import useZodForm from '@/hooks/useZodForm';
import { emailSchema, createModelSchema } from '@/utils/formSchemas';

interface CreateInvitationFormProps {
  companies: Company[];
  isSuperAdmin: boolean;
  defaultCompanyId?: string;
  isSubmitting: boolean;
  onSubmit: (values: InviteFormValues) => Promise<void>;
}

const createInviteFormSchema = (t: (key: string) => string) => z.object({
  email: emailSchema(t('invalidEmail')).refine(val => val !== "", {
    message: t('emailRequired'),
  }),
  role: z.enum(['admin', 'employee']),
  company_id: createModelSchema('Company', { isRequired: true, errorMessage: t('companyRequired') }),
});

type InviteFormValues = z.infer<ReturnType<typeof createInviteFormSchema>>;

const CreateInvitationForm: React.FC<CreateInvitationFormProps> = ({
  companies,
  isSuperAdmin,
  defaultCompanyId,
  isSubmitting,
  onSubmit,
}) => {
  const { t } = useLanguage();
  
  const inviteFormSchema = createInviteFormSchema(t);
  
  const form = useZodForm({
    schema: inviteFormSchema,
    defaultValues: {
      email: '',
      role: 'employee',
      company_id: defaultCompanyId || '',
    },
    onSubmit,
    successMessage: t('invitationSentSuccess'),
    errorMessage: t('invitationSentError'),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            disabled={isSubmitting || form.isSubmitting}
          >
            {isSubmitting || form.isSubmitting ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateInvitationForm;
