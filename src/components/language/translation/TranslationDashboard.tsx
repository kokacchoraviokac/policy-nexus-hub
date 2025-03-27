
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Download } from 'lucide-react';
import { Language } from '@/contexts/LanguageContext';
import { generateTranslationReport } from '@/utils/translationValidator';
import { exportMissingTranslations } from '@/utils/devTools/translationManager';

interface TranslationDashboardProps {
  exportLanguage: Language | 'all';
  setExportLanguage: (language: Language | 'all') => void;
}

const TranslationDashboard: React.FC<TranslationDashboardProps> = ({ 
  exportLanguage, 
  setExportLanguage 
}) => {
  const report = generateTranslationReport();
  const [isLanguageSummaryOpen, setIsLanguageSummaryOpen] = React.useState(false);
  
  return (
    <div className="space-y-4 pt-4">
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
      
      <Collapsible open={isLanguageSummaryOpen} onOpenChange={setIsLanguageSummaryOpen}>
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
    </div>
  );
};

export default TranslationDashboard;
