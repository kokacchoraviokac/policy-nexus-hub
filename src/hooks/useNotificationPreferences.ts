
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { NotificationPreferences } from '@/types/notifications';
import { useLanguage } from '@/contexts/LanguageContext';

export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchPreferences = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }
      
      setPreferences(data as NotificationPreferences || null);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast({
        title: t('errorFetchingPreferences'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, t]);
  
  const updatePreferences = useCallback(async (updates: Partial<Omit<NotificationPreferences, 'id' | 'user_id' | 'company_id' | 'created_at' | 'updated_at'>>) => {
    if (!user?.id || !preferences?.id) return;
    
    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .update({ 
          ...updates,
          updated_at: new Date().toISOString() 
        })
        .eq('id', preferences.id);
      
      if (error) throw error;
      
      // Update local state
      setPreferences(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
      
      toast({
        title: t('preferencesUpdated'),
      });
      
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: t('errorUpdatingPreferences'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
      return false;
    }
  }, [user, preferences, toast, t]);
  
  // Create preferences if they don't exist
  const createPreferences = useCallback(async () => {
    if (!user?.id || !user.companyId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .insert({
          user_id: user.id,
          company_id: user.companyId,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setPreferences(data as NotificationPreferences);
    } catch (error) {
      console.error('Error creating notification preferences:', error);
      toast({
        title: t('errorCreatingPreferences'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  }, [user, toast, t]);
  
  // Fetch preferences on mount
  useEffect(() => {
    if (user?.id) {
      fetchPreferences();
    } else {
      setPreferences(null);
    }
  }, [user, fetchPreferences]);
  
  return {
    preferences,
    isLoading,
    updatePreferences,
    createPreferences,
    fetchPreferences
  };
}
