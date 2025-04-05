
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

interface SalesFunnelProps {
  processesByStage: Record<string, number>;
  isLoading: boolean;
}

const SalesFunnel: React.FC<SalesFunnelProps> = ({ processesByStage, isLoading }) => {
  const { t } = useLanguage();
  
  // Calculate total for percentages
  const total = Object.values(processesByStage).reduce((sum, count) => sum + count, 0);
  
  // Arrange stages in order
  const orderedStages = [
    'discovery',
    'qualification',
    'proposal',
    'negotiation',
    'closing',
  ];
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('salesFunnel')}</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('salesFunnel')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1">
          {orderedStages.map((stage, index) => {
            const count = processesByStage[stage] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            
            return (
              <div key={stage} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{t(stage)}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      width: `${percentage}%`,
                      opacity: 1 - (index * 0.15)
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {total === 0 && (
          <div className="text-center text-muted-foreground mt-8">
            {t('noActiveSalesProcesses')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesFunnel;
