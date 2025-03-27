
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Language, useLanguage } from '@/contexts/LanguageContext';
import { generateTranslationReport } from '@/utils/translationValidator';
import { exportMissingTranslations, reportTranslationWorkflow } from '@/utils/devTools/translationManager';
import { ChevronDown, ChevronUp, Download, Upload, RefreshCw, Languages } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import TranslationTestStatus from './TranslationTestStatus';

const TranslationManager: React.FC = () => {
  // Only render in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [exportLanguage, setExportLanguage] = useState<Language | 'all'>('all');
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  
  // Generate a report for the dashboard
  const report = generateTranslationReport();
  
  const handleExport = () => {
    if (exportLanguage === 'all') {
      exportMissingTranslations();
    } else {
      exportMissingTranslations(exportLanguage);
    }
  };
  
  const handleShowWorkflow = () => {
    reportTranslationWorkflow();
    setIsWorkflowOpen(!isWorkflowOpen);
  };
  
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
          
          <TabsContent value="dashboard" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['sr', 'mk', 'es'].map((lang) => (
                <Card key={lang} className="bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">{
                        lang === 'sr' ? '🇷🇸' : 
                        lang === 'mk' ? '🇲🇰' : 
                        '🇪🇸'
                      }</span>
                      {
                        lang === 'sr' ? 'Serbian' : 
                        lang === 'mk' ? 'Macedonian' : 
                        'Spanish'
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion</span>
                        <span className="font-medium">{report.completionPercentage[lang as Language]}%</span>
                      </div>
                      <Progress value={report.completionPercentage[lang as Language]} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {report.totalKeys - report.missingCount[lang as Language]}/{report.totalKeys} keys translated
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => {
                        setExportLanguage(lang as Language);
                        exportMissingTranslations(lang as Language);
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export Missing
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <Collapsible>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Language Summary</h4>
                  <p className="text-sm text-gray-500">Overview of all languages and their translation status</p>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="mt-4">
                <div className="rounded-md border">
                  <div className="flex p-4">
                    <div className="w-1/4 font-semibold">Language</div>
                    <div className="w-1/4 font-semibold">Status</div>
                    <div className="w-1/4 font-semibold">Missing</div>
                    <div className="w-1/4 font-semibold">Completion</div>
                  </div>
                  <div className="divide-y">
                    <div className="flex p-4 hover:bg-muted/20">
                      <div className="w-1/4 flex items-center gap-2">
                        <span>🇬🇧</span>
                        <span>English</span>
                      </div>
                      <div className="w-1/4 text-green-600">Source Language</div>
                      <div className="w-1/4">0</div>
                      <div className="w-1/4">100%</div>
                    </div>
                    <div className="flex p-4 hover:bg-muted/20">
                      <div className="w-1/4 flex items-center gap-2">
                        <span>🇷🇸</span>
                        <span>Serbian</span>
                      </div>
                      <div className="w-1/4">
                        {report.missingCount.sr === 0 ? (
                          <span className="text-green-600">Complete</span>
                        ) : (
                          <span className="text-amber-600">In Progress</span>
                        )}
                      </div>
                      <div className="w-1/4">{report.missingCount.sr}</div>
                      <div className="w-1/4">{report.completionPercentage.sr}%</div>
                    </div>
                    <div className="flex p-4 hover:bg-muted/20">
                      <div className="w-1/4 flex items-center gap-2">
                        <span>🇲🇰</span>
                        <span>Macedonian</span>
                      </div>
                      <div className="w-1/4">
                        {report.missingCount.mk === 0 ? (
                          <span className="text-green-600">Complete</span>
                        ) : (
                          <span className="text-amber-600">In Progress</span>
                        )}
                      </div>
                      <div className="w-1/4">{report.missingCount.mk}</div>
                      <div className="w-1/4">{report.completionPercentage.mk}%</div>
                    </div>
                    <div className="flex p-4 hover:bg-muted/20">
                      <div className="w-1/4 flex items-center gap-2">
                        <span>🇪🇸</span>
                        <span>Spanish</span>
                      </div>
                      <div className="w-1/4">
                        {report.missingCount.es === 0 ? (
                          <span className="text-green-600">Complete</span>
                        ) : (
                          <span className="text-amber-600">In Progress</span>
                        )}
                      </div>
                      <div className="w-1/4">{report.missingCount.es}</div>
                      <div className="w-1/4">{report.completionPercentage.es}%</div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>
          
          <TabsContent value="workflow" className="space-y-4 pt-4">
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
