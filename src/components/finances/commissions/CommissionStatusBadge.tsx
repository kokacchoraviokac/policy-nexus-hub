
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommissionStatusBadgeProps {
  status: string;
}

const CommissionStatusBadge: React.FC<CommissionStatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  switch (status.toLowerCase()) {
    case 'due':
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          {t('due')}
        </Badge>
      );
    case 'paid':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {t('paid')}
        </Badge>
      );
    case 'calculating':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {t('calculating')}
        </Badge>
      );
    case 'partially_paid':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          {t('partiallyPaid')}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
};

export default CommissionStatusBadge;
