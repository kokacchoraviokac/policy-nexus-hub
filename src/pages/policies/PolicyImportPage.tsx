
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronsLeft, Import, FileText, Check, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePolicyImport } from '@/hooks/usePolicyImport';
import PageHeader from '@/components/layout/PageHeader';
import PolicyImportReview from '@/components/policies/import/PolicyImportReview';
import PolicyImportInstructions from '@/components/policies/import/PolicyImportInstructions';

const PolicyImportPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState('upload');
  
  const { 
    importedPolicies, 
    validationErrors,
    handleFileSelect,
    handleFileDrop,
    savePolicies,
    clearImportData,
    isImporting,
    isValidating,
    importSuccess,
    invalidPolicies
  } = usePolicyImport();
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: handleFileDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
      'text/plain': ['.csv', '.txt'],
    },
    maxFiles: 1
  });
  
  const goBack = () => {
    navigate('/policies');
  };
  
  const handleSavePolicies = async () => {
    const success = await savePolicies!();
    if (success) {
      setTab('complete');
    }
  };
  
  const startNewImport = () => {
    clearImportData!();
    setTab('upload');
  };
  
  return (
    <div>
      <PageHeader 
        title={t('importPolicies')} 
        description={t('importPoliciesDescription')}
        action={
          <Button variant="outline" onClick={goBack}>
            <ChevronsLeft className="mr-2 h-4 w-4" />
            {t('backToPolicies')}
          </Button>
        }
      />
      
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">{t('upload')}</TabsTrigger>
          <TabsTrigger 
            value="review" 
            disabled={importedPolicies.length === 0}
          >
            {t('review')}
          </TabsTrigger>
          <TabsTrigger 
            value="complete" 
            disabled={!importSuccess}
          >
            {t('complete')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>{t('uploadPolicyCsv')}</CardTitle>
              <CardDescription>
                {t('dropFileOrClickToUpload')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-md p-10 text-center transition-colors ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4">
                  <FileText size={48} className="text-muted-foreground" />
                  {isDragActive ? (
                    <p>{t('dropTheFilesHere')}</p>
                  ) : (
                    <p>
                      {t('dragAndDropCsvOrClick')}
                    </p>
                  )}
                  <Button variant="outline">
                    {t('selectFile')}
                  </Button>
                </div>
              </div>
              
              <PolicyImportInstructions className="mt-6" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="review">
          <PolicyImportReview 
            policies={importedPolicies}
            errors={validationErrors}
            invalidPolicies={invalidPolicies || []}
            onSubmit={handleSavePolicies}
            isSubmitting={isImporting}
          />
        </TabsContent>
        
        <TabsContent value="complete">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                {t('importComplete')}
              </CardTitle>
              <CardDescription>
                {t('policiesImportedSuccessfully')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between py-2 border-b">
                  <div>{t('successfullyImported')}</div>
                  <div className="font-semibold">{importedPolicies.length - (invalidPolicies?.length || 0)}</div>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <div className="flex items-center gap-1">
                    <X className="h-4 w-4 text-destructive" />
                    {t('failedToImport')}
                  </div>
                  <div className="font-semibold">{invalidPolicies?.length || 0}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button onClick={goBack}>
                {t('viewPolicies')}
              </Button>
              <Button variant="outline" onClick={startNewImport}>
                <Import className="mr-2 h-4 w-4" />
                {t('importMore')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PolicyImportPage;
