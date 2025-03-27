
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react';
import { Language } from '@/contexts/LanguageContext';
import { exportMissingTranslations, reportTranslationWorkflow } from '@/utils/devTools/translationManager';

interface WorkflowPanelProps {
  exportLanguage: Language | 'all';
  setExportLanguage: (language: Language | 'all') => void;
}

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ exportLanguage, setExportLanguage }) => {
  const [isWorkflowOpen, setIsWorkflowOpen] = React.useState(false);
  
  const handleShowWorkflow = () => {
    reportTranslationWorkflow();
    setIsWorkflowOpen(!isWorkflowOpen);
  };
  
  const handleExport = () => {
    if (exportLanguage === 'all') {
      exportMissingTranslations();
    } else {
      exportMissingTranslations(exportLanguage);
    }
  };
  
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Translation Workflow</h3>
          <p className="text-sm text-gray-500">Export, update, and import translations</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleShowWorkflow}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Analyze
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Export Translations</CardTitle>
          <CardDescription>
            Generate CSV files with missing translations for external translation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={exportLanguage === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setExportLanguage('all')}
            >
              All Languages
            </Button>
            <Button 
              variant={exportLanguage === 'sr' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setExportLanguage('sr')}
            >
              🇷🇸 Serbian
            </Button>
            <Button 
              variant={exportLanguage === 'mk' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setExportLanguage('mk')}
            >
              🇲🇰 Macedonian
            </Button>
            <Button 
              variant={exportLanguage === 'es' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setExportLanguage('es')}
            >
              🇪🇸 Spanish
            </Button>
          </div>
          
          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export {exportLanguage === 'all' ? 'All' : exportLanguage.toUpperCase()} Translations
          </Button>
        </CardContent>
      </Card>
      
      <Collapsible open={isWorkflowOpen} onOpenChange={setIsWorkflowOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center w-full justify-between">
            <span>Workflow Recommendations</span>
            {isWorkflowOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <Card>
            <CardContent className="pt-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>Export missing translations using the buttons above</li>
                <li>Send the CSV file to translators or marketing team</li>
                <li>When translations are complete, update the language JSON files</li>
                <li>Run tests to verify the new translations work correctly</li>
                <li>Commit changes to your version control system</li>
              </ol>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default WorkflowPanel;
