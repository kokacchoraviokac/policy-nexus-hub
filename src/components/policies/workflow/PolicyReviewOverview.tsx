
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, AlertTriangle, Clock, HelpCircle, CircleDollarSign, Calendar, User, Building } from 'lucide-react';
import { Policy } from '@/types/policies';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/utils/formatters';

interface PolicyReviewOverviewProps {
  policy: Policy;
}

const PolicyReviewOverview: React.FC<PolicyReviewOverviewProps> = ({ policy }) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('policyOverview')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Policy Information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">{t('policyInformation')}</h3>
                <p className="text-sm text-muted-foreground">
                  {policy.policy_number} | {policy.policy_type}
                </p>
              </div>
            </div>
            
            {/* Parties */}
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">{t('parties')}</h3>
                <p className="text-sm text-muted-foreground">
                  {policy.policyholder_name} | {policy.insurer_name}
                </p>
              </div>
            </div>
            
            {/* Product */}
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">{t('product')}</h3>
                <p className="text-sm text-muted-foreground">
                  {policy.product_name || t('notSpecified')} | {policy.product_id || t('noProductId')}
                </p>
              </div>
            </div>
            
            {/* Financial Details */}
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <CircleDollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">{t('financialDetails')}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(policy.premium, policy.currency)} | {t(policy.payment_frequency || 'notSpecified')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">{t('reviewChecklist')}</h3>
            
            <div className="flex items-center gap-2">
              {policy.policy_number ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-sm">{t('policyNumberProvided')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {policy.start_date && policy.expiry_date ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-sm">{t('datesProvided')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {policy.policyholder_name ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-sm">{t('policyholderProvided')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {policy.insurer_name ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-sm">{t('insurerProvided')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {policy.premium && policy.currency ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-sm">{t('premiumProvided')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {policy.commission_type ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Clock className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm">{t('commissionDefined')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {policy.product_name ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <HelpCircle className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm">{t('productSpecified')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyReviewOverview;
