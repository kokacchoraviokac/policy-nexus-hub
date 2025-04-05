
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Plus, FileText } from "lucide-react";
import PageHeader from '@/components/layout/PageHeader';
import SalesFunnel from '@/components/sales/dashboard/SalesFunnel';
import SalesPipelineStats from '@/components/sales/dashboard/SalesPipelineStats';
import FilterBar from '@/components/ui/filter/FilterBar';
import { FilterGroup } from '@/types/filters';
import { useNavigate } from 'react-router-dom';

const PipelineOverview: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Mock data for the sales funnel
  const processesByStage: Record<string, number> = {
    'discovery': 12,
    'qualification': 8,
    'proposal': 5,
    'negotiation': 3,
    'closing': 2,
  };
  
  // Example filter groups for sales pipeline
  const filterGroups: FilterGroup[] = [
    {
      id: 'stage',
      label: t('stage'),
      options: [
        { id: 'discovery', label: t('discovery') },
        { id: 'qualification', label: t('qualification') },
        { id: 'proposal', label: t('proposal') },
        { id: 'negotiation', label: t('negotiation') },
        { id: 'closing', label: t('closing') },
      ],
    },
    {
      id: 'agent',
      label: t('agent'),
      options: [
        { id: 'agent-1', label: 'John Doe' },
        { id: 'agent-2', label: 'Jane Smith' },
        { id: 'agent-3', label: 'Bob Johnson' },
      ],
    },
    {
      id: 'time',
      label: t('time'),
      options: [
        { id: 'this-week', label: t('thisWeek') },
        { id: 'this-month', label: t('thisMonth') },
        { id: 'last-month', label: t('lastMonth') },
        { id: 'custom', label: t('customDate') },
      ],
    },
  ];
  
  const handleNewSalesProcess = () => {
    navigate('/sales/processes/new');
  };
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader title={t('salesPipeline')} />
      
      <div className="mb-6 flex items-center justify-between">
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t('searchSalesProcesses')}
        >
          {filterGroups.map((group) => (
            <div key={group.id} className="p-4 border-b border-gray-100 last:border-0">
              <h3 className="font-medium mb-2">{group.label}</h3>
              <div className="space-y-2">
                {group.options.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.id}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-primary"
                    />
                    <label
                      htmlFor={option.id}
                      className="text-sm text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="p-4 flex justify-end">
            <Button size="sm">
              {t('applyFilters')}
            </Button>
          </div>
        </FilterBar>
        
        <Button onClick={handleNewSalesProcess}>
          <Plus className="h-4 w-4 mr-2" />
          {t('newSalesProcess')}
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <SalesFunnel 
          processesByStage={processesByStage}
          isLoading={isLoading}
        />
        
        <SalesPipelineStats 
          isLoading={isLoading}
          error={error}
        />
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('activeSalesProcesses')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="text-center py-10">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">{t('noActiveSalesProcesses')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('noActiveSalesProcessesDescription')}
              </p>
              <Button
                className="mt-4"
                onClick={handleNewSalesProcess}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('createSalesProcess')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineOverview;
