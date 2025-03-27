
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Languages } from 'lucide-react';
import { Language } from '@/contexts/LanguageContext';
import TranslationDashboard from './translation/TranslationDashboard';
import WorkflowPanel from './translation/WorkflowPanel';
import TranslationTestStatus from './TranslationTestStatus';

const TranslationManager: React.FC = () => {
  // Only render in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [exportLanguage, setExportLanguage] = useState<Language | 'all'>('all');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-blue-500" />
          Translation Management
        </CardTitle>
        <CardDescription>
          Tools for managing and monitoring translations across languages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <TranslationDashboard 
              exportLanguage={exportLanguage}
              setExportLanguage={setExportLanguage}
            />
          </TabsContent>
          
          <TabsContent value="workflow">
            <WorkflowPanel 
              exportLanguage={exportLanguage}
              setExportLanguage={setExportLanguage}
            />
          </TabsContent>
          
          <TabsContent value="testing" className="pt-4">
            <TranslationTestStatus autoRun={true} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TranslationManager;
