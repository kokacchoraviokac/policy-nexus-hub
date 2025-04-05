
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

interface SalesPipelineStatsProps {
  isLoading: boolean;
  error: Error | null;
}

const SalesPipelineStats: React.FC<SalesPipelineStatsProps> = ({ isLoading, error }) => {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('pipelineStats')}</CardTitle>
        </CardHeader>
        <CardContent className="h-32 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('pipelineStats')}</CardTitle>
        </CardHeader>
        <CardContent className="h-32 flex items-center justify-center">
          <div className="text-center text-destructive">
            {t('errorLoadingStats')}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pipelineStats')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('activeDeals')}</div>
            <div className="text-2xl font-bold">48</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('conversion')}</div>
            <div className="text-2xl font-bold">28%</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('avgDealSize')}</div>
            <div className="text-2xl font-bold">€5,280</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('avgCycleTime')}</div>
            <div className="text-2xl font-bold">24 {t('days')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesPipelineStats;
