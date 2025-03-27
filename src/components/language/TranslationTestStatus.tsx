
import React, { useState } from 'react';
import { runTranslationTests } from '@/utils/testing/translationTester';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, TestTube2 } from 'lucide-react';
import TranslationStatus from './TranslationStatus';

interface TranslationTestStatusProps {
  autoRun?: boolean;
}

const TranslationTestStatus: React.FC<TranslationTestStatusProps> = ({ autoRun = false }) => {
  // Only render in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const [testResults, setTestResults] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Run tests on mount if autoRun is true
  React.useEffect(() => {
    if (autoRun) {
      handleRunTests();
    }
  }, [autoRun]);
  
  const handleRunTests = () => {
    setIsLoading(true);
    // Slight delay to allow UI to update
    setTimeout(() => {
      const results = runTranslationTests();
      setTestResults(results);
      setIsLoading(false);
      
      if (results && results.failedTests > 0) {
        setIsOpen(true);
      }
    }, 100);
  };
  
  return (
    <div className="bg-white border rounded-md p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TestTube2 className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-medium">Translation Tests</h2>
        </div>
        <div className="flex items-center gap-2">
          <TranslationStatus showDetails={false} />
          <Button 
            size="sm" 
            onClick={handleRunTests}
            disabled={isLoading}
          >
            {isLoading ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </div>
      </div>
      
      {testResults && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-100 h-2 rounded-full">
              <div 
                className={`h-2 rounded-full ${testResults.failedTests > 0 ? 'bg-amber-500' : 'bg-green-500'}`}
                style={{ width: `${(testResults.passedTests / testResults.totalTests) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">
              {Math.round((testResults.passedTests / testResults.totalTests) * 100)}%
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {testResults.passedTests} passed
              </Badge>
            </div>
            {testResults.failedTests > 0 && (
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {testResults.failedTests} failed
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
      
      {testResults && testResults.failedTests > 0 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center w-full justify-between">
              <span>View Failed Tests ({testResults.failedTests})</span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <ScrollArea className="h-[300px] rounded-md border p-2">
              {testResults.testCases.map((testCase: any, i: number) => {
                const failedResults = testCase.results.filter((r: any) => !r.passed);
                if (failedResults.length === 0) return null;
                
                return (
                  <div key={i} className="mb-4">
                    <h3 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-amber-500" />
                      {testCase.testName} ({failedResults.length} issues)
                    </h3>
                    <ul className="pl-5 text-sm space-y-1">
                      {failedResults.slice(0, 10).map((result: any, j: number) => (
                        <li key={j} className="text-gray-700 list-disc">
                          {result.message}
                        </li>
                      ))}
                      {failedResults.length > 10 && (
                        <li className="text-gray-500 italic">
                          ...and {failedResults.length - 10} more issues
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {testResults && testResults.failedTests === 0 && (
        <div className="flex items-center gap-2 text-green-600 p-2 rounded-md bg-green-50">
          <CheckCircle className="h-5 w-5" />
          <span>All translation tests passed successfully!</span>
        </div>
      )}
    </div>
  );
};

export default TranslationTestStatus;
