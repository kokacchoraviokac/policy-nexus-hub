
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Policy } from '@/types/policies';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ChevronRight } from 'lucide-react';

interface PolicyWorkflowCardProps {
  policy: Partial<Policy>; // Make Policy partial to avoid missing properties error
  onClick?: () => void;
}

const PolicyWorkflowCard: React.FC<PolicyWorkflowCardProps> = ({ policy, onClick }) => {
  const { t } = useLanguage();
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-amber-100 text-amber-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'complete':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="cursor-pointer hover:bg-accent/5 transition-colors border-l-4 border-l-primary" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base font-medium">{policy.policy_number}</CardTitle>
            <p className="text-sm text-muted-foreground">{policy.policyholder_name}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(policy.workflow_status || 'draft')}`}>
            {t(policy.workflow_status || 'draft')}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">{t('insurer')}:</span>
          </div>
          <div className="font-medium truncate">{policy.insurer_name}</div>
          
          <div>
            <span className="text-muted-foreground">{t('premium')}:</span>
          </div>
          <div className="font-medium">
            {policy.premium && policy.currency
              ? formatCurrency(policy.premium, policy.currency)
              : '-'}
          </div>
          
          <div>
            <span className="text-muted-foreground">{t('startDate')}:</span>
          </div>
          <div className="font-medium">
            {policy.start_date ? formatDate(policy.start_date) : '-'}
          </div>
          
          <div>
            <span className="text-muted-foreground">{t('expiryDate')}:</span>
          </div>
          <div className="font-medium">
            {policy.expiry_date ? formatDate(policy.expiry_date) : '-'}
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="w-full justify-between">
          {t('viewDetails')}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default PolicyWorkflowCard;
