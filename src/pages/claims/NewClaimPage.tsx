import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { useClients } from '@/hooks/useClients';
import { usePolicies } from '@/hooks/usePolicies';
import { useClaimService } from '@/hooks/useClaimService';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/layout/PageHeader';

const formSchema = z.object({
  client_id: z.string().min(1, { message: 'Client is required' }),
  policy_id: z.string().min(1, { message: 'Policy is required' }),
  claim_number: z.string().optional(),
  incident_date: z.date({
    required_error: 'Incident date is required',
  }),
  report_date: z.date({
    required_error: 'Report date is required',
  }),
  description: z.string().min(1, { message: 'Description is required' }),
  estimated_amount: z.string().optional(),
  status: z.string().default('reported'),
});

type FormValues = z.infer<typeof formSchema>;

const NewClaimPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { clients, isLoading: isLoadingClients } = useClients();
  const { policies, isLoading: isLoadingPolicies } = usePolicies();
  const { createClaim, isCreating } = useClaimService();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: '',
      policy_id: '',
      claim_number: '',
      description: '',
      estimated_amount: '',
      status: 'in_processing', // Fixed from "in processing" to "in_processing"
    },
  });

  const filteredPolicies = selectedClientId
    ? policies.filter(policy => policy.client_id === selectedClientId)
    : policies;

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await createClaim({
        ...data,
        estimated_amount: data.estimated_amount ? parseFloat(data.estimated_amount) : undefined,
      });
      
      if (result.success && result.data) {
        navigate(`/claims/${result.data.id}`);
      }
    } catch (error) {
      console.error('Failed to create claim:', error);
    }
  };

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    form.setValue('client_id', clientId);
    form.setValue('policy_id', ''); // Reset policy when client changes
  };

  return (
    <>
      <PageHeader title={t('newClaim')} />
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{t('claimDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client')}</FormLabel>
                      <Select
                        disabled={isLoadingClients}
                        onValueChange={(value) => handleClientChange(value)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectClient')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="policy_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('policy')}</FormLabel>
                      <Select
                        disabled={isLoadingPolicies || !selectedClientId}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectPolicy')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredPolicies.map((policy) => (
                            <SelectItem key={policy.id} value={policy.id}>
                              {policy.policy_number} - {policy.product_name || policy.policy_type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="claim_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('claimNumber')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enterClaimNumber')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('status')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectStatus')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="reported">{t('reported')}</SelectItem>
                          <SelectItem value="in_processing">{t('inProcessing')}</SelectItem>
                          <SelectItem value="accepted">{t('accepted')}</SelectItem>
                          <SelectItem value="partially_accepted">{t('partiallyAccepted')}</SelectItem>
                          <SelectItem value="rejected">{t('rejected')}</SelectItem>
                          <SelectItem value="appealed">{t('appealed')}</SelectItem>
                          <SelectItem value="withdrawn">{t('withdrawn')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incident_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('incidentDate')}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t('selectDate')}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="report_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('reportDate')}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t('selectDate')}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimated_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('estimatedAmount')}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('description')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('enterClaimDescription')}
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/claims')}
                >
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? t('creating') : t('createClaim')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default NewClaimPage;
