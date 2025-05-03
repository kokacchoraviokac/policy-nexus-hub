
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NotificationPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define the form schema with Zod
const formSchema = z.object({
  activity_reminders: z.boolean(),
  lead_updates: z.boolean(),
  sales_process_updates: z.boolean(),
  reminder_timing: z.object({
    activity_due: z.string(),
    lead_followup: z.string(),
  }),
  email_notifications: z.boolean(),
  in_app_notifications: z.boolean(),
});

const NotificationPreferencesDialog: React.FC<NotificationPreferencesDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useLanguage();
  const { preferences, isLoading, updatePreferences } = useNotificationPreferences();
  
  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activity_reminders: preferences?.activity_reminders ?? true,
      lead_updates: preferences?.lead_updates ?? true,
      sales_process_updates: preferences?.sales_process_updates ?? true,
      reminder_timing: {
        activity_due: preferences?.reminder_timing?.activity_due ?? '1 day',
        lead_followup: preferences?.reminder_timing?.lead_followup ?? '1 day',
      },
      email_notifications: preferences?.email_notifications ?? true,
      in_app_notifications: preferences?.in_app_notifications ?? true,
    },
  });
  
  // Update form when preferences load
  React.useEffect(() => {
    if (preferences) {
      form.reset({
        activity_reminders: preferences.activity_reminders,
        lead_updates: preferences.lead_updates,
        sales_process_updates: preferences.sales_process_updates,
        reminder_timing: preferences.reminder_timing,
        email_notifications: preferences.email_notifications,
        in_app_notifications: preferences.in_app_notifications,
      });
    }
  }, [preferences, form]);
  
  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await updatePreferences(values);
    if (success) {
      onOpenChange(false);
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('notificationPreferences')}</DialogTitle>
          <DialogDescription>
            {t('customizeNotificationsDescription')}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>{t('loading')}</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t('notificationTypes')}</h3>
                
                <FormField
                  control={form.control}
                  name="activity_reminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>{t('activityReminders')}</FormLabel>
                        <FormDescription>
                          {t('activityRemindersDescription')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lead_updates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>{t('leadUpdates')}</FormLabel>
                        <FormDescription>
                          {t('leadUpdatesDescription')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sales_process_updates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>{t('salesProcessUpdates')}</FormLabel>
                        <FormDescription>
                          {t('salesProcessUpdatesDescription')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t('reminderTimings')}</h3>
                
                <FormField
                  control={form.control}
                  name="reminder_timing.activity_due"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('activityDueReminder')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectReminderTime')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30 minutes">{t('30MinutesBefore')}</SelectItem>
                          <SelectItem value="1 hour">{t('1HourBefore')}</SelectItem>
                          <SelectItem value="3 hours">{t('3HoursBefore')}</SelectItem>
                          <SelectItem value="1 day">{t('1DayBefore')}</SelectItem>
                          <SelectItem value="2 days">{t('2DaysBefore')}</SelectItem>
                          <SelectItem value="1 week">{t('1WeekBefore')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t('activityDueReminderDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reminder_timing.lead_followup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('leadFollowupReminder')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectReminderTime')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30 minutes">{t('30MinutesBefore')}</SelectItem>
                          <SelectItem value="1 hour">{t('1HourBefore')}</SelectItem>
                          <SelectItem value="3 hours">{t('3HoursBefore')}</SelectItem>
                          <SelectItem value="1 day">{t('1DayBefore')}</SelectItem>
                          <SelectItem value="2 days">{t('2DaysBefore')}</SelectItem>
                          <SelectItem value="1 week">{t('1WeekBefore')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t('leadFollowupReminderDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t('deliveryMethods')}</h3>
                
                <FormField
                  control={form.control}
                  name="in_app_notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>{t('inAppNotifications')}</FormLabel>
                        <FormDescription>
                          {t('inAppNotificationsDescription')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email_notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>{t('emailNotifications')}</FormLabel>
                        <FormDescription>
                          {t('emailNotificationsDescription')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  {t('cancel')}
                </Button>
                <Button type="submit">{t('savePreferences')}</Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPreferencesDialog;
