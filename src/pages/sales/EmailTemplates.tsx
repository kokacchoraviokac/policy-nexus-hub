
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import EmailTemplateManager from '@/components/sales/templates/EmailTemplateManager';

const EmailTemplates = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("emailTemplates")}</h1>
        <p className="text-muted-foreground mt-1">{t("emailTemplatesDescription")}</p>
      </div>
      
      <EmailTemplateManager />
    </div>
  );
};

export default EmailTemplates;
