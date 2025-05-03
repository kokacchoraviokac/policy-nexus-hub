
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import NotificationsPopover from './NotificationsPopover';
import NotificationPreferencesDialog from './NotificationPreferencesDialog';

const UserNotificationMenu: React.FC = () => {
  const { t } = useLanguage();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  
  return (
    <>
      <div className="flex items-center gap-1">
        <NotificationsPopover />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setPreferencesOpen(true)}
          title={t('notificationSettings')}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">{t('notificationSettings')}</span>
        </Button>
      </div>
      
      <NotificationPreferencesDialog 
        open={preferencesOpen} 
        onOpenChange={setPreferencesOpen} 
      />
    </>
  );
};

export default UserNotificationMenu;
