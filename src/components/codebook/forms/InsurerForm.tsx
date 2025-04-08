
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { LoaderButton } from '@/components/ui/loader-button';
import { Insurer } from '@/types/codebook';

const insurerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  contact_person: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  registration_number: z.string().optional(),
  is_active: z.boolean().default(true)
});

export type InsurerFormValues = z.infer<typeof insurerSchema>;

interface InsurerFormProps {
  initialData?: Insurer;
  onSubmit: (data: InsurerFormValues) => void;
  isLoading?: boolean;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const InsurerForm: React.FC<InsurerFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  isEditMode = false,
  onCancel
}) => {
  const { t } = useLanguage();
  
  const form = useForm<InsurerFormValues>({
    resolver: zodResolver(insurerSchema),
    defaultValues: {
      name: initialData?.name || '',
      contact_person: initialData?.contact_person || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      postal_code: initialData?.postal_code || '',
      country: initialData?.country || '',
      registration_number: initialData?.registration_number || '',
      is_active: initialData?.is_active ?? true
    }
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error('Error submitting insurer form:', error);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('insurerName')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('enterInsurerName')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="registration_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('registrationNumber')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('enterRegistrationNumber')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_person"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('contactPerson')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('enterContactPerson')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder={t('enterEmail')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('phone')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('enterPhone')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('address')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('enterAddress')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('city')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('enterCity')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('postalCode')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('enterPostalCode')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('country')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('enterCountry')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t('active')}</FormLabel>
                <FormDescription>
                  {t('activeInsurerDescription')}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              {t('cancel')}
            </Button>
          )}
          <LoaderButton
            type="submit"
            loading={isLoading}
          >
            {isEditMode ? t('saveChanges') : t('addInsurer')}
          </LoaderButton>
        </div>
      </form>
    </Form>
  );
};

export default InsurerForm;
