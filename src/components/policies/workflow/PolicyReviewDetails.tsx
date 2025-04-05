
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Policy } from '@/types/policies';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Separator } from '@/components/ui/separator';

interface PolicyReviewDetailsProps {
  policy: Policy;
}

const PolicyReviewDetails: React.FC<PolicyReviewDetailsProps> = ({ policy }) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('policyDetails')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {t('basicInformation')}
          </h3>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-sm text-muted-foreground">{t('policyNumber')}</div>
            <div className="text-sm font-medium">{policy.policy_number}</div>
            
            <div className="text-sm text-muted-foreground">{t('policyType')}</div>
            <div className="text-sm font-medium">{policy.policy_type}</div>
            
            <div className="text-sm text-muted-foreground">{t('status')}</div>
            <div className="text-sm font-medium">{t(policy.status)}</div>
            
            <div className="text-sm text-muted-foreground">{t('startDate')}</div>
            <div className="text-sm font-medium">{formatDate(policy.start_date)}</div>
            
            <div className="text-sm text-muted-foreground">{t('expiryDate')}</div>
            <div className="text-sm font-medium">{formatDate(policy.expiry_date)}</div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {t('parties')}
          </h3>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-sm text-muted-foreground">{t('policyholder')}</div>
            <div className="text-sm font-medium">{policy.policyholder_name}</div>
            
            <div className="text-sm text-muted-foreground">{t('insured')}</div>
            <div className="text-sm font-medium">{policy.insured_name || t('same')}</div>
            
            <div className="text-sm text-muted-foreground">{t('insurer')}</div>
            <div className="text-sm font-medium">{policy.insurer_name}</div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {t('product')}
          </h3>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-sm text-muted-foreground">{t('productName')}</div>
            <div className="text-sm font-medium">{policy.product_name}</div>
            
            <div className="text-sm text-muted-foreground">{t('productId')}</div>
            <div className="text-sm font-medium">{policy.product_id}</div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {t('financialDetails')}
          </h3>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-sm text-muted-foreground">{t('premium')}</div>
            <div className="text-sm font-medium">{formatCurrency(policy.premium, policy.currency)}</div>
            
            <div className="text-sm text-muted-foreground">{t('currency')}</div>
            <div className="text-sm font-medium">{policy.currency}</div>
            
            <div className="text-sm text-muted-foreground">{t('paymentFrequency')}</div>
            <div className="text-sm font-medium">{t(policy.payment_frequency || 'notSpecified')}</div>
            
            <div className="text-sm text-muted-foreground">{t('commissionType')}</div>
            <div className="text-sm font-medium">{t(policy.commission_type || 'notSpecified')}</div>
            
            <div className="text-sm text-muted-foreground">{t('commissionPercentage')}</div>
            <div className="text-sm font-medium">
              {policy.commission_percentage !== null ? `${policy.commission_percentage}%` : t('notSpecified')}
            </div>
            
            <div className="text-sm text-muted-foreground">{t('commissionAmount')}</div>
            <div className="text-sm font-medium">
              {policy.commission_amount
                ? formatCurrency(policy.commission_amount, policy.currency)
                : t('notCalculated')}
            </div>
          </div>
        </div>
        
        {policy.notes && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t('notes')}
              </h3>
              <p className="text-sm">{policy.notes}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyReviewDetails;
