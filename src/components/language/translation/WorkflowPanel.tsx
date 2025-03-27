
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Language } from '@/contexts/LanguageContext';
import { reportTranslationWorkflow, exportMissingTranslations } from '@/utils/devTools/translation';

interface WorkflowPanelProps {
  exportLanguage: Language | 'all';
  setExportLanguage: (language: Language | 'all') => void;
}

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ 
  exportLanguage,
  setExportLanguage 
}) => {
  const handleGenerateReport = () => {
    reportTranslationWorkflow();
  };
  
  const handleExportMissing = () => {
    if (exportLanguage === 'all') {
      exportMissingTranslations();
    } else {
      exportMissingTranslations(exportLanguage);
    }
  };
  
  return (
    <Card className="mt-4 bg-white">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Translation Report</h3>
              <p className="text-sm text-gray-500 mb-2">
                Generate a detailed report on translation status
              </p>
              <Button 
                onClick={handleGenerateReport}
                className="w-full"
              >
                Generate Report
              </Button>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Export Missing Translations</h3>
              <div className="flex gap-2">
                <Select 
                  value={exportLanguage} 
                  onValueChange={(value) => setExportLanguage(value as Language | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="sr">Serbian</SelectItem>
                    <SelectItem value="mk">Macedonian</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleExportMissing}
                  className="flex-1"
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-md border">
            <h3 className="text-sm font-medium mb-2">Console Instructions</h3>
            <div className="text-xs font-mono bg-slate-100 p-2 rounded mb-2">
              window.__translationManager.reportTranslationWorkflow()
            </div>
            <div className="text-xs font-mono bg-slate-100 p-2 rounded">
              window.__translationManager.exportMissingTranslations('sr')
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowPanel;
